import { NextResponse } from "next/server";
import { isDevAuth, clearDevSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  if (isDevAuth()) {
    await clearDevSession();
  } else {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.json({ ok: true });
}
