import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getTodayProgress } from "@/lib/game/dailyProgress";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const challenges = await getTodayProgress(session.userId);
  return NextResponse.json({ challenges });
}
