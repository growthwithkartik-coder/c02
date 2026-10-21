import { products } from "@/data/products";
import { productConcerns, productFormat } from "@/data/taxonomy";
import { getBuildProduct } from "@/data/customize";
import { sampleFor } from "@/lib/commerce";
import { avoidCatalogue, budgetMax, getFlow, visibleQuestions, answerLabel, type Answers, type FlowId } from "@/lib/customize/flows";
import type { Product } from "@/types";

/* ------------------------------------------------------------------
   Make It Yours — recommendation engine (rule-based, deterministic)

   Turns one category's answers into:
   - a beauty profile (what the customer told us),
   - a routine (steps in order) built from REAL catalogue products,
   - the reasons for every pick, each marked as
       "verified"   → comes from the product's own data (listed
                      ingredients, concern grouping, stated skin types)
       "preference" → matches a preference the customer gave (texture,
                      scent family, budget) — not a product claim,
   - products left out because of an ingredient to avoid,
   - made-to-order / on-request formulas to customize next, with the
     builder pre-filled from the answers.

   It never invents products, ingredients or claims. Recommendations are
   cosmetic suggestions, not a diagnosis, and NOT a custom formulation —
   formulas are only made when the customer builds and confirms one.
------------------------------------------------------------------- */

export interface Reason {
  text: string;
  kind: "verified" | "preference";
}
export interface Pick {
  slug: string;
  step: string;
  reasons: Reason[];
}
export interface RoutineStep {
  step: string;
  slug?: string;
  /** free text for steps CO2 doesn't make (e.g. sunscreen) */
  text?: string;
  buildId?: string;
}
export interface RoutineBlock {
  id: string;
  title: string;
  note?: string;
  steps: RoutineStep[];
}
export interface CustomSuggestion {
  buildId: string;
  why: string;
  prefill: Record<string, string>;
}
export interface Recommendation {
  flow: FlowId;
  createdAt: string;
  headline: string;
  summary: string;
  profile: { label: string; value: string }[];
  routine: RoutineBlock[];
  picks: Pick[];
  custom: CustomSuggestion[];
  excluded: { slug: string; reason: string }[];
  notes: string[];
  start: string;
}

/* ---------------- helpers ---------------- */

const fmt = (p: Product) => productFormat[p.slug] ?? p.type;
const list = (a: Answers, k: string) => (Array.isArray(a[k]) ? (a[k] as string[]) : a[k] ? [String(a[k])] : []);
const one = (a: Answers, k: string) => (Array.isArray(a[k]) ? (a[k] as string[])[0] : (a[k] as string | undefined));
const ingText = (p: Product) => p.ingredients.map((i) => i.name).join(" | ");
const ingNames = (p: Product, n = 3) => p.ingredients.slice(0, n).map((i) => i.name).join(", ");
const concernLabel: Record<string, string> = {
  "acne-blemishes": "blemish-prone skin",
  "oily-skin": "oily skin",
  "dryness-hydration": "dryness & hydration",
  "dullness-glow": "dullness & glow",
  "uneven-tone": "an even-looking tone",
  texture: "skin texture",
  "anti-aging": "tired-looking skin",
  sensitive: "sensitive skin",
  dandruff: "a flaky scalp",
  "scalp-care": "scalp care",
  "dry-damaged": "dry lengths",
  "hair-hydration": "hair hydration",
  frizz: "frizz control",
};

function avoidMatchers(a: Answers) {
  const ids = list(a, "avoid").filter((x) => x !== "none");
  const res = avoidCatalogue.filter((x) => ids.includes(x.id));
  const extra = String(a.avoidText ?? "")
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
  return {
    labels: [...res.map((r) => r.label.replace(/\s*\(.*\)$/, "")), ...extra],
    test(p: Product): string | null {
      const t = ingText(p);
      for (const r of res) if (r.match.test(t)) return r.label.replace(/\s*\(.*\)$/, "");
      for (const e of extra) if (t.toLowerCase().includes(e.toLowerCase())) return e;
      return null;
    },
  };
}

function scentFamily(p: Product): "fresh" | "floral" | "warm" | "herbal" | null {
  const t = ingText(p).toLowerCase();
  if (/rose|lavender/.test(t)) return "floral";
  if (/sandal|saffron|cocoa|coffee/.test(t)) return "warm";
  if (/mint|menthol|cucumber|lemon|orange|apple/.test(t)) return "fresh";
  if (/neem|tulasi|tea tree|rosemary/.test(t)) return "herbal";
  return null;
}

