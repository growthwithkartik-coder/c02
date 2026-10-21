/* ============================================================
   CO2 — product catalogue (single source of truth)
   55 photographed products, all taken from the Drive product
   inventory (October 2026). Made-to-order formulas are NOT catalogue
   products — they live in data/custom-formulas.ts and are offered only
   through the Customization section / Make It Yours builder.
   Products with availability "price-pending" are shown but can't be
   ordered until a real price is entered.
   Copy, ingredients and sizes are taken from the text printed on
   each pack. No ratings, reviews, certifications or clinical
   results are claimed — rating stays null until real reviews exist.
   PRICES (INR) ARE EDITABLE HERE — one number per product.
   Images: /public/products/<image>-640.webp and -1200.webp
   ============================================================ */
import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "co2-001",
    slug: "24k-gold-face-elixir",
    name: "24K Gold Face Elixir",
    subtitle: "Radiance & renewal face serum",
    category: "face",
    type: "treatments",
    shortDescription: "Gold-flecked hydration for a lit-from-within finish.",
    description: "A fluid serum with 24K gold suspended through it, layered with hyaluronic acid, niacinamide and vitamin E. It sinks in quickly and leaves skin looking smooth, hydrated and quietly luminous.",
    lede: "The dropper draws up a clear serum with fine gold suspended through it. On skin it reads as light, not glitter.",
    story: [
      "Hyaluronic acid brings the water, niacinamide keeps the surface looking even and refined, and vitamin E protects the oils in the formula. The gold is there for the way the serum catches light on skin.",
      "Use three or four drops after cleansing and before moisturizer. It layers under makeup without pilling, and on its own it gives skin a soft, polished glow."
    ],
    benefits: [
      {
        title: "Hydrates",
        text: "Hyaluronic acid draws water into the surface for a plumper, smoother feel."
      },
      {
        title: "Illuminates",
        text: "Suspended 24K gold and niacinamide give skin a luminous, even look."
      },
      {
        title: "Smooths",
        text: "A fluid texture that settles into skin and leaves it soft."
      }
    ],
    ingredients: [
      {
        name: "24K Gold",
        note: "Suspended flecks for a luminous finish"
      },
      {
        name: "Hyaluronic Acid",
        note: "Humectant that holds water at the skin's surface"
      },
      {
        name: "Niacinamide",
        note: "Helps skin look even and refined"
      },
      {
        name: "Vitamin E",
        note: "Antioxidant that keeps the formula fresh"
      }
    ],
    keyIngredients: [
      "gold",
      "hyaluronic",
      "niacinamide",
      "antioxidants"
    ],
    howToUse: [
      "After cleansing, warm three to four drops between your fingertips.",
      "Press into face and neck.",
      "Follow with moisturizer. Use morning or evening."
    ],
    size: "30 ml / 1.01 fl. oz.",
    price: 1850,
    compareAtPrice: null,
    images: [
      "24k-gold-face-elixir-1"
    ],
    cutout: "24k-gold-face-elixir",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "treatments",
      "radiance",
      "hydration",
      "gold",
      "hyaluronic",
      "niacinamide",
      "antioxidants",
      "signature"
    ],
    badge: "Signature",
    skinTypes: [
      "Dry",
      "Combination",
      "Normal",
      "Dehydrated",
      "Oily"
    ],
    texture: "Fluid serum",
    finish: "Luminous",
    forWho: "Anyone who wants hydration and a luminous finish in one quick step.",
    specs: [
      {
        label: "Format",
        value: "Glass dropper bottle"
      },
      {
        label: "Key ingredients",
        value: "24K Gold · Hyaluronic Acid · Niacinamide · Vitamin E"
      },
      {
        label: "On pack",
        value: "Hydrates · Illuminates · Smooths"
      }
    ],
    shades: [],
    bestSeller: true,
    featured: true,
    custom: null,
    order: 1
  },
  {
    id: "co2-063",
    slug: "no-marks-cream",
    name: "No Marks Cream",
    subtitle: "Gentle & blemish-clearing formula",
    category: "face",
    type: "treatments",
    shortDescription: "A turmeric, tulasi and vacha face cream — on the pack: reduces blemishes, evens skin tone and fades scars.",
    description: "No Marks Cream with Turmeric, Tulasi, Vacha and Neem — the ingredients printed on the pack.",
    lede: "Gentle & blemish-clearing formula.",
    story: [
      "Key ingredients on the pack: Turmeric · Tulasi · Vacha · Neem.",
      "The pack describes it as reduces blemishes, evens skin tone and fades scars."
    ],
    benefits: [
      {
        title: "Reduces Blemishes",
        text: "As printed on the pack."
      },
      {
        title: "Evens Skin Tone",
        text: "As printed on the pack."
      },
      {
        title: "Fades Scars",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Turmeric",
        note: "Botanical"
      },
      {
        name: "Tulasi",
        note: "Botanical"
      },
      {
        name: "Vacha",
        note: "Botanical"
      },
      {
        name: "Neem",
        note: "Botanical"
      }
    ],
    keyIngredients: [
      "turmeric",
      "tulasi",
      "neem"
    ],
    howToUse: [
      "After cleansing, take a small amount.",
      "Apply a thin layer over the face or the areas you want to focus on.",
      "Use morning or evening."
    ],
    size: "50 ml / 1.69 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "no-marks-cream-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "treatments",
      "turmeric",
      "tulasi",
      "neem"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Cream",
    finish: "",
    forWho: "Anyone who wants a gentle cream for blemishes and an even-looking skin tone.",
    specs: [
      {
        label: "Format",
        value: "Cream"
      },
      {
        label: "Key ingredients",
        value: "Turmeric · Tulasi · Vacha · Neem"
      },
      {
        label: "On pack",
        value: "Gentle & Blemish-Clearing Formula · Reduces Blemishes · Evens Skin Tone · Fades Scars"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 2.5
  },
  {
    id: "co2-003",
    slug: "clarite-botanical-cream",
    name: "Clarité Botanical Cream",
    subtitle: "Acne & pimple care with Indian botanicals",
    category: "face",
    type: "treatments",
    shortDescription: "Aloe, neem, tulasi and turmeric in one balancing cream.",
    description: "A soft green cream built on four Indian botanicals: aloe vera, neem, tulasi and turmeric. It clarifies, balances and helps skin look clear and even.",
    lede: "Four plants with a long history in Indian skincare, set into a light cream for every day.",
    story: [
      "Neem and tulasi bring a fresh, herbal character, turmeric adds warmth and helps skin look bright, and aloe vera keeps everything cool and hydrated. The cream absorbs quickly and leaves no heavy film.",
      "Use it as your daily moisturizer when skin feels unsettled, or on the areas that need it most."
    ],
    benefits: [
      {
        title: "Clarifies",
        text: "Neem and tulasi help skin look clearer."
      },
      {
        title: "Balances",
        text: "A light texture that doesn't add shine."
      },
      {
        title: "Clears",
        text: "Turmeric helps the complexion look bright and even."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Cooling, hydrating base"
      },
      {
        name: "Neem",
        note: "Herbal leaf extract with a clarifying character"
      },
      {
        name: "Tulasi (Holy Basil)",
        note: "Aromatic herb used in Ayurvedic skincare"
      },
      {
        name: "Turmeric",
        note: "Golden root that helps skin look bright"
      }
    ],
    keyIngredients: [
      "aloe",
      "neem",
      "tulasi",
      "turmeric"
    ],
    howToUse: [
      "Cleanse and dry skin.",
      "Smooth a small amount over the face, or onto areas that need extra care.",
      "Use morning and evening."
    ],
    size: "100 g",
    price: 650,
    compareAtPrice: null,
    images: [
      "clarite-botanical-cream-1",
      "clarite-botanical-cream-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "treatments",
      "aloe",
      "neem",
      "tulasi",
      "turmeric"
    ],
    badge: null,
    skinTypes: [
      "Oily",
      "Combination",
      "Normal",
      "Sensitive"
    ],
    texture: "Light cream",
    finish: "Natural",
    forWho: "Skin that breaks out from time to time and prefers botanical formulas.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Aloe Vera · Neem · Tulasi · Turmeric"
      },
      {
        label: "On pack",
        value: "Clarifies · Balances · Clears"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 3
  },
  {
    id: "co2-004",
    slug: "renew-firming-cream",
    name: "Renew Firming Cream",
    subtitle: "Anti-ageing face cream",
    category: "face",
    type: "moisturizers",
    shortDescription: "A rich, smoothing cream for skin that looks tired.",
    description: "A rich cream of aloe vera, almond oil, wheat germ oil and turmeric. It cushions skin with lasting moisture and helps fine lines look softer and skin look firmer.",
    lede: "Moisture does most of the work in skin that looks tired. This cream is built to hold it in.",
    story: [
      "Almond and wheat germ oils give the cream its cushion and leave skin supple. Aloe vera keeps the texture fresh rather than heavy, and turmeric helps skin look bright.",
      "Use it at night as the last step of your routine, or in the morning under sunscreen when skin wants more comfort."
    ],
    benefits: [
      {
        title: "Smooths",
        text: "Lasting moisture helps fine lines look softer."
      },
      {
        title: "Firms",
        text: "Rich oils leave skin feeling supple and toned."
      },
      {
        title: "Nourishes",
        text: "Almond and wheat germ oils cushion dry areas."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Hydrating, cooling plant juice"
      },
      {
        name: "Almond Oil",
        note: "Softening oil rich in lipids"
      },
      {
        name: "Wheat Germ Oil",
        note: "Naturally rich in vitamin E; adds cushion"
      },
      {
        name: "Turmeric",
        note: "Helps skin look bright"
      }
    ],
    keyIngredients: [
      "aloe",
      "almond",
      "wheatgerm",
      "turmeric"
    ],
    howToUse: [
      "After cleansing and serum, take a pea-sized amount.",
      "Warm between fingertips and press over face and neck with upward strokes.",
      "Use morning and evening."
    ],
    size: "50 g",
    price: 890,
    compareAtPrice: null,
    images: [
      "renew-firming-cream-1",
      "renew-firming-cream-2"
    ],
    cutout: "renew-firming-cream",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "treatments",
      "hydration",
      "aloe",
      "almond",
      "wheatgerm",
      "turmeric"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Normal",
      "Combination",
      "Dehydrated"
    ],
    texture: "Rich cream",
    finish: "Soft, satin",
    forWho: "Dry to normal skin that wants a cushioning cream with visible softness.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Aloe Vera · Almond Oil · Wheat Germ Oil · Turmeric"
      },
      {
        label: "On pack",
        value: "Reduces the look of wrinkles · Firms"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 4
  },
  {
    id: "co2-064",
    slug: "moisturizing-cream-spf",
    name: "Moisturizing Cream with SPF",
    subtitle: "Broad spectrum protection",
    category: "face",
    type: "moisturizers",
    shortDescription: "A daily face cream with SPF — hydrates, protects and nourishes.",
    description: "Moisturizing Cream with SPF with Aloe Vera, Wheat Germ Oil, Almond Oil and Sunscreen Base — the ingredients printed on the pack.",
    lede: "Broad spectrum protection.",
    story: [
      "Key ingredients on the pack: Aloe Vera · Wheat Germ Oil · Almond Oil · Sunscreen Base.",
      "The pack describes it as hydrates, protects and nourishes."
    ],
    benefits: [
      {
        title: "Hydrates",
        text: "As printed on the pack."
      },
      {
        title: "Protects",
        text: "As printed on the pack."
      },
      {
        title: "Nourishes",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Plant extract"
      },
      {
        name: "Wheat Germ Oil",
        note: "Nourishing oil"
      },
      {
        name: "Almond Oil",
        note: "Nourishing oil"
      },
      {
        name: "Sunscreen Base",
        note: "Sun protection base"
      }
    ],
    keyIngredients: [
      "aloe",
      "wheatgerm",
      "almond"
    ],
    howToUse: [
      "Apply as the last step of your morning routine.",
      "Smooth evenly over face and neck.",
      "Reapply as needed during the day."
    ],
    size: "100 ml / 3.38 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "moisturizing-cream-spf-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "moisturizers",
      "aloe",
      "wheatgerm",
      "almond"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Cream",
    finish: "",
    forWho: "Anyone who wants a daily moisturizer with broad-spectrum sun protection.",
    specs: [
      {
        label: "Format",
        value: "Cream"
      },
      {
        label: "Key ingredients",
        value: "Aloe Vera · Wheat Germ Oil · Almond Oil · Sunscreen Base"
      },
      {
        label: "On pack",
        value: "Broad Spectrum Protection · Hydrates · Protects · Nourishes"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 4.5
  },
  {
    id: "co2-065",
    slug: "night-cream",
    name: "Night Cream",
    subtitle: "Gentle & restorative formula",
    category: "face",
    type: "moisturizers",
    shortDescription: "A rich overnight cream with coconut, almond and olive oils — hydrates, nourishes and revitalizes.",
    description: "Night Cream with Coconut Oil, Almond Oil, Olive Oil and Plum Seed Oil — the ingredients printed on the pack.",
    lede: "Gentle & restorative formula.",
    story: [
      "Key ingredients on the pack: Coconut Oil · Almond Oil · Olive Oil · Plum Seed Oil.",
      "The pack describes it as hydrates, nourishes and revitalizes."
    ],
    benefits: [
      {
        title: "Hydrates",
        text: "As printed on the pack."
      },
      {
        title: "Nourishes",
        text: "As printed on the pack."
      },
      {
        title: "Revitalizes",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Coconut Oil",
        note: "Nourishing oil"
      },
      {
        name: "Almond Oil",
        note: "Nourishing oil"
      },
      {
        name: "Olive Oil",
        note: "Nourishing oil"
      },
      {
        name: "Plum Seed Oil",
        note: "Nourishing oil"
      }
    ],
    keyIngredients: [
      "almond"
    ],
    howToUse: [
      "In the evening, after cleansing.",
      "Warm a small amount between your fingertips.",
      "Massage into face and neck."
    ],
    size: "50 ml / 1.69 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "night-cream-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "moisturizers",
      "almond"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Cream",
    finish: "",
    forWho: "Anyone who wants a gentle, restorative night cream.",
    specs: [
      {
        label: "Format",
        value: "Cream"
      },
      {
        label: "Key ingredients",
        value: "Coconut Oil · Almond Oil · Olive Oil · Plum Seed Oil"
      },
      {
        label: "On pack",
        value: "Gentle & Restorative Formula · Hydrates · Nourishes · Revitalizes"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 4.6
  },
  {
    id: "co2-066",
    slug: "sunscreen-lotion-spf-50",
    name: "Sunscreen Lotion SPF 50+",
    subtitle: "Daily sun protection lotion",
    category: "face",
    type: "sun-care",
    shortDescription: "An SPF 50+ sunscreen lotion for daily sun protection.",
    description: "Sunscreen Lotion SPF 50+ with Cucumber, Turmeric, Lemon Peel and Manjistha — the ingredients printed on the pack.",
    lede: "Daily sun protection lotion.",
    story: [
      "Key ingredients on the pack: Cucumber · Turmeric · Lemon Peel · Manjistha.",
      "The pack describes it as SPF 50+, daily use and sun protection."
    ],
    benefits: [
      {
        title: "SPF 50+",
        text: "As printed on the pack."
      },
      {
        title: "Daily use",
        text: "As printed on the pack."
      },
      {
        title: "Sun protection",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Cucumber",
        note: "Botanical"
      },
      {
        name: "Turmeric",
        note: "Botanical"
      },
      {
        name: "Lemon Peel",
        note: "Botanical"
      },
      {
        name: "Manjistha",
        note: "Botanical"
      }
    ],
    keyIngredients: [
      "turmeric"
    ],
    howToUse: [
      "Apply generously 15 minutes before going out in the sun.",
      "Cover all exposed skin evenly.",
      "Reapply after swimming, sweating or towelling and as needed through the day."
    ],
    size: "100 ml / 3.38 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "sunscreen-lotion-spf-50-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "sun-care",
      "turmeric"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Lotion",
    finish: "",
    forWho: "Anyone who wants a daily sun protection lotion.",
    specs: [
      {
        label: "Format",
        value: "Lotion"
      },
      {
        label: "Key ingredients",
        value: "Cucumber · Turmeric · Lemon Peel · Manjistha"
      },
      {
        label: "On pack",
        value: "SPF 50+ · Daily Sun Protection Lotion"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 4.8
  },
  {
    id: "co2-010",
    slug: "neem-rose-face-wash",
    name: "Neem Rose Face Wash",
    subtitle: "Aloe neem face wash",
    category: "face",
    type: "cleansers",
    shortDescription: "Aloe, neem, cucumber and rose for a clear, radiant complexion.",
    description: "A gentle gel with aloe vera, neem, cucumber and rose. It purifies, soothes and balances, and leaves skin looking clear and radiant.",
    lede: "The clarity of neem, softened with cucumber and rose.",
    story: [
      "Neem keeps the cleanse purifying, cucumber cools, rose adds softness and aloe vera holds it together in a gentle gel.",
      "It's a balanced everyday wash for skin that wants clarity but dislikes anything harsh."
    ],
    benefits: [
      {
        title: "Purifies",
        text: "Neem helps skin look clear."
      },
      {
        title: "Soothes",
        text: "Aloe and cucumber keep skin calm."
      },
      {
        title: "Balances",
        text: "Rinses clean without tightness."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Soothing, hydrating base"
      },
      {
        name: "Neem",
        note: "Clarifying herbal leaf"
      },
      {
        name: "Cucumber",
        note: "Cooling and refreshing"
      },
      {
        name: "Rose",
        note: "Soft floral note"
      }
    ],
    keyIngredients: [
      "aloe",
      "neem"
    ],
    howToUse: [
      "Wet face.",
      "Massage a small amount over skin for 30 seconds.",
      "Rinse. Use morning and evening."
    ],
    size: "100 ml",
    price: 450,
    compareAtPrice: null,
    images: [
      "neem-rose-face-wash-1",
      "neem-rose-face-wash-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "aloe",
      "neem"
    ],
    badge: null,
    skinTypes: [
      "Oily",
      "Combination",
      "Normal",
      "Sensitive"
    ],
    texture: "Gel",
    finish: "Fresh",
    forWho: "Combination skin that wants a clarifying but gentle cleanse.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Aloe Vera · Neem · Cucumber · Rose"
      },
      {
        label: "On pack",
        value: "Purifies · Soothes · Balances"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 10
  },
  {
    id: "co2-012",
    slug: "noir-charcoal-face-wash",
    name: "Noir Charcoal Face Wash",
    subtitle: "Deep-cleansing charcoal wash",
    category: "face",
    type: "cleansers",
    shortDescription: "Activated charcoal, neem and tea tree for a pore-deep cleanse.",
    description: "A black gel wash with activated charcoal, aloe vera, neem and tea tree oil. It lifts oil and grime from the pores and leaves skin looking refined.",
    lede: "Charcoal is porous by nature, which is why it's so good at lifting oil and grime.",
    story: [
      "Activated charcoal gives the wash its depth and its deep-cleansing character. Neem and tea tree add a purifying, herbal edge, and aloe vera keeps the finish comfortable.",
      "Pair it with the Noir Charcoal Mask once or twice a week."
    ],
    benefits: [
      {
        title: "Deep cleans",
        text: "Activated charcoal lifts oil and impurities."
      },
      {
        title: "Purifies pores",
        text: "Neem and tea tree help skin look clear."
      },
      {
        title: "Refines",
        text: "Leaves the complexion looking smoother and more even."
      }
    ],
    ingredients: [
      {
        name: "Activated Charcoal",
        note: "Porous mineral that lifts oil and grime"
      },
      {
        name: "Aloe Vera",
        note: "Soothing base"
      },
      {
        name: "Neem",
        note: "Clarifying herbal leaf"
      },
      {
        name: "Tea Tree Oil",
        note: "Clean, herbal essential oil"
      }
    ],
    keyIngredients: [
      "charcoal",
      "aloe",
      "neem",
      "teatree"
    ],
    howToUse: [
      "Wet face.",
      "Massage over skin for 30–60 seconds.",
      "Rinse thoroughly."
    ],
    size: "120 ml",
    price: 520,
    compareAtPrice: null,
    images: [
      "noir-charcoal-face-wash-1",
      "noir-charcoal-face-wash-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "charcoal",
      "aloe",
      "neem",
      "teatree"
    ],
    badge: null,
    skinTypes: [
      "Oily",
      "Combination",
      "Normal"
    ],
    texture: "Black gel",
    finish: "Matte, clean",
    forWho: "Oily and combination skin, and anyone in a polluted city.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Activated Charcoal · Aloe Vera · Neem · Tea Tree Oil"
      },
      {
        label: "On pack",
        value: "For deep cleansing, pore purifying & an improved complexion"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 12
  },
  {
    id: "co2-061",
    slug: "milk-cleanser",
    name: "Milk Cleanser",
    subtitle: "Gentle & purifying formula",
    category: "face",
    type: "cleansers",
    shortDescription: "A turmeric, neem and tulasi cleanser that purifies, balances and restores radiance.",
    description: "Milk Cleanser with Turmeric Root Extract, Neem Leaf Extract, Tulasi Extract and Bitter Orange Peel Oil — the ingredients printed on the pack.",
    lede: "A gentle, purifying cleanser with turmeric, neem, tulasi and bitter orange peel oil.",
    story: [
      "Key ingredients on the pack: Turmeric Root Extract · Neem Leaf Extract · Tulasi Extract · Bitter Orange Peel Oil.",
      "The pack describes it as purifies, balances and restores radiance."
    ],
    benefits: [
      {
        title: "Purifies",
        text: "As printed on the pack."
      },
      {
        title: "Balances",
        text: "As printed on the pack."
      },
      {
        title: "Restores Radiance",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Turmeric Root Extract",
        note: "Plant extract"
      },
      {
        name: "Neem Leaf Extract",
        note: "Plant extract"
      },
      {
        name: "Tulasi Extract",
        note: "Plant extract"
      },
      {
        name: "Bitter Orange Peel Oil",
        note: "Citrus peel oil"
      }
    ],
    keyIngredients: [
      "turmeric",
      "neem",
      "tulasi"
    ],
    howToUse: [
      "Massage a small amount onto damp face and neck.",
      "Work gently over the skin.",
      "Rinse with water or wipe away, then follow with moisturizer."
    ],
    size: "100 ml / 3.38 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "milk-cleanser-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansers",
      "turmeric",
      "neem",
      "tulasi"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Cleanser",
    finish: "",
    forWho: "Anyone who wants a gentle daily face cleanser.",
    specs: [
      {
        label: "Format",
        value: "Cleanser"
      },
      {
        label: "Key ingredients",
        value: "Turmeric Root Extract · Neem Leaf Extract · Tulasi Extract · Bitter Orange Peel Oil"
      },
      {
        label: "On pack",
        value: "Gentle & Purifying Formula · Purifies · Balances · Restores Radiance"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 12.1
  },
  {
    id: "co2-062",
    slug: "red-grapes-face-wash",
    name: "Red Grapes Face Wash",
    subtitle: "Gentle & revitalizing formula",
    category: "face",
    type: "cleansers",
    shortDescription: "A red grape and beetroot face wash — deep cleansing, antioxidant, for radiance.",
    description: "Red Grapes Face Wash with Beetroot / Red Grape Extract, Aloe Vera, Rose and Glycerin — the ingredients printed on the pack.",
    lede: "Gentle & revitalizing formula.",
    story: [
      "Key ingredients on the pack: Beetroot / Red Grape Extract · Aloe Vera · Rose · Glycerin.",
      "The pack describes it as deep cleanses, antioxidant and radiance."
    ],
    benefits: [
      {
        title: "Deep Cleanses",
        text: "As printed on the pack."
      },
      {
        title: "Antioxidant",
        text: "As printed on the pack."
      },
      {
        title: "Radiance",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Beetroot / Red Grape Extract",
        note: "Fruit and root extracts"
      },
      {
        name: "Aloe Vera",
        note: "Plant extract"
      },
      {
        name: "Rose",
        note: "Botanical"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      }
    ],
    keyIngredients: [
      "aloe",
      "glycerin",
      "antioxidants"
    ],
    howToUse: [
      "Wet face and work a small amount into a lather.",
      "Massage gently for 30 seconds.",
      "Rinse well and pat dry."
    ],
    size: "100 ml / 3.38 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "red-grapes-face-wash-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansers",
      "aloe",
      "glycerin",
      "antioxidants"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Face wash",
    finish: "",
    forWho: "Anyone who wants a gentle, revitalizing face wash.",
    specs: [
      {
        label: "Format",
        value: "Face wash"
      },
      {
        label: "Key ingredients",
        value: "Beetroot / Red Grape Extract · Aloe Vera · Rose · Glycerin"
      },
      {
        label: "On pack",
        value: "Gentle & Revitalizing Formula · Deep Cleanses · Antioxidant · Radiance"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 12.2
  },
  {
    id: "co2-014",
    slug: "noir-charcoal-mask",
    name: "Noir Charcoal Mask",
    subtitle: "Deep-cleansing face mask",
    category: "face",
    type: "masks",
    shortDescription: "Bamboo charcoal with ajwain, caraway and vacha.",
    description: "A black clay-style mask with bamboo charcoal, ajwain, caraway and vacha. It draws out impurities and leaves pores looking refined.",
    lede: "Bamboo charcoal sits at the centre of this mask, with three warming botanicals from the Indian spice cupboard.",
    story: [
      "Bamboo charcoal lifts oil and grime, while ajwain, caraway and vacha give the mask its warm, herbal character. Ten minutes is enough.",
      "Use it once or twice a week, on its own or after the Noir Charcoal Face Wash."
    ],
    benefits: [
      {
        title: "Deep cleans",
        text: "Bamboo charcoal draws out impurities."
      },
      {
        title: "Refines",
        text: "Pores look smaller and cleaner after rinsing."
      },
      {
        title: "Improves",
        text: "The complexion looks clearer and more even."
      }
    ],
    ingredients: [
      {
        name: "Bamboo Charcoal",
        note: "Porous charcoal that lifts oil and grime"
      },
      {
        name: "Ajwain",
        note: "Warming seed traditionally used in Indian skincare"
      },
      {
        name: "Caraway",
        note: "Aromatic seed"
      },
      {
        name: "Vacha",
        note: "Aromatic Ayurvedic root"
      }
    ],
    keyIngredients: [
      "charcoal"
    ],
    howToUse: [
      "Apply an even layer to clean, dry skin, avoiding the eyes and lips.",
      "Leave for 10 minutes.",
      "Rinse with warm water. Use once or twice a week."
    ],
    size: "100 g",
    price: 690,
    compareAtPrice: null,
    images: [
      "noir-charcoal-mask-1",
      "noir-charcoal-mask-2"
    ],
    cutout: "noir-charcoal-mask",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "treatments",
      "cleansing",
      "charcoal"
    ],
    badge: null,
    skinTypes: [
      "Oily",
      "Combination",
      "Normal"
    ],
    texture: "Cream mask",
    finish: "Matte",
    forWho: "Oily and combination skin, and anyone after a weekly reset.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Bamboo Charcoal · Ajwain · Caraway · Vacha"
      },
      {
        label: "On pack",
        value: "For deep cleansing, pore purifying & an improved complexion"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: true,
    featured: true,
    custom: null,
    order: 14
  },
  {
    id: "co2-067",
    slug: "multani-mitti-face-mask",
    name: "Multani Mitti Face Mask",
    subtitle: "Gentle & purifying formula",
    category: "face",
    type: "masks",
    shortDescription: "A multani mitti face mask with aloe vera, rose and neem that deep cleanses, detoxifies and refines pores.",
    description: "Multani Mitti Face Mask with Multani Mitti (Fuller's Earth), Aloe Vera, Rose and Neem — the ingredients printed on the pack.",
    lede: "Fuller's earth (multani mitti) with aloe vera, rose and neem.",
    story: [
      "Key ingredients on the pack: Multani Mitti (Fuller's Earth) · Aloe Vera · Rose · Neem.",
      "The pack describes it as deep cleanses, detoxifies and refines pores."
    ],
    benefits: [
      {
        title: "Deep Cleanses",
        text: "As printed on the pack."
      },
      {
        title: "Detoxifies",
        text: "As printed on the pack."
      },
      {
        title: "Refines Pores",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Multani Mitti (Fuller's Earth)",
        note: "Clay"
      },
      {
        name: "Aloe Vera",
        note: "Plant extract"
      },
      {
        name: "Rose",
        note: "Botanical"
      },
      {
        name: "Neem",
        note: "Botanical"
      }
    ],
    keyIngredients: [
      "aloe",
      "neem"
    ],
    howToUse: [
      "Spread an even layer over clean, dry skin, avoiding the eyes and lips.",
      "Leave on until it begins to set.",
      "Rinse with lukewarm water and follow with moisturizer."
    ],
    size: "100 g / 3.53 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "multani-mitti-face-mask-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "masks",
      "aloe",
      "neem"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Mask",
    finish: "",
    forWho: "Anyone who wants a clay face mask for a weekly deep cleanse.",
    specs: [
      {
        label: "Format",
        value: "Mask"
      },
      {
        label: "Key ingredients",
        value: "Multani Mitti (Fuller's Earth) · Aloe Vera · Rose · Neem"
      },
      {
        label: "On pack",
        value: "Gentle & Purifying Formula · Deep Cleanses · Detoxifies · Refines Pores"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 14.5
  },
  {
    id: "co2-068",
    slug: "herbal-scrub",
    name: "Herbal Scrub",
    subtitle: "Gentle exfoliating formula",
    category: "face",
    type: "masks",
    shortDescription: "A walnut shell scrub with aloe vera and neem — deep cleanses, polishes and revitalizes.",
    description: "Herbal Scrub with Walnut Shell, Aloe Vera, Neem and Turmeric — the ingredients printed on the pack.",
    lede: "Gentle exfoliating formula.",
    story: [
      "Key ingredients on the pack: Walnut Shell · Aloe Vera · Neem · Turmeric.",
      "The pack describes it as deep cleanses, polishes and revitalizes."
    ],
    benefits: [
      {
        title: "Deep Cleanses",
        text: "As printed on the pack."
      },
      {
        title: "Polishes",
        text: "As printed on the pack."
      },
      {
        title: "Revitalizes",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Walnut Shell",
        note: "Exfoliant"
      },
      {
        name: "Aloe Vera",
        note: "Plant extract"
      },
      {
        name: "Neem",
        note: "Botanical"
      },
      {
        name: "Turmeric",
        note: "Botanical"
      }
    ],
    keyIngredients: [
      "aloe",
      "neem",
      "turmeric"
    ],
    howToUse: [
      "Apply to damp skin.",
      "Massage gently in small circles, avoiding the eye area.",
      "Rinse well. Use once or twice a week."
    ],
    size: "100 ml / 3.38 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "herbal-scrub-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "masks",
      "aloe",
      "neem",
      "turmeric"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Scrub",
    finish: "",
    forWho: "Anyone who wants a gentle exfoliating scrub.",
    specs: [
      {
        label: "Format",
        value: "Scrub"
      },
      {
        label: "Key ingredients",
        value: "Walnut Shell · Aloe Vera · Neem · Turmeric"
      },
      {
        label: "On pack",
        value: "Gentle Exfoliating Formula · Deep Cleanses · Polishes · Revitalizes"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 14.6
  },
  {
    id: "co2-019",
    slug: "aloe-veil-body-lotion",
    name: "Aloe Veil Body Lotion",
    subtitle: "Lightweight hydrating body lotion",
    category: "body",
    type: "body-care",
    shortDescription: "Lightweight botanical hydration for soft, comfortable skin.",
    description: "A cooling lotion of aloe vera, cucumber, wheat germ oil and almond oil. It hydrates intensely and leaves skin feeling refreshed, never sticky.",
    lede: "A body lotion for hot days: light, cooling, and gone in seconds.",
    story: [
      "Aloe vera and cucumber give the lotion its fresh, cooling feel, while wheat germ and almond oils keep skin supple for hours. It absorbs fast enough to dress straight after.",
      "A smaller bottle is pictured alongside for your bag."
    ],
    benefits: [
      {
        title: "Hydrates",
        text: "Aloe vera brings lasting hydration."
      },
      {
        title: "Refreshes",
        text: "Cucumber gives a cooling feel."
      },
      {
        title: "Softens",
        text: "Wheat germ and almond oils keep skin supple."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Cooling hydration"
      },
      {
        name: "Cucumber",
        note: "Fresh and cooling"
      },
      {
        name: "Wheat Germ Oil",
        note: "Naturally rich in vitamin E"
      },
      {
        name: "Almond Oil",
        note: "Softening oil"
      }
    ],
    keyIngredients: [
      "aloe",
      "wheatgerm",
      "almond"
    ],
    howToUse: [
      "Apply to clean, slightly damp skin.",
      "Massage until absorbed.",
      "Use daily, especially after bathing."
    ],
    size: "200 ml",
    price: 520,
    compareAtPrice: null,
    images: [
      "aloe-veil-body-lotion-1",
      "aloe-veil-body-lotion-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "hydration",
      "aloe",
      "wheatgerm",
      "almond"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Light lotion",
    finish: "Fresh",
    forWho: "Anyone who wants hydration without weight, especially in warm weather.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Aloe Vera · Cucumber · Wheat Germ Oil · Almond Oil"
      },
      {
        label: "On pack",
        value: "For intense, aloe fresh hydration & refreshed skin"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 19
  },
  {
    id: "co2-020",
    slug: "coco-glow-body-lotion",
    name: "Coco Glow Body Lotion",
    subtitle: "Radiance body lotion",
    category: "body",
    type: "body-care",
    shortDescription: "Orange peel and turmeric for skin that glows.",
    description: "A bright body lotion with cucumber, orange peel, turmeric and tulasi. It nourishes and leaves skin looking radiant.",
    lede: "Citrus and turmeric, the two brightest things in the kitchen, in a daily body lotion.",
    story: [
      "Orange peel and turmeric give the lotion its radiant character, cucumber keeps it light and tulasi adds a fresh herbal note. Skin feels nourished and looks warm and glowing.",
      "Use it every day after bathing."
    ],
    benefits: [
      {
        title: "Radiance",
        text: "Orange peel and turmeric help skin look bright."
      },
      {
        title: "Nourishes",
        text: "Leaves skin soft and comfortable."
      },
      {
        title: "Refreshes",
        text: "Cucumber and tulasi keep it light."
      }
    ],
    ingredients: [
      {
        name: "Cucumber",
        note: "Light and cooling"
      },
      {
        name: "Orange Peel",
        note: "Bright citrus botanical"
      },
      {
        name: "Turmeric",
        note: "Helps skin look radiant"
      },
      {
        name: "Tulasi (Holy Basil)",
        note: "Fresh herbal note"
      }
    ],
    keyIngredients: [
      "turmeric",
      "tulasi"
    ],
    howToUse: [
      "Apply to clean skin.",
      "Massage in until absorbed.",
      "Use daily."
    ],
    size: "200 ml",
    price: 520,
    compareAtPrice: null,
    images: [
      "coco-glow-body-lotion-1",
      "coco-glow-body-lotion-2"
    ],
    cutout: "coco-glow-body-lotion",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "hydration",
      "radiance",
      "turmeric",
      "tulasi"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Light lotion",
    finish: "Radiant",
    forWho: "Anyone who wants a daily body lotion with a glow.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Cucumber · Orange Peel · Turmeric · Tulasi"
      },
      {
        label: "On pack",
        value: "For a radiant, coco glow complexion & nourished skin"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: true,
    featured: false,
    custom: null,
    order: 20
  },
  {
    id: "co2-021",
    slug: "tulasi-balance-body-lotion",
    name: "Tulasi Balance Body Lotion",
    subtitle: "Herbal body lotion",
    category: "body",
    type: "body-care",
    shortDescription: "Tulasi, turmeric and wheat germ for balanced, nourished skin.",
    description: "A herbal lotion of cucumber, turmeric, tulasi and wheat germ oil. It nourishes and leaves skin looking healthy and even.",
    lede: "The everyday lotion in the range. Gentle and herbal, and easy to wear all year.",
    story: [
      "Tulasi and turmeric give the lotion its herbal character, cucumber keeps it fresh and wheat germ oil adds the nourishment that keeps skin supple.",
      "Use it daily from neck to toe."
    ],
    benefits: [
      {
        title: "Balances",
        text: "A light texture for every season."
      },
      {
        title: "Nourishes",
        text: "Wheat germ oil keeps skin supple."
      },
      {
        title: "Evens",
        text: "Turmeric helps skin look healthy and even."
      }
    ],
    ingredients: [
      {
        name: "Cucumber",
        note: "Light and cooling"
      },
      {
        name: "Turmeric",
        note: "Helps skin look even"
      },
      {
        name: "Tulasi (Holy Basil)",
        note: "Fresh, aromatic herb"
      },
      {
        name: "Wheat Germ Oil",
        note: "Naturally rich in vitamin E"
      }
    ],
    keyIngredients: [
      "tulasi",
      "turmeric",
      "wheatgerm"
    ],
    howToUse: [
      "Apply to clean skin.",
      "Massage in until absorbed.",
      "Use daily."
    ],
    size: "200 ml",
    price: 520,
    compareAtPrice: null,
    images: [
      "tulasi-balance-body-lotion-1",
      "tulasi-balance-body-lotion-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "hydration",
      "tulasi",
      "turmeric",
      "wheatgerm"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Light lotion",
    finish: "Natural",
    forWho: "Anyone who wants a gentle, herbal everyday lotion.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Cucumber · Turmeric · Tulasi · Wheat Germ Oil"
      },
      {
        label: "On pack",
        value: "For a balanced, healthy complexion & nourished skin"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 21
  },
  {
    id: "co2-022",
    slug: "lumiere-even-tone-lotion",
    name: "Lumière Even-Tone Lotion",
    subtitle: "Brightening body lotion",
    category: "body",
    type: "body-care",
    shortDescription: "Carrot, licorice and papaya for a luminous, even-toned look.",
    description: "A brightening lotion with carrot, licorice (yashtimadhu), wheat germ oil and papaya. It hydrates and helps skin look luminous and even-toned.",
    lede: "Four fruits and roots long used for a radiant complexion, in a daily lotion.",
    story: [
      "Carrot and papaya give the lotion its warm colour, licorice root (yashtimadhu) is a classic Ayurvedic ingredient for an even-looking tone, and wheat germ oil keeps skin hydrated.",
      "Use daily, and pair with sunscreen on exposed skin during the day."
    ],
    benefits: [
      {
        title: "Luminous",
        text: "Helps skin look radiant."
      },
      {
        title: "Even-toned",
        text: "Licorice helps the complexion look more uniform."
      },
      {
        title: "Hydrates",
        text: "Wheat germ oil keeps skin soft."
      }
    ],
    ingredients: [
      {
        name: "Carrot",
        note: "Vitamin-rich root"
      },
      {
        name: "Licorice (Yashtimadhu)",
        note: "Ayurvedic root for an even-looking tone"
      },
      {
        name: "Wheat Germ Oil",
        note: "Hydrating, naturally rich in vitamin E"
      },
      {
        name: "Papaya",
        note: "Fruit with a natural brightening character"
      }
    ],
    keyIngredients: [
      "licorice",
      "wheatgerm"
    ],
    howToUse: [
      "Apply to clean skin.",
      "Massage in until absorbed.",
      "Use daily and wear sunscreen on exposed skin."
    ],
    size: "180 ml",
    price: 590,
    compareAtPrice: null,
    images: [
      "lumiere-even-tone-lotion-1",
      "lumiere-even-tone-lotion-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "radiance",
      "hydration",
      "licorice",
      "wheatgerm"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Lotion",
    finish: "Luminous",
    forWho: "Anyone who wants a more radiant, even-looking body skin tone.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Carrot · Licorice (Yashtimadhu) · Wheat Germ Oil · Papaya"
      },
      {
        label: "On pack",
        value: "For a luminous, even-toned complexion & hydrated skin"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 22
  },
  {
    id: "co2-023",
    slug: "calamine-calm-lotion",
    name: "Calamine Calm Lotion",
    subtitle: "Soothing calamine lotion",
    category: "body",
    type: "body-care",
    shortDescription: "Calamine and zinc for cool, calm comfort.",
    description: "A soft pink lotion of calamine, aloe vera, zinc oxide and wheat germ oil. It cools, soothes and leaves skin calm and hydrated.",
    lede: "Calamine has been a soothing staple in family bathrooms for generations. This version adds aloe vera.",
    story: [
      "Calamine and zinc oxide give the lotion its cooling, soothing feel. Aloe vera adds hydration and wheat germ oil keeps it from drying skin out.",
      "Keep it for after the sun, after shaving, or whenever skin feels warm and irritated."
    ],
    benefits: [
      {
        title: "Cools",
        text: "A cooling feel on contact."
      },
      {
        title: "Soothes",
        text: "Calamine and zinc oxide calm the look of redness."
      },
      {
        title: "Hydrates",
        text: "Aloe vera and wheat germ oil keep skin comfortable."
      }
    ],
    ingredients: [
      {
        name: "Calamine",
        note: "Classic soothing mineral"
      },
      {
        name: "Aloe Vera",
        note: "Cooling hydration"
      },
      {
        name: "Zinc Oxide",
        note: "Soothing mineral"
      },
      {
        name: "Wheat Germ Oil",
        note: "Keeps skin supple"
      }
    ],
    keyIngredients: [
      "aloe",
      "wheatgerm"
    ],
    howToUse: [
      "Shake well.",
      "Smooth over skin that feels warm or uncomfortable.",
      "Use as often as needed."
    ],
    size: "100 ml",
    price: 420,
    compareAtPrice: null,
    images: [
      "calamine-calm-lotion-1",
      "calamine-calm-lotion-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "hydration",
      "aloe",
      "wheatgerm"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Fluid lotion",
    finish: "Soft matte",
    forWho: "Every skin type, especially sensitive skin and summer days.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Calamine · Aloe Vera · Zinc Oxide · Wheat Germ Oil"
      },
      {
        label: "On pack",
        value: "For soothing & cooling skin relief, calm complexion & healthy hydration"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 23
  },
  {
    id: "co2-024",
    slug: "decollete-nourishing-cream",
    name: "Décolleté Nourishing Cream",
    subtitle: "Bust & décolleté cream",
    category: "body",
    type: "body-care",
    shortDescription: "Aloe, almond, olive and wheat germ for soft, supple skin.",
    description: "A nourishing cream for the bust and décolleté, made with aloe vera, almond oil, olive oil and wheat germ oil. It leaves delicate skin soft, nourished and healthy-looking.",
    lede: "The skin across the chest is thinner than the skin on the rest of the body. It deserves a cream of its own.",
    story: [
      "Almond, olive and wheat germ oils give the cream its rich nourishment, and aloe vera keeps it light enough to absorb quickly. Skin feels soft and looks smooth and supple.",
      "Massage in with gentle upward strokes as part of your evening ritual."
    ],
    benefits: [
      {
        title: "Nourishes",
        text: "Three plant oils feed delicate skin."
      },
      {
        title: "Softens",
        text: "Leaves skin smooth and supple."
      },
      {
        title: "Healthy-looking",
        text: "For a soft, even appearance."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Light hydration"
      },
      {
        name: "Almond Oil",
        note: "Softening oil"
      },
      {
        name: "Olive Oil",
        note: "Rich, nourishing oil"
      },
      {
        name: "Wheat Germ Oil",
        note: "Naturally rich in vitamin E"
      }
    ],
    keyIngredients: [
      "aloe",
      "almond",
      "wheatgerm"
    ],
    howToUse: [
      "Apply to clean skin on the bust and décolleté.",
      "Massage gently with upward strokes until absorbed.",
      "Use daily, ideally in the evening."
    ],
    size: "100 g",
    price: 750,
    compareAtPrice: null,
    images: [
      "decollete-nourishing-cream-1",
      "decollete-nourishing-cream-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "hydration",
      "ritual",
      "aloe",
      "almond",
      "wheatgerm"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Rich cream",
    finish: "Soft",
    forWho: "Anyone who wants to give delicate chest skin extra nourishment.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Aloe Vera · Almond Oil · Olive Oil · Wheat Germ Oil"
      },
      {
        label: "On pack",
        value: "For soft, nourished & healthy-looking skin"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 24
  },
  {
    id: "co2-025",
    slug: "aloe-pure-gel",
    name: "Aloe Pure Gel",
    subtitle: "Multi-use aloe vera gel",
    category: "body",
    type: "body-care",
    shortDescription: "Cool, clear aloe for face, body and hair.",
    description: "A clear, cooling gel with aloe vera and glycerin. It soothes, hydrates and protects, and works anywhere on the body.",
    lede: "The one product you can use everywhere: after the sun, after shaving, or as a light moisturizer on hot days.",
    story: [
      "Aloe vera gives the gel its cool, hydrating feel and glycerin holds moisture in. Carbomer gives it its clear, bouncy texture, and it absorbs quickly with no residue.",
      "Use it on face, body or hair, whenever skin wants cooling."
    ],
    benefits: [
      {
        title: "Soothes",
        text: "A cool, calming feel on contact."
      },
      {
        title: "Hydrates",
        text: "Aloe and glycerin hold moisture in."
      },
      {
        title: "Protects",
        text: "Keeps skin comfortable through the day."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Cooling, hydrating plant juice"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Carbomer",
        note: "Gives the gel its clear texture"
      },
      {
        name: "Sodium Benzoate",
        note: "Preservative that keeps the gel fresh"
      }
    ],
    keyIngredients: [
      "aloe",
      "glycerin"
    ],
    howToUse: [
      "Apply a thin layer to clean skin.",
      "Use on face, body, after sun or after shaving.",
      "Reapply as needed."
    ],
    size: "100 g",
    price: 390,
    compareAtPrice: null,
    images: [
      "aloe-pure-gel-1",
      "aloe-pure-gel-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "hydration",
      "aloe",
      "glycerin"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Clear gel",
    finish: "Fresh, non-sticky",
    forWho: "Every skin type, and every member of the family.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Aloe Vera · Glycerin · Carbomer · Sodium Benzoate"
      },
      {
        label: "On pack",
        value: "Soothes · Hydrates · Protects"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 25
  },
  {
    id: "co2-069",
    slug: "stretch-marks-gel",
    name: "Stretch Marks Gel",
    subtitle: "Nourishing & moisturizing body care",
    category: "body",
    type: "body-care",
    shortDescription: "An aloe vera, almond and wheat germ oil body gel — hydrates, nourishes and conditions.",
    description: "Stretch Marks Gel with Aloe Vera, Almond Oil, Wheat Germ Oil and Vitamin E — the ingredients printed on the pack.",
    lede: "Nourishing & moisturizing body care.",
    story: [
      "Key ingredients on the pack: Aloe Vera · Almond Oil · Wheat Germ Oil · Vitamin E.",
      "The pack describes it as hydrates, nourishes and conditions."
    ],
    benefits: [
      {
        title: "Hydrates",
        text: "As printed on the pack."
      },
      {
        title: "Nourishes",
        text: "As printed on the pack."
      },
      {
        title: "Conditions",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Plant extract"
      },
      {
        name: "Almond Oil",
        note: "Nourishing oil"
      },
      {
        name: "Wheat Germ Oil",
        note: "Nourishing oil"
      },
      {
        name: "Vitamin E",
        note: "Antioxidant"
      }
    ],
    keyIngredients: [
      "aloe",
      "almond",
      "wheatgerm",
      "antioxidants"
    ],
    howToUse: [
      "Apply to clean, dry skin.",
      "Massage in until absorbed.",
      "Use daily."
    ],
    size: "Net wt. 100 g / 3.52 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "stretch-marks-gel-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "body-care",
      "aloe",
      "almond",
      "wheatgerm",
      "antioxidants"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Gel",
    finish: "",
    forWho: "Anyone who wants nourishing, moisturizing body care.",
    specs: [
      {
        label: "Format",
        value: "Gel"
      },
      {
        label: "Key ingredients",
        value: "Aloe Vera · Almond Oil · Wheat Germ Oil · Vitamin E"
      },
      {
        label: "On pack",
        value: "Nourishing & Moisturizing Body Care · Sulfate free · Hydrates · Nourishes · Conditions"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 25.5
  },
  {
    id: "co2-070",
    slug: "white-petroleum-jelly",
    name: "White Petroleum Jelly",
    subtitle: "Protective moisturizing jelly",
    category: "body",
    type: "body-care",
    shortDescription: "Classic white petroleum jelly — softens, moisturizes and protects.",
    description: "White Petroleum Jelly — protective moisturizing jelly, as printed on the pack.",
    lede: "Protective moisturizing jelly.",
    story: [
      "The pack describes it as a protective moisturizing jelly.",
      "The pack describes it as softens, moisturizes and protects."
    ],
    benefits: [
      {
        title: "Softens",
        text: "As printed on the pack."
      },
      {
        title: "Moisturizes",
        text: "As printed on the pack."
      },
      {
        title: "Protects",
        text: "As printed on the pack."
      }
    ],
    ingredients: [],
    keyIngredients: [],
    howToUse: [
      "Apply a thin layer to dry areas.",
      "Use as often as needed."
    ],
    size: "Net wt. 100 g (also shown: 50 g jar)",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "white-petroleum-jelly-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "body-care"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Jelly",
    finish: "",
    forWho: "Anyone who wants a protective moisturizing jelly.",
    specs: [
      {
        label: "Format",
        value: "Jelly"
      },
      {
        label: "On pack",
        value: "Protective Moisturizing Jelly · Softens · Moisturizes · Protects"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 25.6
  },
  {
    id: "co2-027",
    slug: "lavender-santal-body-wash",
    name: "Lavender Santal Body Wash",
    subtitle: "Aromatherapeutic body wash",
    category: "body",
    type: "body-wash",
    shortDescription: "Lavender, sandalwood and mint for a refreshing cleanse.",
    description: "A lilac body wash with aloe vera, lavender, sandalwood and mint. It cleanses gently and turns a shower into an aromatherapeutic ritual.",
    lede: "Lavender to calm, sandalwood to ground and mint to refresh. Three scents layered into one wash.",
    story: [
      "Aloe vera keeps the cleanse soft on skin, while lavender, sandalwood and mint fill the bathroom with scent. Skin is left clean, soft and lightly scented.",
      "A smaller bottle is pictured alongside for travel."
    ],
    benefits: [
      {
        title: "Refreshes",
        text: "Mint for an awakening cleanse."
      },
      {
        title: "Calms",
        text: "Lavender and sandalwood for a soothing scent."
      },
      {
        title: "Softens",
        text: "Aloe vera leaves skin soft."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Soothing base"
      },
      {
        name: "Lavender",
        note: "Calming floral"
      },
      {
        name: "Sandalwood",
        note: "Warm, grounding wood"
      },
      {
        name: "Mint",
        note: "Cooling and refreshing"
      }
    ],
    keyIngredients: [
      "aloe",
      "lavender",
      "sandalwood"
    ],
    howToUse: [
      "Squeeze onto a wet loofah or palm.",
      "Lather over damp skin.",
      "Rinse well."
    ],
    size: "270 ml",
    price: 560,
    compareAtPrice: null,
    images: [
      "lavender-santal-body-wash-1",
      "lavender-santal-body-wash-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "ritual",
      "aloe",
      "lavender",
      "sandalwood"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Gel wash",
    finish: "Soft, scented",
    forWho: "Anyone who wants their shower to feel like a ritual.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Aloe Vera · Lavender · Sandalwood · Mint"
      },
      {
        label: "On pack",
        value: "For a refreshing, aromatherapeutic cleanse & soft skin"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 27
  },
  {
    id: "co2-071",
    slug: "shower-gel",
    name: "Shower Gel",
    subtitle: "Refreshing & moisturizing body cleanser",
    category: "body",
    type: "body-wash",
    shortDescription: "An aloe vera, glycerin and tulasi shower gel — cleanses, refreshes and hydrates.",
    description: "Shower Gel with Aloe Vera, Glycerin, Tulasi and Fragrance — the ingredients printed on the pack.",
    lede: "Refreshing & moisturizing body cleanser.",
    story: [
      "Key ingredients on the pack: Aloe Vera · Glycerin · Tulasi · Fragrance.",
      "The pack describes it as cleanses, refreshes and hydrates."
    ],
    benefits: [
      {
        title: "Cleanses",
        text: "As printed on the pack."
      },
      {
        title: "Refreshes",
        text: "As printed on the pack."
      },
      {
        title: "Hydrates",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Plant extract"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Tulasi",
        note: "Botanical"
      },
      {
        name: "Fragrance",
        note: "Scent"
      }
    ],
    keyIngredients: [
      "aloe",
      "glycerin",
      "tulasi"
    ],
    howToUse: [
      "Squeeze onto wet hands or a loofah.",
      "Lather over the body.",
      "Rinse well."
    ],
    size: "100 ml / 3.38 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "shower-gel-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "body-wash",
      "aloe",
      "glycerin",
      "tulasi"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Gel wash",
    finish: "",
    forWho: "Anyone who wants a refreshing, moisturizing body cleanser.",
    specs: [
      {
        label: "Format",
        value: "Gel wash"
      },
      {
        label: "Key ingredients",
        value: "Aloe Vera · Glycerin · Tulasi · Fragrance"
      },
      {
        label: "On pack",
        value: "Refreshing & Moisturizing Body Cleanser · Sulfate free · Cleanses · Refreshes · Hydrates"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 27.5
  },
  {
    id: "co2-034",
    slug: "aloe-vera-herbal-bar",
    name: "Aloe Vera Herbal Bar",
    subtitle: "Gentle cleansing bathing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "Aloe, glycerin and vitamin E. Cleanses, hydrates, refreshes.",
    description: "A translucent green bathing bar with aloe vera, glycerin, vitamin E and coconut oil. It cleanses gently and leaves skin hydrated and refreshed.",
    lede: "Six bars in the herbal collection, each built on glycerin and coconut oil. This is the gentlest.",
    story: [
      "Aloe vera and glycerin keep the bar gentle and hydrating, coconut oil gives it a generous lather and vitamin E protects the oils.",
      "Every bar is embossed with the CO2 mark and comes in a keepsake tin."
    ],
    benefits: [
      {
        title: "Cleanses",
        text: "A gentle, generous lather."
      },
      {
        title: "Hydrates",
        text: "Aloe and glycerin keep skin soft."
      },
      {
        title: "Refreshes",
        text: "A cool, clean finish."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Soothing, hydrating"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Coconut Oil",
        note: "Lathering oil"
      }
    ],
    keyIngredients: [
      "aloe",
      "glycerin",
      "antioxidants"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "100 g / 3.52 oz.",
    price: 260,
    compareAtPrice: null,
    images: [
      "aloe-vera-herbal-bar-1",
      "aloe-vera-herbal-bar-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "aloe",
      "glycerin",
      "antioxidants"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Bar",
    finish: "Fresh",
    forWho: "Every skin type, especially skin that likes things gentle.",
    specs: [
      {
        label: "Format",
        value: "Bathing bar in tin"
      },
      {
        label: "Key ingredients",
        value: "Aloe Vera · Glycerin · Vitamin E · Coconut Oil"
      },
      {
        label: "On pack",
        value: "Cleanses · Hydrates · Refreshes"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 34
  },
  {
    id: "co2-035",
    slug: "lemon-zest-herbal-bar",
    name: "Lemon Zest Herbal Bar",
    subtitle: "Refreshing bathing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "Lemon oil, glycerin and vitamin E. Brightens and invigorates.",
    description: "A sunny yellow bar with lemon oil, glycerin, vitamin E and coconut oil. It cleanses, refreshes and wakes you up.",
    lede: "Lemon is the morning scent. This bar is for showers that need to wake you up.",
    story: [
      "Lemon oil gives the bar its bright, zesty scent, glycerin and coconut oil a soft lather and vitamin E protects the oils.",
      "Every bar is embossed with the CO2 mark and comes in a keepsake tin."
    ],
    benefits: [
      {
        title: "Brightens",
        text: "Lemon oil for a bright, fresh look."
      },
      {
        title: "Refreshes",
        text: "A zesty scent that wakes you up."
      },
      {
        title: "Invigorates",
        text: "A lively start to the day."
      }
    ],
    ingredients: [
      {
        name: "Lemon Oil",
        note: "Zesty citrus oil"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Coconut Oil",
        note: "Lathering oil"
      }
    ],
    keyIngredients: [
      "glycerin",
      "antioxidants"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "100 g / 3.52 oz.",
    price: 260,
    compareAtPrice: null,
    images: [
      "lemon-zest-herbal-bar-1",
      "lemon-zest-herbal-bar-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "radiance",
      "glycerin",
      "antioxidants"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Bar",
    finish: "Fresh",
    forWho: "Morning showers and anyone who loves citrus.",
    specs: [
      {
        label: "Format",
        value: "Bathing bar in tin"
      },
      {
        label: "Key ingredients",
        value: "Lemon Oil · Glycerin · Vitamin E · Coconut Oil"
      },
      {
        label: "On pack",
        value: "Brightens · Refreshes · Invigorates"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 35
  },
  {
    id: "co2-036",
    slug: "mint-cool-herbal-bar",
    name: "Mint Cool Herbal Bar",
    subtitle: "Cooling bathing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "Mint and peppermint for a cool, refreshing wash.",
    description: "A pale mint bar with mint oil, peppermint extract, glycerin, vitamin E and coconut oil. It cools, refreshes and soothes.",
    lede: "For the hottest afternoons.",
    story: [
      "Mint oil and peppermint extract leave a cool tingle that lasts after the shower. Glycerin and coconut oil keep the lather soft.",
      "Every bar is embossed with the CO2 mark and comes in a keepsake tin."
    ],
    benefits: [
      {
        title: "Cools",
        text: "A lasting cool tingle."
      },
      {
        title: "Refreshes",
        text: "Mint for a clean feeling."
      },
      {
        title: "Soothes",
        text: "A comforting finish on warm skin."
      }
    ],
    ingredients: [
      {
        name: "Mint Oil",
        note: "Cooling essential oil"
      },
      {
        name: "Peppermint Extract",
        note: "Fresh, cooling herb"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Coconut Oil",
        note: "Lathering oil"
      }
    ],
    keyIngredients: [
      "glycerin",
      "antioxidants"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "100 g / 3.52 oz.",
    price: 260,
    compareAtPrice: null,
    images: [
      "mint-cool-herbal-bar-1",
      "mint-cool-herbal-bar-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "glycerin",
      "antioxidants"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Bar",
    finish: "Cool",
    forWho: "Hot weather and post-workout showers.",
    specs: [
      {
        label: "Format",
        value: "Bathing bar in tin"
      },
      {
        label: "Key ingredients",
        value: "Mint Oil · Peppermint Extract · Glycerin · Vitamin E · Coconut Oil"
      },
      {
        label: "On pack",
        value: "Cools · Refreshes · Soothes"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 36
  },
  {
    id: "co2-037",
    slug: "neem-purify-herbal-bar",
    name: "Neem Purify Herbal Bar",
    subtitle: "Purifying bathing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "Neem extract with peppermint. Purifies and balances.",
    description: "A deep green bar with neem extract, glycerin, vitamin E, coconut oil and peppermint extract. It purifies, balances and protects.",
    lede: "Neem is the most trusted leaf in Indian skincare, and this is its bar.",
    story: [
      "Neem extract gives the bar its purifying character, peppermint a fresh lift, and glycerin and coconut oil a soft lather.",
      "Every bar is embossed with the CO2 mark and comes in a keepsake tin."
    ],
    benefits: [
      {
        title: "Purifies",
        text: "Neem for a clean, clear feeling."
      },
      {
        title: "Balances",
        text: "Suits oily and combination skin."
      },
      {
        title: "Protects",
        text: "Glycerin and vitamin E keep skin comfortable."
      }
    ],
    ingredients: [
      {
        name: "Neem Extract",
        note: "Clarifying herbal leaf"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Coconut Oil",
        note: "Lathering oil"
      },
      {
        name: "Peppermint Extract",
        note: "Fresh herb"
      }
    ],
    keyIngredients: [
      "neem",
      "glycerin",
      "antioxidants"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "100 g / 3.52 oz.",
    price: 260,
    compareAtPrice: null,
    images: [
      "neem-purify-herbal-bar-1",
      "neem-purify-herbal-bar-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "neem",
      "glycerin",
      "antioxidants"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Bar",
    finish: "Clean",
    forWho: "Oily and combination skin that wants a purifying daily bar.",
    specs: [
      {
        label: "Format",
        value: "Bathing bar in tin"
      },
      {
        label: "Key ingredients",
        value: "Neem Extract · Glycerin · Vitamin E · Coconut Oil · Peppermint Extract"
      },
      {
        label: "On pack",
        value: "Purifies · Balances · Protects"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 37
  },
  {
    id: "co2-038",
    slug: "sandal-glow-herbal-bar",
    name: "Sandal Glow Herbal Bar",
    subtitle: "Nourishing bathing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "Sandalwood oil and turmeric. Nourishes and brightens.",
    description: "An amber bar with sandalwood oil, glycerin, vitamin E, coconut oil and turmeric extract. It nourishes, brightens and soothes.",
    lede: "Sandalwood and turmeric, the classic Indian complexion pairing, in a bar.",
    story: [
      "Sandalwood oil gives the bar its warm, woody scent, turmeric extract its golden colour and radiant character. Glycerin and coconut oil keep the lather soft.",
      "Every bar is embossed with the CO2 mark and comes in a keepsake tin."
    ],
    benefits: [
      {
        title: "Nourishes",
        text: "A rich, comforting lather."
      },
      {
        title: "Brightens",
        text: "Turmeric and sandalwood help skin look radiant."
      },
      {
        title: "Soothes",
        text: "A warm, calming scent."
      }
    ],
    ingredients: [
      {
        name: "Sandalwood Oil",
        note: "Warm woody oil"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Coconut Oil",
        note: "Lathering oil"
      },
      {
        name: "Turmeric Extract",
        note: "Golden root"
      }
    ],
    keyIngredients: [
      "sandalwood",
      "turmeric",
      "glycerin"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "100 g / 3.52 oz.",
    price: 280,
    compareAtPrice: null,
    images: [
      "sandal-glow-herbal-bar-1",
      "sandal-glow-herbal-bar-2"
    ],
    cutout: "sandal-glow-herbal-bar",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "radiance",
      "sandalwood",
      "turmeric",
      "glycerin"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Bar",
    finish: "Warm",
    forWho: "Anyone who loves warm, woody scents.",
    specs: [
      {
        label: "Format",
        value: "Bathing bar in tin"
      },
      {
        label: "Key ingredients",
        value: "Sandalwood Oil · Glycerin · Vitamin E · Coconut Oil · Turmeric Extract"
      },
      {
        label: "On pack",
        value: "Nourishes · Brightens · Soothes"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 38
  },
  {
    id: "co2-039",
    slug: "goat-milk-herbal-bar",
    name: "Goat Milk Herbal Bar",
    subtitle: "Nourishing bathing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "Goat milk, olive oil and shea butter. Nourishes and hydrates.",
    description: "A creamy white bar with goat milk, glycerin, vitamin E, coconut oil, olive oil and shea butter. It nourishes, soothes and hydrates.",
    lede: "The richest bar in the herbal collection.",
    story: [
      "Goat milk, olive oil and shea butter make this the most nourishing bar in the collection, with glycerin and coconut oil for a soft lather.",
      "Every bar is embossed with the CO2 mark and comes in a keepsake tin."
    ],
    benefits: [
      {
        title: "Nourishes",
        text: "Goat milk and shea butter."
      },
      {
        title: "Soothes",
        text: "A gentle, creamy wash."
      },
      {
        title: "Hydrates",
        text: "Glycerin and olive oil keep skin soft."
      }
    ],
    ingredients: [
      {
        name: "Goat Milk",
        note: "Rich, creamy milk"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Coconut Oil",
        note: "Lathering oil"
      },
      {
        name: "Olive Oil",
        note: "Nourishing oil"
      },
      {
        name: "Shea Butter",
        note: "Rich, softening butter"
      }
    ],
    keyIngredients: [
      "glycerin",
      "antioxidants"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "100 g / 3.52 oz.",
    price: 280,
    compareAtPrice: null,
    images: [
      "goat-milk-herbal-bar-1",
      "goat-milk-herbal-bar-2"
    ],
    cutout: "goat-milk-herbal-bar",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "hydration",
      "glycerin",
      "antioxidants"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Bar",
    finish: "Creamy",
    forWho: "Dry and sensitive skin.",
    specs: [
      {
        label: "Format",
        value: "Bathing bar in tin"
      },
      {
        label: "Key ingredients",
        value: "Goat Milk · Glycerin · Vitamin E · Coconut Oil · Olive Oil · Shea Butter"
      },
      {
        label: "On pack",
        value: "Nourishes · Soothes · Hydrates"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 39
  },
  {
    id: "co2-059",
    slug: "beetroot-soap",
    name: "Beetroot Soap",
    subtitle: "Gentle & revitalizing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "Beetroot extract, coconut oil and glycerin. Antioxidant, rejuvenating, revitalizing.",
    description: "A translucent beetroot-red bathing bar with beetroot extract, coconut oil and glycerin on a soap base, embossed with the CO2 mark.",
    lede: "A gentle, revitalizing bar in a deep beetroot red.",
    story: [
      "Beetroot extract, coconut oil (Cocos nucifera) and glycerin on a soap base — the ingredients printed on the lid.",
      "The pack describes it as antioxidant, rejuvenating and revitalizing."
    ],
    benefits: [
      {
        title: "Antioxidant",
        text: "As described on the pack."
      },
      {
        title: "Rejuvenating",
        text: "As described on the pack."
      },
      {
        title: "Revitalizing",
        text: "A gentle, revitalizing bar."
      }
    ],
    ingredients: [
      {
        name: "Beetroot Extract",
        note: "Plant extract"
      },
      {
        name: "Coconut Oil (Cocos nucifera)",
        note: "Lathering oil"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Soap Base",
        note: "Cleansing base"
      }
    ],
    keyIngredients: [
      "glycerin",
      "antioxidants"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "75 g / 2.65 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "beetroot-soap-2"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "glycerin",
      "antioxidants"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Bar",
    finish: "",
    forWho: "Anyone who wants a gentle, revitalizing bathing bar.",
    specs: [
      {
        label: "Format",
        value: "Bathing bar"
      },
      {
        label: "Key ingredients",
        value: "Beetroot Extract · Coconut Oil (Cocos nucifera) · Glycerin · Soap Base"
      },
      {
        label: "On pack",
        value: "Gentle & Revitalizing Bar · Antioxidant · Rejuvenating · Revitalizing"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 40.5
  },
  {
    id: "co2-072",
    slug: "kumkumadi-soap",
    name: "Kumkumadi Soap",
    subtitle: "Bathing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "A kumkumadi oil, saffron and turmeric bathing bar — for radiance, brightening and rejuvenating.",
    description: "Kumkumadi Soap with Kumkumadi Oil, Saffron, Turmeric, Coconut Oil, Glycerin, Vitamin E and Soap Base — the ingredients printed on the pack.",
    lede: "Bathing bar.",
    story: [
      "Key ingredients on the pack: Kumkumadi Oil · Saffron · Turmeric · Coconut Oil · Glycerin · Vitamin E · Soap Base.",
      "The pack describes it as radiance, brightening and rejuvenating."
    ],
    benefits: [
      {
        title: "Radiance",
        text: "As printed on the pack."
      },
      {
        title: "Brightening",
        text: "As printed on the pack."
      },
      {
        title: "Rejuvenating",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Kumkumadi Oil",
        note: "Traditional oil blend"
      },
      {
        name: "Saffron",
        note: "Botanical"
      },
      {
        name: "Turmeric",
        note: "Botanical"
      },
      {
        name: "Coconut Oil",
        note: "Lathering oil"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Soap Base",
        note: "Cleansing base"
      }
    ],
    keyIngredients: [
      "saffron",
      "turmeric",
      "glycerin",
      "antioxidants"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "75 g / 2.65 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "kumkumadi-soap-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "bath-bars",
      "saffron",
      "turmeric",
      "glycerin",
      "antioxidants"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Bar",
    finish: "",
    forWho: "Anyone who wants a simple, gentle bathing bar.",
    specs: [
      {
        label: "Format",
        value: "Bar"
      },
      {
        label: "Key ingredients",
        value: "Kumkumadi Oil · Saffron · Turmeric · Coconut Oil · Glycerin · Vitamin E · Soap Base"
      },
      {
        label: "On pack",
        value: "Radiance · Brightening · Rejuvenating"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 40.6
  },
  {
    id: "co2-073",
    slug: "neem-soap",
    name: "Neem Soap",
    subtitle: "Herbal soap",
    category: "body",
    type: "bath-bars",
    shortDescription: "A 75 g neem bathing bar — purifying, balancing and protecting.",
    description: "Neem Soap with Neem, Coconut Oil, Glycerin and Soap Base — the ingredients printed on the pack.",
    lede: "Neem, coconut oil and glycerin in a 75 g herbal bar.",
    story: [
      "Key ingredients on the pack: Neem · Coconut Oil · Glycerin · Soap Base.",
      "The pack describes it as purifying, balancing and protecting."
    ],
    benefits: [
      {
        title: "Purifying",
        text: "As printed on the pack."
      },
      {
        title: "Balancing",
        text: "As printed on the pack."
      },
      {
        title: "Protecting",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Neem",
        note: "Botanical"
      },
      {
        name: "Coconut Oil",
        note: "Lathering oil"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Soap Base",
        note: "Cleansing base"
      }
    ],
    keyIngredients: [
      "neem",
      "glycerin"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "75 g / 2.65 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "neem-soap-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "bath-bars",
      "neem",
      "glycerin"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Bar",
    finish: "",
    forWho: "Anyone who wants a simple neem bathing bar.",
    specs: [
      {
        label: "Format",
        value: "Bar"
      },
      {
        label: "Key ingredients",
        value: "Neem · Coconut Oil · Glycerin · Soap Base"
      },
      {
        label: "On pack",
        value: "Herbal Soap · Purifying · Balancing · Protecting"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 40.7
  },
  {
    id: "co2-074",
    slug: "papaya-soap",
    name: "Papaya Soap",
    subtitle: "Gentle & revitalizing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "A papaya extract bathing bar that brightens, exfoliates and rejuvenates.",
    description: "Papaya Soap with Papaya Extract, Soap Base and Sodium Benzoate — the ingredients printed on the pack.",
    lede: "Papaya extract in a gentle, revitalizing bar.",
    story: [
      "Key ingredients on the pack: Papaya Extract · Soap Base · Sodium Benzoate.",
      "The pack describes it as brightens, exfoliates and rejuvenates."
    ],
    benefits: [
      {
        title: "Brightens",
        text: "As printed on the pack."
      },
      {
        title: "Exfoliates",
        text: "As printed on the pack."
      },
      {
        title: "Rejuvenates",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Papaya Extract",
        note: "Fruit extract"
      },
      {
        name: "Soap Base",
        note: "Cleansing base"
      },
      {
        name: "Sodium Benzoate",
        note: "Preservative"
      }
    ],
    keyIngredients: [],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "75 g / 2.65 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "papaya-soap-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "bath-bars"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Bar",
    finish: "",
    forWho: "Anyone who wants a papaya bathing bar.",
    specs: [
      {
        label: "Format",
        value: "Bar"
      },
      {
        label: "Key ingredients",
        value: "Papaya Extract · Soap Base · Sodium Benzoate"
      },
      {
        label: "On pack",
        value: "Gentle & Revitalizing Bar · Brightens · Exfoliates · Rejuvenates"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 40.8
  },
  {
    id: "co2-075",
    slug: "red-wine-soap",
    name: "Red Wine Soap",
    subtitle: "Gentle & revitalizing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "A red wine and grape extract bathing bar — antioxidant, rejuvenating and revitalizing.",
    description: "Red Wine Soap with Red Wine / Grape Extract, Coconut Oil (Cocos nucifera), Glycerin and Soap Base — the ingredients printed on the pack.",
    lede: "Red wine and grape extract with coconut oil and glycerin in a deep red bar.",
    story: [
      "Key ingredients on the pack: Red Wine / Grape Extract · Coconut Oil (Cocos nucifera) · Glycerin · Soap Base.",
      "The pack describes it as antioxidant, rejuvenating and revitalizing."
    ],
    benefits: [
      {
        title: "Antioxidant",
        text: "As printed on the pack."
      },
      {
        title: "Rejuvenating",
        text: "As printed on the pack."
      },
      {
        title: "Revitalizing",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Red Wine / Grape Extract",
        note: "Fruit extract"
      },
      {
        name: "Coconut Oil (Cocos nucifera)",
        note: "Lathering oil"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Soap Base",
        note: "Cleansing base"
      }
    ],
    keyIngredients: [
      "glycerin",
      "antioxidants"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "75 g / 2.65 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "red-wine-soap-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "bath-bars",
      "glycerin",
      "antioxidants"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Bar",
    finish: "",
    forWho: "Anyone who wants a red wine bathing bar.",
    specs: [
      {
        label: "Format",
        value: "Bar"
      },
      {
        label: "Key ingredients",
        value: "Red Wine / Grape Extract · Coconut Oil (Cocos nucifera) · Glycerin · Soap Base"
      },
      {
        label: "On pack",
        value: "Gentle & Revitalizing Bar · Antioxidant · Rejuvenating · Revitalizing"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 40.9
  },
  {
    id: "co2-041",
    slug: "aloe-nourish-shampoo",
    name: "Aloe Nourish Shampoo",
    subtitle: "Aloe vera shampoo",
    category: "hair",
    type: "hair-care",
    shortDescription: "Aloe vera for healthy, nourished hair.",
    description: "A soft aloe vera shampoo that cleanses gently and leaves hair healthy, soft and nourished.",
    lede: "An everyday shampoo for hair that wants to be left alone.",
    story: [
      "Aloe vera keeps the wash gentle on the scalp and leaves hair soft and manageable. The pack lists aloe vera, shampoo base, sodium benzoate and sodium methyl paraben.",
      "A 100 ml travel bottle is pictured alongside."
    ],
    benefits: [
      {
        title: "Cleanses",
        text: "A gentle everyday wash."
      },
      {
        title: "Nourishes",
        text: "Aloe vera leaves hair soft."
      },
      {
        title: "Healthy-looking",
        text: "Hair looks healthy and full of life."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Soothing, conditioning"
      },
      {
        name: "Shampoo Base",
        note: "Gentle cleansing base"
      },
      {
        name: "Sodium Benzoate",
        note: "Preservative"
      },
      {
        name: "Sodium Methyl Paraben",
        note: "Preservative"
      }
    ],
    keyIngredients: [
      "aloe"
    ],
    howToUse: [
      "Wet hair thoroughly.",
      "Massage into scalp and lather.",
      "Rinse thoroughly."
    ],
    size: "200 ml",
    price: 480,
    compareAtPrice: null,
    images: [
      "aloe-nourish-shampoo-1",
      "aloe-nourish-shampoo-2"
    ],
    cutout: "aloe-nourish-shampoo",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "aloe"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Shampoo",
    finish: "Soft",
    forWho: "All hair types, for everyday washing.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Aloe Vera · Shampoo Base · Sodium Benzoate · Sodium Methyl Paraben"
      },
      {
        label: "On pack",
        value: "For healthy, nourished hair"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 41
  },
  {
    id: "co2-076",
    slug: "sandal-soap",
    name: "Sandal Soap",
    subtitle: "Herbal soap",
    category: "body",
    type: "bath-bars",
    shortDescription: "A 75 g sandalwood bathing bar that nourishes, brightens and soothes.",
    description: "Sandal Soap with Sandalwood (Santalum album), Coconut Oil (Cocos nucifera), Glycerin and Soap Base — the ingredients printed on the pack.",
    lede: "Sandalwood with coconut oil and glycerin in a 75 g herbal bar.",
    story: [
      "Key ingredients on the pack: Sandalwood (Santalum album) · Coconut Oil (Cocos nucifera) · Glycerin · Soap Base.",
      "The pack describes it as nourishes, brightens and soothes."
    ],
    benefits: [
      {
        title: "Nourishes",
        text: "As printed on the pack."
      },
      {
        title: "Brightens",
        text: "As printed on the pack."
      },
      {
        title: "Soothes",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Sandalwood (Santalum album)",
        note: "Botanical"
      },
      {
        name: "Coconut Oil (Cocos nucifera)",
        note: "Lathering oil"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Soap Base",
        note: "Cleansing base"
      }
    ],
    keyIngredients: [
      "sandalwood",
      "glycerin"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "75 g / 2.65 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "sandal-soap-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "bath-bars",
      "sandalwood",
      "glycerin"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Bar",
    finish: "",
    forWho: "Anyone who loves the scent of sandalwood in a bathing bar.",
    specs: [
      {
        label: "Format",
        value: "Bar"
      },
      {
        label: "Key ingredients",
        value: "Sandalwood (Santalum album) · Coconut Oil (Cocos nucifera) · Glycerin · Soap Base"
      },
      {
        label: "On pack",
        value: "Herbal Soap · Nourishes · Brightens · Soothes"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 41
  },
  {
    id: "co2-077",
    slug: "sunni-pindi-soap",
    name: "Sunni Pindi Soap",
    subtitle: "Herbal soap",
    category: "body",
    type: "bath-bars",
    shortDescription: "A traditional sunni pindi bar that exfoliates, brightens and purifies.",
    description: "Sunni Pindi Soap with Green Gram Flour (Phaseolus aureus), Chickpea Flour (Cicer arietinum), Turmeric (Curcuma longa), Sandalwood Powder (Santalum album), Fenugreek (Trigonella foenum-graecum), Multani Mitti, Rose Petal Powder and Neem (Azadirachta indica) — the ingredients printed on the pack.",
    lede: "Green gram, chickpea flour, turmeric, sandalwood and more — the traditional sunni pindi blend in a bar.",
    story: [
      "Key ingredients on the pack: Green Gram Flour (Phaseolus aureus) · Chickpea Flour (Cicer arietinum) · Turmeric (Curcuma longa) · Sandalwood Powder (Santalum album) · Fenugreek (Trigonella foenum-graecum) · Multani Mitti · Rose Petal Powder · Neem (Azadirachta indica).",
      "The pack describes it as exfoliates, brightens and purifies."
    ],
    benefits: [
      {
        title: "Exfoliates",
        text: "As printed on the pack."
      },
      {
        title: "Brightens",
        text: "As printed on the pack."
      },
      {
        title: "Purifies",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Green Gram Flour (Phaseolus aureus)",
        note: "Traditional flour"
      },
      {
        name: "Chickpea Flour (Cicer arietinum)",
        note: "Traditional flour"
      },
      {
        name: "Turmeric (Curcuma longa)",
        note: "Botanical"
      },
      {
        name: "Sandalwood Powder (Santalum album)",
        note: "Botanical"
      },
      {
        name: "Fenugreek (Trigonella foenum-graecum)",
        note: "Botanical"
      },
      {
        name: "Multani Mitti",
        note: "Clay"
      },
      {
        name: "Rose Petal Powder",
        note: "Botanical"
      },
      {
        name: "Neem (Azadirachta indica)",
        note: "Botanical"
      }
    ],
    keyIngredients: [
      "turmeric",
      "sandalwood",
      "neem"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "100 g / 3.52 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "sunni-pindi-soap-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "bath-bars",
      "turmeric",
      "sandalwood",
      "neem"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Bar",
    finish: "",
    forWho: "Anyone who grew up with sunni pindi and wants it in a bar.",
    specs: [
      {
        label: "Format",
        value: "Bar"
      },
      {
        label: "Key ingredients",
        value: "Green Gram Flour (Phaseolus aureus) · Chickpea Flour (Cicer arietinum) · Turmeric (Curcuma longa) · Sandalwood Powder (Santalum album) · Fenugreek (Trigonella foenum-graecum) · Multani Mitti · Rose Petal Powder · Neem (Azadirachta indica)"
      },
      {
        label: "On pack",
        value: "Herbal Soap · Exfoliates · Brightens · Purifies"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 41.1
  },
  {
    id: "co2-078",
    slug: "turmeric-soap",
    name: "Turmeric Soap",
    subtitle: "Gentle & revitalizing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "A turmeric root bathing bar that brightens, purifies and soothes.",
    description: "Turmeric Soap with Turmeric Root Extract, Coconut Oil, Glycerin and Soap Base — the ingredients printed on the pack.",
    lede: "Turmeric root extract with coconut oil and glycerin in a golden bar.",
    story: [
      "Key ingredients on the pack: Turmeric Root Extract · Coconut Oil · Glycerin · Soap Base.",
      "The pack describes it as brightens, purifies and soothes."
    ],
    benefits: [
      {
        title: "Brightens",
        text: "As printed on the pack."
      },
      {
        title: "Purifies",
        text: "As printed on the pack."
      },
      {
        title: "Soothes",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Turmeric Root Extract",
        note: "Botanical"
      },
      {
        name: "Coconut Oil",
        note: "Lathering oil"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Soap Base",
        note: "Cleansing base"
      }
    ],
    keyIngredients: [
      "turmeric",
      "glycerin"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "75 g / 2.65 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "turmeric-soap-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "bath-bars",
      "turmeric",
      "glycerin"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Bar",
    finish: "",
    forWho: "Anyone who wants a turmeric bathing bar.",
    specs: [
      {
        label: "Format",
        value: "Bar"
      },
      {
        label: "Key ingredients",
        value: "Turmeric Root Extract · Coconut Oil · Glycerin · Soap Base"
      },
      {
        label: "On pack",
        value: "Gentle & Revitalizing Bar · Brightens · Purifies · Soothes"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 41.2
  },
  {
    id: "co2-083",
    slug: "coffee-soap",
    name: "Coffee Soap",
    subtitle: "Gentle & revitalizing bar",
    category: "body",
    type: "bath-bars",
    shortDescription: "A coffee extract bathing bar — antioxidant, rejuvenating and revitalizing.",
    description: "Coffee Soap with Coffee Extract, Coconut Oil (Cocos nucifera), Glycerin and Soap Base — the ingredients printed on the pack.",
    lede: "A deep amber bathing bar made with coffee extract.",
    story: [
      "Key ingredients on the pack: Coffee Extract · Coconut Oil (Cocos nucifera) · Glycerin · Soap Base.",
      "The pack describes it as antioxidant, rejuvenating and revitalizing."
    ],
    benefits: [
      {
        title: "Antioxidant",
        text: "As printed on the pack."
      },
      {
        title: "Rejuvenating",
        text: "As printed on the pack."
      },
      {
        title: "Revitalizing",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Coffee Extract",
        note: "Botanical"
      },
      {
        name: "Coconut Oil (Cocos nucifera)",
        note: "Lathering oil"
      },
      {
        name: "Glycerin",
        note: "Humectant"
      },
      {
        name: "Soap Base",
        note: "Cleansing base"
      }
    ],
    keyIngredients: [
      "glycerin"
    ],
    howToUse: [
      "Wet the bar and skin.",
      "Lather and massage.",
      "Rinse. Keep the bar dry between uses."
    ],
    size: "75 g / 2.65 oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "coffee-soap-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "bath-bars",
      "coffee",
      "glycerin"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Bar",
    finish: "",
    forWho: "Anyone who wants a coffee bathing bar in their daily routine.",
    specs: [
      {
        label: "Format",
        value: "Bar"
      },
      {
        label: "Key ingredients",
        value: "Coffee Extract · Coconut Oil (Cocos nucifera) · Glycerin · Soap Base"
      },
      {
        label: "On pack",
        value: "Gentle & Revitalizing Bar · Antioxidant · Rejuvenating · Revitalizing"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 41.3
  },
  {
    id: "co2-079",
    slug: "onion-shampoo",
    name: "Onion Shampoo",
    subtitle: "Gentle scalp & hair cleansing",
    category: "hair",
    type: "hair-care",
    shortDescription: "An onion extract, aloe vera and amla shampoo that strengthens, promotes growth and reduces hair fall.",
    description: "Onion Shampoo with Onion Extract, Aloe Vera, Amla and Shampoo Base — the ingredients printed on the pack.",
    lede: "Onion extract, aloe vera and amla in a gentle cleansing shampoo.",
    story: [
      "Key ingredients on the pack: Onion Extract · Aloe Vera · Amla · Shampoo Base.",
      "The pack describes it as strengthens, promotes growth and reduces hair fall."
    ],
    benefits: [
      {
        title: "Strengthens",
        text: "As printed on the pack."
      },
      {
        title: "Promotes Growth",
        text: "As printed on the pack."
      },
      {
        title: "Reduces Hair Fall",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Onion Extract",
        note: "Plant extract"
      },
      {
        name: "Aloe Vera",
        note: "Plant extract"
      },
      {
        name: "Amla",
        note: "Botanical"
      },
      {
        name: "Shampoo Base",
        note: "Cleansing base"
      }
    ],
    keyIngredients: [
      "aloe",
      "amla"
    ],
    howToUse: [
      "Massage into wet hair and scalp.",
      "Lather and leave for a minute.",
      "Rinse thoroughly."
    ],
    size: "250 ml / 8.45 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "onion-shampoo-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "hair-care",
      "aloe",
      "amla"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Shampoo",
    finish: "",
    forWho: "Anyone who wants an onion shampoo for regular wash days.",
    specs: [
      {
        label: "Format",
        value: "Shampoo"
      },
      {
        label: "Key ingredients",
        value: "Onion Extract · Aloe Vera · Amla · Shampoo Base"
      },
      {
        label: "On pack",
        value: "Gentle Scalp & Hair Cleansing · Strengthens · Promotes Growth · Reduces Hair Fall"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 41.5
  },
  {
    id: "co2-080",
    slug: "herbal-shampoo",
    name: "Shampoo – Herbal",
    subtitle: "Gentle scalp & hair cleansing",
    category: "hair",
    type: "hair-care",
    shortDescription: "A hibiscus, bhringraj, amla and aloe vera shampoo that strengthens, promotes growth and reduces hair fall.",
    description: "Shampoo – Herbal with Aloe Vera, Hibiscus, Amla and Bhringraj — the ingredients printed on the pack.",
    lede: "Hibiscus, bhringraj, amla and aloe vera for gentle scalp and hair cleansing.",
    story: [
      "Key ingredients on the pack: Aloe Vera · Hibiscus · Amla · Bhringraj.",
      "The pack describes it as strengthens, promotes growth and reduces hair fall."
    ],
    benefits: [
      {
        title: "Strengthens",
        text: "As printed on the pack."
      },
      {
        title: "Promotes Growth",
        text: "As printed on the pack."
      },
      {
        title: "Reduces Hair Fall",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Aloe Vera",
        note: "Plant extract"
      },
      {
        name: "Hibiscus",
        note: "Botanical"
      },
      {
        name: "Amla",
        note: "Botanical"
      },
      {
        name: "Bhringraj",
        note: "Botanical"
      }
    ],
    keyIngredients: [
      "aloe",
      "hibiscus",
      "amla"
    ],
    howToUse: [
      "Massage into wet hair and scalp.",
      "Lather and leave for a minute.",
      "Rinse thoroughly."
    ],
    size: "250 ml / 8.45 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "herbal-shampoo-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "hair-care",
      "aloe",
      "hibiscus",
      "amla"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Shampoo",
    finish: "",
    forWho: "Anyone who prefers a herbal shampoo with hibiscus and bhringraj.",
    specs: [
      {
        label: "Format",
        value: "Shampoo"
      },
      {
        label: "Key ingredients",
        value: "Aloe Vera · Hibiscus · Amla · Bhringraj"
      },
      {
        label: "On pack",
        value: "Gentle Scalp & Hair Cleansing · Strengthens · Promotes Growth · Reduces Hair Fall"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 41.6
  },
  {
    id: "co2-081",
    slug: "shikakai-shampoo",
    name: "Shikakai Shampoo",
    subtitle: "Gentle scalp & hair cleansing",
    category: "hair",
    type: "hair-care",
    shortDescription: "A shikakai, reetha and amla shampoo that strengthens, promotes growth and reduces hair fall.",
    description: "Shikakai Shampoo with Shikakai, Amla, Reetha and Aloe Vera — the ingredients printed on the pack.",
    lede: "Shikakai and reetha, the traditional hair-washing pods, with amla and aloe vera.",
    story: [
      "Key ingredients on the pack: Shikakai · Amla · Reetha · Aloe Vera.",
      "The pack describes it as strengthens, promotes growth and reduces hair fall."
    ],
    benefits: [
      {
        title: "Strengthens",
        text: "As printed on the pack."
      },
      {
        title: "Promotes Growth",
        text: "As printed on the pack."
      },
      {
        title: "Reduces Hair Fall",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Shikakai",
        note: "Botanical"
      },
      {
        name: "Amla",
        note: "Botanical"
      },
      {
        name: "Reetha",
        note: "Botanical"
      },
      {
        name: "Aloe Vera",
        note: "Plant extract"
      }
    ],
    keyIngredients: [
      "amla",
      "aloe"
    ],
    howToUse: [
      "Massage into wet hair and scalp.",
      "Lather and leave for a minute.",
      "Rinse thoroughly."
    ],
    size: "250 ml / 8.45 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "shikakai-shampoo-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "hair-care",
      "amla",
      "aloe"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Shampoo",
    finish: "",
    forWho: "Anyone who likes the traditional shikakai and reetha wash.",
    specs: [
      {
        label: "Format",
        value: "Shampoo"
      },
      {
        label: "Key ingredients",
        value: "Shikakai · Amla · Reetha · Aloe Vera"
      },
      {
        label: "On pack",
        value: "Gentle Scalp & Hair Cleansing · Strengthens · Promotes Growth · Reduces Hair Fall"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 41.7
  },
  {
    id: "co2-043",
    slug: "scalp-clear-shampoo",
    name: "Scalp Clear Shampoo",
    subtitle: "Anti-dandruff shampoo",
    category: "hair",
    type: "hair-care",
    shortDescription: "Neem, tea tree, aloe and amla for a flake-free scalp.",
    description: "An anti-dandruff shampoo with neem, tea tree oil, aloe vera and amla. It cleanses the scalp and helps keep flakes away.",
    lede: "A scalp shampoo that clears flakes without stripping your hair.",
    story: [
      "Neem and tea tree are the clarifying pair, aloe vera soothes the scalp and amla keeps the lengths healthy-looking.",
      "Use two or three times a week, or alternate with Aloe Nourish Shampoo. A 100 ml bottle is pictured alongside."
    ],
    benefits: [
      {
        title: "Flake-free",
        text: "Helps keep visible flakes away."
      },
      {
        title: "Soothes",
        text: "Aloe vera calms the scalp."
      },
      {
        title: "Healthy scalp",
        text: "Neem and tea tree for a clean scalp."
      }
    ],
    ingredients: [
      {
        name: "Neem",
        note: "Clarifying herbal leaf"
      },
      {
        name: "Tea Tree Oil",
        note: "Clean, herbal essential oil"
      },
      {
        name: "Aloe Vera",
        note: "Soothing"
      },
      {
        name: "Amla",
        note: "Indian gooseberry"
      }
    ],
    keyIngredients: [
      "neem",
      "teatree",
      "aloe",
      "amla"
    ],
    howToUse: [
      "Wet hair.",
      "Massage into scalp for a minute and lather.",
      "Rinse thoroughly."
    ],
    size: "200 ml",
    price: 520,
    compareAtPrice: null,
    images: [
      "scalp-clear-shampoo-1",
      "scalp-clear-shampoo-2"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "cleansing",
      "treatments",
      "neem",
      "teatree",
      "aloe",
      "amla"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Shampoo",
    finish: "Clean",
    forWho: "Scalps prone to dryness and flakes.",
    specs: [
      {
        label: "Format",
        value: "Squeeze bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Neem · Tea Tree Oil · Aloe Vera · Amla"
      },
      {
        label: "On pack",
        value: "For flake-free & healthy scalp"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 43
  },
  {
    id: "co2-044",
    slug: "scalp-clear-treatment-gel",
    name: "Scalp Clear Treatment Gel",
    subtitle: "Soothing & clarifying scalp treatment",
    category: "hair",
    type: "scalp",
    shortDescription: "Tea tree, salicylic acid and piroctone olamine for the scalp.",
    description: "A soothing, clarifying scalp gel with tea tree oil, salicylic acid, aloe vera gel, piroctone olamine and rosemary extract. It soothes itch, helps clear flakes and balances the scalp.",
    lede: "The most focused product in the scalp range, for when flakes need more than a shampoo.",
    story: [
      "Salicylic acid loosens flakes, piroctone olamine and tea tree keep the scalp clear, rosemary adds a fresh herbal note and aloe vera soothes.",
      "Apply to the scalp before washing, or between washes where it's needed."
    ],
    benefits: [
      {
        title: "Soothes",
        text: "Calms an itchy-feeling scalp."
      },
      {
        title: "Clears flakes",
        text: "Salicylic acid and piroctone olamine."
      },
      {
        title: "Balances",
        text: "Leaves the scalp comfortable."
      }
    ],
    ingredients: [
      {
        name: "Tea Tree Oil",
        note: "Clarifying essential oil"
      },
      {
        name: "Salicylic Acid",
        note: "Loosens flakes"
      },
      {
        name: "Aloe Vera Gel",
        note: "Soothing base"
      },
      {
        name: "Piroctone Olamine",
        note: "Anti-dandruff ingredient"
      },
      {
        name: "Rosemary Extract",
        note: "Fresh, herbal"
      }
    ],
    keyIngredients: [
      "teatree",
      "aloe"
    ],
    howToUse: [
      "Part hair and apply directly to the scalp.",
      "Massage gently.",
      "Leave on for 10 minutes before washing, or as directed."
    ],
    size: "50 g / 1.76 oz.",
    price: 560,
    compareAtPrice: null,
    images: [
      "scalp-clear-treatment-gel-1"
    ],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "treatments",
      "teatree",
      "aloe"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Gel",
    finish: "Non-greasy",
    forWho: "Scalps with persistent flakes.",
    specs: [
      {
        label: "Format",
        value: "Jar"
      },
      {
        label: "Key ingredients",
        value: "Tea Tree Oil · Salicylic Acid · Aloe Vera Gel · Piroctone Olamine · Rosemary Extract"
      },
      {
        label: "On pack",
        value: "Relieves itch · Fights flakes · Balances scalp"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 44
  },
  {
    id: "co2-046",
    slug: "scalp-clear-hair-oil",
    name: "Scalp Clear Hair Oil",
    subtitle: "Anti-dandruff hair oil",
    category: "hair",
    type: "hair-oils",
    shortDescription: "Olive, walnut, amla and almond oils for a flake-free scalp.",
    description: "A pre-wash hair oil of olive, walnut, amla and almond oils. It nourishes the scalp and lengths and helps keep hair healthy and flake-free.",
    lede: "Oiling before you wash is one of the oldest hair rituals there is.",
    story: [
      "Olive and almond oils nourish, walnut oil adds richness and amla oil is the classic Indian hair oil. Together they condition the scalp and help keep dryness and flakes at bay.",
      "Massage in an hour before washing, or overnight. A smaller bottle is pictured alongside."
    ],
    benefits: [
      {
        title: "Nourishes",
        text: "Four oils for scalp and lengths."
      },
      {
        title: "Flake-free",
        text: "Helps keep a dry, flaky scalp in check."
      },
      {
        title: "Healthy hair",
        text: "Softer, shinier lengths."
      }
    ],
    ingredients: [
      {
        name: "Olive Oil",
        note: "Nourishing oil"
      },
      {
        name: "Walnut Oil",
        note: "Rich oil"
      },
      {
        name: "Amla Oil",
        note: "Classic Indian hair oil"
      },
      {
        name: "Almond Oil",
        note: "Softening oil"
      }
    ],
    keyIngredients: [
      "amla",
      "almond"
    ],
    howToUse: [
      "Warm a little oil between your palms.",
      "Massage into scalp and work through lengths.",
      "Leave for at least an hour, then shampoo."
    ],
    size: "200 ml",
    price: 520,
    compareAtPrice: null,
    images: [
      "scalp-clear-hair-oil-1",
      "scalp-clear-hair-oil-2"
    ],
    cutout: "scalp-clear-hair-oil",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "treatments",
      "ritual",
      "amla",
      "almond"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Oil",
    finish: "Glossy",
    forWho: "Dry scalps and anyone who loves a weekly oiling ritual.",
    specs: [
      {
        label: "Format",
        value: "Bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Olive Oil · Walnut Oil · Amla Oil · Almond Oil"
      },
      {
        label: "On pack",
        value: "For healthy, flake-free hair & scalp"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: true,
    featured: false,
    custom: null,
    order: 46
  },
  {
    id: "co2-082",
    slug: "onion-hair-oil",
    name: "Onion Hair Oil",
    subtitle: "Gentle scalp & hair nourishment",
    category: "hair",
    type: "hair-oils",
    shortDescription: "An onion extract hair oil with coconut, amla and almond oils that strengthens, promotes growth and reduces hair fall.",
    description: "Onion Hair Oil with Onion Extract, Coconut Oil, Amla Oil and Almond Oil — the ingredients printed on the pack.",
    lede: "Onion extract in coconut, amla and almond oils for scalp and hair nourishment.",
    story: [
      "Key ingredients on the pack: Onion Extract · Coconut Oil · Amla Oil · Almond Oil.",
      "The pack describes it as strengthens, promotes growth and reduces hair fall."
    ],
    benefits: [
      {
        title: "Strengthens",
        text: "As printed on the pack."
      },
      {
        title: "Promotes Growth",
        text: "As printed on the pack."
      },
      {
        title: "Reduces Hair Fall",
        text: "As printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Onion Extract",
        note: "Plant extract"
      },
      {
        name: "Coconut Oil",
        note: "Nourishing oil"
      },
      {
        name: "Amla Oil",
        note: "Nourishing oil"
      },
      {
        name: "Almond Oil",
        note: "Nourishing oil"
      }
    ],
    keyIngredients: [
      "amla",
      "almond"
    ],
    howToUse: [
      "Warm a little oil between your palms.",
      "Massage into the scalp and through the lengths.",
      "Leave on for at least an hour or overnight, then wash out."
    ],
    size: "100 ml / 3.38 fl. oz. · 200 ml / 6.76 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "onion-hair-oil-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "hair-oils",
      "amla",
      "almond"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Oil",
    finish: "",
    forWho: "Anyone who oils their hair before washing and wants an onion hair oil.",
    specs: [
      {
        label: "Format",
        value: "Oil"
      },
      {
        label: "Key ingredients",
        value: "Onion Extract · Coconut Oil · Amla Oil · Almond Oil"
      },
      {
        label: "On pack",
        value: "Gentle Scalp & Hair Nourishment · Strengthens · Promotes Growth · Reduces Hair Fall"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 46.5
  },
  {
    id: "co2-049",
    slug: "groom-beard-oil",
    name: "Groom Beard Oil",
    subtitle: "Beard care oil",
    category: "hair",
    type: "styling",
    shortDescription: "Olive, walnut, amla and almond oils for a soft beard and skin.",
    description: "A beard oil of olive, walnut, amla and almond oils. It softens the beard, conditions the skin beneath and helps keep both healthy and flake-free.",
    lede: "A beard is only as good as the skin under it.",
    story: [
      "Olive and almond oils soften coarse hair, walnut oil adds richness and amla oil keeps the beard looking healthy. The skin underneath stays comfortable and flake-free.",
      "A few drops a day is all it takes. A smaller bottle is pictured alongside."
    ],
    benefits: [
      {
        title: "Softens",
        text: "Coarse beard hair feels softer."
      },
      {
        title: "Conditions",
        text: "Comfortable, flake-free skin beneath."
      },
      {
        title: "Healthy-looking",
        text: "A neater, healthier-looking beard."
      }
    ],
    ingredients: [
      {
        name: "Olive Oil",
        note: "Softening oil"
      },
      {
        name: "Walnut Oil",
        note: "Rich oil"
      },
      {
        name: "Amla Oil",
        note: "Classic Indian hair oil"
      },
      {
        name: "Almond Oil",
        note: "Nourishing oil"
      }
    ],
    keyIngredients: [
      "amla",
      "almond"
    ],
    howToUse: [
      "Warm three to four drops between your palms.",
      "Massage into the beard and the skin beneath.",
      "Comb through."
    ],
    size: "50 ml",
    price: 590,
    compareAtPrice: null,
    images: [
      "groom-beard-oil-1",
      "groom-beard-oil-2"
    ],
    cutout: "groom-beard-oil",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "ritual",
      "amla",
      "almond"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Oil",
    finish: "Soft sheen",
    forWho: "Every beard, from stubble to full.",
    specs: [
      {
        label: "Format",
        value: "Bottle"
      },
      {
        label: "Ingredients on pack",
        value: "Olive Oil · Walnut Oil · Amla Oil · Almond Oil"
      },
      {
        label: "On pack",
        value: "For healthy, flake-free beard & skin"
      },
      {
        label: "Free from",
        value: "Sulfate free (as printed on pack)"
      }
    ],
    shades: [],
    bestSeller: true,
    featured: false,
    custom: null,
    order: 49
  },
  {
    id: "co2-050",
    slug: "gloss-berry-rubin",
    name: "Gloss Berry Rubin",
    subtitle: "High-shine lip gloss",
    category: "lips",
    type: "lip-gloss",
    shortDescription: "A deep berry-red gloss with a plumping finish.",
    description: "A high-shine berry-red gloss with vitamin E, jojoba oil and shea butter. It moisturizes, nourishes and never feels sticky.",
    lede: "A ripe, jewel-toned red with the depth of a stained lip and the shine of a gloss.",
    story: [
      "Vitamin E, jojoba oil and shea butter keep lips moisturized and comfortable while the colour gives a high-shine, plumping finish.",
      "Wear it alone for a glassy berry lip, or over a liner for definition."
    ],
    benefits: [
      {
        title: "High shine",
        text: "Glassy, colour-rich finish."
      },
      {
        title: "Plumping",
        text: "A fuller-looking lip."
      },
      {
        title: "Comfort",
        text: "Moisturizing and non-sticky."
      }
    ],
    ingredients: [
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Jojoba Oil",
        note: "Lightweight conditioning oil"
      },
      {
        name: "Shea Butter",
        note: "Softening butter"
      }
    ],
    keyIngredients: [
      "antioxidants"
    ],
    howToUse: [
      "Apply from the centre of the lip outwards.",
      "Build a second layer for more colour.",
      "Reapply as you like."
    ],
    size: "5 ml / 0.17 fl. oz.",
    price: 650,
    compareAtPrice: null,
    images: [
      "gloss-berry-rubin-1"
    ],
    cutout: "gloss-berry-rubin",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "ritual",
      "antioxidants"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Gloss",
    finish: "High shine",
    forWho: "Anyone who wants a confident berry lip.",
    specs: [
      {
        label: "Format",
        value: "Glass bottle with doe-foot applicator"
      },
      {
        label: "Key ingredients",
        value: "Vitamin E · Jojoba Oil · Shea Butter"
      },
      {
        label: "On pack",
        value: "High-shine color · Plumping formula · Moisturizing · Nourishing · Non-sticky"
      }
    ],
    shades: [
      {
        name: "Berry Rubin",
        hex: "#7D1F33"
      }
    ],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 50
  },
  {
    id: "co2-051",
    slug: "gloss-burgundy-spirit",
    name: "Gloss Burgundy Spirit",
    subtitle: "High-shine lip gloss",
    category: "lips",
    type: "lip-gloss",
    shortDescription: "A rich burgundy gloss with a plumping finish.",
    description: "A high-shine burgundy gloss with vitamin E, jojoba oil and shea butter. It moisturizes, nourishes and never feels sticky.",
    lede: "A wine-dark burgundy for evenings.",
    story: [
      "Vitamin E, jojoba oil and shea butter keep lips moisturized and comfortable while the colour gives a high-shine, plumping finish.",
      "Layer it for a deep, lacquered evening lip."
    ],
    benefits: [
      {
        title: "High shine",
        text: "Glassy, colour-rich finish."
      },
      {
        title: "Plumping",
        text: "A fuller-looking lip."
      },
      {
        title: "Comfort",
        text: "Moisturizing and non-sticky."
      }
    ],
    ingredients: [
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Jojoba Oil",
        note: "Lightweight conditioning oil"
      },
      {
        name: "Shea Butter",
        note: "Softening butter"
      }
    ],
    keyIngredients: [
      "antioxidants"
    ],
    howToUse: [
      "Apply from the centre of the lip outwards.",
      "Build a second layer for more colour.",
      "Reapply as you like."
    ],
    size: "5 ml / 0.17 fl. oz.",
    price: 650,
    compareAtPrice: null,
    images: [
      "gloss-burgundy-spirit-1"
    ],
    cutout: "gloss-burgundy-spirit",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "ritual",
      "antioxidants"
    ],
    badge: null,
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Gloss",
    finish: "High shine",
    forWho: "Anyone who loves a deep, wine-toned lip.",
    specs: [
      {
        label: "Format",
        value: "Glass bottle with doe-foot applicator"
      },
      {
        label: "Key ingredients",
        value: "Vitamin E · Jojoba Oil · Shea Butter"
      },
      {
        label: "On pack",
        value: "High-shine color · Plumping formula · Moisturizing · Nourishing · Non-sticky"
      }
    ],
    shades: [
      {
        name: "Burgundy Spirit",
        hex: "#5E1426"
      }
    ],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 51
  },
  {
    id: "co2-052",
    slug: "gloss-chocolate-dream",
    name: "Gloss Chocolate Dream",
    subtitle: "High-shine lip gloss",
    category: "lips",
    type: "lip-gloss",
    shortDescription: "A deep cocoa-brown gloss with a plumping finish.",
    description: "A high-shine chocolate-brown gloss with vitamin E, jojoba oil and shea butter. It moisturizes, nourishes and never feels sticky.",
    lede: "A warm cocoa brown that's the nineties gloss, grown up.",
    story: [
      "Vitamin E, jojoba oil and shea butter keep lips moisturized and comfortable while the colour gives a high-shine, plumping finish.",
      "Wear it over a brown liner for a classic look, or alone for a sheer chocolate wash."
    ],
    benefits: [
      {
        title: "High shine",
        text: "Glassy, colour-rich finish."
      },
      {
        title: "Plumping",
        text: "A fuller-looking lip."
      },
      {
        title: "Comfort",
        text: "Moisturizing and non-sticky."
      }
    ],
    ingredients: [
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Jojoba Oil",
        note: "Lightweight conditioning oil"
      },
      {
        name: "Shea Butter",
        note: "Softening butter"
      }
    ],
    keyIngredients: [
      "antioxidants"
    ],
    howToUse: [
      "Apply from the centre of the lip outwards.",
      "Build a second layer for more colour.",
      "Reapply as you like."
    ],
    size: "5 ml / 0.17 fl. oz.",
    price: 650,
    compareAtPrice: null,
    images: [
      "gloss-chocolate-dream-1",
      "gloss-chocolate-dream-2"
    ],
    cutout: "gloss-chocolate-dream",
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "ritual",
      "antioxidants",
      "signature"
    ],
    badge: "Signature",
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Gloss",
    finish: "High shine",
    forWho: "Anyone who loves a warm brown lip.",
    specs: [
      {
        label: "Format",
        value: "Glass bottle with doe-foot applicator"
      },
      {
        label: "Key ingredients",
        value: "Vitamin E · Jojoba Oil · Shea Butter"
      },
      {
        label: "On pack",
        value: "High-shine color · Plumping formula · Moisturizing · Nourishing · Non-sticky"
      }
    ],
    shades: [
      {
        name: "Chocolate Dream",
        hex: "#3B1E19"
      }
    ],
    bestSeller: true,
    featured: true,
    custom: null,
    order: 52
  },
  {
    id: "co2-084",
    slug: "gloss-red-kiss",
    name: "Gloss Red Kiss",
    subtitle: "High-shine lip gloss",
    category: "lips",
    type: "lip-gloss",
    shortDescription: "A classic red gloss with a plumping, high-shine finish.",
    description: "Red Kiss is a classic red lip gloss with vitamin E, jojoba oil and shea butter. The pack describes it as high-shine, plumping, moisturizing, nourishing and non-sticky.",
    lede: "A true, glossy red — the most classic shade in the CO2 gloss line.",
    story: [
      "Vitamin E, jojoba oil and shea butter are the key ingredients printed on the pack.",
      "Wear it on its own for a glassy red lip, or over a red lipstick for extra shine."
    ],
    benefits: [
      {
        title: "High shine",
        text: "High-shine colour, as printed on the pack."
      },
      {
        title: "Plumping formula",
        text: "As printed on the pack."
      },
      {
        title: "Non-sticky",
        text: "Moisturizing and nourishing, as printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Jojoba Oil",
        note: "Lightweight conditioning oil"
      },
      {
        name: "Shea Butter",
        note: "Softening butter"
      }
    ],
    keyIngredients: [
      "antioxidants"
    ],
    howToUse: [
      "Apply from the centre of the lip outwards.",
      "Build a second layer for more colour.",
      "Reapply as you like."
    ],
    size: "5 ml / 0.17 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "gloss-red-kiss-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "antioxidants"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Gloss",
    finish: "High shine",
    forWho: "Anyone who wants a classic glossy red lip.",
    specs: [
      {
        label: "Format",
        value: "Round glass bottle with ring cap and doe-foot applicator"
      },
      {
        label: "Key ingredients",
        value: "Vitamin E · Jojoba Oil · Shea Butter"
      },
      {
        label: "On pack",
        value: "High-shine color · Plumping formula · Moisturizing · Nourishing · Non-sticky"
      }
    ],
    shades: [
      {
        name: "Red Kiss",
        hex: "#9E2A2B"
      }
    ],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 52.1
  },
  {
    id: "co2-085",
    slug: "gloss-secret-rose",
    name: "Gloss Secret Rose",
    subtitle: "High-shine lip gloss",
    category: "lips",
    type: "lip-gloss",
    shortDescription: "A soft rose-pink gloss with a plumping, high-shine finish.",
    description: "Secret Rose is a soft rose-pink lip gloss with vitamin E, jojoba oil and shea butter. The pack describes it as high-shine, plumping, moisturizing, nourishing and non-sticky.",
    lede: "A muted, shimmering rose — the softest shade in the CO2 gloss line.",
    story: [
      "Vitamin E, jojoba oil and shea butter are the key ingredients printed on the pack.",
      "Wear it alone for an everyday rose lip, or layer it over the Secret Rose lipstick."
    ],
    benefits: [
      {
        title: "High shine",
        text: "High-shine colour, as printed on the pack."
      },
      {
        title: "Plumping formula",
        text: "As printed on the pack."
      },
      {
        title: "Non-sticky",
        text: "Moisturizing and nourishing, as printed on the pack."
      }
    ],
    ingredients: [
      {
        name: "Vitamin E",
        note: "Antioxidant"
      },
      {
        name: "Jojoba Oil",
        note: "Lightweight conditioning oil"
      },
      {
        name: "Shea Butter",
        note: "Softening butter"
      }
    ],
    keyIngredients: [
      "antioxidants"
    ],
    howToUse: [
      "Apply from the centre of the lip outwards.",
      "Build a second layer for more colour.",
      "Reapply as you like."
    ],
    size: "5 ml / 0.17 fl. oz.",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "gloss-secret-rose-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "antioxidants"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Gloss",
    finish: "High shine",
    forWho: "Anyone who prefers a soft, everyday pink lip.",
    specs: [
      {
        label: "Format",
        value: "Round glass bottle with ring cap and doe-foot applicator"
      },
      {
        label: "Key ingredients",
        value: "Vitamin E · Jojoba Oil · Shea Butter"
      },
      {
        label: "On pack",
        value: "High-shine color · Plumping formula · Moisturizing · Nourishing · Non-sticky"
      }
    ],
    shades: [
      {
        name: "Secret Rose",
        hex: "#B0757A"
      }
    ],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 52.2
  },
  {
    id: "co2-060",
    slug: "lipstick",
    name: "Lipstick",
    subtitle: "Bullet lipstick in seven shades",
    category: "lips",
    type: "lipstick",
    shortDescription: "CO2 lipstick in Secret Rose, Coral Crush, Chocolate Dream, Berry Rubin, Burgundy Spirit and Red Kiss (matte or glossy).",
    description: "A bullet lipstick in a faceted rose-gold case, in seven shades: Secret Rose, a deep rose pink; Coral Crush, a warm coral red; Chocolate Dream, a rich cocoa brown; Berry Rubin, a deep berry wine; Burgundy Spirit, a rosy burgundy; and Red Kiss, a true red in a matte or a glossy finish.",
    lede: "Seven shades, one faceted case.",
    story: [
      "Every shade comes in the same faceted rose-gold case and carton, 6 ml.",
      "Not sure which one suits you? Try every shade on your own lips with the virtual try-on before you choose."
    ],
    benefits: [],
    ingredients: [],
    keyIngredients: [],
    howToUse: [
      "Apply from the centre of the lip outwards.",
      "Build a second layer for more colour."
    ],
    size: "6 ml",
    // PRICE NOT YET SUPPLIED — set the INR price and change availability to "in-stock" to make it orderable.
    price: 0,
    compareAtPrice: null,
    images: [
      "lipstick-secret-rose-1",
      "lipstick-coral-crush-1",
      "lipstick-chocolate-dream-1",
      "lipstick-berry-rubin-1",
      "lipstick-burgundy-spirit-1",
      "lipstick-red-kiss-1"
    ],
    cutout: null,
    availability: "price-pending",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "lipstick"
    ],
    badge: "New",
    skinTypes: [],
    texture: "Bullet lipstick",
    finish: "",
    forWho: "Anyone choosing between a rose, coral, cocoa, berry, burgundy or red lip.",
    specs: [
      {
        label: "Format",
        value: "Bullet lipstick in a faceted case, boxed"
      },
      {
        label: "Shades",
        value: "Secret Rose · Coral Crush · Chocolate Dream · Berry Rubin · Burgundy Spirit · Red Kiss Matte · Red Kiss Glossy"
      },
      {
        label: "On pack",
        value: "CO2 Cosmetics · Lipstick · 6 ml"
      }
    ],
    shades: [
      {
        name: "Secret Rose",
        hex: "#C43850",
        image: "lipstick-secret-rose-1"
      },
      {
        name: "Coral Crush",
        hex: "#D23339",
        image: "lipstick-coral-crush-1"
      },
      {
        name: "Chocolate Dream",
        hex: "#712F22",
        image: "lipstick-chocolate-dream-1"
      },
      {
        name: "Berry Rubin",
        hex: "#7E2433",
        image: "lipstick-berry-rubin-1"
      },
      {
        name: "Burgundy Spirit",
        hex: "#9E2B40",
        image: "lipstick-burgundy-spirit-1"
      },
      {
        name: "Red Kiss Matte",
        hex: "#C42A38",
        image: "lipstick-red-kiss-1"
      },
      {
        name: "Red Kiss Glossy",
        hex: "#D3141F",
        image: "lipstick-red-kiss-1"
      }
    ],
    bestSeller: false,
    featured: false,
    custom: null,
    order: 52.5
  }
];
