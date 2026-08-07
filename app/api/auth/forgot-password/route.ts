import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isDevAuth } from "@/lib/auth/session";
import { devRequestPasswordReset } from "@/lib/auth/dev-auth";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  const { email } = parsed.data;

  if (isDevAuth()) {
    const token = await devRequestPasswordReset(email);
    // Always return ok (don't leak account existence); include dev link for local testing.
    return NextResponse.json({
      ok: true,
      devResetLink: token ? `/reset-password?token=${token}` : undefined,
    });
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${req.nextUrl.origin}/reset-password`,
  });
  return NextResponse.json({ ok: true });
}
