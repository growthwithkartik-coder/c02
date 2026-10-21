/* ------------------------------------------------------------------
   CO2 — shopping taxonomy (departments, concerns, formats)

   The catalogue (data/products.ts) stays the single source of truth for
   product facts. This file only ORGANISES those products for shopping:
   which department a product lives in, which cosmetic concerns it is
   shopped under, and its product format.

   Every concern assignment is grounded in what is printed on the pack
   or in the product's benefits/ingredients in data/products.ts. These
   are cosmetic shopping groups, not medical claims. Concerns the
   catalogue does not support (e.g. hair fall, hair growth)
   are deliberately absent — empty categories are never shown.
------------------------------------------------------------------- */

export type DepartmentId = "skin" | "hair" | "body" | "lips";

export interface Concern {
  id: string;
  label: string;
  /** one line shown on concern tiles and the concern banner */
  blurb: string;
  /** a product photograph key used for the concern tile */
  image: string;
}

export interface Department {
  id: DepartmentId;
  label: string;
  title: string;
  description: string;
  /** product photograph used on category tiles and the page banner */
  image: string;
  /** product slugs that belong to this department (resolved in lib/taxonomy) */
  includes: (p: { slug: string; category: string; type: string }) => boolean;
  /** sub-sections shown as chips under the heading */
  sections: { id: string; label: string; formats?: string[]; area?: string }[];
  /** filters shown in the sidebar, in order */
  filters: FilterId[];
}

export type FilterId =
  | "area"
  | "concern"
  | "format"
  | "skinType"
  | "ingredient"
  | "shade"
  | "finish"
  | "price"
  | "availability"
  | "feature"
  | "bestseller";

/* ---------------- concerns ---------------- */

export const skinConcerns: Concern[] = [
  { id: "acne-blemishes", label: "Acne & Blemishes", blurb: "Clarifying creams and washes with salicylic acid, neem and tea tree.", image: "clarite-botanical-cream-1" },
  { id: "oily-skin", label: "Oily Skin", blurb: "Charcoal, multani mitti and neem to keep shine in check.", image: "noir-charcoal-face-wash-1" },
  { id: "dryness-hydration", label: "Dryness & Hydration", blurb: "Hyaluronic acid, aloe and nourishing oils for skin that feels tight.", image: "night-cream-1" },
  { id: "dullness-glow", label: "Dullness & Glow", blurb: "Gold, turmeric, saffron and fruit extracts for a luminous look.", image: "24k-gold-face-elixir-1" },
  { id: "uneven-tone", label: "Uneven Skin Tone", blurb: "Niacinamide, licorice and manjistha for a more even-looking tone.", image: "lumiere-even-tone-lotion-1" },
  { id: "texture", label: "Skin Texture", blurb: "Polishing scrubs and clay masks for smoother-feeling skin.", image: "herbal-scrub-1" },
  { id: "anti-aging", label: "Anti-Ageing & Firming", blurb: "A rich smoothing, firming cream for skin that looks tired.", image: "renew-firming-cream-1" },
  { id: "sensitive", label: "Sensitive Skin", blurb: "Calamine, aloe and gentle washes for skin that needs comfort.", image: "calamine-calm-lotion-1" },
];

export const hairConcerns: Concern[] = [
  { id: "dandruff", label: "Dandruff & Flakes", blurb: "Anti-dandruff shampoo, gel and hair oil with neem, tea tree and piroctone olamine.", image: "scalp-clear-shampoo-1" },
  { id: "scalp-care", label: "Scalp Care", blurb: "Shampoos, a treatment gel and oils made for the scalp.", image: "scalp-clear-treatment-gel-1" },
  { id: "dry-damaged", label: "Dry & Damaged Hair", blurb: "Amla, almond, onion and coconut oils for hair that needs nourishing.", image: "onion-hair-oil-1" },
  { id: "hair-hydration", label: "Hair Hydration", blurb: "Aloe, hibiscus and amla shampoos to keep lengths soft.", image: "aloe-nourish-shampoo-1" },
];

