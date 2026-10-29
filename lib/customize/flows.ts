import { products } from "@/data/products";
import { customFormulas } from "@/data/custom-formulas";
import { productFormat } from "@/data/taxonomy";
import { buildProducts, containers } from "@/data/customize";
import { CUSTOM_PRICES_ON_REQUEST, money, PRICES_ON_REQUEST } from "@/lib/utils";

/* ------------------------------------------------------------------
   Make It Yours — category consultations (configuration)

   One flow per category. Questions, options and follow-ups live here,
   NOT in the interface, so they can be edited without touching the UI.
   Every flow is separate: the lip flow never asks about skin type, the
   body flow never asks about scalp, and so on.

   Option lists that depend on the catalogue (ingredients to avoid,
   price bands) are generated from data/products.ts so they only ever
   show what CO2 actually sells.

   Language rule: these are cosmetic preferences, not a diagnosis.
------------------------------------------------------------------- */

export type FlowId = "face" | "hair" | "body" | "lips";
export type Answers = Record<string, string | string[] | undefined>;

export interface QOption {
  id: string;
  label: string;
  hint?: string;
}

export interface FlowQuestion {
  id: string;
  /** short label used on the review screen and progress rail */
  short: string;
  title: string;
  help?: string;
  type: "single" | "multi" | "text" | "shade";
  options?: QOption[] | ((a: Answers) => QOption[]);
  optional?: boolean;
  /** an option that clears all others in a multi question */
  exclusive?: string;
  max?: number;
  placeholder?: string;
  /** free-text follow-up shown when one of these option ids is chosen */
  followUp?: { when: string[]; id: string; label: string; placeholder?: string };
  /** an always-available optional text box under the options */
  extraText?: { id: string; label: string; placeholder?: string };
  when?: (a: Answers) => boolean;
}

export interface Flow {
  id: FlowId;
  label: string;
  title: string;
  kicker: string;
  intro: string;
  image: string;
  /** what the consultation covers, for the selector card */
  covers: string;
  questions: FlowQuestion[];
}

/* ---------------- catalogue-derived options ---------------- */

const has = (a: Answers, id: string, v: string) => {
  const x = a[id];
  return Array.isArray(x) ? x.includes(v) : x === v;
};

export const avoidCatalogue: { id: string; label: string; match: RegExp }[] = [
  { id: "salicylic", label: "Salicylic acid", match: /salicylic/i },
  { id: "essential-oils", label: "Essential oils (tea tree, lavender, rosemary, mint, bergamot…)", match: /tea tree|lavender|rosemary|peppermint|mint oil|\bmint\b|bergamot|rose oil|lemon oil|sandalwood oil/i },
  { id: "nut", label: "Nut-derived oils & butters (almond, walnut, shea)", match: /almond|walnut|shea/i },
  { id: "coconut", label: "Coconut oil", match: /coconut/i },
  { id: "wheat-germ", label: "Wheat germ oil", match: /wheat germ/i },
  { id: "charcoal", label: "Charcoal", match: /charcoal/i },
  { id: "coffee", label: "Coffee", match: /coffee/i },
  { id: "menthol", label: "Menthol / mint", match: /menthol|peppermint|\bmint\b/i },
  { id: "honey", label: "Honey", match: /honey/i },
  { id: "fragrance", label: "Added fragrance", match: /fragrance/i },
  { id: "parabens", label: "Parabens", match: /paraben/i },
];

const flowFormats: Record<FlowId, string[]> = {
  face: ["face-wash", "serum", "treatment-cream", "moisturizer", "sunscreen", "face-mask", "scrub"],
  body: ["body-lotion", "body-gel", "body-wash", "bath-bar"],
  hair: ["shampoo", "hair-oil", "scalp-treatment", "beard"],
  lips: ["lip-gloss", "lipstick", "lip-colour"],
};

export function flowProducts(id: FlowId) {
  return products.filter((p) => flowFormats[id].includes(productFormat[p.slug] ?? ""));
}

function avoidOptions(id: FlowId): QOption[] {
  const ings = flowProducts(id).flatMap((p) => p.ingredients.map((i) => i.name)).join(" | ");
  const list = avoidCatalogue.filter((x) => x.match.test(ings)).map((x) => ({ id: x.id, label: x.label }));
  return [...list, { id: "none", label: "Nothing in particular" }];
}

