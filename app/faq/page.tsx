import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/hero/PageHero";
import { Accordion } from "@/components/ui/primitives";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqs } from "@/data/faq";

export const metadata: Metadata = { title: "FAQ", description: "Answers about CO2 products, ingredients, made-to-order formulas, payment, shipping and returns.", alternates: { canonical: "/faq" } };

export default function FaqPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))) }} />
      <PageHero kicker="Help" title="Questions," italic="answered." crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]} compact />
      <section className="container-site pb-section">
        <div className="grid gap-16 lg:grid-cols-12">
          <nav className="lg:col-span-3" aria-label="FAQ sections">
            <ul className="sticky top-28 space-y-3 text-sm">
              {faqs.map((g) => <li key={g.group}><a href={`#${g.group.replace(/\W+/g, "-").toLowerCase()}`} className="link-underline text-ink-soft hover:text-ink">{g.group}</a></li>)}
            </ul>
          </nav>
          <div className="space-y-16 lg:col-span-8">
            {faqs.map((g) => (
              <div key={g.group} id={g.group.replace(/\W+/g, "-").toLowerCase()} className="scroll-mt-28">
                <h2 className="mb-6 font-display text-4xl">{g.group}</h2>
                <Accordion items={g.items.map((i) => ({ title: i.q, content: <p>{i.a}</p> }))} defaultOpen={null} />
              </div>
            ))}
            <p className="text-ink-soft">Still need help? <Link href="/contact" className="text-ink underline underline-offset-4">Contact us</Link>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
