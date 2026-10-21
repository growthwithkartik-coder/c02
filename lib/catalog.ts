import { products } from "@/data/products";
import { customFormulas } from "@/data/custom-formulas";
import { categories, allTypes, getCategory, getType } from "@/data/categories";
import { collections } from "@/data/collections";
import type { Product } from "@/types";
import { cutoutImage, isPricePending, productImage } from "@/lib/utils";
import { concernsOf, formatLabel, formatOf, getConcern, primaryDepartment } from "@/lib/taxonomy";

/* ------------------------------------------------------------------
   Catalogue queries — the only module that reads data/products.ts
------------------------------------------------------------------- */

/* Catalogue = photographed products only. Made-to-order formulas are
   resolvable by slug (cart, builder, consultation) but never listed. */
const bySlug = new Map([...products, ...customFormulas].map((p) => [p.slug, p]));

export function getCustomFormulas() {
  return customFormulas;
}

// Guard: collections must only reference real products.
if (process.env.NODE_ENV !== "production") {
  for (const c of collections) {
    for (const s of c.products) {
      if (!bySlug.has(s)) console.warn(`[catalog] collection "${c.slug}" references unknown product "${s}"`);
    }
  }
}

export function getAllProducts() {
  return products;
}

export function getProduct(slug: string) {
  return bySlug.get(slug);
}

export function getProducts(slugs: string[]) {
  return slugs.map((s) => bySlug.get(s)).filter(Boolean) as Product[];
}

export function getPhotographedProducts() {
  return products.filter((p) => !p.custom);
}

export function getFeatured() {
  return products.filter((p) => p.featured);
}

export function getBestSellers() {
  return products.filter((p) => p.bestSeller);
}

/** Resolves /shop/[category] — accepts a category id or a product type id. */
export function resolveShopSegment(segment: string) {
  const cat = getCategory(segment);
  if (cat) return { kind: "category" as const, id: cat.id, label: cat.label, description: cat.description };
  const type = getType(segment);
  if (type) {
    const parent = getCategory(type.category)!;
    return { kind: "type" as const, id: type.id, label: type.label, description: parent.description, parent };
  }
  return null;
}

export function productsForSegment(segment: string) {
  const r = resolveShopSegment(segment);
  if (!r) return [];
  return r.kind === "category" ? products.filter((p) => p.category === r.id) : products.filter((p) => p.type === r.id);
}

export function typeLabel(typeId: string) {
  return allTypes.find((t) => t.id === typeId)?.label ?? typeId;
}

export function categoryLabel(id: string) {
  return categories.find((c) => c.id === id)?.label ?? id;
}

/** Related products stay inside the product's own department (skin / hair / body / lips). */
export function getRelated(p: Product, n = 4) {
  const dept = primaryDepartment(p);
  const pool = products.filter((x) => x.slug !== p.slug && primaryDepartment(x) === dept);
  const fmt = formatOf(p);
  const sameFormat = pool.filter((x) => formatOf(x) === fmt);
  const sameArea = pool.filter((x) => formatOf(x) !== fmt && x.category === p.category);
  const rest = pool.filter((x) => formatOf(x) !== fmt && x.category !== p.category);
  return [...sameFormat, ...sameArea, ...rest].slice(0, n);
}

/** A simple routine: one product per step for the product's category, including the product itself. */
const routineSteps: Record<string, { type: string; step: string }[]> = {
  face: [
    { type: "cleansers", step: "Cleanse" },
    { type: "treatments", step: "Treat" },
    { type: "moisturizers", step: "Moisturize" },
    { type: "sun-care", step: "Protect (AM)" },
    { type: "masks", step: "Weekly mask" },
  ],
  body: [
    { type: "body-wash", step: "Wash" },
    { type: "body-care", step: "Nourish" },
  ],
  hair: [
    { type: "hair-oils", step: "Pre-wash oil" },
    { type: "hair-care", step: "Shampoo" },
    { type: "scalp", step: "Scalp care" },
  ],
  lips: [
    { type: "lip-gloss", step: "Colour" },
  ],
};

export function getRoutine(p: Product) {
  const steps = routineSteps[p.category];
  if (!steps) return [];
  return steps
    .map(({ type, step }) => {
      const prod = p.type === type ? p : products.find((x) => x.type === type && x.bestSeller) ?? products.find((x) => x.type === type);
      return prod ? { step, product: prod } : null;
    })
    .filter(Boolean) as { step: string; product: Product }[];
}

/** Two complementary products from different types in the same category. */
export function getFrequentlyBought(p: Product) {
  const pool = products.filter((x) => x.slug !== p.slug && !x.custom && x.availability !== "price-pending" && x.category === p.category && x.type !== p.type);
  const picks: Product[] = [];
  const seen = new Set<string>();
  for (const x of [...pool.filter((x) => x.bestSeller), ...pool]) {
    if (!seen.has(x.type)) {
      picks.push(x);
      seen.add(x.type);
    }
    if (picks.length === 2) break;
  }
  if (picks.length < 2) {
    for (const x of products.filter((x) => x.slug !== p.slug && !x.custom && x.availability !== "price-pending" && x.type === p.type)) {
      if (!picks.includes(x)) picks.push(x);
      if (picks.length === 2) break;
    }
  }
  return picks;
}

export function collectionsFor(p: Product) {
  return collections.filter((c) => c.products.includes(p.slug));
}

/* ---------------- search ---------------- */

export function searchIndexText(p: Product) {
  return [
    p.name,
    p.subtitle,
    p.shortDescription,
    categoryLabel(p.category),
    typeLabel(p.type),
    p.tags.join(" "),
    p.ingredients.map((i) => i.name).join(" "),
    p.skinTypes.join(" "),
    p.shades.map((s) => s.name).join(" "),
    concernsOf(p.slug).map((c) => getConcern(c)?.label ?? "").join(" "),
    formatLabel(formatOf(p)),
  ]
    .join(" ")
    .toLowerCase();
}

export function searchProducts(q: string, list: Product[] = products) {
  const terms = q
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!terms.length) return [];
  return list
    .map((p) => {
      const hay = searchIndexText(p);
      const name = p.name.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (!hay.includes(t)) return null;
        score += name.includes(t) ? 3 : 1;
        if (name.startsWith(t)) score += 2;
      }
      return { p, score };
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .map((r) => r!.p);
}

/* ---------------- ingredient library ---------------- */

export function getIngredientLibrary() {
  const map = new Map<string, { name: string; notes: Set<string>; products: Product[] }>();
  for (const p of products) {
    if (p.custom) continue;
    for (const ing of p.ingredients) {
      const key = ing.name.trim().toLowerCase();
      if (!map.has(key)) map.set(key, { name: ing.name.trim(), notes: new Set(), products: [] });
      const e = map.get(key)!;
      if (ing.note) e.notes.add(ing.note);
      if (!e.products.includes(p)) e.products.push(p);
    }
  }
  return [...map.values()]
    .map((e) => ({ name: e.name, note: [...e.notes][0] ?? "", products: e.products }))
    .sort((a, b) => b.products.length - a.products.length || a.name.localeCompare(b.name));
}

export function primaryImage(p: Product) {
  return p.images[0] ?? null;
}

/** Transparent cut-out for a product slug when one exists, otherwise its first photograph. */
export function hasCutout(slug: string) {
  return products.some((p) => p.cutout === slug);
}
export function heroImage(slug: string) {
  return hasCutout(slug) ? cutoutImage(slug) : productImage(getProduct(slug)?.images[0] ?? `${slug}-1`);
}
