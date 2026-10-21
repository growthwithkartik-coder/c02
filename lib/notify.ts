import "server-only";
import type { Order } from "@/types";
import { money } from "@/lib/utils";

/* ------------------------------------------------------------------
   Order notifications to the brand / admin.
   Channels (each is skipped silently when its env vars are missing):
     1. WhatsApp Cloud API (Meta)  WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID,
                                   ADMIN_WHATSAPP_NUMBER (e.g. 9183558xxxxx)
     2. Generic webhook            ORDER_WEBHOOK_URL (Zapier / Make / n8n /
                                   Slack incoming webhook / Google Apps Script)
   Nothing here is ever sent to the browser.
------------------------------------------------------------------- */

export function orderSummaryText(o: Order) {
  const lines = o.items
    .map((i) => {
      const variant = [i.shade, i.options ? Object.entries(i.options).map(([k, v]) => `${k}: ${v}`).join(", ") : ""]
        .filter(Boolean)
        .join(" · ");
      return `• ${i.name}${variant ? ` (${variant})` : ""} × ${i.qty} — ${money(i.lineTotal)}`;
    })
    .join("\n");
  const status =
    o.paymentStatus === "paid"
      ? "PAID ✅"
      : o.paymentStatus === "pending-verification"
        ? `UPI — VERIFY PAYMENT (ref ${o.upiReference || "—"})`
        : o.paymentStatus.toUpperCase();
  return [
    `🛍️ New CO2 order ${o.id}`,
    ``,
    `Customer: ${o.customer.name}`,
    `Phone: ${o.customer.phone}`,
    `Email: ${o.customer.email}`,
    `City: ${o.shipping.city}, ${o.shipping.state} ${o.shipping.pincode}`,
    ``,
    lines,
    ``,
    `Subtotal: ${money(o.subtotal)}${o.discount ? `  Discount: −${money(o.discount)} (${o.discountCode})` : ""}`,
    `Shipping: ${o.shippingFee ? money(o.shippingFee) : "Free"}`,
    `Total: ${money(o.total)}`,
    `Payment: ${status}${o.razorpayPaymentId ? ` · ${o.razorpayPaymentId}` : ""}`,
    ``,
    `Ship to: ${o.shipping.line1}${o.shipping.line2 ? ", " + o.shipping.line2 : ""}, ${o.shipping.city}, ${o.shipping.state} ${o.shipping.pincode}`,
  ].join("\n");
}

async function sendWhatsApp(text: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.ADMIN_WHATSAPP_NUMBER;
  if (!token || !phoneId || !to) return { channel: "whatsapp", skipped: true };
  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { preview_url: false, body: text.slice(0, 4000) },
    }),
  });
  return { channel: "whatsapp", ok: res.ok, status: res.status };
}

async function sendWebhook(order: Order, text: string) {
  const url = process.env.ORDER_WEBHOOK_URL;
  if (!url) return { channel: "webhook", skipped: true };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "order.updated", text, order }),
  });
  return { channel: "webhook", ok: res.ok, status: res.status };
}

/** Fire-and-forget safe: never throws. */
export async function notifyOrder(order: Order) {
  const text = orderSummaryText(order);
  const results = await Promise.allSettled([sendWhatsApp(text), sendWebhook(order, text)]);
  if (process.env.NODE_ENV !== "production") console.info("[notify]\n" + text);
  return results;
}

/** Plain-text admin alert (customization requests). Never throws. */
export async function notifyAdminText(text: string) {
  try {
    const r = await sendWhatsApp(text);
    if (process.env.NODE_ENV !== "production") console.info("[notify]\n" + text);
    return r;
  } catch {
    return { channel: "whatsapp", ok: false };
  }
}
