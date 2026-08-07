/**
 * Unified auth session helpers.
 *
 * BlockSAT is designed to run against real Supabase Auth in production.
 * Because this environment has no live Supabase project attached, it also
 * ships a lightweight "dev auth" fallback (email/password + JWT cookie,
 * backed by the local Prisma DB) so the app is fully runnable and testable
 * out of the box. Toggle with NEXT_PUBLIC_DEV_AUTH in .env.
 *
 * Every server component / route handler should import `getSession` from
 * here rather than talking to Supabase or the dev auth store directly, so
 * swapping providers never touches app code.
 */
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { createServerClient } from "@supabase/ssr";

const DEV_AUTH = process.env.NEXT_PUBLIC_DEV_AUTH === "true";
const SESSION_COOKIE = "blocksat_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-insecure-secret-change-me"
);

export type AuthSession = {
  userId: string;
  email: string;
};

export async function createDevSession(userId: string, email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearDevSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

async function getDevSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.sub || !payload.email) return null;
    return { userId: payload.sub, email: payload.email as string };
  } catch {
    return null;
  }
}

async function getSupabaseSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {
          /* no-op in read-only server component contexts */
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return null;
  return { userId: user.id, email: user.email };
}

/** Get the current authenticated session, or null. Works in Server Components, Route Handlers, and Server Actions. */
export async function getSession(): Promise<AuthSession | null> {
  return DEV_AUTH ? getDevSession() : getSupabaseSession();
}

export function isDevAuth() {
  return DEV_AUTH;
}
