import { site } from "@/data/site";
import { combos } from "@/data/combos";
import { productFormat } from "@/data/taxonomy";
import { customizationFor, sampleFor } from "@/lib/commerce";
import { concernsOf, getConcern, formatLabel } from "@/lib/taxonomy";
import { isPricePending, money, PRICES_ON_REQUEST } from "@/lib/utils";
import type { Product } from "@/types";

/* ------------------------------------------------------------------
   Product page content derived ONLY from data/products.ts (and the
   site / sampling / customization config). No new claims are written
   here — every sentence is assembled from fields that already exist.
------------------------------------------------------------------- */

const stepByFormat: Record<string, { step: string; order: string }> = {
  "face-wash": { step: "Cleanse", order: "Step 1 of a face routine — before serum and moisturizer." },
  serum: { step: "Treat", order: "After cleansing and before moisturizer." },
  "treatment-cream": { step: "Treat", order: "After cleansing; on its own or before a moisturizer." },
  moisturizer: { step: "Moisturize", order: "After cleansing and any serum — the last care step before sunscreen in the morning." },
  sunscreen: { step: "Protect", order: "The last step of your morning routine; reapply through the day." },
  "face-mask": { step: "Weekly mask", order: "Once or twice a week on clean skin, before serum and moisturizer." },
  scrub: { step: "Polish", order: "Two or three times a week on clean, damp skin, then rinse and moisturize." },
  "body-lotion": { step: "Moisturize", order: "After bathing, on slightly damp skin." },
  "body-gel": { step: "Soothe", order: "Any time, on clean skin." },
  "body-wash": { step: "Wash", order: "In the shower, before body moisturizer." },
  "bath-bar": { step: "Wash", order: "In the shower or bath, before body moisturizer." },
  shampoo: { step: "Shampoo", order: "Wash day — after any pre-wash oil." },
  "hair-oil": { step: "Pre-wash oil", order: "Before washing (an hour or overnight), or a little on lengths." },
  "scalp-treatment": { step: "Scalp care", order: "On the scalp, as directed — usually before washing." },
  beard: { step: "Beard", order: "Daily, after washing." },
  "lip-gloss": { step: "Lips", order: "Any time — layer for more colour." },
  lipstick: { step: "Lips", order: "Any time — on clean, moisturized lips." },
  "lip-colour": { step: "Lips", order: "Any time — blot for a stain or layer for intensity." },
};

export function routinePlace(p: Product) {
  const f = productFormat[p.slug] ?? p.type;
  return stepByFormat[f] ?? { step: formatLabel(f), order: "" };
}

/** Morning / evening / weekly, read from the product's own usage text. */
export function whenToUse(p: Product) {
  const t = p.howToUse.join(" ").toLowerCase();
  if (/once or twice a week|two or three times a week|1–2|weekly/.test(t)) return "Weekly";
  if (/morning and evening|morning or evening|twice daily|morning and\/or|once or twice daily/.test(t)) return "Morning & evening";
  if (/best in the morning|in the morning/.test(t)) return "Morning";
  if (/nightly|evening|before bed/.test(t)) return "Evening";
  if (/daily/.test(t)) return "Daily";
  if (/as needed|as often|any time|reapply/.test(t)) return "As needed";
  return null;
}

/** Usage cautions that are printed in the product's own directions. */
export function cautions(p: Product) {
  const out = new Set<string>();
  for (const s of p.howToUse) {
    if (/avoid|sunscreen|patch|shake|eye/i.test(s)) out.add(s.replace(/\.$/, "") + ".");
  }
  return [...out];
}

export function concernLabels(p: Product) {
  return concernsOf(p.slug).map((c) => getConcern(c)?.label).filter(Boolean) as string[];
}

export function combosFor(p: Product) {
  return combos.filter((c) => c.items.some((i) => i.slug === p.slug));
}

export function productFaqs(p: Product) {
  const c = site.commerce;
  const s = sampleFor(p.slug);
  const cz = customizationFor(p);
  const when = whenToUse(p);
  const place = routinePlace(p);
  const faqs: { q: string; a: string }[] = [
    { q: `How do I use ${p.name}?`, a: `${p.howToUse.join(" ")}${place.order ? ` Where it fits: ${place.order}` : ""}` },
    { q: "What are the key ingredients?", a: p.custom ? "Your formula is built from the options you choose; the final ingredient list is declared on your formula card." : `${p.ingredients.map((i) => `${i.name} (${i.note.charAt(0).toLowerCase() + i.note.slice(1)})`).join("; ")}. These are the key ingredients printed on the pack — see the pack for the full ingredient list.` },
    { q: "How much does it cost?", a: isPricePending(p) ? `The price is on request and as per your customization — it depends on the size, formula, packaging and quantity you choose. Tap “Request price” or message us on WhatsApp and we'll send you a quote.` : `${money(p.price)} for ${p.size}.` },
    { q: "What size is it?", a: `${p.size}.${s ? ` A travel size (${s.size}) is also available${PRICES_ON_REQUEST ? " — price on request" : ` for ${money(s.price)}`}.` : ""}` },
    ...(when ? [{ q: "When should I use it?", a: `${when}, according to the directions on the pack.` }] : []),
    {
      q: "Can I customize it?",
      a: cz
        ? cz.mode === "listed"
          ? `Yes — ${p.custom ? "this formula is made to order." : `you can start a ${cz.label.toLowerCase()} from this product in Make It Yours.`} Choose the formula options and packaging, and we confirm the price and the details with you before it's prepared.`
          : `You can send a request for a ${cz.label.toLowerCase()} based on your preferences. We reply with what's possible and a price before anything is made.`
        : "This product isn't customizable at the moment. The consultations in Make It Yours can still suggest where it fits in your routine.",
    },
    ...(s ? [{ q: "Is there a travel size?", a: `Yes — ${s.size}${PRICES_ON_REQUEST ? " (price on request)" : ` for ${money(s.price)}`}. Choose “Travel size” above or visit the Sampling Studio.` }] : []),
    { q: "How long does shipping take?", a: `Orders are dispatched in ${c.dispatchDays} and delivered in ${c.deliveryDays}. Shipping is free over ${money(c.freeShippingThreshold)}; otherwise ${money(c.shippingFee)}.${p.custom ? " Made-to-order formulas are prepared first — see the preparation time above." : ""}` },
    { q: "Can I return it?", a: p.custom ? "Made-to-order formulas are prepared for you and can't be returned unless they arrive damaged or incorrect." : `Unopened products can be returned within ${c.returnWindowDays} days of delivery. See the returns policy for details.` },
  ];
  return [...faqs, ...(p.custom?.faq ?? [])];
}
