import { NextRequest, NextResponse } from "next/server";
import { devVerifyEmail, AuthError } from "@/lib/auth/dev-auth";
import { isDevAuth } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  if (!isDevAuth()) {
    // Supabase handles verification via its own redirect link; nothing to do here.
    return NextResponse.json({ ok: true });
  }
  const { token } = await req.json();
  try {
    await devVerifyEmail(token);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof AuthError ? err.message : "Verification failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
