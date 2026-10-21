import { NextResponse } from "next/server";
import { computeTotals } from "@/lib/cart";
import { createRazorpayOrder, razorpayConfigured } from "@/lib/razorpay";
import { newOrderId, saveOrder } from "@/lib/orders";
import { validateCheckout } from "@/lib/validation";
import { site } from "@/data/site";
import type { Order } from "@/types";

/* POST /api/orders — create an order.
   Totals are recomputed here from the catalogue; browser prices are ignored. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const v = validateCheckout(body);
  if (!v.ok) return NextResponse.json({ error: "Please check the highlighted fields.", errors: v.errors }, { status: 400 });
  const { lines, code, customer, shipping, paymentMethod, notes } = v.data;

  const totals = computeTotals(lines, code);
  if (!totals.items.length || totals.total <= 0) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });

  if (paymentMethod === "razorpay" && !razorpayConfigured()) {
    return NextResponse.json({ error: "Card/UPI checkout isn't activated yet. Please choose UPI QR." }, { status: 503 });
  }

  const now = new Date().toISOString();
  const order: Order = {
    id: newOrderId(),
    createdAt: now,
    updatedAt: now,
    customer,
    shipping,
    items: totals.items,
    subtotal: totals.subtotal,
    discount: totals.discount,
    discountCode: totals.appliedCode,
    shippingFee: totals.shipping,
    total: totals.total,
    currency: "INR",
    paymentMethod,
    paymentStatus: paymentMethod === "upi-qr" ? "pending-verification" : "created",
    notes,
  };

  try {
    if (paymentMethod === "razorpay") {
      const rzp = await createRazorpayOrder({
        amountInRupees: order.total,
        receipt: order.id,
        notes: { co2_order_id: order.id, customer: customer.name, phone: customer.phone },
      });
      order.razorpayOrderId = rzp.id;
      await saveOrder(order);
      return NextResponse.json({
        orderId: order.id,
        total: order.total,
        razorpay: { keyId: process.env.RAZORPAY_KEY_ID, orderId: rzp.id, amount: rzp.amount, currency: rzp.currency },
      });
    }
    await saveOrder(order);
    return NextResponse.json({ orderId: order.id, total: order.total, upi: { qr: site.upi.qr, payee: site.upi.payee } });
  } catch (e) {
    console.error("[orders] create failed", e);
    return NextResponse.json({ error: "We couldn't start the payment. Please try again." }, { status: 502 });
  }
}
