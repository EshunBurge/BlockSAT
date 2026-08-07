import { ProfileDTO } from "@/types";

export interface AchievementDef {
  slug: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  /** Evaluated client/server-side against a profile snapshot (+ optional session stats). */
  check: (p: ProfileDTO, extra?: { sessionCorrectStreak?: number; sessionAccuracy?: number }) => boolean;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    slug: "first-game",
    name: "First Game",
    description: "Complete your very first BlockSAT game.",
    icon: "gamepad-2",
    xpReward: 50,
    check: (p) => p.gamesPlayed >= 1,
  },
  {
    slug: "sat-scholar",
    name: "SAT Scholar",
    description: "Answer 250 SAT-style questions.",
    icon: "graduation-cap",
    xpReward: 300,
    check: (p) => p.questionsAnswered >= 250,
  },
  {
    slug: "reading-master",
    name: "Reading Master",
    description: "Reach 90% accuracy on Reading with at least 50 answered.",
    icon: "book-open",
    xpReward: 250,
    check: (p) => p.readingAnswered >= 50 && p.readingCorrect / Math.max(1, p.readingAnswered) >= 0.9,
  },
  {
    slug: "math-genius",
    name: "Math Genius",
    description: "Reach 90% accuracy on Math with at least 50 answered.",
    icon: "sigma",
    xpReward: 250,
    check: (p) => p.mathAnswered >= 50 && p.mathCorrect / Math.max(1, p.mathAnswered) >= 0.9,
  },
  {
    slug: "combo-king",
    name: "Combo King",
    description: "Chain a combo of 5 or more line clears in a row.",
    icon: "flame",
    xpReward: 200,
    check: (p) => p.longestCombo >= 5,
  },
  {
    slug: "perfect-accuracy",
    name: "Perfect Accuracy",
    description: "Answer 20 questions in a row correctly in one session.",
    icon: "target",
    xpReward: 300,
    check: (_p, extra) => (extra?.sessionCorrectStreak ?? 0) >= 20,
  },
  {
    slug: "hundred-correct",
    name: "100 Correct Answers",
    description: "Answer 100 questions correctly.",
    icon: "check-circle-2",
    xpReward: 150,
    check: (p) => p.correctAnswers >= 100,
  },
  {
    slug: "thousand-lines",
    name: "1000 Lines Cleared",
    description: "Clear 1,000 total rows and columns.",
    icon: "layout-grid",
    xpReward: 400,
    check: (p) => p.totalLinesCleared >= 1000,
  },
  {
    slug: "seven-day-streak",
    name: "Seven-Day Streak",
    description: "Play seven days in a row.",
    icon: "calendar-check",
    xpReward: 350,
    check: (p) => p.streak >= 7,
  },
  {
    slug: "high-scorer",
    name: "High Scorer",
    description: "Reach a single-game score of 10,000.",
    icon: "trophy",
    xpReward: 300,
    check: (p) => p.highestScore >= 10000,
  },
];
