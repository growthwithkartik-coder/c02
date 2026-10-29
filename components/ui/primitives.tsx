"use client";

import Link from "next/link";
import { Minus, Plus, Star, ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { cn, money, isPricePending, PRICES_ON_REQUEST, PRICE_ON_REQUEST_LABEL } from "@/lib/utils";
import type { Product } from "@/types";

export function Price({ product, className }: { product: Pick<Product, "price" | "compareAtPrice"> & { availability?: string }; className?: string }) {
  if (PRICES_ON_REQUEST || (product.availability && isPricePending(product as { availability: string; custom?: unknown; category?: string }))) {
    return <span className={cn("text-taupe", className)} data-price-pending>{PRICE_ON_REQUEST_LABEL}</span>;
  }
  return (
    <span className={cn("tabular-nums", className)}>
      {money(product.price)}
      {product.compareAtPrice && product.compareAtPrice > product.price ? (
        <s className="ml-2 opacity-50">{money(product.compareAtPrice)}</s>
      ) : null}
    </span>
  );
}

/** Shows stars only when real reviews exist. */
export function Rating({ product, className, showEmpty = false }: { product: Product; className?: string; showEmpty?: boolean }) {
  if (!product.rating || !product.reviewCount) {
    return showEmpty ? <span className={cn("text-xs text-taupe", className)}>No reviews yet</span> : null;
  }
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", className)} aria-label={`Rated ${product.rating} out of 5 from ${product.reviewCount} reviews`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-3 w-3", i < Math.round(product.rating!) ? "fill-gold text-gold" : "text-taupe/40")} />
      ))}
      <span className="ml-1 tabular-nums text-taupe">({product.reviewCount})</span>
    </span>
  );
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  dark = false,
  label = "Quantity",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  dark?: boolean;
  label?: string;
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  return (
    <div className={cn("inline-flex items-center border", dark ? "border-line-dark" : "border-line", h)} role="group" aria-label={label}>
      <button type="button" className={cn("grid aspect-square place-items-center transition-colors hover:text-gold", h)} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <output className="min-w-[2rem] text-center text-sm tabular-nums" aria-live="polite">{value}</output>
      <button type="button" className={cn("grid aspect-square place-items-center transition-colors hover:text-gold", h)} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function Breadcrumbs({ items, className, dark }: { items: { label: string; href?: string }[]; className?: string; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("eyebrow", dark ? "text-bone/50" : "text-taupe", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {it.href ? <Link href={it.href} className={cn("link-underline", dark ? "hover:text-bone" : "hover:text-ink")}>{it.label}</Link> : <span aria-current="page" className={dark ? "text-bone/80" : "text-ink"}>{it.label}</span>}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Accordion({ items, defaultOpen = 0, dark }: { items: { title: string; content: React.ReactNode }[]; defaultOpen?: number | null; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const id = useId();
  return (
    <div className={cn("border-t", dark ? "border-line-dark" : "border-line")}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.title} className={cn("border-b", dark ? "border-line-dark" : "border-line")}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between py-5 text-left text-sm font-medium uppercase tracking-[0.14em]"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {it.title}
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-500 ease-expo", isOpen && "rotate-180")} />
              </button>
            </h3>
            <div id={`${id}-${i}`} role="region" hidden={!isOpen} className="pb-6 text-[0.95rem] leading-relaxed opacity-80">
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Badge({ children, tone = "light", className }: { children: React.ReactNode; tone?: "light" | "dark" | "gold"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em]",
        tone === "light" && "bg-bone/90 text-ink backdrop-blur",
        tone === "dark" && "bg-carbon text-bone",
        tone === "gold" && "bg-gold text-carbon",
        className,
      )}
    >
      {children}
    </span>
  );
}
