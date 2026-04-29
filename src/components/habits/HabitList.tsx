"use client";

import { Habit } from "@/src/types/habits";
import HabitCard from "./HabitCard";

const SeedlingIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "var(--color-border-strong)" }}
  >
    <path d="M12 22V12" />
    <path d="M12 12C12 12 7 10 7 5a5 5 0 0 1 10 0c0 5-5 7-5 7z" />
    <path d="M12 12c0 0-4 1.5-4 6" />
  </svg>
);

interface HabitListProps {
  habits: Habit[];
  today: string;
  onUpdate: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitList({
  habits,
  today,
  onUpdate,
  onEdit,
  onDelete,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        style={{
          textAlign: "center",
          padding: "64px 24px",
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1.5px dashed var(--color-border)",
        }}
      >
        <div className="flex justify-center mb-5">
          <SeedlingIcon />
        </div>
        <h2
          className="font-semibold text-base mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          No habits yet
        </h2>
        <p
          className="text-sm"
          style={{
            color: "var(--color-text-secondary)",
            maxWidth: "260px",
            margin: "0 auto",
          }}
        >
          Click &ldquo;Add new habit&rdquo; above to start tracking your first
          habit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 stagger">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          onUpdate={onUpdate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
