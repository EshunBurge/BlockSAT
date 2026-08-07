import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isDevAuth } from "@/lib/auth/session";
import { devResetPassword, AuthError } from "@/lib/auth/dev-auth";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { token, password } = parsed.data;

  try {
    if (isDevAuth()) {
      await devResetPassword(token, password);
      return NextResponse.json({ ok: true });
    }
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof AuthError ? err.message : "Reset failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
