import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Smiley, SmileyMelting, SmileyNervous, type IconProps } from "@phosphor-icons/react";
import { AppShell } from "@/components/AppShell";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTasks, tasksStore } from "@/lib/tasks-store";
import { useSession } from "@/lib/session-store";
import { useSettings } from "@/lib/settings-store";
import { useBalance, computeBalanceScore } from "@/lib/balance-store";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home · Soft Oasis" },
      { name: "description", content: "Your daily oasis — gentle nudges, today's focus, and reflective moments." },
    ],
  }),
  component: HomePage,
});

type MoodLevel = {
  label: string;
  hint: string;
  emoji?: string;
  Icon?: ComponentType<IconProps>;
};

const MOOD_LEVELS: MoodLevel[] = [
  { label: "Calm", emoji: "🌿", hint: "You're grounded today." },
  { label: "Okay", Icon: Smiley, hint: "Steady enough to carry on." },
  { label: "Stressed", Icon: SmileyMelting, hint: "A lighter pace might help." },
  { label: "Anxious", Icon: SmileyNervous, hint: "Try a short pause or talk to Buddy." },
  { label: "Panic", emoji: "🆘", hint: "Crisis support is one tap away." },
];

function MoodIcon({ mood }: { mood: MoodLevel }) {
  if (mood.Icon) {
    const Icon = mood.Icon;
    return <Icon className="h-6 w-6 text-sage" weight="duotone" aria-hidden />;
  }
  return <span aria-hidden>{mood.emoji}</span>;
}

