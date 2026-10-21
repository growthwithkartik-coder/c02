import type { Collection } from "@/types";

/* Curated edits. Every slug must exist in data/products.ts —
   the build will flag unknown slugs (see lib/catalog.ts).
   October 2026: rebuilt from the Drive product inventory only. */
export const collections: Collection[] = [
  {
    slug: "the-charcoal-ritual",
    title: "The Charcoal Ritual",
    kicker: "Collection 01",
    description: "Activated and bamboo charcoal plus multani mitti for a deep, clean reset — a face wash and two masks.",
    story:
      "Wash with charcoal daily and mask weekly with charcoal or multani mitti (Fuller's earth) — the ingredients printed on each pack.",
    hero: "noir-charcoal-mask",
    tone: "dark",
    products: ["noir-charcoal-face-wash", "noir-charcoal-mask", "multani-mitti-face-mask"],
  },
  {
    slug: "botanical-clarity",
    title: "Botanical Clarity",
    kicker: "Collection 02",
    description: "Neem, aloe, tulasi and turmeric — botanical face care for skin that runs oily.",
    story:
      "The plants that have always been on the bathroom shelf, in modern textures: an aloe neem face wash, two botanical creams and a multi-use aloe gel.",
    hero: "neem-rose-face-wash",
    tone: "light",
    products: ["neem-rose-face-wash", "clarite-botanical-cream", "no-marks-cream", "aloe-pure-gel"],
  },
  {
    slug: "high-shine-lips",
    title: "High-Shine Lips",
    kicker: "Collection 03",
    description: "Five shades of plumping, non-sticky gloss with vitamin E, jojoba and shea.",
    story: "Berry, burgundy, chocolate, classic red and soft rose — colour with a glass finish.",
    hero: "gloss-berry-rubin",
    tone: "dark",
    products: ["gloss-berry-rubin", "gloss-burgundy-spirit", "gloss-chocolate-dream", "gloss-red-kiss", "gloss-secret-rose"],
  },
  {
    slug: "scalp-clear-system",
    title: "The Anti-Dandruff Routine",
    kicker: "Collection 04",
    description: "Three steps for a flake-free-feeling scalp — anti-dandruff shampoo, hair oil and treatment gel.",
    story: "Neem, tea tree and aloe across three formats, so the routine fits wash days and the days between.",
    hero: "scalp-clear-hair-oil",
    tone: "light",
    products: ["scalp-clear-shampoo", "scalp-clear-hair-oil", "scalp-clear-treatment-gel"],
  },
  {
    slug: "the-hair-shelf",
    title: "The Hair Shelf",
    kicker: "Collection 05",
    description: "Five shampoos and two oils — aloe, onion, herbal and shikakai — plus beard oil.",
    story: "Shampoos kept together, oils kept together, so wash day and oiling day are easy to plan.",
    hero: "aloe-nourish-shampoo",
    tone: "dark",
    products: ["aloe-nourish-shampoo", "onion-shampoo", "herbal-shampoo", "shikakai-shampoo", "scalp-clear-shampoo", "onion-hair-oil", "scalp-clear-hair-oil", "groom-beard-oil"],
  },
  {
    slug: "the-body-ritual",
    title: "The Body Ritual",
    kicker: "Collection 06",
    description: "Lotions, creams, gels and washes for everyday body care.",
    story: "Cucumber, tulasi, lavender and calamine — daily body care from the neck down.",
    hero: "coco-glow-body-lotion",
    tone: "light",
    products: [
      "coco-glow-body-lotion",
      "aloe-veil-body-lotion",
      "tulasi-balance-body-lotion",
      "lumiere-even-tone-lotion",
      "calamine-calm-lotion",
      "decollete-nourishing-cream",
      "stretch-marks-gel",
      "white-petroleum-jelly",
      "lavender-santal-body-wash",
      "shower-gel",
    ],
  },
  {
    slug: "bath-bar-library",
    title: "The Body Soap Library",
    kicker: "Collection 07",
    description: "Fifteen bathing bars — six herbal bars (including goat milk), beetroot, coffee, kumkumadi, neem, papaya, red wine, sandal, sunni pindi and turmeric.",
    story: "Each bar is embossed with the CO2 mark. Ingredients and weights are as printed on each lid.",
    hero: "goat-milk-herbal-bar",
    tone: "light",
    products: [
      "goat-milk-herbal-bar",
      "aloe-vera-herbal-bar",
      "lemon-zest-herbal-bar",
      "mint-cool-herbal-bar",
      "neem-purify-herbal-bar",
      "sandal-glow-herbal-bar",
      "beetroot-soap",
      "coffee-soap",
      "kumkumadi-soap",
      "neem-soap",
      "papaya-soap",
      "red-wine-soap",
      "sandal-soap",
      "sunni-pindi-soap",
      "turmeric-soap",
    ],
  },
];

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}
