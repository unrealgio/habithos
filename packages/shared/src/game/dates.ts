import type { DateOnly, Weekday } from "./types";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const ISO_WEEKDAY_BY_UTC_DAY: Weekday[] = [7, 1, 2, 3, 4, 5, 6];

function toUtcTimestamp(value: string): number | null {
  const match = DATE_ONLY_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);

  const isSameCalendarDay =
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;

  return isSameCalendarDay ? timestamp : null;
}

function requireUtcTimestamp(date: DateOnly): number {
  const timestamp = toUtcTimestamp(date);

  if (timestamp === null) {
    throw new RangeError(`Invalid date "${date}", expected an existing day as YYYY-MM-DD`);
  }

  return timestamp;
}

export function isValidDateOnly(value: string): boolean {
  return toUtcTimestamp(value) !== null;
}

export function getIsoWeekday(date: DateOnly): Weekday {
  const utcDay = new Date(requireUtcTimestamp(date)).getUTCDay();
  return ISO_WEEKDAY_BY_UTC_DAY[utcDay];
}

export function daysBetween(from: DateOnly, to: DateOnly): number {
  return (requireUtcTimestamp(to) - requireUtcTimestamp(from)) / MS_PER_DAY;
}
