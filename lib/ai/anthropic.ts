import "server-only";
import { aiConfig } from "./config";

/* Minimal Anthropic Messages API client (no SDK dependency).
   https://docs.claude.com/en/api/messages */

export class AiError extends Error {
  constructor(
    message: string,
    public code: "not-configured" | "timeout" | "upstream" | "bad-response",
    public status?: number,
  ) {
    super(message);
  }
}

type Block =
  | { type: "text"; text: string }
  | { type: "image"; source: { type: "base64"; media_type: "image/jpeg" | "image/png" | "image/webp"; data: string } };

export async function callClaude(opts: { system: string; content: Block[]; maxTokens?: number; temperature?: number }) {
  const cfg = aiConfig();
  if (!cfg.enabled) throw new AiError("AI is not configured", "not-configured");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), cfg.timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${(process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/$/, "")}/v1/messages`, {
      method: "POST",
      headers: {
        "x-api-key": cfg.key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: cfg.model,
        max_tokens: opts.maxTokens ?? 1200,
        temperature: opts.temperature ?? 0.3,
        system: opts.system,
        messages: [{ role: "user", content: opts.content }],
      }),
      signal: ctrl.signal,
      cache: "no-store",
    });
  } catch (e) {
    clearTimeout(timer);
    if ((e as Error).name === "AbortError") throw new AiError("AI request timed out", "timeout");
    throw new AiError("Could not reach the AI service", "upstream");
  }
  clearTimeout(timer);

  if (!res.ok) {
    // never echo upstream bodies to the client; log status only
    console.error(`[ai] Anthropic API responded ${res.status}`);
    throw new AiError(`AI service error (${res.status})`, "upstream", res.status);
  }
  const data = (await res.json().catch(() => null)) as { content?: { type: string; text?: string }[] } | null;
  const text = data?.content?.filter((b) => b.type === "text").map((b) => b.text ?? "").join("") ?? "";
  if (!text) throw new AiError("Empty AI response", "bad-response");
  return { text, model: cfg.model };
}

/** Pulls the first JSON object out of a model reply. */
export function parseJsonObject<T = unknown>(text: string): T {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new AiError("AI reply was not JSON", "bad-response");
  try {
    return JSON.parse(text.slice(start, end + 1)) as T;
  } catch {
    throw new AiError("AI reply was not valid JSON", "bad-response");
  }
}
