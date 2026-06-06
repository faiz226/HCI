import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { HangingIdCard } from "@/components/HangingIdCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";
import { computeBalanceScore, useBalance } from "@/lib/balance-store";
import { sessionStore, useSession } from "@/lib/session-store";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile · Soft Oasis" },
      { name: "description", content: "Your space in Soft Oasis — name, email, and sign-in." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const session = useSession();
  const balance = useBalance();
  const balanceScore = useMemo(() => computeBalanceScore(balance).score, [balance]);
  const [name, setName] = useState(session.name);
  const [email, setEmail] = useState(session.email);

  const save = () => {
    if (!name.trim()) {
      toast("Please enter a name", { description: "Your display name helps personalize Soft Oasis." });
      return;
    }
    sessionStore.updateProfile({ name: name.trim(), email: email.trim() || session.email });
    toast("Profile saved", { description: "Your details are stored on this device." });
  };

  return (
    <AppShell title="Profile">
      <div className="flex flex-col gap-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-primary font-medium w-fit -mt-1"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Link>

        {!session.signedIn ? (
          <section className="bg-surface-white rounded-xl p-6 border border-dusty-olive/20 shadow-soft flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant text-[32px]">
                person_off
              </span>
            </div>
            <div>
              <h2 className="font-display text-xl text-deep-forest">You're signed out</h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Sign back in to sync your gentle progress.
              </p>
            </div>
            <button
              onClick={() => {
                sessionStore.signIn();
                toast("Welcome back");
              }}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition"
            >
              Sign in
            </button>
          </section>
        ) : (
          <>
            <HangingIdCard
              name={session.name}
              role="KICT Student"
              badgeId={`SO-${session.name.slice(0, 2).toUpperCase()}26`}
              accentColor="#536251"
            />

            <section className="rounded-xl border border-dusty-olive/20 bg-surface-white p-4 shadow-soft flex flex-col gap-4">
              <div>
                <TypographyH2 className="text-lg">Edit profile</TypographyH2>
                <TypographyMuted className="mt-1">
                  Update how Soft Oasis greets you across the app.
                </TypographyMuted>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="profile-name">Display name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-surface-container/30"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface-container/30"
                />
              </div>
              <button
                onClick={save}
                className="w-full py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition"
              >
                Save changes
              </button>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <StatCard label="Balance" value={`${balanceScore}%`} />
              <StatCard label="Petals" value="128" />
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-white rounded-xl p-4 border border-dusty-olive/20 shadow-soft flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-on-surface-variant">{label}</span>
      <span className="font-display text-2xl text-deep-forest">{value}</span>
    </div>
  );
}
