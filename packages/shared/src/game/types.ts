export type Difficulty = "trivial" | "easy" | "medium" | "hard";

export type DateOnly = string;

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Reward = {
  xp: number;
  coins: number;
  points: number;
  attributePoints: number;
};

export type LevelProgress = {
  level: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
};
