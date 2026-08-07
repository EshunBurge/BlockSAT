import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { ensureProfile } from "@/lib/auth/profile";

export class AuthError extends Error {}

export async function devSignUp(email: string, password: string) {
  email = email.toLowerCase().trim();
  const existing = await prisma.devAuthUser.findUnique({ where: { email } });
  if (existing) throw new AuthError("An account with that email already exists.");

  const passwordHash = await bcrypt.hash(password, 10);
  const verifyToken = randomUUID();

  const user = await prisma.devAuthUser.create({
    data: { email, passwordHash, verifyToken },
  });

  await ensureProfile(user.id, email);

  // In production this would be emailed. Here we return it so the UI can
  // surface a "verify now" link (see the Email Verification screen).
  return { userId: user.id, verifyToken };
}

export async function devVerifyEmail(token: string) {
  const user = await prisma.devAuthUser.findFirst({ where: { verifyToken: token } });
  if (!user) throw new AuthError("Invalid or expired verification link.");
  await prisma.devAuthUser.update({
    where: { id: user.id },
    data: { emailVerified: true, verifyToken: null },
  });
  return user;
}

export async function devLogIn(email: string, password: string) {
  email = email.toLowerCase().trim();
  const user = await prisma.devAuthUser.findUnique({ where: { email } });
  if (!user) throw new AuthError("Invalid email or password.");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AuthError("Invalid email or password.");
  await ensureProfile(user.id, email);
  return user;
}

export async function devRequestPasswordReset(email: string) {
  email = email.toLowerCase().trim();
  const user = await prisma.devAuthUser.findUnique({ where: { email } });
  if (!user) return null; // don't leak account existence
  const resetToken = randomUUID();
  const resetTokenExp = new Date(Date.now() + 1000 * 60 * 30);
  await prisma.devAuthUser.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExp },
  });
  return resetToken;
}

export async function devResetPassword(token: string, newPassword: string) {
  const user = await prisma.devAuthUser.findFirst({ where: { resetToken: token } });
  if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
    throw new AuthError("Invalid or expired reset link.");
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.devAuthUser.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExp: null },
  });
}
