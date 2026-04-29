import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "@/src/lib/habits";
import { Habit } from "@/src/types/habits";

const baseHabit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "Stay hydrated",
  frequency: "daily",
  createdAt: "2024-01-01T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(baseHabit, "2024-01-15");
    expect(result.completions).toContain("2024-01-15");
    expect(result.completions).toHaveLength(1);
  });

  it("removes a completion date when the date already exists", () => {
    const habit = { ...baseHabit, completions: ["2024-01-15", "2024-01-14"] };
    const result = toggleHabitCompletion(habit, "2024-01-15");
    expect(result.completions).not.toContain("2024-01-15");
    expect(result.completions).toContain("2024-01-14");
  });

  it("does not mutate the original habit object", () => {
    const habit = { ...baseHabit, completions: ["2024-01-14"] };
    const originalCompletions = [...habit.completions];
    toggleHabitCompletion(habit, "2024-01-15");
    expect(habit.completions).toEqual(originalCompletions);
  });

  it("does not return duplicate completion dates", () => {
    const habit = { ...baseHabit, completions: ["2024-01-15", "2024-01-15"] };
    // Toggle off (date exists) then check no duplicates remain
    const removed = toggleHabitCompletion(habit, "2024-01-15");
    expect(removed.completions).not.toContain("2024-01-15");

    // Toggle on a new date and ensure uniqueness
    const added = toggleHabitCompletion(baseHabit, "2024-01-15");
    const unique = new Set(added.completions);
    expect(unique.size).toBe(added.completions.length);
  });
});