function budgetOptions(id: FlowId): QOption[] {
  const prices = flowProducts(id).filter((p) => !p.custom && p.availability !== "price-pending").map((p) => p.price);
  const bands = [
    { id: "under-500", label: `Under ${money(500)} a product`, min: 0, max: 499 },
    { id: "500-999", label: `${money(500)} – ${money(999)}`, min: 500, max: 999 },
    { id: "1000-plus", label: `${money(1000)} and above`, min: 1000, max: Infinity },
  ].filter((b) => prices.some((x) => x >= b.min && x <= b.max));
  return [...bands.map(({ id, label }) => ({ id, label })), { id: "flexible", label: "No fixed budget — show me what fits" }];
}

export function budgetMax(answer?: string | string[]) {
  const a = Array.isArray(answer) ? answer[0] : answer;
  if (PRICES_ON_REQUEST) return Infinity; // no budget filtering while prices are on request
  return a === "under-500" ? 499 : a === "500-999" ? 999 : Infinity;
}

const customPrice = (slug: string) => customFormulas.find((p) => p.slug === slug)?.price ?? 0;
const packagingFor = (buildId: string): QOption[] => {
  const b = buildProducts.find((x) => x.id === buildId);
  return b ? b.containers.map((c) => ({ id: c, label: containers[c].label, hint: containers[c].description })) : [];
};

/* ---------------- shared question builders ---------------- */

const avoidQ = (id: FlowId): FlowQuestion => ({
  id: "avoid",
  short: "Ingredients to avoid",
  title: "Are there any ingredients you prefer to avoid?",
  help: "We check these against the ingredients we list for each CO2 product (the key ingredients printed on the pack) and leave out anything that matches. Always check the full list on the pack — we can't promise a product is allergy-safe.",
  type: "multi",
  options: avoidOptions(id),
  exclusive: "none",
  optional: true,
  extraText: { id: "avoidText", label: "Anything else?", placeholder: "e.g. lanolin, a specific essential oil" },
});

const budgetQ = (id: FlowId, help?: string): FlowQuestion => ({
  id: "budget",
  short: "Budget",
  title: "What is your preferred price range?",
  help: help ?? "Ranges come from current CO2 prices. Made-to-order and on-request formulas are priced separately and always shown before you commit.",
  type: "single",
  options: budgetOptions(id),
});

/* ---------------- flows ---------------- */

