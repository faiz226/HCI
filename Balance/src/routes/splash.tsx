import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/session-store";

export const Route = createFileRoute("/splash")({
  component: SplashScreen,
});

export default function SplashScreen() {
  const navigate = useNavigate();
  const { signedIn } = useSession();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in immediately
    const show = setTimeout(() => setVisible(true), 50);

    // After 2.2s, route to the right place
    const redirect = setTimeout(() => {
      const sawOnboarding = localStorage.getItem("soft-oasis-onboarded");
      if (!sawOnboarding) {
        navigate({ to: "/onboarding" });
      } else if (!signedIn) {
        navigate({ to: "/login" });
      } else {
        navigate({ to: "/" });
      }
    }, 2200);

    return () => {
      clearTimeout(show);
      clearTimeout(redirect);
    };
  }, [navigate, signedIn]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        gap: "1rem",
        transition: "opacity 0.6s ease",
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        {/* Pebble icon — a simple soft oval made of SVG, no external dep */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            marginBottom: "0.5rem",
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <ellipse
            cx="28"
            cy="30"
            rx="18"
            ry="20"
            fill="var(--primary)"
            opacity="0.15"
          />
          <ellipse
            cx="28"
            cy="29"
            rx="12"
            ry="14"
            fill="var(--primary)"
            opacity="0.35"
          />
          <ellipse
            cx="28"
            cy="28"
            rx="7"
            ry="8"
            fill="var(--primary)"
          />
        </svg>

        <p
          style={{
            fontFamily: "inherit",
            fontSize: "1.5rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--foreground)",
            margin: 0,
          }}
        >
          soft oasis
        </p>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--muted-foreground)",
            margin: 0,
            letterSpacing: "0.08em",
            textTransform: "lowercase",
          }}
        >
          your daily balance
        </p>
      </div>

      {/* Subtle loading dots */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginTop: "2.5rem",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--muted-foreground)",
              opacity: 0.4,
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              display: "block",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.9); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
