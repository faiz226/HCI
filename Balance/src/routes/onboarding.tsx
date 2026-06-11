import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Scales, Brain, CheckCircle } from "@phosphor-icons/react";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingScreen,
});

const STEPS = [
  {
    Icon: Scales,
    title: "Find your balance",
    body: "Life pulls in all directions. Balance helps you notice when things feel off — before they tip over.",
  },
  {
    Icon: Brain,
    title: "Check in, not out",
    body: "A 30-second mood check each day. No streaks to chase, no scores to beat — just a gentle pulse on how you're really doing.",
  },
  {
    Icon: CheckCircle,
    title: "Small things, real change",
    body: "Your tasks, your reflection, your rhythm. Balance stays out of your way until you need it.",
  },
] as const;

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  const isLast = step === STEPS.length - 1;
  const { Icon, title, body } = STEPS[step];

  function advance() {
    if (exiting) return;
    if (!isLast) {
      setExiting(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setExiting(false);
      }, 220);
    } else {
      localStorage.setItem("soft-oasis-onboarded", "1");
      navigate({ to: "/login" });
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
        padding: "env(safe-area-inset-top, 0) 0 env(safe-area-inset-bottom, 0)",
      }}
    >
      {/* Skip */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "1.25rem 1.5rem 0" }}>
        <button
          onClick={() => {
            localStorage.setItem("soft-oasis-onboarded", "1");
            navigate({ to: "/login" });
          }}
          style={{
            background: "none",
            border: "none",
            fontSize: "0.875rem",
            color: "var(--muted-foreground)",
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
          }}
        >
          skip
        </button>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 2.5rem",
          textAlign: "center",
          transition: "opacity 0.22s ease, transform 0.22s ease",
          opacity: exiting ? 0 : 1,
          transform: exiting ? "translateX(-16px)" : "translateX(0)",
        }}
      >
        {/* Icon blob */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "var(--primary)",
            opacity: 0.1,
            position: "absolute",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "var(--primary)",
              opacity: 0.12,
            }}
          />
          <Icon size={40} weight="duotone" color="var(--primary)" />
        </div>

        <h1
          style={{
            fontSize: "1.625rem",
            fontWeight: 650,
            letterSpacing: "-0.025em",
            color: "var(--foreground)",
            margin: "0 0 1rem",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "var(--muted-foreground)",
            margin: 0,
            maxWidth: "28ch",
          }}
        >
          {body}
        </p>
      </div>

      {/* Bottom nav */}
      <div
        style={{
          padding: "1.5rem 2rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Step dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {STEPS.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background: i === step ? "var(--primary)" : "var(--muted)",
                transition: "width 0.25s ease, background 0.25s ease",
                display: "block",
              }}
            />
          ))}
        </div>

        {/* Next / Get started button */}
        <button
          onClick={advance}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            borderRadius: "99px",
            padding: isLast ? "0.65rem 1.5rem" : "0.65rem 1rem",
            fontSize: "0.9375rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "padding 0.25s ease, opacity 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {isLast ? "Get started" : <ArrowRight size={20} weight="bold" />}
        </button>
      </div>
    </div>
  );
}
