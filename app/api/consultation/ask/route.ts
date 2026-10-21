import { NextResponse } from "next/server";
import { sanitizeAnswers } from "@/lib/consultation/questions";
import { aiConfig } from "@/lib/ai/config";
import { AiError, callClaude, parseJsonObject } from "@/lib/ai/anthropic";
import { compactCatalogue, knownSlug, SAFETY_RULES } from "@/lib/ai/catalog-context";
import { safeAnswer } from "@/lib/ai/guard";
import { clientKey, rateLimit } from "@/lib/ai/rate-limit";

export const dynamic = "force-dynamic";

/* POST /api/consultation/ask  { question, answers, routine: string[], history?: {q,a}[] }
   Follow-up questions about a personalised routine, answered by Claude
   from CO2's catalogue only. Returns 503 when AI isn't configured. */
export async function POST(req: Request) {
  const cfg = aiConfig();
  if (!cfg.enabled) {
    return NextResponse.json({ error: "not-configured", message: "The AI assistant isn't configured on this site yet." }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as { question?: unknown; answers?: unknown; routine?: unknown; history?: unknown } | null;
  const question = typeof body?.question === "string" ? body.question.replace(/[\u0000-\u001f\u007f<>]/g, " ").trim() : "";
  if (question.length < 3) return NextResponse.json({ error: "invalid", message: "Please type a question." }, { status: 400 });
  if (question.length > 500) return NextResponse.json({ error: "invalid", message: "Please keep your question under 500 characters." }, { status: 400 });

  const rl = rateLimit(`ask:${clientKey(req)}`, 20, 10 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "rate-limited", message: `Too many questions — please try again in ${rl.retryAfter}s.` }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const answers = sanitizeAnswers(body?.answers);
  const routine = Array.isArray(body?.routine) ? body!.routine.filter(knownSlug).slice(0, 20) : [];
  const history = Array.isArray(body?.history)
    ? (body!.history as { q?: unknown; a?: unknown }[])
        .slice(-4)
        .map((h) => ({ q: String(h.q ?? "").slice(0, 500), a: String(h.a ?? "").slice(0, 900) }))
    : [];

  const system = `You are CO2's skincare consultant on the CO2 cosmetics website, answering a customer's follow-up question about their personalised routine.
${SAFETY_RULES}
- Only recommend products from the catalogue provided. Refer to a product by writing its slug in double square brackets, e.g. [[24k-gold-face-elixir]], so the site can link it.
- If the question isn't about skincare, CO2 products or their routine, politely say you can only help with those.
- If the catalogue doesn't have something they ask for, say so plainly.
- Keep answers under 120 words, plain text, no markdown headings.
Reply with JSON only: {"answer": string, "products": string[] (slugs you referenced)}`;

  const context = { customer_answers: answers, their_routine_slugs: routine, catalogue: compactCatalogue(), previous_turns: history, question };

  try {
    const { text, model } = await callClaude({ system, content: [{ type: "text", text: JSON.stringify(context) }], maxTokens: 700 });
    const raw = parseJsonObject<{ answer?: unknown; products?: unknown }>(text);
    let answer = safeAnswer(raw.answer, 1200);
    if (!answer) throw new AiError("answer failed validation", "bad-response");
    // strip references to anything that isn't a real product
    answer = answer
      .replace(/\[\[([a-z0-9-]+)\]\]/g, (m, s) => (knownSlug(s) ? m : ""))
      .replace(/\s+(?:or|and)\s*([.,;!?])/g, "$1")
      .replace(/\s+([.,;!?])/g, "$1");
    const products = [...new Set([...(Array.isArray(raw.products) ? raw.products : []), ...[...answer.matchAll(/\[\[([a-z0-9-]+)\]\]/g)].map((m) => m[1])])].filter(knownSlug).slice(0, 6);
    return NextResponse.json({ answer, products, model });
  } catch (e) {
    console.error("[ai] ask failed:", e instanceof AiError ? e.code : "unknown");
    return NextResponse.json({ error: "ai-error", message: "The assistant couldn't answer just now. Please try again, or contact us." }, { status: 502 });
  }
}
