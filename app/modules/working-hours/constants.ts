import { DayOfWeek } from "./types";

// Simple display order array - no conversion needed
export const WEEK_DISPLAY_ORDER: DayOfWeek[] = [
  DayOfWeek.MONDAY, // Show Monday first
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
  DayOfWeek.SUNDAY, // Show Sunday last
];

// Helper for display names
export const DAY_NAMES: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: "Montag",
  [DayOfWeek.TUESDAY]: "Dienstag",
  [DayOfWeek.WEDNESDAY]: "Mittwoch",
  [DayOfWeek.THURSDAY]: "Donnerstag",
  [DayOfWeek.FRIDAY]: "Freitag",
  [DayOfWeek.SATURDAY]: "Samstag",
  [DayOfWeek.SUNDAY]: "Sonntag",
};

export const DAY_ABBREVIATIONS: Record<DayOfWeek, string> = {
  [DayOfWeek.MONDAY]: "Mo",
  [DayOfWeek.TUESDAY]: "Di",
  [DayOfWeek.WEDNESDAY]: "Mi",
  [DayOfWeek.THURSDAY]: "Do",
  [DayOfWeek.FRIDAY]: "Fr",
  [DayOfWeek.SATURDAY]: "Sa",
  [DayOfWeek.SUNDAY]: "So",
};
