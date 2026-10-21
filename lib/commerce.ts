import { sampling } from "@/data/sampling";
import { buildProducts, capFinishes, containers, formatToBuild, getBuildProduct, packColours, type BuildProduct } from "@/data/customize";
import { productFormat } from "@/data/taxonomy";
import type { Product } from "@/types";

/* ------------------------------------------------------------------
   Commerce helpers shared by browser and server:
   samples (travel sizes), customization availability and packaging
   pricing. Pure functions over data/ — safe to import anywhere.
------------------------------------------------------------------- */

export const PACKAGING_KEYS = ["Packaging", "Packaging colour", "Cap", "Label name"] as const;

export function sampleFor(slug: string) {
  if (!sampling.enabled) return null;
  return sampling.items[slug] ?? null;
}

export function hasSample(slug: string) {
  return !!sampleFor(slug);
}

export function setPrice(slugs: string[]) {
  return slugs.reduce((s, x) => s + (sampleFor(x)?.price ?? 0), 0);
}

/** Which customizable product a catalogue product can start in Make It Yours (or null). */
export function customizationFor(p: Pick<Product, "slug" | "type" | "custom">): BuildProduct | null {
  if (p.custom) return getBuildProduct(p.slug) ?? null;
  const fmt = productFormat[p.slug] ?? p.type;
  const id = formatToBuild[fmt];
  return id ? getBuildProduct(id) ?? null : null;
}

export function isCustomizable(p: Pick<Product, "slug" | "type" | "custom">) {
  return !!customizationFor(p);
}

/** Packaging surcharge from the chosen labels (all 0 by default — included in the listed price). */
export function packagingSurcharge(options?: Record<string, string>) {
  if (!options) return 0;
  const c = Object.values(containers).find((x) => x.label === options["Packaging"]);
  const col = Object.values(packColours).find((x) => x.label === options["Packaging colour"]);
  const cap = Object.values(capFinishes).find((x) => x.label === options["Cap"]);
  return (c?.surcharge ?? 0) + (col?.surcharge ?? 0) + (cap?.surcharge ?? 0);
}

/** Packaging values allowed for a listed formula (server-side sanitising). */
export function allowedPackaging(slug: string) {
  const b = buildProducts.find((x) => x.slug === slug);
  if (!b) return null;
  return {
    Packaging: b.containers.map((c) => containers[c].label),
    "Packaging colour": b.colours.map((c) => packColours[c].label),
    Cap: b.caps.map((c) => capFinishes[c].label),
  } as Record<string, string[]>;
}
