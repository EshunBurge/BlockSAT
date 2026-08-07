import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { XP_REWARDS } from "@/lib/game/leveling";
import { grantXp } from "@/lib/game/xp";
import { updateDailyProgress } from "@/lib/game/dailyProgress";

const schema = z.object({
  selected: z.enum(["A", "B", "C", "D"]),
  responseMs: z.number().int().nonnegative().max(600000),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { selected, responseMs } = parsed.data;

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) return NextResponse.json({ error: "Question not found." }, { status: 404 });

  const correct = selected === question.correct;

  const profile = await prisma.profile.findUniqueOrThrow({ where: { id: session.userId } });
  const questionsAnswered = profile.questionsAnswered + 1;
  const correctAnswers = profile.correctAnswers + (correct ? 1 : 0);
  const avgResponseMs = Math.round((profile.avgResponseMs * profile.questionsAnswered + responseMs) / questionsAnswered);

  const data: Prisma.ProfileUpdateInput = { questionsAnswered, correctAnswers, avgResponseMs };
  if (question.subject === "READING") {
    data.readingAnswered = profile.readingAnswered + 1;
    data.readingCorrect = profile.readingCorrect + (correct ? 1 : 0);
  } else {
    data.mathAnswered = profile.mathAnswered + 1;
    data.mathCorrect = profile.mathCorrect + (correct ? 1 : 0);
  }

  await prisma.profile.update({ where: { id: session.userId }, data });
  await prisma.questionResponse.create({
    data: { profileId: session.userId, questionId: id, correct, responseMs },
  });

  await updateDailyProgress(session.userId, "QUESTIONS_ANSWERED", 1, "increment");
  await updateDailyProgress(session.userId, question.subject === "READING" ? "READING_ANSWERED" : "MATH_ANSWERED", 1, "increment");

  let xpResult = null;
  if (correct) {
    xpResult = await grantXp(session.userId, XP_REWARDS.correctAnswer);
  } else {
    xpResult = await grantXp(session.userId, XP_REWARDS.incorrectAnswerConsolation);
  }

  return NextResponse.json({
    correct,
    correctAnswer: question.correct,
    explanation: question.explanation,
    xpEarned: correct ? XP_REWARDS.correctAnswer : XP_REWARDS.incorrectAnswerConsolation,
    leveledUp: xpResult.leveledUp,
    newLevel: xpResult.newLevel,
    newUnlocks: xpResult.newUnlocks,
  });
}