interface Ctx {
  concerns: string[]; // taxonomy concern ids, most important first
  skin?: string; // catalogue skin type label (Dry, Oily…)
  texture?: RegExp[];
  scent?: string;
  maxPrice: number;
  avoid: ReturnType<typeof avoidMatchers>;
  penalise?: (p: Product) => number;
}

function score(p: Product, c: Ctx) {
  let s = 0;
  const reasons: Reason[] = [];
  const pc = productConcerns[p.slug] ?? [];
  const hits = c.concerns.filter((x) => pc.includes(x));
  hits.forEach((h, i) => (s += i === 0 ? 4 : 2.5));
  if (hits.length) reasons.push({ kind: "verified", text: `Listed by CO2 for ${hits.map((h) => concernLabel[h] ?? h).join(" and ")} — key ingredients ${ingNames(p)}.` });
  if (c.skin && p.skinTypes.includes(c.skin) && p.skinTypes.length < 6) {
    s += 1.5;
    reasons.push({ kind: "verified", text: `Product information lists it for ${c.skin.toLowerCase()} skin.` });
  }
  if (c.texture?.length && c.texture.some((r) => r.test(p.texture))) {
    s += 1;
    reasons.push({ kind: "preference", text: `${p.texture} — matches the texture you prefer.` });
  }
  if (c.scent && c.scent !== "none") {
    const fam = scentFamily(p);
    if (fam && fam === c.scent) {
      s += 1;
      reasons.push({ kind: "preference", text: `Its botanicals (${ingNames(p, 2)}) lean ${fam} — the scent family you chose.` });
    }
  }
  if (p.price <= c.maxPrice && c.maxPrice !== Infinity) reasons.push({ kind: "preference", text: "Within your price range." });
  if (p.price > c.maxPrice) s -= 3;
  if (p.bestSeller) s += 0.3;
  if (c.penalise) s -= c.penalise(p);
  return { s, reasons };
}

function choose(pool: Product[], c: Ctx, excluded: Map<string, string>, taken: Set<string>) {
  const ok = pool.filter((p) => {
    if (taken.has(p.slug) || p.custom) return false;
    const hit = c.avoid.test(p);
    if (hit) {
      excluded.set(p.slug, `Contains ${hit.toLowerCase()}, which you asked to avoid.`);
      return false;
    }
    return true;
  });
  if (!ok.length) return null;
  const ranked = ok.map((p) => ({ p, ...score(p, c) })).sort((a, b) => b.s - a.s || a.p.price - b.p.price || a.p.order - b.p.order);
  return ranked[0];
}

/** every pick carries at least one reason taken from the product's own data */
function withVerified(p: Product, reasons: Reason[]): Reason[] {
  return reasons.some((r) => r.kind === "verified") ? reasons : [{ kind: "verified", text: `${p.shortDescription} Key ingredients: ${ingNames(p)}.` }, ...reasons];
}

const pool = (formats: string[]) => products.filter((p) => formats.includes(fmt(p)) && p.availability !== "out-of-stock" && p.availability !== "price-pending");

function profileFor(flow: FlowId, a: Answers) {
  const f = getFlow(flow)!;
  return visibleQuestions(f, a)
    .filter((q) => q.type !== "text" && a[q.id] != null && !(Array.isArray(a[q.id]) && !(a[q.id] as string[]).length))
    .map((q) => ({ label: q.short, value: answerLabel(q, a) }));
}

/* ---------------- FACE ---------------- */

const faceConcernMap: Record<string, string[]> = {
  dryness: ["dryness-hydration"],
  dehydration: ["dryness-hydration"],
  oil: ["oily-skin"],
  uneven: ["uneven-tone"],
  dullness: ["dullness-glow"],
  pores: ["oily-skin", "texture"],
  blemish: ["acne-blemishes"],
  texture: ["texture"],
  "fine-lines": ["anti-aging"],
  sensitivity: ["sensitive"],
};

function resolveSkin(a: Answers): { key: string; label: string; estimated: boolean } {
  const t = one(a, "skinType");
  const after = one(a, "afterCleanse");
  const map: Record<string, string> = { dry: "Dry", oily: "Oily", combination: "Combination", balanced: "Normal", sensitive: "Sensitive" };
  if (t && t !== "unsure") return { key: t, label: map[t], estimated: false };
  const est: Record<string, string> = { tight: "dry", oily: "oily", both: "combination", comfortable: "balanced", varies: "combination" };
  const k = est[after ?? ""] ?? "balanced";
  return { key: k, label: map[k], estimated: true };
}

