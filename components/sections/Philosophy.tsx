"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LineReveal, Reveal } from "@/components/animations/motion";
import { productImage } from "@/lib/utils";

const tenets = [
  { n: "01", t: "Printed, not promised.", d: "We describe each formula exactly as its pack does. No invented percentages, no borrowed studies." },
  { n: "02", t: "Botanicals with a reason.", d: "Neem, tulasi, aloe, saffron, sandalwood — chosen for what they bring to a texture, not for a story." },
  { n: "03", t: "Made personal.", d: "Six formulas are made to order around your shade, finish and preferences, and kept on file for next time." },
];

/* SECTION 09 — the CO2 philosophy, as a campaign spread. */
export function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["10%", "-25%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["35%", "-10%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["60%", "-35%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-carbon py-section text-bone grain" aria-labelledby="philosophy-title">
      <div className="container-site">
        <p className="eyebrow text-gold-light"><span className="mr-3">10 —</span>Philosophy</p>
        <h2 id="philosophy-title" className="mt-6 font-display text-display-lg">
          <LineReveal lines={["Say what’s inside.", <span key="2" className="italic text-gold-light">Nothing more.</span>]} />
        </h2>

        <div className="mt-20 grid gap-16 lg:grid-cols-12">
          {/* collage */}
          <div className="relative h-[520px] md:h-[680px] lg:col-span-7">
            <motion.div className="absolute left-0 top-0 h-[64%] w-[58%] overflow-hidden" style={reduce ? undefined : { y: y1 }}>
              <motion.div className="relative h-full w-full" style={reduce ? undefined : { scale }}>
                <Image src={productImage("24k-gold-face-elixir-1")} alt="24K Gold Serum on warm marble" fill sizes="(max-width:1024px) 60vw, 35vw" className="object-contain" />
              </motion.div>
            </motion.div>
            <motion.div className="absolute right-0 top-[18%] h-[48%] w-[40%] overflow-hidden" style={reduce ? undefined : { y: y2 }}>
              <Image src={productImage("noir-charcoal-mask-1")} alt="Charcoal Face Mask with bamboo charcoal" fill sizes="(max-width:1024px) 40vw, 25vw" className="object-contain" />
            </motion.div>
            <motion.div className="absolute bottom-0 left-[28%] h-[40%] w-[38%] overflow-hidden" style={reduce ? undefined : { y: y3 }}>
              <Image src={productImage("gloss-chocolate-dream-2")} alt="Chocolate Dream lip gloss" fill sizes="(max-width:1024px) 40vw, 22vw" className="object-contain" />
            </motion.div>
          </div>

          <ol className="space-y-12 lg:col-span-4 lg:col-start-9 lg:pt-20">
            {tenets.map((t, i) => (
              <Reveal as="li" key={t.n} delay={i * 0.1} className="border-t border-line-dark pt-6">
                <p className="eyebrow tabular-nums text-gold-light">{t.n}</p>
                <h3 className="mt-3 font-display text-4xl leading-none">{t.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">{t.d}</p>
              </Reveal>
            ))}
            <Reveal>
              <Link href="/about" className="btn btn-outline-light">Read the CO2 story</Link>
            </Reveal>
          </ol>
        </div>
      </div>
    </section>
  );
}
