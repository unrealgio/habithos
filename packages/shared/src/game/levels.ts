import { LEVEL_BASE_XP, LEVEL_EXPONENT } from "./config";
import type { LevelProgress } from "./types";

export function getXpToNextLevel(level: number): number {
  if (!Number.isInteger(level) || level < 1) {
    throw new RangeError(`Level must be an integer >= 1, received ${level}`);
  }

  return Math.round(LEVEL_BASE_XP * Math.pow(level, LEVEL_EXPONENT));
}

export function getLevelProgress(totalXp: number): LevelProgress {
  if (!Number.isInteger(totalXp) || totalXp < 0) {
    throw new RangeError(`Total XP must be an integer >= 0, received ${totalXp}`);
  }

  let level = 1;
  let remainingXp = totalXp;
  let xpToNextLevel = getXpToNextLevel(level);

  while (remainingXp >= xpToNextLevel) {
    remainingXp -= xpToNextLevel;
    level += 1;
    xpToNextLevel = getXpToNextLevel(level);
  }

  return { level, xpIntoLevel: remainingXp, xpToNextLevel };
}
