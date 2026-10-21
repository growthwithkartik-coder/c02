import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { notifyOrder } from "@/lib/notify";

/* POST /api/payments/upi — customer submits the UPI transaction reference
   (UTR) after paying by QR. The order stays "pending-verification" until
   the team confirms the credit; the admin is notified immediately. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const ref = typeof b?.reference === "string" ? b.reference.replace(/\s/g, "").slice(0, 40) : "";
  if (typeof b?.orderId !== "string" || !/^[A-Za-z0-9]{6,40}$/.test(ref)) {
    return NextResponse.json({ error: "Please enter the 12-digit UPI reference (UTR) from your payment app." }, { status: 400 });
  }
  const order = await getOrder(b.orderId);
  if (!order || order.paymentMethod !== "upi-qr") return NextResponse.json({ error: "Order not found." }, { status: 404 });
  const updated = await updateOrder(order.id, { upiReference: ref, paymentStatus: "pending-verification" });
  if (updated) await notifyOrder(updated);
  return NextResponse.json({ ok: true, order: updated });
}
