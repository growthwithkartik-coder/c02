"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { CartLine } from "@/types";
import { useStore } from "@/components/providers/StoreProvider";
import { getProduct } from "@/lib/catalog";
import { sampleFor, packagingSurcharge } from "@/lib/commerce";
import { maxQtyFor } from "@/lib/cart";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantityStepper } from "@/components/ui/primitives";
import { money, cn } from "@/lib/utils";

export function CartLineItem({ line, onNavigate, large }: { line: CartLine; onNavigate?: () => void; large?: boolean }) {
  const { setQty, removeLine } = useStore();
  const p = getProduct(line.slug);
  if (!p) return null;
  const opts = line.options ? Object.entries(line.options).filter(([, v]) => v) : [];
  const sample = line.size === "sample" ? sampleFor(p.slug) : null;
  if (line.size === "sample" && !sample) return null;
  const unit = sample ? sample.price : p.price + packagingSurcharge(line.options);
  return (
    <li className={cn("flex gap-4 py-5", large && "gap-6 py-7")}>
      <Link href={`/product/${p.slug}`} onClick={onNavigate} className={cn("relative shrink-0 overflow-hidden", large ? "h-32 w-32 md:h-40 md:w-40" : "h-24 w-24")}>
        <ProductImage product={p} sizes="160px" className="absolute inset-0" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/product/${p.slug}`} onClick={onNavigate} className={cn("font-display leading-tight hover:text-gold", large ? "text-2xl md:text-3xl" : "text-xl")}>
              {p.name}
            </Link>
            {sample && <p className="mt-1 inline-block bg-stone px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ink">Travel size</p>}
            {line.bundle && <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.14em] text-gold-deep">{line.bundle}</p>}
            <p className="mt-0.5 text-xs text-taupe">
              {sample ? sample.size : p.size}
              {line.shade ? ` · ${line.shade}` : ""}
            </p>
            {opts.length > 0 && (
              <p className="mt-1 line-clamp-2 text-xs text-ink-soft">{opts.map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>
            )}
          </div>
          <button onClick={() => removeLine(line.key)} aria-label={`Remove ${p.name}`} className="-mr-1 p-1 text-taupe hover:text-ink">
            <X className="h-4 w-4" strokeWidth={1.4} />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <QuantityStepper size="sm" value={line.qty} max={maxQtyFor(line.size)} onChange={(n) => setQty(line.key, n)} label={`Quantity of ${p.name}`} />
          <p className="text-sm tabular-nums">{money(unit * line.qty)}</p>
        </div>
      </div>
    </li>
  );
}
