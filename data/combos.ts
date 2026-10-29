/* ------------------------------------------------------------------
   CO2 — combos & routines

   Every combo is made of real products from data/products.ts, in the
   order they are used. A combo's price is ALWAYS the sum of the
   individual product prices — no bundle discount exists in the
   catalogue, so no saving is shown. (To run a combo offer, create a
   discount code in data/site.ts and mention it in the description.)

   `routine` lists the step label for each product, in order.
   `customizable` lists slugs inside the combo that can be swapped for
   a made-to-order version in Make It Yours.
------------------------------------------------------------------- */

export type ComboGroup = "face" | "lips" | "body" | "hair" | "essentials";

export interface Combo {
  slug: string;
  name: string;
  group: ComboGroup;
  kicker: string;
  purpose: string;
  description: string;
  items: { slug: string; step: string; when: string }[];
  /** product image used as the hero of the combo tile */
  hero: string;
  customizable?: { slug: string; customSlug: string; note: string }[];
  tone: "light" | "dark" | "stone";
}

export const comboGroups: { id: ComboGroup; label: string; blurb: string }[] = [
  { id: "face", label: "Face Care Combos", blurb: "Cleanse, treat and moisturize — complete face routines." },
  { id: "lips", label: "Lip Combos", blurb: "Gloss pairings for day-to-night colour." },
  { id: "body", label: "Body Care Combos", blurb: "Wash, nourish and unwind." },
  { id: "hair", label: "Hair Care Combos", blurb: "Wash-day and scalp systems, in order." },
  { id: "essentials", label: "Daily Essentials", blurb: "The short, everyday routines." },
];

export const combos: Combo[] = [
  {
    slug: "daily-skin-essentials",
    name: "Daily Skin Essentials",
    group: "essentials",
    kicker: "3 steps · morning & evening",
    purpose: "A simple everyday face routine for most skin types.",
    description: "A gentle aloe-and-neem cleanser, the 24K Gold Serum for hydration and the Anti-Aging Cream to finish. Three steps, twice a day.",
    items: [
      { slug: "neem-rose-face-wash", step: "Cleanse", when: "AM & PM" },
      { slug: "24k-gold-face-elixir", step: "Hydrate", when: "AM & PM" },
      { slug: "renew-firming-cream", step: "Moisturize", when: "AM & PM" },
    ],
    hero: "24k-gold-face-elixir-1",
    customizable: [
      { slug: "24k-gold-face-elixir", customSlug: "custom-serum", note: "Swap the serum for one made to your skin and ingredient preferences." },
      { slug: "renew-firming-cream", customSlug: "custom-moisturizer", note: "Swap the cream for a moisturizer set to your preferred texture." },
    ],
    tone: "stone",
  },
  {
    slug: "clarifying-routine",
    name: "Clarifying Routine",
    group: "face",
    kicker: "3 steps · for skin that runs oily",
    purpose: "Charcoal, neem, aloe and turmeric for skin that gets congested or shiny.",
    description: "An activated charcoal face wash, the Acne n Pimple Cream with aloe vera, neem, tulasi and turmeric, and a weekly bamboo charcoal mask.",
    items: [
      { slug: "noir-charcoal-face-wash", step: "Cleanse", when: "AM & PM" },
      { slug: "clarite-botanical-cream", step: "Treat", when: "AM and/or PM" },
      { slug: "noir-charcoal-mask", step: "Weekly mask", when: "1–2× a week" },
    ],
    hero: "clarite-botanical-cream-1",
    tone: "dark",
  },
  {
    slug: "gloss-duo",
    name: "The Gloss Duo",
    group: "lips",
    kicker: "2 shades · day to night",
    purpose: "Two high-shine shades — a deep berry-red and a cocoa brown.",
    description: "Berry Rubin for colour with a plumping, non-sticky shine, Chocolate Dream for a softer, deeper brown. Both with vitamin E, jojoba oil and shea butter.",
    items: [
      { slug: "gloss-berry-rubin", step: "Day", when: "Daytime" },
      { slug: "gloss-chocolate-dream", step: "Evening", when: "Evenings" },
    ],
    hero: "gloss-berry-rubin-1",
    customizable: [{ slug: "gloss-berry-rubin", customSlug: "custom-lip", note: "Want a different colour family or finish? Lip colour can be made to order." }],
    tone: "dark",
  },
  {
    slug: "gloss-trio",
    name: "The Gloss Trio",
    group: "lips",
    kicker: "3 shades",
    purpose: "Three deep CO2 gloss shades together — berry, burgundy and cocoa.",
    description: "Berry Rubin, Burgundy Spirit and Chocolate Dream. Try each one on your own face first with the virtual try-on.",
    items: [
      { slug: "gloss-berry-rubin", step: "Berry", when: "Any time" },
      { slug: "gloss-burgundy-spirit", step: "Burgundy", when: "Any time" },
      { slug: "gloss-chocolate-dream", step: "Cocoa", when: "Any time" },
    ],
    hero: "gloss-burgundy-spirit-1",
    tone: "dark",
  },
  {
    slug: "body-care-ritual",
    name: "Body Care Ritual",
    group: "body",
    kicker: "3 steps · after the bath",
    purpose: "Wash, moisturize and soothe — a complete body routine.",
    description: "Lavender, sandalwood and mint body wash, the Aloe Fresh body lotion on damp skin, and Aloe Vera Gel wherever skin wants extra comfort.",
    items: [
      { slug: "lavender-santal-body-wash", step: "Wash", when: "Daily" },
      { slug: "aloe-veil-body-lotion", step: "Moisturize", when: "After bathing" },
      { slug: "aloe-pure-gel", step: "Soothe", when: "As needed" },
    ],
    hero: "aloe-veil-body-lotion-1",
    tone: "stone",
  },
  {
    slug: "scalp-clear-system",
    name: "Anti-Dandruff Routine",
    group: "hair",
    kicker: "3 steps · for a flaky scalp",
    purpose: "Anti-dandruff hair oil, shampoo and treatment gel with neem, tea tree and piroctone olamine.",
    description: "Pre-wash oil, the anti-dandruff shampoo and the treatment gel for the scalp — in the order they are used.",
    items: [
      { slug: "scalp-clear-hair-oil", step: "Pre-wash oil", when: "1 hour before washing" },
      { slug: "scalp-clear-shampoo", step: "Shampoo", when: "Wash day" },
      { slug: "scalp-clear-treatment-gel", step: "Treat", when: "As directed" },
    ],
    hero: "scalp-clear-shampoo-1",
    tone: "stone",
  },];

export function getCombo(slug: string) {
  return combos.find((c) => c.slug === slug);
}