function HomePage() {
  const navigate = useNavigate();
  const tasks = useTasks();
  const session = useSession();
  const settings = useSettings();
  const balance = useBalance();
  const { score: balanceScore, label: balanceLabel } = computeBalanceScore(balance);
  const italeemTipRef = useRef<HTMLElement>(null);
  const [showItaleemTip, setShowItaleemTip] = useState(false);
  const today = tasks.filter((t) => t.bucket === "Today").slice(0, 3);
  const remaining = tasks.filter((t) => !t.done).length;
  const [breathOpen, setBreathOpen] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [moodIndex, setMoodIndex] = useState(1);
  const mood = MOOD_LEVELS[moodIndex];
  const isPanic = moodIndex === MOOD_LEVELS.length - 1;

  const handleMoodCommit = (value: number[]) => {
    const next = value[0] ?? moodIndex;
    setMoodIndex(next);
    if (next === MOOD_LEVELS.length - 1) {
      toast("Opening crisis support…");
      navigate({ to: "/crisis" });
    }
  };

  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => {
    if (settings.italeemConnected) return;

    const onScroll = () => {
      setShowItaleemTip(window.scrollY > 280);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [settings.italeemConnected]);

  const firstName = session.signedIn ? session.name.split(" ")[0] : "friend";

  const startBreath = () => {
    setBreathStep(0);
    setBreathOpen(true);
  };

  const nextBreath = () => {
    if (breathStep >= 2) {
      setBreathOpen(false);
      toast("Nice pause. Your afternoon can be softer now.");
      return;
    }
    setBreathStep((s) => s + 1);
  };

  const breathPrompts = [
    "Inhale slowly for four counts…",
    "Hold gently for two…",
    "Exhale for six. Let your shoulders drop.",
  ];

  return (
    <AppShell title="Home">
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-wider text-on-surface-variant">{greeting}</p>
          <h2 className="font-display text-3xl text-deep-forest">
            {firstName},
            <br />
            take it gently today.
          </h2>
          <p className="text-base text-on-surface-variant leading-relaxed max-w-prose">
            You're {balanceScore}% balanced this week — {balanceLabel.toLowerCase()}.
          </p>
        </section>

        <section
          className={
            "rounded-xl border p-4 shadow-soft flex flex-col gap-4 transition-colors " +
            (isPanic
              ? "border-secondary/40 bg-secondary-container/20"
              : "border-dusty-olive/20 bg-surface-white")
          }
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-wider text-on-surface-variant">
                How are you feeling?
              </p>
              <h3 className="font-display text-xl text-deep-forest flex items-center gap-2">
                <MoodIcon mood={mood} />
                {mood.label}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{mood.hint}</p>
            </div>
          </div>
          <Slider
            min={0}
            max={MOOD_LEVELS.length - 1}
            step={1}
            value={[moodIndex]}
            onValueChange={(value) => setMoodIndex(value[0] ?? moodIndex)}
            onValueCommit={handleMoodCommit}
            aria-label="Mood level"
            className={isPanic ? "[&_[role=slider]]:border-secondary [&_[role=slider]]:bg-secondary" : ""}
          />
          <div className="flex justify-between text-[10px] uppercase tracking-wide text-on-surface-variant">
            {MOOD_LEVELS.map((level, index) => (
              <span
                key={level.label}
                className={index === moodIndex ? "font-semibold text-deep-forest" : ""}
              >
                {level.label}
              </span>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <Link
            to="/balance"
            className="bg-surface-white rounded-xl p-4 border border-dusty-olive/20 shadow-soft flex flex-col gap-2 transition-transform active:scale-[0.98] hover:border-sage/30"
          >
            <span className="material-symbols-outlined text-sage">spa</span>
            <span className="text-xs uppercase tracking-wider text-on-surface-variant">Balance</span>
            <span className="font-display text-2xl text-deep-forest">{balanceScore}%</span>
          </Link>
          <Link
            to="/tasks"
            className="bg-surface-white rounded-xl p-4 border border-dusty-olive/20 shadow-soft flex flex-col gap-2 transition-transform active:scale-[0.98] hover:border-clay/30"
          >
            <span className="material-symbols-outlined text-clay">checklist</span>
            <span className="text-xs uppercase tracking-wider text-on-surface-variant">Open</span>
            <span className="font-display text-2xl text-deep-forest">
              {remaining} task{remaining === 1 ? "" : "s"}
            </span>
          </Link>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl text-deep-forest">Today's gentle plan</h3>
            <Link to="/tasks" className="text-sm text-primary font-medium">
              View all
            </Link>
          </div>
          {today.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Nothing for today. Rest is productive.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {today.map((t) => {
                const tone = t.category === "Kuliyyah" ? "sage" : "clay";
                return (
                  <li
                    key={t.id}
                    className="bg-surface-white rounded-xl border border-dusty-olive/20 shadow-soft flex items-stretch overflow-hidden"
                  >
                    <span className={"w-1.5 " + (tone === "sage" ? "bg-sage" : "bg-clay")} />
                    <div className="flex items-center gap-3 p-3 flex-1">
                      <button
                        aria-label={t.done ? "Mark not done" : "Mark done"}
                        onClick={() => tasksStore.toggle(t.id)}
                        className={
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition " +
                          (tone === "sage" ? "border-sage" : "border-clay") +
                          (t.done ? (tone === "sage" ? " bg-sage" : " bg-clay") : "")
                        }
                      >
                        {t.done && (
                          <span className="material-symbols-outlined text-white text-[14px]">
                            check
                          </span>
                        )}
                      </button>
                      <div className="flex flex-col">
                        <span
                          className={
                            "text-base text-on-surface " +
                            (t.done ? "line-through opacity-60" : "")
                          }
                        >
                          {t.title}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {t.category} · {t.when}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="bg-primary-container/30 rounded-xl p-4 border border-primary-container/30 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary mt-0.5">self_improvement</span>
          <div className="flex flex-col gap-2 flex-1">
            <h4 className="text-base font-medium text-on-primary-container">A pause before noon</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Three slow breaths now can soften the rest of your afternoon.
            </p>
            <button
              onClick={startBreath}
              className="self-start px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition active:scale-95"
            >
              Start breathing
            </button>
          </div>
        </section>

        {!settings.italeemConnected && (
          <section
            ref={italeemTipRef}
            className={
              "rounded-xl border border-sage/30 bg-surface-white p-4 shadow-soft flex flex-col gap-3 transition-all duration-500 " +
              (showItaleemTip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none")
            }
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-sage mt-0.5">school</span>
              <div className="flex flex-col gap-2 flex-1">
                <h4 className="font-display text-lg text-deep-forest">Connect i-Taleem</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Link your IIUM student account so tasks and deadlines stay in sync with your
                  real schedule.
                </p>
                <Link
                  to="/settings"
                  search={{ tab: "integrations" }}
                  className="self-start px-4 py-2 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition active:scale-95"
                >
                  Connect in Settings
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>

      <Dialog open={breathOpen} onOpenChange={setBreathOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-deep-forest">
              Breath {breathStep + 1} of 3
            </DialogTitle>
            <DialogDescription>{breathPrompts[breathStep]}</DialogDescription>
          </DialogHeader>
          <div className="py-6 flex justify-center">
            <div
              className="w-24 h-24 rounded-full bg-primary-container/50 flex items-center justify-center animate-pulse"
              style={{ animationDuration: "4s" }}
            >
              <span className="material-symbols-outlined filled text-primary text-[40px]">air</span>
            </div>
          </div>
          <button
            onClick={nextBreath}
            className="w-full py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition"
          >
            {breathStep >= 2 ? "Finish" : "Next breath"}
          </button>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}