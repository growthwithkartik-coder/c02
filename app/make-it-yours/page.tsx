import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, FileCheck2, Package, ShieldCheck } from "lucide-react";
import { LineReveal, Reveal } from "@/components/animations/motion";
import { Breaker } from "@/components/brand/Breakers";
import { FlowStatus } from "@/components/miy/FlowStatus";
import { Accordion } from "@/components/ui/primitives";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildProducts, containers } from "@/data/customize";
import { flows } from "@/lib/customize/flows";
import { getProduct } from "@/lib/catalog";
import { site } from "@/data/site";
import { cutoutImage, money, productImage, priceText } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Make It Yours — personalized skincare & cosmetics",
  description: "Choose Face & Skin, Hair, Body or Lips, answer a short consultation, see a suggested routine before you buy, then personalize products and packaging.",
  alternates: { canonical: "/make-it-yours" },
};

const faqs = [
  { q: "Is this a skin diagnosis?", a: "No. CO2 consultations capture cosmetic preferences and suggest products from our range. They don't diagnose or treat skin, scalp or hair conditions. If you have a condition, please speak to a dermatologist." },
  { q: "Do I have to buy something to see my routine?", a: "No. Your suggested routine appears as soon as you finish the consultation. Buying — a sample, a full size or a custom formula — is always a separate step." },
  { q: "What's the difference between a recommendation and a custom formula?", a: "A recommendation picks existing CO2 products that match your answers. A custom formula is made to order from the options you choose in the builder, and is confirmed with you before it's prepared." },
  { q: "What does “on request” mean?", a: "Some formulas (body lotion, shampoo, lip balm and others) aren't in our catalogue yet. You can still describe what you'd like and send a request — we reply with what's possible, the price and the timeline. Nothing is charged when you send a request." },
  { q: "Where are my answers stored?", a: "In this browser, on this device, so you can leave and come back. Answers are only sent to us if you submit a customization request or place an order." },
  { q: "Can I change my answers?", a: "Yes — edit any answer from the review screen or your results page, and retake a consultation whenever your preferences change." },
];

