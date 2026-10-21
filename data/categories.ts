import type { Category } from "@/types";

/* Categories mirror the real catalogue (Drive inventory, Oct 2026):
   Skincare, Body Care, Hair Care and Lips. Made-to-order formulas are
   not a catalogue category — see /customization.
   `types` are the product types used by the shop filter and URLs
   (/shop/face, /shop/cleansers, …). */
export const categories: Category[] = [
  {
    id: "face",
    label: "Skincare",
    title: "Skincare",
    description: "Face washes and cleansers, serums and treatment creams, moisturizers, sun protection, masks and scrubs.",
    hero: "24k-gold-face-elixir",
    types: [
      { id: "cleansers", label: "Face Wash & Cleansers" },
      { id: "treatments", label: "Serums & Treatments" },
      { id: "moisturizers", label: "Face Creams & Moisturizers" },
      { id: "sun-care", label: "Sun Protection" },
      { id: "masks", label: "Masks & Scrubs" },
    ],
  },
  {
    id: "body",
    label: "Body Care",
    title: "Body Care",
    description: "Body lotions, creams and gels, body wash and shower gel, and bathing soaps.",
    hero: "coco-glow-body-lotion",
    types: [
      { id: "body-care", label: "Lotions, Creams & Gels" },
      { id: "body-wash", label: "Body Wash & Shower Gel" },
      { id: "bath-bars", label: "Body Soaps" },
    ],
  },
  {
    id: "hair",
    label: "Hair Care",
    title: "Hair Care",
    description: "Shampoos, hair oils, an anti-dandruff scalp treatment and beard oil.",
    hero: "aloe-nourish-shampoo",
    types: [
      { id: "hair-care", label: "Shampoos" },
      { id: "hair-oils", label: "Hair Oils" },
      { id: "scalp", label: "Scalp Treatments" },
      { id: "styling", label: "Beard Care" },
    ],
  },
  {
    id: "lips",
    label: "Lips",
    title: "Lips",
    description: "Lipstick in seven shades and high-shine, plumping lip gloss in five shades.",
    hero: "gloss-chocolate-dream",
    types: [{ id: "lipstick", label: "Lipstick" }, { id: "lip-gloss", label: "Lip Gloss" }],
  },
];

export const allTypes = categories.flatMap((c) => c.types.map((t) => ({ ...t, category: c.id })));

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function getType(id: string) {
  return allTypes.find((t) => t.id === id);
}

export const skinTypes = ["Dry", "Oily", "Combination", "Normal", "Sensitive", "Dehydrated"];