/** slug → concern ids. Grounded in pack text / benefits / ingredients. */
export const productConcerns: Record<string, string[]> = {
  "24k-gold-face-elixir": ["dryness-hydration",  "dullness-glow",  "uneven-tone",  "texture"],
  "clarite-botanical-cream": ["acne-blemishes",  "oily-skin",  "sensitive"],
  "renew-firming-cream": ["anti-aging",  "dryness-hydration",  "texture"],
  "neem-rose-face-wash": ["acne-blemishes",  "oily-skin",  "sensitive"],
  "noir-charcoal-face-wash": ["acne-blemishes",  "oily-skin",  "texture"],
  "noir-charcoal-mask": ["oily-skin",  "texture"],
  "aloe-veil-body-lotion": ["dryness-hydration"],
  "coco-glow-body-lotion": ["dullness-glow",  "dryness-hydration"],
  "tulasi-balance-body-lotion": ["uneven-tone",  "dryness-hydration"],
  "lumiere-even-tone-lotion": ["uneven-tone",  "dullness-glow",  "dryness-hydration"],
  "calamine-calm-lotion": ["sensitive"],
  "decollete-nourishing-cream": ["dryness-hydration"],
  "aloe-pure-gel": ["sensitive",  "dryness-hydration"],
  "goat-milk-herbal-bar": ["dryness-hydration",  "sensitive"],
  "lemon-zest-herbal-bar": ["dullness-glow"],
  "sandal-glow-herbal-bar": ["dullness-glow"],
  "neem-purify-herbal-bar": ["oily-skin"],
  "custom-serum": ["dryness-hydration",  "dullness-glow",  "uneven-tone",  "oily-skin"],
  "custom-moisturizer": ["dryness-hydration",  "sensitive"],
  "aloe-nourish-shampoo": ["hair-hydration",  "dry-damaged"],
  "scalp-clear-shampoo": ["dandruff",  "scalp-care"],
  "scalp-clear-treatment-gel": ["dandruff",  "scalp-care"],
  "scalp-clear-hair-oil": ["dandruff",  "scalp-care",  "dry-damaged"],
  "milk-cleanser": ["oily-skin",  "dullness-glow"],
  "red-grapes-face-wash": ["dullness-glow"],
  "no-marks-cream": ["acne-blemishes",  "uneven-tone"],
  "moisturizing-cream-spf": ["dryness-hydration"],
  "night-cream": ["dryness-hydration"],
  "multani-mitti-face-mask": ["oily-skin",  "texture"],
  "herbal-scrub": ["texture",  "dullness-glow"],
  "stretch-marks-gel": ["dryness-hydration"],
  "white-petroleum-jelly": ["dryness-hydration"],
  "kumkumadi-soap": ["dullness-glow"],
  "neem-soap": ["oily-skin"],
  "papaya-soap": ["dullness-glow"],
  "sandal-soap": ["dullness-glow"],
  "sunni-pindi-soap": ["texture",  "dullness-glow"],
  "turmeric-soap": ["dullness-glow"],
  "onion-shampoo": ["scalp-care"],
  "herbal-shampoo": ["hair-hydration"],
  "shikakai-shampoo": ["scalp-care"],
  "onion-hair-oil": ["scalp-care",  "dry-damaged"],
};

/* ---------------- formats (product type facet) ---------------- */

export const formats: { id: string; label: string }[] = [
  { id: "face-wash", label: "Face Wash & Cleansers" },
  { id: "serum", label: "Serums" },
  { id: "treatment-cream", label: "Treatment Creams" },
  { id: "moisturizer", label: "Moisturizers" },
  { id: "sunscreen", label: "Sun Protection" },
  { id: "face-mask", label: "Face Masks" },
  { id: "scrub", label: "Scrubs" },
  { id: "body-lotion", label: "Body Lotions & Creams" },
  { id: "body-gel", label: "Gels" },
  { id: "body-wash", label: "Body Wash" },
  { id: "bath-bar", label: "Bath Bars" },
  { id: "shampoo", label: "Shampoo" },
  { id: "hair-oil", label: "Hair Oils" },
  { id: "scalp-treatment", label: "Scalp Treatments" },
  { id: "beard", label: "Beard Care" },
  { id: "lipstick", label: "Lipstick" },
  { id: "lip-gloss", label: "Lip Gloss" },
  { id: "lip-colour", label: "Lip Colour (made to order)" },
];

