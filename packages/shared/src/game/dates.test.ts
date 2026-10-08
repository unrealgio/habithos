import { afterEach, describe, expect, it, vi } from "vitest";
import { daysBetween, getIsoWeekday, isValidDateOnly } from "./dates";

describe("isValidDateOnly", () => {
  it("accepts existing days in YYYY-MM-DD format", () => {
    expect(isValidDateOnly("2026-10-07")).toBe(true);
    expect(isValidDateOnly("2028-02-29")).toBe(true);
  });

  it("rejects days that do not exist instead of rolling them over", () => {
    expect(isValidDateOnly("2026-02-29")).toBe(false);
    expect(isValidDateOnly("2026-02-30")).toBe(false);
    expect(isValidDateOnly("2026-13-01")).toBe(false);
  });

  it("rejects other formats", () => {
    expect(isValidDateOnly("2026-10-7")).toBe(false);
    expect(isValidDateOnly("07/10/2026")).toBe(false);
    expect(isValidDateOnly("2026-10-07T00:00:00Z")).toBe(false);
    expect(isValidDateOnly("")).toBe(false);
  });
});

describe("getIsoWeekday", () => {
  it("numbers the week from Monday (1) to Sunday (7)", () => {
    expect(getIsoWeekday("2026-10-05")).toBe(1);
    expect(getIsoWeekday("2026-10-07")).toBe(3);
    expect(getIsoWeekday("2026-10-11")).toBe(7);
  });
});

describe("daysBetween", () => {
  it("counts calendar days, including negative distances", () => {
    expect(daysBetween("2026-10-07", "2026-10-07")).toBe(0);
    expect(daysBetween("2026-10-07", "2026-10-08")).toBe(1);
    expect(daysBetween("2026-10-08", "2026-10-07")).toBe(-1);
  });

  it("handles month, year and leap-year boundaries", () => {
    expect(daysBetween("2026-12-30", "2027-01-02")).toBe(3);
    expect(daysBetween("2028-02-28", "2028-03-01")).toBe(2);
  });
});

describe("invalid input", () => {
  it("throws instead of guessing", () => {
    expect(() => getIsoWeekday("2026-02-30")).toThrow(RangeError);
    expect(() => daysBetween("2026-10-07", "tomorrow")).toThrow(RangeError);
  });
});

describe("machine time zone independence", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("gives the same answers whatever time zone the server runs in", () => {
    for (const timeZone of [
      "UTC",
      "America/Sao_Paulo",
      "Pacific/Kiritimati",
      "Pacific/Pago_Pago",
    ]) {
      vi.stubEnv("TZ", timeZone);

      expect(getIsoWeekday("2026-10-07")).toBe(3);
      expect(daysBetween("2026-03-07", "2026-03-09")).toBe(2);
    }
  });
});
