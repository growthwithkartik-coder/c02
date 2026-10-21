"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ScrubWords, Reveal } from "@/components/animations/motion";
import { Molecule } from "@/components/ui/Logo";
import { cutoutImage } from "@/lib/utils";

/* SECTION 02 — brand statement, scrubbed word by word, with two
   products drifting at different speeds. */
export function BrandIntro({ counts }: { counts: { photographed: number; custom: number } }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], ["30%", "-40%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["60%", "-20%"]);
  const rA = useTransform(scrollYProgress, [0, 1], [-14, 6]);
  const rB = useTransform(scrollYProgress, [0, 1], [10, -8]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-bone py-section" aria-labelledby="intro-title">
      <div className="container-site relative">
        <div className="flex items-center gap-4 text-taupe">
          <span className="eyebrow">02 — The house</span>
          <span className="h-px flex-1 bg-line" />
          <Molecule className="text-gold" />
        </div>

        <h2 id="intro-title" className="sr-only">About CO2</h2>
        <ScrubWords
          className="mt-14 max-w-[15ch] font-display text-display-md text-ink md:mt-20 md:max-w-[20ch] lg:text-[clamp(3rem,6vw,6.25rem)]"
          text="Leaf, mineral, gold and colour — measured into formulas that say exactly what they hold."
        />

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          <Reveal className="md:col-span-5 md:col-start-1">
            <p className="lead text-ink-soft">
              CO2 is a cosmetics house built on two ideas. First: every formula is described exactly as it is printed on its pack — ingredients, sizes and
              what it does, nothing invented. Second: beauty should fit the person, so alongside the ready collection we make formulas to order, around
              your shade, finish and skin.
            </p>
            <Link href="/about" className="btn btn-outline mt-8">Our story</Link>
          </Reveal>
          <div className="grid grid-cols-3 gap-6 md:col-span-6 md:col-start-7">
            {[
              { n: counts.photographed, l: "Formulas in the collection" },
              { n: 4, l: "Rituals — face, body, hair, lips" },
              { n: counts.custom, l: "Made-to-order formulas" },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 0.1} className="border-t border-line pt-5">
                <p className="font-display text-6xl leading-none tabular-nums md:text-7xl">{s.n}</p>
                <p className="mt-3 text-xs leading-snug text-ink-soft">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* drifting products */}
      <motion.div aria-hidden className="pointer-events-none absolute right-[-6vw] top-[6%] hidden w-[22vw] max-w-[340px] lg:block" style={reduce ? undefined : { y: yA, rotate: rA }}>
        <Image src={cutoutImage("gloss-berry-rubin")} alt="" width={592} height={688} className="h-auto w-full drop-shadow-[0_30px_40px_rgba(60,30,20,.25)]" />
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none absolute right-[16vw] top-[2%] hidden w-[11vw] max-w-[170px] lg:block" style={reduce ? undefined : { y: yB, rotate: rB }}>
        <Image src={cutoutImage("renew-firming-cream")} alt="" width={842} height={816} className="h-auto w-full blur-[1px] drop-shadow-[0_20px_30px_rgba(60,30,20,.2)]" />
      </motion.div>
    </section>
  );
}
