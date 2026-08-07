"use client";

import { useQuery } from "@tanstack/react-query";

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatarUrl: string | null;
  value: number;
}

export function useLeaderboard(metric: string, period: string) {
  return useQuery({
    queryKey: ["leaderboard", metric, period],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const res = await fetch(`/api/leaderboard?metric=${metric}&period=${period}`);
      const data = await res.json();
      return data.entries;
    },
  });
}
