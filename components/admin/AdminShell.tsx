"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@/components/shared/AppShell";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/questions", label: "Questions" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/daily-challenges", label: "Daily Challenges" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && profile && profile.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isLoading, profile, router]);

  return (
    <AppShell>
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-full bg-white/5 p-1">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium",
              pathname === t.href ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>
      {profile?.role === "ADMIN" ? children : <p className="text-white/50">Checking permissions...</p>}
    </AppShell>
  );
}
