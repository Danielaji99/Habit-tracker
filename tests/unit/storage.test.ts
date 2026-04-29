import { describe, it, expect, beforeEach } from "vitest";
import {
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
  getHabits,
  saveHabits,
} from "@/src/lib/storage";
import { User, Session } from "@/src/types/auth";
import { Habit } from "@/src/types/habits";

const mockUser: User = {
  id: "u1",
  email: "test@example.com",
  password: "pass",
  createdAt: "2024-01-01T00:00:00.000Z",
};

const mockSession: Session = {
  userId: "u1",
  email: "test@example.com",
};

const mockHabit: Habit = {
  id: "h1",
  userId: "u1",
  name: "Drink Water",
  description: "",
  frequency: "daily",
  createdAt: "2024-01-01T00:00:00.000Z",
  completions: [],
};

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("getUsers returns empty array when no users stored", () => {
    expect(getUsers()).toEqual([]);
  });

  it("saveUsers and getUsers round-trips users correctly", () => {
    saveUsers([mockUser]);
    expect(getUsers()).toEqual([mockUser]);
  });

  it("getSession returns null when no session stored", () => {
    expect(getSession()).toBeNull();
  });

  it("saveSession and getSession round-trips session correctly", () => {
    saveSession(mockSession);
    expect(getSession()).toEqual(mockSession);
  });

  it("clearSession sets session to null", () => {
    saveSession(mockSession);
    clearSession();
    expect(getSession()).toBeNull();
  });

  it("getHabits returns empty array when no habits stored", () => {
    expect(getHabits()).toEqual([]);
  });

  it("saveHabits and getHabits round-trips habits correctly", () => {
    saveHabits([mockHabit]);
    expect(getHabits()).toEqual([mockHabit]);
  });
});
