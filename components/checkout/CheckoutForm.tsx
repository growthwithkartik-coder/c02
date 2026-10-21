"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, Lock, QrCode, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { DiscountField, Totals } from "@/components/cart/CartView";
import { ProductImage } from "@/components/ui/ProductImage";
import { Logo } from "@/components/ui/Logo";
import { indianStates } from "@/data/india";
import { site } from "@/data/site";
import { getProduct } from "@/lib/catalog";
import { priceLines } from "@/lib/cart";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import { cn, money } from "@/lib/utils";
import type { Order } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Razorpay?: any;
  }
}

type Profile = { name: string; email: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string };
const emptyProfile: Profile = { name: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function saveLocalOrder(o: Order) {
  const list = readJSON<Order[]>(STORAGE_KEYS.orders, []);
  writeJSON(STORAGE_KEYS.orders, [o, ...list.filter((x) => x.id !== o.id)].slice(0, 30));
}

export function CheckoutForm() {
  const router = useRouter();
  const { lines, totals, discountCode, clearCart, ready } = useStore();
  const [form, setForm] = useState<Profile>(emptyProfile);
  const [save, setSave] = useState(true);
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<"razorpay" | "upi-qr">("razorpay");
  const [rzpEnabled, setRzpEnabled] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "creating" | "paying" | "verifying" | "failed">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [upi, setUpi] = useState<{ orderId: string; total: number; qr: string; payee: string } | null>(null);
  const [utr, setUtr] = useState("");

  useEffect(() => {
    const p = readJSON<Partial<Profile>>(STORAGE_KEYS.profile, {});
    setForm((f) => ({ ...f, ...p }));
    fetch("/api/razorpay/config")
      .then((r) => r.json())
      .then((c) => {
        setRzpEnabled(!!c.enabled);
        if (!c.enabled) setMethod("upi-qr");
      })
      .catch(() => {
        setRzpEnabled(false);
        setMethod("upi-qr");
      });
  }, []);

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: "" }));
  };

  function finish(order: Order) {
    saveLocalOrder(order);
    clearCart();
    router.push(`/order/${order.id}`);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (save) writeJSON(STORAGE_KEYS.profile, form);
    setStatus("creating");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines,
        code: discountCode,
        paymentMethod: method,
        notes,
        customer: { name: form.name, email: form.email, phone: form.phone },
        shipping: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode, country: "India" },
      }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (!res?.ok || !data) {
      setStatus("idle");
      setErrors(data?.errors ?? {});
      setMessage(data?.error ?? "Something went wrong. Please try again.");
      document.querySelector("[aria-invalid=true]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (data.upi) {
      setStatus("idle");
      setUpi({ orderId: data.orderId, total: data.total, ...data.upi });
      return;
    }

    // Razorpay
    const ok = await loadRazorpay();
    if (!ok) {
      setStatus("failed");
      setMessage("Couldn't load the payment window. Check your connection and try again.");
      return;
    }
    setStatus("paying");
    const rzp = new window.Razorpay({
      key: data.razorpay.keyId,
      amount: data.razorpay.amount,
      currency: data.razorpay.currency,
      order_id: data.razorpay.orderId,
      name: "CO2",
      description: `Order ${data.orderId}`,
      image: `${window.location.origin}/brand/co2-logo-360.png`,
      prefill: { name: form.name, email: form.email, contact: form.phone },
      notes: { co2_order_id: data.orderId },
      theme: { color: "#B8924F" },
      handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        setStatus("verifying");
        const v = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: data.orderId, ...resp }) }).catch(() => null);
        const vd = await v?.json().catch(() => null);
        if (v?.ok && vd?.order) finish(vd.order);
        else {
          setStatus("failed");
          setMessage(`We received a response but couldn't verify the payment. If money was debited, contact us with order ${data.orderId} — nothing will be charged twice.`);
        }
      },
      modal: {
        ondismiss: () => {
          setStatus((s) => (s === "paying" ? "idle" : s));
          setMessage("Payment window closed. Your bag is saved — you can try again.");
        },
      },
    });
    rzp.on("payment.failed", (r: any) => {
      fetch("/api/payments/failed", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: data.orderId }) });
      setStatus("failed");
      setMessage(`Payment failed${r?.error?.description ? `: ${r.error.description}` : ""}. No money was taken — please try again or choose UPI QR.`);
    });
    rzp.open();
  }

  async function confirmUpi(e: React.FormEvent) {
    e.preventDefault();
    if (!upi) return;
    setStatus("verifying");
    const res = await fetch("/api/payments/upi", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: upi.orderId, reference: utr }) }).catch(() => null);
    const d = await res?.json().catch(() => null);
    if (res?.ok && d?.order) finish(d.order);
    else {
      setStatus("idle");
      setMessage(d?.error ?? "Couldn't confirm — please try again.");
    }
  }

  if (ready && !lines.length && !upi) {
    return (
      <div className="container-site py-40 text-center">
        <p className="font-display text-4xl">Your bag is empty.</p>
        <Link href="/shop" className="btn btn-primary btn-lg mt-8">Shop the collection</Link>
      </div>
    );
  }

  const busy = status === "creating" || status === "paying" || status === "verifying";

  return (
    <div className="min-h-screen bg-bone">
      <div className="container-site flex h-[var(--nav-h)] items-center justify-between border-b border-line">
        <Link href="/" aria-label="CO2 home"><Logo size={36} /></Link>
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink-soft"><Lock className="h-3.5 w-3.5" /> Secure checkout</p>
      </div>

      <div className="container-site grid gap-12 py-10 lg:grid-cols-12 lg:py-16">
        {/* form */}
        <div className="lg:col-span-7">
          <h1 className="font-display text-display-sm">Checkout</h1>

          <AnimatePresence mode="wait">
            {upi ? (
              <motion.div key="upi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-10 border border-line p-6 md:p-10">
                <p className="eyebrow text-taupe">Order {upi.orderId}</p>
                <h2 className="mt-3 font-display text-4xl">Scan to pay {money(upi.total)}</h2>
                <p className="mt-3 max-w-md text-sm text-ink-soft">Open any UPI app (GPay, PhonePe, Paytm, BHIM), scan the code, and pay exactly <b className="text-ink">{money(upi.total)}</b> to <b className="text-ink">{upi.payee}</b>. Then enter the 12-digit UPI reference (UTR) below.</p>
                <div className="mt-8 grid items-start gap-8 sm:grid-cols-[auto_1fr]">
                  <div className="relative h-56 w-56 bg-white p-3 ring-1 ring-line">
                    <Image src={upi.qr} alt={`UPI QR code for ${upi.payee}`} fill sizes="224px" className="object-contain p-2" unoptimized />
                  </div>
                  <form onSubmit={confirmUpi} className="space-y-4">
                    <div className="field">
                      <label htmlFor="utr" className="label">UPI reference / UTR *</label>
                      <input id="utr" value={utr} onChange={(e) => setUtr(e.target.value)} required inputMode="numeric" className="input" placeholder="e.g. 428512345678" />
                    </div>
                    <button className="btn btn-primary btn-lg w-full" disabled={busy}>{busy ? "Confirming…" : "I've paid — confirm order"}</button>
                    <p className="text-xs leading-relaxed text-taupe">Your order is confirmed once we see the payment (usually within a few hours). We&rsquo;ll message you on WhatsApp or by email.</p>
                  </form>
                </div>
                {message && <p role="alert" className="mt-6 text-sm text-red-700">{message}</p>}
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10 space-y-12">
                <fieldset className="space-y-5">
                  <legend className="mb-5 flex items-center gap-3 font-display text-3xl"><Step n={1} /> Contact</legend>
                  <Field id="name" label="Full name" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="email" type="email" label="Email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
                    <Field id="phone" type="tel" label="Mobile (for delivery & WhatsApp updates)" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" inputMode="tel" placeholder="98XXXXXXXX" />
                  </div>
                </fieldset>

                <fieldset className="space-y-5">
                  <legend className="mb-5 flex items-center gap-3 font-display text-3xl"><Step n={2} /> Shipping address</legend>
                  <Field id="line1" label="Address" value={form.line1} onChange={set("line1")} error={errors.line1} autoComplete="address-line1" placeholder="House / flat, street" />
                  <Field id="line2" label="Landmark / area (optional)" value={form.line2} onChange={set("line2")} autoComplete="address-line2" required={false} />
                  <div className="grid gap-5 sm:grid-cols-3">
                    <Field id="city" label="City" value={form.city} onChange={set("city")} error={errors.city} autoComplete="address-level2" />
                    <div className="field">
                      <label htmlFor="state" className="label">State *</label>
                      <select id="state" value={form.state} onChange={set("state")} className="input" aria-invalid={!!errors.state} autoComplete="address-level1">
                        <option value="">Select…</option>
                        {indianStates.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="text-xs text-red-700">{errors.state}</p>}
                    </div>
                    <Field id="pincode" label="PIN code" value={form.pincode} onChange={set("pincode")} error={errors.pincode} autoComplete="postal-code" inputMode="numeric" maxLength={6} />
                  </div>
                  <label className="flex items-center gap-3 text-sm text-ink-soft">
                    <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} className="h-4 w-4 accent-[#1A1814]" /> Save these details on this device for next time
                  </label>
                  <div className="field">
                    <label htmlFor="notes" className="label">Order notes (optional)</label>
                    <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="input min-h-[5rem]" maxLength={500} placeholder="Delivery instructions, gift note…" />
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-5 flex items-center gap-3 font-display text-3xl"><Step n={3} /> Payment</legend>
                  <div className="space-y-3" role="radiogroup">
                    <PayOption
                      active={method === "razorpay"}
                      disabled={rzpEnabled === false}
                      onClick={() => setMethod("razorpay")}
                      icon={<CreditCard className="h-5 w-5" strokeWidth={1.4} />}
                      title="Cards, UPI, net banking & wallets"
                      body={rzpEnabled === false ? "Razorpay isn't activated yet — add your keys to enable it (see README)." : "Pay securely with Razorpay. You'll confirm in a Razorpay window."}
                    />
                    <PayOption
                      active={method === "upi-qr"}
                      onClick={() => setMethod("upi-qr")}
                      icon={<QrCode className="h-5 w-5" strokeWidth={1.4} />}
                      title="UPI QR code"
                      body={`Scan and pay ${site.upi.payee}, then enter your UPI reference. Confirmed once we see the payment.`}
                    />
                  </div>
                </fieldset>

                {message && <p role="alert" className={cn("border p-4 text-sm", status === "failed" ? "border-red-300 bg-red-50 text-red-800" : "border-line text-ink-soft")}>{message}</p>}

                <button type="submit" className="btn btn-primary btn-lg w-full" disabled={busy || !lines.length}>
                  {status === "creating" ? "Creating order…" : status === "paying" ? "Waiting for payment…" : status === "verifying" ? "Verifying…" : method === "razorpay" ? `Pay ${money(totals.total)}` : `Continue to UPI — ${money(totals.total)}`}
                </button>
                <p className="flex items-center justify-center gap-2 text-xs text-taupe"><ShieldCheck className="h-4 w-4" /> Card and UPI details are handled by Razorpay — never stored by CO2.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* summary */}
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="sticky top-6 bg-bone-2 p-6 md:p-8">
            <h2 className="font-display text-3xl">Order summary</h2>
            <ul className="mt-6 max-h-[40vh] space-y-4 overflow-y-auto pr-1" data-lenis-prevent>
              {lines.map((l) => {
                const p = getProduct(l.slug);
                const priced = priceLines([l])[0];
                if (!p || !priced) return null;
                return (
                  <li key={l.key} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0">
                      <ProductImage product={p} sizes="64px" className="absolute inset-0" />
                      <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.65rem] text-bone">{l.qty}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{priced.name}</p>
                      <p className="text-xs text-taupe">{[priced.sizeLabel, l.shade].filter(Boolean).join(" · ")}</p>
                      {priced.options && <p className="truncate text-[0.6875rem] text-ink-soft">{Object.entries(priced.options).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>}
                    </div>
                    <p className="text-sm tabular-nums">{money(priced.lineTotal)}</p>
                  </li>
                );
              })}
            </ul>
            {!upi && <div className="mt-6 border-t border-line pt-6"><DiscountField /></div>}
            <div className="mt-6 border-t border-line pt-6"><Totals /></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Step({ n }: { n: number }) {
  return <span className="grid h-8 w-8 place-items-center rounded-full border border-ink font-sans text-xs tabular-nums">{n}</span>;
}

function Field({ id, label, error, required = true, ...rest }: { id: string; label: string; error?: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="field">
      <label htmlFor={id} className="label">{label}{required ? " *" : ""}</label>
      <input id={id} name={id} className={cn("input", error && "border-red-400")} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} required={required} {...rest} />
      {error && <p id={`${id}-err`} className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

function PayOption({ active, disabled, onClick, icon, title, body }: { active: boolean; disabled?: boolean; onClick: () => void; icon: React.ReactNode; title: string; body: string }) {
  return (
    <button type="button" role="radio" aria-checked={active} disabled={disabled} onClick={onClick} className={cn("flex w-full items-start gap-4 border p-5 text-left transition-colors", active ? "border-ink bg-bone-2" : "border-line hover:border-ink/50", disabled && "cursor-not-allowed opacity-50")}>
      <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border", active ? "border-ink" : "border-ink/30")}>{active && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}</span>
      <span className="flex-1">
        <span className="flex items-center gap-2 font-medium">{icon}{title}</span>
        <span className="mt-1 block text-sm text-ink-soft">{body}</span>
      </span>
    </button>
  );
}
