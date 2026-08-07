# BlockSAT

BlockSAT combines an original block-stacking puzzle game with SAT-style practice questions. Every puzzle piece starts **locked** — players must answer a Reading or Math question correctly to unlock it before they can place it on the board. Studying is the progression mechanic.

> **Scope note.** This build is a complete, working **core vertical slice**: authentication, onboarding, the full Question → Unlock → Place → Repeat game loop, XP/leveling with unlockable themes/skins, achievements, daily challenges, streaks, leaderboards, a functional admin dashboard, and a ~9,500-question original SAT-style bank. It was intentionally scoped this way (vs. attempting every stretch feature in the original spec at once) to keep everything genuinely playable and verified end-to-end rather than shallow across the board.
>
> **On the question bank.** BlockSAT ships **9,523 original, programmatically generated SAT-style practice questions** (9,200 Math + 323 Reading), not real College Board exam questions — those are copyrighted and can't be reproduced. Math questions are generated from 24 parameterized templates covering Algebra, Geometry, Advanced Math, Functions, Data Analysis, Statistics, and Word Problems, with answers computed programmatically (so they're guaranteed correct) and distractors verified distinct. Reading questions are generated from 20 original short passages (each with a main idea, author's purpose, a vocabulary word, an inference question, and evidence quotes, all hand-written) across all 6 official topic categories. The admin dashboard's CSV importer makes it easy to grow the bank further.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (built on Base UI in this project's shadcn version — note the `render={<X />}` composition prop instead of `asChild`, see [Base UI composition](https://base-ui.com/react/handbook/composition))
- **Prisma ORM** (pinned to v6 for stability) + **SQLite** locally / **PostgreSQL (Supabase)** in production
- **Supabase Auth** in production, with a built-in local **dev-auth fallback** (email/password + JWT cookie) so the app runs with zero external services
- **Zustand** for game state, **TanStack Query** for server state
- **Framer Motion** for animations, **canvas-confetti** for celebrations
- Original **Web Audio API–synthesized sound effects** (no external audio files — every sound is generated at runtime, so there are no licensing concerns)

## Getting started

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db (SQLite) and applies the schema
npx prisma db seed       # seeds achievements + ~9,500 questions (takes ~15s)
npm run dev
```

Open http://localhost:3000. Sign up with any email/password — the app runs in **dev-auth mode** by default (see `.env`), so there's no real email delivery; the sign-up response includes a `devVerifyLink` you can click straight from the UI.

To become an admin locally, sign up with an email listed in `ADMIN_EMAILS` in `.env` (defaults to `eshunburge@gmail.com`) — the Admin Dashboard link then appears in the profile menu.

### Verifying the question bank

There isn't a formal test runner wired up, but the question bank has a structural integrity check:

```bash
npx tsx scripts/verify-questions.ts
```

## Switching to production (Supabase + Postgres)

1. Create a project at [supabase.com](https://supabase.com).
2. In `prisma/schema.prisma`, change the datasource `provider` from `"sqlite"` to `"postgresql"`.
3. Set `DATABASE_URL` in `.env` to your Supabase connection string (use the pooled "Transaction" URL for serverless deploys).
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
5. Set `NEXT_PUBLIC_DEV_AUTH="false"`.
6. Run `npx prisma migrate dev` again against the new datasource, then `npx prisma db seed`.
7. Deploy (e.g. to Vercel), setting the same environment variables there.

The app's auth code (`lib/auth/session.ts`) already branches on `NEXT_PUBLIC_DEV_AUTH` — no other code changes are needed to go from local dev-auth to real Supabase Auth.

## Project structure

```
app/                    Next.js App Router pages + API routes
  (auth)/               Login, sign up, verify email, forgot/reset password
  onboarding/            Practice-focus + difficulty picker (2-screen flow)
  dashboard/             Home dashboard
  play/                  The game itself
  profile/, settings/    Profile + account settings
  leaderboard/           Weekly / monthly / all-time leaderboards
  admin/                 Admin dashboard (questions, users, achievements, daily challenges, analytics)
  legal/                 Terms of Service, Privacy Policy
  api/                   Route handlers for everything above
components/
  game/                  Board, piece tray, drag ghost, game-over modal, score popups
  questions/             The SAT question modal (unlock flow)
  admin/, auth/, dashboard/, shared/
lib/
  auth/                  Session abstraction (dev-auth + Supabase), admin guard
  game/                  Board logic, piece shapes, scoring, leveling, achievements, daily challenges
  audio/                 Synthesized sound effects
  supabase/              Supabase browser/server clients
prisma/
  schema.prisma          Full data model
  seed.ts                Seeds achievements + the question bank
  seed-data/questions.json  Generated question bank (see scripts/)
scripts/
  gen-math.ts, gen-reading.ts, reading-passages.ts, generate-all.ts
                         The question-bank generator (re-run to regenerate)
  verify-questions.ts    Structural integrity checker for the generated bank
stores/gameStore.ts      Zustand store driving the live game board
types/                   Shared TypeScript types
```

## Core gameplay loop

1. The board starts empty; three pieces are dealt, all **locked**.
2. Tapping a locked piece opens a question (filtered by the player's practice-focus and difficulty preferences from onboarding/settings).
3. Correct answer → piece unlocks, +25 XP, an explanation is shown either way.
4. Incorrect answer → explanation shown, "Try another question" fetches a new one; the same piece stays locked.
5. Unlocked pieces can be dragged onto the 8×8 board (custom pointer-event drag implementation — works with both mouse and touch). Completed rows/columns clear, chaining clears increase a combo multiplier.
6. When no unlocked piece can be legally placed anywhere, the game ends, XP/achievements/streaks are finalized, and results are shown.

## Database schema highlights

See `prisma/schema.prisma` for the full model. Key tables: `Profile` (all player stats/preferences), `Question` (the bank), `QuestionResponse` (per-answer history), `GameSession` (per-game stats), `Achievement` / `UserAchievement`, `DailyChallenge` / `UserDailyChallenge`. `DevAuthUser` exists only to support the local dev-auth fallback and is unused once Supabase Auth is wired up.

## Known limitations / what's next

- Daily-challenge and achievement definitions live in code (`lib/game/dailyChallenges.ts`, `lib/game/achievements.ts`) rather than being freely editable from the admin UI — the admin dashboard shows live participation/completion data for both, but changing the *rules* means editing those files. This was a deliberate tradeoff to keep unlock logic type-safe and testable.
- Weekly/monthly leaderboard windows are approximated from `GameSession.startedAt` recency (there's no historical stat snapshot table), so "weekly XP" really means "current total XP, restricted to players who've played in the last 7 days" rather than "XP earned in the last 7 days."
- Sound effects are synthesized via the Web Audio API rather than produced from audio files — deliberate, to avoid any licensing questions, but they're simple tones rather than produced SFX.
- No automated test suite (unit/e2e) is wired up yet beyond the question-bank integrity checker.
