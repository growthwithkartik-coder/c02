import { NextResponse } from "next/server";
import { clean, isEmail, recordSubmission } from "@/lib/forms";
import { getBuildProduct } from "@/data/customize";
import { notifyAdminText } from "@/lib/notify";
import { clientKey, rateLimit } from "@/lib/ai/rate-limit";

/* POST /api/customize/request — an on-request customization (no price yet).
   Stored in ORDERS_DIR/customization.jsonl, forwarded to FORMS_WEBHOOK_URL
   and sent to the admin WhatsApp when configured. The customer is told it
   is a REQUEST pending confirmation — never a confirmed order. */
export async function POST(req: Request) {
  const rl = rateLimit(`miy:${clientKey(req)}`, 8, 10 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests — please try again in a few minutes." }, { status: 429 });
  const body = await req.json().catch(() => null);
  // "packaging-inquiry" = the general size / packaging enquiry on /customization (not tied to one formula)
  const bp =
    body && body.buildId === "packaging-inquiry"
      ? { id: "packaging-inquiry", label: "Packaging & size inquiry", mode: "request" as const }
      : body && typeof body.buildId === "string"
        ? getBuildProduct(body.buildId)
        : undefined;
  if (!bp) return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  const c = body.contact ?? {};
  if (!clean(c.name, 120) || !isEmail(c.email)) return NextResponse.json({ error: "A name and a valid email are required." }, { status: 400 });
  const options: Record<string, string> = {};
  if (body.options && typeof body.options === "object") {
    for (const [k, v] of Object.entries(body.options).slice(0, 30)) if (typeof v === "string" && v.trim()) options[clean(k, 60)] = clean(v, 240);
  }
  const id = `REQ-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const entry = {
    id,
    status: "pending-confirmation",
    product: bp.label,
    buildId: bp.id,
    mode: bp.mode,
    options,
    from: clean(body.from, 80) || undefined,
    name: clean(c.name, 120),
    email: c.email,
    phone: clean(c.phone, 30),
    notes: clean(c.notes, 1000),
  };
  const { stored, forwarded } = await recordSubmission("customization", entry);
  if (!stored && forwarded !== true) {
    return NextResponse.json({ error: "We couldn't save your request right now." }, { status: 503 });
  }
  await notifyAdminText(
    `✨ New CO2 customization request ${id}\n${bp.label}\n${Object.entries(options).map(([k, v]) => `${k}: ${v}`).join("\n")}\nFrom: ${entry.name} · ${entry.email}${entry.phone ? ` · ${entry.phone}` : ""}${entry.notes ? `\nNotes: ${entry.notes}` : ""}`,
  ).catch(() => {});
  return NextResponse.json({ ok: true, id, status: "pending-confirmation" });
}
