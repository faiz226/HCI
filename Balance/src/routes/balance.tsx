import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { TypographyEyebrow, TypographyH2, TypographyMuted } from "@/components/ui/typography";
import {
  balanceInsight,
  balanceStore,
  computeBalanceScore,
  useBalance,
} from "@/lib/balance-store";
import { toast } from "sonner";

export const Route = createFileRoute("/balance")({
  head: () => ({
    meta: [
      { title: "Balance · Soft Oasis" },
      { name: "description", content: "Your weekly vitality — rest, study, and social, in harmony." },
    ],
  }),
  component: BalancePage,
});

function BalancePage() {
  const hours = useBalance();
  const { score, label } = useMemo(() => computeBalanceScore(hours), [hours]);
  const insight = useMemo(() => balanceInsight(hours), [hours]);

  const update = (key: "study" | "personal" | "rest", value: number) => {
    balanceStore.update({ [key]: value });
  };

  return (
    <AppShell title="Balance" showCrisisFab>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col items-center">
          <div
            className="relative flex aspect-square w-full max-w-[320px] items-center justify-center"
            style={{ filter: "drop-shadow(0 4px 20px rgba(44,61,46,0.05))" }}
          >
            <svg
              className="organic-blob h-full w-full"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45.7,-59.4C58.3,-50.2,67,-36.5,72.3,-21.4C77.6,-6.3,79.5,10.2,74.5,25.1C69.4,40.1,57.4,53.4,43.4,61.9C29.4,70.3,13.4,73.8,-2.6,77.5C-18.7,81.1,-34.8,84.9,-49.4,78.2C-64,71.5,-77.1,54.4,-81.2,37.1C-85.3,19.8,-80.4,2.3,-73.4,-13.4C-66.4,-29,-57.3,-42.8,-45.3,-52.3C-33.3,-61.8,-18.4,-67,0.3,-67.4C19.1,-67.9,33.1,-68.6,45.7,-59.4Z"
                fill="#8A9A86"
                transform="translate(100 100)"
              />
              <path
                d="M41.5,-54.6C53.7,-47.1,63.2,-34.6,68.4,-20.5C73.6,-6.4,74.5,9.3,69.5,23.3C64.5,37.3,53.6,49.6,40.4,57.5C27.2,65.4,11.6,68.8,-3.2,73.2C-18.1,77.6,-32.2,83,-45.8,78.2C-59.5,73.4,-72.6,58.3,-77.9,42.4C-83.2,26.5,-80.7,9.8,-75.7,-5.3C-70.7,-20.5,-63.2,-34.1,-52.1,-43.3C-41,-52.6,-26.3,-57.5,-11.1,-58.5C4.2,-59.5,19.2,-56.6,41.5,-54.6Z"
                fill="#F9F6F0"
                opacity="0.9"
                transform="translate(110 90)"
              />
              <path
                d="M44.4,-61.5C57.4,-53.2,67.6,-40.7,72.4,-26.2C77.2,-11.7,76.6,4.7,71.5,19.3C66.5,33.9,56.9,46.7,44.7,55.8C32.4,64.9,17.5,70.3,2.4,67C-12.7,63.6,-28,51.5,-41.2,40.9C-54.3,30.3,-65.3,21.2,-70.5,8.8C-75.7,-3.6,-75.1,-19.4,-68.2,-33.1C-61.2,-46.8,-47.9,-58.5,-33.8,-66.2C-19.7,-73.9,-4.8,-77.6,9.1,-73.9C23.1,-70.2,31.4,-69.8,44.4,-61.5Z"
                fill="#D48C70"
                opacity="0.85"
                transform="translate(85 110)"
              />
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display block text-5xl leading-none text-deep-forest">
                {score}%
              </span>
              <span className="mt-2 block font-display text-xl text-deep-forest opacity-80">
                {label}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-6">
            <Legend color="#8A9A86" label="Rest" />
            <Legend color="#F9F6F0" label="Study" bordered />
            <Legend color="#D48C70" label="Social" />
          </div>
        </section>

        <section className="rounded-xl border border-dusty-olive/20 bg-surface-white p-4 shadow-soft">
          <div className="mb-4 flex items-start gap-4">
            <div className="rounded-full bg-primary-container/30 p-2">
              <span className="material-symbols-outlined text-[20px] text-primary">lightbulb</span>
            </div>
            <div className="flex flex-col gap-1">
              <TypographyEyebrow className="text-primary">Empathetic insight</TypographyEyebrow>
              <TypographyMuted>{insight}</TypographyMuted>
            </div>
          </div>

          <div className="flex flex-col gap-5 border-t border-outline-variant/30 pt-4">
            <TypographyH2 className="text-xl">Adjust your week</TypographyH2>
            <BalanceSlider
              label="Study time"
              value={hours.study}
              max={40}
              step={0.5}
              display={`${hours.study.toFixed(1)} hrs`}
              onChange={(v) => update("study", v)}
            />
            <BalanceSlider
              label="Personal & social time"
              value={hours.personal}
              max={30}
              step={0.5}
              display={`${hours.personal.toFixed(1)} hrs`}
              onChange={(v) => update("personal", v)}
            />
            <BalanceSlider
              label="Deep rest"
              value={hours.rest}
              max={80}
              step={0.5}
              display={`${hours.rest.toFixed(1)} hrs`}
              onChange={(v) => update("rest", v)}
            />
            <button
              type="button"
              onClick={() => {
                balanceStore.reset();
                toast("Balance reset", { description: "Weekly hours restored to defaults." });
              }}
              className="self-start text-sm text-on-surface-variant transition hover:text-secondary"
            >
              Reset sliders
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <TypographyH2>Weekly vitality</TypographyH2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <VitalityCard label="Academic focus" value={`${hours.study.toFixed(1)} hrs`} delta="+12%" positive />
            <VitalityCard label="Social & personal" value={`${hours.personal.toFixed(1)} hrs`} delta="-4%" />
            <VitalityCard label="Deep rest" value={`${hours.rest.toFixed(1)} hrs`} delta="+2%" positive />
          </div>
        </section>

        <section>
          <div className="relative h-[200px] w-full overflow-hidden rounded-xl shadow-soft">
            <img
              alt="A tranquil, minimalist student lounge with soft linen furniture and sage plants."
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuARgTeN7D4-P_Z4g7s2d94R_EY5r0r99nma3xftKiD3SuQXY1Rof5kYiUD6gVKJOiqflQFZfw3G5PrW5wiMQZpWISMD_Eub4bVklA0Kc3yIb8Eu7GbdP6dVns_XPpjY3UKVOVNBlLNqtFO9dBo3Gvjmh9pRneEp_Da3YNtbmYcZzWfafbq2325eMNpMuBJdsPtDhX-uAxhKzkzGiERyE5awcctcOZAUJzfIiHcavcYt9IyQ7gJIhbCyAHMgfU8AEgupKv-C2wgvjUw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-forest/50 to-transparent" />
            <p className="absolute bottom-4 left-4 font-display text-xl text-white">
              Find your stillness.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function BalanceSlider({
  label,
  value,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm font-normal text-on-surface">{label}</Label>
        <span className="text-sm font-medium text-primary">{display}</span>
      </div>
      <Slider
        value={[value]}
        max={max}
        step={step}
        onValueChange={(next) => onChange(next[0] ?? value)}
        className="py-2"
      />
    </div>
  );
}

function Legend({ color, label, bordered }: { color: string; label: string; bordered?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={"h-3 w-3 rounded-full " + (bordered ? "border border-dusty-olive/40" : "")}
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}

function VitalityCard({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-dusty-olive/20 bg-surface-white p-4 shadow-soft">
      <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl text-deep-forest">{value}</span>
        <span className={"text-xs font-medium " + (positive ? "text-primary" : "text-secondary")}>
          ({delta})
        </span>
      </div>
    </div>
  );
}
