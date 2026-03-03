import { getCurrentWeekDays, getDayName } from "@/lib/calendar";

describe("calendar", () => {
  describe("getCurrentWeekDays", () => {
    // Wed Jan 15, 2025 (month 0 = January)
    const wedJan15 = new Date(2025, 0, 15);

    it("returns 7 days", () => {
      const days = getCurrentWeekDays(wedJan15);
      expect(days).toHaveLength(7);
    });

    it("starts the week on Sunday", () => {
      const days = getCurrentWeekDays(wedJan15);
      expect(days[0].getDay()).toBe(0); // Sunday
    });

    it("ends the week on Saturday", () => {
      const days = getCurrentWeekDays(wedJan15);
      expect(days[6].getDay()).toBe(6); // Saturday
    });

    it("returns consecutive days (Sun–Sat) for the given date's week", () => {
      // Wed 2025-01-15 → week is Sun 12 – Sat 18
      const days = getCurrentWeekDays(wedJan15);
      expect(days[0].getDate()).toBe(12); // Sun
      expect(days[1].getDate()).toBe(13); // Mon
      expect(days[2].getDate()).toBe(14); // Tue
      expect(days[3].getDate()).toBe(15); // Wed
      expect(days[4].getDate()).toBe(16); // Thu
      expect(days[5].getDate()).toBe(17); // Fri
      expect(days[6].getDate()).toBe(18); // Sat
    });

    it("sets each day to midnight (00:00:00) local time", () => {
      const days = getCurrentWeekDays(wedJan15);
      days.forEach((d) => {
        expect(d.getHours()).toBe(0);
        expect(d.getMinutes()).toBe(0);
        expect(d.getSeconds()).toBe(0);
        expect(d.getMilliseconds()).toBe(0);
      });
    });

    it("uses current date when no reference is passed", () => {
      const before = new Date();
      const days = getCurrentWeekDays();
      expect(days).toHaveLength(7);
      expect(days[0].getDay()).toBe(0);
      expect(days[6].getDay()).toBe(6);
      // Current date should fall within the returned week
      const today = before.getDate();
      const dates = days.map((d) => d.getDate());
      expect(dates).toContain(today);
    });
  });

  describe("getDayName", () => {
    it("returns short weekday name by default", () => {
      // Use (y, m, d) for local dates so tests are timezone-safe
      expect(getDayName(new Date(2025, 0, 13))).toBe("Mon"); // Mon
      expect(getDayName(new Date(2025, 0, 14))).toBe("Tue");
      expect(getDayName(new Date(2025, 0, 15))).toBe("Wed");
      expect(getDayName(new Date(2025, 0, 12))).toBe("Sun");
      expect(getDayName(new Date(2025, 0, 18))).toBe("Sat");
    });

    it('returns long weekday name when style is "long"', () => {
      expect(getDayName(new Date(2025, 0, 13), "long")).toBe("Monday");
      expect(getDayName(new Date(2025, 0, 15), "long")).toBe("Wednesday");
      expect(getDayName(new Date(2025, 0, 12), "long")).toBe("Sunday");
    });
  });
});
