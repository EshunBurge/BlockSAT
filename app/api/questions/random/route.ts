import { NextRequest, NextResponse } from "next/server";
import { Prisma, Difficulty } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const subjectParam = searchParams.get("subject"); // READING | MATH | null (either)
  const difficultyParam = searchParams.get("difficulty"); // EASY | MEDIUM | HARD | null

  const where: Prisma.QuestionWhereInput = {};
  if (subjectParam === "READING" || subjectParam === "MATH") where.subject = subjectParam;
  if (difficultyParam) where.difficulty = difficultyParam as Difficulty;

  const count = await prisma.question.count({ where });
  if (count === 0) {
    return NextResponse.json({ error: "No questions available for these filters." }, { status: 404 });
  }
  const skip = Math.floor(Math.random() * count);
  const [question] = await prisma.question.findMany({ where, skip, take: 1 });

  // Never leak the correct answer / explanation to the client until answered.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { correct, explanation, ...safe } = question;
  return NextResponse.json({ question: safe });
}
