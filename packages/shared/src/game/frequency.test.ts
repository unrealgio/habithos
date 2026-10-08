import { describe, expect, it } from "vitest";
import { isAvailableOn } from "./frequency";
import type { HabitFrequency } from "./types";

describe("isAvailableOn", () => {
  describe("daily", () => {
    it("is available every day", () => {
      expect(isAvailableOn({ type: "daily" }, "2026-10-05")).toBe(true);
      expect(isAvailableOn({ type: "daily" }, "2026-10-11")).toBe(true);
    });
  });

  describe("weekdays", () => {
    const mondayWednesdayFriday: HabitFrequency = { type: "weekdays", days: [1, 3, 5] };

    it("is available only on the chosen days of the week", () => {
      expect(isAvailableOn(mondayWednesdayFriday, "2026-10-05")).toBe(true);
      expect(isAvailableOn(mondayWednesdayFriday, "2026-10-06")).toBe(false);
      expect(isAvailableOn(mondayWednesdayFriday, "2026-10-07")).toBe(true);
      expect(isAvailableOn(mondayWednesdayFriday, "2026-10-09")).toBe(true);
      expect(isAvailableOn(mondayWednesdayFriday, "2026-10-11")).toBe(false);
    });

    it("treats Sunday as day 7, not JavaScript's 0", () => {
      expect(isAvailableOn({ type: "weekdays", days: [6, 7] }, "2026-10-11")).toBe(true);
    });
  });

  describe("interval", () => {
    const everyThreeDays: HabitFrequency = {
      type: "interval",
      everyDays: 3,
      startDate: "2026-10-07",
    };

    it("is available on the start date and every N days after it", () => {
      expect(isAvailableOn(everyThreeDays, "2026-10-07")).toBe(true);
      expect(isAvailableOn(everyThreeDays, "2026-10-08")).toBe(false);
      expect(isAvailableOn(everyThreeDays, "2026-10-10")).toBe(true);
      expect(isAvailableOn(everyThreeDays, "2026-10-13")).toBe(true);
    });

    it("is not available before the start date, even on a matching rhythm", () => {
      expect(isAvailableOn(everyThreeDays, "2026-10-04")).toBe(false);
    });

    it("keeps the rhythm across month boundaries", () => {
      const everyTwoDays: HabitFrequency = {
        type: "interval",
        everyDays: 2,
        startDate: "2026-10-30",
      };
      expect(isAvailableOn(everyTwoDays, "2026-11-01")).toBe(true);
    });

    it("rejects intervals shorter than one day", () => {
      expect(() =>
        isAvailableOn({ type: "interval", everyDays: 0, startDate: "2026-10-07" }, "2026-10-07"),
      ).toThrow(RangeError);
    });
  });

  describe("once", () => {
    it("is available only on its date", () => {
      const once: HabitFrequency = { type: "once", date: "2026-10-09" };
      expect(isAvailableOn(once, "2026-10-09")).toBe(true);
      expect(isAvailableOn(once, "2026-10-10")).toBe(false);
    });
  });

  describe("period goals", () => {
    it("are available every day, since the user picks when to do them", () => {
      expect(isAvailableOn({ type: "times_per_week", times: 3 }, "2026-10-06")).toBe(true);
      expect(isAvailableOn({ type: "times_per_month", times: 10 }, "2026-10-11")).toBe(true);
    });
  });

  it("rejects invalid dates for every frequency type", () => {
    expect(() => isAvailableOn({ type: "daily" }, "2026-02-30")).toThrow(RangeError);
  });
});