export const productFormat: Record<string, string> = {
  "24k-gold-face-elixir": "serum",
  "clarite-botanical-cream": "treatment-cream",
  "renew-firming-cream": "moisturizer",
  "neem-rose-face-wash": "face-wash",
  "noir-charcoal-face-wash": "face-wash",
  "noir-charcoal-mask": "face-mask",
  "aloe-veil-body-lotion": "body-lotion",
  "coco-glow-body-lotion": "body-lotion",
  "tulasi-balance-body-lotion": "body-lotion",
  "lumiere-even-tone-lotion": "body-lotion",
  "calamine-calm-lotion": "body-lotion",
  "decollete-nourishing-cream": "body-lotion",
  "aloe-pure-gel": "body-gel",
  "lavender-santal-body-wash": "body-wash",
  "aloe-vera-herbal-bar": "bath-bar",
  "lemon-zest-herbal-bar": "bath-bar",
  "mint-cool-herbal-bar": "bath-bar",
  "neem-purify-herbal-bar": "bath-bar",
  "sandal-glow-herbal-bar": "bath-bar",
  "goat-milk-herbal-bar": "bath-bar",
  "beetroot-soap": "bath-bar",
  "aloe-nourish-shampoo": "shampoo",
  "scalp-clear-shampoo": "shampoo",
  "scalp-clear-treatment-gel": "scalp-treatment",
  "scalp-clear-hair-oil": "hair-oil",
  "groom-beard-oil": "beard",
  "gloss-berry-rubin": "lip-gloss",
  "gloss-burgundy-spirit": "lip-gloss",
  "gloss-chocolate-dream": "lip-gloss",
  lipstick: "lipstick",
  "custom-serum": "serum",
  "custom-moisturizer": "moisturizer",
  "custom-lip": "lip-colour",
  "milk-cleanser": "face-wash",
  "red-grapes-face-wash": "face-wash",
  "no-marks-cream": "treatment-cream",
  "moisturizing-cream-spf": "moisturizer",
  "night-cream": "moisturizer",
  "sunscreen-lotion-spf-50": "sunscreen",
  "multani-mitti-face-mask": "face-mask",
  "herbal-scrub": "scrub",
  "stretch-marks-gel": "body-gel",
  "white-petroleum-jelly": "body-lotion",
  "shower-gel": "body-wash",
  "kumkumadi-soap": "bath-bar",
  "neem-soap": "bath-bar",
  "papaya-soap": "bath-bar",
  "red-wine-soap": "bath-bar",
  "sandal-soap": "bath-bar",
  "sunni-pindi-soap": "bath-bar",
  "turmeric-soap": "bath-bar",
  "onion-shampoo": "shampoo",
  "herbal-shampoo": "shampoo",
  "shikakai-shampoo": "shampoo",
  "onion-hair-oil": "hair-oil",
  "coffee-soap": "bath-bar",
  "gloss-red-kiss": "lip-gloss",
  "gloss-secret-rose": "lip-gloss",
};

/* ---------------- key ingredients facet ---------------- */
/* keyword (matched against the printed ingredient names) → label */
export const ingredientFacets: { id: string; label: string; match: RegExp }[] = [
  { id: "aloe", label: "Aloe Vera", match: /aloe/i },
  { id: "neem", label: "Neem", match: /neem/i },
  { id: "tulasi", label: "Tulasi", match: /tulasi/i },
  { id: "turmeric", label: "Turmeric", match: /turmeric/i },
  { id: "tea-tree", label: "Tea Tree", match: /tea tree/i },
  { id: "charcoal", label: "Charcoal", match: /charcoal/i },
  { id: "gold", label: "24K Gold", match: /gold/i },
  { id: "niacinamide", label: "Niacinamide", match: /niacinamide/i },
  { id: "hyaluronic", label: "Hyaluronic Acid", match: /hyaluronic/i },
  { id: "salicylic", label: "Salicylic Acid", match: /salicylic/i },
  { id: "saffron", label: "Saffron", match: /saffron/i },
  { id: "onion", label: "Onion Extract", match: /onion/i },
  { id: "multani-mitti", label: "Multani Mitti", match: /multani mitti/i },
  { id: "almond", label: "Almond Oil", match: /almond/i },
  { id: "amla", label: "Amla", match: /amla/i },
  { id: "sandalwood", label: "Sandalwood", match: /sandal/i },
  { id: "vitamin-e", label: "Vitamin E", match: /vitamin e/i },
  { id: "glycerin", label: "Glycerin", match: /glycerin/i },
  { id: "coconut", label: "Coconut Oil", match: /coconut/i },
  { id: "beetroot", label: "Beetroot", match: /beetroot/i },
  { id: "wheat-germ", label: "Wheat Germ Oil", match: /wheat germ/i },
  { id: "cucumber", label: "Cucumber", match: /cucumber/i },
  { id: "honey", label: "Honey", match: /honey/i },
  { id: "goat-milk", label: "Goat Milk", match: /goat milk/i },
  { id: "lavender", label: "Lavender", match: /lavender/i },
  { id: "olive", label: "Olive Oil", match: /olive/i },
  { id: "jojoba", label: "Jojoba Oil", match: /jojoba/i },
  { id: "shea", label: "Shea Butter", match: /shea/i },
  { id: "coffee", label: "Coffee", match: /coffee/i },
];

