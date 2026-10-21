import { PRICES_ON_REQUEST } from "@/lib/utils";
/* ------------------------------------------------------------------
   CO2 Customized Skincare — the consultation questionnaire.

   Adapted from the original CO2 consultation (chapters, one question
   per screen, "unsure" skin type resolved by the after-cleansing
   answer, concerns treated as cosmetic goals, ingredient prefer/avoid,
   free-text notes, review before results). Questions are trimmed to
   what the CO2 catalogue can actually act on — every answer below
   changes either which product is chosen or how the routine is built.
------------------------------------------------------------------- */

export type Opt = { id: string; label: string; hint?: string };

export type ChapterId = "you" | "skin" | "goals" | "routine" | "prefs";

export const chapters: { id: ChapterId; label: string }[] = [
  { id: "you", label: "About you" },
  { id: "skin", label: "Your skin" },
  { id: "goals", label: "Goals" },
  { id: "routine", label: "Your routine" },
  { id: "prefs", label: "Preferences" },
];

export type Area = "face" | "body" | "hair" | "lips";

export interface IngredientAnswer {
  prefer: string[];
  avoid: string[];
  avoidText?: string;
}

export interface Answers {
  name?: string;
  areas?: Area[];
  skinType?: string;
  afterCleanse?: string;
  sensitivity?: string;
  concerns?: string[];
  goals?: string[];
  bodyNeeds?: string[];
  hairNeeds?: string[];
  lipLook?: string;
  routineNow?: string;
  currentProducts?: string[];
  routineText?: string;
  texture?: string;
  fragrance?: string;
  ingredients?: IngredientAnswer;
  climate?: string;
  steps?: string;
  budget?: string;
  madeToOrder?: string;
  notes?: string;
}

export type QuestionType = "single" | "multi" | "scale" | "text" | "routine" | "ingredients";

export interface Question {
  id: keyof Answers;
  chapter: ChapterId;
  type: QuestionType;
  short: string;
  title: string;
  help?: string;
  note?: string;
  options?: Opt[];
  optional?: boolean;
  /** option id that clears the others when chosen (e.g. "none") */
  exclusive?: string;
  max?: number;
  big?: boolean;
  when?: (a: Answers) => boolean;
}

const hasArea = (a: Answers, x: Area) => !!a.areas?.includes(x);
const skinArea = (a: Answers) => hasArea(a, "face") || hasArea(a, "body") || !a.areas?.length;

export const ingredientFamilies: Opt[] = [
  { id: "gold", label: "24K gold" },
  { id: "hyaluronic", label: "Hyaluronic acid" },
  { id: "niacinamide", label: "Niacinamide" },
  { id: "aloe", label: "Aloe vera" },
  { id: "neem", label: "Neem" },
  { id: "tulasi", label: "Tulasi" },
  { id: "turmeric", label: "Turmeric" },
  { id: "saffron", label: "Saffron" },
  { id: "sandalwood", label: "Sandalwood" },
  { id: "teatree", label: "Tea tree" },
  { id: "charcoal", label: "Charcoal" },
  { id: "almond", label: "Almond oil" },
];

/** Printed ingredient names that carry their own scent (essential/aromatic oils, listed fragrance). */
export const AROMATIC_OILS = /\b(lavender|bergamot|rose oil|rosemary oil|tea tree|mint oil|peppermint|lemon oil|orange extract|sandalwood oil|menthol|basil\) oil)/i;
export const AROMATIC = new RegExp(AROMATIC_OILS.source.replace(/\)$/, "|fragrance)"), "i");

/** Avoid groups are matched against each product's printed ingredient names. */
export const avoidGroups: (Opt & { match: RegExp })[] = [
  { id: "nuts", label: "Nut oils & nut shell", hint: "almond, walnut", match: /\b(almond|walnut)\b/i },
  { id: "coconut", label: "Coconut", match: /\bcoconut\b/i },
  { id: "essential", label: "Essential & aromatic oils", hint: "lavender, rose, mint, lemon, tea tree…", match: AROMATIC_OILS },
  { id: "fragrance", label: "Listed fragrance", match: /\bfragrance\b/i },
  { id: "salicylic", label: "Salicylic acid", match: /\bsalicylic\b/i },
  { id: "scrubs", label: "Scrubbing particles", hint: "walnut shell", match: /\bwalnut shell\b/i },
  { id: "charcoal", label: "Charcoal", match: /\bcharcoal\b/i },
  { id: "parabens", label: "Parabens", match: /paraben/i },
];

