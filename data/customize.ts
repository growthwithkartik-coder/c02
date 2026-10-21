/* ------------------------------------------------------------------
   CO2 — Make It Yours: product + packaging configuration

   Two kinds of customizable product:

   1. LISTED made-to-order formulas (custom-serum, custom-moisturizer,
      custom-lip) defined in data/custom-formulas.ts with a fixed catalogue price. Their
      formula options come from each product's `custom.options` and the
      choices in data/custom-options.ts. They go through the normal bag
      and checkout; the formula is confirmed with the customer by email
      before it is prepared (as on the existing product pages).

   2. ON-REQUEST formulas (body lotion, shampoo …) that are NOT in the
      catalogue. They have no price, so they are submitted as a
      customization REQUEST. The team confirms feasibility, price and
      timeline before anything is made. Remove an entry below to stop
      offering it.

   PACKAGING: only containers listed for a product are offered. The
   `surcharge` on every option is 0 — i.e. packaging is included in the
   listed price. Change a surcharge to charge for an upgrade; the
   builder and the server-side cart both read it from here.
------------------------------------------------------------------- */

export type ContainerId = "dropper" | "airless" | "pump" | "jar" | "tube" | "compact" | "bullet" | "bottle";

export interface Container {
  id: ContainerId;
  label: string;
  description: string;
  surcharge: number;
}

export const containers: Record<ContainerId, Container> = {
  dropper: { id: "dropper", label: "Glass dropper bottle", description: "Pipette for measured drops — classic for serums and oils.", surcharge: 0 },
  airless: { id: "airless", label: "Airless pump", description: "Dispenses from the bottom up, keeps air out and empties cleanly.", surcharge: 0 },
  pump: { id: "pump", label: "Pump bottle", description: "A measured pump for fluids and lotions.", surcharge: 0 },
  jar: { id: "jar", label: "Glass jar", description: "Wide-mouth jar for creams and balms.", surcharge: 0 },
  tube: { id: "tube", label: "Soft tube", description: "Squeeze tube — light, travel-friendly, hygienic.", surcharge: 0 },
  compact: { id: "compact", label: "Compact", description: "A round compact with a mirror lid for cream colour.", surcharge: 0 },
  bullet: { id: "bullet", label: "Twist-up case", description: "A twist-up case for lip colour and balms.", surcharge: 0 },
  bottle: { id: "bottle", label: "Flip-top bottle", description: "A flip-top bottle for washes, shampoos and oils.", surcharge: 0 },
};

export interface PackColour {
  id: string;
  label: string;
  /** body colour in the 3D preview */
  hex: string;
  /** 0 = opaque, 1 = clear */
  clarity: number;
  surcharge: number;
}

export const packColours: Record<string, PackColour> = {
  frosted: { id: "frosted", label: "Frosted clear", hex: "#EEF1EE", clarity: 0.55, surcharge: 0 },
  amber: { id: "amber", label: "Amber glass", hex: "#9A5A22", clarity: 0.45, surcharge: 0 },
  opal: { id: "opal", label: "Opal white", hex: "#F3EFE8", clarity: 0, surcharge: 0 },
  carbon: { id: "carbon", label: "Carbon black", hex: "#1B1916", clarity: 0, surcharge: 0 },
  bone: { id: "bone", label: "Bone", hex: "#E6DCCB", clarity: 0, surcharge: 0 },
  rose: { id: "rose", label: "Rose metal", hex: "#B98A79", clarity: 0, surcharge: 0 },
  gold: { id: "gold", label: "Brushed gold", hex: "#B8924F", clarity: 0, surcharge: 0 },
};

export const capFinishes: Record<string, PackColour> = {
  gold: { id: "gold", label: "Brushed gold", hex: "#B8924F", clarity: 0, surcharge: 0 },
  black: { id: "black", label: "Matte black", hex: "#1A1814", clarity: 0, surcharge: 0 },
  bone: { id: "bone", label: "Bone", hex: "#E9E1D3", clarity: 0, surcharge: 0 },
  silver: { id: "silver", label: "Satin silver", hex: "#B9B8B3", clarity: 0, surcharge: 0 },
};

/** Optional name printed on the formula label/card. Set false to hide the step. */
export const labelPersonalisation = { enabled: true, maxLength: 18, note: "Printed on your formula label and formula card. Letters, numbers and spaces only." };

export type BuildCategory = "face" | "lips" | "body" | "hair";

export interface RequestOption {
  name: string;
  choices?: string[];
  optional?: boolean;
  help?: string;
}

