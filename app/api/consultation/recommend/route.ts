import { NextResponse } from "next/server";
import { sanitizeAnswers, visibleQuestions, isAnswered } from "@/lib/consultation/questions";
import { buildPlan, planSlugs, roleLabels, type Plan } from "@/lib/consultation/engine";
import { aiConfig } from "@/lib/ai/config";
import { AiError, callClaude, parseJsonObject } from "@/lib/ai/anthropic";
import { productFacts, SAFETY_RULES } from "@/lib/ai/catalog-context";
import { safeText } from "@/lib/ai/guard";
import { clientKey, rateLimit } from "@/lib/ai/rate-limit";
import { getProduct } from "@/lib/catalog";
import type { AiLayer } from "@/lib/consultation/types";

export const dynamic = "force-dynamic";

/* POST /api/consultation/recommend  { answers }
   1. Validates answers and builds the deterministic catalogue plan (always).
   2. If AI is configured, asks Claude to write personalised explanations
      for THOSE products only. Product choice never comes from the model.
   3. Every AI string is filtered; any failure falls back to the plan. */


export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !("answers" in body)) {
    return NextResponse.json({ error: "Send your consultation answers as { answers }." }, { status: 400 });
  }
  const answers = sanitizeAnswers((body as { answers: unknown }).answers);
  const missing = visibleQuestions(answers).filter((q) => !isAnswered(q, answers));
  if (missing.length) {
    return NextResponse.json({ error: "Some questions still need an answer.", missing: missing.map((q) => q.id) }, { status: 422 });
  }

  const plan = buildPlan(answers);
  const cfg = aiConfig();
  if (!cfg.enabled) {
    return NextResponse.json({ plan, ai: { status: "not-configured", message: "AI explanations are not configured on this site. Recommendations are matched from CO2's catalogue data." } satisfies AiLayer });
  }

  const rl = rateLimit(`rec:${clientKey(req)}`, 12, 10 * 60_000);
  if (!rl.ok) return NextResponse.json({ plan, ai: { status: "rate-limited", message: "Too many requests — showing catalogue-matched explanations." } satisfies AiLayer });

  try {
    const ai = await explain(plan, answers);
    return NextResponse.json({ plan, ai });
  } catch (e) {
    const code = e instanceof AiError ? e.code : "upstream";
    console.error("[ai] recommend failed:", code);
    return NextResponse.json({ plan, ai: { status: "error", message: "The AI service didn't respond, so these explanations come from CO2's catalogue data." } satisfies AiLayer });
  }
}

async function explain(plan: Plan, answers: ReturnType<typeof sanitizeAnswers>): Promise<AiLayer> {
  const slugs = planSlugs(plan);
  const items = slugs
    .map((s) => {
      const p = getProduct(s);
      const pick = plan.picks.find((x) => x.slug === s);
      if (!p || !pick) return null;
      return { ...productFacts(p), routine_step: roleLabels[pick.role], catalogue_reasons: pick.reasons, cautions: pick.cautions };
    })
    .filter(Boolean);

  const system = `You are CO2's skincare consultant, writing the explanation layer of a personalised routine on the CO2 cosmetics website.
The products have already been chosen by CO2's catalogue-matching engine. You do not choose or add products — you explain the chosen ones in warm, precise, editorial English (British spelling), addressed to the customer as "you".
${SAFETY_RULES}
Reply with JSON only, no prose around it, matching:
{"intro": string (2 sentences max, ≤ 320 chars, may use their name), "explanations": {"<slug>": string (1–2 sentences, ≤ 260 chars, grounded in that product's facts and the customer's answers)}, "tips": string[] (max 3, each ≤ 180 chars, practical routine tips such as order, patch-testing or pacing — only about the given products)}`;

  const user = {
    customer_answers: answers,
    profile: plan.profile,
    routine: { morning: plan.morning, evening: plan.evening, weekly: plan.weekly, body: plan.body, hair: plan.hair, lips: plan.lips },
    products: items,
    limitations_already_shown: plan.limitations,
  };

  const { text, model } = await callClaude({ system, content: [{ type: "text", text: JSON.stringify(user) }], maxTokens: 1400 });
  const raw = parseJsonObject<{ intro?: unknown; explanations?: Record<string, unknown>; tips?: unknown }>(text);

  const explanations: Record<string, string> = {};
  for (const s of slugs) {
    const t = safeText(raw.explanations?.[s], 300);
    if (t) explanations[s] = t;
  }
  const tips = Array.isArray(raw.tips) ? raw.tips.map((t) => safeText(t, 200)).filter((t): t is string => !!t).slice(0, 3) : [];
  const intro = safeText(raw.intro, 360) ?? undefined;
  if (!intro && !Object.keys(explanations).length) throw new AiError("AI output failed validation", "bad-response");
  return { status: "ok", model, intro, explanations, tips };
}
