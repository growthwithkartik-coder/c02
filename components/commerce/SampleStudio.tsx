"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Minus, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { sampling } from "@/data/sampling";
import { getProduct } from "@/lib/catalog";
import { primaryDepartment, cardTypeLabel } from "@/lib/taxonomy";
import { sampleFor } from "@/lib/commerce";
import { cn, money, productImage, priceText, PRICES_ON_REQUEST } from "@/lib/utils";

import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";
/* Travel-size grid with category filters + "build your sample set"
   (pick between minPerSet and maxPerSet samples, see the running total,
   add them in one go). Prices come only from data/sampling.ts. */

const CATS = [
  { id: "all", label: "All" },
  { id: "skin", label: "Face & Skin" },
  { id: "body", label: "Body" },
  { id: "hair", label: "Hair" },
] as const;

export function SampleStudio() {
  const sp = useSearchParams();
  const { addMany, addToCart } = useStore();
  const initial = (sp.get("cat") as (typeof CATS)[number]["id"]) ?? "all";
  const [cat, setCat] = useState<(typeof CATS)[number]["id"]>(CATS.some((c) => c.id === initial) ? initial : "all");
  const [set, setSet] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => setDone(false), [set]);

  const items = useMemo(
    () =>
      Object.keys(sampling.items)
        .map((slug) => ({ p: getProduct(slug)!, s: sampleFor(slug)! }))
        .filter((x) => x.p && x.s && (cat === "all" || primaryDepartment(x.p) === cat)),
    [cat],
  );
  const total = set.reduce((t, s) => t + (sampleFor(s)?.price ?? 0), 0);
  const full = set.length >= sampling.maxPerSet;
  const ready = set.length >= sampling.minPerSet;
  const toggle = (slug: string) => setSet((x) => (x.includes(slug) ? x.filter((y) => y !== slug) : full ? x : [...x, slug]));

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Filter travel sizes by category" className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)} className="chip" data-active={cat === c.id}>
                {c.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-taupe">{items.length} travel sizes</p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
          {items.map(({ p, s }) => {
            const on = set.includes(p.slug);
            return (
              <li key={p.slug} className="flex flex-col">
                <Link href={`/product/${p.slug}`} className="relative block aspect-square bg-bone-2">
                  <Image src={productImage(p.images[0], 640)} alt={`${p.name} — travel size`} fill sizes="(max-width:640px) 46vw, 22vw" className="object-contain" />
                  <span className="absolute left-2 top-2 bg-carbon px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-bone">{s.size}</span>
                </Link>
                <p className="mt-3 text-[0.6875rem] uppercase tracking-[0.14em] text-taupe">{cardTypeLabel(p)}</p>
                <p className="mt-1 font-display text-xl leading-tight"><Link href={`/product/${p.slug}`} className="hover:text-gold-deep">{p.name}</Link></p>
                <p className="mt-1 line-clamp-2 text-xs text-ink-soft">{p.ingredients.slice(0, 3).map((i) => i.name).join(" · ")}</p>
                <p className="mt-2 text-sm">{PRICES_ON_REQUEST ? <span className="text-taupe">Price on request</span> : <span className="tabular-nums">{money(s.price)}</span>} <span className="text-xs text-taupe">· full size {p.size.split("/")[0]}{PRICES_ON_REQUEST ? "" : ` ${money(p.price)}`}</span></p>
                <p className="text-xs text-leaf">In stock</p>
                <div className="mt-auto flex gap-2 pt-3">
                  <button type="button" onClick={() => toggle(p.slug)} aria-pressed={on} disabled={!on && full} className={cn("btn btn-sm h-9 flex-1 px-2 text-[0.6875rem]", on ? "btn-primary" : "btn-outline")}>
                    {on ? <><Check className="h-3.5 w-3.5" /> In set</> : <><Plus className="h-3.5 w-3.5" /> Add to set</>}
                  </button>
                  {!PRICES_ON_REQUEST && <button type="button" onClick={() => addToCart(p.slug, 1, { size: "sample" })} className="btn btn-sm h-9 border border-line px-3 text-[0.6875rem] hover:border-ink" aria-label={`Add ${p.name} travel size to bag`}>Bag</button>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="lg:col-span-4" aria-labelledby="set-title">
        <div className="sticky top-[calc(var(--nav-h)+1.5rem)] bg-carbon p-6 text-bone">
          <p className="eyebrow text-gold-light">Build your sample set</p>
          <h3 id="set-title" className="mt-2 font-display text-3xl">Your set · {set.length}/{sampling.maxPerSet}</h3>
          <p className="mt-2 text-xs text-bone/60">Choose {sampling.minPerSet}–{sampling.maxPerSet} travel sizes. {PRICES_ON_REQUEST ? "Price on request, as per customization." : "The set price is simply the sum of the samples."}</p>
          <ul className="mt-5 space-y-3">
            {Array.from({ length: sampling.maxPerSet }, (_, i) => {
              const slug = set[i];
              const p = slug ? getProduct(slug) : null;
              const s = slug ? sampleFor(slug) : null;
              return (
                <li key={i} className={cn("flex items-center gap-3 border p-2", p ? "border-line-dark" : "border-dashed border-line-dark/70")}>
                  <span className="relative h-11 w-11 shrink-0 bg-carbon-3">{p && <Image src={productImage(p.images[0], 640)} alt="" fill sizes="44px" className="object-contain" />}</span>
                  <span className="flex-1 text-sm leading-tight">{p ? <>{p.name}<span className="block text-xs text-bone/50">{s!.size}{PRICES_ON_REQUEST ? "" : ` · ${money(s!.price)}`}</span></> : <span className="text-bone/40">Empty slot</span>}</span>
                  {p && (
                    <button type="button" onClick={() => toggle(p.slug)} className="p-1 text-bone/60 hover:text-bone" aria-label={`Remove ${p.name} from set`}><X className="h-4 w-4" /></button>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex items-baseline justify-between border-t border-line-dark pt-4">
            <span className="text-sm text-bone/70">Set total</span>
            <span className={PRICES_ON_REQUEST ? "font-display text-2xl" : "font-display text-3xl tabular-nums"}>{priceText(total)}</span>
          </div>
          {PRICES_ON_REQUEST ? (
            ready ? (
              <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`Sample set — travel sizes (${set.map((x) => getProduct(x)?.name).filter(Boolean).join(", ")})`)} className="btn btn-gold mt-5 w-full" data-request-price>Request set price</a>
            ) : (
              <button type="button" disabled className="btn btn-gold mt-5 w-full">Choose {sampling.minPerSet - set.length} more</button>
            )
          ) : (
          <button
            type="button"
            disabled={!ready}
            onClick={() => {
              addMany(set.map((slug) => ({ slug, size: "sample" as const, bundle: "My sample set" })));
              setDone(true);
              setSet([]);
            }}
            className="btn btn-gold mt-5 w-full"
          >
            {done ? <><Check className="h-4 w-4" /> Added to bag</> : ready ? `Add set to bag — ${money(total)}` : `Choose ${sampling.minPerSet - set.length} more`}
          </button>
          )}
          {set.length > 0 && <button type="button" onClick={() => setSet([])} className="mt-3 inline-flex items-center gap-1 text-xs text-bone/60 underline underline-offset-4"><Minus className="h-3 w-3" /> Clear set</button>}
          <p className="mt-5 text-[0.6875rem] leading-relaxed text-bone/50">{sampling.shippingNote}{sampling.creditTowardsFullSize || PRICES_ON_REQUEST ? "" : " Sample prices aren't credited towards a later full-size purchase."}</p>
        </div>
      </aside>
    </div>
  );
}
