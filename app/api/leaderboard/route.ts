import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const METRIC_FIELD: Record<string, "highestScore" | "xp" | "longestStreak" | "correctAnswers"> = {
  score: "highestScore",
  xp: "xp",
  streak: "longestStreak",
  accuracy: "correctAnswers", // special-cased below
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const metric = searchParams.get("metric") || "score";
  const period = searchParams.get("period") || "all"; // weekly | monthly | all

  // NOTE: period filtering for weekly/monthly leaderboards uses each
  // profile's most recent GameSession within the window as a recency proxy,
  // since we don't store point-in-time historical snapshots of stats.
  let sinceDate: Date | null = null;
  if (period === "weekly") sinceDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  if (period === "monthly") sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  let profileIds: string[] | null = null;
  if (sinceDate) {
    const recent = await prisma.gameSession.findMany({
      where: { startedAt: { gte: sinceDate } },
      select: { profileId: true },
      distinct: ["profileId"],
    });
    profileIds = recent.map((r) => r.profileId);
  }

  if (metric === "accuracy") {
    const profiles = await prisma.profile.findMany({
      where: {
        ...(profileIds ? { id: { in: profileIds } } : {}),
        questionsAnswered: { gte: 20 },
      },
      take: 200,
    });
    const ranked = profiles
      .map((p) => ({
        id: p.id,
        username: p.username,
        avatarUrl: p.avatarUrl,
        value: p.questionsAnswered > 0 ? Math.round((p.correctAnswers / p.questionsAnswered) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50);
    return NextResponse.json({ entries: ranked, metric, period });
  }

  const field = METRIC_FIELD[metric] || "highestScore";
  const profiles = await prisma.profile.findMany({
    where: profileIds ? { id: { in: profileIds } } : undefined,
    orderBy: { [field]: "desc" },
    take: 50,
  });

  const entries = profiles.map((p) => ({
    id: p.id,
    username: p.username,
    avatarUrl: p.avatarUrl,
    value: p[field],
  }));

  return NextResponse.json({ entries, metric, period });
}
