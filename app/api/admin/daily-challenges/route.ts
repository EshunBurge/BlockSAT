import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";
import { ensureTodayChallenges } from "@/lib/game/dailyProgress";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await ensureTodayChallenges();

  const challenges = await prisma.dailyChallenge.findMany({
    orderBy: { date: "desc" },
    take: 30,
    include: { _count: { select: { progress: true } } },
  });

  const completedCounts = await prisma.userDailyChallenge.groupBy({
    by: ["dailyChallengeId"],
    where: { completed: true },
    _count: true,
  });
  const completedMap = new Map(completedCounts.map((c) => [c.dailyChallengeId, c._count]));

  return NextResponse.json({
    challenges: challenges.map((c) => ({
      id: c.id,
      date: c.date,
      title: c.title,
      description: c.description,
      metric: c.metric,
      target: c.target,
      xpReward: c.xpReward,
      participants: c._count.progress,
      completions: completedMap.get(c.id) ?? 0,
    })),
  });
}