export const questions: Question[] = [
  {
    id: "name",
    chapter: "you",
    type: "text",
    short: "Your name",
    title: "First, what should we call you?",
    help: "Optional. Used only to greet you on your results. It stays on this device unless you ask the AI assistant a question.",
    optional: true,
  },
  {
    id: "areas",
    chapter: "you",
    type: "multi",
    short: "Routine covers",
    title: "What should your routine cover?",
    help: "Choose all that apply. Face is where most of the consultation focuses.",
    big: true,
    options: [
      { id: "face", label: "Face", hint: "Cleanse, treat, moisturize, weekly masks" },
      { id: "body", label: "Body", hint: "Washes, lotions, oils, hands & feet" },
      { id: "hair", label: "Hair & scalp", hint: "Shampoo, conditioner, scalp care, grooming" },
      { id: "lips", label: "Lips", hint: "High-shine gloss" },
    ],
  },
  {
    id: "skinType",
    chapter: "skin",
    type: "single",
    short: "Skin type",
    title: "What is your skin type?",
    help: "Go with how your skin behaves most days.",
    when: skinArea,
    options: [
      { id: "oily", label: "Oily", hint: "Shine across the face by midday" },
      { id: "dry", label: "Dry", hint: "Often feels rough or tight" },
      { id: "combination", label: "Combination", hint: "Oily T-zone, drier cheeks" },
      { id: "normal", label: "Normal", hint: "Rarely too oily or too dry" },
      { id: "sensitive", label: "Sensitive", hint: "Easily upset by new products" },
      { id: "dehydrated", label: "Dehydrated", hint: "Tight, yet can still look shiny" },
      { id: "unsure", label: "Not sure", hint: "The next question will set the direction" },
    ],
  },
  {
    id: "afterCleanse",
    chapter: "skin",
    type: "single",
    short: "After cleansing",
    title: "How does your skin usually feel after cleansing?",
    help: "About twenty minutes after, with nothing applied.",
    when: skinArea,
    options: [
      { id: "tight", label: "Tight" },
      { id: "comfortable", label: "Comfortable" },
      { id: "oily", label: "Oily again" },
      { id: "patchy", label: "Dry in some areas" },
      { id: "reactive", label: "Stings or reddens" },
      { id: "depends", label: "It depends" },
    ],
  },
  {
    id: "sensitivity",
    chapter: "skin",
    type: "scale",
    short: "Sensitivity",
    title: "How sensitive is your skin?",
    help: "Think about how often new products sting, redden or feel uncomfortable.",
    when: skinArea,
    options: [
      { id: "none", label: "Not sensitive" },
      { id: "occasional", label: "Occasionally" },
      { id: "moderate", label: "Moderately" },
      { id: "very", label: "Very sensitive" },
    ],
  },
  {
    id: "concerns",
    chapter: "skin",
    type: "multi",
    short: "Skin concerns",
    title: "What would you most like to change?",
    help: "Choose all that apply. These shape cosmetic goals, not a diagnosis.",
    note: "For persistent, painful or worsening skin concerns, please see a dermatologist. CO2 products are cosmetics.",
    exclusive: "none",
    when: skinArea,
    options: [
      { id: "acne", label: "Acne & blemishes" },
      { id: "uneven", label: "Uneven skin tone" },
      { id: "spots", label: "Dark spots" },
      { id: "dryness", label: "Dryness & dehydration" },
      { id: "oil", label: "Excess oil" },
      { id: "dullness", label: "Dullness" },
      { id: "texture", label: "Rough texture" },
      { id: "pores", label: "Enlarged-looking pores" },
      { id: "aging", label: "Visible signs of ageing" },
      { id: "redness", label: "Redness or sensitivity" },
      { id: "none", label: "None — just maintenance" },
    ],
  },
  {
    id: "goals",
    chapter: "goals",
    type: "multi",
    short: "Goals",
    title: "What are your skincare goals?",
    help: "Choose up to three, most important first.",
    max: 3,
    options: [
      { id: "hydration", label: "Hydration" },
      { id: "oilBalance", label: "Oil balance" },
      { id: "brighter", label: "Brighter-looking skin" },
      { id: "smoother", label: "Smoother-looking skin" },
      { id: "clearer", label: "Clearer-looking skin" },
      { id: "barrier", label: "Comfort & skin-barrier support" },
      { id: "simple", label: "A simple daily routine" },
      { id: "ritual", label: "A relaxing self-care ritual" },
    ],
  },
  {
    id: "bodyNeeds",
    chapter: "goals",
    type: "multi",
    short: "Body",
    title: "What does your body care need?",
    help: "Choose all that apply.",
    when: (a) => hasArea(a, "body"),
    options: [
      { id: "dry", label: "Dry or rough skin" },
      { id: "uneven", label: "Uneven-looking tone" },
      { id: "calm", label: "Skin that feels warm or uncomfortable" },
      { id: "glow", label: "A glow for bare skin" },
      { id: "ritual", label: "A massage / relaxation ritual" },
      { id: "hands", label: "Hands & feet" },
      { id: "wash", label: "Just a good everyday wash" },
    ],
  },
  {
    id: "hairNeeds",
    chapter: "goals",
    type: "multi",
    short: "Hair & scalp",
    title: "What would you like from hair and scalp care?",
    help: "Choose all that apply.",
    when: (a) => hasArea(a, "hair"),
    options: [
      { id: "oilyScalp", label: "Scalp gets oily quickly" },
      { id: "flaky", label: "Flaky-looking scalp" },
      { id: "dryLengths", label: "Dry or rough lengths" },
      { id: "nourish", label: "A nourishing oil ritual" },
      { id: "beard", label: "Beard care" },
      { id: "styling", label: "Clean hold for styling" },
    ],
  },
  {
    id: "lipLook",
    chapter: "goals",
    type: "single",
    short: "Lip look",
    title: "Which lip look do you reach for?",
    help: "CO2 gloss comes in five shades.",
    when: (a) => hasArea(a, "lips"),
    options: [
      { id: "berry", label: "Berry", hint: "Berry Rubin" },
      { id: "wine", label: "Deep wine", hint: "Burgundy Spirit" },
      { id: "brown", label: "Chocolate brown", hint: "Chocolate Dream" },
      { id: "red", label: "Classic red", hint: "Red Kiss" },
      { id: "rose", label: "Soft rose", hint: "Secret Rose" },
      { id: "all", label: "Show me every shade" },
    ],
  },
  {
    id: "routineNow",
    chapter: "routine",
    type: "single",
    short: "Current routine",
    title: "Do you use skincare products right now?",
    options: [
      { id: "none", label: "Not really", hint: "Soap and water, or nothing" },
      { id: "basic", label: "The basics", hint: "A cleanser and maybe a moisturizer" },
      { id: "several", label: "A few steps", hint: "Three to five products" },
      { id: "extensive", label: "A full routine", hint: "Six or more products" },
    ],
  },
  {
    id: "currentProducts",
    chapter: "routine",
    type: "routine",
    short: "What you use",
    title: "Tell us about your current routine.",
    help: "Tick what you already use, and describe anything you love or that hasn't worked. Optional.",
    optional: true,
    when: (a) => !!a.routineNow && a.routineNow !== "none",
    options: [
      { id: "cleanser", label: "Cleanser" },
      { id: "toner", label: "Toner" },
      { id: "serum", label: "Serum" },
      { id: "moisturizer", label: "Moisturizer" },
      { id: "sunscreen", label: "Sunscreen" },
      { id: "mask", label: "Mask" },
      { id: "exfoliant", label: "Exfoliant / scrub" },
      { id: "oil", label: "Face oil" },
    ],
  },
  {
    id: "steps",
    chapter: "routine",
    type: "single",
    short: "Routine length",
    title: "How many steps do you want each day?",
    options: [
      { id: "minimal", label: "Two or three", hint: "Quick and essential" },
      { id: "balanced", label: "Four or five", hint: "A considered daily routine" },
      { id: "complete", label: "The full ritual", hint: "Daily steps plus weekly treatments" },
    ],
  },
  {
    id: "texture",
    chapter: "prefs",
    type: "single",
    short: "Texture",
    title: "Which textures do you like on your face?",
    options: [
      { id: "light", label: "Lightweight", hint: "Gels, fluids, light creams" },
      { id: "balanced", label: "Somewhere in between", hint: "Soft creams and lotions" },
      { id: "rich", label: "Rich", hint: "Cushioning creams and oils" },
      { id: "any", label: "No preference" },
    ],
  },
  {
    id: "fragrance",
    chapter: "prefs",
    type: "single",
    short: "Fragrance",
    title: "What's your fragrance preference?",
    note: "CO2 lists key ingredients as printed on each pack, not a full fragrance declaration — so we can lower the priority of products with aromatic ingredients, but we can't guarantee a product is fragrance-free.",
    options: [
      { id: "free", label: "As unscented as possible" },
      { id: "subtle", label: "Subtle is fine" },
      { id: "botanical", label: "Botanical scents welcome" },
      { id: "any", label: "No preference" },
    ],
  },
  {
    id: "ingredients",
    chapter: "prefs",
    type: "ingredients",
    short: "Ingredients",
    title: "Any ingredients you like, or want to avoid?",
    help: "Both lists are taken from the ingredients printed on CO2 packs. Optional.",
    note: "If you have a known allergy, always check the full ingredient list on the pack before use, and patch-test new products.",
    optional: true,
  },
  {
    id: "climate",
    chapter: "prefs",
    type: "single",
    short: "Climate",
    title: "What is your climate like?",
    help: "Where you spend most of the year. It changes how heavy a texture feels.",
    options: [
      { id: "hothumid", label: "Hot & humid" },
      { id: "hotdry", label: "Hot & dry" },
      { id: "colddry", label: "Cold & dry" },
      { id: "temperate", label: "Temperate" },
      { id: "variable", label: "Highly variable" },
    ],
  },
  {
    id: "budget",
    chapter: "prefs",
    type: "single",
    short: "Budget",
    title: "What would you like to spend per product?",
    options: [
      { id: "500", label: "Mostly under ₹500" },
      { id: "900", label: "Up to ₹900" },
      { id: "2000", label: "Up to ₹2,000" },
      { id: "any", label: "No limit" },
    ],
  },
  {
    id: "madeToOrder",
    chapter: "prefs",
    type: "single",
    short: "Made-to-order",
    title: "Would you like a formula made for you?",
    help: "CO2 can prepare a serum or moisturizer to your profile (5–8 working days). We'll pre-fill it from your answers.",
    when: (a) => hasArea(a, "face") || !a.areas?.length,
    options: [
      { id: "yes", label: "Yes, include one" },
      { id: "maybe", label: "Show me, I'll decide" },
      { id: "no", label: "Ready-made only" },
    ],
  },
  {
    id: "notes",
    chapter: "prefs",
    type: "text",
    short: "Anything else",
    title: "Anything else we should know?",
    help: "Products you love or avoid, an occasion you're preparing for, how your skin changes with the seasons. Optional.",
    optional: true,
  },
];

