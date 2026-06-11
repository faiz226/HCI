import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { sessionStore } from "@/lib/session-store";

export const Route = createFileRoute("/login")({
  component: LoginScreen,
});

export default function LoginScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "What should we call you?";
    if (!email.trim()) next.email = "An email helps keep your data safe.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That doesn't look like an email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate() || loading) return;
    setLoading(true);

    // Small artificial pause so the tap feels intentional, not instant
    setTimeout(() => {
      sessionStore.updateProfile({ name: name.trim(), email: email.trim() });
      sessionStore.signIn();
      navigate({ to: "/" });
    }, 350);
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
      {/* Top decorative band */}
      <div
        aria-hidden
        style={{
          height: 4,
          background: "linear-gradient(90deg, var(--primary) 0%, transparent 100%)",
          opacity: 0.35,
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.5rem 2rem",
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
            Welcome.
            <br />
            Let's set up your space.
          </h1>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <Field
            label="Your name"
            placeholder="Aisyah"
            value={name}
            onChange={setName}
            error={errors.name}
            autoComplete="given-name"
            onEnter={handleSubmit}
          />
          <Field
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
            type="email"
            autoComplete="email"
            onEnter={handleSubmit}
          />
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.875rem",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            borderRadius: "var(--radius)",
            fontSize: "1rem",
            fontWeight: 500,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.65 : 1,
            transition: "opacity 0.2s ease",
            letterSpacing: "-0.01em",
          }}
        >
          {loading ? "One moment…" : "Enter my oasis"}
        </button>

        {/* Fine print */}
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--muted-foreground)",
            margin: 0,
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Your data stays on your device.
          <br />
          No account, no password, no cloud sync.
        </p>

        {/* Register link */}
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--muted-foreground)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Don't have an account?{" "}
          <button
            onClick={() => navigate({ to: "/register" })}
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
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable field — inline so it stays out of the global component barrel
// ---------------------------------------------------------------------------

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  onEnter: () => void;
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  onEnter,
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label
        style={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: error ? "var(--destructive)" : "var(--foreground)",
          transition: "color 0.15s ease",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          borderRadius: "var(--radius)",
          border: `1.5px solid ${
            error
              ? "var(--destructive)"
              : focused
              ? "var(--primary)"
              : "var(--border)"
          }`,
          background: "var(--card)",
          color: "var(--foreground)",
          fontSize: "1rem",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.18s ease",
          fontFamily: "inherit",
        }}
      />
      {error && (
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--destructive)",
            margin: 0,
            animation: "slideIn 0.15s ease",
          }}
        >
          {error}
        </p>
      )}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
