import { ChallengeMetric } from "@prisma/client";

export interface DailyChallengeTemplate {
  metric: ChallengeMetric;
  title: string;
  description: (target: number) => string;
  targetOptions: number[];
  xpReward: number;
}

export const DAILY_CHALLENGE_TEMPLATES: DailyChallengeTemplate[] = [
  {
    metric: "QUESTIONS_ANSWERED",
    title: "Study Session",
    description: (t) => `Answer ${t} SAT-style questions today.`,
    targetOptions: [15, 25, 40],
    xpReward: 150,
  },
  {
    metric: "CORRECT_STREAK",
    title: "On a Roll",
    description: (t) => `Get ${t} correct answers in a row.`,
    targetOptions: [5, 10, 15],
    xpReward: 200,
  },
  {
    metric: "SCORE_REACHED",
    title: "Score Attack",
    description: (t) => `Reach ${t.toLocaleString()} points in a single game.`,
    targetOptions: [3000, 5000, 8000],
    xpReward: 175,
  },
  {
    metric: "ROWS_CLEARED",
    title: "Line Clearer",
    description: (t) => `Clear ${t} rows or columns today.`,
    targetOptions: [10, 20, 30],
    xpReward: 150,
  },
  {
    metric: "GAMES_FINISHED",
    title: "Dedicated Player",
    description: (t) => `Finish ${t} games today.`,
    targetOptions: [2, 3, 5],
    xpReward: 175,
  },
  {
    metric: "READING_ANSWERED",
    title: "Reading Focus",
    description: (t) => `Answer ${t} Reading questions.`,
    targetOptions: [10, 20, 30],
    xpReward: 150,
  },
  {
    metric: "MATH_ANSWERED",
    title: "Math Focus",
    description: (t) => `Answer ${t} Math questions.`,
    targetOptions: [10, 20, 30],
    xpReward: 150,
  },
];

/** Deterministically picks 3 daily challenges for a given date string (YYYY-MM-DD) so every player sees the same set each day. */
export function pickDailyChallenges(dateSeed: string) {
  let seed = 0;
  for (let i = 0; i < dateSeed.length; i++) seed = (seed * 31 + dateSeed.charCodeAt(i)) % 100000;

  function next() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const shuffled = [...DAILY_CHALLENGE_TEMPLATES].sort(() => next() - 0.5);
  return shuffled.slice(0, 3).map((tpl) => {
    const target = tpl.targetOptions[Math.floor(next() * tpl.targetOptions.length)];
    return {
      metric: tpl.metric,
      title: tpl.title,
      description: tpl.description(target),
      target,
      xpReward: tpl.xpReward,
    };
  });
}
