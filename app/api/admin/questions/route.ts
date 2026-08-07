import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma, Subject, ReadingTopic, MathTopic, Difficulty } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

const schema = z.object({
  subject: z.enum(["READING", "MATH"]),
  readingTopic: z.string().nullable().optional(),
  mathTopic: z.string().nullable().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  prompt: z.string().min(3),
  passage: z.string().nullable().optional(),
  choiceA: z.string().min(1),
  choiceB: z.string().min(1),
  choiceC: z.string().min(1),
  choiceD: z.string().min(1),
  correct: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().min(1),
  tags: z.string().nullable().optional(),
});

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(100, Number(searchParams.get("pageSize") || 25));
  const search = searchParams.get("search") || undefined;
  const subject = searchParams.get("subject") || undefined;

  const where: Prisma.QuestionWhereInput = {};
  if (subject === "READING" || subject === "MATH") where.subject = subject;
  if (search) where.prompt = { contains: search };

  const [total, questions] = await Promise.all([
    prisma.question.count({ where }),
    prisma.question.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({ questions, total, page, pageSize });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const data: Prisma.QuestionCreateInput = {
    ...parsed.data,
    subject: parsed.data.subject as Subject,
    readingTopic: (parsed.data.readingTopic as ReadingTopic | null) ?? null,
    mathTopic: (parsed.data.mathTopic as MathTopic | null) ?? null,
    difficulty: parsed.data.difficulty as Difficulty,
    source: "admin",
  };
  const question = await prisma.question.create({ data });
  return NextResponse.json({ question });
}
