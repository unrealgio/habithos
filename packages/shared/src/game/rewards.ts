import { DIFFICULTY_REWARDS } from "./config";
import type { Difficulty, Reward } from "./types";

export function getBaseReward(difficulty: Difficulty): Reward {
  return { ...DIFFICULTY_REWARDS[difficulty] };
}
