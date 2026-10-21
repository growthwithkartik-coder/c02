import { NextResponse } from "next/server";
import { clean, isEmail, recordSubmission } from "@/lib/forms";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !isEmail(body.email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  const saved = await recordSubmission("newsletter", { email: body.email.toLowerCase(), source: clean(body.source, 40) });
  if (!saved.stored && saved.forwarded !== true) return NextResponse.json({ error: "We couldn't save that right now — please try again, or reach us on WhatsApp." }, { status: 503 });
  return NextResponse.json({ ok: true });
}
