import "server-only";
import crypto from "node:crypto";
import Razorpay from "razorpay";

/* ------------------------------------------------------------------
   Razorpay — server side only.
   Keys come from environment variables (see .env.example):
     RAZORPAY_KEY_ID           public key id (also sent to the browser)
     RAZORPAY_KEY_SECRET       secret — never leaves the server
     RAZORPAY_WEBHOOK_SECRET   optional, for /api/payments/webhook
------------------------------------------------------------------- */

export function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

let client: Razorpay | null = null;

export function getRazorpay() {
  if (!razorpayConfigured()) throw new Error("Razorpay keys are not configured");
  if (!client) {
    client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return client;
}

export async function createRazorpayOrder(params: {
  amountInRupees: number;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const rp = getRazorpay();
  const order = await rp.orders.create({
    amount: Math.round(params.amountInRupees * 100), // paise
    currency: "INR",
    receipt: params.receipt.slice(0, 40),
    notes: params.notes,
  });
  return order as { id: string; amount: number; currency: string; status: string };
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/** Checkout signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret) */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqual(expected, signature);
}

/** Webhook signature: HMAC_SHA256(raw_body, webhook_secret) */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}
