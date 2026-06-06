import process from "node:process";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export type OpenRouterChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type OpenRouterFailureReason = "rate_limit" | "timeout" | "config" | "network" | "api";

export class OpenRouterError extends Error {
  readonly reason: OpenRouterFailureReason;
  readonly status?: number;
  readonly retryable: boolean;

  constructor(
    message: string,
    reason: OpenRouterFailureReason,
    options: { status?: number; retryable?: boolean; cause?: unknown } = {},
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "OpenRouterError";
    this.reason = reason;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGemini(messages: OpenRouterChatMessage[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new OpenRouterError("GEMINI_API_KEY not configured", "config");

  const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
  const chatMessages = messages.filter((m) => m.role !== "system");

  const contents = chatMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body: Record<string, unknown> = { contents };
  if (systemMsg) {
    body.systemInstruction = { parts: [{ text: systemMsg }] };
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new OpenRouterError("Gemini rate limit", "rate_limit", { status, retryable: true });
    if (status === 401 || status === 403) throw new OpenRouterError("Gemini auth failed", "config", { status });
    throw new OpenRouterError(`Gemini error ${status}`, "api", { status, retryable: true });
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new OpenRouterError("Gemini returned empty reply", "api", { retryable: true });

  return text;
}

async function callGroq(messages: OpenRouterChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) throw new OpenRouterError("GROQ_API_KEY not configured", "config");

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 768,
      temperature: 0.65,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new OpenRouterError("Groq rate limit", "rate_limit", { status, retryable: true });
    if (status === 401 || status === 403) throw new OpenRouterError("Groq auth failed", "config", { status });
    throw new OpenRouterError(`Groq error ${status}`, "api", { status, retryable: true });
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new OpenRouterError("Groq returned empty reply", "api", { retryable: true });

  return text;
}

export async function chatWithOpenRouter(messages: OpenRouterChatMessage[]): Promise<string> {
  // Try Gemini first, fall back to Groq
  try {
    return await callGemini(messages);
  } catch (geminiError) {
    if (geminiError instanceof OpenRouterError && geminiError.reason === "config") {
      throw geminiError; // No key configured, don't try Groq
    }
    // Gemini failed, try Groq
    await sleep(500);
    try {
      return await callGroq(messages);
    } catch (groqError) {
      // Both failed, throw the Groq error
      throw groqError;
    }
  }
}