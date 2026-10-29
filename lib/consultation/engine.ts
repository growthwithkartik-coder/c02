import { products } from "@/data/products";
import { customFormulas } from "@/data/custom-formulas";
import type { Product } from "@/types";
import { money, PRICES_ON_REQUEST } from "@/lib/utils";
import {
  AROMATIC,
  avoidGroups,
  ingredientFamilies,
  questionById,
  optLabel,
  type Answers,
  type Area,
} from "./questions";

/* ------------------------------------------------------------------
   CO2 Customized Skincare — deterministic recommendation engine.

   Every recommendation is computed from fields that already exist in
   data/products.ts (skinTypes, ingredients + their printed notes,
   benefits, texture, finish, howToUse, price). Every "why" line quotes
   or paraphrases those fields, so nothing is invented. This engine
   always runs — in the browser and on the server — and is the
   fallback whenever the AI service is not configured or fails.
------------------------------------------------------------------- */

export const ENGINE_VERSION = 2;

export type Role =
  | "cleanse"
  | "treat"
  | "moisturize"
  | "mask"
  | "exfoliate"
  | "body-wash"
  | "body-care"
  | "body-glow"
  | "body-ritual"
  | "hands"
  | "hair-wash"
  | "condition"
  | "scalp"
  | "hair-oil"
  | "beard"
  | "style"
  | "lips";

export const roleLabels: Record<Role, string> = {
  cleanse: "Cleanse",
  treat: "Treat",
  moisturize: "Moisturize",
  mask: "Weekly mask",
  exfoliate: "Weekly polish",
  "body-wash": "Wash",
  "body-care": "Nourish",
  "body-glow": "Glow",
  "body-ritual": "Massage ritual",
  hands: "Hands & feet",
  "hair-wash": "Shampoo",
  condition: "Condition",
  scalp: "Scalp care",
  "hair-oil": "Oil ritual",
  beard: "Beard",
  style: "Style",
  lips: "Lips",
};

export interface Pick {
  slug: string;
  role: Role;
  reasons: string[];
  cautions: string[];
  score: number;
  alternates: string[];
}

export interface RoutineStep {
  slug: string | null; // null = a step CO2 doesn't make (e.g. sunscreen)
  step: string;
  note?: string;
}

export interface CustomFormula {
  slug: string;
  options: Record<string, string>;
  reasons: string[];
}

export interface Plan {
  version: number;
  createdAt: string;
  profile: {
    name?: string;
    areas: Area[];
    skinKey: string;
    skinLabel: string;
    skinNote?: string;
    sensitivity: string;
    concerns: string[];
    goals: string[];
  };
  summary: string;
  picks: Pick[];
  morning: RoutineStep[];
  evening: RoutineStep[];
  weekly: RoutineStep[];
  body: RoutineStep[];
  hair: RoutineStep[];
  lips: RoutineStep[];
  custom: CustomFormula | null;
  limitations: string[];
  excludedCount: number;
}

/* ---------------- signals ---------------- */

/* `ing` finds a candidate ingredient by name; it only counts when its
   printed note supports the signal (`note`). Otherwise the product's
   printed benefits are checked (`benefit`). */
type Signal = { label: string; ing: RegExp; note: RegExp; benefit: RegExp; tag?: string };

const SIGNALS: Record<string, Signal> = {
  acne: { label: "blemish-prone skin", ing: /salicylic|tea tree|neem|niacinamide|charcoal|tulasi/i, note: /clarif|clear|purif|blemish|pore/i, benefit: /clear|clarif|purif|blemish/i },
  oil: { label: "excess oil", ing: /charcoal|dead sea|niacinamide|salicylic|neem|tea tree/i, note: /\boil\b|shine|matte|clarif|purif|pore|draw|absorb/i, benefit: /\boil\b|matte|shine|balanc/i },
  pores: { label: "the look of pores", ing: /charcoal|dead sea|salicylic/i, note: /pore|draw|absorb|purif/i, benefit: /pore|refine/i },
  dryness: { label: "dryness", ing: /hyaluronic|glycerin|almond|wheat germ|shea|honey|aloe/i, note: /hydrat|humect|moist|soft|nourish|supple|rich|cushion|emollient|butter/i, benefit: /hydrat|moistur|nourish|cushion|supple/i, tag: "hydration" },
  dullness: { label: "dullness", ing: /gold|saffron|turmeric|coffee|licorice|papaya|carrot/i, note: /lumin|radian|glow|bright|illumin/i, benefit: /luminous|radian|glow|bright|illuminat/i, tag: "radiance" },
  uneven: { label: "an uneven-looking tone", ing: /niacinamide|licorice|turmeric|saffron|manjistha|sandalwood/i, note: /\beven|tone|bright/i, benefit: /\beven/i },
  texture: { label: "rough texture", ing: /walnut shell|coffee|salicylic/i, note: /polish|exfoli|smooth|buff|refine/i, benefit: /smooth|polish|refine/i },
  aging: { label: "visible signs of ageing", ing: /wheat germ|almond|shea/i, note: /supple|firm|fine line|nourish|cushion/i, benefit: /fine lines|firm|supple/i },
  redness: { label: "redness and sensitivity", ing: /aloe|calamine|zinc oxide|cucumber/i, note: /sooth|calm|cool|comfort/i, benefit: /sooth|calm|cool|comfort/i },
};
SIGNALS.spots = { ...SIGNALS.uneven, label: "dark spots" };