function textureRegex(ids: string[]) {
  const m: Record<string, RegExp> = { lightweight: /light|gel|fluid/i, gel: /gel/i, cream: /cream/i, serum: /serum|fluid/i, rich: /rich|velvet|silky/i };
  return ids.map((i) => m[i]).filter(Boolean);
}

function recommendFace(a: Answers): Omit<Recommendation, "createdAt"> {
  const skin = resolveSkin(a);
  const concerns = [...new Set(list(a, "concerns").flatMap((c) => faceConcernMap[c] ?? []))];
  if (skin.key === "oily" && !concerns.includes("oily-skin")) concerns.push("oily-skin");
  if (skin.key === "dry" && !concerns.includes("dryness-hydration")) concerns.push("dryness-hydration");
  if (skin.key === "sensitive" && !concerns.includes("sensitive")) concerns.push("sensitive");
  const sensitive = skin.key === "sensitive" || list(a, "concerns").includes("sensitivity");
  const avoid = avoidMatchers(a);
  const excluded = new Map<string, string>();
  const taken = new Set<string>();
  const ctx: Ctx = {
    concerns,
    skin: skin.label,
    texture: textureRegex(list(a, "texture")),
    maxPrice: budgetMax(a.budget),
    avoid,
    penalise: (p) => (sensitive && /salicylic|charcoal|walnut/i.test(ingText(p)) ? 2 : 0),
  };
  const length = one(a, "length") ?? "balanced";
  const picks: Pick[] = [];
  const add = (step: string, formats: string[], c: Ctx = ctx) => {
    const r = choose(pool(formats), c, excluded, taken);
    if (!r) return undefined;
    taken.add(r.p.slug);
    picks.push({ slug: r.p.slug, step, reasons: withVerified(r.p, r.reasons) });
    return r.p.slug;
  };

  const cleanse = add("Cleanse", ["face-wash"]);
  const treat = length !== "simple" || concerns.length >= 2 ? add("Treat", ["serum", "treatment-cream"]) : undefined;
  const moist = add("Moisturize", ["moisturizer", ...(skin.key === "oily" && !treat ? ["treatment-cream"] : [])]);
  let weekly: string | undefined;
  let weekly2: string | undefined;
  if (length !== "simple") {
    weekly = add("Weekly mask", ["face-mask"]);
    if (length === "detailed" && !sensitive) weekly2 = add("Weekly polish", ["scrub"]);
  }

  const hasSpf = list(a, "currentSteps").includes("sunscreen") || one(a, "routineNow") === "cleanser-moist-spf";
  const routine: RoutineBlock[] = [
    {
      id: "am",
      title: "Morning",
      steps: [
        { step: "Cleanse", slug: cleanse },
        ...(treat ? [{ step: "Treat", slug: treat }] : []),
        { step: "Moisturize", slug: moist },
        { step: "Protect", text: hasSpf ? "Keep using the sunscreen you already trust." : "Finish with a broad-spectrum sunscreen. CO2 doesn't make one yet, so choose one you like." },
      ].filter((s) => s.slug || s.text),
    },
    {
      id: "pm",
      title: "Evening",
      steps: [
        { step: "Cleanse", slug: cleanse },
        ...(treat ? [{ step: "Treat", slug: treat }] : []),
        { step: "Moisturize", slug: moist },
      ].filter((s) => s.slug),
    },
  ];
  if (weekly || weekly2) {
    routine.push({
      id: "weekly",
      title: "Once or twice a week",
      note: "On clean skin, before your evening serum and moisturizer.",
      steps: [...(weekly ? [{ step: "Mask", slug: weekly }] : []), ...(weekly2 ? [{ step: "Polish", slug: weekly2 }] : [])],
    });
  }

  // made-to-order suggestions
  const tex = list(a, "texture");
  const wantsFree = tex.includes("fragrance-free") || sensitive;
  const families = [
    concerns.includes("dryness-hydration") && "Hyaluronic acid",
    (concerns.includes("uneven-tone") || concerns.includes("oily-skin")) && "Niacinamide",
    concerns.includes("dullness-glow") && "Botanical brighteners (saffron, turmeric)",
    concerns.includes("sensitive") && "Aloe vera",
    concerns.includes("acne-blemishes") && "Neem, tea tree",
  ].filter(Boolean) as string[];
  const avoidText = avoid.labels.join(", ");
  const base = skin.key === "oily" ? "Gel" : skin.key === "dry" ? "Serum" : skin.key === "combination" ? "Water" : "Light emulsion";
  const finish = skin.key === "oily" || concerns.includes("oily-skin") ? "Matte" : skin.key === "dry" || concerns.includes("dullness-glow") ? "Dewy" : "Natural";
  const custom: CustomSuggestion[] = [
    {
      buildId: "custom-serum",
      why: "Choose your own base, texture, scent and ingredient families — a serum made to order rather than picked off the shelf.",
      prefill: {
        Base: base,
        Texture: tex.includes("gel") || skin.key === "oily" ? "Gel" : "Fluid",
        Scent: wantsFree ? "Fragrance-free" : "Light botanical",
        "Ingredient families": families.join(", "),
        "Ingredients to avoid": avoidText,
        Finish: finish,
      },
    },
    {
      buildId: "custom-moisturizer",
      why: "Set the weight from weightless gel to rich balm — useful if the ready-made creams feel too light or too rich.",
      prefill: {
        Texture: tex.includes("rich") || skin.key === "dry" ? "Balm" : tex.includes("gel") || skin.key === "oily" ? "Gel" : "Cream",
        Base: skin.key === "oily" ? "Gel" : "Light emulsion",
        Finish: finish,
        Scent: wantsFree ? "Fragrance-free" : "Light botanical",
        "Ingredient families": families.join(", "),
        "Ingredients to avoid": avoidText,
      },
    },
  ];

  const notes = [
    skin.estimated ? `We estimated ${skin.label.toLowerCase()} skin from how your skin feels after cleansing. You can change this any time.` : "",
    sensitive ? "Because you mentioned sensitivity, we kept polishing scrubs and stronger clarifying ingredients out of the routine. Patch-test anything new on a small area first." : "Patch-test new products on a small area first.",
    tex.includes("fragrance-free") ? "Ready-made products list key ingredients only, so we can't confirm they are fragrance-free. Made-to-order formulas can be made fragrance-free." : "",
    list(a, "concerns").includes("other") && a.concernsText ? `You also mentioned: “${a.concernsText}”. Our team can take this into account if you build a made-to-order formula.` : "",
  ].filter(Boolean);

  const concernsText = list(a, "concerns").filter((c) => c !== "other" && c !== "maintenance");
  return {
    flow: "face",
    headline: `A ${length} routine for ${skin.label.toLowerCase()} skin${concernsText.length ? ` focused on ${concernsText.slice(0, 2).map((c) => c.replace("-", " ")).join(" and ")}` : ""}.`,
    summary: `Built from ${picks.length} CO2 products in the order you'd use them, morning and evening${weekly ? ", plus a weekly mask" : ""}. Nothing to buy yet — explore, save or customize.`,
    profile: profileFor("face", a),
    routine,
    picks,
    custom,
    excluded: [...excluded].map(([slug, reason]) => ({ slug, reason })),
    notes,
    start: one(a, "start") ?? "routine",
  };
}

