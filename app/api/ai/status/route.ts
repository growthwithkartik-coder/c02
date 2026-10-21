import { NextResponse } from "next/server";
import { aiConfig } from "@/lib/ai/config";

export const dynamic = "force-dynamic";

/* Which AI features are configured. Never exposes keys. */
export async function GET() {
  const c = aiConfig();
  return NextResponse.json(
    { recommendations: c.enabled, ask: c.enabled, photo: c.photo, provider: c.enabled ? "anthropic" : null, model: c.enabled ? c.model : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
