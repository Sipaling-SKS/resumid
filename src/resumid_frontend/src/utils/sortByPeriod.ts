import { parseISO, isValid, compareDesc } from "date-fns";

type WithPeriod = {
  period?: {
    start?: string | null;
    end?: string | null;
  };
};

/**
 * Generic sorter for arrays of objects that have a `period` field.
 * - Ongoing items (no `end`) come first
 * - Then sort by `start` date (newest first)
 */
export function sortByPeriod<T extends WithPeriod>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aStart = a.period?.start ? parseISO(a.period.start) : null;
    const bStart = b.period?.start ? parseISO(b.period.start) : null;
    const aEnd = a.period?.end ? parseISO(a.period.end) : null;
    const bEnd = b.period?.end ? parseISO(b.period.end) : null;

    // ongoing items (no end) come first
    if (!aEnd && bEnd) return -1;
    if (!bEnd && aEnd) return 1;

    // then sort by start date (desc)
    if (aStart && bStart && isValid(aStart) && isValid(bStart)) {
      return compareDesc(aStart, bStart);
    }

    return 0;
  });
}
