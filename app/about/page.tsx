import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LineReveal, Reveal, ScrubWords } from "@/components/animations/motion";
import { BrandFilm } from "@/components/brand/BrandFilm";
import { Breaker } from "@/components/brand/Breakers";
import { Molecule } from "@/components/ui/Logo";
import { Breadcrumbs } from "@/components/ui/primitives";
import { sampling } from "@/data/sampling";
import { getPhotographedProducts } from "@/lib/catalog";
import { flows } from "@/lib/customize/flows";
import { cutoutImage, productImage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Story — four people, one idea",
  description: "The story of CO2 Cosmetics: four people building an honest, toxin-conscious beauty brand, with personalized routines, ingredient transparency, travel sizes and formulas made to order.",
  alternates: { canonical: "/about" },
};

/* About — the founders' story. Founder names, photos, qualifications and
   dates are NOT included because none were supplied; add them in the
   `founders` array below when they are approved (each card renders only
   when a name exists). */
const founders: { name: string; role: string; photo?: string; note?: string }[] = [];

const name = [
  { k: "C", t: "Carbon", d: "The C in our name. Activated and bamboo charcoal run through our cleansing range. Charcoal is porous by nature, which makes it very good at lifting oil and grime from the surface." },
  { k: "O", t: "Organic matter", d: "Leaf, root and flower: neem, tulasi, aloe, sandalwood, hibiscus, saffron. The two leaves on our mark are there for a reason." },
  { k: "2", t: "Two of you", d: "The person you are today and the one you want to show. Our made-to-order formulas are built around both." },
];

