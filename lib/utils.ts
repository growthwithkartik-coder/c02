import { versioned } from "@/lib/image-loader";
import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function money(value: number) {
  return inr.format(Math.round(value));
}

/** Catalogue pricing mode. Since 26 Oct 2026 catalogue products show the listed
 *  full-size and travel-size prices from the CO2 product price sheet (data/products.ts,
 *  data/sampling.ts). Set to true to hide every price again ("price on request"). */
export const PRICES_ON_REQUEST = false;

/** Made-to-order formulas and the Make It Yours builder stay "price on request ·
 *  as per customization" — their prices are not on the price sheet. */
export const CUSTOM_PRICES_ON_REQUEST = true;
export const PRICE_ON_REQUEST_LABEL = "Price on request";
export const PRICE_ON_REQUEST_NOTE = "As per customization";
export const PRICE_ON_REQUEST_TEXT = `${PRICE_ON_REQUEST_LABEL} · ${PRICE_ON_REQUEST_NOTE.toLowerCase()}`;

/** True when a product has no listed price (always, while PRICES_ON_REQUEST is on). It is
 *  shown (with try-on, shades and details) but every purchase path is replaced by a price
 *  request, and the server rejects it. */
export function isPricePending(p: { availability: string; custom?: unknown; category?: string } | null | undefined) {
  if (PRICES_ON_REQUEST) return !!p;
  if (!p) return false;
  if (CUSTOM_PRICES_ON_REQUEST && (p.custom || p.category === "made-personal")) return true;
  return p.availability === "price-pending";
}

/** Text for any price slot: the formatted price, or "Price on request" while prices are hidden. */
export function priceText(value: number | null | undefined) {
  if (PRICES_ON_REQUEST || value == null) return PRICE_ON_REQUEST_LABEL;
  return money(value);
}

/** The listed price of a product, or null when it is unpriced / on request. */
export function listedPrice(p: { price: number; availability: string; custom?: unknown; category?: string } | null | undefined) {
  return !p || isPricePending(p) ? null : p.price;
}

/** Price sort that always lists unpriced ("price coming soon") products last. */
export function comparePrice(a: { price: number; availability: string }, b: { price: number; availability: string }, dir: 1 | -1 = 1) {
  const pa = isPricePending(a), pb = isPricePending(b);
  if (pa !== pb) return pa ? 1 : -1;
  return dir * (a.price - b.price);
}

/** Product photograph path. Images exist at 640 and 1200 px widths. */
export function productImage(key: string, size: 640 | 1200 = 1200) {
  return versioned(`/products/${key}-${size}.webp`);
}

export function cutoutImage(slug: string) {
  return versioned(`/campaign/${slug}.webp`);
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function plural(n: number, one: string, many = one + "s") {
  return `${n} ${n === 1 ? one : many}`;
}

export function absoluteUrl(path: string, base: string) {
  return new URL(path, base).toString();
}
