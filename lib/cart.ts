import { site } from "@/data/site";
import { isPricePending } from "@/lib/utils";
import { getProduct } from "@/lib/catalog";
import { allowedPackaging, packagingSurcharge, PACKAGING_KEYS, sampleFor } from "@/lib/commerce";
import { labelPersonalisation } from "@/data/customize";
import { sampling } from "@/data/sampling";

export const maxQtyFor = (size?: "full" | "sample") => (size === "sample" ? sampling.maxQtyPerSample : MAX_QTY);
import type { CartLine, CartTotals, OrderItem } from "@/types";

/* ------------------------------------------------------------------
   Pricing — shared by the browser cart and the server order route.
   The server ALWAYS recomputes totals from data/products.ts; prices
   sent by the browser are never trusted.
------------------------------------------------------------------- */

export const MAX_QTY = 10;

export function lineKey(slug: string, shade?: string, options?: Record<string, string>, size?: "full" | "sample") {
  const opt = options
    ? Object.entries(options)
        .filter(([, v]) => v)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join("|")
    : "";
  return [slug, shade ?? "", opt, size === "sample" ? "sample" : ""].join("::");
}

export function normalizeCode(code?: string | null) {
  return (code ?? "").trim().toUpperCase();
}

export function validateDiscount(code?: string | null) {
  const c = normalizeCode(code);
  if (!c) return null;
  const rule = site.commerce.discountCodes[c];
  return rule ? { code: c, ...rule } : null;
}

export function priceLines(lines: CartLine[]): OrderItem[] {
  const items: OrderItem[] = [];
  for (const l of lines) {
    const p = getProduct(l.slug);
    if (!p || isPricePending(p)) continue; // no confirmed price yet — never orderable
    const isSample = l.size === "sample";
    const sample = isSample ? sampleFor(p.slug) : null;
    if (isSample && !sample) continue; // sample no longer offered
    const qty = Math.max(1, Math.min(isSample ? sampling.maxQtyPerSample : MAX_QTY, Math.floor(Number(l.qty) || 1)));
    const options = p.custom && l.options && !isSample ? sanitizeOptions(l.options, p.slug, p.custom.options) : undefined;
    const unitPrice = isSample ? sample!.price : p.price + packagingSurcharge(options);
    items.push({
      slug: p.slug,
      name: isSample ? `${p.name} — Travel size` : p.name,
      image: p.images[0] ?? null,
      unitPrice,
      qty,
      lineTotal: unitPrice * qty,
      shade: l.shade && p.shades.some((s) => s.name === l.shade) ? l.shade : undefined,
      options,
      size: isSample ? "sample" : undefined,
      sizeLabel: isSample ? sample!.size : p.size,
      bundle: typeof l.bundle === "string" && l.bundle.trim() ? l.bundle.trim().slice(0, 80) : undefined,
    });
  }
  return items;
}

function sanitizeOptions(opts: Record<string, string>, slug: string, allowed: string[]) {
  const out: Record<string, string> = {};
  for (const k of allowed) {
    const v = opts[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 240);
  }
  // packaging choices — only values offered for this formula are kept
  const pack = allowedPackaging(slug);
  if (pack) {
    for (const k of ["Packaging", "Packaging colour", "Cap"] as const) {
      const v = opts[k];
      if (typeof v === "string" && pack[k]?.includes(v)) out[k] = v;
    }
  }
  const label = opts["Label name"];
  if (labelPersonalisation.enabled && typeof label === "string") {
    const clean = label.replace(/[^\p{L}\p{N} ]/gu, "").trim().slice(0, labelPersonalisation.maxLength);
    if (clean) out["Label name"] = clean;
  }
  void PACKAGING_KEYS;
  return out;
}

export function computeTotals(lines: CartLine[], code?: string | null): CartTotals & { items: OrderItem[] } {
  const items = priceLines(lines);
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const rule = validateDiscount(code);
  let discount = 0;
  if (rule && subtotal > 0) {
    discount = rule.type === "percent" ? Math.round((subtotal * rule.value) / 100) : Math.min(rule.value, subtotal);
  }
  const afterDiscount = subtotal - discount;
  const { freeShippingThreshold, shippingFee } = site.commerce;
  const shipping = subtotal === 0 ? 0 : afterDiscount >= freeShippingThreshold ? 0 : shippingFee;
  return {
    items,
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
    itemCount: items.reduce((s, i) => s + i.qty, 0),
    freeShippingRemaining: Math.max(0, freeShippingThreshold - afterDiscount),
    appliedCode: rule?.code ?? null,
  };
}
