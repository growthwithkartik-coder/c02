import { NextResponse } from "next/server";
import { clean, isEmail, recordSubmission } from "@/lib/forms";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !isEmail(body.email) || !clean(body.name) || !clean(body.message)) {
    return NextResponse.json({ error: "Name, a valid email and a message are required." }, { status: 400 });
  }
  if (clean(body.company)) return NextResponse.json({ ok: true }); // honeypot
  const saved = await recordSubmission("contact", {
    name: clean(body.name, 120),
    email: body.email,
    phone: clean(body.phone, 30),
    topic: clean(body.topic, 60),
    orderId: clean(body.orderId, 40),
    message: clean(body.message, 4000),
  });
  if (!saved.stored && saved.forwarded !== true) return NextResponse.json({ error: "We couldn't save that right now — please try again, or reach us on WhatsApp." }, { status: 503 });
  return NextResponse.json({ ok: true });
}
