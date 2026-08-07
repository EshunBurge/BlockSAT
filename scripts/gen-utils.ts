// Shared helpers for the question generator. Plain Node/TS, no app imports,
// so this can run standalone via tsx.

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randFloat(min: number, max: number, decimals = 1): number {
  const v = Math.random() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(v * factor) / factor;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function fractionString(numerator: number, denominator: number): string {
  if (denominator < 0) {
    numerator = -numerator;
    denominator = -denominator;
  }
  const g = gcd(numerator, denominator);
  const n = numerator / g;
  const d = denominator / g;
  if (d === 1) return `${n}`;
  return `${n}/${d}`;
}

/** Generates a set of numeric distractors near a correct value, all distinct from it and each other. */
export function numericDistractors(correct: number, count = 3, spread = 5): string[] {
  const set = new Set<number>();
  set.add(correct);
  const out: number[] = [];
  let guard = 0;
  while (out.length < count && guard < 100) {
    guard++;
    const delta = randInt(-spread, spread) || (Math.random() > 0.5 ? 1 : -1);
    const candidate = correct + delta;
    if (!set.has(candidate)) {
      set.add(candidate);
      out.push(candidate);
    }
  }
  return out.map(String);
}

export interface GeneratedQuestion {
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
  correct: "A" | "B" | "C" | "D";
  explanation: string;
  tags?: string;
}

/** Builds the 4-choice / correct-letter fields from a correct answer + distractor list, shuffled. */
export class ChoiceCollisionError extends Error {}

export function buildChoices(correctAnswer: string, distractors: string[]): {
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  correct: "A" | "B" | "C" | "D";
} {
  // De-duplicate distractors against the correct answer and each other; a
  // template that can't produce 3 distinct distractors throws so the caller
  // can discard/retry rather than silently emitting a broken question.
  const uniqueDistractors: string[] = [];
  const seen = new Set([correctAnswer]);
  for (const d of distractors) {
    if (!seen.has(d)) {
      seen.add(d);
      uniqueDistractors.push(d);
    }
    if (uniqueDistractors.length === 3) break;
  }
  if (uniqueDistractors.length < 3) {
    throw new ChoiceCollisionError("Could not produce 3 distinct distractors");
  }

  const options = shuffle([correctAnswer, ...uniqueDistractors]);
  const letters = ["A", "B", "C", "D"] as const;
  const correctIndex = options.indexOf(correctAnswer);
  return {
    choiceA: options[0],
    choiceB: options[1],
    choiceC: options[2],
    choiceD: options[3],
    correct: letters[correctIndex],
  };
}
