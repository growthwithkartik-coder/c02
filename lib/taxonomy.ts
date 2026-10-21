import { products } from "@/data/products";
import {
  departments,
  departmentOrder,
  formats,
  hairConcerns,
  ingredientFacets,
  productConcerns,
  productFormat,
  skinConcerns,
  type Concern,
  type Department,
  type DepartmentId,
} from "@/data/taxonomy";
import type { Product } from "@/types";

/* ------------------------------------------------------------------
   Taxonomy queries — departments, concerns, formats and facet values.
------------------------------------------------------------------- */

export function getDepartment(id: string): Department | undefined {
  return departments.find((d) => d.id === id);
}

export function getDepartments() {
  return departmentOrder.map((id) => getDepartment(id)!);
}

export function productsInDepartment(id: DepartmentId) {
  const d = getDepartment(id);
  return d ? products.filter((p) => d.includes(p)) : [];
}

/** The one department a product is filed under (breadcrumbs, search groups). */
export function primaryDepartment(p: Pick<Product, "slug" | "category" | "type">): DepartmentId {
  if (p.category === "lips" || p.slug === "custom-lip") return "lips";
  if (p.category === "hair") return "hair";
  if (p.category === "body") return "body";
  return "skin";
}

export function concernsForDepartment(id: DepartmentId): Concern[] {
  const list = id === "skin" || id === "body" ? skinConcerns : id === "hair" ? hairConcerns : [];
  const inDept = productsInDepartment(id);
  // never show an empty concern; tile image comes from a product in THIS department
  return list
    .filter((c) => inDept.some((p) => productConcerns[p.slug]?.includes(c.id)))
    .map((c) => {
      if (id !== "body") return c;
      const p = inDept.find((x) => productConcerns[x.slug]?.includes(c.id) && x.images[0]);
      return p ? { ...c, image: p.images[0] } : c;
    });
}

export function getConcern(id: string) {
  return [...skinConcerns, ...hairConcerns].find((c) => c.id === id);
}

export function concernsOf(slug: string) {
  return productConcerns[slug] ?? [];
}

export function formatOf(p: Pick<Product, "slug" | "type">) {
  return productFormat[p.slug] ?? p.type;
}

export function formatLabel(id: string) {
  return formats.find((f) => f.id === id)?.label ?? id;
}

/** Short, singular-ish label for product cards. */
export function cardTypeLabel(p: Product) {
  const f = formatOf(p);
  const map: Record<string, string> = {
    "face-wash": "Face wash",
    serum: p.custom ? "Serum · made to order" : "Face serum",
    "treatment-cream": "Treatment cream",
    moisturizer: p.custom ? "Moisturizer · made to order" : "Moisturizer",
    "face-mask": "Face mask",
    scrub: "Scrub",
    "body-lotion": "Body lotion",
    "body-gel": "Body gel",
    "body-wash": "Body wash",
    "bath-bar": "Body soap",
    shampoo: "Shampoo",
    "hair-oil": "Hair oil",
    "scalp-treatment": "Scalp treatment",
    beard: "Beard oil",
    lipstick: "Lipstick",
    "lip-gloss": "Lip gloss",
    "lip-colour": "Lip colour · made to order",
    sunscreen: "Sunscreen",
  };
  return map[f] ?? formatLabel(f);
}

export function areaOf(p: Pick<Product, "category" | "slug">): "face" | "body" | null {
  if (p.category === "face" || p.slug === "custom-serum" || p.slug === "custom-moisturizer") return "face";
  if (p.category === "body") return "body";
  return null;
}

export function ingredientIdsOf(p: Product) {
  const names = p.ingredients.map((i) => i.name).join(" | ");
  return ingredientFacets.filter((f) => f.match.test(names)).map((f) => f.id);
}

export function finishGroupOf(p: Product) {
  if (p.custom) return "Made to your finish";
  if (/shine|gloss/i.test(p.finish)) return "High shine";
  return p.finish || "—";
}

/* ---------------- lip shades (try-on + filters) ---------------- */

export interface TryOnShade {
  id: string; // stable id used in URLs/storage
  name: string;
  hex: string;
  slug: string; // product it belongs to
  finish: "gloss" | "satin";
  /** retail line the shade belongs to (groups the try-on shade panel) */
  line: "lipstick" | "gloss" | "custom";
  /** product photograph of this shade, when the product has one per shade */
  image?: string;
  indicative?: boolean; // made-to-order colour family, not a fixed retail shade
}

/** Stable try-on id for a product shade: the product slug for single-shade
 *  products (keeps existing links working), slug:shade for multi-shade ones. */
export function shadeIdFor(p: Pick<Product, "slug" | "shades">, shadeName?: string) {
  if (p.shades.length <= 1 || !shadeName) return p.slug;
  return `${p.slug}:${shadeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

/** Indicative colours for the made-to-order lip colour families.
 *  The final colour is matched to the customer, so these are labelled as indicative. */
const customLipFamilies: Record<string, string> = {
  Rose: "#B0606B",
  Coral: "#D06A5A",
  Berry: "#8A2D4C",
  Nude: "#B47E6E",
  Terracotta: "#A4533C",
  Red: "#B0232E",
};

export function getTryOnShades(): TryOnShade[] {
  const lips = products.filter((p) => p.category === "lips");
  const retail = (line: "lipstick" | "gloss") =>
    lips
      .filter((p) => (line === "lipstick" ? p.type === "lipstick" : p.type !== "lipstick"))
      .flatMap((p) =>
        p.shades.map((s) => ({
          id: shadeIdFor(p, s.name),
          name: s.name,
          hex: s.hex,
          slug: p.slug,
          finish: line === "gloss" || /glossy/i.test(s.name) ? ("gloss" as const) : ("satin" as const),
          line,
          image: s.image ?? p.images[0],
        })),
      );
  const custom = Object.entries(customLipFamilies).map(([name, hex]) => ({
    id: `custom-lip:${name.toLowerCase()}`,
    name,
    hex,
    slug: "custom-lip",
    finish: "satin" as const,
    line: "custom" as const,
    indicative: true,
  }));
  return [...retail("lipstick"), ...retail("gloss"), ...custom];
}

export function supportsTryOn(p: Pick<Product, "category" | "slug">) {
  return p.category === "lips" || p.slug === "custom-lip";
}
