import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { AddSampleButton } from "@/components/commerce/AddButtons";
import { ComboFeature } from "@/components/home/HomeEditorial";
import { Breaker, type BreakerId } from "@/components/brand/Breakers";
import { Accordion } from "@/components/ui/primitives";
import { combos, type ComboGroup } from "@/data/combos";
import { buildProducts } from "@/data/customize";
import { sampling } from "@/data/sampling";
import type { DepartmentId } from "@/data/taxonomy";
import { getIngredientLibrary, getProduct } from "@/lib/catalog";
import { primaryDepartment, productsInDepartment } from "@/lib/taxonomy";
import { sampleFor } from "@/lib/commerce";
import { money, productImage, priceText } from "@/lib/utils";

/* Below-the-grid content for a category page: ingredient education,
   featured routines, travel sizes, category FAQs and a customization CTA.
   Everything is derived from the catalogue / config. */

const comboGroupsFor: Record<DepartmentId, ComboGroup[]> = { skin: ["essentials", "face"], hair: ["hair"], body: ["body"], lips: ["lips"] };
const flowFor: Record<DepartmentId, string> = { skin: "face", hair: "hair", body: "body", lips: "lips" };
const breakerFor: Record<DepartmentId, BreakerId> = { skin: "samples", hair: "questions", body: "rules", lips: "personal" };

const faqsFor: Record<DepartmentId, { q: string; a: string }[]> = {
  skin: [
    { q: "How do I choose between a serum and a treatment cream?", a: "Serums are fluid and layer under moisturizer; treatment creams (like the Acne n Pimple Cream) can be used on their own or under a moisturizer. The Face & Skin consultation suggests where each fits." },
    { q: "Do you make sunscreen?", a: "Yes — Sunscreen Lotion SPF 50+ (daily sun protection lotion) and a Moisturizing Cream with SPF. Apply generously and reapply through the day." },
    { q: "Can I shop by skin concern?", a: "Yes — use the concern filter. Concerns are grouped from each product's listed ingredients and pack text; they're cosmetic groupings, not medical claims." },
  ],
  hair: [
    { q: "Which products are for a flaky scalp?", a: "The anti-dandruff line — hair oil, shampoo and treatment gel — with neem, tea tree and piroctone olamine. For persistent flaking or itching, see a dermatologist." },
    { q: "Do you have products for hair fall?", a: "The onion, herbal and shikakai shampoos and the onion hair oil list \u201cstrengthens · promotes growth · reduces hair fall\u201d on the pack. These are cosmetic pack descriptions, not medical claims — for persistent hair loss, see a dermatologist." },
    { q: "Are shampoos and hair oils grouped together?", a: "Yes — use the Shampoos and Hair oils sections at the top of this page, or filter by product type." },
  ],
  body: [
    { q: "Which body lotion is lightest?", a: "The Body Moisturizing Lotions (Aloe Fresh, Coco Glow and Herbal) are light; the Breast Cream is richer. Filter by product type or try travel sizes first." },
    { q: "Are there travel sizes for body care?", a: "Yes — several lotions, gels and washes come in travel sizes. Body soaps don't." },
    { q: "Can I get a body lotion made my way?", a: "You can send a request for a custom body lotion, oil or wash in Make It Yours. We reply with what's possible and a price first." },
  ],
  lips: [
    { q: "Can I try shades before buying?", a: "Yes — the virtual try-on works with your camera or a photo, entirely in your browser." },
    { q: "Are lip samples available?", a: "No, lip products aren't offered as samples. Use the try-on to compare shades." },
    { q: "Can I get a different colour?", a: "Lip colour can be made to order in your colour family, intensity and finish." },
  ],
};

