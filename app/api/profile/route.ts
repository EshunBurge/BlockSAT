import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession, isDevAuth, clearDevSession } from "@/lib/auth/session";

const schema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).optional(),
  practiceFocus: z.enum(["READING", "MATH", "BOTH"]).optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  onboardingDone: z.boolean().optional(),
  soundEnabled: z.boolean().optional(),
  musicEnabled: z.boolean().optional(),
  activeTheme: z.string().optional(),
  activePieceSkin: z.string().optional(),
  activeAvatar: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  if (parsed.data.username) {
    const existing = await prisma.profile.findUnique({ where: { username: parsed.data.username } });
    if (existing && existing.id !== session.userId) {
      return NextResponse.json({ error: "That username is already taken." }, { status: 400 });
    }
  }

  const profile = await prisma.profile.update({ where: { id: session.userId }, data: parsed.data });
  return NextResponse.json({ profile });
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  await prisma.profile.delete({ where: { id: session.userId } }).catch(() => null);
  if (isDevAuth()) {
    await prisma.devAuthUser.delete({ where: { id: session.userId } }).catch(() => null);
    await clearDevSession();
  }
  return NextResponse.json({ ok: true });
}
