import { NextResponse } from "next/server";
import { findByRazorpayOrderId, updateOrder } from "@/lib/orders";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { notifyOrder } from "@/lib/notify";

/* POST /api/payments/webhook — Razorpay server-to-server events.
   A safety net: if the browser closes before /verify runs, the order is
   still marked paid. Configure in Razorpay Dashboard → Webhooks. */
export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, sig)) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(raw);
  const payment = event?.payload?.payment?.entity;
  const rzpOrderId: string | undefined = payment?.order_id ?? event?.payload?.order?.entity?.id;
  if (!rzpOrderId) return NextResponse.json({ ok: true });
  const order = await findByRazorpayOrderId(rzpOrderId);
  if (!order) return NextResponse.json({ ok: true });

  if ((event.event === "payment.captured" || event.event === "order.paid") && order.paymentStatus !== "paid") {
    const updated = await updateOrder(order.id, { paymentStatus: "paid", razorpayPaymentId: payment?.id ?? order.razorpayPaymentId });
    if (updated) await notifyOrder(updated);
  } else if (event.event === "payment.failed" && order.paymentStatus !== "paid") {
    await updateOrder(order.id, { paymentStatus: "failed" });
  }
  return NextResponse.json({ ok: true });
}
