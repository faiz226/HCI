import process from "node:process";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Single-model free preset (OpenRouter limits multi-model presets to 3). */
export const DEFAULT_OPENROUTER_MODEL = "@preset/kimi-2-6-free-only";

const DEFAULT_FALLBACK_MODELS = [
  "moonshotai/kimi-k2.6:free",
  "meta-llama/llama-3.3-70b-instruct:free",
] as const;

export type OpenRouterChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type OpenRouterFailureReason = "rate_limit" | "timeout" | "config" | "network" | "api";

export class OpenRouterError extends Error {
  readonly reason: OpenRouterFailureReason;
  readonly status?: number;
  readonly retryable: boolean;
  readonly retryAfterMs?: number;

  constructor(
    message: string,
    reason: OpenRouterFailureReason,
    options: {
      status?: number;
      retryable?: boolean;
      retryAfterMs?: number;
      cause?: unknown;
    } = {},
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "OpenRouterError";
    this.reason = reason;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
    this.retryAfterMs = options.retryAfterMs;
  }
}

type OpenRouterErrorBody = {
  message?: string;
  code?: number | string;
  metadata?: {
    retry_after_seconds?: number;
    retry_after_seconds_raw?: number;
  };
};

type OpenRouterResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: OpenRouterErrorBody;
};

type RetryConfig = {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  timeoutMs: number;
};

function readIntEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function getRetryConfig(): RetryConfig {
  return {
    maxAttempts: readIntEnv("OPENROUTER_MAX_RETRIES", 4, 1, 8),
    baseDelayMs: readIntEnv("OPENROUTER_RETRY_BASE_MS", 1_000, 250, 10_000),
    maxDelayMs: readIntEnv("OPENROUTER_RETRY_MAX_MS", 30_000, 1_000, 120_000),
    timeoutMs: readIntEnv("OPENROUTER_REQUEST_TIMEOUT_MS", 90_000, 5_000, 180_000),
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterHeaderMs(header: string | null): number | undefined {
  if (!header) return undefined;

  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1_000;
  }

  const target = Date.parse(header);
  if (Number.isFinite(target)) {
    return Math.max(0, target - Date.now());
  }

  return undefined;
}

function parseErrorRetryAfterMs(error?: OpenRouterErrorBody): number | undefined {
  const seconds = error?.metadata?.retry_after_seconds ?? error?.metadata?.retry_after_seconds_raw;
  if (typeof seconds === "number" && Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1_000;
  }
  return undefined;
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status === 502 || status === 503 || status === 504;
}

function shouldTryNextModel(error: OpenRouterError): boolean {
  if (error.reason === "config") return false;
  if (error.status === 401 || error.status === 403) return false;
  if (error.status === 400 || error.status === 404) return true;
  return error.reason === "rate_limit" || error.reason === "timeout" || error.reason === "network";
}

function computeBackoffMs(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const exponential = baseDelayMs * 2 ** (attempt - 1);
  const jitter = Math.floor(Math.random() * baseDelayMs * 0.25);
  return Math.min(maxDelayMs, exponential + jitter);
}

function failureReasonForStatus(status: number): OpenRouterFailureReason {
  if (status === 429) return "rate_limit";
  if (status === 408) return "timeout";
  if (status === 401 || status === 403) return "config";
  return "api";
}

function getOpenRouterApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new OpenRouterError("OPENROUTER_API_KEY is not configured", "config", { retryable: false });
  }
  return apiKey;
}

export function getOpenRouterModel(): string {
  return getOpenRouterModels()[0] ?? DEFAULT_OPENROUTER_MODEL;
}

export function getOpenRouterModels(): string[] {
  const primary = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL;
  const fromEnv = process.env.OPENROUTER_FALLBACK_MODELS?.split(",")
    .map((model) => model.trim())
    .filter(Boolean);
  const fallbacks = fromEnv?.length ? fromEnv : [...DEFAULT_FALLBACK_MODELS];
  return [...new Set([primary, ...fallbacks])];
}

function buildRequestBody(model: string, messages: OpenRouterChatMessage[]) {
  const maxTokens = readIntEnv("OPENROUTER_MAX_TOKENS", 768, 128, 4_096);
  const temperature = Number(process.env.OPENROUTER_TEMPERATURE ?? "0.65");

  return {
    model,
    messages,
    max_tokens: maxTokens,
    temperature: Number.isFinite(temperature) ? Math.min(1, Math.max(0, temperature)) : 0.65,
  };
}

async function requestOpenRouter(
  apiKey: string,
  model: string,
  messages: OpenRouterChatMessage[],
  timeoutMs: number,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
        "X-Title": "Soft Oasis Buddy",
      },
      body: JSON.stringify(buildRequestBody(model, messages)),
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => ({}))) as OpenRouterResponse;

    if (!response.ok) {
      const message = data.error?.message ?? `${model} failed with status ${response.status}`;
      const retryAfterMs =
        parseErrorRetryAfterMs(data.error) ??
        (response.status === 429 ? parseRetryAfterHeaderMs(response.headers.get("retry-after")) : undefined);

      throw new OpenRouterError(message, failureReasonForStatus(response.status), {
        status: response.status,
        retryable: isRetryableStatus(response.status),
        retryAfterMs,
      });
    }

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new OpenRouterError(`${model} returned an empty reply`, "api", {
        status: response.status,
        retryable: true,
      });
    }

    return content;
  } catch (error) {
    if (error instanceof OpenRouterError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new OpenRouterError("OpenRouter request timed out", "timeout", {
        retryable: true,
        cause: error,
      });
    }

    throw new OpenRouterError("Could not reach OpenRouter", "network", {
      retryable: true,
      cause: error,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function chatWithModel(
  apiKey: string,
  model: string,
  messages: OpenRouterChatMessage[],
  retryConfig: RetryConfig,
): Promise<string> {
  const { maxAttempts, baseDelayMs, maxDelayMs, timeoutMs } = retryConfig;
  let lastError: OpenRouterError | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await requestOpenRouter(apiKey, model, messages, timeoutMs);
    } catch (error) {
      const normalized =
        error instanceof OpenRouterError
          ? error
          : new OpenRouterError("Unexpected OpenRouter failure", "api", { cause: error });

      lastError = normalized;
      const isLastAttempt = attempt >= maxAttempts;

      if (!normalized.retryable || isLastAttempt) {
        throw normalized;
      }

      const delayMs = normalized.retryAfterMs ?? computeBackoffMs(attempt, baseDelayMs, maxDelayMs);
      await sleep(delayMs);
    }
  }

  throw lastError ?? new OpenRouterError("OpenRouter request failed", "api");
}

export async function chatWithOpenRouter(messages: OpenRouterChatMessage[]): Promise<string> {
  const apiKey = getOpenRouterApiKey();
  const models = getOpenRouterModels();
  const retryConfig = getRetryConfig();

  let lastError: OpenRouterError | undefined;

  for (const model of models) {
    try {
      return await chatWithModel(apiKey, model, messages, retryConfig);
    } catch (error) {
      const normalized =
        error instanceof OpenRouterError
          ? error
          : new OpenRouterError("Unexpected OpenRouter failure", "api", { cause: error });

      lastError = normalized;

      if (!shouldTryNextModel(normalized)) {
        throw normalized;
      }
    }
  }

  throw lastError ?? new OpenRouterError("OpenRouter request failed", "api");
}
