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

        const result = await handleBuddyMessage(parsed.data.messages);
        return Response.json(result);
      },
    },
  },
});
