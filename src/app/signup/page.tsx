import Link from "next/link";
import SignupForm from "@/src/components/auth/SignupForm";

export default function SignupPage() {
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

        <div className="space-y-6">
          {[
            {
              icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
              label: "Track daily habits effortlessly",
            },
            {
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              label: "Build streaks that motivate you",
            },
            {
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              label: "See your progress clearly",
            },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={icon} />
                </svg>
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
          © {new Date().getFullYear()} Habit Tracker. All rights reserved.
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
              Get started
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Create your free account and start building habits
            </p>
          </div>

          <SignupForm />

          <p
            className="text-center text-sm mt-8"
            style={{ color: "var(--color-text-muted)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium"
              style={{ color: "var(--color-accent)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
