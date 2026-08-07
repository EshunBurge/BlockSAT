"use client";

import { useQuery } from "@tanstack/react-query";

export interface DailyChallengeProgress {
  id: string;
  title: string;
  description: string;
  metric: string;
  target: number;
  xpReward: number;
  progress: number;
  completed: boolean;
}

export function useDailyChallenges() {
  return useQuery({
    queryKey: ["daily-challenges"],
    queryFn: async (): Promise<DailyChallengeProgress[]> => {
      const res = await fetch("/api/daily-challenge");
      const data = await res.json();
      return data.challenges;
    },
  });
}