export default function MakeItYoursPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />

      {/* hero */}
      <section className="relative overflow-hidden bg-carbon pb-16 pt-[calc(var(--nav-h)+3rem)] text-bone grain md:pb-24">
        <div className="pointer-events-none absolute -right-[10%] top-0 h-full w-[60%] bg-[radial-gradient(closest-side,rgba(184,146,79,.25),transparent)]" aria-hidden />
        <div className="container-site relative grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold-light">Make It Yours</p>
            <h1 className="mt-6 font-display text-[clamp(3rem,7.4vw,7rem)] leading-[0.88] tracking-[-0.03em]">
              <LineReveal immediate lines={["We make it", <span key="y" className="italic text-gold-light">for you.</span>]} />
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-bone/75">Tell us what you need. We&apos;ll help you discover the right routine, personalize your products and choose your packaging — and only then will you place an order for something made for you.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#start" className="btn btn-gold btn-lg">Choose a category</a>
              <Link href="/make-it-yours/build" className="btn btn-outline-light btn-lg">Go straight to the builder</Link>
            </div>
          </div>
          <div className="relative hidden h-[460px] lg:col-span-5 lg:block" aria-hidden>
            <div className="absolute inset-x-[8%] bottom-0 top-[6%] rounded-t-[999px] border border-line-dark bg-gradient-to-b from-carbon-3 to-carbon" />
            <Image src={cutoutImage("24k-gold-face-elixir")} alt="" width={340} height={500} className="absolute bottom-0 left-1/2 h-[82%] w-auto -translate-x-1/2 object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.6)]" />
          </div>
        </div>
      </section>

      {/* step 1 — category */}
      <section id="start" className="scroll-mt-[calc(var(--nav-h)+1rem)] bg-bone py-section" aria-labelledby="choose">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="eyebrow text-taupe">Step 1</p>
              <h2 id="choose" className="mt-3 font-display text-display-md">What would you like to <span className="italic text-gold-deep">make yours?</span></h2>
            </div>
            <p className="text-sm text-ink-soft md:col-span-4">Each category has its own consultation — lip questions for lips, scalp questions for hair. Nothing is shared between them unless it genuinely applies.</p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flows.map((f, i) => (
              <Reveal as="li" key={f.id} delay={i * 0.05}>
                <div className="group relative flex h-full flex-col border border-line bg-bone transition-colors hover:border-ink">
                  <div className="relative aspect-[4/5] overflow-hidden bg-bone-2">
                    <Image src={productImage(f.image, 640)} alt="" fill sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 19vw" className="object-contain" />
                    <span className="absolute left-3 top-3 bg-bone/90 px-2 py-1 text-[0.625rem] uppercase tracking-[0.16em]">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-3xl leading-none">
                      <Link href={`/make-it-yours/${f.id}`} className="after:absolute after:inset-0">{f.label}</Link>
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-taupe">{f.kicker}</p>
                    <p className="mt-3 text-sm text-ink-soft">{f.covers}</p>
                    <FlowStatus flow={f.id} />
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-medium uppercase tracking-[0.16em] group-hover:text-gold-deep">Start <ArrowRight className="h-3.5 w-3.5" /></span>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* how it works */}
      <section className="border-y border-line bg-bone-2 py-section" aria-labelledby="how">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-taupe">How it works</p>
            <h2 id="how" className="mt-3 font-display text-display-sm">Routine first. Purchase later — if you want.</h2>
            <p className="mt-4 text-sm text-ink-soft">The recommendation and the purchase are separate steps. You can explore a routine, save it and come back without buying anything.</p>
          </div>
          <ol className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-8">
            {[
              ["01", "Tell us about you", "A short, category-specific consultation — one question at a time, saved as you go."],
              ["02", "Discover your routine", "Morning, evening and weekly steps from real CO2 products, with the reason for every pick."],
              ["03", "Personalize", "Swap a step for a made-to-order formula: base, texture, shade, scent, ingredients — and packaging."],
              ["04", "Confirm", "Send your choices and we reply with the price (as per your customization) and the preparation time — nothing is made until you agree."],
            ].map(([n, t, b]) => (
              <li key={n} className="bg-bone-2 p-7">
                <span className="font-display text-4xl text-taupe/60">{n}</span>
                <p className="mt-4 font-display text-2xl">{t}</p>
                <p className="mt-2 text-sm text-ink-soft">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* what can be customized */}
      <section className="container-site py-section" aria-labelledby="what">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow text-taupe">What you can personalize</p>
            <h2 id="what" className="mt-3 font-display text-display-sm">Made to order — or made on request.</h2>
          </div>
          <Link href="/make-it-yours/build" className="btn btn-primary self-start md:col-span-5 md:justify-self-end">Open the builder <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="bg-carbon p-7 text-bone md:p-9">
            <p className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-gold-light"><FileCheck2 className="h-4 w-4" /> Made to order · price on request</p>
            <ul className="mt-5 divide-y divide-line-dark">
              {buildProducts.filter((b) => b.mode === "listed").map((b) => {
                const p = getProduct(b.slug!);
                return (
                  <li key={b.id}>
                    <Link href={`/make-it-yours/build?product=${b.id}`} className="group flex items-center justify-between gap-4 py-3.5">
                      <span>
                        <span className="block font-display text-2xl group-hover:text-gold-light">{b.label}</span>
                        <span className="text-xs text-bone/50">{b.containers.map((c) => containers[c].label).join(" · ")}</span>
                      </span>
                      <span className="text-sm text-bone/60">{p ? priceText(p.price) : ""}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="border border-line p-7 md:p-9">
            <p className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-taupe"><Package className="h-4 w-4" /> On request · quoted first</p>
            <ul className="mt-5 divide-y divide-line">
              {buildProducts.filter((b) => b.mode === "request").map((b) => (
                <li key={b.id}>
                  <Link href={`/make-it-yours/build?product=${b.id}`} className="group flex items-center justify-between gap-4 py-3.5">
                    <span>
                      <span className="block font-display text-2xl group-hover:text-gold-deep">{b.label}</span>
                      <span className="text-xs text-taupe">{b.blurb}</span>
                    </span>
                    <span className="text-xs uppercase tracking-[0.14em] text-taupe">Quote</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className="mt-10 grid gap-4 text-sm sm:grid-cols-3">
          <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-gold-deep" strokeWidth={1.4} /> Made-to-order formulas are prepared in 5–8 working days after we confirm them with you.</li>
          <li className="flex gap-3"><Package className="h-5 w-5 shrink-0 text-gold-deep" strokeWidth={1.4} /> Choose from the containers, colours and caps made for each product — preview them in 3D.</li>
          <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-gold-deep" strokeWidth={1.4} /> Cosmetic personalization only — no medical claims, no invented results.</li>
        </ul>
      </section>

      <Breaker id="questions" />

      {/* faq */}
      <section className="container-site grid gap-10 py-section lg:grid-cols-12" aria-labelledby="faq">
        <div className="lg:col-span-4">
          <p className="eyebrow text-taupe">Questions</p>
          <h2 id="faq" className="mt-3 font-display text-display-sm">Before you start</h2>
          <p className="mt-4 text-sm text-ink-soft">Something else? <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noreferrer" className="underline">Message us on WhatsApp</a>.</p>
        </div>
        <div className="lg:col-span-8">
          <Accordion items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} defaultOpen={0} />
          <p className="mt-6 text-xs text-taupe">CO2 personalization is designed for cosmetic preferences and does not replace professional dermatological advice. If you are under 18, please complete a consultation with a parent or guardian.</p>
        </div>
      </section>
    </>
  );
}
