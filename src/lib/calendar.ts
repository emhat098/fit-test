/**
 * Returns the 7 days of the current week as an array of Date objects.
 * Week starts on Sunday (00:00:00 local time).
 */
export function getCurrentWeekDays(referenceDate: Date = new Date()): Date[] {
  const date = new Date(referenceDate);
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }
  return days;
}

/**
 * Returns the short weekday name (e.g. "Mon", "Tue") for a date.
 */
export function getDayName(
  date: Date,
  style: "short" | "long" = "short",
): string {
  return date.toLocaleDateString("en-US", { weekday: style });
}
