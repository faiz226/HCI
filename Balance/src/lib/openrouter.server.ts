import process from "node:process";

const CEREBRAS_URL = "https://api.cerebras.ai/v1/chat/completions";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const HUGGINGFACE_URL = "https://router.huggingface.co/novita/v3/openai/chat/completions";

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

// ─── Cerebras ───────────────────────────────────────────────────────────────
async function callCerebras(messages: OpenRouterChatMessage[]): Promise<string> {
  const apiKey = process.env.CEREBRAS_API_KEY?.trim();
  if (!apiKey) throw new OpenRouterError("CEREBRAS_API_KEY not configured", "config");

  const response = await fetch(CEREBRAS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.3-70b",
      messages,
      max_tokens: 768,
      temperature: 0.65,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new OpenRouterError("Cerebras rate limit", "rate_limit", { status, retryable: true });
    if (status === 401 || status === 403) throw new OpenRouterError("Cerebras auth failed", "config", { status });
    throw new OpenRouterError(`Cerebras error ${status}`, "api", { status, retryable: true });
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new OpenRouterError("Cerebras returned empty reply", "api", { retryable: true });

  return text;
}

// ─── Groq ────────────────────────────────────────────────────────────────────
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

// ─── Gemini ──────────────────────────────────────────────────────────────────
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

// ─── Mistral ─────────────────────────────────────────────────────────────────
async function callMistral(messages: OpenRouterChatMessage[]): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY?.trim();
  if (!apiKey) throw new OpenRouterError("MISTRAL_API_KEY not configured", "config");

  const response = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages,
      max_tokens: 768,
      temperature: 0.65,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new OpenRouterError("Mistral rate limit", "rate_limit", { status, retryable: true });
    if (status === 401 || status === 403) throw new OpenRouterError("Mistral auth failed", "config", { status });
    throw new OpenRouterError(`Mistral error ${status}`, "api", { status, retryable: true });
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new OpenRouterError("Mistral returned empty reply", "api", { retryable: true });

  return text;
}

// ─── HuggingFace ─────────────────────────────────────────────────────────────
async function callHuggingFace(messages: OpenRouterChatMessage[]): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY?.trim();
  if (!apiKey) throw new OpenRouterError("HUGGINGFACE_API_KEY not configured", "config");

  const response = await fetch(HUGGINGFACE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages,
      max_tokens: 768,
      temperature: 0.65,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429) throw new OpenRouterError("HuggingFace rate limit", "rate_limit", { status, retryable: true });
    if (status === 401 || status === 403) throw new OpenRouterError("HuggingFace auth failed", "config", { status });
    throw new OpenRouterError(`HuggingFace error ${status}`, "api", { status, retryable: true });
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new OpenRouterError("HuggingFace returned empty reply", "api", { retryable: true });

  return text;
}

// ─── Failover chain ──────────────────────────────────────────────────────────
export async function chatWithOpenRouter(messages: OpenRouterChatMessage[]): Promise<string> {
  const providers = [
    { name: "Cerebras", fn: callCerebras },
    { name: "Groq", fn: callGroq },
    { name: "Gemini", fn: callGemini },
    { name: "Mistral", fn: callMistral },
    { name: "HuggingFace", fn: callHuggingFace },
  ];

  let lastError: OpenRouterError | undefined;

  for (const provider of providers) {
    try {
      console.log(`[Buddy] Trying provider: ${provider.name}`);
      const result = await provider.fn(messages);
      console.log(`[Buddy] ✅ Success with: ${provider.name}`);
      return result;
    } catch (error) {
      const normalized =
        error instanceof OpenRouterError
          ? error
          : new OpenRouterError(`${provider.name} failed`, "api", { cause: error });

      console.warn(`[Buddy] ❌ ${provider.name} failed — reason: ${normalized.reason}, status: ${normalized.status ?? "N/A"}`);

      lastError = normalized;

      if (normalized.reason === "config") {
        continue;
      }
      if (normalized.reason === "rate_limit" || normalized.reason === "api") {
        await sleep(300);
        continue;
      }
    }
  }

  console.error("[Buddy] 💀 All providers failed");
  throw lastError ?? new OpenRouterError("All providers failed", "api");
}