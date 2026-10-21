import { NextResponse } from "next/server";
import { aiConfig } from "@/lib/ai/config";
import { AiError, callClaude, parseJsonObject } from "@/lib/ai/anthropic";
import { safeText } from "@/lib/ai/guard";
import { clientKey, rateLimit } from "@/lib/ai/rate-limit";
import { questionById } from "@/lib/consultation/questions";

export const dynamic = "force-dynamic";

/* POST /api/consultation/photo  { image: "data:image/jpeg;base64,…" }
   Optional photo-based SUGGESTIONS for the skin-type and concerns
   questions. Off unless CO2_AI_PHOTO_ANALYSIS=true. The photo is sent to
   the AI provider for this one request and is never stored or logged.
   The customer always confirms or changes the suggestions. */

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export async function POST(req: Request) {
  const cfg = aiConfig();
  if (!cfg.photo) {
    return NextResponse.json({ error: "not-configured", message: "Photo-based suggestions aren't enabled on this site." }, { status: 503 });
  }
  const rl = rateLimit(`photo:${clientKey(req)}`, 6, 10 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "rate-limited", message: `Please wait ${rl.retryAfter}s before trying another photo.` }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { image?: unknown } | null;
  const m = typeof body?.image === "string" ? body.image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/) : null;
  if (!m) return NextResponse.json({ error: "invalid", message: "Please choose a JPEG, PNG or WebP photo." }, { status: 400 });
  const media = m[1] as (typeof TYPES)[number];
  const bytes = Math.floor((m[2].length * 3) / 4);
  if (bytes > MAX_BYTES) return NextResponse.json({ error: "too-large", message: "That photo is too large — please use one under 4 MB." }, { status: 413 });

  const skinIds = questionById("skinType")!.options!.map((o) => o.id).filter((x) => x !== "unsure");
  const concernIds = questionById("concerns")!.options!.map((o) => o.id).filter((x) => x !== "none");

  const system = `You help a cosmetics website pre-fill two consultation questions from a customer's face photo. You are NOT making a diagnosis.
Describe only visible, cosmetic characteristics (shine, visible dryness or flaking, visible redness, uneven-looking tone, visible texture). Do not infer or mention age, ethnicity, gender, identity, health or any medical condition. Lighting, filters and makeup change how skin looks — say so when relevant.
If the image is not a clear, well-lit photo of a face, set usable=false.
Reply with JSON only:
{"usable": boolean, "reason": string (if not usable, ≤120 chars), "skinType": one of ${JSON.stringify(skinIds)} or null, "concerns": array from ${JSON.stringify(concernIds)} (max 3), "observations": string[] (max 3, each ≤ 120 chars, neutral and kind)}`;

  try {
    const { text } = await callClaude({
      system,
      content: [
        { type: "image", source: { type: "base64", media_type: media, data: m[2] } },
        { type: "text", text: "Suggest answers for the skin-type and concerns questions from this photo." },
      ],
      maxTokens: 400,
      temperature: 0,
    });
    const raw = parseJsonObject<{ usable?: unknown; reason?: unknown; skinType?: unknown; concerns?: unknown; observations?: unknown }>(text);
    if (raw.usable !== true) {
      return NextResponse.json({ usable: false, reason: safeText(raw.reason, 140) ?? "We couldn't read that photo clearly. Try daylight, no filter, face centred." });
    }
    return NextResponse.json({
      usable: true,
      skinType: typeof raw.skinType === "string" && skinIds.includes(raw.skinType) ? raw.skinType : null,
      concerns: Array.isArray(raw.concerns) ? [...new Set(raw.concerns.filter((c): c is string => typeof c === "string" && concernIds.includes(c)))].slice(0, 3) : [],
      observations: Array.isArray(raw.observations) ? raw.observations.map((o) => safeText(o, 140)).filter(Boolean).slice(0, 3) : [],
    });
  } catch (e) {
    console.error("[ai] photo failed:", e instanceof AiError ? e.code : "unknown");
    return NextResponse.json({ error: "ai-error", message: "We couldn't analyze that photo right now. Your answers alone are enough." }, { status: 502 });
  }
}
