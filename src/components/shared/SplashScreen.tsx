export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "var(--color-accent)" }}
    >
      <div className="text-center animate-fade-up">
        {/* Logo mark */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
        </div>

        <h1
          className="font-display text-5xl text-white mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          Habit Tracker
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem" }}>
          Build consistency. Track progress.
        </p>

        {/* Loader */}
        <div className="flex justify-center mt-10">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-white"
                style={{
                  opacity: 0.9,
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
