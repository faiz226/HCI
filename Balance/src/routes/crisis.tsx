import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  TypographyEyebrow,
  TypographyH2,
  TypographyLead,
  TypographyMuted,
} from "@/components/ui/typography";
import { useSession } from "@/lib/session-store";
import { useTasks } from "@/lib/tasks-store";
import { toast } from "sonner";

export const Route = createFileRoute("/crisis")({
  head: () => ({
    meta: [
      { title: "Support · Soft Oasis" },
      {
        name: "description",
        content: "Crisis support — triage tasks, breathe, and reach someone who can help.",
      },
    ],
  }),
  component: CrisisPage,
});

const REASONS = [
  "Severe academic overload",
  "Medical emergency",
  "Family emergency",
  "Mental health crisis",
  "Technical issues",
];

const CONTACTS = [
  {
    label: "Talian Kasih",
    detail: "15999 · 24/7",
    icon: "call",
    href: "tel:15999",
    tone: "secondary" as const,
  },
  {
    label: "IIUM Counseling Centre",
    detail: "+603-6196 4000",
    icon: "psychology",
    href: "tel:+60361964000",
    tone: "primary" as const,
  },
  {
    label: "Befrienders KL",
    detail: "03-7956 8145",
    icon: "favorite",
    href: "tel:0379568145",
    tone: "clay" as const,
  },
  {
    label: "IIUM Student Affairs",
    detail: "sao@iium.edu.my",
    icon: "mail",
    href: "mailto:sao@iium.edu.my",
    tone: "sage" as const,
  },
];

type Phase = "Inhale" | "Hold" | "Exhale";

const PHASE_COLORS: Record<Phase, string> = {
  Inhale: "#8a9a86",
  Hold: "#536251",
  Exhale: "#d48c70",
};