/* ---------------- departments ---------------- */

/* Categories follow each product's actual use (October 2026 inventory):
   Skincare (face), Hair Care, Body Care and Lips. The former Makeup
   department and the made-to-order "empty bottle" cards were removed —
   made-to-order formulas live in the Customization section instead. */
export const departments: Department[] = [
  {
    id: "skin",
    label: "Skin",
    title: "Skincare",
    description: "Face care from the CO2 lab — face washes and cleansers, serums and treatment creams, moisturizers, sun protection, masks and scrubs. Shop by the concern you want to address.",
    image: "24k-gold-face-elixir-1",
    includes: (p) => p.category === "face",
    sections: [
      { id: "cleansers", label: "Face wash & cleansers", formats: ["face-wash"] },
      { id: "serums", label: "Serums & treatments", formats: ["serum", "treatment-cream"] },
      { id: "moisturizers", label: "Face creams & moisturizers", formats: ["moisturizer"] },
      { id: "sun", label: "Sun protection", formats: ["sunscreen"] },
      { id: "masks", label: "Masks & scrubs", formats: ["face-mask", "scrub"] },
    ],
    filters: ["concern", "format", "ingredient", "price", "availability", "feature", "bestseller"],
  },
  {
    id: "hair",
    label: "Hair",
    title: "Hair Care",
    description: "Shampoos, hair oils, an anti-dandruff scalp treatment and beard oil — kept separate from skin so you find the right step quickly.",
    image: "scalp-clear-hair-oil-1",
    includes: (p) => p.category === "hair",
    sections: [
      { id: "wash", label: "Shampoos", formats: ["shampoo"] },
      { id: "oils", label: "Hair oils", formats: ["hair-oil"] },
      { id: "scalp", label: "Scalp treatments", formats: ["scalp-treatment"] },
      { id: "grooming", label: "Beard care", formats: ["beard"] },
    ],
    filters: ["concern", "format", "ingredient", "price", "availability", "feature", "bestseller"],
  },
  {
    id: "body",
    label: "Body",
    title: "Body Care",
    description: "Body lotions, creams and gels, body wash and shower gel, and handmade bathing soaps — everyday care from the neck down.",
    image: "coco-glow-body-lotion-1",
    includes: (p) => p.category === "body",
    sections: [
      { id: "lotions", label: "Lotions, creams & gels", formats: ["body-lotion", "body-gel"] },
      { id: "wash", label: "Body wash & shower gel", formats: ["body-wash"] },
      { id: "bars", label: "Body soaps", formats: ["bath-bar"] },
    ],
    filters: ["concern", "format", "ingredient", "price", "availability", "feature", "bestseller"],
  },
  {
    id: "lips",
    label: "Lips",
    title: "Lip Products",
    description: "Lipstick in seven shades — from Secret Rose to Red Kiss in matte or glossy — and plumping, non-sticky high-shine gloss with vitamin E, jojoba oil and shea butter. Try every shade on your own face before you buy.",
    image: "gloss-berry-rubin-1",
    includes: (p) => p.category === "lips",
    sections: [
      { id: "lipstick", label: "Lipstick", formats: ["lipstick"] },
      { id: "gloss", label: "Lip gloss", formats: ["lip-gloss"] },
    ],
    filters: ["shade", "format", "finish", "price", "availability", "feature"],
  },
];

export const departmentOrder: DepartmentId[] = ["skin", "hair", "body", "lips"];
