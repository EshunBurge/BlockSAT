import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const achievements = await prisma.achievement.findMany({
    include: { _count: { select: { unlockedBy: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({
    achievements: achievements.map((a) => ({
      id: a.id,
      slug: a.slug,
      name: a.name,
      description: a.description,
      icon: a.icon,
      xpReward: a.xpReward,
      unlockedCount: a._count.unlockedBy,
    })),
  });
}
