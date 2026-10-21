import type { Metadata } from "next";
import Link from "next/link";
import { LineReveal } from "@/components/animations/motion";
import { BuildCombo } from "@/components/commerce/BuildCombo";
import { ComboFeature } from "@/components/home/HomeEditorial";
import { Breaker } from "@/components/brand/Breakers";
import { Accordion, Breadcrumbs } from "@/components/ui/primitives";
import { comboGroups, combos } from "@/data/combos";
import { sampling } from "@/data/sampling";

export const metadata: Metadata = {
  title: "Combos & routines — better together",
  description: "Curated CO2 routines for face, lips, body and hair — what's inside and the order to use it — price on request, as per customization. Or build your own combo.",
  alternates: { canonical: "/combos" },
};

export default function CombosPage() {
  const faqs = [
    { q: "Are combos cheaper than buying separately?", a: "Combo prices are on request, as per your customization — we don't show savings that don't exist. When a combo offer runs, it will be shown here with the real terms." },
    { q: "Can I customize a combo?", a: "Some steps can be swapped for a made-to-order formula — look for “can be customized” on the combo. The made-to-order item is then built and confirmed in Make It Yours." },
    { q: "Are travel sizes available for combos?", a: sampling.enabled ? "Many combo products have travel sizes. The Sampling Studio has ready-made sample sets, including a Travel Beauty Kit." : "Not at the moment." },
    { q: "How are combos added to my bag?", a: "Each product is added as its own line (marked with the combo name), so you can change quantities or remove one item." },
  ];
  return (
    <>
      <section className="bg-bone pb-12 pt-[calc(var(--nav-h)+1.5rem)]">
        <div className="container-site">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Combos" }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <h1 className="font-display text-[clamp(2.8rem,6.6vw,6.2rem)] leading-[0.9] lg:col-span-8">
              <LineReveal immediate lines={["Better together.", <span key="c" className="italic text-gold-deep">Curated for your routine.</span>]} />
            </h1>
            <div className="lg:col-span-4">
              <p className="text-ink-soft">{combos.length} sets built from real CO2 products, each showing what&apos;s inside and the order to use it. Price on request, as per customization.</p>
              <a href="#build" className="btn btn-primary mt-6">Build your own combo</a>
            </div>
          </div>
          <nav aria-label="Combo collections" className="no-scrollbar mt-10 flex gap-2 overflow-x-auto border-t border-line pt-6">
            {comboGroups.map((g) => <a key={g.id} href={`#${g.id}`} className="chip shrink-0">{g.label}</a>)}
            {sampling.enabled && <Link href="/sampling#sets" className="chip shrink-0">Travel Kits</Link>}
          </nav>
        </div>
      </section>

      <div className="container-site space-y-section pb-section">
        {comboGroups.map((g, gi) => {
          const list = combos.filter((c) => c.group === g.id);
          if (!list.length) return null;
          return (
            <section key={g.id} id={g.id} className="scroll-mt-[calc(var(--nav-h)+1rem)] border-t border-line pt-10" aria-labelledby={`h-${g.id}`}>
              <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                <div>
                  <p className="eyebrow text-taupe">{String(gi + 1).padStart(2, "0")}</p>
                  <h2 id={`h-${g.id}`} className="mt-2 font-display text-display-sm">{g.label}</h2>
                </div>
                <p className="max-w-md text-sm text-ink-soft">{g.blurb}</p>
              </div>
              <ul className="grid gap-5 md:grid-cols-2">
                {list.map((c, i) => <li key={c.slug}><ComboFeature combo={c} dark={(gi + i) % 2 === 1} className="h-full" /></li>)}
              </ul>
            </section>
          );
        })}
      </div>

      <Breaker id="samples" />

      <section id="build" className="container-site scroll-mt-[calc(var(--nav-h)+1rem)] py-section" aria-labelledby="byo">
        <p className="eyebrow text-taupe">Build your own</p>
        <h2 id="byo" className="mb-10 mt-3 font-display text-display-md">Your combo, <span className="italic">your order.</span></h2>
        <BuildCombo />
      </section>

      <section className="container-site grid gap-10 pb-section lg:grid-cols-12" aria-labelledby="cfaq">
        <div className="lg:col-span-4">
          <h2 id="cfaq" className="font-display text-display-sm">About combos</h2>
        </div>
        <div className="lg:col-span-8"><Accordion items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} defaultOpen={0} /></div>
      </section>
    </>
  );
}
