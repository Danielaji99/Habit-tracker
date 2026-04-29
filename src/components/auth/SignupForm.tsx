"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/src/lib/auth";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = signUp(email, password);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "var(--color-danger-light)",
            color: "var(--color-danger)",
            border: "1px solid rgba(192,57,43,0.15)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 5v3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="8" cy="11" r="0.75" fill="currentColor" />
          </svg>
          {error}
        </div>
      )}
      <div>
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Email address
        </label>
        <input
          id="signup-email"
          data-testid="auth-signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={{
            border: "1.5px solid var(--color-border)",
            background: "var(--color-surface)",
            color: "var(--color-text-primary)",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Password
        </label>
        <input
          id="signup-password"
          data-testid="auth-signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={{
            border: "1.5px solid var(--color-border)",
            background: "var(--color-surface)",
            color: "var(--color-text-primary)",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          placeholder="Create a strong password"
        />
      </div>
      <button
        type="submit"
        data-testid="auth-signup-submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
        style={{
          background: loading ? "var(--color-border)" : "var(--color-accent)",
          color: "white",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 2px 8px rgba(45,106,79,0.3)",
        }}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              <path
                d="M8 2a6 6 0 0 1 6 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Creating account…
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
