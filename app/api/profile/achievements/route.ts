import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const unlocked = await prisma.userAchievement.findMany({
    where: { profileId: session.userId },
    include: { achievement: { select: { slug: true } } },
  });

  return NextResponse.json({ slugs: unlocked.map((u) => u.achievement.slug) });
}