const GOAL_TO_SIGNAL: Record<string, string[]> = {
  hydration: ["dryness"],
  oilBalance: ["oil"],
  brighter: ["dullness"],
  smoother: ["texture"],
  clearer: ["acne"],
  barrier: ["redness", "dryness"],
};

const BODY_TO_SIGNAL: Record<string, string[]> = { dry: ["dryness"], uneven: ["uneven"], calm: ["redness"], glow: ["dullness"] };

const SKIN_LABEL: Record<string, string> = {
  oily: "Oily",
  dry: "Dry",
  combination: "Combination",
  normal: "Normal",
  sensitive: "Sensitive",
  dehydrated: "Dehydrated",
};

const LIGHT_TEX = /gel|fluid|light|serum|lotion|foam|jelly/i;
const RICH_TEX = /rich|oil|butter|balm|silky|buttery/i;

const BUDGET: Record<string, number> = { "500": 500, "900": 900, "2000": 2000 };

/* ---------------- helpers ---------------- */

export function resolveSkin(a: Answers) {
  const t = a.skinType;
  if (t && t !== "unsure") return { key: t, note: undefined as string | undefined };
  const fromCleanse: Record<string, string> = { tight: "dry", oily: "oily", patchy: "combination", reactive: "sensitive", comfortable: "normal" };
  const key = (a.afterCleanse && fromCleanse[a.afterCleanse]) || "normal";
  return {
    key,
    note: t === "unsure" ? `You weren't sure of your skin type, so we read it as ${SKIN_LABEL[key].toLowerCase()} from how your skin feels after cleansing.` : undefined,
  };
}

function concernsOf(a: Answers) {
  return (a.concerns ?? []).filter((c) => c !== "none");
}

function signalWeights(a: Answers) {
  const w: Record<string, number> = {};
  for (const c of concernsOf(a)) w[c] = (w[c] ?? 0) + 2;
  (a.goals ?? []).forEach((g, i) => {
    for (const s of GOAL_TO_SIGNAL[g] ?? []) w[s] = (w[s] ?? 0) + (i === 0 ? 2 : 1.5);
  });
  if (a.skinType === "dry" || a.skinType === "dehydrated" || a.afterCleanse === "tight") w.dryness = (w.dryness ?? 0) + 1;
  if (a.skinType === "oily" || a.afterCleanse === "oily") w.oil = (w.oil ?? 0) + 1;
  if (a.skinType === "sensitive" || a.sensitivity === "very" || a.sensitivity === "moderate") w.redness = (w.redness ?? 0) + 1;
  return w;
}

function ingredientText(p: Product) {
  return p.ingredients.map((i) => i.name).join(" | ");
}

function timing(p: Product) {
  const h = (p.howToUse.join(" ") + " " + p.forWho).toLowerCase();
  const weekly = /once or twice a week|two or three times a week|once a week|weekly/.test(h);
  const morning = /morning/.test(h);
  const evening = /evening|night/.test(h);
  if (/best in the morning/.test(h) || (morning && !evening && /in the morning/.test(h))) return { am: true, pm: false, weekly };
  if (/nightly|at night/.test(h) && !morning) return { am: false, pm: true, weekly };
  return { am: true, pm: true, weekly, both: morning && evening };
}

/** The pack's how-to-use steps, as one short line. */
function how(p: Product) {
  return p.howToUse.join(" ");
}

function isScrub(p: Product) {
  return /scrub/i.test(p.name) || /walnut shell/i.test(ingredientText(p));
}

function aromaticIn(p: Product) {
  return p.ingredients.map((i) => i.name).filter((n) => AROMATIC.test(n));
}

function avoidHit(p: Product, a: Answers): string | null {
  for (const id of a.ingredients?.avoid ?? []) {
    const g = avoidGroups.find((x) => x.id === id);
    if (!g) continue;
    const hit = p.ingredients.find((i) => g.match.test(i.name));
    if (hit) return `${hit.name} (${g.label.toLowerCase()})`;
  }
  const extra = (a.ingredients?.avoidText ?? "")
    .split(/[,;/]|\band\b/i)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length >= 3);
  for (const t of extra) {
    const hit = p.ingredients.find((i) => i.name.toLowerCase().includes(t));
    if (hit) return hit.name;
  }
  return null;
}

/* ---------------- scoring ---------------- */

interface Scored {
  p: Product;
  score: number;
  reasons: string[];
  cautions: string[];
  excluded?: string;
}

interface ScoreCtx {
  a: Answers;
  skinKey: string;
  weights: Record<string, number>;
  face: boolean; // skin-type matching applies
  extraSignals?: Record<string, number>;
}

