import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support · Soft Oasis" },
      { name: "description", content: "Answers, contacts, and calm guidance when you need a hand." },
    ],
  }),
  component: HelpPage,
});

const FAQ = [
  {
    q: "Is Soft Oasis a replacement for counselling?",
    a: "No. Soft Oasis is a gentle companion for daily balance. If you're in crisis, please use the help button on Balance or contact a professional helpline.",
  },
  {
    q: "Where is my data stored?",
    a: "Tasks and preferences stay on this device in your browser. Buddy chat messages are sent to OpenRouter for AI replies — see Privacy settings for what you choose to share.",
  },
  {
    q: "Can I use Buddy offline?",
    a: "Buddy needs an internet connection for live AI replies through online AI providers. If the service is busy or offline, Buddy will suggest a calm fallback and you can try again shortly. Buddy is for reflection and support, not diagnosis.",
  },
  {
    q: "How do petals and badges work?",
    a: "Petals grow when you complete small wellbeing actions — rest, focus, connection. Badges bloom slowly; there's no rush.",
  },
];

function HelpPage() {
  return (
    <AppShell title="Help">
      <div className="flex flex-col gap-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-primary font-medium w-fit -mt-1"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Link>

        <section className="bg-secondary/10 rounded-xl p-4 border border-secondary/20 flex flex-col gap-2">
          <h2 className="font-display text-lg text-deep-forest">Need someone now?</h2>
          <p className="text-sm text-on-surface-variant">
            If things feel urgent, reach out to a trusted helpline.
          </p>
          <div className="flex flex-col gap-2 mt-1">
            <a
              href="tel:15999"
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary text-on-secondary"
            >
              <span className="material-symbols-outlined">call</span>
              <span className="font-medium">Talian Kasih · 15999</span>
            </a>
            <a
              href="tel:0379568145"
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-white border border-outline-variant"
            >
              <span className="material-symbols-outlined text-primary">support_agent</span>
              <span className="font-medium text-on-surface">Befrienders KL · 03-7956 8145</span>
            </a>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl text-deep-forest">Common questions</h2>
          <Accordion type="single" collapsible className="flex flex-col gap-2">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="bg-surface-white rounded-xl border border-dusty-olive/20 shadow-soft px-4 border-b-0"
              >
                <AccordionTrigger className="text-left text-sm font-medium text-on-surface hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-on-surface-variant leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="bg-surface-white rounded-xl p-4 border border-dusty-olive/20 shadow-soft flex flex-col gap-2">
          <h2 className="font-display text-lg text-deep-forest">Contact us</h2>
          <p className="text-sm text-on-surface-variant">
            Questions about your account or feedback for the team?
          </p>
          <a
            href="mailto:support@oasis.app"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium mt-1"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
            support@oasis.app
          </a>
        </section>
      </div>
    </AppShell>
  );
}
