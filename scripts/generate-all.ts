import fs from "fs";
import path from "path";
import { MATH_GENERATORS } from "./gen-math";
import { generateReadingQuestions } from "./gen-reading";
import { GeneratedQuestion, ChoiceCollisionError } from "./gen-utils";

const MATH_TARGET = Number(process.env.MATH_TARGET || 9200);
const MAX_ATTEMPTS_MULTIPLIER = 6;

function signature(q: GeneratedQuestion): string {
  return `${q.prompt}|${q.choiceA}|${q.choiceB}|${q.choiceC}|${q.choiceD}`;
}

function generateMath(target: number): GeneratedQuestion[] {
  const seen = new Set<string>();
  const results: GeneratedQuestion[] = [];
  let attempts = 0;
  const maxAttempts = target * MAX_ATTEMPTS_MULTIPLIER;

  let collisions = 0;
  while (results.length < target && attempts < maxAttempts) {
    for (const gen of MATH_GENERATORS) {
      if (results.length >= target) break;
      attempts++;
      let q: GeneratedQuestion;
      try {
        q = gen();
      } catch (err) {
        if (err instanceof ChoiceCollisionError) {
          collisions++;
          continue; // skip this attempt, try the next generator
        }
        throw err;
      }
      const sig = signature(q);
      if (seen.has(sig)) continue;
      seen.add(sig);
      results.push(q);
    }
  }
  if (collisions > 0) console.log(`  (skipped ${collisions} attempts with colliding distractors)`);
  return results;
}

function main() {
  console.log(`Generating math questions (target ${MATH_TARGET})...`);
  const math = generateMath(MATH_TARGET);
  console.log(`  -> generated ${math.length} unique math questions`);

  console.log("Generating reading questions...");
  const reading = generateReadingQuestions();
  console.log(`  -> generated ${reading.length} unique reading questions`);

  const all = [...math, ...reading];
  console.log(`Total questions: ${all.length}`);

  const outDir = path.join(__dirname, "..", "prisma", "seed-data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "questions.json");
  fs.writeFileSync(outPath, JSON.stringify(all));
  console.log(`Wrote ${all.length} questions to ${outPath}`);

  // Small summary breakdown for the README / admin dashboard seed.
  const bySubject: Record<string, number> = {};
  const byTopic: Record<string, number> = {};
  for (const q of all) {
    bySubject[q.subject] = (bySubject[q.subject] || 0) + 1;
    const topic = q.mathTopic || q.readingTopic || "unknown";
    byTopic[topic] = (byTopic[topic] || 0) + 1;
  }
  console.log("By subject:", bySubject);
  console.log("By topic:", byTopic);
}

main();