/* ---------------- BODY ---------------- */

function recommendBody(a: Answers): Omit<Recommendation, "createdAt"> {
  const focus = list(a, "bodyFocus");
  const concerns = [
    ...(focus.some((f) => ["moisture", "dry", "nourish", "smooth"].includes(f)) ? ["dryness-hydration"] : []),
    ...(focus.includes("glow") ? ["dullness-glow", "uneven-tone"] : []),
    ...(focus.includes("comfort") ? ["sensitive"] : []),
  ];
  const texMap: Record<string, RegExp> = { lotion: /light|lotion|fluid/i, gel: /gel/i, cream: /rich|cream/i, oil: /oil/i };
  const t = one(a, "bodyTexture");
  const avoid = avoidMatchers(a);
  const scent = one(a, "bodyScent");
  const ctx: Ctx = { concerns, texture: t && texMap[t] ? [texMap[t]] : [], scent: scent === "free" || scent === "subtle" ? undefined : scent, maxPrice: budgetMax(a.budget), avoid };
  const excluded = new Map<string, string>();
  const taken = new Set<string>();
  const picks: Pick[] = [];
  const add = (step: string, formats: string[], c: Ctx = ctx) => {
    const r = choose(pool(formats), c, excluded, taken);
    if (!r) return undefined;
    taken.add(r.p.slug);
    picks.push({ slug: r.p.slug, step, reasons: withVerified(r.p, r.reasons) });
    return r.p.slug;
  };
  let want = list(a, "bodyProducts");
  if (!want.length) want = ["wash", "lotion"];
  const slugs: Record<string, string | undefined> = {};
  if (want.includes("wash")) slugs.wash = add("Wash", ["body-wash"]);
  if (want.includes("bar")) slugs.bar = add("Bath bar", ["bath-bar"]);
  if (want.includes("lotion")) slugs.lotion = add("Moisturize", ["body-lotion"], { ...ctx, texture: [/light|lotion|fluid/i] });
  if (want.includes("cream")) slugs.cream = add("Nourish", ["body-lotion"], { ...ctx, texture: [/rich|cream/i] });
  if (want.includes("oil")) slugs.oil = add("Body oil", ["body-oil"]);
  if (want.includes("gel")) slugs.gel = add("Aloe gel", ["body-gel"]);
  if (want.includes("hands-feet")) {
    slugs.feet = add("Feet", ["foot-care"]);
    slugs.hands = add("Hands", ["hand-wash"]);
  }
  const when = list(a, "bodyWhen");
  const afterBath = [slugs.wash || slugs.bar, slugs.lotion || slugs.gel, slugs.oil].filter(Boolean) as string[];
  const routine: RoutineBlock[] = [
    { id: "bath", title: when.includes("morning") ? "Morning, in & after the shower" : "In & after the bath", note: "Moisturizers absorb best on slightly damp skin.", steps: afterBath.map((s) => ({ step: picks.find((p) => p.slug === s)!.step, slug: s })) },
  ];
  const evening = [slugs.cream, slugs.feet, !afterBath.includes(slugs.oil ?? "") ? slugs.oil : undefined].filter(Boolean) as string[];
  if (evening.length || when.includes("evening") || when.includes("before-sleep")) {
    routine.push({ id: "evening", title: "Evening", steps: evening.length ? evening.map((s) => ({ step: picks.find((p) => p.slug === s)!.step, slug: s })) : [{ step: "Moisturize", slug: slugs.lotion, text: slugs.lotion ? undefined : "Reapply your moisturizer before bed." }] });
  }
  if (slugs.hands) routine.push({ id: "daily", title: "Through the day", steps: [{ step: "Hands", slug: slugs.hands }] });

  const custom: CustomSuggestion[] = [
    {
      buildId: "request-body-lotion",
      why: "Want a body lotion in a texture or fragrance we don't stock? Send a request — we'll confirm what's possible and the price before anything is made.",
      prefill: {
        Texture: { lotion: "Lightweight lotion", gel: "Gel", cream: "Rich cream", oil: "Lightweight lotion", none: "Lightweight lotion" }[t ?? "none"] ?? "Lightweight lotion",
        Fragrance: { free: "Fragrance-free", fresh: "Fresh", floral: "Floral", warm: "Warm", subtle: "Subtle", none: "Subtle" }[scent ?? "none"] ?? "Subtle",
        "When you apply it": { morning: "Morning", "after-bath": "After bathing", evening: "Evening", "before-sleep": "Before sleeping", "as-needed": "Whenever needed" }[when[0] ?? "after-bath"] ?? "After bathing",
        "Ingredients to avoid": avoid.labels.join(", "),
        Size: one(a, "bodySize") === "travel" ? "Travel" : one(a, "bodySize") === "large" ? "Large (if available)" : "Regular",
      },
    },
    ...(want.includes("oil") ? [{ buildId: "request-body-oil", why: "A body oil blend in the weight and scent you prefer — on request.", prefill: { Fragrance: scent === "free" ? "Fragrance-free" : "Subtle", "Ingredients to avoid": avoid.labels.join(", ") } }] : []),
    ...(want.includes("wash") ? [{ buildId: "request-body-wash", why: "A body wash with your preferred lather and scent — on request.", prefill: { Fragrance: scent === "free" ? "Fragrance-free" : "Subtle", "Ingredients to avoid": avoid.labels.join(", ") } }] : []),
  ];
  return {
    flow: "body",
    headline: `A body routine for ${focus.includes("simple") ? "simple, everyday" : concerns.includes("dryness-hydration") ? "comfortable, moisturized" : "everyday"} care.`,
    summary: `${picks.length} CO2 products arranged around when you actually apply them. Explore first — nothing is added to your bag until you choose.`,
    profile: profileFor("body", a),
    routine,
    picks,
    custom,
    excluded: [...excluded].map(([slug, reason]) => ({ slug, reason })),
    notes: [
      scent === "free" ? "Ready-made products list key ingredients only, so we can't confirm they are fragrance-free — check the pack, or request a fragrance-free formula." : "",
      one(a, "bodySize") === "travel" ? "You preferred travel sizes — products with a travel size available are marked below." : "",
      "Patch-test new products on a small area first.",
    ].filter(Boolean),
    start: one(a, "start") ?? "routine",
  };
}

