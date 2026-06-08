import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useTasks } from "@/lib/tasks-store";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards · Soft Oasis" },
      { name: "description", content: "Quiet recognition for the care you give yourself." },
    ],
  }),
  component: RewardsPage,
});

const BADGES = [
  { icon: "self_improvement", name: "Steady Breath", earned: true, desc: "7 mindful pauses", detail: "You took seven gentle pauses this week — each one counts." },
  { icon: "menu_book", name: "Deep Reader", earned: true, desc: "10 focused hours", detail: "Ten hours of focused reading. Your mind stayed with the page." },
  { icon: "bedtime", name: "Restful Week", earned: true, desc: "50+ hrs sleep", detail: "Your body had room to recover. Rest is part of the work." },
  { icon: "diversity_3", name: "Connected", earned: false, desc: "Reach out 5 times", detail: "Send five small messages to people you trust. Connection lightens heavy weeks." },
  { icon: "directions_walk", name: "Soft Steps", earned: false, desc: "3 walks this week", detail: "Three short walks — even ten minutes between classes helps." },
  { icon: "favorite", name: "Kindness", earned: false, desc: "A note to a friend", detail: "Write a kind note to someone. It doesn't have to be long." },
];

// ─── Streak helpers ───────────────────────────────────────────────────────────

const STREAK_KEY = "soft-oasis-streak";

type StreakData = {
  current: number;
  longest: number;
  lastActiveDate: string; // "YYYY-MM-DD"
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function readStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { current: 0, longest: 0, lastActiveDate: "" };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { current: 0, longest: 0, lastActiveDate: "" };
  }
}

function saveStreak(data: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

function computeStreak(hasCompletedTaskToday: boolean): StreakData {
  const data = readStreak();
  const today = todayStr();
  const yesterday = yesterdayStr();

  if (!hasCompletedTaskToday) {
    // If last active was yesterday, streak is still alive (just not updated yet today)
    if (data.lastActiveDate === yesterday || data.lastActiveDate === today) {
      return data;
    }
    // Streak broken
    return { ...data, current: 0 };
  }

  // Has completed a task today
  if (data.lastActiveDate === today) {
    // Already counted today
    return data;
  }

  if (data.lastActiveDate === yesterday) {
    // Continue streak
    const next = { current: data.current + 1, longest: Math.max(data.longest, data.current + 1), lastActiveDate: today };
    saveStreak(next);
    return next;
  }

  // First task ever or streak was broken
  const next = { current: 1, longest: Math.max(data.longest, 1), lastActiveDate: today };
  saveStreak(next);
  return next;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RewardsPage() {
  const tasks = useTasks();
  const [selected, setSelected] = useState<(typeof BADGES)[number] | null>(null);
  const [streak, setStreak] = useState<StreakData>({ current: 0, longest: 0, lastActiveDate: "" });

  const petals = 128;
  const nextBloom = 200;
  const progress = Math.round((petals / nextBloom) * 100);

  const hasCompletedTaskToday = tasks.some(
    (t) => t.done && t.bucket === "Today"
  );

  useEffect(() => {
    const computed = computeStreak(hasCompletedTaskToday);
    setStreak(computed);
  }, [hasCompletedTaskToday]);

  const streakEmoji =
    streak.current >= 7 ? "🔥" :
    streak.current >= 3 ? "✨" :
    streak.current >= 1 ? "🌱" : "💤";

  return (
    <AppShell title="Rewards">
      <div className="flex flex-col gap-8">

        {/* ── Streak card ── */}
        <section className="bg-surface-white rounded-xl p-5 border border-dusty-olive/20 shadow-soft flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant">
                Daily streak
              </p>
              <p className="font-display text-3xl text-deep-forest mt-1 flex items-center gap-2">
                {streak.current}
                <span className="text-2xl">{streakEmoji}</span>
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {streak.current === 0
                  ? "Complete a task today to start your streak."
                  : streak.current === 1
                  ? "You started — keep it going tomorrow."
                  : `${streak.current} days in a row. Longest: ${streak.longest}.`}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex gap-1">
                  {i === 0 && [...Array(7)].map((_, j) => (
                    <div
                      key={j}
                      className={
                        "w-6 h-6 rounded-full " +
                        (j < streak.current % 7 || (streak.current >= 7 && j < 7)
                          ? "bg-primary"
                          : "bg-surface-container border border-outline-variant")
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* 7-dot streak row */}
          <div className="flex gap-2 justify-center">
            {[...Array(7)].map((_, i) => {
              const filled = i < Math.min(streak.current, 7);
              return (
                <div
                  key={i}
                  className={
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition " +
                    (filled
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container border border-outline-variant text-on-surface-variant")
                  }
                >
                  {filled ? "✓" : i + 1}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-on-surface-variant text-center">
            Complete at least one task each day to keep your streak alive.
          </p>
        </section>

        {/* ── Petals card ── */}
        <section className="bg-surface-white rounded-xl p-5 border border-dusty-olive/20 shadow-soft flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant">
                Petals collected
              </p>
              <p className="font-display text-3xl text-deep-forest mt-1">{petals}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-clay/20 flex items-center justify-center">
              <span className="material-symbols-outlined filled text-clay text-[32px]">
                local_florist
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-surface-container [&>div]:bg-sage" />
          <p className="text-xs text-on-surface-variant">
            {nextBloom - petals} petals until your next bloom.
          </p>
        </section>

        {/* ── Badges ── */}
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-2xl text-deep-forest">Your Garden</h2>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((b) => (
              <button
                key={b.name}
                type="button"
                onClick={() => setSelected(b)}
                className={
                  "rounded-xl p-3 border flex flex-col items-center gap-2 text-center transition active:scale-95 " +
                  (b.earned
                    ? "bg-surface-white border-dusty-olive/20 shadow-soft hover:border-sage/40"
                    : "bg-surface-container/60 border-outline-variant/40 opacity-70 hover:opacity-90")
                }
              >
                <div
                  className={
                    "w-12 h-12 rounded-full flex items-center justify-center " +
                    (b.earned ? "bg-primary-container/40 text-primary" : "bg-surface-variant text-on-surface-variant")
                  }
                >
                  <span className={"material-symbols-outlined " + (b.earned ? "filled" : "")}>
                    {b.icon}
                  </span>
                </div>
                <p className="text-sm font-medium text-on-surface leading-tight">{b.name}</p>
                <p className="text-[11px] text-on-surface-variant leading-tight">{b.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-primary-container/30 rounded-xl p-4 border border-primary-container/30 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5">eco</span>
          <div className="flex flex-col gap-1">
            <h4 className="text-base font-medium text-on-primary-container">A gentle reminder</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Rewards bloom slowly. Your steadiness is the real garden.
            </p>
          </div>
        </section>
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-deep-forest flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">{selected.icon}</span>
                  {selected.name}
                </DialogTitle>
                <DialogDescription>
                  {selected.earned ? "Earned — well done." : "Still growing — no rush."}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-on-surface-variant leading-relaxed">{selected.detail}</p>
              <p className="text-xs text-on-surface-variant">{selected.desc}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}