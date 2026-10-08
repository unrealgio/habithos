import { describe, expect, it } from "vitest";
import { getBaseReward } from "./rewards";

describe("getBaseReward", () => {
  it("returns the approved reward table for each difficulty", () => {
    expect(getBaseReward("trivial")).toEqual({ xp: 5, coins: 0, points: 1, attributePoints: 1 });
    expect(getBaseReward("easy")).toEqual({ xp: 10, coins: 5, points: 2, attributePoints: 2 });
    expect(getBaseReward("medium")).toEqual({ xp: 25, coins: 10, points: 3, attributePoints: 5 });
    expect(getBaseReward("hard")).toEqual({ xp: 50, coins: 20, points: 5, attributePoints: 10 });
  });

  it("gives no coins for trivial habits, so they cannot be farmed", () => {
    expect(getBaseReward("trivial").coins).toBe(0);
  });

  it("rewards harder difficulties with strictly more XP", () => {
    const trivial = getBaseReward("trivial").xp;
    const easy = getBaseReward("easy").xp;
    const medium = getBaseReward("medium").xp;
    const hard = getBaseReward("hard").xp;

    expect(trivial).toBeLessThan(easy);
    expect(easy).toBeLessThan(medium);
    expect(medium).toBeLessThan(hard);
  });

  it("returns a copy, so callers cannot change the balance table", () => {
    const reward = getBaseReward("hard");
    reward.xp = 9999;

    expect(getBaseReward("hard").xp).toBe(50);
  });
});
