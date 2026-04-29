"use client";

import { useState } from "react";
import { Habit } from "@/src/types/habits";
import { getHabitSlug } from "@/src/lib/slug";
import { calculateCurrentStreak } from "@/src/lib/streaks";
import { toggleHabitCompletion } from "@/src/lib/habits";

interface HabitCardProps {
  habit: Habit;
  today: string;
  onUpdate: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

// SVG Icons
const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const FlameIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function HabitCard({
  habit,
  today,
  onUpdate,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompleted = habit.completions.includes(today);

  function handleToggle() {
    const updated = toggleHabitCompletion(habit, today);
    onUpdate(updated);
  }

  function handleDeleteConfirm() {
    onDelete(habit.id);
    setShowDeleteConfirm(false);
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className="habit-card-enter"
      style={{
        background: "var(--color-surface)",
        border: `1.5px solid ${isCompleted ? "rgba(45,106,79,0.3)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        boxShadow: isCompleted
          ? "0 0 0 4px rgba(45,106,79,0.06)"
          : "var(--shadow-sm)",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Completion stripe */}
      {isCompleted && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background: "var(--color-accent)",
            borderRadius: "4px 0 0 4px",
          }}
        />
      )}

      <div style={{ paddingLeft: isCompleted ? "8px" : "0" }}>
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-base leading-snug"
              style={{
                color: "var(--color-text-primary)",
                textDecoration: isCompleted ? "none" : "none",
              }}
            >
              {habit.name}
            </h3>
            {habit.description && (
              <p
                className="text-sm mt-1 leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {habit.description}
              </p>
            )}
          </div>

          {/* Complete button */}
          <button
            data-testid={`habit-complete-${slug}`}
            onClick={handleToggle}
            aria-label={
              isCompleted ? "Mark incomplete" : "Mark complete for today"
            }
            style={{
              flexShrink: 0,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: `2px solid ${isCompleted ? "var(--color-accent)" : "var(--color-border)"}`,
              background: isCompleted ? "var(--color-accent)" : "transparent",
              color: isCompleted ? "white" : "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              animation: isCompleted ? "pulse-green 2s ease infinite" : "none",
            }}
          >
            {isCompleted ? (
              <CheckIcon />
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
          </button>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-4">
          {/* Streak */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background:
                streak > 0
                  ? "var(--color-streak-light)"
                  : "var(--color-surface-alt)",
              color:
                streak > 0 ? "var(--color-streak)" : "var(--color-text-muted)",
              border: `1px solid ${streak > 0 ? "rgba(224,123,57,0.2)" : "var(--color-border)"}`,
            }}
          >
            <FlameIcon />
            <span data-testid={`habit-streak-${slug}`}>
              {streak} day{streak !== 1 ? "s" : ""} streak
            </span>
          </div>

          {/* Frequency badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "var(--color-surface-alt)",
              color: "var(--color-text-muted)",
              border: "1px solid var(--color-border)",
            }}
          >
            <CalendarIcon />
            <span>Daily</span>
          </div>

          {/* Completion count */}
          {habit.completions.length > 0 && (
            <span
              className="text-xs ml-auto"
              style={{ color: "var(--color-text-muted)" }}
            >
              {habit.completions.length} total
            </span>
          )}
        </div>

        {/* Actions */}
        {!showDeleteConfirm ? (
          <div
            className="flex gap-2 mt-4 pt-4"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <button
              data-testid={`habit-edit-${slug}`}
              onClick={() => onEdit(habit)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg"
              style={{
                color: "var(--color-text-secondary)",
                background: "var(--color-surface-alt)",
                border: "1px solid var(--color-border)",
              }}
            >
              <EditIcon />
              Edit
            </button>
            <button
              data-testid={`habit-delete-${slug}`}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg"
              style={{
                color: "var(--color-danger)",
                background: "var(--color-danger-light)",
                border: "1px solid rgba(192,57,43,0.12)",
              }}
            >
              <TrashIcon />
              Delete
            </button>
          </div>
        ) : (
          <div
            className="mt-4 pt-4 rounded-xl p-4"
            style={{
              borderTop: "1px solid var(--color-border)",
              background: "var(--color-danger-light)",
              border: "1px solid rgba(192,57,43,0.15)",
              borderRadius: "var(--radius)",
              marginTop: "16px",
            }}
          >
            <div className="flex items-start gap-2 mb-3">
              <div style={{ color: "var(--color-danger)", marginTop: "1px" }}>
                <AlertIcon />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-danger)" }}
                >
                  Delete this habit?
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  This will permanently remove &ldquo;{habit.name}&rdquo; and
                  all its completion history.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="confirm-delete-button"
                onClick={handleDeleteConfirm}
                className="flex-1 text-xs py-2 px-3 rounded-lg font-medium"
                style={{ background: "var(--color-danger)", color: "white" }}
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 text-xs py-2 px-3 rounded-lg font-medium"
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                Keep it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
