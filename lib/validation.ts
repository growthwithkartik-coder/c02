import { indianStates } from "@/data/india";
import type { CartLine, Customer, ShippingAddress } from "@/types";

/* Server-side validation for checkout payloads. */
export type CheckoutPayload = {
  lines: CartLine[];
  code?: string | null;
  customer: Customer;
  shipping: ShippingAddress;
  paymentMethod: "razorpay" | "upi-qr";
  notes?: string;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function validateCheckout(body: unknown): { ok: true; data: CheckoutPayload } | { ok: false; errors: Record<string, string> } {
  const b = (body ?? {}) as Record<string, any>;
  const errors: Record<string, string> = {};
  const customer: Customer = { name: str(b.customer?.name, 100), email: str(b.customer?.email, 160).toLowerCase(), phone: str(b.customer?.phone, 20).replace(/[^\d+]/g, "") };
  const shipping: ShippingAddress = {
    line1: str(b.shipping?.line1, 200),
    line2: str(b.shipping?.line2, 200),
    city: str(b.shipping?.city, 80),
    state: str(b.shipping?.state, 80),
    pincode: str(b.shipping?.pincode, 10),
    country: "India",
  };
  if (customer.name.length < 2) errors.name = "Please enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(customer.email)) errors.email = "Please enter a valid email.";
  if (!/^(\+?91)?[6-9]\d{9}$/.test(customer.phone)) errors.phone = "Please enter a valid 10-digit Indian mobile number.";
  if (shipping.line1.length < 4) errors.line1 = "Please enter your address.";
  if (shipping.city.length < 2) errors.city = "Please enter your city.";
  if (!indianStates.includes(shipping.state)) errors.state = "Please choose your state.";
  if (!/^[1-9]\d{5}$/.test(shipping.pincode)) errors.pincode = "Please enter a valid 6-digit PIN code.";
  const lines: CartLine[] = Array.isArray(b.lines)
    ? b.lines.slice(0, 50).map((l: any) => ({ key: str(l?.key, 400), slug: str(l?.slug, 80), qty: Number(l?.qty) || 1, shade: str(l?.shade, 60) || undefined, options: l?.options && typeof l.options === "object" ? l.options : undefined, size: l?.size === "sample" ? "sample" : undefined, bundle: str(l?.bundle, 80) || undefined }))
    : [];
  if (!lines.length) errors.lines = "Your bag is empty.";
  const paymentMethod = b.paymentMethod === "upi-qr" ? "upi-qr" : "razorpay";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { lines, code: str(b.code, 40) || null, customer, shipping, paymentMethod, notes: str(b.notes, 500) } };
}
