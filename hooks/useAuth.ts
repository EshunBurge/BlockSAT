"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export function useSignUp() {
  return useMutation({ mutationFn: (vars: { email: string; password: string }) => postJson("/api/auth/signup", vars) });
}

export function useLogIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (vars: { email: string; password: string }) => postJson("/api/auth/login", vars),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push("/dashboard");
      router.refresh();
    },
  });
}

export function useLogOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => postJson("/api/auth/logout", {}),
    onSuccess: async () => {
      queryClient.clear();
      router.push("/");
      router.refresh();
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: (vars: { email: string }) => postJson("/api/auth/forgot-password", vars) });
}

export function useResetPassword() {
  return useMutation({ mutationFn: (vars: { token: string; password: string }) => postJson("/api/auth/reset-password", vars) });
}

export function useVerifyEmail() {
  return useMutation({ mutationFn: (vars: { token: string }) => postJson("/api/auth/verify-email", vars) });
}
