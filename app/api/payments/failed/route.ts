import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";

/* POST /api/payments/failed — records a failed / abandoned attempt. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (typeof b?.orderId !== "string") return NextResponse.json({ error: "Missing order." }, { status: 400 });
  const order = await getOrder(b.orderId);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (order.paymentStatus !== "paid") await updateOrder(order.id, { paymentStatus: "failed" });
  return NextResponse.json({ ok: true });
}
