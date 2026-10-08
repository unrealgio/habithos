export type Difficulty = "trivial" | "easy" | "medium" | "hard";

export type DateOnly = string;

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type HabitFrequency =
  | { type: "daily" }
  | { type: "weekdays"; days: Weekday[] }
  | { type: "interval"; everyDays: number; startDate: DateOnly }
  | { type: "once"; date: DateOnly }
  | { type: "times_per_week"; times: number }
  | { type: "times_per_month"; times: number };

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