export const flows: Flow[] = [
  /* =============================== FACE & SKIN =============================== */
  {
    id: "face",
    label: "Face & Skin",
    title: "Your skin consultation",
    kicker: "9–10 questions · about 4 minutes",
    intro: "Tell us about your current routine, how your skin behaves and the textures you enjoy. You'll get a morning and evening routine before you buy anything.",
    image: "24k-gold-face-elixir-1",
    covers: "Routine · concerns · skin type · textures · ingredients",
    questions: [
      {
        id: "routineNow",
        short: "Current routine",
        title: "What does your current skincare routine look like?",
        type: "single",
        options: [
          { id: "none", label: "I don't have a routine yet" },
          { id: "cleanser", label: "Cleanser only" },
          { id: "cleanser-moist", label: "Cleanser and moisturizer" },
          { id: "cleanser-moist-spf", label: "Cleanser, moisturizer and sunscreen" },
          { id: "several", label: "I use several skincare products" },
          { id: "describe", label: "I'd like to describe my routine myself" },
        ],
        followUp: { when: ["several", "describe"], id: "routineText", label: "Your routine, in your words (optional product names welcome)", placeholder: "e.g. gel cleanser AM/PM, vitamin C serum, light moisturizer…" },
      },
      {
        id: "concerns",
        short: "Main concerns",
        title: "What would you like your routine to focus on?",
        help: "Choose all that apply. These are cosmetic goals — we don't diagnose skin conditions or promise to treat them.",
        type: "multi",
        max: 5,
        options: [
          { id: "dryness", label: "Dryness" },
          { id: "dehydration", label: "Dehydration (tight, thirsty feel)" },
          { id: "oil", label: "Excess oil / shine" },
          { id: "uneven", label: "Uneven-looking skin tone" },
          { id: "dullness", label: "Dullness" },
          { id: "pores", label: "Visible pores" },
          { id: "blemish", label: "Blemish-prone skin" },
          { id: "texture", label: "Skin texture" },
          { id: "fine-lines", label: "Fine lines / tired-looking skin" },
          { id: "sensitivity", label: "Sensitivity" },
          { id: "maintenance", label: "General maintenance" },
          { id: "other", label: "Other" },
        ],
        followUp: { when: ["other"], id: "concernsText", label: "Tell us more", placeholder: "What would you like to focus on?" },
      },
      {
        id: "skinType",
        short: "Skin type",
        title: "How would you describe your skin?",
        help: "Not sure is a perfectly good answer — the next question helps us work it out.",
        type: "single",
        options: [
          { id: "dry", label: "Dry" },
          { id: "oily", label: "Oily" },
          { id: "combination", label: "Combination" },
          { id: "balanced", label: "Balanced" },
          { id: "sensitive", label: "Sensitive" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "afterCleanse",
        short: "After cleansing",
        title: "How does your skin usually feel after cleansing?",
        type: "single",
        options: [
          { id: "tight", label: "Tight or dry" },
          { id: "comfortable", label: "Comfortable" },
          { id: "oily", label: "Oily shortly afterwards" },
          { id: "both", label: "Sometimes dry, sometimes oily" },
          { id: "varies", label: "It varies" },
        ],
      },
      {
        id: "texture",
        short: "Preferred textures",
        title: "What type of products do you prefer?",
        type: "multi",
        options: [
          { id: "lightweight", label: "Lightweight" },
          { id: "gel", label: "Gel-based" },
          { id: "cream", label: "Cream-based" },
          { id: "serum", label: "Serum-based" },
          { id: "rich", label: "Rich and nourishing" },
          { id: "fragrance-free", label: "Fragrance-free options", hint: "Available on made-to-order formulas" },
          { id: "unsure", label: "Not sure" },
        ],
        exclusive: "unsure",
      },
      {
        id: "currentSteps",
        short: "Steps you use",
        title: "Which of these does your routine include today?",
        help: "Skip anything you don't use. This tells us what to keep and what to add.",
        type: "multi",
        optional: true,
        when: (a) => a.routineNow !== "none",
        options: [
          { id: "cleanser", label: "Cleanser" },
          { id: "toner", label: "Toner" },
          { id: "serum", label: "Serum" },
          { id: "moisturizer", label: "Moisturizer" },
          { id: "sunscreen", label: "Sunscreen" },
          { id: "exfoliant", label: "Exfoliating products" },
          { id: "mask", label: "Masks" },
        ],
      },
      avoidQ("face"),
      {
        id: "length",
        short: "Routine length",
        title: "How long would you like your routine to be?",
        type: "single",
        options: [
          { id: "simple", label: "Simple", hint: "A few essential steps" },
          { id: "balanced", label: "Balanced", hint: "A moderate routine" },
          { id: "detailed", label: "Detailed", hint: "More steps and product options" },
        ],
      },
      budgetQ("face"),
      {
        id: "start",
        short: "How to begin",
        title: "How would you like to begin?",
        type: "single",
        options: [
          { id: "routine", label: "Discover a routine first" },
          { id: "samples", label: "Try samples first" },
          { id: "custom", label: "Explore customized products" },
          { id: "readymade", label: "Browse suitable ready-made products" },
        ],
      },
    ],
  },

  /* =============================== LIPS =============================== */
  {
    id: "lips",
    label: "Lips",
    title: "Your lip consultation",
    kicker: "10–11 questions · about 3 minutes",
    intro: "Lip care and lip colour only — what you use now, the finish and texture you like, and whether you want a ready shade or one made for you.",
    image: "gloss-berry-rubin-1",
    covers: "Lip routine · focus · product · finish · texture",
    questions: [
      {
        id: "lipRoutine",
        short: "Current lip routine",
        title: "What does your current lip routine look like?",
        type: "single",
        options: [
          { id: "none", label: "I don't use lip products" },
          { id: "balm", label: "I use lip balm" },
          { id: "balm-exfoliate", label: "Lip balm and lip exfoliation" },
          { id: "masks", label: "Lip masks or overnight care" },
          { id: "several", label: "I use several lip products" },
          { id: "describe", label: "I'd like to describe my routine" },
        ],
        followUp: { when: ["several", "describe"], id: "lipRoutineText", label: "Your lip routine (optional)", placeholder: "e.g. tinted balm by day, gloss for evenings" },
      },
      {
        id: "lipFocus",
        short: "Focus",
        title: "What would you like your lip product to focus on?",
        help: "Only what CO2 lip products can offer today.",
        type: "multi",
        max: 4,
        options: [
          { id: "moisture", label: "Everyday moisture" },
          { id: "comfort", label: "Comfort for dry-feeling lips" },
          { id: "smooth", label: "A smooth-feeling lip texture" },
          { id: "tint", label: "A tinted lip product" },
          { id: "colour", label: "Lip colour and finish" },
          { id: "simple", label: "A simple daily lip product" },
        ],
      },
      {
        id: "lipProduct",
        short: "Product",
        title: "Which product would you like?",
        type: "single",
        options: [
          { id: "gloss", label: "Lip gloss", hint: PRICES_ON_REQUEST ? "Five ready shades · price on request" : `Five ready shades · ${money(customPrice("gloss-berry-rubin"))}` },
          { id: "lip-colour", label: "Lip colour, made to order", hint: PRICES_ON_REQUEST || CUSTOM_PRICES_ON_REQUEST ? "Your colour family and finish · price on request" : `Your colour family and finish · ${money(customPrice("custom-lip"))}` },
          { id: "balm", label: "Lip balm, on request", hint: "Clear or sheer tint · priced after review" },
        ],
      },
      {
        id: "lipFinish",
        short: "Finish",
        title: "What finish do you prefer?",
        help: "Only finishes available for the product you chose are shown.",
        type: "single",
        options: (a) =>
          a.lipProduct === "gloss"
            ? [{ id: "glossy", label: "Glossy", hint: "All CO2 glosses are high-shine" }]
            : a.lipProduct === "balm"
              ? [
                  { id: "no-colour", label: "No colour" },
                  { id: "tinted", label: "Tinted" },
                  { id: "natural", label: "Natural" },
                ]
              : [
                  { id: "matte", label: "Matte" },
                  { id: "natural", label: "Natural" },
                  { id: "satin", label: "Satin / soft sheen" },
                  { id: "dewy", label: "Dewy" },
                ],
      },
      {
        id: "lipColour",
        short: "Colour family",
        title: "Which colour family are you drawn to?",
        type: "single",
        when: (a) => a.lipProduct !== "balm" && a.lipFinish !== "no-colour",
        options: (a) =>
          a.lipProduct === "gloss"
            ? [
                { id: "Berry Rubin", label: "Berry Rubin", hint: "Deep berry-red" },
                { id: "Burgundy Spirit", label: "Burgundy Spirit", hint: "Rich burgundy" },
                { id: "Chocolate Dream", label: "Chocolate Dream", hint: "Cocoa brown" },
                { id: "Red Kiss", label: "Red Kiss", hint: "Classic red" },
                { id: "Secret Rose", label: "Secret Rose", hint: "Soft rose pink" },
                { id: "unsure", label: "Help me choose — I'll try them on" },
              ]
            : ["Rose", "Coral", "Berry", "Nude", "Terracotta", "Red"].map((x) => ({ id: x, label: x })).concat([{ id: "unsure", label: "Not sure yet" }]),
      },
      {
        id: "lipTexture",
        short: "Texture",
        title: "What texture do you prefer?",
        type: "single",
        options: (a) =>
          a.lipProduct === "gloss"
            ? [
                { id: "glossy", label: "Glossy", hint: "Non-sticky, plumping shine" },
                { id: "unsure", label: "Not sure" },
              ]
            : [
                { id: "lightweight", label: "Lightweight" },
                { id: "creamy", label: "Smooth and creamy" },
                { id: "rich", label: "Rich and nourishing" },
                { id: "unsure", label: "Not sure" },
              ],
      },
      {
        id: "lipFragrance",
        short: "Fragrance",
        title: "Do you prefer a fragrance-free product?",
        type: "single",
        options: [
          { id: "yes", label: "Yes" },
          { id: "no-pref", label: "No preference" },
          { id: "review", label: "I'd like to review the options" },
        ],
      },
      avoidQ("lips"),
      {
        id: "lipPack",
        short: "Packaging",
        title: "Which packaging do you prefer?",
        help: "Only packaging made for the product you chose.",
        type: "single",
        options: (a) =>
          a.lipProduct === "gloss"
            ? [{ id: "wand", label: "Wand tube (as sold)" }]
            : [...packagingFor(a.lipProduct === "balm" ? "request-lip-balm" : "custom-lip"), { id: "later", label: "Decide later" }],
      },
      {
        id: "budget",
        short: "Budget",
        title: "What is your preferred budget?",
        type: "single",
        options: [
          { id: "under-700", label: `Up to ${money(700)}`, hint: "Ready-made gloss" },
          { id: "700-2000", label: `${money(700)} – ${money(2000)}`, hint: "Includes made-to-order lip colour" },
          { id: "flexible", label: "Flexible — show me the options" },
        ],
      },
      {
        id: "start",
        short: "How to proceed",
        title: "How would you like to proceed?",
        help: "Travel-size samples aren't offered for lip products — use the virtual try-on to see shades on your own face instead.",
        type: "single",
        options: [
          { id: "tryon", label: "Try shades on my face first" },
          { id: "routine", label: "Receive a suggested lip routine" },
          { id: "custom", label: "Customize a product" },
          { id: "readymade", label: "Explore ready-made lip products" },
        ],
      },
    ],
  },

  /* =============================== BODY =============================== */
  {
    id: "body",
    label: "Body",
    title: "Your body-care consultation",
    kicker: "10 questions · about 3 minutes",
    intro: "Everything from the neck down — how you care for your body now, the textures and scents you like, and when you apply them.",
    image: "coco-glow-body-lotion-1",
    covers: "Routine · focus · products · texture · fragrance",
    questions: [
      {
        id: "bodyRoutine",
        short: "Current routine",
        title: "What does your current body-care routine include?",
        type: "single",
        options: [
          { id: "none", label: "No regular routine" },
          { id: "wash", label: "Body wash only" },
          { id: "wash-moist", label: "Body wash and moisturizer" },
          { id: "wash-moist-more", label: "Body wash, moisturizer and other products" },
          { id: "detailed", label: "A detailed body-care routine" },
        ],
      },
      {
        id: "bodyFocus",
        short: "Focus",
        title: "What would you like your body-care routine to focus on?",
        type: "multi",
        max: 4,
        options: [
          { id: "cleansing", label: "Everyday cleansing" },
          { id: "moisture", label: "Moisture" },
          { id: "dry", label: "Dry-feeling skin" },
          { id: "smooth", label: "A smoother-feeling texture" },
          { id: "nourish", label: "Nourishing body care" },
          { id: "glow", label: "A luminous, even-looking finish" },
          { id: "comfort", label: "Comfort for skin that feels warm or irritated" },
          { id: "fragrance", label: "Fragrance preferences" },
          { id: "simple", label: "A simple daily routine" },
        ],
      },
      {
        id: "bodyProducts",
        short: "Products of interest",
        title: "Which body-care products interest you?",
        type: "multi",
        options: [
          { id: "wash", label: "Body wash" },
          { id: "lotion", label: "Body lotion" },
          { id: "cream", label: "Body cream" },
          { id: "oil", label: "Body oil" },
          { id: "gel", label: "Multi-use aloe gel" },
          { id: "bar", label: "Bath bar" },
        ],
      },
      {
        id: "bodyTexture",
        short: "Texture",
        title: "What texture do you prefer?",
        type: "single",
        options: [
          { id: "lotion", label: "Lightweight lotion" },
          { id: "gel", label: "Gel" },
          { id: "cream", label: "Rich cream" },
          { id: "oil", label: "Oil" },
          { id: "none", label: "No preference" },
        ],
      },
      {
        id: "bodyWhen",
        short: "When you apply",
        title: "When do you usually apply body-care products?",
        help: "We use this to suggest a practical order — not to make product claims.",
        type: "multi",
        options: [
          { id: "morning", label: "Morning" },
          { id: "after-bath", label: "After bathing" },
          { id: "evening", label: "Evening" },
          { id: "before-sleep", label: "Before sleeping" },
          { id: "as-needed", label: "Whenever needed" },
        ],
      },
      {
        id: "bodyScent",
        short: "Fragrance",
        title: "What fragrance experience do you prefer?",
        help: "Scent families are based on the botanicals listed for each product (mint and cucumber read fresh, rose and lavender floral, sandalwood warm). We can't confirm a ready-made product is fragrance-free from its key ingredients alone.",
        type: "single",
        options: [
          { id: "free", label: "Fragrance-free" },
          { id: "fresh", label: "Fresh" },
          { id: "floral", label: "Floral" },
          { id: "warm", label: "Warm" },
          { id: "subtle", label: "Subtle" },
          { id: "none", label: "No preference" },
        ],
      },
      avoidQ("body"),
      {
        id: "bodySize",
        short: "Size",
        title: "Which packaging size do you prefer?",
        type: "single",
        options: [
          { id: "travel", label: "Travel size", hint: "Available for selected lotions, oils and washes" },
          { id: "regular", label: "Regular size" },
          { id: "large", label: "Larger size", hint: "On-request formulas only, if available" },
        ],
      },
      budgetQ("body"),
      {
        id: "start",
        short: "How to start",
        title: "How would you like to start?",
        type: "single",
        options: [
          { id: "samples", label: "Try a sample" },
          { id: "routine", label: "Discover a routine" },
          { id: "custom", label: "Customize body-care products" },
          { id: "readymade", label: "Explore ready-made products" },
        ],
      },
    ],
  },

  /* =============================== HAIR =============================== */
  {
    id: "hair",
    label: "Hair",
    title: "Your hair & scalp consultation",
    kicker: "12 questions · about 4 minutes",
    intro: "Your scalp, your hair texture and your wash-day habits. We'll suggest a wash-day routine — we don't diagnose scalp conditions or promise to treat hair loss.",
    image: "scalp-clear-hair-oil-1",
    covers: "Routine · texture · scalp · focus · formats",
    questions: [
      {
        id: "hairRoutine",
        short: "Current routine",
        title: "What is your current hair-care routine?",
        type: "single",
        options: [
          { id: "none", label: "No regular routine" },
          { id: "shampoo", label: "Shampoo only" },
          { id: "shampoo-cond", label: "Shampoo and conditioner" },
          { id: "shampoo-cond-oil", label: "Shampoo, conditioner and a hair oil" },
          { id: "detailed", label: "A detailed routine with scalp care or styling" },
        ],
      },
      {
        id: "hairTexture",
        short: "Hair texture",
        title: "How would you describe your hair texture?",
        type: "single",
        options: [
          { id: "straight", label: "Straight" },
          { id: "wavy", label: "Wavy" },
          { id: "curly", label: "Curly" },
          { id: "coily", label: "Coily" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "scalp",
        short: "Scalp",
        title: "How does your scalp usually feel?",
        type: "single",
        options: [
          { id: "oily", label: "Gets oily quickly" },
          { id: "balanced", label: "Balanced" },
          { id: "dry", label: "Dry or tight" },
          { id: "flaky", label: "Flaky at times" },
          { id: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "hairFocus",
        short: "Focus",
        title: "What would you like your routine to focus on?",
        help: "Cosmetic hair care only — for persistent scalp problems or hair loss, please see a dermatologist.",
        type: "multi",
        max: 4,
        options: [
          { id: "flakes", label: "A flake-free-feeling scalp" },
          { id: "scalp", label: "Scalp care" },
          { id: "dry-lengths", label: "Softness for dry lengths" },
          { id: "hydration", label: "Hair hydration" },
          { id: "frizz", label: "Smoother, more manageable hair" },
          { id: "cooling", label: "A cooling scalp feel" },
          { id: "beard", label: "Beard care" },
          { id: "simple", label: "A simple routine" },
        ],
      },
      {
        id: "hairProducts",
        short: "Products used",
        title: "Which products do you currently use?",
        type: "multi",
        optional: true,
        options: [
          { id: "shampoo", label: "Shampoo" },
          { id: "conditioner", label: "Conditioner" },
          { id: "oil", label: "Hair oil" },
          { id: "scalp", label: "Scalp treatment" },
          { id: "styling", label: "Styling product" },
          { id: "beard", label: "Beard product" },
        ],
      },
      {
        id: "washFormat",
        short: "Wash format",
        title: "Which shampoo and conditioner format do you prefer?",
        type: "single",
        options: [
          { id: "separate", label: "Separate shampoo and conditioner" },
          { id: "none", label: "No preference" },
        ],
      },
      {
        id: "leaveIn",
        short: "Oils & leave-ins",
        title: "Do you like using an oil or leave-in?",
        type: "single",
        options: [
          { id: "prewash", label: "Yes — a pre-wash oil" },
          { id: "leave-in", label: "Yes — something light to leave in" },
          { id: "no", label: "No, I'd rather not" },
        ],
      },
      {
        id: "hairScent",
        short: "Fragrance",
        title: "What fragrance do you prefer in hair care?",
        type: "single",
        options: [
          { id: "free", label: "Fragrance-free" },
          { id: "fresh", label: "Fresh / cooling" },
          { id: "herbal", label: "Herbal" },
          { id: "none", label: "No preference" },
        ],
      },
      avoidQ("hair"),
      {
        id: "length",
        short: "Routine length",
        title: "Would you prefer a simple routine or a multi-step one?",
        type: "single",
        options: [
          { id: "simple", label: "Simple", hint: "Wash and go" },
          { id: "balanced", label: "Balanced", hint: "Wash, condition and one extra" },
          { id: "detailed", label: "Multi-step", hint: "Oils, scalp care and finishing" },
        ],
      },
      budgetQ("hair"),
      {
        id: "start",
        short: "How to start",
        title: "How would you like to start?",
        type: "single",
        options: [
          { id: "samples", label: "Try samples first" },
          { id: "routine", label: "Discover a routine" },
          { id: "custom", label: "Request a customized formula" },
          { id: "readymade", label: "Browse ready-made hair care" },
        ],
      },
    ],
  },
];

// Prices are on request (as per customization), so the consultations don't ask for a budget.
if (PRICES_ON_REQUEST) for (const f of flows) f.questions = f.questions.filter((q) => q.id !== "budget");

export function getFlow(id: string) {
  return flows.find((f) => f.id === id);
}

export function optionsOf(q: FlowQuestion, a: Answers): QOption[] {
  return typeof q.options === "function" ? q.options(a) : q.options ?? [];
}

export function visibleQuestions(flow: Flow, a: Answers) {
  return flow.questions.filter((q) => !q.when || q.when(a));
}

export function isAnswered(q: FlowQuestion, a: Answers) {
  if (q.optional) return true;
  const v = a[q.id];
  if (q.type === "shade") return typeof v === "string" && v.includes("|");
  if (q.type === "text") return typeof v === "string" && v.trim().length > 0;
  return Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.length > 0;
}

export function answerLabel(q: FlowQuestion, a: Answers): string {
  const v = a[q.id];
  if (v == null || (Array.isArray(v) && !v.length) || v === "") return "—";
  if (q.type === "shade" && typeof v === "string") return v.split("|").join(" · ");
  if (q.type === "text") return String(v);
  const opts = optionsOf(q, a);
  const lab = (id: string) => opts.find((o) => o.id === id)?.label ?? id;
  const main = Array.isArray(v) ? v.map(lab).join(", ") : lab(v);
  const extra = [q.followUp && has(a, q.id, "x") ? "" : "", q.followUp && a[q.followUp.id] ? `“${a[q.followUp.id]}”` : "", q.extraText && a[q.extraText.id] ? `+ ${a[q.extraText.id]}` : ""].filter(Boolean).join(" ");
  return extra ? `${main} ${extra}` : main;
}

/** Remove answers to questions that are no longer visible or options that no longer exist. */
export function pruneAnswers(flow: Flow, a: Answers): Answers {
  const out: Answers = { ...a };
  for (const q of flow.questions) {
    if (q.when && !q.when(out)) {
      delete out[q.id];
      continue;
    }
    if (q.type === "single" || q.type === "multi") {
      const ids = new Set(optionsOf(q, out).map((o) => o.id));
      const v = out[q.id];
      if (Array.isArray(v)) out[q.id] = v.filter((x) => ids.has(x));
      else if (typeof v === "string" && !ids.has(v)) delete out[q.id];
    }
    if (q.followUp && !q.followUp.when.some((w) => has(out, q.id, w))) delete out[q.followUp.id];
  }
  return out;
}
