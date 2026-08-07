import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { grantXp } from "@/lib/game/xp";
import { checkAchievements } from "@/lib/game/xp";
import { XP_REWARDS } from "@/lib/game/leveling";
import { updateDailyProgress } from "@/lib/game/dailyProgress";

const schema = z.object({
  score: z.number().int().nonnegative(),
  linesCleared: z.number().int().nonnegative(),
  longestCombo: z.number().int().nonnegative(),
  questionsCorrect: z.number().int().nonnegative(),
  questionsTotal: z.number().int().nonnegative(),
  durationMs: z.number().int().nonnegative(),
  sessionCorrectStreak: z.number().int().nonnegative().optional(),
});

function isSameUtcDay(a: Date, b: Date) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}

function isYesterday(a: Date, now: Date) {
  const yesterday = new Date(now);
  yesterday.setUTCDate(now.getUTCDate() - 1);
  return isSameUtcDay(a, yesterday);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { score, linesCleared, longestCombo, questionsCorrect, questionsTotal, durationMs, sessionCorrectStreak } = parsed.data;

  const gameSession = await prisma.gameSession.findUnique({ where: { id } });
  if (!gameSession || gameSession.profileId !== session.userId) {
    return NextResponse.json({ error: "Game session not found." }, { status: 404 });
  }

  const xpEarned =
    XP_REWARDS.gameCompleted + linesCleared * XP_REWARDS.lineClear + longestCombo * XP_REWARDS.comboBonus;

  await prisma.gameSession.update({
    where: { id },
    data: { score, linesCleared, longestCombo, questionsCorrect, questionsTotal, xpEarned, durationMs, endedAt: new Date() },
  });

  const profile = await prisma.profile.findUniqueOrThrow({ where: { id: session.userId } });
  const now = new Date();
  let streak = profile.streak;
  if (!profile.lastPlayedAt) {
    streak = 1;
  } else if (isSameUtcDay(profile.lastPlayedAt, now)) {
    streak = profile.streak; // already played today
  } else if (isYesterday(profile.lastPlayedAt, now)) {
    streak = profile.streak + 1;
  } else {
    streak = 1;
  }

  await prisma.profile.update({
    where: { id: session.userId },
    data: {
      highestScore: Math.max(profile.highestScore, score),
      totalScore: profile.totalScore + score,
      gamesPlayed: profile.gamesPlayed + 1,
      totalLinesCleared: profile.totalLinesCleared + linesCleared,
      longestCombo: Math.max(profile.longestCombo, longestCombo),
      streak,
      longestStreak: Math.max(profile.longestStreak, streak),
      lastPlayedAt: now,
    },
  });

  await updateDailyProgress(session.userId, "SCORE_REACHED", score, "max");
  await updateDailyProgress(session.userId, "ROWS_CLEARED", linesCleared, "increment");
  await updateDailyProgress(session.userId, "GAMES_FINISHED", 1, "increment");
  if (sessionCorrectStreak) {
    await updateDailyProgress(session.userId, "CORRECT_STREAK", sessionCorrectStreak, "max");
  }

  const xpResult = await grantXp(session.userId, xpEarned);
  const newAchievements = await checkAchievements(session.userId, { sessionCorrectStreak });

  return NextResponse.json({
    xpEarned,
    leveledUp: xpResult.leveledUp,
    newLevel: xpResult.newLevel,
    newUnlocks: xpResult.newUnlocks,
    newAchievements,
    streak,
  });
}