export function scoreProduct(p: Product, ctx: ScoreCtx): Scored {
  const { a, skinKey } = ctx;
  const reasons: string[] = [];
  const cautions: string[] = [];
  let score = 0;
  const label = SKIN_LABEL[skinKey];

  // hard exclusions first
  const avoid = avoidHit(p, a);
  if (avoid) return { p, score: -99, reasons, cautions, excluded: `Contains ${avoid}, which you asked to avoid.` };
  if (a.sensitivity === "very" && isScrub(p)) return { p, score: -99, reasons, cautions, excluded: "Scrubbing particles are best skipped on very sensitive skin." };

  // skin type
  if (ctx.face && p.skinTypes.length) {
    if (p.skinTypes.includes(label)) {
      score += p.skinTypes.length >= 6 ? 1 : 2.5;
      reasons.push(p.skinTypes.length >= 6 ? "Listed by CO2 for all six skin types, including yours." : `Lists ${label.toLowerCase()} skin among the skin types it suits.`);
    } else {
      return { p, score: -50, reasons, cautions, excluded: `Not listed for ${label.toLowerCase()} skin.` };
    }
    const wantsDry = skinKey === "sensitive" && (a.afterCleanse === "tight" || concernsOf(a).includes("dryness"));
    const wantsOily = skinKey === "sensitive" && (a.afterCleanse === "oily" || concernsOf(a).includes("oil"));
    if (wantsDry && !p.skinTypes.includes("Dry") && !p.skinTypes.includes("Dehydrated")) {
      score -= 2;
      cautions.push("Not listed for dry skin — chosen for the reasons above.");
    }
    if (wantsOily && !p.skinTypes.includes("Oily")) score -= 1;
    if (a.sensitivity === "very" && skinKey !== "sensitive") {
      if (p.skinTypes.includes("Sensitive")) {
        score += 1.5;
        reasons.push("Also listed for sensitive skin.");
      } else {
        score -= 2.5;
        cautions.push("Not specifically listed for sensitive skin — patch-test first.");
      }
    } else if (a.sensitivity === "moderate" && !p.skinTypes.includes("Sensitive")) {
      score -= 0.75;
    }
  }

  // concerns & goals → printed ingredients, then printed benefits
  const weights = ctx.face ? { ...ctx.weights, ...(ctx.extraSignals ?? {}) } : { ...(ctx.extraSignals ?? {}) };
  const usedIng = new Set<string>();
  const usedBen = new Set<string>();
  const ordered = Object.entries(weights).sort((x, y) => y[1] - x[1]);
  for (const [sig, w] of ordered) {
    const s = SIGNALS[sig];
    if (!s || w <= 0) continue;
    const ing = p.ingredients.find((i) => s.ing.test(i.name) && s.note.test(i.note) && !usedIng.has(i.name));
    if (ing) {
      usedIng.add(ing.name);
      score += w;
      reasons.push(`For ${s.label}: contains ${ing.name}${ing.note ? ` — “${ing.note}”` : ""}.`);
      continue;
    }
    const ben = p.benefits.find((b) => s.benefit.test(b.title + " " + b.text) && !usedBen.has(b.title));
    if (ben) {
      usedBen.add(ben.title);
      score += w * 0.8;
      reasons.push(`For ${s.label}: on the pack — “${ben.title}. ${ben.text}”`);
      continue;
    }
    if (s.tag && p.tags.includes(s.tag)) {
      score += w * 0.4;
    }
  }

  // ingredient likes
  for (const id of a.ingredients?.prefer ?? []) {
    if (p.keyIngredients.includes(id)) {
      score += 1;
      reasons.push(`Includes ${ingredientFamilies.find((f) => f.id === id)?.label ?? id}, which you said you like.`);
    }
  }

  // texture
  const tex = p.texture || "";
  const light = LIGHT_TEX.test(tex) && !/rich/i.test(tex);
  const rich = RICH_TEX.test(tex) || /rich/i.test(tex);
  if (ctx.face) {
    if (a.texture === "light") {
      if (light) {
        score += 1.5;
        reasons.push(`${tex} texture — matches your preference for lightweight products.`);
      } else if (rich) {
        score -= 1.5;
        cautions.push(`${tex} texture is richer than you said you like.`);
      }
    } else if (a.texture === "rich") {
      if (rich) {
        score += 1.5;
        reasons.push(`${tex} texture — matches your preference for richer products.`);
      } else if (light) score -= 0.5;
    } else if (a.texture === "balanced" && /cream|lotion/i.test(tex) && !/rich/i.test(tex)) {
      score += 0.75;
    }
    if (a.climate === "hothumid" && light) score += 0.5;
    if (a.climate === "hothumid" && rich) score -= 0.5;
    if (a.climate === "colddry" && rich) score += 0.5;
  }

  // fragrance
  const aro = aromaticIn(p);
  if (aro.length) {
    if (a.fragrance === "free") {
      score -= 2;
      cautions.push(`Contains ${aro.join(", ")}, which carr${aro.length > 1 ? "y" : "ies"} a natural scent.`);
    } else if (a.fragrance === "botanical") score += 0.3;
  }

  // sensitivity extras
  if ((a.sensitivity === "very" || a.sensitivity === "moderate") && /charcoal|salicylic|tea tree/i.test(ingredientText(p))) {
    score -= a.sensitivity === "very" ? 1.5 : 0.5;
    cautions.push("Has clarifying ingredients — introduce slowly if your skin is reactive.");
  }

  // budget
  const limit = !PRICES_ON_REQUEST && a.budget ? BUDGET[a.budget] : undefined;
  if (limit && p.price > limit) {
    score -= 3;
    cautions.push(`${money(p.price)} — above your budget of ${money(limit)}.`);
  } else if (limit) {
    score += 0.25;
  }

  if (p.bestSeller) score += 0.3;

  return { p, score, reasons, cautions };
}