export function visibleQuestions(a: Answers) {
  // prices are on request (as per customization), so no budget question
  return questions.filter((q) => (!q.when || q.when(a)) && !(PRICES_ON_REQUEST && q.id === "budget"));
}

export function questionById(id: string) {
  return questions.find((q) => q.id === id);
}

export function optLabel(q: Question | undefined, id?: string) {
  if (!q || !id) return "";
  return q.options?.find((o) => o.id === id)?.label ?? "";
}

export function isAnswered(q: Question, a: Answers) {
  if (q.optional) return true;
  const v = a[q.id];
  if (q.type === "multi") return Array.isArray(v) && v.length > 0;
  return typeof v === "string" && v.trim() !== "";
}

export function progressOf(a: Answers) {
  const vq = visibleQuestions(a).filter((q) => !q.optional);
  const done = vq.filter((q) => isAnswered(q, a)).length;
  return { done, total: vq.length, pct: vq.length ? Math.round((done / vq.length) * 100) : 0, complete: done >= vq.length };
}

export function answerText(q: Question, a: Answers): string {
  const v = a[q.id];
  if (q.type === "ingredients") {
    const i = a.ingredients;
    if (!i || (!i.prefer.length && !i.avoid.length && !i.avoidText)) return "No preference";
    const parts: string[] = [];
    if (i.prefer.length) parts.push("Like: " + i.prefer.map((x) => ingredientFamilies.find((f) => f.id === x)?.label ?? x).join(", "));
    const av = [...i.avoid.map((x) => avoidGroups.find((g) => g.id === x)?.label ?? x), ...(i.avoidText ? [i.avoidText] : [])];
    if (av.length) parts.push("Avoid: " + av.join(", "));
    return parts.join(" · ");
  }
  if (q.type === "routine") {
    const list = (a.currentProducts ?? []).map((x) => optLabel(q, x)).filter(Boolean);
    const t = a.routineText?.trim();
    if (!list.length && !t) return "—";
    return [list.join(", "), t ? `“${t.length > 90 ? t.slice(0, 90) + "…" : t}”` : ""].filter(Boolean).join(" · ");
  }
  if (v == null || (Array.isArray(v) && !v.length) || v === "") return q.optional ? "—" : "Not answered";
  if (Array.isArray(v)) return (v as string[]).map((x) => optLabel(q, x)).join(", ");
  if (q.type === "text") {
    const s = String(v);
    return s.length > 90 ? s.slice(0, 90) + "…" : s;
  }
  return optLabel(q, String(v)) || String(v);
}

