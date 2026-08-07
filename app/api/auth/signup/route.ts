import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isDevAuth, createDevSession } from "@/lib/auth/session";
import { devSignUp, AuthError } from "@/lib/auth/dev-auth";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/profile";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, password } = parsed.data;

  try {
    if (isDevAuth()) {
      const { userId, verifyToken } = await devSignUp(email, password);
      await createDevSession(userId, email);
      return NextResponse.json({
        ok: true,
        devVerifyLink: `/verify-email?token=${verifyToken}`,
      });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${req.nextUrl.origin}/verify-email` },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (data.user) await ensureProfile(data.user.id, email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof AuthError ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
