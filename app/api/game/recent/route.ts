import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const games = await prisma.gameSession.findMany({
    where: { profileId: session.userId, endedAt: { not: null } },
    orderBy: { startedAt: "desc" },
    take: 5,
  });

  return NextResponse.json({ games });
}
