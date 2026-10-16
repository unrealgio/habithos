export const APP_NAME = "Habithos";

export type {
  DateOnly,
  Difficulty,
  HabitFrequency,
  LevelProgress,
  Reward,
  Weekday,
} from "./game/types";
export { DIFFICULTY_REWARDS, LEVEL_BASE_XP, LEVEL_EXPONENT } from "./game/config";
export { getBaseReward } from "./game/rewards";
export { getLevelProgress, getXpToNextLevel } from "./game/levels";
export { daysBetween, getIsoWeekday, isValidDateOnly } from "./game/dates";
export { isAvailableOn } from "./game/frequency";
export { loginSchema, registerSchema } from "./auth/schemas";
export type { LoginInput, RegisterInput } from "./auth/schemas";