export interface BuildProduct {
  id: string;
  label: string;
  category: BuildCategory;
  mode: "listed" | "request";
  /** catalogue slug for listed formulas */
  slug?: string;
  /** what is made, one line */
  blurb: string;
  containers: ContainerId[];
  colours: string[];
  caps: string[];
  /** request-only: formula questions (listed formulas use their catalogue options) */
  options?: RequestOption[];
  /** request-only: size choices — final volume confirmed in the quote */
  sizes?: string[];
  /** a product photograph or cut-out that represents the category */
  image?: string;
}

export const buildProducts: BuildProduct[] = [
  // listed — skincare
  { id: "custom-serum", slug: "custom-serum", label: "Custom Serum", category: "face", mode: "listed", blurb: "A serum set to your skin, texture and ingredient families.", containers: ["dropper", "airless"], colours: ["frosted", "amber", "opal"], caps: ["gold", "black", "bone"] },
  { id: "custom-moisturizer", slug: "custom-moisturizer", label: "Custom Moisturizer", category: "face", mode: "listed", blurb: "From weightless gel to rich balm.", containers: ["jar", "airless", "tube"], colours: ["frosted", "opal", "carbon"], caps: ["gold", "black", "bone"] },
  // listed — lips
  { id: "custom-lip", slug: "custom-lip", label: "Custom Lip Colour", category: "lips", mode: "listed", blurb: "Your colour family, intensity, finish and scent.", containers: ["bullet"], colours: ["rose", "carbon", "gold"], caps: ["gold", "black"] },

  // on request — no catalogue price; quoted before anything is made
  {
    id: "request-face-cleanser", label: "Custom Face Cleanser", category: "face", mode: "request", blurb: "A daily cleanser in the texture and scent you prefer.", image: "neem-rose-face-wash-1",
    containers: ["tube", "pump"], colours: ["opal", "frosted", "carbon"], caps: ["gold", "black", "bone"],
    sizes: ["Travel", "Regular"],
    options: [
      { name: "Texture", choices: ["Gel", "Cream", "Foaming"] },
      { name: "Skin feel after washing", choices: ["Fresh and clean", "Soft and cushioned", "Not sure"] },
      { name: "Scent", choices: ["Fragrance-free", "Light botanical", "No preference"] },
      { name: "Ingredients to avoid", optional: true },
    ],
  },
  {
    id: "request-body-lotion", label: "Custom Body Lotion", category: "body", mode: "request", blurb: "Daily body moisture in your texture and fragrance.", image: "aloe-veil-body-lotion-1",
    containers: ["pump", "tube"], colours: ["opal", "frosted", "bone", "carbon"], caps: ["gold", "black", "bone"],
    sizes: ["Travel", "Regular", "Large (if available)"],
    options: [
      { name: "Texture", choices: ["Lightweight lotion", "Gel", "Rich cream", "Butter"] },
      { name: "Fragrance", choices: ["Fragrance-free", "Fresh", "Floral", "Warm", "Subtle"] },
      { name: "When you apply it", choices: ["Morning", "After bathing", "Evening", "Before sleeping", "Whenever needed"] },
      { name: "Ingredients to avoid", optional: true },
    ],
  },
  {
    id: "request-body-oil", label: "Custom Body Oil", category: "body", mode: "request", blurb: "A body oil blend in the weight and scent you like.",
    containers: ["dropper", "bottle"], colours: ["amber", "frosted", "carbon"], caps: ["gold", "black"],
    sizes: ["Travel", "Regular"],
    options: [
      { name: "Weight", choices: ["Dry-touch", "Medium", "Rich"] },
      { name: "Fragrance", choices: ["Fragrance-free", "Fresh", "Floral", "Warm", "Subtle"] },
      { name: "Ingredients to avoid", optional: true },
    ],
  },
  {
    id: "request-body-wash", label: "Custom Body Wash", category: "body", mode: "request", blurb: "Everyday cleansing in your preferred lather and scent.", image: "lavender-santal-body-wash-1",
    containers: ["bottle", "pump"], colours: ["opal", "frosted", "carbon"], caps: ["gold", "black", "bone"],
    sizes: ["Travel", "Regular", "Large (if available)"],
    options: [
      { name: "Texture", choices: ["Gel", "Creamy", "Foaming"] },
      { name: "Fragrance", choices: ["Fragrance-free", "Fresh", "Floral", "Warm", "Subtle"] },
      { name: "Ingredients to avoid", optional: true },
    ],
  },
  {
    id: "request-shampoo", label: "Custom Shampoo", category: "hair", mode: "request", blurb: "A shampoo for your scalp and hair texture.", image: "aloe-nourish-shampoo-1",
    containers: ["bottle", "pump"], colours: ["opal", "frosted", "carbon"], caps: ["gold", "black", "bone"],
    sizes: ["Travel", "Regular", "Large (if available)"],
    options: [
      { name: "Scalp feel", choices: ["Oily quickly", "Balanced", "Dry or tight", "Flaky at times", "Not sure"] },
      { name: "Hair texture", choices: ["Straight", "Wavy", "Curly", "Coily"] },
      { name: "Fragrance", choices: ["Fragrance-free", "Fresh", "Herbal", "Subtle"] },
      { name: "Ingredients to avoid", optional: true },
    ],
  },
  {
    id: "request-conditioner", label: "Custom Conditioner", category: "hair", mode: "request", blurb: "Conditioning set to your lengths and preferred weight.",
    containers: ["bottle", "tube", "pump"], colours: ["opal", "frosted", "carbon"], caps: ["gold", "black", "bone"],
    sizes: ["Travel", "Regular"],
    options: [
      { name: "Weight", choices: ["Light", "Medium", "Rich"] },
      { name: "Hair texture", choices: ["Straight", "Wavy", "Curly", "Coily"] },
      { name: "Fragrance", choices: ["Fragrance-free", "Fresh", "Herbal", "Subtle"] },
      { name: "Ingredients to avoid", optional: true },
    ],
  },
  {
    id: "request-hair-oil", label: "Custom Hair Oil", category: "hair", mode: "request", blurb: "A pre-wash or leave-in oil in the weight you prefer.", image: "onion-hair-oil-1",
    containers: ["bottle", "dropper"], colours: ["amber", "frosted", "carbon"], caps: ["gold", "black"],
    sizes: ["Travel", "Regular"],
    options: [
      { name: "Use", choices: ["Pre-wash oil", "Leave-in (light)", "Both"] },
      { name: "Weight", choices: ["Light", "Medium", "Rich"] },
      { name: "Cooling feel (menthol)", choices: ["Yes", "No"] },
      { name: "Ingredients to avoid", optional: true },
    ],
  },
  {
    id: "request-lip-balm", label: "Custom Lip Balm", category: "lips", mode: "request", blurb: "A daily lip balm — clear or lightly tinted.", image: "gloss-chocolate-dream-1",
    containers: ["bullet", "jar"], colours: ["rose", "carbon", "opal"], caps: ["gold", "black"],
    sizes: ["Regular"],
    options: [
      { name: "Tint", choices: ["No colour", "Sheer tint"] },
      { name: "Texture", choices: ["Lightweight", "Smooth and creamy", "Rich and nourishing"] },
      { name: "Fragrance", choices: ["Fragrance-free", "Subtle", "No preference"] },
      { name: "Ingredients to avoid", optional: true },
    ],
  },
];

