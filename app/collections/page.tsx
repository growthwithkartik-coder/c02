import type { Metadata } from "next";
import { Breaker } from "@/components/brand/Breakers";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/hero/PageHero";
import { Reveal } from "@/components/animations/motion";
import { collections } from "@/data/collections";
import { getProducts, heroImage } from "@/lib/catalog";
import { cn, cutoutImage, productImage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Collections",
  description: "Curated CO2 edits — The Charcoal Ritual, Botanical Clarity, High-Shine Lips, The Anti-Dandruff Routine, The Hair Shelf, The Body Ritual and The Body Soap Library.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <>
      <PageHero kicker="Collections" title="Edits, rituals" italic="and systems." intro="Ten ways into the CO2 collection — grouped by ingredient, by ritual and by the way you use them." crumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]} dark image="noir-charcoal-mask" compact />
      <section className="container-site py-section">
        <ul className="grid gap-x-6 gap-y-16 md:grid-cols-2">
          {collections.map((c, i) => {
            const items = getProducts(c.products);
            const dark = c.tone === "dark";
            return (
              <Reveal as="li" key={c.slug} delay={(i % 2) * 0.08} className={cn(i % 3 === 0 && "md:col-span-2")}>
                <Link href={`/collections/${c.slug}`} className="group block" data-cursor="Explore">
                  <div className={cn("relative overflow-hidden", i % 3 === 0 ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/3]", dark ? "bg-carbon" : "bg-stone")}>
                    {dark && <div className="absolute inset-0 bg-[radial-gradient(50%_70%_at_70%_50%,rgba(226,198,140,.22),transparent_70%)]" aria-hidden />}
                    {c.hero !== "custom" ? (
                      <Image src={heroImage(c.hero)} alt="" fill sizes="(max-width:768px) 100vw, 60vw" className={cn("object-contain p-[8%]", i % 3 === 0 && "object-right md:pr-[10%]")} />
                    ) : (
                      <div className="absolute inset-0 grid grid-cols-3 gap-2 p-6 opacity-90">
                        {["#B98466", "#C99A7A", "#DCEBE5", "#E9DCCB", "#C87D78", "#9E3B3B"].map((f) => <div key={f} className="rounded-[28px]" style={{ background: f }} />)}
                      </div>
                    )}
                    <div className={cn("absolute bottom-0 left-0 p-6 md:p-8", dark ? "text-bone" : "text-ink")}>
                      <p className={cn("eyebrow", dark ? "text-gold-light" : "text-taupe")}>{c.kicker} · {items.length} products</p>
                      <h2 className="mt-2 font-display text-5xl leading-none md:text-6xl">{c.title}</h2>
                    </div>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-6">
                    <p className="max-w-md text-sm leading-relaxed text-ink-soft">{c.description}</p>
                    <div className="flex shrink-0 -space-x-3">
                      {items.slice(0, 4).filter((p) => p.images[0]).map((p) => (
                        <span key={p.slug} className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-bone">
                          <Image src={productImage(p.images[0], 640)} alt="" fill sizes="40px" className="object-contain" />
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>
      <Breaker id="rules" />
    </>
  );
}
