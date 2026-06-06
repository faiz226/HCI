import type { BuddyChatMessage, BuddyChatResult } from "../buddy.server";

export async function sendBuddyMessage(messages: BuddyChatMessage[]): Promise<BuddyChatResult> {
  const response = await fetch("/api/buddy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`Buddy API failed with status ${response.status}`);
  }

  return (await response.json()) as BuddyChatResult;
}
