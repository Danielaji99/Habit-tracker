import { Habit } from "@/src/types/habits";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  // Deduplicate input completions first
  const unique = Array.from(new Set(habit.completions));
  const index = unique.indexOf(date);

  if (index === -1) {
    unique.push(date);
  } else {
    unique.splice(index, 1);
  }

  return { ...habit, completions: unique };
}