function CrisisPage() {
  const tasks = useTasks();
  const session = useSession();
  const urgentTasks = useMemo(
    () =>
      tasks.filter(
        (t) =>
          !t.done &&
          (t.bucket === "Today" || (t.bucket === "Tomorrow" && t.category === "Kuliyyah")),
      ),
    [tasks],
  );

  const academicTasks = useMemo(
    () => tasks.filter((t) => t.category === "Kuliyyah" && !t.done),
    [tasks],
  );

  const [selectedTask, setSelectedTask] = useState(urgentTasks[0]?.title ?? "");
  const [reason, setReason] = useState(REASONS[0]);
  const [lecturer, setLecturer] = useState("");
  const [emailDraft, setEmailDraft] = useState("");

  const [breathing, setBreathing] = useState(false);
  const [phase, setPhase] = useState<Phase>("Inhale");
  const [count, setCount] = useState(4);
  const [scale, setScale] = useState(0.72);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<Phase>("Inhale");

  useEffect(() => {
    if (urgentTasks.length && !urgentTasks.some((t) => t.title === selectedTask)) {
      setSelectedTask(urgentTasks[0]?.title ?? "");
    }
  }, [urgentTasks, selectedTask]);

  useEffect(() => {
    return () => {
      if (breathRef.current) clearInterval(breathRef.current);
    };
  }, []);

  const generatedEmail =
    selectedTask && lecturer.trim()
      ? `Dear ${lecturer.trim()},

I am writing to respectfully request a deadline extension for "${selectedTask}".

Due to ${reason.toLowerCase()}, I have been unable to meet the original deadline. I remain committed to submitting quality work and kindly request a 3 to 5 day extension.

Thank you for your understanding.

Warm regards,
${session.name}
KICT student`
      : "";

  useEffect(() => {
    setEmailDraft(generatedEmail);
  }, [selectedTask, reason, lecturer, session.name]);

  const runPhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
    setScale(next === "Exhale" ? 0.72 : 1);
    let c = 4;
    setCount(c);
    if (breathRef.current) clearInterval(breathRef.current);
    breathRef.current = setInterval(() => {
      c -= 1;
      setCount(c);
      if (c <= 0) {
        if (breathRef.current) clearInterval(breathRef.current);
        const following: Phase =
          next === "Inhale" ? "Hold" : next === "Hold" ? "Exhale" : "Inhale";
        runPhase(following);
      }
    }, 1000);
  };

  const startBreathing = () => {
    setBreathing(true);
    toast("Breathing coach started", { description: "Follow the 4-4-4 rhythm at your pace." });
    runPhase("Inhale");
  };

  const stopBreathing = () => {
    setBreathing(false);
    if (breathRef.current) clearInterval(breathRef.current);
    setPhase("Inhale");
    setCount(4);
    setScale(0.72);
  };

  const copyEmail = async () => {
    const text = emailDraft.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast("Email copied", { description: "Paste it into your mail app when you're ready." });
    } catch {
      toast("Could not copy", { description: "Select the text and copy manually." });
    }
  };

  return (
    <AppShell title="Support">
      <div className="flex flex-col gap-8 pb-4">
        <Link
          to="/balance"
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary -mt-1"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Balance
        </Link>

        <header className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-error/20 bg-error/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-error">
            <span className="material-symbols-outlined text-[14px]">emergency</span>
            Crisis mode
          </span>
          <TypographyH2>You've got this.</TypographyH2>
          <TypographyLead>Triage what matters most. One gentle step at a time.</TypographyLead>
        </header>

        <section className="rounded-xl border border-error/20 bg-surface-white p-4 shadow-soft">
          <TypographyEyebrow className="mb-3">Urgent tasks</TypographyEyebrow>
          {urgentTasks.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-primary">
              <span className="material-symbols-outlined filled text-[18px]">check_circle</span>
              No urgent tasks right now.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {urgentTasks.map((task) => (
                <li key={task.id} className="flex items-start gap-3 border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-error" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-on-surface">{task.title}</p>
                    <TypographyMuted>
                      {task.category} · {task.when}
                    </TypographyMuted>
                  </div>
                  <span className="rounded-full bg-secondary-container/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-secondary">
                    Extendable
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-dusty-olive/20 bg-surface-white p-4 shadow-soft flex flex-col gap-4">
          <div>
            <TypographyEyebrow>Extension email</TypographyEyebrow>
            <TypographyMuted className="mt-1">
              Draft a respectful note — edit anything before you send.
            </TypographyMuted>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Assignment</Label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {academicTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setSelectedTask(task.title)}
                  className={
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition " +
                    (selectedTask === task.title
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant bg-surface-container text-on-surface")
                  }
                >
                  {task.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Reason</Label>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setReason(item)}
                  className={
                    "rounded-full px-3 py-1.5 text-xs font-medium transition " +
                    (reason === item
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant bg-surface-container text-on-surface")
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="lecturer">Lecturer name</Label>
            <Textarea
              id="lecturer"
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
              placeholder="e.g. Dr. Hashim"
              rows={2}
              className="bg-surface-container/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email-body">Email preview</Label>
            <Textarea
              id="email-body"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              placeholder="Select an assignment and enter a lecturer name to generate a draft."
              rows={8}
              className="bg-surface-container/20 font-mono text-sm leading-relaxed"
            />
          </div>

          <button
            type="button"
            disabled={!emailDraft.trim()}
            onClick={copyEmail}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Copy email to clipboard
          </button>
        </section>

        <section className="rounded-xl border border-dusty-olive/20 bg-surface-white p-4 shadow-soft flex flex-col gap-4">
          <div>
            <TypographyEyebrow>Box breathing</TypographyEyebrow>
            <TypographyMuted className="mt-1">
              4-4-4 rhythm — inhale, hold, exhale, each for four counts.
            </TypographyMuted>
          </div>

          <div className="flex items-center justify-center py-4">
            <div
              className="flex flex-col items-center justify-center rounded-full border-[3px] transition-all duration-[4000ms] ease-in-out"
              style={{
                width: `${scale * 140}px`,
                height: `${scale * 140}px`,
                borderColor: PHASE_COLORS[phase],
                backgroundColor: `${PHASE_COLORS[phase]}22`,
              }}
            >
              <span className="text-sm font-medium text-on-surface">{phase}</span>
              <span className="font-display text-3xl" style={{ color: PHASE_COLORS[phase] }}>
                {count}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={breathing ? stopBreathing : startBreathing}
            className={
              "flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition " +
              (breathing
                ? "bg-error text-white hover:opacity-90"
                : "bg-primary text-on-primary hover:opacity-90")
            }
          >
            <span className="material-symbols-outlined text-[18px]">
              {breathing ? "stop" : "play_arrow"}
            </span>
            {breathing ? "Stop Exercise" : "Start breathing"}
          </button>
        </section>

        <section className="rounded-xl border border-dusty-olive/20 bg-surface-white p-4 shadow-soft">
          <TypographyEyebrow className="mb-3">Reach someone now</TypographyEyebrow>
          <ul className="flex flex-col gap-1">
            {CONTACTS.map((contact) => (
              <li key={contact.label}>
                <a
                  href={contact.href}
                  className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-surface-container"
                >
                  <span
                    className={
                      "flex h-10 w-10 items-center justify-center rounded-xl " +
                      (contact.tone === "secondary"
                        ? "bg-secondary/15 text-secondary"
                        : contact.tone === "clay"
                          ? "bg-clay/15 text-clay"
                          : contact.tone === "sage"
                            ? "bg-sage/15 text-primary"
                            : "bg-primary-container/40 text-primary")
                    }
                  >
                    <span className="material-symbols-outlined text-[20px]">{contact.icon}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <p className="font-medium text-on-surface">{contact.label}</p>
                    <TypographyMuted>{contact.detail}</TypographyMuted>
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
