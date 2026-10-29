"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { getAllProducts } from "@/lib/catalog";
import { cardTypeLabel, getDepartments, primaryDepartment } from "@/lib/taxonomy";
import { cn, isPricePending, money, productImage, priceText, PRICES_ON_REQUEST } from "@/lib/utils";

import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";
/* Build Your Own Combo — pick 2–6 ready-made products from any category,
   see the live total (plain sum, no invented discount), review and add
   them to the bag tagged as one set. */
const MIN = 2;
const MAX = 6;

export function BuildCombo() {
  const { addMany } = useStore();
  const depts = getDepartments();
  const [dept, setDept] = useState(depts[0].id);
  const [picked, setPicked] = useState<string[]>([]);
  const [name, setName] = useState("My CO2 routine");
  const [done, setDone] = useState(false);
  const all = useMemo(() => getAllProducts().filter((p) => !p.custom && (PRICES_ON_REQUEST || !isPricePending(p))), []);
  const list = all.filter((p) => primaryDepartment(p) === dept);
  const chosen = picked.map((s) => all.find((p) => p.slug === s)!).filter(Boolean);
  const total = chosen.reduce((t, p) => t + p.price, 0);
  const toggle = (slug: string) => {
    setDone(false);
    setPicked((x) => (x.includes(slug) ? x.filter((y) => y !== slug) : x.length >= MAX ? x : [...x, slug]));
  };
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div role="tablist" aria-label="Category" className="flex flex-wrap gap-2">
          {depts.map((d) => (
            <button key={d.id} role="tab" aria-selected={dept === d.id} data-active={dept === d.id} onClick={() => setDept(d.id)} className="chip">{d.label}</button>
          ))}
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => {
            const on = picked.includes(p.slug);
            const disabled = !on && picked.length >= MAX;
            return (
              <li key={p.slug}>
                <button type="button" onClick={() => toggle(p.slug)} disabled={disabled} aria-pressed={on} className={cn("group flex w-full flex-col border p-3 text-left transition-colors", on ? "border-ink bg-bone-2" : "border-line hover:border-ink", disabled && "opacity-40")}>
                  <span className="relative block aspect-square bg-bone-2">
                    <Image src={productImage(p.images[0], 640)} alt="" fill sizes="(max-width:640px) 45vw, 18vw" className="object-contain" />
                    <span className={cn("absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full", on ? "bg-ink text-bone" : "bg-bone/90 text-ink")}>{on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
                  </span>
                  <span className="mt-2 text-[0.625rem] uppercase tracking-[0.14em] text-taupe">{cardTypeLabel(p)}</span>
                  <span className="text-sm leading-tight">{p.name}</span>
                  <span className="mt-1 text-xs tabular-nums text-ink-soft">{p.size.split("/")[0]}{!PRICES_ON_REQUEST && <> · {money(p.price)}</>}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="lg:col-span-4">
        <div className="sticky top-[calc(var(--nav-h)+1.5rem)] border border-ink p-6">
          <p className="eyebrow text-taupe">Your combo · {chosen.length}/{MAX}</p>
          <label htmlFor="combo-name" className="sr-only">Combo name</label>
          <input id="combo-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border-b border-line bg-transparent pb-1 font-display text-3xl outline-none focus:border-ink" />
          {chosen.length ? (
            <ol className="mt-5 space-y-3">
              {chosen.map((p, i) => (
                <li key={p.slug} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-xs tabular-nums text-taupe">{i + 1}</span>
                  <span className="relative h-10 w-10 shrink-0 bg-bone-2"><Image src={productImage(p.images[0], 640)} alt="" fill sizes="40px" className="object-contain" /></span>
                  <span className="flex-1 leading-tight">{p.name}</span>
                  {!PRICES_ON_REQUEST && <span className="tabular-nums">{money(p.price)}</span>}
                  <button type="button" onClick={() => toggle(p.slug)} aria-label={`Remove ${p.name}`} className="p-1 text-taupe hover:text-ink"><X className="h-4 w-4" /></button>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-5 text-sm text-ink-soft">Pick {MIN}–{MAX} products from any category. They&apos;re listed in the order you choose them.</p>
          )}
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-sm text-ink-soft">Total</span>
            <span className={PRICES_ON_REQUEST ? "font-display text-2xl" : "font-display text-3xl tabular-nums"}>{priceText(total)}</span>
          </div>
          <p className="mt-1 text-xs text-taupe">{PRICES_ON_REQUEST ? "As per customization — we quote your combo once you send it." : "The sum of the individual prices — no bundle discount applies."}</p>
          {PRICES_ON_REQUEST ? (
            chosen.length < MIN ? (
              <button type="button" disabled className="btn btn-primary mt-5 w-full">Choose {MIN - chosen.length} more</button>
            ) : (
              <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`${name.trim() || "My CO2 routine"} (${chosen.map((p) => p.name).join(", ")})`)} className="btn btn-primary mt-5 w-full" data-request-price>Request combo price</a>
            )
          ) : (
          <button
            type="button"
            disabled={chosen.length < MIN}
            onClick={() => {
              addMany(chosen.map((p) => ({ slug: p.slug, shade: p.shades[0]?.name, bundle: name.trim() || "My CO2 routine" })));
              setDone(true);
            }}
            className="btn btn-primary mt-5 w-full"
          >
            {done ? <><Check className="h-4 w-4" /> Added to bag</> : chosen.length < MIN ? `Choose ${MIN - chosen.length} more` : `Add combo to bag — ${money(total)}`}
          </button>
          )}
        </div>
      </aside>
    </div>
  );
}
