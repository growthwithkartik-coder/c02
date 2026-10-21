import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { notifyOrder } from "@/lib/notify";

/* POST /api/payments/verify — called by the browser after Razorpay
   checkout succeeds. The signature is verified with the secret key
   before the order is marked paid. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = b ?? {};
  if (![orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature].every((x) => typeof x === "string" && x.length < 200)) {
    return NextResponse.json({ error: "Invalid payment response." }, { status: 400 });
  }
  const order = await getOrder(orderId);
  if (!order || order.razorpayOrderId !== razorpay_order_id) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  // A bad signature is rejected without changing the order, so a forged
  // request can't flip a genuine pending order to "failed".
  if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }
  const alreadyPaid = order.paymentStatus === "paid";
  const updated = await updateOrder(order.id, { paymentStatus: "paid", razorpayPaymentId: razorpay_payment_id });
  if (updated && !alreadyPaid) await notifyOrder(updated);
  return NextResponse.json({ ok: true, order: updated });
}
