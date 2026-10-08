export type Difficulty = "trivial" | "easy" | "medium" | "hard";

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
