import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface SeedQuestion {
  subject: "READING" | "MATH";
  readingTopic?: string;
  mathTopic?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  prompt: string;
  passage?: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  correct: string;
  explanation: string;
  tags?: string;
}

const ACHIEVEMENTS = [
  { slug: "first-game", name: "First Game", description: "Complete your very first BlockSAT game.", icon: "gamepad-2", xpReward: 50, criteria: JSON.stringify({ gamesPlayed: 1 }) },
  { slug: "sat-scholar", name: "SAT Scholar", description: "Answer 250 SAT-style questions.", icon: "graduation-cap", xpReward: 300, criteria: JSON.stringify({ questionsAnswered: 250 }) },
  { slug: "reading-master", name: "Reading Master", description: "Reach 90% accuracy on Reading (min 50 answered).", icon: "book-open", xpReward: 250, criteria: JSON.stringify({ readingAccuracy: 0.9, minReadingAnswered: 50 }) },
  { slug: "math-genius", name: "Math Genius", description: "Reach 90% accuracy on Math (min 50 answered).", icon: "sigma", xpReward: 250, criteria: JSON.stringify({ mathAccuracy: 0.9, minMathAnswered: 50 }) },
  { slug: "combo-king", name: "Combo King", description: "Chain a combo of 5+ line clears in a row.", icon: "flame", xpReward: 200, criteria: JSON.stringify({ longestCombo: 5 }) },
  { slug: "perfect-accuracy", name: "Perfect Accuracy", description: "Answer 20 questions correctly in a row in one session.", icon: "target", xpReward: 300, criteria: JSON.stringify({ sessionCorrectStreak: 20 }) },
  { slug: "hundred-correct", name: "100 Correct Answers", description: "Answer 100 questions correctly.", icon: "check-circle-2", xpReward: 150, criteria: JSON.stringify({ correctAnswers: 100 }) },
  { slug: "thousand-lines", name: "1000 Lines Cleared", description: "Clear 1,000 total rows and columns.", icon: "layout-grid", xpReward: 400, criteria: JSON.stringify({ totalLinesCleared: 1000 }) },
  { slug: "seven-day-streak", name: "Seven-Day Streak", description: "Play seven days in a row.", icon: "calendar-check", xpReward: 350, criteria: JSON.stringify({ streak: 7 }) },
  { slug: "high-scorer", name: "High Scorer", description: "Reach a single-game score of 10,000.", icon: "trophy", xpReward: 300, criteria: JSON.stringify({ highestScore: 10000 }) },
];

async function main() {
  console.log("Seeding achievements...");
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({ where: { slug: a.slug }, update: a, create: a });
  }

  console.log("Seeding questions (this may take a minute for ~9,500 rows)...");
  const dataPath = path.join(__dirname, "seed-data", "questions.json");
  const questions: SeedQuestion[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const existingCount = await prisma.question.count();
  if (existingCount > 0) {
    console.log(`Question table already has ${existingCount} rows; skipping bulk insert (delete rows first to reseed).`);
  } else {
    const chunkSize = 500;
    for (let i = 0; i < questions.length; i += chunkSize) {
      const chunk = questions.slice(i, i + chunkSize).map((q) => ({
        subject: q.subject as any,
        readingTopic: (q.readingTopic as any) ?? null,
        mathTopic: (q.mathTopic as any) ?? null,
        difficulty: q.difficulty as any,
        prompt: q.prompt,
        passage: q.passage ?? null,
        choiceA: q.choiceA,
        choiceB: q.choiceB,
        choiceC: q.choiceC,
        choiceD: q.choiceD,
        correct: q.correct,
        explanation: q.explanation,
        tags: q.tags ?? null,
        source: "generated",
      }));
      await prisma.question.createMany({ data: chunk });
      process.stdout.write(`\r  inserted ${Math.min(i + chunkSize, questions.length)} / ${questions.length}`);
    }
    console.log("\nDone seeding questions.");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
