import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

import LoginForm from "@/src/components/auth/LoginForm";
import SignupForm from "@/src/components/auth/SignupForm";
import * as storage from "@/src/lib/storage";

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "test@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      const session = storage.getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe("test@example.com");
    });

    const users = storage.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("test@example.com");
  });

  it("shows an error for duplicate signup email", async () => {
    const user = userEvent.setup();

    // Pre-populate a user
    storage.saveUsers([
      {
        id: "existing-id",
        email: "test@example.com",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
    ]);

    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "test@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "newpassword");
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      expect(screen.getByText("User already exists")).toBeInTheDocument();
    });
  });

  it("submits the login form and stores the active session", async () => {
    const user = userEvent.setup();

    // Pre-create a user
    storage.saveUsers([
      {
        id: "user-id-1",
        email: "login@example.com",
        password: "mypassword",
        createdAt: new Date().toISOString(),
      },
    ]);

    render(<LoginForm />);

    await user.type(
      screen.getByTestId("auth-login-email"),
      "login@example.com",
    );
    await user.type(screen.getByTestId("auth-login-password"), "mypassword");
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      const session = storage.getSession();
      expect(session).not.toBeNull();
      expect(session?.email).toBe("login@example.com");
      expect(session?.userId).toBe("user-id-1");
    });
  });

  it("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByTestId("auth-login-email"),
      "wrong@example.com",
    );
    await user.type(screen.getByTestId("auth-login-password"), "wrongpassword");
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });
});