/* ---------------- role pools ---------------- */

const bySlug = new Map([...products, ...customFormulas].map((p) => [p.slug, p]));

function pool(role: Role): Product[] {
  const ready = products.filter((p) => !p.custom && p.availability !== "out-of-stock" && p.availability !== "price-pending");
  switch (role) {
    case "cleanse":
      return ready.filter((p) => p.type === "cleansers");
    case "treat":
      return ready.filter((p) => p.type === "treatments");
    case "moisturize":
      // aloe-pure-gel's pack says "Use on face, body…", so it is a valid light face moisturizer
      return ready.filter((p) => p.type === "moisturizers" || (p.slug === "aloe-pure-gel" && /face/i.test(p.howToUse.join(" "))));
    case "mask":
      return ready.filter((p) => p.type === "masks" && !isScrub(p));
    case "exfoliate":
      return ready.filter((p) => p.type === "masks" && isScrub(p));
    case "body-wash":
      return ready.filter((p) => p.type === "body-wash" || p.type === "bath-bars");
    case "body-care":
      return ready.filter((p) => p.type === "body-care" && !/oil|serum/i.test(p.texture));
    case "body-glow":
      return ready.filter((p) => p.type === "body-care" && /serum/i.test(p.texture));
    case "body-ritual":
      return ready.filter((p) => p.type === "body-care" && /^oil$/i.test(p.texture));
    case "hands":
      return ready.filter((p) => p.type === "hands-feet");
    case "hair-wash":
      return ready.filter((p) => /shampoo/i.test(p.name));
    case "condition":
      return ready.filter((p) => /conditioner/i.test(p.name));
    case "scalp":
      return ready.filter((p) => p.type === "scalp" && /gel|jelly/i.test(p.texture));
    case "hair-oil":
      return ready.filter((p) => (p.category === "hair" && /oil/i.test(p.texture)) && !/beard/i.test(p.name));
    case "beard":
      return ready.filter((p) => /beard/i.test(p.name));
    case "style":
      return ready.filter((p) => p.type === "styling" && !/beard/i.test(p.name));
    case "lips":
      return ready.filter((p) => p.type === "lip-gloss");
  }
}

const FACE_ROLES: Role[] = ["cleanse", "treat", "moisturize", "mask", "exfoliate"];

function rank(role: Role, ctx: ScoreCtx) {
  const face = FACE_ROLES.includes(role);
  const all = pool(role).map((p) => scoreProduct(p, { ...ctx, face }));
  const ok = all.filter((s) => !s.excluded).sort((x, y) => y.score - x.score);
  const excluded = all.filter((s) => s.excluded);
  return { ok, excluded };
}

/* ---------------- plan ---------------- */

