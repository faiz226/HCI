import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/register")({
  component: RegisterScreen,
});

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      {/* Top decorative band */}
      <div
        aria-hidden
        style={{
          height: 4,
          background: "linear-gradient(90deg, var(--primary) 0%, transparent 100%)",
          opacity: 0.35,
        }}
      />

      {/* Back button */}
      <div style={{ padding: "1rem 1.5rem 0" }}>
        <button
          onClick={() => navigate({ to: "/login" })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            color: "var(--muted-foreground)",
            fontSize: "0.875rem",
            padding: "0.25rem 0",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to sign in
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2rem 2rem 2.5rem",
          maxWidth: 420,
          width: "100%",
          margin: "0 auto",
          gap: "2.5rem",
        }}
      >
        {/* Header */}
        <div>
          <p
            style={{
              fontSize: "0.8125rem",
              letterSpacing: "0.1em",
              textTransform: "lowercase",
              color: "var(--muted-foreground)",
              margin: "0 0 0.5rem",
            }}
          >
            soft oasis
          </p>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: 650,
              letterSpacing: "-0.03em",
              color: "var(--foreground)",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Create your
            <br />
            space.
          </h1>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <Field label="Your name" placeholder="Aisyah" type="text" />
          <Field label="Email address" placeholder="you@example.com" type="email" />
          <PasswordField
            label="Password"
            placeholder="••••••••"
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
          <PasswordField
            label="Confirm password"
            placeholder="Repeat your password"
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />
        </div>

        {/* CTA */}
        <button
          style={{
            width: "100%",
            padding: "0.875rem",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            borderRadius: "var(--radius)",
            fontSize: "1rem",
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "-0.01em",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Create my space
        </button>

        {/* Sign in link */}
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--muted-foreground)",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate({ to: "/login" })}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--primary)",
              fontWeight: 500,
              fontSize: "0.8125rem",
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          borderRadius: "var(--radius)",
          border: `1.5px solid ${focused ? "var(--primary)" : "var(--border)"}`,
          background: "var(--card)",
          color: "var(--foreground)",
          fontSize: "1rem",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.18s ease",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// PasswordField — eye toggle
// ---------------------------------------------------------------------------

function PasswordField({
  label,
  placeholder,
  show,
  onToggle,
}: {
  label: string;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)" }}>
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: "var(--radius)",
          border: `1.5px solid ${focused ? "var(--primary)" : "var(--border)"}`,
          background: "var(--card)",
          transition: "border-color 0.18s ease",
          paddingRight: "0.75rem",
        }}
      >
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            border: "none",
            background: "transparent",
            color: "var(--foreground)",
            fontSize: "1rem",
            outline: "none",
            fontFamily: "inherit",
            minWidth: 0,
          }}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted-foreground)",
            padding: "0.25rem",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
