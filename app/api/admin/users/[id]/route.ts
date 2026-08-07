import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

const schema = z.object({ role: z.enum(["USER", "ADMIN"]) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid role." }, { status: 400 });

  const profile = await prisma.profile.update({ where: { id }, data: { role: parsed.data.role } });
  return NextResponse.json({ profile });
}