export function buildPlan(a: Answers, now = new Date()): Plan {
  const areas: Area[] = a.areas?.length ? a.areas : ["face"];
  const skin = resolveSkin(a);
  const weights = signalWeights(a);
  const ctx: ScoreCtx = { a, skinKey: skin.key, weights, face: true };
  const steps = a.steps ?? "balanced";
  const limitations: string[] = [];
  const picks = new Map<string, Pick>();
  const excludedSlugs = new Set<string>();

  const take = (role: Role, s: Scored, alts: Scored[]) => {
    if (!picks.has(s.p.slug)) {
      picks.set(s.p.slug, {
        slug: s.p.slug,
        role,
        reasons: s.reasons.length ? s.reasons : [`A dependable ${roleLabels[role].toLowerCase()} step from the CO2 range.`],
        cautions: s.cautions,
        score: Math.round(s.score * 10) / 10,
        alternates: alts.filter((x) => x.p.slug !== s.p.slug).slice(0, 2).map((x) => x.p.slug),
      });
    }
    return s.p.slug;
  };

  const best = (role: Role, opts: { minScore?: number; extra?: Record<string, number>; filter?: (p: Product) => boolean } = {}) => {
    const r = rank(role, { ...ctx, extraSignals: opts.extra });
    r.excluded.forEach((x) => x.score <= -99 && excludedSlugs.add(x.p.slug));
    const list = opts.filter ? r.ok.filter((x) => opts.filter!(x.p)) : r.ok;
    const top = list[0];
    if (!top || (opts.minScore != null && top.score < opts.minScore)) return { top: null as Scored | null, list };
    return { top, list };
  };

  const morning: RoutineStep[] = [];
  const evening: RoutineStep[] = [];
  const weekly: RoutineStep[] = [];
  const body: RoutineStep[] = [];
  const hair: RoutineStep[] = [];
  const lips: RoutineStep[] = [];
  const concerns = concernsOf(a);
  const usesNow = new Set(a.currentProducts ?? []);

  /* ---------- face ---------- */
  if (areas.includes("face")) {
    const cleanse = best("cleanse");
    const treat = best("treat");
    const moist = best("moisturize");

    if (!cleanse.top) limitations.push("We couldn't find a CO2 cleanser that fits every answer, so that step is left open — keep your current cleanser.");

    // morning/evening variants when the top choice is time-restricted
    const pickFor = (r: { top: Scored | null; list: Scored[] }, when: "am" | "pm") => {
      if (!r.top) return null;
      const t = timing(r.top.p);
      if ((when === "am" && t.am) || (when === "pm" && t.pm)) return r.top;
      return r.list.find((x) => (when === "am" ? timing(x.p).am : timing(x.p).pm)) ?? null;
    };

    const addDaily = (role: Role, r: { top: Scored | null; list: Scored[] }) => {
      const am = pickFor(r, "am");
      const pm = pickFor(r, "pm");
      if (am) morning.push({ slug: take(role, am, r.list), step: roleLabels[role], note: how(am.p) });
      if (pm) evening.push({ slug: take(role, pm, r.list), step: roleLabels[role], note: how(pm.p) });
    };

    const hasSignal = (s: Scored | null) => !!s && s.reasons.some((x) => x.startsWith("For "));

    addDaily("cleanse", cleanse);

    if (steps === "minimal") {
      // one leave-on step: whichever of treat / moisturize fits best
      const leave = [treat.top, moist.top].filter(Boolean).sort((x, y) => y!.score - x!.score)[0] ?? null;
      if (leave) {
        const role: Role = leave.p.type === "treatments" ? "treat" : "moisturize";
        addDaily(role, role === "treat" ? treat : moist);
      }
    } else {
      if (treat.top && hasSignal(treat.top) && treat.top.score >= 4) addDaily("treat", treat);
      if (moist.top) addDaily("moisturize", moist);
      // complete: a second, different treatment for the evening if it brings something new
      if (steps === "complete" && treat.top) {
        const second = treat.list.find((x) => x.p.slug !== treat.top!.p.slug && hasSignal(x) && timing(x.p).pm && x.score >= treat.top!.score - 3);
        if (second) {
          const i = evening.findIndex((s) => s.step === roleLabels.treat);
          const stepObj = { slug: take("treat", second, treat.list), step: roleLabels.treat, note: how(second.p) };
          if (i >= 0) evening[i] = stepObj;
          else evening.splice(1, 0, stepObj);
        }
      }
    }

    // sunscreen — CO2 doesn't make one; never invent it
    morning.push({
      slug: null,
      step: "Protect",
      note: usesNow.has("sunscreen")
        ? "Finish with the sunscreen you already use — CO2 doesn't make an SPF yet."
        : "Finish with a broad-spectrum sunscreen. CO2 doesn't make an SPF yet, so use one you trust.",
    });

    // oily skin: say why the moisturizer is a gel
    if (skin.key === "oily" && moist.top && moist.top.p.type !== "moisturizers") {
      limitations.push(`None of CO2's face creams list oily skin, so for moisture we chose ${moist.top.p.name}, whose pack says it can be used on the face.`);
    }

    // weekly
    const weeklyWanted =
      steps === "complete" ||
      (steps === "balanced" && (concerns.some((c) => ["oil", "pores", "acne", "dullness", "texture"].includes(c)) || a.goals?.includes("ritual")));
    if (weeklyWanted) {
      const mask = best("mask", { minScore: 1 });
      if (!mask.top) limitations.push("No CO2 mask fits all of your answers, so we haven't added a weekly mask.");
      if (mask.top) weekly.push({ slug: take("mask", mask.top, mask.list), step: roleLabels.mask, note: how(mask.top.p) });
      const wantsPolish = steps === "complete" || concerns.includes("texture") || a.goals?.includes("smoother");
      if (wantsPolish) {
        const ex = best("exfoliate", { minScore: 0 });
        if (ex.top) {
          const id = take("exfoliate", ex.top, ex.list);
          weekly.push({ slug: id, step: roleLabels.exfoliate, note: how(ex.top.p) });
          if (usesNow.has("exfoliant")) picks.get(id)?.cautions.push("You already use an exfoliant — use one or the other, not both in the same week.");
        }
      }
    }

    if (a.routineNow === "none") limitations.push("As you're new to a routine, introduce one product at a time, a few days apart, so you can see how your skin responds.");
    if (concerns.includes("acne")) limitations.push("CO2 products are cosmetics, not acne treatments. If breakouts are painful, persistent or leave marks, please see a dermatologist.");
    if (concerns.includes("spots") || concerns.includes("uneven")) limitations.push("Products can help the complexion look more even; they don't treat pigmentation. Persistent dark spots are worth discussing with a dermatologist.");
    if (concerns.includes("aging")) limitations.push("No CO2 product makes anti-ageing claims. We matched products whose packs describe softer-looking fine lines or supple, cushioned skin.");
    if (a.goals?.includes("barrier")) limitations.push("CO2's ready-made range doesn't include ceramide-based products, so for comfort we matched soothing, hydrating formulas. A made-to-order moisturizer can include ceramides.");
  }

  /* ---------- body ---------- */
  if (areas.includes("body")) {
    const needs = a.bodyNeeds ?? [];
    const extra: Record<string, number> = {};
    for (const n of needs) for (const s of BODY_TO_SIGNAL[n] ?? []) extra[s] = (extra[s] ?? 0) + 2;
    const bctx = { extra };
    const wash = best("body-wash", bctx);
    if (wash.top) body.push({ slug: take("body-wash", wash.top, wash.list), step: roleLabels["body-wash"], note: how(wash.top.p) });
    const onlyWash = needs.length > 0 && needs.every((n) => n === "wash");
    if (!onlyWash) {
      const care = best("body-care", bctx);
      if (care.top) body.push({ slug: take("body-care", care.top, care.list), step: roleLabels["body-care"], note: how(care.top.p) });
    }
    if (needs.includes("glow")) {
      const g = best("body-glow", bctx);
      if (g.top) body.push({ slug: take("body-glow", g.top, g.list), step: roleLabels["body-glow"], note: how(g.top.p) });
    }
    if (needs.includes("ritual") || a.goals?.includes("ritual")) {
      const r = best("body-ritual", bctx);
      if (r.top) body.push({ slug: take("body-ritual", r.top, r.list), step: roleLabels["body-ritual"], note: how(r.top.p) });
    }
    if (needs.includes("hands")) {
      const h = best("hands", bctx);
      if (h.top) body.push({ slug: take("hands", h.top, h.list), step: roleLabels.hands, note: how(h.top.p) });
      const feet = pool("hands").find((p) => /foot/i.test(p.name) && p.slug !== h.top?.p.slug);
      if (feet && !avoidHit(feet, a)) {
        const s = scoreProduct(feet, { ...ctx, face: false });
        body.push({ slug: take("hands", s, []), step: "Feet", note: how(feet) });
      }
    }
  }

  /* ---------- hair ---------- */
  if (areas.includes("hair")) {
    const needs = a.hairNeeds ?? [];
    const scalpy = needs.includes("oilyScalp") || needs.includes("flaky");
    const shampoo = best("hair-wash", { filter: (p) => (scalpy ? /scalp/i.test(p.name) : true) });
    const sh = shampoo.top ?? best("hair-wash").top;
    if (sh) {
      const s = scoreProduct(sh.p, { ...ctx, face: false });
      if (scalpy) s.reasons.unshift(`Part of CO2's anti-dandruff range — “${sh.p.benefits[0]?.title}. ${sh.p.benefits[0]?.text}”`);
      hair.push({ slug: take("hair-wash", s, shampoo.list), step: roleLabels["hair-wash"], note: how(sh.p) });
    }
    if (needs.includes("dryLengths") || needs.length === 0) {
      const c = best("condition");
      if (c.top) hair.push({ slug: take("condition", c.top, c.list), step: roleLabels.condition, note: how(c.top.p) });
    }
    if (needs.includes("flaky") || needs.includes("oilyScalp")) {
      const sc = best("scalp");
      if (sc.top) {
        sc.top.reasons.unshift(`Leave-on scalp step — “${sc.top.p.benefits[0]?.title}. ${sc.top.p.benefits[0]?.text}”`);
        hair.push({ slug: take("scalp", sc.top, sc.list), step: roleLabels.scalp, note: how(sc.top.p) });
      }
      limitations.push("Persistent flaking, itching or hair loss can have medical causes — if it doesn't settle, see a dermatologist or trichologist.");
    }
    if (needs.includes("nourish") || needs.includes("dryLengths")) {
      const o = best("hair-oil");
      if (o.top) hair.push({ slug: take("hair-oil", o.top, o.list), step: roleLabels["hair-oil"], note: how(o.top.p) });
    }
    if (needs.includes("beard")) {
      const b = best("beard");
      if (b.top) hair.push({ slug: take("beard", b.top, b.list), step: roleLabels.beard, note: how(b.top.p) });
    }
    if (needs.includes("styling")) {
      const st = best("style");
      if (st.top) hair.push({ slug: take("style", st.top, st.list), step: roleLabels.style, note: how(st.top.p) });
    }
  }

  /* ---------- lips ---------- */
  if (areas.includes("lips")) {
    const want: Record<string, string> = { berry: "gloss-berry-rubin", wine: "gloss-burgundy-spirit", brown: "gloss-chocolate-dream", red: "gloss-red-kiss", rose: "gloss-secret-rose" };
    const slugs = a.lipLook && want[a.lipLook] ? [want[a.lipLook]] : Object.values(want);
    for (const s of slugs) {
      const p = bySlug.get(s);
      if (!p || avoidHit(p, a)) continue;
      const sc = scoreProduct(p, { ...ctx, face: false });
      sc.reasons.unshift(`Shade ${p.shades[0]?.name ?? ""}${a.lipLook && a.lipLook !== "all" ? " — the look you chose" : ""}. Finish: ${p.finish.toLowerCase()}.`);
      lips.push({ slug: take("lips", sc, []), step: p.shades[0]?.name ?? "Gloss", note: how(p) });
    }
  }

  /* ---------- made-to-order ---------- */
  let custom: CustomFormula | null = null;
  if ((a.madeToOrder === "yes" || a.madeToOrder === "maybe") && areas.includes("face")) custom = buildCustomFormula(a, skin.key);

  /* ---------- shared limitations ---------- */
  if (a.fragrance === "free") limitations.push("CO2 packs list key ingredients rather than a full fragrance declaration, so we lowered the priority of products with aromatic ingredients — but we can't promise any product is completely unscented.");
  if (a.sensitivity === "very" || a.sensitivity === "moderate" || skin.key === "sensitive") limitations.push("Patch-test each new product on your inner arm for 24–48 hours, and introduce one product at a time.");
  if (excludedSlugs.size) limitations.push(`We left out ${excludedSlugs.size} product${excludedSlugs.size === 1 ? "" : "s"} containing ingredients you asked to avoid (or scrubbing particles, for very sensitive skin).`);
  const limit = !PRICES_ON_REQUEST && a.budget ? BUDGET[a.budget] : undefined;
  if (limit) {
    const over = [...picks.values()].filter((p) => (bySlug.get(p.slug)?.price ?? 0) > limit);
    if (over.length) limitations.push(`${over.length === 1 ? "One pick is" : `${over.length} picks are`} above your budget because nothing within it fitted that step as well — the alternatives under each product are listed.`);
  }

  const profile = {
    name: a.name,
    areas,
    skinKey: skin.key,
    skinLabel: a.skinType === "unsure" ? `${SKIN_LABEL[skin.key]} (estimated)` : SKIN_LABEL[skin.key],
    skinNote: skin.note,
    sensitivity: optLabel(questionById("sensitivity"), a.sensitivity) || "Not specified",
    concerns: concerns.map((c) => optLabel(questionById("concerns"), c)).filter(Boolean),
    goals: (a.goals ?? []).map((g) => optLabel(questionById("goals"), g)).filter(Boolean),
  };

  return {
    version: ENGINE_VERSION,
    createdAt: now.toISOString(),
    profile,
    summary: summarize(a, profile, morning, evening, weekly),
    picks: [...picks.values()],
    morning,
    evening,
    weekly,
    body,
    hair,
    lips,
    custom,
    limitations: [...new Set(limitations)],
    excludedCount: excludedSlugs.size,
  };
}

