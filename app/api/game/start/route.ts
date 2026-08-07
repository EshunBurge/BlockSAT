import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const gameSession = await prisma.gameSession.create({ data: { profileId: session.userId } });
  return NextResponse.json({ sessionId: gameSession.id });
}