export function CategoryExtras({ dept }: { dept: DepartmentId }) {
  const products = productsInDepartment(dept);
  const slugs = new Set(products.map((p) => p.slug));
  const ings = getIngredientLibrary()
    .map((e) => ({ ...e, products: e.products.filter((p) => slugs.has(p.slug)) }))
    .filter((e) => e.products.length >= 2)
    .slice(0, 6);
  const routines = combos.filter((c) => comboGroupsFor[dept].includes(c.group) && c.items.some((i) => { const p = getProduct(i.slug); return p && primaryDepartment(p) === dept; })).slice(0, 2);
  const samples = sampling.enabled ? products.filter((p) => sampleFor(p.slug)).slice(0, 8) : [];
  const builds = buildProducts.filter((b) => ({ skin: ["face"], hair: ["hair"], body: ["body"], lips: ["lips"] } as Record<DepartmentId, string[]>)[dept].includes(b.category));

  return (
    <>
      {ings.length > 0 && (
        <section className="border-t border-line bg-bone-2 py-section" aria-labelledby="cat-ings">
          <div className="container-site grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-taupe">Ingredient notes</p>
              <h2 id="cat-ings" className="mt-3 font-display text-display-sm">What you&apos;ll find in this category.</h2>
              <p className="mt-3 text-sm text-ink-soft">The key ingredients that appear most across these products, and their role as described on the packs.</p>
              <Link href="/ingredients" className="mt-5 inline-block text-sm underline underline-offset-4">Full ingredient guide</Link>
            </div>
            <ul className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
              {ings.map((e) => (
                <li key={e.name} className="bg-bone-2 p-5">
                  <p className="font-display text-2xl leading-tight">{e.name}</p>
                  <p className="mt-1 text-xs text-taupe">in {e.products.length} products here</p>
                  <p className="mt-2 text-sm text-ink-soft">{e.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {routines.length > 0 && (
        <section className="container-site py-section" aria-labelledby="cat-routines">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-taupe">Featured routines</p>
              <h2 id="cat-routines" className="mt-3 font-display text-display-sm">Ready-made routines</h2>
            </div>
            <Link href="/combos" className="btn btn-outline btn-sm">All combos</Link>
          </div>
          <ul className="grid gap-5 md:grid-cols-2">{routines.map((c, i) => <li key={c.slug}><ComboFeature combo={c} dark={i === 1} className="h-full" /></li>)}</ul>
        </section>
      )}

      {samples.length > 0 && (
        <section className="bg-stone py-section" aria-labelledby="cat-samples">
          <div className="container-site">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow text-ink-soft">Travel sizes</p>
                <h2 id="cat-samples" className="mt-3 font-display text-display-sm">Try it small first.</h2>
              </div>
              <Link href={`/sampling?cat=${dept}`} className="btn btn-primary btn-sm">Sampling Studio</Link>
            </div>
            <ul className="no-scrollbar -mx-gutter flex gap-4 overflow-x-auto px-gutter pb-2">
              {samples.map((p) => {
                const s = sampleFor(p.slug)!;
                return (
                  <li key={p.slug} className="w-56 shrink-0 bg-bone p-4">
                    <Link href={`/product/${p.slug}`} className="relative block aspect-square bg-bone-2"><Image src={productImage(p.images[0], 640)} alt={p.name} fill sizes="224px" className="object-contain" /></Link>
                    <p className="mt-3 text-sm leading-tight">{p.name}</p>
                    <p className="text-xs text-taupe">{s.size} · {priceText(s.price)}</p>
                    <AddSampleButton slug={p.slug} compact className="mt-3 w-full" />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="container-site grid gap-10 py-section lg:grid-cols-12" aria-labelledby="cat-faq">
        <div className="lg:col-span-4">
          <p className="eyebrow text-taupe">Questions</p>
          <h2 id="cat-faq" className="mt-3 font-display text-display-sm">About this category</h2>
        </div>
        <div className="lg:col-span-8"><Accordion items={faqsFor[dept].map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} defaultOpen={null} /></div>
      </section>

      <section className="container-site pb-section" aria-labelledby="cat-cz">
        <div className="grid gap-8 bg-carbon p-7 text-bone md:grid-cols-12 md:items-center md:p-12">
          <div className="md:col-span-7">
            <p className="eyebrow text-gold-light">Make It Yours</p>
            <h2 id="cat-cz" className="mt-3 font-display text-display-sm">Not sure where to start?</h2>
            <p className="mt-3 max-w-lg text-bone/70">Answer the consultation for this category and see a routine first — then customize a {(() => { const l = builds.map((b) => b.label.replace("Custom ", "").toLowerCase()).slice(0, 3); return l.length > 1 ? `${l.slice(0, -1).join(", ")} or ${l[l.length - 1]}` : l[0]; })()}{builds.length > 3 ? " and more" : ""}.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <Link href={`/make-it-yours/${flowFor[dept]}`} className="btn btn-gold"><Sparkles className="h-4 w-4" /> Start the consultation</Link>
            <Link href="/make-it-yours/build" className="btn btn-outline-light">Open the builder</Link>
          </div>
        </div>
      </section>

      <Breaker id={breakerFor[dept]} />
    </>
  );
}