function summarize(a: Answers, profile: Plan["profile"], am: RoutineStep[], pm: RoutineStep[], wk: RoutineStep[]) {
  const parts: string[] = [];
  const amN = am.filter((s) => s.slug).length;
  const pmN = pm.filter((s) => s.slug).length;
  if (amN || pmN) {
    parts.push(`A ${amN === pmN ? `${numWord(amN)}-step morning and evening` : `${numWord(amN)}-step morning and ${numWord(pmN)}-step evening`} routine${wk.length ? `, plus ${wk.length === 1 ? "a weekly treatment" : "two weekly treatments"},` : ""}`);
  } else parts.push("A CO2 routine");
  const sens = ({ occasional: "occasionally sensitive", moderate: "moderately sensitive", very: "very sensitive" } as Record<string, string>)[a.sensitivity ?? ""];
  const skinWord = profile.skinLabel.toLowerCase().replace(" (estimated)", "");
  parts.push(`for ${skinWord === "sensitive" || !sens ? skinWord : `${skinWord}, ${sens}`} skin`);
  const focus = profile.goals.length ? profile.goals : profile.concerns;
  if (focus.length) parts.push(`, focused on ${listJoin(focus.slice(0, 3).map((x) => x.toLowerCase()))}`);
  return parts.join(" ").replace(" ,", ",") + ".";
}

