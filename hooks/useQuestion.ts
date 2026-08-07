"use client";

import { useMutation } from "@tanstack/react-query";
import { QuestionDTO, Subject, Difficulty } from "@/types";

export function useFetchQuestion() {
  return useMutation({
    mutationFn: async (filters: { subject?: Subject; difficulty?: Difficulty }) => {
      const params = new URLSearchParams();
      if (filters.subject) params.set("subject", filters.subject);
      if (filters.difficulty) params.set("difficulty", filters.difficulty);
      const res = await fetch(`/api/questions/random?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load a question.");
      return data.question as Omit<QuestionDTO, "correct" | "explanation">;
    },
  });
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  xpEarned: number;
  leveledUp: boolean;
  newLevel: number;
  newUnlocks: { type: string; name: string; slug: string }[];
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: async (vars: { questionId: string; selected: "A" | "B" | "C" | "D"; responseMs: number }) => {
      const res = await fetch(`/api/questions/${vars.questionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected: vars.selected, responseMs: vars.responseMs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit answer.");
      return data as AnswerResult;
    },
  });
}
