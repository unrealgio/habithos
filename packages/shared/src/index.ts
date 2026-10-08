export const APP_NAME = "Habithos";

export type { Difficulty, LevelProgress, Reward } from "./game/types";
export { DIFFICULTY_REWARDS, LEVEL_BASE_XP, LEVEL_EXPONENT } from "./game/config";
export { getBaseReward } from "./game/rewards";
export { getLevelProgress, getXpToNextLevel } from "./game/levels";