/* ---------------- HAIR ---------------- */

function recommendHair(a: Answers): Omit<Recommendation, "createdAt"> {
  const focus = list(a, "hairFocus");
  const scalp = one(a, "scalp");
  const concerns = [
    ...(focus.includes("flakes") || scalp === "flaky" ? ["dandruff"] : []),
    ...(focus.includes("scalp") || scalp === "oily" ? ["scalp-care"] : []),
    ...(focus.includes("dry-lengths") || scalp === "dry" ? ["dry-damaged"] : []),
    ...(focus.includes("hydration") ? ["hair-hydration"] : []),
    ...(focus.includes("frizz") ? ["frizz"] : []),
  ];
  const avoid = avoidMatchers(a);
  const scent = one(a, "hairScent");
  const ctx: Ctx = { concerns, scent: scent === "fresh" ? "fresh" : scent === "herbal" ? "herbal" : undefined, maxPrice: budgetMax(a.budget), avoid };
  const excluded = new Map<string, string>();
  const taken = new Set<string>();
  const picks: Pick[] = [];
  const add = (step: string, formats: string[], c: Ctx = ctx) => {
    const r = choose(pool(formats), c, excluded, taken);
    if (!r) return undefined;
    taken.add(r.p.slug);
    picks.push({ slug: r.p.slug, step, reasons: withVerified(r.p, r.reasons) });
    return r.p.slug;
  };
  const length = one(a, "length") ?? "balanced";
  const twoInOne = one(a, "washFormat") === "2in1";
  const pre = one(a, "leaveIn") === "prewash" || (length === "detailed" && one(a, "leaveIn") !== "no") || focus.includes("cooling");
  const oil = pre ? add("Pre-wash oil", ["hair-oil"], { ...ctx, concerns: focus.includes("cooling") ? ["scalp-care", ...concerns] : concerns }) : undefined;
  // no hair & body 2-in-1 wash in the current range — a shampoo is suggested either way
  const wash = add("Shampoo", ["shampoo"]);
  const cond = !twoInOne && length !== "simple" ? add("Condition", ["conditioner"]) : undefined;
  const treat = concerns.includes("dandruff") || (concerns.includes("scalp-care") && length !== "simple") ? add("Scalp care", ["scalp-treatment"]) : undefined;
  const style = focus.includes("frizz") && length === "detailed" ? add("Finish", ["styling"]) : undefined;
  const beard = focus.includes("beard") ? add("Beard", ["beard"]) : undefined;
  const leave = one(a, "leaveIn") === "leave-in" && !oil ? add("Light leave-in", ["hair-oil"]) : undefined;

  const routine: RoutineBlock[] = [
    {
      id: "wash",
      title: "Wash day",
      note: oil ? "Oil an hour before washing (or overnight)." : undefined,
      steps: [
        ...(oil ? [{ step: "Pre-wash oil", slug: oil }] : []),
        { step: twoInOne ? "Wash" : "Shampoo", slug: wash },
        ...(cond ? [{ step: "Condition", slug: cond }] : []),
        ...(treat ? [{ step: "Scalp care", slug: treat }] : []),
        ...(leave ? [{ step: "Light leave-in", slug: leave }] : []),
        ...(style ? [{ step: "Finish", slug: style }] : []),
      ].filter((s) => s.slug),
    },
  ];
  if (beard) routine.push({ id: "daily", title: "Daily", steps: [{ step: "Beard", slug: beard }] });

  const custom: CustomSuggestion[] = [
    {
      buildId: "request-shampoo",
      why: "A shampoo set to your scalp and texture — submitted as a request; we confirm feasibility and price first.",
      prefill: {
        "Scalp feel": { oily: "Oily quickly", balanced: "Balanced", dry: "Dry or tight", flaky: "Flaky at times", unsure: "Not sure" }[scalp ?? "unsure"] ?? "Not sure",
        "Hair texture": { straight: "Straight", wavy: "Wavy", curly: "Curly", coily: "Coily" }[one(a, "hairTexture") ?? ""] ?? "Straight",
        Fragrance: { free: "Fragrance-free", fresh: "Fresh", herbal: "Herbal", none: "Subtle" }[scent ?? "none"] ?? "Subtle",
        "Ingredients to avoid": avoid.labels.join(", "),
      },
    },
    { buildId: "request-hair-oil", why: "A hair oil in the weight you like, with or without a cooling feel — on request.", prefill: { Use: one(a, "leaveIn") === "leave-in" ? "Leave-in (light)" : "Pre-wash oil", "Cooling feel (menthol)": focus.includes("cooling") ? "Yes" : "No", "Ingredients to avoid": avoid.labels.join(", ") } },
    ...(!twoInOne ? [{ buildId: "request-conditioner", why: "A conditioner set to your lengths — on request.", prefill: { "Hair texture": { straight: "Straight", wavy: "Wavy", curly: "Curly", coily: "Coily" }[one(a, "hairTexture") ?? ""] ?? "Straight", "Ingredients to avoid": avoid.labels.join(", ") } }] : []),
  ];

  return {
    flow: "hair",
    headline: `A ${length === "detailed" ? "multi-step" : length} wash-day routine${concerns.includes("dandruff") ? " for a flaky-feeling scalp" : concerns.includes("dry-damaged") ? " for dry lengths" : ""}.`,
    summary: `${picks.length} CO2 hair products in the order you'd use them. See the reasons, try samples, or request a formula of your own.`,
    profile: profileFor("hair", a),
    routine,
    picks,
    custom,
    excluded: [...excluded].map(([slug, reason]) => ({ slug, reason })),
    notes: [
      "Cosmetic hair care only. For persistent flaking, itching, redness or hair loss, please speak to a dermatologist.",
      scent === "free" ? "We can't confirm ready-made hair products are fragrance-free from their key ingredients — check the pack, or request a fragrance-free formula." : "",
    ].filter(Boolean),
    start: one(a, "start") ?? "routine",
  };
}