function numWord(n: number) {
  return ["no", "one", "two", "three", "four", "five", "six"][n] ?? String(n);
}

export function listJoin(xs: string[]) {
  if (xs.length <= 1) return xs.join("");
  return xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
}

/* ---------------- made-to-order ---------------- */

const FAMILY_LABEL: Record<string, string> = {
  hyaluronic: "Hyaluronic acid",
  niacinamide: "Niacinamide",
  vitc: "Vitamin C",
  peptides: "Peptides",
  ceramides: "Ceramides",
  squalane: "Squalane",
};

export function buildCustomFormula(a: Answers, skinKey = resolveSkin(a).key): CustomFormula | null {
  const c = concernsOf(a);
  const dry = skinKey === "dry" || skinKey === "dehydrated" || c.includes("dryness") || a.texture === "rich" || a.goals?.includes("barrier");
  const slug = dry ? "custom-moisturizer" : "custom-serum";
  const p = bySlug.get(slug);
  if (!p?.custom) return null;
  const reasons: string[] = [];
  const opts: Record<string, string> = {};
  const sens = a.sensitivity === "very" || a.sensitivity === "moderate" || skinKey === "sensitive";

  // only families this product documents in keyIngredients
  const fams: string[] = [];
  const add = (k: string) => p.keyIngredients.includes(k) && !fams.includes(k) && fams.push(k);
  if (c.includes("dryness") || skinKey === "dry" || skinKey === "dehydrated" || a.goals?.includes("hydration")) add("hyaluronic");
  if (c.some((x) => ["oil", "pores", "acne"].includes(x)) || a.goals?.includes("oilBalance")) add("niacinamide");
  if (c.some((x) => ["dullness", "uneven", "spots"].includes(x)) || a.goals?.includes("brighter")) add(a.sensitivity === "very" ? "niacinamide" : "vitc");
  if (c.some((x) => ["aging", "texture"].includes(x)) || a.goals?.includes("smoother")) add("peptides");
  if (a.goals?.includes("barrier") || c.includes("redness")) add("ceramides");
  if (!fams.length) p.keyIngredients.slice(0, 2).forEach(add);
  add("squalane");

  for (const o of p.custom.options) {
    if (o === "Base") opts[o] = skinKey === "oily" ? "Gel" : dry ? "Light emulsion" : sens ? "Water" : "Serum";
    if (o === "Texture") opts[o] = a.texture === "light" || skinKey === "oily" ? (slug === "custom-serum" ? "Fluid" : "Gel") : a.texture === "rich" && dry ? (slug === "custom-moisturizer" ? "Balm" : "Cream") : slug === "custom-serum" ? "Fluid" : "Cream";
    if (o === "Finish") opts[o] = skinKey === "oily" || c.includes("oil") ? "Matte" : dry ? "Dewy" : skinKey === "combination" ? "Natural" : "Satin";
    if (o === "Scent") opts[o] = a.fragrance === "free" || (sens && a.fragrance !== "botanical") ? "Fragrance-free" : a.fragrance === "botanical" || a.fragrance === "subtle" ? "Light botanical" : "Fragrance-free";
    if (o === "Ingredient families") opts[o] = fams.map((f) => FAMILY_LABEL[f] ?? f).join(", ");
    if (o === "Ingredients to avoid") {
      const av = [...(a.ingredients?.avoid ?? []).map((id) => avoidGroups.find((g) => g.id === id)?.label ?? id), ...(a.ingredients?.avoidText ? [a.ingredients.avoidText] : [])];
      if (opts.Scent === "Fragrance-free" && !av.some((x) => /fragrance/i.test(x))) av.push("Added fragrance");
      if (av.length) opts[o] = av.join(", ").slice(0, 240);
    }
  }

  reasons.push(dry ? "A moisturizer, because your answers point to dryness or a preference for richer textures." : "A serum, because your answers point to targeted goals rather than extra richness.");
  if (opts.Base) reasons.push(`${opts.Base} base for ${SKIN_LABEL[skinKey].toLowerCase()} skin.`);
  if (opts.Texture) reasons.push(`${opts.Texture} texture${a.texture && a.texture !== "any" ? ", from your texture preference" : ""}${a.climate === "hothumid" ? " — kept light for a hot, humid climate" : ""}.`);
  if (opts.Finish) reasons.push(`${opts.Finish} finish, balanced for your skin type.`);
  if (fams.length) reasons.push(`Ingredient families from those CO2 offers for this formula: ${fams.map((f) => FAMILY_LABEL[f] ?? f).join(", ")}.`);
  if (opts.Scent) reasons.push(`${opts.Scent}${sens ? ", kept minimal for reactive skin" : ""}.`);
  reasons.push("Every choice is pre-filled for you to review. CO2 confirms the final formula by email before preparing it.");
  return { slug, options: opts, reasons };
}

