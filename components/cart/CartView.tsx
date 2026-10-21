"use client";

import Link from "next/link";
import { ShieldCheck, Tag, Truck, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { CartLineItem } from "./CartLineItem";
import { ProductCard } from "@/components/product-card/ProductCard";
import { getBestSellers } from "@/lib/catalog";
import { money } from "@/lib/utils";
import { site } from "@/data/site";

export function CartView() {
  const { lines, totals, ready, clearCart } = useStore();
  const suggestions = getBestSellers().filter((p) => !lines.some((l) => l.slug === p.slug)).slice(0, 4);

  return (
    <div className="container-site pb-section pt-[calc(var(--nav-h)+3rem)]">
      <div className="flex items-end justify-between border-b border-line pb-8">
        <h1 className="font-display text-display-md">Your bag</h1>
        {lines.length > 0 && <button onClick={clearCart} className="text-xs uppercase tracking-[0.14em] text-taupe hover:text-ink">Clear bag</button>}
      </div>

      {!ready ? (
        <div className="py-24 text-center text-taupe">Loading your bag…</div>
      ) : lines.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-4xl">Your bag is empty.</p>
          <p className="mt-3 text-ink-soft">Start with the signatures — or explore every formula.</p>
          <Link href="/shop" className="btn btn-primary btn-lg mt-8">Shop the collection</Link>
        </div>
      ) : (
        <div className="grid gap-12 pt-4 lg:grid-cols-12">
          <ul className="divide-y divide-line lg:col-span-7">
            {lines.map((l) => <CartLineItem key={l.key} line={l} large />)}
          </ul>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="sticky top-[calc(var(--nav-h)+1.5rem)] space-y-6 bg-bone-2 p-6 md:p-8">
              <h2 className="font-display text-3xl">Summary</h2>
              <DiscountField />
              <Totals />
              <Link href="/checkout" className="btn btn-primary btn-lg w-full">Checkout — {money(totals.total)}</Link>
              <Link href="/shop" className="btn btn-ghost w-full text-xs">Continue shopping</Link>
              <ul className="space-y-2 border-t border-line pt-5 text-xs text-ink-soft">
                <li className="flex items-center gap-2"><Truck className="h-4 w-4" strokeWidth={1.4} /> Free shipping over {money(site.commerce.freeShippingThreshold)}</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" strokeWidth={1.4} /> Secure payment via Razorpay or UPI</li>
              </ul>
            </div>
          </aside>
        </div>
      )}

      {ready && suggestions.length > 0 && (
        <section className="pt-section">
          <h2 className="font-display text-display-sm">Complete the ritual</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {suggestions.map((p) => <ProductCard key={p.slug} product={p} sizes="(max-width:1024px) 50vw, 25vw" />)}
          </div>
        </section>
      )}
    </div>
  );
}

export function Totals({ dark }: { dark?: boolean }) {
  const { totals } = useStore();
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between"><dt className={dark ? "text-bone/60" : "text-ink-soft"}>Subtotal ({totals.itemCount})</dt><dd className="tabular-nums">{money(totals.subtotal)}</dd></div>
      {totals.discount > 0 && <div className="flex justify-between text-leaf"><dt>Discount · {totals.appliedCode}</dt><dd className="tabular-nums">−{money(totals.discount)}</dd></div>}
      <div className="flex justify-between">
        <dt className={dark ? "text-bone/60" : "text-ink-soft"}>Shipping</dt>
        <dd className="tabular-nums">{totals.shipping ? money(totals.shipping) : "Free"}</dd>
      </div>
      {totals.freeShippingRemaining > 0 && totals.subtotal > 0 && <p className="text-xs text-taupe">Add {money(totals.freeShippingRemaining)} more for free shipping.</p>}
      <div className="flex justify-between border-t border-line pt-3 text-lg font-medium"><dt>Total</dt><dd className="tabular-nums">{money(totals.total)}</dd></div>
      <p className="text-xs text-taupe">Prices include applicable taxes.</p>
    </dl>
  );
}

export function DiscountField() {
  const { applyCode, removeCode, discountCode } = useStore();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  if (discountCode) {
    return (
      <div className="flex items-center justify-between border border-dashed border-leaf/60 px-4 py-3 text-sm">
        <span className="flex items-center gap-2 text-leaf"><Tag className="h-4 w-4" /> {discountCode} applied</span>
        <button onClick={removeCode} aria-label="Remove discount code"><X className="h-4 w-4" /></button>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!applyCode(code)) setErr("That code isn't valid.");
        else { setErr(""); setCode(""); }
      }}
    >
      <label htmlFor="discount" className="label">Discount code</label>
      <div className="mt-2 flex">
        <input id="discount" value={code} onChange={(e) => setCode(e.target.value)} className="input h-11 uppercase" placeholder="Enter code" />
        <button className="btn btn-outline h-11 border-l-0 px-5">Apply</button>
      </div>
      {err && <p className="mt-2 text-xs text-red-700" role="alert">{err}</p>}
    </form>
  );
}
