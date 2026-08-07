import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ profile: null });
  const profile = await prisma.profile.findUnique({ where: { id: session.userId } });
  return NextResponse.json({ profile });
}
