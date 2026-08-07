import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

/** Returns the admin's profile, or null if unauthenticated / not an admin. Use in every /api/admin/* route. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  const profile = await prisma.profile.findUnique({ where: { id: session.userId } });
  if (!profile || profile.role !== "ADMIN") return null;
  return profile;
}
