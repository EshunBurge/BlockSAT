"use client";

import { useQuery } from "@tanstack/react-query";

export interface RecentGame {
  id: string;
  score: number;
  linesCleared: number;
  longestCombo: number;
  questionsCorrect: number;
  questionsTotal: number;
  startedAt: string;
}

export function useRecentGames() {
  return useQuery({
    queryKey: ["recent-games"],
    queryFn: async (): Promise<RecentGame[]> => {
      const res = await fetch("/api/game/recent");
      const data = await res.json();
      return data.games;
    },
  });
}
