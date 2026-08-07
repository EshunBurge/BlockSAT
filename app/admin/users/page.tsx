"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  level: number;
  xp: number;
  highestScore: number;
  gamesPlayed: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: async (): Promise<{ users: AdminUser[]; total: number }> => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params}`);
      return res.json();
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role.");
    },
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <AdminShell>
      <Input
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-xs bg-white/10 border-white/20 text-white placeholder:text-white/40"
      />

      <div className="glass-card overflow-x-auto rounded-2xl p-2">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">Username</TableHead>
              <TableHead className="text-white/60">Email</TableHead>
              <TableHead className="text-white/60">Level</TableHead>
              <TableHead className="text-white/60">Highest Score</TableHead>
              <TableHead className="text-white/60">Role</TableHead>
              <TableHead className="text-white/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users?.map((u: AdminUser) => (
              <TableRow key={u.id} className="border-white/10">
                <TableCell>{u.username}</TableCell>
                <TableCell className="text-white/60">{u.email}</TableCell>
                <TableCell>{u.level}</TableCell>
                <TableCell>{u.highestScore.toLocaleString()}</TableCell>
                <TableCell><Badge variant="outline" className="border-white/20 text-white">{u.role}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/30 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                    onClick={() => roleMutation.mutate({ id: u.id, role: u.role === "ADMIN" ? "USER" : "ADMIN" })}
                  >
                    {u.role === "ADMIN" ? "Revoke admin" : "Make admin"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  );
}
