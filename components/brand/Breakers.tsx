import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LineReveal, Marquee, Reveal, ScrubWords } from "@/components/animations/motion";
import { BrandFilm } from "@/components/brand/BrandFilm";
import { cn, cutoutImage, productImage } from "@/lib/utils";

/* ------------------------------------------------------------------
   Section breakers — six full-width editorial moments placed between
   content across the site. Each has its own composition so pages never
   repeat one layout: dark marquee, light split, image row, dark
   question, scroll-scrubbed statement, cinematic film.
------------------------------------------------------------------- */

export type BreakerId = "rules" | "discovery" | "samples" | "questions" | "personal" | "essential";

export function Breaker({ id, className }: { id: BreakerId; className?: string }) {
  switch (id) {
    case "rules":
      return (
        <section className={cn("relative overflow-hidden bg-carbon py-section text-bone grain", className)} aria-label="Your routine, your rules">
          <Marquee className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-[0.06]">
            {["YOUR ROUTINE", "YOUR RULES", "MADE FOR YOU", "YOUR ROUTINE", "YOUR RULES", "MADE FOR YOU"].map((t, i) => (
              <span key={i} className="px-8 font-display text-[18vw] leading-none">{t}</span>
            ))}
          </Marquee>
          <div className="container-site relative grid items-end gap-10 md:grid-cols-12">
            <h2 className="font-display text-display-lg md:col-span-8">
              <LineReveal lines={["Your routine.", <span key="b" className="italic text-gold-light">Your rules.</span>]} />
            </h2>
            <Reveal className="md:col-span-4">
              <p className="text-lg leading-relaxed text-bone/75">Discover products and routines built around what matters to you.</p>
              <Link href="/make-it-yours" className="btn btn-gold mt-6">Make It Yours <ArrowRight className="h-4 w-4" /></Link>
            </Reveal>
          </div>
        </section>
      );
    case "discovery":
      return (
        <section className={cn("border-y border-line bg-bone py-section", className)} aria-label="Less guesswork, more discovery">
          <div className="container-site grid gap-10 md:grid-cols-12 md:items-center">
            <h2 className="font-display text-display-md md:col-span-7">
              <LineReveal lines={["Less guesswork.", <span key="m" className="text-gold-deep">More discovery.</span>]} />
            </h2>
            <Reveal className="md:col-span-5">
              <p className="lead text-ink-soft">Explore ingredients, textures, product sizes and personalized recommendations.</p>
              <ul className="mt-6 grid grid-cols-2 gap-px bg-line text-sm">
                {[
                  ["Ingredients", "/ingredients"],
                  ["Textures", "/shop"],
                  ["Travel sizes", "/sampling"],
                  ["Your routine", "/make-it-yours"],
                ].map(([t, h]) => (
                  <li key={t} className="bg-bone">
                    <Link href={h} className="flex items-center justify-between px-4 py-4 transition-colors hover:bg-bone-2">{t}<ArrowRight className="h-3.5 w-3.5" /></Link>
                  </li>
                ))}
              </ul>
              <Link href="/shop" className="btn btn-outline mt-6">Explore products</Link>
            </Reveal>
          </div>
        </section>
      );
    case "samples": {
      const items = ["sandal-glow-herbal-bar", "goat-milk-herbal-bar", "coco-glow-body-lotion", "scalp-clear-hair-oil", "noir-charcoal-mask"];
      return (
        <section className={cn("relative overflow-hidden bg-stone py-section", className)} aria-label="Small sizes, big discoveries">
          <div className="container-site grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="eyebrow text-ink-soft">The Sampling Studio</p>
              <h2 className="mt-4 font-display text-display-md">Small sizes. <span className="italic">Big discoveries.</span></h2>
              <p className="mt-5 max-w-md text-ink-soft">Try a travel-size product before committing to the full size.</p>
              <Link href="/sampling" className="btn btn-primary mt-7">Visit the Sampling Studio</Link>
            </div>
            <ul className="flex items-end justify-center gap-3 sm:gap-6 lg:col-span-7" aria-hidden>
              {items.map((s, i) => (
                <Reveal as="li" key={s} delay={i * 0.06} className="relative" y={40}>
                  <div className="relative" style={{ width: `clamp(3.25rem, ${[9, 7, 8, 7.5, 6.5][i]}vw, ${[9, 7, 8, 7.5, 6.5][i]}rem)`, aspectRatio: "3/4" }}>
                    <Image src={cutoutImage(s)} alt="" fill sizes="140px" className="object-contain object-bottom drop-shadow-[0_18px_18px_rgba(17,16,13,.25)]" />
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      );
    }
    case "questions":
      return (
        <section className={cn("bg-carbon-2 py-section text-bone", className)} aria-label="Good routines begin with good questions">
          <div className="container-site">
            <div className="mx-auto max-w-5xl text-center">
              <p className="eyebrow text-gold-light">Make It Yours</p>
              <h2 className="mt-6 font-display text-display-md">
                Good routines begin with <span className="italic text-gold-light">good questions.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-bone/70">Tell us what you need. We&apos;ll help you explore the possibilities.</p>
              <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2" aria-label="Example questions">
                {["How does your skin feel after cleansing?", "Which finish do you prefer?", "How does your scalp usually feel?", "When do you apply body care?", "Any ingredients to avoid?"].map((q) => (
                  <li key={q} className="chip chip-dark pointer-events-none">{q}</li>
                ))}
              </ul>
              <Link href="/make-it-yours" className="btn btn-light mt-10">Build your routine</Link>
            </div>
          </div>
        </section>
      );
    case "personal":
      return (
        <section className={cn("bg-bone-2 py-section", className)} aria-label="Beauty isn't a checklist">
          <div className="container-site grid gap-10 lg:grid-cols-12">
            <p className="eyebrow text-taupe lg:col-span-2">A note from CO2</p>
            <div className="lg:col-span-9">
              <ScrubWords text="Beauty isn't a checklist. It's personal. Find your own way to experience skincare and cosmetics." className="font-display text-[clamp(2.2rem,5.2vw,5rem)] leading-[1.02]" />
              <Link href="/about" className="btn btn-outline mt-10">Discover CO2</Link>
            </div>
          </div>
        </section>
      );
    case "essential":
      return (
        <section className={cn("relative", className)} aria-label="Meet your next everyday essential">
          <BrandFilm className="h-[78vh] min-h-[480px] max-h-[860px]">
            <div className="container-site flex h-full flex-col justify-end pb-16 text-bone md:pb-20">
              <p className="eyebrow text-gold-light">The CO2 collection</p>
              <h2 className="mt-4 max-w-3xl font-display text-display-md">Meet your next <span className="italic">everyday essential.</span></h2>
              <Link href="/shop" className="btn btn-light mt-8 self-start">Explore the collection</Link>
            </div>
          </BrandFilm>
        </section>
      );
  }
}

/* Inline product photo used in breakers when a cut-out isn't wanted. */
export function BreakerPhoto({ image, alt, className }: { image: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative bg-bone-2", className)}>
      <Image src={productImage(image, 1200)} alt={alt} fill sizes="(max-width:768px) 90vw, 40vw" className="object-contain" />
    </div>
  );
}