/* ---------------- input sanitising (client + server) ---------------- */

const clean = (s: unknown, max: number) =>
  typeof s === "string"
    ? s
        .replace(/[\u0000-\u001f\u007f<>]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, max)
    : undefined;

/** Keeps only known question ids and known option values. Anything else is dropped. */
export function sanitizeAnswers(input: unknown): Answers {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out: Answers = {};
  for (const q of questions) {
    const v = src[q.id];
    if (v == null) continue;
    const ids = new Set(q.options?.map((o) => o.id));
    if (q.type === "single" || q.type === "scale") {
      if (typeof v === "string" && ids.has(v)) (out as Record<string, unknown>)[q.id] = v;
    } else if (q.type === "multi") {
      if (Array.isArray(v)) {
        let arr = [...new Set(v.filter((x): x is string => typeof x === "string" && ids.has(x)))];
        if (q.exclusive && arr.includes(q.exclusive) && arr.length > 1) arr = arr.filter((x) => x !== q.exclusive);
        if (q.max) arr = arr.slice(0, q.max);
        if (arr.length) (out as Record<string, unknown>)[q.id] = arr;
      }
    } else if (q.type === "text") {
      const s = clean(v, q.id === "name" ? 40 : 1200);
      if (s) (out as Record<string, unknown>)[q.id] = s;
    } else if (q.type === "routine") {
      if (Array.isArray(v)) {
        const arr = [...new Set(v.filter((x): x is string => typeof x === "string" && ids.has(x)))];
        if (arr.length) out.currentProducts = arr;
      }
    } else if (q.type === "ingredients") {
      const o = v as Partial<IngredientAnswer>;
      const famIds = new Set(ingredientFamilies.map((f) => f.id));
      const avIds = new Set(avoidGroups.map((g) => g.id));
      out.ingredients = {
        prefer: Array.isArray(o.prefer) ? [...new Set(o.prefer.filter((x) => typeof x === "string" && famIds.has(x)))] : [],
        avoid: Array.isArray(o.avoid) ? [...new Set(o.avoid.filter((x) => typeof x === "string" && avIds.has(x)))] : [],
        avoidText: clean(o.avoidText, 160),
      };
    }
  }
  const rt = clean(src.routineText, 600);
  if (rt) out.routineText = rt;
  return out;
}
