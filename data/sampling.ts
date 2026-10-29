/* ------------------------------------------------------------------
   CO2 — Travel sizes (the Sampling Studio)

   Source of truth: "CO2 Cosmetics Product Price Sheet" (Oct 2026),
   columns "Travel Size" and "Price for Travel Size (₹)".

   Rules the site follows:
   - a product is offered in a travel size ONLY when the sheet gives both
     a travel-size net weight and a travel-size price. Products marked NA
     (or with only one of the two values) are simply left out of `items`,
     so no travel-size option, label or placeholder is shown for them;
   - a travel size is a smaller pack of the SAME formula (no different claims);
   - travel prices are never presented as free and never promised as
     credit towards a full size (`creditTowardsFullSize` stays false
     unless that becomes a real policy);
   - set prices are always the plain sum of the travel sizes inside them.
------------------------------------------------------------------- */

export interface SampleItem {
  /** pack size of the travel version, e.g. "5 ml" */
  size: string;
  /** price in INR */
  price: number;
}

export const sampling = {
  enabled: true,
  /** sizes and prices come from the CO2 product price sheet (shown nowhere on the site — for you) */
  pricingStatus: "confirmed" as "draft" | "confirmed",
  /** a sample-only order ships at the normal fee unless it crosses the free-shipping threshold */
  shippingNote: "Samples ship with the rest of your order. Sample-only orders follow the standard shipping fee and free-shipping threshold.",
  creditTowardsFullSize: false,
  maxPerSet: 5,
  minPerSet: 3,
  /** per-customer limit of each sample in one order */
  maxQtyPerSample: 3,

  items: {
    // face
    "no-marks-cream": { size: "50 g", price: 390 },
    "clarite-botanical-cream": { size: "20 g", price: 200 },
    "moisturizing-cream-spf": { size: "50 g", price: 1200 },
    "sunscreen-lotion-spf-50": { size: "50 ml", price: 1325 },
    "neem-rose-face-wash": { size: "20 ml", price: 120 },
    "noir-charcoal-face-wash": { size: "50 ml", price: 350 },
    "red-grapes-face-wash": { size: "50 ml", price: 360 },
    "milk-cleanser": { size: "50 ml", price: 300 },
    "noir-charcoal-mask": { size: "50 g", price: 460 },
    "multani-mitti-face-mask": { size: "50 g", price: 400 },
    "herbal-scrub": { size: "50 g", price: 400 },
    // body
    "aloe-veil-body-lotion": { size: "50 ml", price: 360 },
    "coco-glow-body-lotion": { size: "50 ml", price: 275 },
    "tulasi-balance-body-lotion": { size: "50 ml", price: 275 },
    "lumiere-even-tone-lotion": { size: "50 ml", price: 360 },
    "calamine-calm-lotion": { size: "50 ml", price: 340 },
    "lavender-santal-body-wash": { size: "50 ml", price: 300 },
    "shower-gel": { size: "50 ml", price: 260 },
    "aloe-vera-herbal-bar": { size: "20 g", price: 100 },
    "lemon-zest-herbal-bar": { size: "20 g", price: 100 },
    "mint-cool-herbal-bar": { size: "20 g", price: 100 },
    "neem-purify-herbal-bar": { size: "20 g", price: 100 },
    "sandal-glow-herbal-bar": { size: "20 g", price: 100 },
    "goat-milk-herbal-bar": { size: "20 g", price: 100 },
    "beetroot-soap": { size: "20 g", price: 100 },
    "red-wine-soap": { size: "20 g", price: 100 },
    "kumkumadi-soap": { size: "20 g", price: 100 },
    "neem-soap": { size: "20 g", price: 100 },
    "papaya-soap": { size: "20 g", price: 100 },
    "sandal-soap": { size: "20 g", price: 100 },
    "sunni-pindi-soap": { size: "20 g", price: 100 },
    "turmeric-soap": { size: "20 g", price: 100 },
    "coffee-soap": { size: "20 g", price: 100 },
    // hair
    "onion-shampoo": { size: "50 ml", price: 250 },
    "herbal-shampoo": { size: "50 ml", price: 300 },
    "shikakai-shampoo": { size: "50 ml", price: 280 },
    "scalp-clear-shampoo": { size: "50 ml", price: 400 },
    "scalp-clear-hair-oil": { size: "50 ml", price: 750 },
    "onion-hair-oil": { size: "50 ml", price: 550 },
  } as Record<string, SampleItem>,

  /** Curated sample sets — made only of products listed above. Price = sum of samples. */
  sets: [
    {
      id: "face-discovery",
      name: "Face Discovery Set",
      category: "skin",
      description: "A cleanser, a treatment cream and a moisturizer with SPF — the three steps of a daily face routine, in travel sizes.",
      slugs: ["neem-rose-face-wash", "no-marks-cream", "moisturizing-cream-spf"],
    },
    {
      id: "clarifying-trio",
      name: "Clarifying Trio",
      category: "skin",
      description: "For skin that runs oily: the Charcoal Face Wash, the Acne n Pimple Cream and the Charcoal Face Mask.",
      slugs: ["noir-charcoal-face-wash", "clarite-botanical-cream", "noir-charcoal-mask"],
    },
    {
      id: "body-lotion-library",
      name: "Body Lotion Library",
      category: "body",
      description: "Four body lotions side by side — Aloe Fresh, Coco Glow, Herbal and the Brightening & Lightening Lotion.",
      slugs: ["aloe-veil-body-lotion", "coco-glow-body-lotion", "tulasi-balance-body-lotion", "lumiere-even-tone-lotion"],
    },
    {
      id: "hair-wash-day",
      name: "Wash-Day Set",
      category: "hair",
      description: "Two shampoos and a hair oil to try a wash-day routine before the full sizes.",
      slugs: ["herbal-shampoo", "scalp-clear-shampoo", "scalp-clear-hair-oil"],
    },
    {
      id: "travel-kit",
      name: "Travel Beauty Kit",
      category: "travel",
      description: "Face wash, sunscreen, body wash, body lotion and shampoo — one of each step for a short trip.",
      slugs: ["neem-rose-face-wash", "sunscreen-lotion-spf-50", "lavender-santal-body-wash", "aloe-veil-body-lotion", "herbal-shampoo"],
    },
  ],
};

export type SampleSet = (typeof sampling.sets)[number];
