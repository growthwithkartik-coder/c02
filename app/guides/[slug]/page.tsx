import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breaker } from "@/components/brand/Breakers";
import { Breadcrumbs } from "@/components/ui/primitives";
import { buildProducts, containers } from "@/data/customize";
import { sampling } from "@/data/sampling";
import { site } from "@/data/site";
import { flows } from "@/lib/customize/flows";
import { getProduct } from "@/lib/catalog";
import { money } from "@/lib/utils";

type Guide = { slug: string; kicker: string; title: string; intro: string; breaker: "questions" | "samples" | "discovery"; body: React.ReactNode };

function guides(): Guide[] {
  const listed = buildProducts.filter((b) => b.mode === "listed");
  const request = buildProducts.filter((b) => b.mode === "request");
  const prices = Object.values(sampling.items).map((s) => s.price);
  return [
    {
      slug: "customization",
      kicker: "Customization guide",
      title: "How Make It Yours works",
      intro: "From your first answer to a formula made for you — every step, what it means and what it doesn't.",
      breaker: "questions",
      body: (
        <>
          <h2>1. Choose a category</h2>
          <p>There are {flows.length} separate consultations: {flows.map((f) => f.label).join(", ")}. Each asks only the questions that matter for that category — lip questions for lips, scalp questions for hair.</p>
          <h2>2. Answer, review, edit</h2>
          <p>One question per screen. Some questions appear only when they&apos;re relevant (for example, finishes depend on the lip product you chose). Your answers are saved in this browser so you can leave and come back, and you can edit any answer on the review screen before seeing results.</p>
          <h2>3. See your routine — before buying anything</h2>
          <p>Your results show your beauty profile, a suggested routine (morning, evening, weekly or wash day) and the reasons behind every product. Reasons marked <b>From product info</b> come from the product&apos;s own listed ingredients, concern grouping or skin types; reasons marked <b>Matches your preference</b> simply fit something you told us. Products containing an ingredient you asked to avoid are left out and listed separately.</p>
          <p>A recommendation is a selection from the CO2 range. It is not a diagnosis and not a custom-manufactured formula.</p>
          <h2>4. Personalize</h2>
          <p>Open the builder to make a product yours. There are two kinds:</p>
          <ul>
            <li><b>Made to order</b>: {listed.map((b) => b.label).join(", ")}.</li>
            <li><b>On request</b>: {request.map((b) => b.label).join(", ")}.</li>
          </ul>
          <p>Prices are on request and as per customization — every personalized product is quoted to you before anything is made.</p>
          <p>For each product you choose the formula options it offers, then a container ({Object.values(containers).map((c) => c.label.toLowerCase()).join(", ")} — only those made for that product), a colour, a cap and an optional name for the label. The 3D preview shows the container style and colours; it isn&apos;t a photograph of the finished product.</p>
          <h2>5. Confirm</h2>
          <p>Every personalized product is sent to us as a request. We reply with what&apos;s possible, the price (as per your customization) and the timeline — nothing is charged until you agree. Made-to-order formulas are usually prepared in 5–8 working days after you confirm.</p>
          <h2>Good to know</h2>
          <ul>
            <li>CO2 personalization is cosmetic. It doesn&apos;t replace advice from a dermatologist.</li>
            <li>Lip colours are confirmed with you — we don&apos;t claim to determine a shade from answers or a camera.</li>
            <li>We can&apos;t guarantee any product is allergy-safe. Tell us about allergies in your notes and always patch-test.</li>
          </ul>
          <p><Link href="/make-it-yours">Start a consultation →</Link></p>
        </>
      ),
    },
    {
      slug: "sampling",
      kicker: "Sampling guide",
      title: "How sampling works",
      intro: "Travel sizes, sample sets and how to go from a sample to the full size.",
      breaker: "samples",
      body: sampling.enabled ? (
        <>
          <h2>What a travel size is</h2>
          <p>A smaller pack of the same CO2 product — same formula, same ingredients. {Object.keys(sampling.items).length} skin, body and hair products have one.</p>
          <h2>Prices</h2>
          <p>Travel-size prices are on request, as per the products and quantities you choose. Samples are not free{sampling.creditTowardsFullSize ? "." : ", and sample prices aren't credited towards a later full-size purchase."} Use “Request price” on a product, a set or the Sampling Studio and we&apos;ll send you a quote.</p>
          <h2>Three ways to sample</h2>
          <ul>
            <li><b>Single travel sizes</b> — choose “Travel size” on a product page, or add from the Sampling Studio.</li>
            <li><b>Curated sets</b> — {sampling.sets.map((s) => s.name).join(", ")}. Set prices are on request.</li>
            <li><b>Your own set</b> — pick {sampling.minPerSet}–{sampling.maxPerSet} travel sizes in the Sampling Studio.</li>
          </ul>
          <h2>Shipping</h2>
          <p>{sampling.shippingNote} Free shipping applies over {money(site.commerce.freeShippingThreshold)}; otherwise {money(site.commerce.shippingFee)}.</p>
          <h2>What isn&apos;t sampled</h2>
          <p>Lip products and made-to-order formulas aren&apos;t offered as samples. You can try every gloss shade on your own face with the virtual try-on instead.</p>
          <h2>From sample to full size</h2>
          <p>Every travel size links to its full-size product page, where you can also start a customized version where available.</p>
          <p><Link href="/sampling">Visit the Sampling Studio →</Link></p>
        </>
      ) : (
        <p>Sampling isn&apos;t available at the moment.</p>
      ),
    },
    {
      slug: "product-care",
      kicker: "Product care",
      title: "Caring for your products",
      intro: "Simple habits that keep your formulas — and your routine — at their best.",
      breaker: "discovery",
      body: (
        <>
          <h2>Storage</h2>
          <ul>
            <li>Keep products closed, away from direct sunlight and heat — a bathroom windowsill is the hardest place for a formula to live.</li>
            <li>Close caps, pumps and droppers straight after use.</li>
            <li>Check each pack for its batch, expiry and period-after-opening information. Expiry dates aren&apos;t listed on the website yet.</li>
          </ul>
          <h2>By format</h2>
          <ul>
            <li><b>Jars and masks</b> — use clean, dry fingers or a spatula so water and dirt don&apos;t get into the jar.</li>
            <li><b>Droppers</b> — avoid touching the pipette to skin; return it to the bottle straight away.</li>
            <li><b>Lotions and oils that separate</b> — some CO2 products ask you to shake before use (for example the Calamine Calm Lotion). Follow the pack.</li>
            <li><b>Bath bars</b> — keep the bar dry between uses, on a draining soap dish.</li>
            <li><b>Lip products</b> — for hygiene, don&apos;t share them.</li>
          </ul>
          <h2>Made-to-order formulas</h2>
          <p>Your formula card lists your formula code and directions. Keep it — it&apos;s how we remake or refine your formula next time.</p>
          <h2>If something changes</h2>
          <p>If a product changes colour, smell or texture, stop using it and <Link href="/contact">contact us</Link> with the batch details. If a product irritates your skin, stop using it; if irritation continues, see a doctor.</p>
        </>
      ),
    },
  ];
}

