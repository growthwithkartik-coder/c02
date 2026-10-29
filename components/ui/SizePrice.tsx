import type { Product } from "@/types";
import { sampleFor } from "@/lib/commerce";
import { cn, isPricePending, money, PRICE_ON_REQUEST_LABEL, PRICE_ON_REQUEST_NOTE } from "@/lib/utils";

/* ------------------------------------------------------------------
   Full-size + travel-size details, from the CO2 product price sheet.

   - Full size: net weight + price (always shown).
   - Travel size: net weight + price, shown ONLY when the sheet gives
     both (data/sampling.ts). Otherwise the travel row is omitted
     entirely — no "NA", dash, placeholder or "not available" text.
   - Unpriced products (awaiting confirmation) show "Price on request".
------------------------------------------------------------------- */

export function netWeight(p: Pick<Product, "size">) {
  return p.size.split("/")[0].trim();
}

type Row = { id: "full" | "travel"; label: string; weight: string; price: number | null };

export function sizeRows(p: Product): Row[] {
  const pending = isPricePending(p);
  const rows: Row[] = [{ id: "full", label: "Full size", weight: netWeight(p), price: pending ? null : p.price }];
  const s = p.custom ? null : sampleFor(p.slug);
  if (s && !pending) rows.push({ id: "travel", label: "Travel size", weight: s.size, price: s.price });
  return rows;
}

/** Compact two-line block for product cards. */
export function CardSizePrice({ product, dark = false, compact = false }: { product: Product; dark?: boolean; compact?: boolean }) {
  const rows = sizeRows(product);
  const pending = isPricePending(product);
  const muted = dark ? "text-bone/50" : "text-taupe";
  const strong = dark ? "text-bone" : "text-ink";
  if (pending) {
    return (
      <div data-price-pending>
        <p className={cn("text-xs", muted)}>Net wt. {rows[0].weight}</p>
        <p className={cn("mt-1 text-[0.95rem] font-medium", strong)}>
          {PRICE_ON_REQUEST_LABEL}
          {!compact && <span className={cn("block text-xs font-normal", muted)}>{PRICE_ON_REQUEST_NOTE}</span>}
        </p>
      </div>
    );
  }
  return (
    <dl className="space-y-1" data-size-price>
      {rows.map((r) => (
        <div key={r.id} className="flex items-baseline justify-between gap-2" data-size-row={r.id}>
          <dt className={cn("min-w-0 text-xs", muted)}>
            <span className="whitespace-nowrap">{r.label}</span> <span className="whitespace-nowrap">· {r.weight}</span>
          </dt>
          <dd className={cn("shrink-0 tabular-nums", r.id === "full" ? cn("text-[0.95rem] font-medium", strong) : cn("text-xs", dark ? "text-bone/70" : "text-ink-soft"))}>{money(r.price!)}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Spec table for the product page and quick view. */
export function DetailSizePrice({ product, className }: { product: Product; className?: string }) {
  const rows = sizeRows(product);
  const pending = isPricePending(product);
  return (
    <div className={cn("border-y border-line", className)} data-size-price>
      {rows.map((r, i) => (
        <div key={r.id} className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-3", i > 0 && "border-t border-line")} data-size-row={r.id}>
          <div className="min-w-0">
            <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-taupe">{r.label}</p>
            <p className="mt-0.5 text-sm text-ink">Net wt. {r.weight}</p>
          </div>
          {pending ? (
            <p className="text-right text-sm text-taupe" data-price-pending>{PRICE_ON_REQUEST_LABEL}</p>
          ) : (
            <p className={cn("text-right tabular-nums", r.id === "full" ? "font-display text-3xl leading-none" : "text-lg")}>{money(r.price!)}</p>
          )}
        </div>
      ))}
    </div>
  );
}
