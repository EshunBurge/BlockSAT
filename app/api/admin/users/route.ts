import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || undefined;
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = 25;

  const where = search
    ? { OR: [{ username: { contains: search } }, { email: { contains: search } }] }
    : undefined;

  const [total, users] = await Promise.all([
    prisma.profile.count({ where }),
    prisma.profile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        level: true,
        xp: true,
        highestScore: true,
        gamesPlayed: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({ users, total, page, pageSize });
}
