import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

import HabitForm from "@/src/components/habits/HabitForm";
import HabitCard from "@/src/components/habits/HabitCard";
import { Habit } from "@/src/types/habits";

const today = "2024-01-15";

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "habit-1",
    userId: "user-1",
    name: "Drink Water",
    description: "Stay hydrated",
    frequency: "daily",
    createdAt: "2024-01-01T00:00:00.000Z",
    completions: [],
    ...overrides,
  };
}

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByText("Habit name is required")).toBeInTheDocument();
    });
    expect(onSave).not.toHaveBeenCalled();
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    await user.type(screen.getByTestId("habit-name-input"), "Drink Water");
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Stay hydrated daily",
    );
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        name: "Drink Water",
        description: "Stay hydrated daily",
        frequency: "daily",
      });
    });
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();
    const originalHabit = makeHabit();
    const onSave = vi.fn();

    render(
      <HabitForm
        onSave={onSave}
        onCancel={vi.fn()}
        initialData={{
          name: originalHabit.name,
          description: originalHabit.description,
          frequency: originalHabit.frequency,
        }}
      />,
    );

    const nameInput = screen.getByTestId("habit-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Drink More Water");
    await user.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Drink More Water",
          frequency: "daily",
        }),
      );
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const habit = makeHabit();

    render(
      <HabitCard
        habit={habit}
        today={today}
        onUpdate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    // Click delete — confirmation should appear
    await user.click(screen.getByTestId("habit-delete-drink-water"));
    expect(onDelete).not.toHaveBeenCalled();

    // Confirm delete
    await user.click(screen.getByTestId("confirm-delete-button"));
    expect(onDelete).toHaveBeenCalledWith("habit-1");
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const habit = makeHabit();

    render(
      <HabitCard
        habit={habit}
        today={today}
        onUpdate={onUpdate}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    // Initially streak is 0
    expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent(
      "0 days streak",
    );

    // Click to complete
    await user.click(screen.getByTestId("habit-complete-drink-water"));

    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        completions: expect.arrayContaining([today]),
      }),
    );
  });
});
