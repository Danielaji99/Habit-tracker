"use client";

import { useState } from "react";
import { Habit } from "@/src/types/habits";
import { validateHabitName } from "@/src/lib/validators";

interface HabitFormProps {
  onSave: (data: {
    name: string;
    description: string;
    frequency: "daily";
  }) => void;
  onCancel: () => void;
  initialData?: Pick<Habit, "name" | "description" | "frequency">;
}

export default function HabitForm({
  onSave,
  onCancel,
  initialData,
}: HabitFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [nameError, setNameError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateHabitName(name);
    if (!result.valid) {
      setNameError(result.error);
      return;
    }
    setNameError(null);
    // Per spec: only 'daily' frequency is required for this stage
    onSave({
      name: result.value,
      description: description.trim(),
      frequency: "daily",
    });
  }

  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-text-primary)",
    outline: "none",
    width: "100%",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "0.875rem",
    fontFamily: "inherit",
  };

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Name */}
      <div>
        <label
          htmlFor="habit-name"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Habit name <span style={{ color: "var(--color-danger)" }}>*</span>
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(null);
          }}
          style={{
            ...inputStyle,
            borderColor: nameError
              ? "var(--color-danger)"
              : "var(--color-border)",
          }}
          onFocus={(e) => {
            if (!nameError) e.target.style.borderColor = "var(--color-accent)";
          }}
          onBlur={(e) => {
            if (!nameError) e.target.style.borderColor = "var(--color-border)";
          }}
          placeholder="e.g. Drink 8 glasses of water"
          maxLength={60}
        />
        <div className="flex justify-between items-center mt-1.5">
          {nameError ? (
            <p className="text-xs" style={{ color: "var(--color-danger)" }}>
              {nameError}
            </p>
          ) : (
            <span />
          )}
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {name.length}/60
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="habit-description"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Description
          <span
            className="ml-1.5 text-xs font-normal"
            style={{ color: "var(--color-text-muted)" }}
          >
            optional
          </span>
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "none" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          placeholder="Why does this habit matter to you?"
        />
      </div>

      {/* Frequency */}
      <div>
        <label
          htmlFor="habit-frequency"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Frequency
        </label>
        <div className="relative">
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            defaultValue="daily"
            style={{
              ...inputStyle,
              appearance: "none",
              paddingRight: "40px",
              cursor: "pointer",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--color-accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--color-border)")
            }
          >
            <option value="daily">Daily</option>
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <p
          className="mt-1.5 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          More frequencies (weekly, custom) coming in a future update.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm"
          style={{
            background: "var(--color-accent)",
            color: "white",
            boxShadow: "0 2px 8px rgba(45,106,79,0.25)",
          }}
        >
          Save habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm"
          style={{
            background: "var(--color-surface-alt)",
            color: "var(--color-text-secondary)",
            border: "1.5px solid var(--color-border)",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
