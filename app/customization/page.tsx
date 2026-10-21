import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/hero/PageHero";
import { CustomizationInquiry } from "@/components/customization/CustomizationInquiry";
import { Accordion } from "@/components/ui/primitives";
import { buildProducts, capFinishes, containers, packColours, type BuildCategory } from "@/data/customize";
import { sampling } from "@/data/sampling";
import { getCustomFormulas, getProduct } from "@/lib/catalog";
import { buildHref } from "@/components/miy/links";
import { money, priceText } from "@/lib/utils";

/* ------------------------------------------------------------------
   CUSTOMIZE YOUR PRODUCT
   Replaces the old "made-to-order" product cards (drawn empty bottles)
   that used to sit in the catalogue. Everything here is a customization
   OR packaging option — none of it is a finished product.
   All options come from the existing configuration:
   - containers / pack colours / cap finishes → data/customize.ts
   - formulas you can customize and their sizes → data/custom-formulas.ts
     (made to order, listed price) and data/customize.ts (on request)
   - travel sizes → data/sampling.ts
   No sizes, capacities, prices or materials are invented on this page.
------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: "Customize Your Product — sizes, packaging & formulas",
  description:
    "Explore CO2 customization options: container styles, pack colours, cap finishes, sizes and made-to-order or on-request formulas. Send a customization request — nothing is charged until we confirm.",
  alternates: { canonical: "/customization" },
};

const CATEGORY_LABEL: Record<BuildCategory, string> = { face: "Skincare", body: "Body Care", hair: "Hair Care", lips: "Lips" };

export default function CustomizationPage() {
  const listed = getCustomFormulas();
  const onRequest = buildProducts.filter((b) => b.mode === "request");
  const travel = Object.entries(sampling.enabled ? sampling.items : {})
    .map(([slug, s]) => ({ p: getProduct(slug), ...s }))
    .filter((x) => x.p);
  const faqs = [
    { q: "Are these products I can buy as they are?", a: "No. Everything on this page is a customization or packaging option. Ready-made products are in the Skincare, Hair Care, Body Care and Lips sections of the shop." },
    { q: "What sizes are available?", a: "Made-to-order formulas come in the size shown next to each one. On-request formulas are offered as travel, regular or — where available — a larger size; the exact volume is confirmed in your quote. Selected ready-made products also come in travel sizes in the Sampling Studio." },
    { q: "Does packaging cost extra?", a: Object.values(containers).every((c) => c.surcharge === 0) ? "Prices are on request and as per customization — the formula, size, packaging and quantity you choose are all included in the quote we send you before anything is made." : "Prices are on request and as per customization — packaging upgrades are included in the quote we send you before anything is made." },
    { q: "How long does it take?", a: "Made-to-order formulas are usually prepared in 5–8 working days after we confirm the details and price with you by email." },
    { q: "Is a request an order?", a: "No. A customization request is pending confirmation. We reply with what's possible, the price and the timeline, and nothing is charged until you agree." },
  ];

  return (
    <>
      <PageHero
        kicker="Customization"
        title="Customize your"
        italic="product."
        intro="Choose the size, container, colour and cap for a formula made around you — or tell us what you need and we'll confirm what's possible. These are customization and packaging options, not finished products."
        crumbs={[{ label: "Home", href: "/" }, { label: "Customize Your Product" }]}
        image="24k-gold-face-elixir"
      >
        <div className="flex flex-wrap gap-3">
          <a href="#request" className="btn btn-primary">Send a customization request</a>
          <Link href="/make-it-yours/build" className="btn btn-outline">Open the builder</Link>
        </div>
      </PageHero>

      {/* how it works */}
      <section className="container-site pb-section" aria-labelledby="cz-how">
        <h2 id="cz-how" className="sr-only">How customization works</h2>
        <ol className="grid gap-px bg-line md:grid-cols-4">
          {[
            ["01", "Pick a formula", "A made-to-order formula, or an on-request formula. Price on request, as per your customization."],
            ["02", "Choose size & packaging", "Container, pack colour and cap — only the options made for that formula."],
            ["03", "We confirm with you", "Formula details, size, price and timeline are confirmed by email first."],
            ["04", "Made for you", "Prepared once you agree. Nothing is charged for a request."],
          ].map(([n, t, b]) => (
            <li key={n} className="bg-bone p-7">
              <span className="font-display text-4xl text-taupe/60">{n}</span>
              <p className="mt-4 font-display text-2xl">{t}</p>
              <p className="mt-2 text-sm text-ink-soft">{b}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* packaging */}
      <section className="border-t border-line bg-bone-2 py-section" aria-labelledby="cz-pack">
        <div className="container-site">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow text-taupe">Packaging & bottling</p>
              <h2 id="cz-pack" className="mt-3 font-display text-display-sm">Container styles.</h2>
            </div>
            <p className="text-sm text-ink-soft md:col-span-4 md:col-start-9">Each formula offers only the containers made for it. The builder&apos;s 3D preview shows the style and colours — it isn&apos;t a photograph of a finished product.</p>
          </div>
          <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(containers).filter((c) => buildProducts.some((b) => b.containers.includes(c.id))).map((c) => (
              <li key={c.id} className="bg-bone p-6">
                <p className="font-display text-2xl leading-tight">{c.label}</p>
                <p className="mt-2 text-sm text-ink-soft">{c.description}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-taupe">
                  For: {buildProducts.filter((b) => b.containers.includes(c.id)).map((b) => b.label.replace(/^Custom /, "")).join(", ")}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-display text-3xl">Pack colours</h3>
              <ul className="mt-5 flex flex-wrap gap-3">
                {Object.values(packColours).map((c) => (
                  <li key={c.id} className="flex items-center gap-2.5 border border-line bg-bone px-3 py-2 text-sm">
                    <span className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} aria-hidden /> {c.label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-3xl">Cap finishes</h3>
              <ul className="mt-5 flex flex-wrap gap-3">
                {Object.values(capFinishes).map((c) => (
                  <li key={c.id} className="flex items-center gap-2.5 border border-line bg-bone px-3 py-2 text-sm">
                    <span className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} aria-hidden /> {c.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* formulas & sizes */}
      <section className="container-site py-section" aria-labelledby="cz-formulas">
        <p className="eyebrow text-taupe">Formulas & sizes</p>
        <h2 id="cz-formulas" className="mt-3 font-display text-display-sm">What you can customize.</h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-3xl">Made to order</h3>
            <p className="mt-2 text-sm text-ink-soft">Price on request · as per customization — confirmed with you by email before it&apos;s prepared.</p>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {listed.map((p) => {
                const b = buildProducts.find((x) => x.slug === p.slug);
                return (
                  <li key={p.slug}>
                    <Link href={buildHref(p.slug)} className="group flex items-center justify-between gap-4 py-4">
                      <span>
                        <span className="block font-display text-2xl leading-tight group-hover:text-gold-deep">{p.name}</span>
                        <span className="text-xs text-taupe">
                          Size {p.size} · {priceText(p.price)}
                          {b ? ` · ${b.containers.map((c) => containers[c].label).join(" / ")}` : ""}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-3xl">On request</h3>
            <p className="mt-2 text-sm text-ink-soft">Not in the catalogue — we reply with what&apos;s possible, the exact size and the price first.</p>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {onRequest.map((b) => (
                <li key={b.id}>
                  <Link href={buildHref(b.id)} className="group flex items-center justify-between gap-4 py-4">
                    <span>
                      <span className="block font-display text-2xl leading-tight group-hover:text-gold-deep">{b.label}</span>
                      <span className="text-xs text-taupe">
                        {CATEGORY_LABEL[b.category]} · sizes: {(b.sizes ?? ["To be confirmed"]).join(" / ")} · {b.containers.map((c) => containers[c].label).join(" / ")}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {travel.length > 0 && (
          <div className="mt-14 border border-line p-6 md:p-8">
            <h3 className="font-display text-3xl">Travel sizes of ready-made products</h3>
            <p className="mt-2 text-sm text-ink-soft">Smaller packs of the same formula, from the Sampling Studio.</p>
            <ul className="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {travel.map((t) => (
                <li key={t.p!.slug} className="flex justify-between gap-3 border-b border-line py-2">
                  <Link href={`/product/${t.p!.slug}`} className="hover:text-gold-deep">{t.p!.name}</Link>
                  <span className="shrink-0 text-taupe">{t.size} · {priceText(t.price)}</span>
                </li>
              ))}
            </ul>
            <Link href="/sampling" className="mt-5 inline-block text-sm underline underline-offset-4">Go to the Sampling Studio</Link>
          </div>
        )}
      </section>

      {/* inquiry */}
      <section id="request" className="scroll-mt-[calc(var(--nav-h)+1rem)] border-t border-line bg-stone py-section" aria-labelledby="cz-req">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-ink-soft">Customization request</p>
            <h2 id="cz-req" className="mt-3 font-display text-display-sm">Tell us what you need.</h2>
            <p className="mt-3 text-sm text-ink-soft">Ask about available sizes, packaging styles or a formula of your own. We reply by email with the options, price and timeline.</p>
          </div>
          <div className="lg:col-span-8">
            <CustomizationInquiry />
          </div>
        </div>
      </section>

      <section className="container-site py-section" aria-labelledby="cz-faq">
        <h2 id="cz-faq" className="font-display text-display-sm">Questions</h2>
        <div className="mt-8 max-w-3xl">
          <Accordion items={faqs.map((f) => ({ title: f.q, content: <p className="text-ink-soft">{f.a}</p> }))} />
        </div>
      </section>
    </>
  );
}
