import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { handleBuddyMessage } from "@/lib/buddy.server";

const buddyInputSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
  context: z.object({
    name: z.string(),
    email: z.string(),
    petalCount: z.number(),
    petalsToNextBloom: z.number(),
    balanceScore: z.number(),
    balanceLabel: z.string(),
    studyHours: z.number(),
    personalHours: z.number(),
    restHours: z.number(),
    italeemConnected: z.boolean(),
    language: z.string(),
    tasks: z.array(
      z.object({
        title: z.string(),
        category: z.string(),
        bucket: z.string(),
        when: z.string(),
        done: z.boolean(),
      }),
    ),
  }),
});

export const Route = createFileRoute("/api/buddy")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const parsed = buddyInputSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const result = await handleBuddyMessage(
          parsed.data.messages,
          parsed.data.context,
        );
        return Response.json(result);
      },
    },
  },
});