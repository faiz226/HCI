import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BuddyMessageText } from "@/components/BuddyMessageText";
import { toast } from "sonner";

export const Route = createFileRoute("/buddy")({
  head: () => ({
    meta: [
      { title: "Buddy · Soft Oasis" },
      { name: "description", content: "A quiet companion to think things through with." },
    ],
  }),
  component: BuddyPage,
});

type Msg = { id: string; role: "buddy" | "me"; text: string };

const SEED: Msg[] = [
  { id: "1", role: "buddy", text: "How is your heart today, Aisyah?" },
  { id: "2", role: "me", text: "A little stretched. Three deadlines this week." },
  {
    id: "3",
    role: "buddy",
    text: "That's a lot to carry at once. Want to pick just one to soften first?",
  },
];

const SUGGESTIONS = [
  "Help me unwind",
  "Plan my afternoon",
  "I feel overwhelmed",
  "A short reflection",
];

function toApiMessages(msgs: Msg[]) {
  return msgs.map((m) => ({
    role: m.role === "me" ? ("user" as const) : ("assistant" as const),
    content: m.text,
  }));
}

function BuddyPage() {
  const [msgs, setMsgs] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Msg = { id: String(Date.now()), role: "me", text: trimmed };
    const nextMsgs = [...msgs, userMsg];
    setMsgs(nextMsgs);
    setInput("");
    setLoading(true);

    try {
      const { sendBuddyMessage } = await import("@/lib/api/buddy.client");
      const { reply, notice } = await sendBuddyMessage(toApiMessages(nextMsgs));
      setMsgs((current) => [
        ...current,
        { id: String(Date.now() + 1), role: "buddy", text: reply },
      ]);

      if (notice === "rate_limit") {
        toast.message("Buddy is a little busy", {
          description: "OpenRouter is rate-limiting requests. Wait a moment, then try again.",
        });
      } else if (notice === "timeout") {
        toast.message("That took a while", {
          description: "The AI service was slow. You can send another message when ready.",
        });
      } else if (notice === "config") {
        toast.error("Buddy isn't configured", {
          description: "Set OPENROUTER_API_KEY in .env and restart the dev server.",
        });
      } else if (notice) {
        toast.error("Buddy couldn't connect right now", {
          description: "Check your connection and try again in a moment.",
        });
      }
    } catch {
      toast.error("Buddy couldn't connect right now", {
        description: "Check your connection and try again in a moment.",
      });
      setMsgs((current) => [
        ...current,
        {
          id: String(Date.now() + 1),
          role: "buddy",
          text: "I'm having trouble reaching you right now. Take a slow breath — we can try again whenever you're ready.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Buddy">
      <div className="flex flex-col gap-6 pb-24">
        <section className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-container/50 flex items-center justify-center">
            <span className="material-symbols-outlined filled text-primary text-[32px]">
              smart_toy
            </span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-display text-xl text-deep-forest">Your Buddy</h2>
            <p className="text-sm text-on-surface-variant">Here when you'd like to talk.</p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={
                "max-w-[85%] px-4 py-3 rounded-2xl " +
                (m.role === "buddy"
                  ? "bg-surface-white border border-dusty-olive/20 shadow-soft rounded-tl-md self-start"
                  : "bg-primary-container/40 text-on-primary-container rounded-tr-md self-end")
              }
            >
              {m.role === "buddy" ? (
                <BuddyMessageText text={m.text} className="text-base leading-relaxed" />
              ) : (
                <p className="text-base leading-relaxed">{m.text}</p>
              )}
            </div>
          ))}
          {loading && (
            <div className="max-w-[85%] self-start px-4 py-3 rounded-2xl rounded-tl-md bg-surface-white border border-dusty-olive/20 shadow-soft">
              <p className="text-sm text-on-surface-variant animate-pulse">Buddy is thinking…</p>
            </div>
          )}
        </section>

        <section className="flex gap-2 flex-wrap">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={loading}
              onClick={() => send(s)}
              className="px-4 py-2 rounded-full bg-surface-white border border-outline-variant text-sm text-on-surface hover:bg-surface-container transition disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </section>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="fixed bottom-24 left-0 right-0 px-6"
      >
        <div className="flex items-center gap-2 bg-surface-white rounded-full border border-outline-variant shadow-soft px-4 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say what's on your mind…"
            disabled={loading}
            className="flex-1 bg-transparent outline-none text-base text-on-surface placeholder:text-on-surface-variant/70 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-90 transition disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </form>
    </AppShell>
  );
}
