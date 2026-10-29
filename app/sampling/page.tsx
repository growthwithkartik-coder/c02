import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LineReveal, Reveal } from "@/components/animations/motion";
import { AddSampleSetButton } from "@/components/commerce/AddButtons";
import { SampleStudio } from "@/components/commerce/SampleStudio";
import { Breaker } from "@/components/brand/Breakers";
import { TrustStrip } from "@/components/brand/Strips";
import { Accordion, Breadcrumbs } from "@/components/ui/primitives";
import { sampling } from "@/data/sampling";
import { site } from "@/data/site";
import { getProduct } from "@/lib/catalog";
import { sampleFor, setPrice } from "@/lib/commerce";
import { cutoutImage, money, productImage, PRICES_ON_REQUEST } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Sampling Studio — travel sizes & sample sets",
  description: "Try CO2 skin, body and hair formulas in travel sizes before choosing the full size. Curated sample sets or build your own.",
  alternates: { canonical: "/sampling" },
};

export default function SamplingPage() {
  if (!sampling.enabled) notFound();
  const prices = Object.values(sampling.items).map((s) => s.price);
  const faqs = [
    { q: "Are samples free?", a: PRICES_ON_REQUEST ? "No. Travel-size prices are on request, as per the samples and quantities you choose — tap “Request price” and we'll send you a quote." : `No — travel sizes are priced from ${money(Math.min(...prices))} to ${money(Math.max(...prices))}, and the price is shown before you add anything to your bag.` },
    { q: "Is a travel size the same formula?", a: "Yes. A travel size is a smaller pack of the same product — same formula, same ingredients." },
    { q: "How do samples ship?", a: sampling.shippingNote + ` Orders over ${money(site.commerce.freeShippingThreshold)} ship free; otherwise ${money(site.commerce.shippingFee)}. Dispatched in ${site.commerce.dispatchDays}.` },
    { q: "Does the sample price come off the full size?", a: sampling.creditTowardsFullSize ? "Yes." : "No. Sample prices aren't credited towards a later full-size purchase." },
    { q: "Which products have travel sizes?", a: `${Object.keys(sampling.items).length} skin, body and hair products. Lip products and made-to-order formulas aren't offered as samples — lip shades can be tried on virtually instead.` },
    { q: "How many samples can I order?", a: `Up to ${sampling.maxQtyPerSample} of each sample per order. A sample set holds ${sampling.minPerSet}–${sampling.maxPerSet} different travel sizes.` },
  ];
  return (
    <>
      <section className="relative overflow-hidden bg-stone pb-16 pt-[calc(var(--nav-h)+1.5rem)]">
        <div className="container-site">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sampling Studio" }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-ink-soft">Travel sizes & sample sets</p>
              <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9]">
                <LineReveal immediate lines={["The Sampling", <span key="s" className="italic">Studio.</span>]} />
              </h1>
              <p className="mt-6 max-w-xl text-lg text-ink-soft">Discover your next favourite before committing to the full size. Explore travel-size products, test different textures, and choose what works for your routine.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#travel-sizes" className="btn btn-primary">Browse travel sizes</a>
                <a href="#sets" className="btn btn-outline">See sample sets</a>
              </div>
            </div>
            <ul className="flex items-end justify-center gap-4 lg:col-span-5" aria-hidden>
              {["noir-charcoal-mask", "goat-milk-herbal-bar", "coco-glow-body-lotion", "scalp-clear-hair-oil"].map((s, i) => (
                <li key={s} className="relative" style={{ width: ["5.5rem", "6.5rem", "7rem", "6rem"][i], aspectRatio: "3/4" }}>
                  <Image src={cutoutImage(s)} alt="" fill sizes="120px" className="object-contain object-bottom drop-shadow-[0_18px_18px_rgba(17,16,13,.25)]" priority={i === 0} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="container-site py-section" aria-labelledby="how">
        <h2 id="how" className="sr-only">How sampling works</h2>
        <ol className="grid gap-px bg-line md:grid-cols-4">
          {[
            ["01", "Pick travel sizes", "Choose single samples, a curated set, or build your own set of 3–5."],
            ["02", "See the price", "Every travel size shows its net weight and price; a set is the sum of its samples."],
            ["03", "Try the texture", "Use it for a few days as part of your routine."],
            ["04", "Go full size", "Every sample links straight to its full-size product — or customize from it."],
          ].map(([n, t, b]) => (
            <li key={n} className="bg-bone p-7">
              <span className="font-display text-4xl text-taupe/60">{n}</span>
              <p className="mt-4 font-display text-2xl">{t}</p>
              <p className="mt-2 text-sm text-ink-soft">{b}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* sets */}
      <section id="sets" className="scroll-mt-[calc(var(--nav-h)+1rem)] bg-bone-2 py-section" aria-labelledby="sets-title">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow text-taupe">Curated sample sets</p>
              <h2 id="sets-title" className="mt-3 font-display text-display-md">Sets organized by <span className="italic">routine.</span></h2>
            </div>
            <p className="text-sm text-ink-soft md:col-span-4 md:col-start-9">Including the Travel Beauty Kit — one of each step for a short trip.</p>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sampling.sets.map((s, i) => (
              <Reveal as="li" key={s.id} delay={(i % 3) * 0.05} className={i === sampling.sets.length - 1 ? "flex flex-col bg-carbon p-6 text-bone" : "flex flex-col bg-bone p-6"}>
                <p className="text-[0.6875rem] uppercase tracking-[0.16em] opacity-60">{s.category === "travel" ? "Travel kit" : s.category === "skin" ? "Face & Skin" : s.category === "body" ? "Body" : "Hair"} · {s.slugs.length} samples</p>
                <p className="mt-2 font-display text-3xl leading-none">{s.name}</p>
                <p className="mt-2 text-sm opacity-75">{s.description}</p>
                <ul className="mt-5 space-y-2 border-t border-current/10 pt-4 text-sm">
                  {s.slugs.map((slug) => {
                    const p = getProduct(slug)!;
                    const sm = sampleFor(slug)!;
                    return (
                      <li key={slug} className="flex items-center gap-3">
                        <span className="relative h-10 w-10 shrink-0 bg-bone-2"><Image src={productImage(p.images[0], 640)} alt="" fill sizes="40px" className="object-contain" /></span>
                        <Link href={`/product/${slug}`} className="flex-1 leading-tight hover:underline">{p.name}<span className="block text-xs opacity-60">{sm.size}</span></Link>
                        {!PRICES_ON_REQUEST && <span className="tabular-nums opacity-80">{money(sm.price)}</span>}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-auto pt-6">
                  <AddSampleSetButton name={s.name} slugs={s.slugs} className="w-full" dark={i === sampling.sets.length - 1} />
                  <p className="mt-2 text-center text-xs opacity-60">{PRICES_ON_REQUEST ? "Price on request · as per customization" : `${money(setPrice(s.slugs))} = sum of the samples`}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* all travel sizes + builder */}
      <section id="travel-sizes" className="container-site scroll-mt-[calc(var(--nav-h)+1rem)] py-section" aria-labelledby="ts">
        <p className="eyebrow text-taupe">Every travel size</p>
        <h2 id="ts" className="mb-10 mt-3 font-display text-display-md">Build your own <span className="italic">sample set.</span></h2>
        <Suspense>
          <SampleStudio />
        </Suspense>
      </section>

      <Breaker id="rules" />

      <section className="container-site grid gap-10 py-section lg:grid-cols-12" aria-labelledby="sfaq">
        <div className="lg:col-span-4">
          <p className="eyebrow text-taupe">Sampling questions</p>
          <h2 id="sfaq" className="mt-3 font-display text-display-sm">Before you sample</h2>
          <Link href="/guides/sampling" className="mt-4 inline-block text-sm underline underline-offset-4">Read the sampling guide</Link>
        </div>
        <div className="lg:col-span-8"><Accordion items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} defaultOpen={0} /></div>
      </section>
      <TrustStrip />
    </>
  );
}
