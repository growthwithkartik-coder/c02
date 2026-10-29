"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { getProduct } from "@/lib/catalog";
import { sampleFor, setPrice } from "@/lib/commerce";
import { cn, isPricePending, money, PRICES_ON_REQUEST } from "@/lib/utils";
import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";

function useFlash() {
  const [done, setDone] = useState(false);
  return [done, () => { setDone(true); window.setTimeout(() => setDone(false), 1800); }] as const;
}

/** Adds every ready-made product of a combo as its own line, tagged with the combo name.
 *  Made-to-order items can't be added without their formula, so they link to the builder instead. */
export function AddComboButton({ name, slugs, className, dark, label }: { name: string; slugs: string[]; className?: string; dark?: boolean; label?: string }) {
  const { addMany } = useStore();
  const [done, flash] = useFlash();
  const ready = slugs.filter((s) => !getProduct(s)?.custom && (PRICES_ON_REQUEST || !isPricePending(getProduct(s))));
  const custom = slugs.filter((s) => getProduct(s)?.custom);
  if (!ready.length && custom.length) {
    return (
      <Link href={`/make-it-yours/build?product=${custom[0]}&next=${custom.slice(1).join(",")}`} className={cn("btn", dark ? "btn-gold" : "btn-primary", className)}>
        Personalize this set
      </Link>
    );
  }
  if (PRICES_ON_REQUEST || !ready.length) {
    return (
      <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`${name} (${slugs.map((s) => getProduct(s)?.name).filter(Boolean).join(", ")})`)} className={cn("btn", dark ? "btn-gold" : "btn-primary", className)} data-request-price>
        Request set price
      </a>
    );
  }
  const total = ready.reduce((s, x) => s + (getProduct(x)?.price ?? 0), 0);
  return (
    <button
      type="button"
      onClick={() => {
        addMany(ready.map((slug) => ({ slug, shade: getProduct(slug)?.shades[0]?.name, bundle: name })));
        flash();
      }}
      className={cn("btn", dark ? "btn-gold" : "btn-primary", className)}
    >
      {done ? <><Check className="h-4 w-4" /> Added to bag</> : <>{label ?? "Add set to bag"} — {money(total)}</>}
    </button>
  );
}

export function AddSampleButton({ slug, className, dark, compact }: { slug: string; className?: string; dark?: boolean; compact?: boolean }) {
  const { addToCart } = useStore();
  const [done, flash] = useFlash();
  const s = sampleFor(slug);
  if (!s) return null;
  if (PRICES_ON_REQUEST) {
    return (
      <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`${getProduct(slug)?.name ?? slug} — travel size ${s.size}`)} className={cn("btn btn-sm", dark ? "btn-outline-light" : "btn-outline", className)} data-request-price>
        {compact ? "Request sample price" : `Travel size ${s.size} — request price`}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        addToCart(slug, 1, { size: "sample" });
        flash();
      }}
      className={cn("btn btn-sm", dark ? "btn-outline-light" : "btn-outline", className)}
      aria-label={`Add ${getProduct(slug)?.name} travel size (${s.size}) to bag`}
    >
      {done ? <><Check className="h-3.5 w-3.5" /> Added</> : <><Plus className="h-3.5 w-3.5" /> {compact ? `Sample ${money(s.price)}` : `Travel size ${s.size} — ${money(s.price)}`}</>}
    </button>
  );
}

export function AddSampleSetButton({ name, slugs, className, dark }: { name: string; slugs: string[]; className?: string; dark?: boolean }) {
  const { addMany } = useStore();
  const [done, flash] = useFlash();
  const valid = slugs.filter((s) => sampleFor(s));
  if (PRICES_ON_REQUEST) {
    return (
      <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`${name} — travel sizes (${valid.map((s) => getProduct(s)?.name).filter(Boolean).join(", ")})`)} className={cn("btn", dark ? "btn-gold" : "btn-primary", className)} data-request-price>
        Request set price
      </a>
    );
  }
  return (
    <button
      type="button"
      disabled={!valid.length}
      onClick={() => {
        addMany(valid.map((slug) => ({ slug, size: "sample" as const, bundle: name })));
        flash();
      }}
      className={cn("btn", dark ? "btn-gold" : "btn-primary", className)}
    >
      {done ? <><Check className="h-4 w-4" /> Added to bag</> : <>Add set — {money(setPrice(valid))}</>}
    </button>
  );
}
