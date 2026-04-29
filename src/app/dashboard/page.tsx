"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getHabits, saveHabits } from "@/src/lib/storage";
import { getCurrentSession, logOut } from "@/src/lib/auth";
import { Habit } from "@/src/types/habits";
import { Session } from "@/src/types/auth";
import ProtectedRoute from "@/src/components/shared/ProtectedRoute";
import HabitList from "@/src/components/habits/HabitList";
import HabitForm from "@/src/components/habits/HabitForm";

type FormMode = "create" | "edit" | null;

const PlusIcon = () => (
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
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
    <rect
      x="6"
      y="6"
      width="13"
      height="13"
      rx="2.5"
      fill="var(--color-accent)"
      fillOpacity="0.9"
    />
    <rect
      x="25"
      y="6"
      width="13"
      height="13"
      rx="2.5"
      fill="var(--color-accent)"
      fillOpacity="0.35"
    />
    <rect
      x="6"
      y="25"
      width="13"
      height="13"
      rx="2.5"
      fill="var(--color-accent)"
      fillOpacity="0.35"
    />
    <rect
      x="25"
      y="25"
      width="13"
      height="13"
      rx="2.5"
      fill="var(--color-accent)"
      fillOpacity="0.9"
    />
    <path
      d="M29 31.5L31.5 34L36 28"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function DashboardContent() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const completedToday = habits.filter((h) =>
    h.completions.includes(today),
  ).length;

  useEffect(() => {
    const s = getCurrentSession();
    if (!s) return;
    setSession(s);
    const allHabits = getHabits();
    setHabits(allHabits.filter((h) => h.userId === s.userId));
  }, []);

  function handleLogout() {
    logOut();
    router.replace("/login");
  }

  function handleSaveHabit(data: {
    name: string;
    description: string;
    frequency: "daily";
  }) {
    if (formMode === "create") {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId: session!.userId,
        name: data.name,
        description: data.description,
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      };
      const allHabits = getHabits();
      const updated = [...allHabits, newHabit];
      saveHabits(updated);
      setHabits(updated.filter((h) => h.userId === session!.userId));
    } else if (formMode === "edit" && editingHabit) {
      const allHabits = getHabits();
      const updated = allHabits.map((h) =>
        h.id === editingHabit.id
          ? {
              ...editingHabit,
              name: data.name,
              description: data.description,
              frequency: "daily" as const,
            }
          : h,
      );
      saveHabits(updated);
      setHabits(updated.filter((h) => h.userId === session!.userId));
    }
    setFormMode(null);
    setEditingHabit(null);
  }

  function handleUpdateHabit(updated: Habit) {
    const allHabits = getHabits();
    const newAll = allHabits.map((h) => (h.id === updated.id ? updated : h));
    saveHabits(newAll);
    setHabits(newAll.filter((h) => h.userId === session!.userId));
  }

  function handleEditHabit(habit: Habit) {
    setEditingHabit(habit);
    setFormMode("edit");
  }

  function handleDeleteHabit(habitId: string) {
    const allHabits = getHabits();
    const newAll = allHabits.filter((h) => h.id !== habitId);
    saveHabits(newAll);
    setHabits(newAll.filter((h) => h.userId === session!.userId));
  }

  const userInitial = session?.email?.[0]?.toUpperCase() ?? "U";
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      data-testid="dashboard-page"
      style={{ background: "var(--color-bg)", minHeight: "100vh" }}
    >
      {/* Header */}
      <header
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "0 20px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex items-center gap-2.5">
            <LogoIcon />
            <span
              className="font-semibold text-sm"
              style={{
                color: "var(--color-text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Habit Tracker
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                background: "var(--color-accent-light)",
                color: "var(--color-accent)",
              }}
              title={session?.email}
            >
              {userInitial}
            </div>
            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg"
              style={{
                color: "var(--color-text-secondary)",
                background: "var(--color-surface-alt)",
                border: "1px solid var(--color-border)",
              }}
            >
              <LogoutIcon />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "28px 20px 60px",
        }}
      >
        {/* Page header */}
        <div className="mb-8 animate-fade-up">
          <p
            className="text-xs font-medium mb-1"
            style={{
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {dateLabel}
          </p>
          <h1
            className="font-display text-3xl"
            style={{
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {habits.length === 0
              ? "Your habits"
              : completedToday === habits.length
                ? "All done today!"
                : `${completedToday} of ${habits.length} done`}
          </h1>
          {habits.length > 0 && (
            <div
              className="mt-3"
              style={{
                background: "var(--color-border)",
                borderRadius: "99px",
                height: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(completedToday / habits.length) * 100}%`,
                  background: "var(--color-accent)",
                  borderRadius: "99px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          )}
        </div>

        {/* Create habit button */}
        {formMode === null && (
          <button
            data-testid="create-habit-button"
            onClick={() => setFormMode("create")}
            className="w-full mb-6 flex items-center justify-center gap-2 rounded-xl font-medium text-sm py-3"
            style={{
              background: "var(--color-accent)",
              color: "white",
              boxShadow: "0 2px 10px rgba(45,106,79,0.25)",
              border: "none",
            }}
          >
            <PlusIcon />
            Add new habit
          </button>
        )}

        {/* Habit Form Panel */}
        {formMode !== null && (
          <div
            className="mb-6 animate-slide-down"
            style={{
              background: "var(--color-surface)",
              border: "1.5px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              padding: "24px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                className="font-semibold text-base"
                style={{ color: "var(--color-text-primary)" }}
              >
                {formMode === "create" ? "New habit" : "Edit habit"}
              </h2>
              <button
                onClick={() => {
                  setFormMode(null);
                  setEditingHabit(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg"
                style={{
                  color: "var(--color-text-muted)",
                  background: "var(--color-surface-alt)",
                }}
                aria-label="Close form"
              >
                <XIcon />
              </button>
            </div>
            <HabitForm
              onSave={handleSaveHabit}
              onCancel={() => {
                setFormMode(null);
                setEditingHabit(null);
              }}
              initialData={editingHabit ?? undefined}
            />
          </div>
        )}

        {/* Habit List */}
        <HabitList
          habits={habits}
          today={today}
          onUpdate={handleUpdateHabit}
          onEdit={handleEditHabit}
          onDelete={handleDeleteHabit}
        />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
