import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Wellness Library · Soft Oasis" },
      { name: "description", content: "Short guides for rest, focus, and gentle academic balance." },
    ],
  }),
  component: LibraryPage,
});

const RESOURCES = [
  {
    id: "breath",
    icon: "air",
    title: "Three-breath reset",
    duration: "2 min",
    summary: "A quick pause between classes to soften your shoulders and steady your mind.",
    body: "Sit comfortably. Inhale for four counts, hold for two, exhale for six. Repeat three times. Notice your jaw unclenching.",
  },
  {
    id: "focus",
    icon: "timer",
    title: "Soft focus block",
    duration: "25 min",
    summary: "One task, one timer, one kind ending — no guilt if you stop early.",
    body: "Pick a single task. Set a 25-minute timer. When it rings, take a five-minute walk or stretch before deciding what's next.",
  },
  {
    id: "sleep",
    icon: "bedtime",
    title: "Wind-down ritual",
    duration: "10 min",
    summary: "Dim screens, dim lights, and let the day settle before sleep.",
    body: "Put your phone face-down. Write one line about what went well. Read something light for ten minutes, then lights out.",
  },
  {
    id: "social",
    icon: "diversity_3",
    title: "Reach out gently",
    duration: "5 min",
    summary: "A small message to someone you trust can lighten a heavy week.",
    body: "Send a simple note — no long explanation needed. 'Thinking of you' is enough. Connection counts, even in small doses.",
  },
];

function LibraryPage() {
  const [open, setOpen] = useState<(typeof RESOURCES)[number] | null>(null);

  return (
    <AppShell title="Library">
      <div className="flex flex-col gap-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-primary font-medium w-fit -mt-1"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Link>

        <p className="text-sm text-on-surface-variant leading-relaxed -mt-2">
          Small practices you can return to whenever the week feels loud.
        </p>

        <div className="flex flex-col gap-3">
          {RESOURCES.map((r) => (
            <button
              key={r.id}
              onClick={() => setOpen(r)}
              className="bg-surface-white rounded-xl border border-dusty-olive/20 shadow-soft p-4 flex items-start gap-4 text-left transition active:scale-[0.99] hover:border-sage/40"
            >
              <div className="w-11 h-11 rounded-full bg-primary-container/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">{r.icon}</span>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-lg text-deep-forest">{r.title}</h2>
                  <span className="text-xs text-on-surface-variant whitespace-nowrap">
                    {r.duration}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{r.summary}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-deep-forest">
                  {open.title}
                </DialogTitle>
                <DialogDescription>{open.summary}</DialogDescription>
              </DialogHeader>
              <p className="text-base text-on-surface-variant leading-relaxed">{open.body}</p>
              <button
                onClick={() => {
                  toast("Saved to your favourites");
                  setOpen(null);
                }}
                className="mt-2 w-full py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition"
              >
                Save for later
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
