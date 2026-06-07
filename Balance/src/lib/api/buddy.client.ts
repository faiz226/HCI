import type { BuddyChatMessage, BuddyChatResult, UserContext } from "../buddy.server";

export async function sendBuddyMessage(
  messages: BuddyChatMessage[],
  context: UserContext,
): Promise<BuddyChatResult> {
  const response = await fetch("/api/buddy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context }),
  });

  if (!response.ok) {
    throw new Error(`Buddy API failed with status ${response.status}`);
  }

  return (await response.json()) as BuddyChatResult;
}