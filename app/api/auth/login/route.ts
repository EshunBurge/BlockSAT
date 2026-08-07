import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isDevAuth, createDevSession } from "@/lib/auth/session";
import { devLogIn, AuthError } from "@/lib/auth/dev-auth";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/profile";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email and password." }, { status: 400 });
  }
  const { email, password } = parsed.data;

  try {
    if (isDevAuth()) {
      const user = await devLogIn(email, password);
      await createDevSession(user.id, email);
      return NextResponse.json({ ok: true });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (data.user) await ensureProfile(data.user.id, email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof AuthError ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
