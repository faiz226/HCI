import { chatWithOpenRouter, OpenRouterError } from "./openrouter.server";

const BUDDY_SYSTEM = `You are Buddy, a gentle wellbeing companion in the Soft Oasis app for university students (including IIUM/KICT). Be warm, concise (usually 2–4 sentences), and supportive without being preachy. Help with stress, planning, reflection, and academic balance. Never give medical diagnoses. If someone seems in crisis, gently suggest the in-app crisis support.`;

export type BuddyNotice = "rate_limit" | "timeout" | "offline" | "config";

export type BuddyChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type BuddyChatResult = {
  reply: string;
  notice: BuddyNotice | null;
};

const FALLBACK_BY_NOTICE: Record<BuddyNotice, string> = {
  rate_limit:
    "I'm getting a lot of requests right now. Take one slow breath — try again in a minute and I'll be here.",
  timeout:
    "That took longer than usual on my side. If you're still here, send another message when you're ready.",
  offline:
    "I'm having trouble reaching you right now. Take a slow breath — we can try again whenever you're ready.",
  config:
    "Buddy isn't connected to the AI service yet. Add OPENROUTER_API_KEY to the server environment and restart the app.",
};

function buddyNoticeFromError(error: unknown): BuddyNotice {
  if (error instanceof OpenRouterError) {
    if (error.reason === "config") return "config";
    if (error.reason === "rate_limit") return "rate_limit";
    if (error.reason === "timeout") return "timeout";
    if (error.reason === "network") return "offline";
  }
  return "offline";
}

export async function handleBuddyMessage(messages: BuddyChatMessage[]): Promise<BuddyChatResult> {
  try {
    const reply = await chatWithOpenRouter([
      { role: "system", content: BUDDY_SYSTEM },
      ...messages,
    ]);
    return { reply, notice: null };
  } catch (error) {
    const notice = buddyNoticeFromError(error);
    return { reply: FALLBACK_BY_NOTICE[notice], notice };
  }
}