/* ---------------- LIPS ---------------- */

const glossByShade: Record<string, string> = { "Berry Rubin": "gloss-berry-rubin", "Burgundy Spirit": "gloss-burgundy-spirit", "Chocolate Dream": "gloss-chocolate-dream", "Red Kiss": "gloss-red-kiss", "Secret Rose": "gloss-secret-rose" };

function recommendLips(a: Answers): Omit<Recommendation, "createdAt"> {
  const product = one(a, "lipProduct") ?? "gloss";
  const focus = list(a, "lipFocus");
  const avoid = avoidMatchers(a);
  const excluded = new Map<string, string>();
  const picks: Pick[] = [];
  const glosses = products.filter((p) => fmt(p) === "lip-gloss");
  for (const g of glosses) {
    const hit = avoid.test(g);
    if (hit) excluded.set(g.slug, `Contains ${hit.toLowerCase()}, which you asked to avoid.`);
  }
  const okGlosses = glosses.filter((g) => !excluded.has(g.slug));
  const colour = one(a, "lipColour");
  if (product === "gloss" || focus.includes("colour")) {
    const chosen = colour && glossByShade[colour] ? okGlosses.filter((g) => g.slug === glossByShade[colour]) : okGlosses;
    for (const g of chosen) {
      picks.push({
        slug: g.slug,
        step: "Colour & shine",
        reasons: [
          { kind: "verified", text: `${g.shades[0]?.name} — ${g.shortDescription.toLowerCase()} With ${ingNames(g)}.` },
          ...(focus.some((f) => ["moisture", "comfort", "smooth"].includes(f)) ? [{ kind: "verified" as const, text: "Vitamin E, jojoba oil and shea butter are listed in the formula." }] : []),
          ...(colour === g.shades[0]?.name ? [{ kind: "preference" as const, text: "The shade you picked." }] : []),
        ],
      });
    }
  }
  const finishMap: Record<string, string> = { matte: "Matte", natural: "Natural", satin: "Satin", dewy: "Dewy" };
  const texMap: Record<string, string> = { lightweight: "Fluid", creamy: "Cream", rich: "Balm", glossy: "Fluid" };
  const custom: CustomSuggestion[] = [];
  if (product !== "balm") {
    custom.push({
      buildId: "custom-lip",
      why: product === "lip-colour" ? "Your colour family, intensity, finish and scent — made to order and confirmed with you before it's prepared." : "Prefer a colour family or finish outside the CO2 gloss shades? Lip colour can be made to order.",
      prefill: {
        "Colour family": colour && !glossByShade[colour] && colour !== "unsure" ? colour : colour === "Berry Rubin" ? "Berry" : colour === "Chocolate Dream" ? "Nude" : colour === "Burgundy Spirit" ? "Berry" : colour === "Red Kiss" ? "Red" : colour === "Secret Rose" ? "Rose" : "",
        Intensity: focus.includes("tint") ? "Sheer" : focus.includes("colour") ? "Bold" : "Buildable",
        Finish: finishMap[one(a, "lipFinish") ?? ""] ?? "Satin",
        Texture: texMap[one(a, "lipTexture") ?? ""] ?? "Cream",
        Scent: one(a, "lipFragrance") === "yes" ? "Fragrance-free" : "Light botanical",
        "Ingredient preferences": avoid.labels.length ? `Avoid: ${avoid.labels.join(", ")}` : "",
        ...(one(a, "lipPack") && one(a, "lipPack") !== "later" && one(a, "lipPack") !== "wand" ? { _container: String(one(a, "lipPack")) } : {}),
      },
    });
  }
  if (product === "balm" || focus.includes("moisture") || focus.includes("comfort")) {
    custom.push({
      buildId: "request-lip-balm",
      why: "CO2 doesn't stock a lip balm yet. Request one — clear or sheer tint, in your preferred texture — and we'll confirm feasibility and price.",
      prefill: {
        Tint: one(a, "lipFinish") === "tinted" ? "Sheer tint" : "No colour",
        Texture: { lightweight: "Lightweight", creamy: "Smooth and creamy", rich: "Rich and nourishing" }[one(a, "lipTexture") ?? ""] ?? "Smooth and creamy",
        Fragrance: one(a, "lipFragrance") === "yes" ? "Fragrance-free" : "No preference",
        "Ingredients to avoid": avoid.labels.join(", "),
      },
    });
  }
  const g = picks[0]?.slug;
  const routine: RoutineBlock[] = [
    {
      id: "daily",
      title: "Every day",
      steps: [
        ...(product === "balm" || focus.includes("moisture") || focus.includes("comfort") ? [{ step: "Care", buildId: "request-lip-balm", text: "A lip balm through the day (on request — or your current balm)." }] : []),
        ...(g ? [{ step: "Colour & shine", slug: g }] : []),
        ...(product === "lip-colour" ? [{ step: "Colour", buildId: "custom-lip", text: "Your made-to-order lip colour — apply from the centre outward, blot for a stain or layer for intensity." }] : []),
      ],
    },
  ];
  if (picks.length > 1) routine.push({ id: "evening", title: "Evening", steps: [{ step: "Deeper shade", slug: picks[picks.length - 1].slug }] });
  return {
    flow: "lips",
    headline: product === "gloss" && !picks.length ? "Our glosses don't fit your ingredient preferences — here's what we can make instead." : product === "gloss" ? "High-shine colour, matched to what you like." : product === "lip-colour" ? "A lip colour made around your finish and colour family." : "A daily lip-care product, on request.",
    summary: "Lip care and lip colour only — try every gloss shade on your own face before you decide.",
    profile: profileFor("lips", a),
    routine,
    picks,
    custom,
    excluded: [...excluded].map(([slug, reason]) => ({ slug, reason })),
    notes: [
      "Travel-size samples aren't offered for lip products. Use the virtual try-on (camera or photo, processed on your device) to compare shades.",
      one(a, "lipFragrance") === "yes" ? "We can't confirm the ready-made glosses are fragrance-free from their key ingredients — made-to-order lip colour can be made fragrance-free." : "",
    ].filter(Boolean),
    start: one(a, "start") ?? "routine",
  };
}

/* ---------------- MAKEUP ---------------- */

export function recommend(flow: FlowId, a: Answers, now = new Date()): Recommendation {
  const fn = { face: recommendFace, body: recommendBody, hair: recommendHair, lips: recommendLips }[flow];
  const r = fn(a);
  // drop custom suggestions whose build product no longer exists
  r.custom = r.custom.filter((c) => !!getBuildProduct(c.buildId));
  return { ...r, createdAt: now.toISOString() };
}

export function sampleSlugs(r: Recommendation) {
  return r.picks.map((p) => p.slug).filter((s) => !!sampleFor(s));
}
