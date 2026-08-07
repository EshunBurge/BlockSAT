import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

const REQUIRED_COLUMNS = [
  "subject",
  "difficulty",
  "prompt",
  "choiceA",
  "choiceB",
  "choiceC",
  "choiceD",
  "correct",
  "explanation",
];

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No CSV file uploaded." }, { status: 400 });
  }

  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });

  if (parsed.errors.length > 0) {
    return NextResponse.json({ error: `CSV parse error: ${parsed.errors[0].message}` }, { status: 400 });
  }

  const rows = parsed.data;
  if (rows.length === 0) {
    return NextResponse.json({ error: "CSV file has no rows." }, { status: 400 });
  }

  const missingCols = REQUIRED_COLUMNS.filter((c) => !(c in rows[0]));
  if (missingCols.length > 0) {
    return NextResponse.json({ error: `Missing required column(s): ${missingCols.join(", ")}` }, { status: 400 });
  }

  const errors: string[] = [];
  const toCreate: Prisma.QuestionCreateManyInput[] = [];

  rows.forEach((row, i) => {
    const line = i + 2; // account for header row
    const subject = row.subject?.trim().toUpperCase();
    const difficulty = row.difficulty?.trim().toUpperCase();
    const correct = row.correct?.trim().toUpperCase();

    if (subject !== "READING" && subject !== "MATH") {
      errors.push(`Row ${line}: subject must be READING or MATH.`);
      return;
    }
    if (!["EASY", "MEDIUM", "HARD"].includes(difficulty)) {
      errors.push(`Row ${line}: difficulty must be EASY, MEDIUM, or HARD.`);
      return;
    }
    if (!["A", "B", "C", "D"].includes(correct)) {
      errors.push(`Row ${line}: correct must be A, B, C, or D.`);
      return;
    }
    if (!row.prompt || !row.choiceA || !row.choiceB || !row.choiceC || !row.choiceD || !row.explanation) {
      errors.push(`Row ${line}: missing a required field.`);
      return;
    }

    toCreate.push({
      subject,
      readingTopic: subject === "READING" ? (row.readingTopic?.trim().toUpperCase() as Prisma.QuestionCreateManyInput["readingTopic"]) || null : null,
      mathTopic: subject === "MATH" ? (row.mathTopic?.trim().toUpperCase() as Prisma.QuestionCreateManyInput["mathTopic"]) || null : null,
      difficulty: difficulty as Prisma.QuestionCreateManyInput["difficulty"],
      prompt: row.prompt,
      passage: row.passage || null,
      choiceA: row.choiceA,
      choiceB: row.choiceB,
      choiceC: row.choiceC,
      choiceD: row.choiceD,
      correct,
      explanation: row.explanation,
      tags: row.tags || null,
      source: "import",
    });
  });

  if (toCreate.length > 0) {
    await prisma.question.createMany({ data: toCreate });
  }

  return NextResponse.json({
    imported: toCreate.length,
    skipped: errors.length,
    errors: errors.slice(0, 50),
  });
}
