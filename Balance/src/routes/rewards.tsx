import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

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

function RewardsPage() {
  const [selected, setSelected] = useState<(typeof BADGES)[number] | null>(null);
  const petals = 128;
  const nextBloom = 200;
  const progress = Math.round((petals / nextBloom) * 100);

  return (
    <AppShell title="Rewards">
      <div className="flex flex-col gap-8">
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
