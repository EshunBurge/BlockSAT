import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { levelFromXp, LEVEL_UNLOCKS } from "@/lib/game/leveling";
import { ACHIEVEMENT_DEFS } from "@/lib/game/achievements";
import { ProfileDTO } from "@/types";

function toDTO(p: Prisma.ProfileGetPayload<Record<string, never>>): ProfileDTO {
  return p as unknown as ProfileDTO;
}

/** Adds XP to a profile, recalculates level, applies any newly-reached unlocks, and returns what changed. */
export async function grantXp(profileId: string, amount: number) {
  const profile = await prisma.profile.findUniqueOrThrow({ where: { id: profileId } });
  const newXp = profile.xp + amount;
  const before = levelFromXp(profile.xp);
  const after = levelFromXp(newXp);

  const newUnlocks = LEVEL_UNLOCKS.filter((u) => u.level > before.level && u.level <= after.level);

  const data: Prisma.ProfileUpdateInput = { xp: newXp, level: after.level };
  if (newUnlocks.length > 0) {
    const themes = new Set(profile.unlockedThemes.split(",").filter(Boolean));
    const skins = new Set(profile.unlockedSkins.split(",").filter(Boolean));
    const avatars = new Set(profile.unlockedAvatars.split(",").filter(Boolean));
    for (const u of newUnlocks) {
      if (u.type === "theme") themes.add(u.slug);
      if (u.type === "skin") skins.add(u.slug);
      if (u.type === "avatar") avatars.add(u.slug);
    }
    data.unlockedThemes = Array.from(themes).join(",");
    data.unlockedSkins = Array.from(skins).join(",");
    data.unlockedAvatars = Array.from(avatars).join(",");
  }

  const updated = await prisma.profile.update({ where: { id: profileId }, data });

  return {
    profile: updated,
    leveledUp: after.level > before.level,
    newLevel: after.level,
    newUnlocks,
  };
}

/** Checks all achievement definitions against the current profile snapshot and unlocks any newly-earned ones. */
export async function checkAchievements(profileId: string, extra?: { sessionCorrectStreak?: number }) {
  const profile = await prisma.profile.findUniqueOrThrow({ where: { id: profileId } });
  const alreadyUnlocked = await prisma.userAchievement.findMany({
    where: { profileId },
    select: { achievementId: true },
  });
  const unlockedIds = new Set(alreadyUnlocked.map((a) => a.achievementId));
  const dbAchievements = await prisma.achievement.findMany();
  const bySlug = new Map(dbAchievements.map((a) => [a.slug, a]));

  const newlyUnlocked: { slug: string; name: string; xpReward: number }[] = [];

  for (const def of ACHIEVEMENT_DEFS) {
    const dbA = bySlug.get(def.slug);
    if (!dbA || unlockedIds.has(dbA.id)) continue;
    if (def.check(toDTO(profile), extra)) {
      await prisma.userAchievement.create({ data: { profileId, achievementId: dbA.id } });
      await grantXp(profileId, dbA.xpReward);
      newlyUnlocked.push({ slug: dbA.slug, name: dbA.name, xpReward: dbA.xpReward });
    }
  }

  return newlyUnlocked;
}
