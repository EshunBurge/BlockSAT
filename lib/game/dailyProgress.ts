import { prisma } from "@/lib/db";
import { ChallengeMetric } from "@prisma/client";
import { pickDailyChallenges } from "@/lib/game/dailyChallenges";
import { grantXp } from "@/lib/game/xp";

function todayDate(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function dateSeed(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Ensures today's 3 daily challenges exist, creating them deterministically if missing. */
export async function ensureTodayChallenges() {
  const date = todayDate();
  const seed = dateSeed(date);
  const existing = await prisma.dailyChallenge.findMany({ where: { date } });
  if (existing.length > 0) return existing;

  const picks = pickDailyChallenges(seed);
  const created = [];
  for (const p of picks) {
    const c = await prisma.dailyChallenge.upsert({
      where: { date_metric: { date, metric: p.metric as ChallengeMetric } },
      update: {},
      create: {
        date,
        metric: p.metric as ChallengeMetric,
        title: p.title,
        description: p.description,
        target: p.target,
        xpReward: p.xpReward,
      },
    });
    created.push(c);
  }
  return created;
}

/**
 * Updates progress for every active daily challenge matching `metric`.
 * `mode: "increment"` adds delta to progress; `mode: "max"` sets progress to
 * the larger of the current value and delta (for metrics like best score).
 */
export async function updateDailyProgress(
  profileId: string,
  metric: ChallengeMetric,
  delta: number,
  mode: "increment" | "max" = "increment"
) {
  const challenges = await ensureTodayChallenges();
  const matching = challenges.filter((c) => c.metric === metric);

  for (const challenge of matching) {
    const existing = await prisma.userDailyChallenge.findUnique({
      where: { profileId_dailyChallengeId: { profileId, dailyChallengeId: challenge.id } },
    });
    if (existing?.completed) continue;

    const newProgress = mode === "max" ? Math.max(existing?.progress ?? 0, delta) : (existing?.progress ?? 0) + delta;
    const completed = newProgress >= challenge.target;

    await prisma.userDailyChallenge.upsert({
      where: { profileId_dailyChallengeId: { profileId, dailyChallengeId: challenge.id } },
      update: { progress: newProgress, completed, completedAt: completed ? new Date() : undefined },
      create: {
        profileId,
        dailyChallengeId: challenge.id,
        progress: newProgress,
        completed,
        completedAt: completed ? new Date() : undefined,
      },
    });

    if (completed && !existing?.completed) {
      await grantXp(profileId, challenge.xpReward);
    }
  }
}

export async function getTodayProgress(profileId: string) {
  const challenges = await ensureTodayChallenges();
  const progress = await prisma.userDailyChallenge.findMany({
    where: { profileId, dailyChallengeId: { in: challenges.map((c) => c.id) } },
  });
  const byId = new Map(progress.map((p) => [p.dailyChallengeId, p]));

  return challenges.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    metric: c.metric,
    target: c.target,
    xpReward: c.xpReward,
    progress: byId.get(c.id)?.progress ?? 0,
    completed: byId.get(c.id)?.completed ?? false,
  }));
}
