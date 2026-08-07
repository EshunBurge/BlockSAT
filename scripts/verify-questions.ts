import fs from "fs";
import path from "path";

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "prisma", "seed-data", "questions.json"), "utf-8"));

let errors = 0;
for (const q of data) {
  const choices = [q.choiceA, q.choiceB, q.choiceC, q.choiceD];
  const unique = new Set(choices);
  if (unique.size !== 4) {
    console.log("DUPLICATE CHOICES:", q.prompt, choices);
    errors++;
  }
  if (choices.some((c: any) => c === undefined || c === null || c === "")) {
    console.log("EMPTY CHOICE:", q.prompt, choices);
    errors++;
  }
  if (!["A", "B", "C", "D"].includes(q.correct)) {
    console.log("BAD CORRECT LETTER:", q.prompt, q.correct);
    errors++;
  }
  if (!q.explanation || q.explanation.length < 5) {
    console.log("MISSING EXPLANATION:", q.prompt);
    errors++;
  }
}
console.log(`Checked ${data.length} questions, ${errors} structural issues found.`);
