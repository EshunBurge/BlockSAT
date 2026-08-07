"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileDTO } from "@/types";

async function fetchProfile(): Promise<ProfileDTO | null> {
  const res = await fetch("/api/auth/me");
  const data = await res.json();
  return data.profile;
}

export function useProfile() {
  return useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<ProfileDTO>) => {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      return data.profile as ProfileDTO;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile"], profile);
    },
  });
}
