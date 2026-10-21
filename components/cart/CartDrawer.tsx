"use client";

import Link from "next/link";
import { X, ShoppingBag, Truck } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { Overlay } from "@/components/ui/Overlay";
import { CartLineItem } from "./CartLineItem";
import { ProductCard } from "@/components/product-card/ProductCard";
import { getBestSellers } from "@/lib/catalog";
import { money } from "@/lib/utils";
import { site } from "@/data/site";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, totals } = useStore();
  const close = () => setCartOpen(false);
  const pct = Math.min(100, ((site.commerce.freeShippingThreshold - totals.freeShippingRemaining) / site.commerce.freeShippingThreshold) * 100);
  const suggestions = getBestSellers().filter((p) => !lines.some((l) => l.slug === p.slug)).slice(0, 2);

  return (
    <Overlay open={cartOpen} onClose={close} label="Shopping bag">
      <div className="flex items-center justify-between border-b border-line px-6 py-5">
        <p className="font-display text-3xl">
          Your bag <span className="align-top text-sm font-sans tabular-nums text-taupe">({totals.itemCount})</span>
        </p>
        <button onClick={close} aria-label="Close bag" className="-mr-2 p-2 hover:text-gold">
          <X className="h-5 w-5" strokeWidth={1.4} />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-10">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-taupe" strokeWidth={1.2} />
            <p className="mt-4 font-display text-3xl">Your bag is empty.</p>
            <p className="mt-2 text-sm text-ink-soft">Begin with a signature — or explore all 52 formulas.</p>
            <Link href="/shop" onClick={close} className="btn btn-primary mt-6">
              Shop the collection
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {getBestSellers().slice(0, 2).map((p) => (
              <ProductCard key={p.slug} product={p} variant="compact" sizes="200px" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="border-b border-line px-6 py-4">
            <p className="flex items-center gap-2 text-xs text-ink-soft">
              <Truck className="h-4 w-4" strokeWidth={1.4} />
              {totals.freeShippingRemaining > 0 ? (
                <>
                  You&rsquo;re <b className="font-semibold text-ink">{money(totals.freeShippingRemaining)}</b> away from free shipping
                </>
              ) : (
                <>Free shipping unlocked</>
              )}
            </p>
            <div className="mt-2 h-[3px] w-full bg-stone">
              <div className="h-full bg-gold transition-[width] duration-700 ease-expo" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto" data-lenis-prevent>
            <ul className="divide-y divide-line px-6">
              {lines.map((l) => (
                <CartLineItem key={l.key} line={l} onNavigate={close} />
              ))}
            </ul>
            {suggestions.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <p className="eyebrow mb-3 text-taupe">Complete the ritual</p>
                <div className="grid grid-cols-2 gap-3">
                  {suggestions.map((p) => (
                    <ProductCard key={p.slug} product={p} variant="compact" sizes="180px" />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-line bg-bone-2 px-6 pb-safe pt-5">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd className="tabular-nums">{money(totals.subtotal)}</dd></div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-leaf"><dt>Discount ({totals.appliedCode})</dt><dd className="tabular-nums">−{money(totals.discount)}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd className="tabular-nums">{totals.shipping ? money(totals.shipping) : "Free"}</dd></div>
              <div className="flex justify-between pt-2 text-base font-medium"><dt>Total</dt><dd className="tabular-nums">{money(totals.total)}</dd></div>
            </dl>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={close} className="btn btn-outline">View bag</Link>
              <Link href="/checkout" onClick={close} className="btn btn-primary">Checkout</Link>
            </div>
            <button onClick={close} className="mt-3 w-full py-2 text-xs uppercase tracking-[0.16em] text-ink-soft hover:text-ink">
              Continue shopping
            </button>
          </div>
        </>
      )}
    </Overlay>
  );
}