export function getBuildProduct(id: string) {
  return buildProducts.find((b) => b.id === id);
}

/** Ready-made product format → the customizable product it can start. */
export const formatToBuild: Record<string, string> = {
  serum: "custom-serum",
  "treatment-cream": "custom-serum",
  moisturizer: "custom-moisturizer",
  "lip-gloss": "custom-lip",
  lipstick: "custom-lip",
  "lip-colour": "custom-lip",
  "face-wash": "request-face-cleanser",
  "body-lotion": "request-body-lotion",
  "body-gel": "request-body-lotion",
  "body-wash": "request-body-wash",
  shampoo: "request-shampoo",
  conditioner: "request-conditioner",
  "hair-oil": "request-hair-oil",
};

/** Indicative swatches for the Shade and Colour family choices (final colour is matched to the customer). */
export const shadeSwatches: Record<string, string> = {
  Fair: "#F1D7C2",
  Light: "#E7C3A5",
  "Light-medium": "#D9AC88",
  Medium: "#C29070",
  Tan: "#A87556",
  Deep: "#7E5239",
  Rich: "#5A3725",
};
export const undertoneSwatches: Record<string, string> = { Cool: "#D9A9A4", Neutral: "#D2AA8E", Warm: "#D9A877", Olive: "#BFA57A" };
export const colourFamilySwatches: Record<string, string> = {
  Rose: "#B0606B",
  Coral: "#D06A5A",
  Berry: "#8A2D4C",
  Nude: "#B47E6E",
  Terracotta: "#A4533C",
  Red: "#B0232E",
};
