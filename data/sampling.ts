/* ------------------------------------------------------------------
   CO2 — The Sampling Studio (travel sizes)

   ⚠️  DRAFT PRICING — CONFIRM BEFORE LAUNCH
   The original catalogue had no travel sizes or sample prices. The
   sizes and prices below are a proposed starting point so the sampling
   flow can be built and tested end to end. They are shown to customers
   exactly as written here, so change them to the real figures (or set
   `enabled: false` to hide sampling everywhere) before going live.

   Rules the site follows:
   - only products listed in `items` are offered as samples;
   - a sample is a smaller pack of the SAME formula (no different claims);
   - sample prices are never presented as free and never promised as
     credit towards a full size (`creditTowardsFullSize` stays false
     unless that becomes a real policy);
   - set prices are always the plain sum of the samples inside them.
------------------------------------------------------------------- */

export interface SampleItem {
  /** pack size of the travel version, e.g. "5 ml" */
  size: string;
  /** price in INR */
  price: number;
}

export const sampling = {
  enabled: true,
  /** "draft" until the business confirms sizes and prices (shown nowhere on the site — for you) */
  pricingStatus: "draft" as "draft" | "confirmed",
  /** a sample-only order ships at the normal fee unless it crosses the free-shipping threshold */
  shippingNote: "Samples ship with the rest of your order. Sample-only orders follow the standard shipping fee and free-shipping threshold.",
  creditTowardsFullSize: false,
  maxPerSet: 5,
  minPerSet: 3,
  /** per-customer limit of each sample in one order */
  maxQtyPerSample: 3,

  items: {
    // face
    "24k-gold-face-elixir": { size: "5 ml", price: 349 },
    "clarite-botanical-cream": { size: "10 g", price: 129 },
    "renew-firming-cream": { size: "10 g", price: 199 },
    "neem-rose-face-wash": { size: "20 ml", price: 99 },
    "noir-charcoal-face-wash": { size: "20 ml", price: 119 },
    "noir-charcoal-mask": { size: "15 g", price: 149 },
    // body
    "aloe-veil-body-lotion": { size: "30 ml", price: 119 },
    "coco-glow-body-lotion": { size: "30 ml", price: 119 },
    "tulasi-balance-body-lotion": { size: "30 ml", price: 119 },
    "lumiere-even-tone-lotion": { size: "30 ml", price: 129 },
    "calamine-calm-lotion": { size: "30 ml", price: 129 },
    "decollete-nourishing-cream": { size: "15 g", price: 149 },
    "aloe-pure-gel": { size: "20 g", price: 99 },
    "lavender-santal-body-wash": { size: "30 ml", price: 99 },
    // hair
    "aloe-nourish-shampoo": { size: "30 ml", price: 99 },
    "scalp-clear-shampoo": { size: "30 ml", price: 109 },
    "scalp-clear-treatment-gel": { size: "10 g", price: 149 },
    "scalp-clear-hair-oil": { size: "20 ml", price: 99 },
  } as Record<string, SampleItem>,

  /** Curated sample sets — made only of products listed above. Price = sum of samples. */
  sets: [
    {
      id: "face-discovery",
      name: "Face Discovery Set",
      category: "skin",
      description: "A cleanser, a serum and a moisturizer — the three steps of a daily face routine, in travel sizes.",
      slugs: ["neem-rose-face-wash", "24k-gold-face-elixir", "renew-firming-cream"],
    },
    {
      id: "clarifying-trio",
      name: "Clarifying Trio",
      category: "skin",
      description: "For skin that runs oily: a charcoal face wash, the Clarité Botanical Cream and a charcoal mask.",
      slugs: ["noir-charcoal-face-wash", "clarite-botanical-cream", "noir-charcoal-mask"],
    },
    {
      id: "body-lotion-library",
      name: "Body Lotion Library",
      category: "body",
      description: "Four body lotions side by side — Aloe Veil, Coco Glow, Tulasi Balance and the even-tone Lumière.",
      slugs: ["aloe-veil-body-lotion", "coco-glow-body-lotion", "tulasi-balance-body-lotion", "lumiere-even-tone-lotion"],
    },
    {
      id: "hair-wash-day",
      name: "Wash-Day Set",
      category: "hair",
      description: "Two shampoos and a hair oil to try a wash-day routine before the full sizes.",
      slugs: ["aloe-nourish-shampoo", "scalp-clear-shampoo", "scalp-clear-hair-oil"],
    },
    {
      id: "travel-kit",
      name: "Travel Beauty Kit",
      category: "travel",
      description: "Face wash, serum, cream, body lotion and shampoo — one of each step for a short trip.",
      slugs: ["neem-rose-face-wash", "24k-gold-face-elixir", "renew-firming-cream", "aloe-veil-body-lotion", "aloe-nourish-shampoo"],
    },
  ],
};

export type SampleSet = (typeof sampling.sets)[number];
