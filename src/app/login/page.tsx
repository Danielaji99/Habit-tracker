import Link from "next/link";
import LoginForm from "@/src/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Left panel – branding */}
      <div
        className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12"
        style={{ background: "var(--color-accent)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
              <rect
                x="6"
                y="6"
                width="13"
                height="13"
                rx="2.5"
                fill="white"
                fillOpacity="0.9"
              />
              <rect
                x="25"
                y="6"
                width="13"
                height="13"
                rx="2.5"
                fill="white"
                fillOpacity="0.5"
              />
              <rect
                x="6"
                y="25"
                width="13"
                height="13"
                rx="2.5"
                fill="white"
                fillOpacity="0.5"
              />
              <rect
                x="25"
                y="25"
                width="13"
                height="13"
                rx="2.5"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M29 31.5L31.5 34L36 28"
                stroke="#2d6a4f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-semibold text-white text-sm">
            Habit Tracker
          </span>
        </div>

        <div>
          <blockquote
            className="font-display text-3xl text-white mb-6"
            style={{ lineHeight: "1.25", letterSpacing: "-0.01em" }}
          >
            "We are what we repeatedly do. Excellence is not an act, but a
            habit."
          </blockquote>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
            — Aristotle
          </p>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 rounded-full flex-1"
              style={{
                background: i === 1 ? "white" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "var(--color-accent)" }}
            >
              <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
                <rect
                  x="6"
                  y="6"
                  width="13"
                  height="13"
                  rx="2.5"
                  fill="white"
                  fillOpacity="0.9"
                />
                <rect
                  x="25"
                  y="6"
                  width="13"
                  height="13"
                  rx="2.5"
                  fill="white"
                  fillOpacity="0.5"
                />
                <rect
                  x="6"
                  y="25"
                  width="13"
                  height="13"
                  rx="2.5"
                  fill="white"
                  fillOpacity="0.5"
                />
                <rect
                  x="25"
                  y="25"
                  width="13"
                  height="13"
                  rx="2.5"
                  fill="white"
                  fillOpacity="0.9"
                />
                <path
                  d="M29 31.5L31.5 34L36 28"
                  stroke="#2d6a4f"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--color-text-primary)" }}
            >
              Habit Tracker
            </span>
          </div>

          <div className="mb-8">
            <h1
              className="font-display text-3xl mb-2"
              style={{
                color: "var(--color-text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Sign in to continue your streak
            </p>
          </div>

          <LoginForm />

          <p
            className="text-center text-sm mt-8"
            style={{ color: "var(--color-text-muted)" }}
          >
            New here?{" "}
            <Link
              href="/signup"
              className="font-medium"
              style={{ color: "var(--color-accent)" }}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
