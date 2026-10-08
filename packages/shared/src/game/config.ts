import type { Reward } from "./types";

type DifficultyRewardTable = {
  trivial: Reward;
  easy: Reward;
  medium: Reward;
  hard: Reward;
};

export const DIFFICULTY_REWARDS: DifficultyRewardTable = {
  trivial: { xp: 5, coins: 0, points: 1, attributePoints: 1 },
  easy: { xp: 10, coins: 5, points: 2, attributePoints: 2 },
  medium: { xp: 25, coins: 10, points: 3, attributePoints: 5 },
  hard: { xp: 50, coins: 20, points: 5, attributePoints: 10 },
};

export const LEVEL_BASE_XP = 100;
export const LEVEL_EXPONENT = 1.4;
