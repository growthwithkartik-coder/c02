/* ============================================================
   CO2 — made-to-order formulas (customization only)
   These are NOT shown in the product catalogue, shop grids, search or
   collections. They are the formulas a customer can configure in the
   Customization section (/customization) and the Make It Yours builder.
   Prices are the existing ones; edit here.
   ============================================================ */
import type { Product } from "@/types";

export const customFormulas: Product[] = [
  {
    id: "co2-055",
    slug: "custom-serum",
    name: "Custom Serum",
    subtitle: "Built around your goals",
    category: "made-personal",
    type: "made-personal",
    shortDescription: "A serum formulated around your skin type, cosmetic goals, texture and ingredient preferences.",
    description: "A serum formulated around your skin type, cosmetic goals, texture and ingredient preferences.",
    lede: "Tell us what your skin feels like and what you want from it. We match your preferences to CO2's serum bases and ingredient families.",
    story: [
      "Your serum starts from one of CO2's serum bases — water, gel or light emulsion — and adds ingredient families chosen from your preferences and goals, within cosmetic use levels.",
      "Ingredients you ask to avoid are excluded, and fragrance is off unless you choose otherwise."
    ],
    benefits: [
      {
        title: "Focuses",
        text: "On your top cosmetic goals: hydration, radiance, an even-looking tone and texture."
      },
      {
        title: "Respects",
        text: "Your sensitivity level and ingredient exclusions."
      },
      {
        title: "Evolves",
        text: "Retake your profile when your skin or season changes."
      }
    ],
    ingredients: [
      {
        name: "Serum base",
        note: "Water, gel or light emulsion"
      },
      {
        name: "Humectants",
        note: "Hydration"
      },
      {
        name: "Ingredient families you choose",
        note: "e.g. niacinamide, vitamin C, peptides"
      },
      {
        name: "Botanical extracts (optional)",
        note: "If preferred"
      },
      {
        name: "Preservative system",
        note: "Declared on your formula card"
      }
    ],
    keyIngredients: [
      "niacinamide",
      "vitc",
      "peptides",
      "hyaluronic"
    ],
    howToUse: [
      "Apply 3–4 drops to clean, damp skin.",
      "Follow with moisturizer.",
      "Use as directed on your formula card."
    ],
    size: "30 ml",
    price: 3600,
    compareAtPrice: null,
    images: [],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "niacinamide",
      "vitc",
      "peptides",
      "hyaluronic",
      "custom"
    ],
    badge: "Custom",
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Your choice",
    finish: "Invisible to dewy",
    forWho: "Anyone who wants a serum aimed at their own goals.",
    specs: [
      {
        label: "Volume",
        value: "30 ml"
      },
      {
        label: "Vessel",
        value: "Clear glass, pipette"
      },
      {
        label: "Preparation",
        value: "5–8 working days"
      },
      {
        label: "Formula card",
        value: "Included"
      },
      {
        label: "Reorder",
        value: "From your CO2 profile"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: {
      vessel: "dropper",
      fill: "#DCEBE5",
      options: [
        "Base",
        "Texture",
        "Scent",
        "Ingredient families",
        "Ingredients to avoid",
        "Finish"
      ],
      faq: [
        {
          q: "Can you treat acne or other conditions?",
          a: "No. CO2 creates cosmetic products based on preferences. For skin conditions, please see a dermatologist."
        }
      ]
    },
    order: 55
  },
  {
    id: "co2-056",
    slug: "custom-moisturizer",
    name: "Custom Moisturizer",
    subtitle: "Your texture, your base",
    category: "made-personal",
    type: "made-personal",
    shortDescription: "From weightless gel to rich balm — a moisturizer set to your skin, climate and preferred feel.",
    description: "From weightless gel to rich balm — a moisturizer set to your skin, climate and preferred feel.",
    lede: "Texture is the reason most people abandon a moisturizer. Yours is set from gel to balm, then built around your skin profile and climate.",
    story: [
      "Your moisturizer uses a base matched to your skin type and climate — lighter for hot and humid, richer for cold and dry — with the ingredient families you prefer.",
      "The finish follows your preference: matte, natural, satin or dewy."
    ],
    benefits: [
      {
        title: "Fits",
        text: "Your preferred texture and feel."
      },
      {
        title: "Adapts",
        text: "To your climate and lifestyle."
      },
      {
        title: "Includes",
        text: "The ingredient families you choose."
      }
    ],
    ingredients: [
      {
        name: "Cream base",
        note: "Gel, water cream, cream or balm"
      },
      {
        name: "Emollients (squalane, plant butters)",
        note: "Adjusted to texture"
      },
      {
        name: "Ceramides",
        note: "Barrier support"
      },
      {
        name: "Humectants",
        note: "Hydration"
      },
      {
        name: "Your preferred ingredient families",
        note: "Where compatible"
      },
      {
        name: "Preservative system",
        note: "Declared on your formula card"
      }
    ],
    keyIngredients: [
      "ceramides",
      "squalane",
      "hyaluronic"
    ],
    howToUse: [
      "Use a pea-sized amount after serum.",
      "Morning and/or night.",
      "Refine texture seasonally from your profile."
    ],
    size: "50 ml",
    price: 3200,
    compareAtPrice: null,
    images: [],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "ceramides",
      "squalane",
      "hyaluronic",
      "custom"
    ],
    badge: "Custom",
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Your choice",
    finish: "Your choice",
    forWho: "Anyone who has never found a moisturizer that feels right.",
    specs: [
      {
        label: "Volume",
        value: "50 ml"
      },
      {
        label: "Vessel",
        value: "Frosted glass jar"
      },
      {
        label: "Preparation",
        value: "5–7 working days"
      },
      {
        label: "Formula card",
        value: "Included"
      },
      {
        label: "Reorder",
        value: "From your CO2 profile"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: {
      vessel: "jar",
      fill: "#F0E8DE",
      options: [
        "Texture",
        "Base",
        "Finish",
        "Scent",
        "Ingredient families",
        "Ingredients to avoid"
      ],
      faq: [
        {
          q: "Can I have two versions, for summer and winter?",
          a: "Yes — save both formulas in your profile and reorder either."
        }
      ]
    },
    order: 56
  },
  {
    id: "co2-058",
    slug: "custom-lip",
    name: "Custom Lip Colour",
    subtitle: "Your shade, made",
    category: "made-personal",
    type: "made-personal",
    shortDescription: "A lip colour in your chosen family, intensity, finish and scent.",
    description: "A lip colour in your chosen family, intensity, finish and scent.",
    lede: "From a sheer balm-tint to a velvet matte — choose the colour, intensity and finish, and we pour it for you.",
    story: [
      "Custom Lip Colour uses CO2's lip base in bullet form, with colour mixed from your selection and a finish from matte to glossy.",
      "Fragrance- and flavour-free by default."
    ],
    benefits: [
      {
        title: "Colours",
        text: "Your exact family and intensity."
      },
      {
        title: "Finishes",
        text: "Matte to gloss."
      },
      {
        title: "Comforts",
        text: "A cushioning, non-drying base."
      }
    ],
    ingredients: [
      {
        name: "Lip base (castor, plant waxes)",
        note: "Structure and slip"
      },
      {
        name: "Pigment blend",
        note: "Mixed to your colour"
      },
      {
        name: "Squalane",
        note: "Comfort"
      },
      {
        name: "Tocopherol",
        note: "Antioxidant"
      }
    ],
    keyIngredients: [
      "squalane",
      "antioxidants"
    ],
    howToUse: [
      "Apply from the centre outward.",
      "Blot for a stain, layer for intensity."
    ],
    size: "3.5 g",
    price: 1900,
    compareAtPrice: null,
    images: [],
    cutout: null,
    availability: "in-stock",
    rating: null,
    reviewCount: 0,
    reviews: [],
    tags: [
      "squalane",
      "antioxidants",
      "custom"
    ],
    badge: "Custom",
    skinTypes: [
      "Dry",
      "Oily",
      "Combination",
      "Normal",
      "Sensitive",
      "Dehydrated"
    ],
    texture: "Bullet",
    finish: "Your choice",
    forWho: "Anyone searching for the shade they can't find.",
    specs: [
      {
        label: "Weight",
        value: "3.5 g"
      },
      {
        label: "Vessel",
        value: "Rose-metal case"
      },
      {
        label: "Preparation",
        value: "5–7 working days"
      },
      {
        label: "Formula card",
        value: "Included"
      },
      {
        label: "Reorder",
        value: "From your CO2 profile"
      }
    ],
    shades: [],
    bestSeller: false,
    featured: false,
    custom: {
      vessel: "lipstick",
      fill: "#A0525A",
      options: [
        "Colour family",
        "Intensity",
        "Finish",
        "Texture",
        "Scent",
        "Ingredient preferences"
      ],
      faq: [
        {
          q: "Is it flavoured?",
          a: "No, unless you choose a subtle scent."
        }
      ]
    },
    order: 58
  }
];
