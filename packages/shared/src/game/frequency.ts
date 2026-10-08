import { daysBetween, getIsoWeekday, isValidDateOnly } from "./dates";
import type { DateOnly, HabitFrequency } from "./types";

export function isAvailableOn(frequency: HabitFrequency, date: DateOnly): boolean {
  if (!isValidDateOnly(date)) {
    throw new RangeError(`Invalid date "${date}", expected an existing day as YYYY-MM-DD`);
  }

  switch (frequency.type) {
    case "daily":
      return true;

    case "weekdays":
      return frequency.days.includes(getIsoWeekday(date));

    case "interval": {
      if (!Number.isInteger(frequency.everyDays) || frequency.everyDays < 1) {
        throw new RangeError(
          `Interval must be an integer >= 1 day, received ${frequency.everyDays}`,
        );
      }

      const elapsedDays = daysBetween(frequency.startDate, date);
      return elapsedDays >= 0 && elapsedDays % frequency.everyDays === 0;
    }

    case "once":
      return date === frequency.date;

    case "times_per_week":
    case "times_per_month":
      return true;

    default: {
      const unhandled: never = frequency;
      throw new Error(`Unhandled frequency: ${JSON.stringify(unhandled)}`);
    }
  }
}