export function generateStaticParams() {
  return guides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guides().find((x) => x.slug === slug);
  return g ? { title: g.title, description: g.intro, alternates: { canonical: `/guides/${g.slug}` } } : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = guides();
  const g = all.find((x) => x.slug === slug);
  if (!g) notFound();
  return (
    <>
      <section className="border-b border-line bg-bone-2 pb-12 pt-[calc(var(--nav-h)+1.5rem)]">
        <div className="container-site">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }, { label: g.kicker }]} />
          <p className="eyebrow mt-8 text-gold-deep">{g.kicker}</p>
          <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.92]">{g.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">{g.intro}</p>
        </div>
      </section>
      <section className="container-site grid gap-10 py-section lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav aria-label="Guides" className="sticky top-[calc(var(--nav-h)+1.5rem)]">
            <p className="eyebrow text-taupe">All guides</p>
            <ul className="mt-4 space-y-2 text-sm">
              {all.map((x) => <li key={x.slug}><Link href={`/guides/${x.slug}`} aria-current={x.slug === g.slug ? "page" : undefined} className={x.slug === g.slug ? "font-medium text-ink" : "text-ink-soft hover:text-ink"}>{x.kicker}</Link></li>)}
              <li><Link href="/ingredients" className="text-ink-soft hover:text-ink">Ingredient guide</Link></li>
            </ul>
          </nav>
        </aside>
        <article className="prose-co2 lg:col-span-7">{g.body}</article>
      </section>
      <Breaker id={g.breaker} />
    </>
  );
}
