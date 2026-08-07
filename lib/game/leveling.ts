/** XP required to go from level N to N+1 grows quadratically for a satisfying early-game / long-game curve. */
export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5));
}

export function levelFromXp(totalXp: number): { level: number; xpIntoLevel: number; xpForNext: number } {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level += 1;
  }
  return { level, xpIntoLevel: remaining, xpForNext: xpForLevel(level) };
}

export interface Unlock {
  level: number;
  type: "theme" | "skin" | "avatar";
  slug: string;
  name: string;
}

export const LEVEL_UNLOCKS: Unlock[] = [
  { level: 2, type: "theme", slug: "midnight", name: "Midnight Theme" },
  { level: 3, type: "skin", slug: "neon", name: "Neon Piece Skin" },
  { level: 4, type: "avatar", slug: "fox", name: "Fox Avatar" },
  { level: 5, type: "theme", slug: "sunset", name: "Sunset Theme" },
  { level: 6, type: "avatar", slug: "owl", name: "Owl Avatar" },
  { level: 7, type: "skin", slug: "crystal", name: "Crystal Piece Skin" },
  { level: 8, type: "theme", slug: "forest", name: "Forest Theme" },
  { level: 10, type: "avatar", slug: "astronaut", name: "Astronaut Avatar" },
  { level: 12, type: "skin", slug: "gold", name: "Gold Piece Skin" },
  { level: 15, type: "theme", slug: "aurora", name: "Aurora Theme" },
  { level: 18, type: "avatar", slug: "phoenix", name: "Phoenix Avatar" },
  { level: 20, type: "skin", slug: "diamond", name: "Diamond Piece Skin" },
  { level: 25, type: "theme", slug: "galaxy", name: "Galaxy Theme" },
];

export const XP_REWARDS = {
  correctAnswer: 25,
  incorrectAnswerConsolation: 5,
  lineClear: 15,
  comboBonus: 10,
  dailyChallenge: 150,
  gameCompleted: 20,
  streakDay: 10,
};