/* ---------------- product-page fit ---------------- */

const TYPE_ROLE: Record<string, Role> = {
  cleansers: "cleanse",
  treatments: "treat",
  moisturizers: "moisturize",
  masks: "mask",
  "body-wash": "body-wash",
  "bath-bars": "body-wash",
  "body-care": "body-care",
  "hands-feet": "hands",
  "hair-care": "hair-wash",
  scalp: "scalp",
  styling: "style",
  "lip-gloss": "lips",
};

export function productFit(p: Product, a: Answers) {
  const role = TYPE_ROLE[p.type];
  const face = !!role && FACE_ROLES.includes(role);
  const skin = resolveSkin(a);
  const s = scoreProduct(p, { a, skinKey: skin.key, weights: signalWeights(a), face });
  const verdict: "good" | "okay" | "not-ideal" = s.excluded ? "not-ideal" : s.score >= 3 && s.cautions.length === 0 ? "good" : s.score >= 1 ? "okay" : "not-ideal";
  return { verdict, reasons: s.reasons, cautions: s.excluded ? [s.excluded, ...s.cautions] : s.cautions, role: role ? roleLabels[role] : null, skinLabel: SKIN_LABEL[skin.key] };
}

/* ---------------- utils ---------------- */

export function planSlugs(plan: Plan) {
  const s = new Set<string>();
  for (const list of [plan.morning, plan.evening, plan.weekly, plan.body, plan.hair, plan.lips]) for (const st of list) if (st.slug) s.add(st.slug);
  return [...s];
}

export function getPickProduct(slug: string) {
  return bySlug.get(slug);
}
