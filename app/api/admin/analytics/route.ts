import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [
    totalUsers,
    totalQuestions,
    totalGames,
    totalResponses,
    questionsBySubject,
    questionsByDifficulty,
    topPlayers,
    recentGames,
  ] = await Promise.all([
    prisma.profile.count(),
    prisma.question.count(),
    prisma.gameSession.count({ where: { endedAt: { not: null } } }),
    prisma.questionResponse.count(),
    prisma.question.groupBy({ by: ["subject"], _count: true }),
    prisma.question.groupBy({ by: ["difficulty"], _count: true }),
    prisma.profile.findMany({ orderBy: { highestScore: "desc" }, take: 10, select: { username: true, highestScore: true, xp: true, level: true } }),
    prisma.gameSession.findMany({
      where: { endedAt: { not: null } },
      orderBy: { startedAt: "desc" },
      take: 10,
      include: { profile: { select: { username: true } } },
    }),
  ]);

  const correctResponses = await prisma.questionResponse.count({ where: { correct: true } });
  const overallAccuracy = totalResponses > 0 ? Math.round((correctResponses / totalResponses) * 1000) / 10 : 0;

  return NextResponse.json({
    totalUsers,
    totalQuestions,
    totalGames,
    totalResponses,
    overallAccuracy,
    questionsBySubject,
    questionsByDifficulty,
    topPlayers,
    recentGames: recentGames.map((g) => ({
      id: g.id,
      username: g.profile.username,
      score: g.score,
      linesCleared: g.linesCleared,
      startedAt: g.startedAt,
    })),
  });
}