export default function AboutPage() {
  const count = getPhotographedProducts().length;
  return (
    <>
      {/* 1. our beginning */}
      <section className="relative overflow-hidden bg-carbon pb-section pt-[calc(var(--nav-h)+2rem)] text-bone grain">
        <div className="container-site">
          <Breadcrumbs dark items={[{ label: "Home", href: "/" }, { label: "Our Story" }]} />
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow text-gold-light">Our story</p>
              <h1 className="mt-6 font-display text-[clamp(3rem,7.6vw,7.4rem)] leading-[0.88] tracking-[-0.03em]">
                <LineReveal immediate lines={["Four people.", "One idea.", <span key="m" className="italic text-gold-light">A more personal kind of beauty.</span>]} />
              </h1>
            </div>
            <p className="max-w-sm text-bone/70 lg:col-span-4">This is how CO2 Cosmetics began — and what we&apos;re building it to stand for.</p>
          </div>
        </div>
      </section>

      {/* 2. our story — the founders' story, shown once on the site */}
      <section className="bg-bone py-section" aria-labelledby="why">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-taupe">01 · Why we started</p>
            <h2 id="why" className="mt-3 font-display text-display-sm">How CO2 Cosmetics <span className="italic">began.</span></h2>
          </div>
          <div className="max-w-[40rem] space-y-6 text-[1.06rem] leading-relaxed text-ink-soft lg:col-span-7 lg:col-start-6">
            <p className="text-[1.2rem] leading-relaxed text-ink md:text-[1.32rem]">
              {"CO2 Cosmetics started with a simple thought shared by "}<strong className="font-medium">{"four people"}</strong>{" who believed that taking care of yourself shouldn't mean compromising on what you put on your skin. We wanted to build a brand that felt honest, thoughtful, and closer to nature, a brand that puts "}<em className="font-display text-[1.12em] italic text-gold-deep">{"people before chemicals and care before compromise"}</em>{"."}
            </p>
            <p>
              {"The idea wasn't just to create another cosmetics brand. We wanted to create something we could genuinely believe in. Something that brings together the goodness of nature, the science of skincare, and the belief that everyone deserves products they can feel good about using. That's why we set out to build a brand focused on "}<strong className="font-medium text-ink">{"toxin-conscious formulations, quality ingredients, and a more mindful approach to beauty"}</strong>{"."}
            </p>
            <p>
              {"For us, CO2 Cosmetics is personal. It's about the conversations that started this idea, the values we share, and the kind of brand we want to leave behind. Every product is a step towards our vision of "}<strong className="font-medium text-ink">{"making conscious beauty more accessible, without making it complicated"}</strong>{"."}
            </p>
            <p className="border-l-2 border-gold pl-5 text-ink">
              {"We're four people who started with an idea, but we're building it with a purpose. And that purpose is simple: "}<em className="font-display text-[1.12em] italic">{"beauty should make you feel good, inside and out."}</em>
            </p>
          </div>
        </div>
        <div className="container-site mt-16 md:mt-20">
          <div className="mx-auto max-w-4xl border-y border-gold/50 py-10 text-center md:py-12">
            <Molecule className="mx-auto text-gold" />
            <p className="mt-6 font-display text-[clamp(1.7rem,3.4vw,2.9rem)] leading-[1.12] text-ink">
              <span className="eyebrow block font-sans text-[0.72rem] text-taupe">CO2 Cosmetics<span className="sr-only"> —</span></span>{" "}
              <span className="mt-4 block italic">Created with care. Made with purpose. Inspired by nature.</span>
            </p>
          </div>
        </div>
        {founders.some((f) => f.name) && (
          <div className="container-site mt-16">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {founders.filter((f) => f.name).map((f) => (
                <li key={f.name} className="border border-line p-5">
                  {f.photo && <div className="relative mb-4 aspect-[4/5] bg-bone-2"><Image src={f.photo} alt={f.name} fill sizes="25vw" className="object-cover" /></div>}
                  <p className="font-display text-2xl">{f.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-taupe">{f.role}</p>
                  {f.note && <p className="mt-2 text-sm text-ink-soft">{f.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 3. what personalization means */}
      <section className="bg-bone-2 py-section" aria-labelledby="personal">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[4/5] bg-stone lg:col-span-5">
            <Image src={cutoutImage("renew-firming-cream")} alt="CO2 Anti-Aging Cream" fill sizes="(max-width:1024px) 92vw, 40vw" className="object-contain p-[12%] drop-shadow-[0_30px_30px_rgba(17,16,13,.25)]" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow text-taupe">02 · What personalization means to us</p>
            <h2 id="personal" className="mt-3 font-display text-display-sm">Not a slogan — <span className="italic">a sequence.</span></h2>
            <ol className="mt-8 space-y-6">
              {[
                ["Understanding", `${flows.length} separate consultations — face, hair, body and lips — each asking only what matters for that category.`],
                ["Recommending", "A routine built from real CO2 products, with the reason for every pick — and a clear line between what the product's own information says and what simply matches your preferences."],
                ["Making", "Where it's available, a formula made to order from the options you choose, in the packaging you choose, confirmed with you before it's prepared."],
              ].map(([t, d], i) => (
                <Reveal as="li" key={t} delay={i * 0.08} className="flex gap-5">
                  <span className="font-display text-4xl leading-none text-gold-deep">{i + 1}</span>
                  <span><span className="block font-display text-2xl">{t}</span><span className="mt-1 block text-ink-soft">{d}</span></span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 4. product discovery + 5. ingredient transparency */}
      <section className="container-site grid grid-cols-1 gap-5 py-section lg:grid-cols-2" aria-label="Our approach">
        <div className="flex flex-col bg-stone p-8 md:p-10">
          <p className="eyebrow text-ink-soft">03 · Our approach to product discovery</p>
          <h2 className="mt-3 font-display text-4xl leading-tight">Find your routine before you find your product.</h2>
          <p className="mt-4 text-ink-soft">Every category has its own page, its own filters and its own consultation. Skin is shopped by concern, hair by scalp and lengths, lips by shade — and you can try every gloss on your own face before buying.</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {[["Skincare", "skin"], ["Hair Care", "hair"], ["Body Care", "body"], ["Lips", "lips"]].map(([c, id]) => <li key={id}><Link href={`/shop/${id}`} className="chip">{c}</Link></li>)}
          </ul>
        </div>
        <div id="philosophy" className="flex scroll-mt-28 flex-col bg-carbon p-8 text-bone md:p-10">
          <p className="eyebrow text-gold-light">04 · Our commitment to ingredient transparency</p>
          <h2 className="mt-3 font-display text-4xl leading-tight">Described exactly as it is on the pack.</h2>
          <p className="mt-4 text-bone/70">No invented percentages, no borrowed studies, no promises a cosmetic can&apos;t keep. Every one of our {count} products lists its key ingredients and what each one does — and our consultations let you leave out the ones you&apos;d rather avoid.</p>
          <Link href="/ingredients" className="btn btn-outline-light mt-auto self-start" style={{ marginTop: "2rem" }}>Explore the ingredient guide</Link>
        </div>
      </section>

      {/* 6. how customization works */}
      <section className="bg-bone-2 py-section" aria-labelledby="how">
        <div className="container-site">
          <p className="eyebrow text-taupe">05 · How customization works</p>
          <h2 id="how" className="mt-3 max-w-3xl font-display text-display-sm">Consultation → routine → personalize → confirm.</h2>
          <ol className="mt-10 grid gap-px bg-line md:grid-cols-4">
            {[
              ["Tell us about you", "Choose a category and answer one question at a time."],
              ["See your routine", "Suggested steps from the CO2 range — no purchase needed."],
              ["Personalize", "Formula options, container, colour, cap and label — previewed in 3D."],
              ["Confirm", "Request a quote for a made-to-order formula, or for one we don't list yet."],
            ].map(([t, d], i) => (
              <li key={t} className="bg-bone-2 p-7">
                <span className="text-xs tabular-nums text-gold-deep">0{i + 1}</span>
                <p className="mt-3 font-display text-2xl">{t}</p>
                <p className="mt-2 text-sm text-ink-soft">{d}</p>
              </li>
            ))}
          </ol>
          <Link href="/guides/customization" className="mt-8 inline-block text-sm underline underline-offset-4">Read the full customization guide</Link>
        </div>
      </section>

      {/* 7. sampling philosophy */}
      {sampling.enabled && (
        <section className="container-site grid gap-10 py-section lg:grid-cols-12 lg:items-center" aria-labelledby="sample">
          <div className="lg:col-span-6">
            <p className="eyebrow text-taupe">06 · Our sampling philosophy</p>
            <h2 id="sample" className="mt-3 font-display text-display-sm">Your next favourite shouldn&apos;t be a guessing game.</h2>
            <p className="mt-4 text-ink-soft">Texture is personal. So {Object.keys(sampling.items).length} of our formulas come in travel sizes, each with its own listed price — no &ldquo;free&rdquo; samples with strings attached. Try the texture, then choose the full size if you love it.</p>
            <Link href="/sampling" className="btn btn-primary mt-8">Visit the Sampling Studio</Link>
          </div>
          <ul className="grid grid-cols-3 gap-3 lg:col-span-6" aria-hidden>
            {["24k-gold-face-elixir-1", "aloe-veil-body-lotion-1", "scalp-clear-shampoo-1"].map((k) => (
              <li key={k} className="relative aspect-[3/4] bg-bone-2"><Image src={productImage(k, 640)} alt="" fill sizes="20vw" className="object-contain" /></li>
            ))}
          </ul>
        </section>
      )}

      {/* video */}
      <section aria-label="The CO2 collection on film">
        <BrandFilm className="h-[60vh] min-h-[380px] max-h-[720px]" />
      </section>

      {/* 8. what customers can expect */}
      <section className="bg-bone py-section" aria-labelledby="expect">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-taupe">07 · What you can expect</p>
            <h2 id="expect" className="mt-3 font-display text-display-sm">Plainly.</h2>
          </div>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {[
              ["Honest recommendations", "Cosmetic suggestions only — never a diagnosis, never a promised result."],
              ["Clear prices", "Every ready-made product shows its full-size price and net weight, and its travel size where one exists. Made-to-order formulas are quoted as per your customization."],
              ["Your say in the details", "Formula options and packaging chosen by you, confirmed with you before anything is made."],
              ["Real people", "Questions about a formula, a shade or an order go to our team on WhatsApp or email."],
            ].map(([t, d]) => (
              <li key={t}><p className="font-display text-2xl">{t}</p><p className="mt-2 text-sm text-ink-soft">{d}</p></li>
            ))}
          </ul>
        </div>
      </section>

      {/* name */}
      <section className="border-t border-line bg-bone-2 py-section" aria-labelledby="name">
        <div className="container-site">
          <div className="flex items-center gap-4 text-taupe"><span id="name" className="eyebrow">What the name means</span><span className="h-px flex-1 bg-line" /><Molecule className="text-gold" /></div>
          <ol className="mt-12 grid gap-px bg-line md:grid-cols-3">
            {name.map((c, i) => (
              <Reveal as="li" key={c.k} delay={i * 0.1} className="bg-bone-2 p-8 md:p-10">
                <p className="gold-text font-display text-[8rem] leading-[0.8]">{c.k}</p>
                <h3 className="mt-6 font-display text-4xl">{c.t}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{c.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 9. vision */}
      <section className="bg-carbon py-section text-bone" aria-labelledby="vision">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <p id="vision" className="eyebrow text-gold-light lg:col-span-2">08 · Our vision</p>
          <div className="lg:col-span-9">
            <ScrubWords className="font-display text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.04]" text="A beauty destination where shopping, personalization, sampling and discovery come together naturally — and where every routine starts with the person using it." />
            {/* 10–11. CTAs */}
            <div className="mt-12 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-light">Explore the products</Link>
              <Link href="/make-it-yours" className="btn btn-gold">Start customization</Link>
            </div>
          </div>
        </div>
      </section>

      <Breaker id="personal" />
    </>
  );
}
