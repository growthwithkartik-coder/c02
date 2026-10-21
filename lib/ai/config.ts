import "server-only";

/* ------------------------------------------------------------------
   AI configuration — read from server environment variables only.
   Nothing here is ever sent to the browser except the booleans in
   /api/ai/status. See README §10.
------------------------------------------------------------------- */

const on = (v: string | undefined, dflt: boolean) => (v == null || v === "" ? dflt : /^(1|true|on|yes)$/i.test(v));

export function aiConfig() {
  const key = process.env.ANTHROPIC_API_KEY?.trim() || "";
  const hasKey = key.length > 20;
  const enabled = hasKey && on(process.env.CO2_AI_ENABLED, true);
  return {
    key,
    enabled,
    model: process.env.CO2_AI_MODEL?.trim() || "claude-sonnet-5-5",
    /** Photo-based suggestions process a face photo, so they are opt-in for the site owner. */
    photo: enabled && on(process.env.CO2_AI_PHOTO_ANALYSIS, false),
    timeoutMs: Math.min(60000, Math.max(5000, Number(process.env.CO2_AI_TIMEOUT_MS) || 25000)),
  };
}

export type AiStatus = "ok" | "not-configured" | "error";
