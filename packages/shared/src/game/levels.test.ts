import { describe, expect, it } from "vitest";
import { getLevelProgress, getXpToNextLevel } from "./levels";

describe("getXpToNextLevel", () => {
  it("follows the approved curve round(100 * level^1.4)", () => {
    expect(getXpToNextLevel(1)).toBe(100);
    expect(getXpToNextLevel(2)).toBe(264);
    expect(getXpToNextLevel(5)).toBe(952);
    expect(getXpToNextLevel(10)).toBe(2512);
  });

  it("requires more XP at every new level", () => {
    for (let level = 1; level < 100; level++) {
      expect(getXpToNextLevel(level + 1)).toBeGreaterThan(getXpToNextLevel(level));
    }
  });

  it("rejects levels below 1 and non-integer levels", () => {
    expect(() => getXpToNextLevel(0)).toThrow(RangeError);
    expect(() => getXpToNextLevel(-3)).toThrow(RangeError);
    expect(() => getXpToNextLevel(1.5)).toThrow(RangeError);
  });
});

describe("getLevelProgress", () => {
  it("starts a new user at level 1 with an empty bar", () => {
    expect(getLevelProgress(0)).toEqual({ level: 1, xpIntoLevel: 0, xpToNextLevel: 100 });
  });

  it("stays on the same level until the requirement is fully reached", () => {
    expect(getLevelProgress(99)).toEqual({ level: 1, xpIntoLevel: 99, xpToNextLevel: 100 });
  });

  it("levels up exactly when the requirement is reached", () => {
    expect(getLevelProgress(100)).toEqual({ level: 2, xpIntoLevel: 0, xpToNextLevel: 264 });
    expect(getLevelProgress(364)).toEqual({ level: 3, xpIntoLevel: 0, xpToNextLevel: 466 });
  });

  it("carries leftover XP into the next level", () => {
    expect(getLevelProgress(9237 + 780)).toEqual({
      level: 10,
      xpIntoLevel: 780,
      xpToNextLevel: 2512,
    });
  });

  it("never lowers the level when XP increases", () => {
    let previousLevel = 1;

    for (let totalXp = 0; totalXp <= 20000; totalXp += 37) {
      const { level } = getLevelProgress(totalXp);
      expect(level).toBeGreaterThanOrEqual(previousLevel);
      previousLevel = level;
    }
  });

  it("rejects negative, fractional and non-finite XP", () => {
    expect(() => getLevelProgress(-1)).toThrow(RangeError);
    expect(() => getLevelProgress(10.5)).toThrow(RangeError);
    expect(() => getLevelProgress(Number.NaN)).toThrow(RangeError);
    expect(() => getLevelProgress(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});
