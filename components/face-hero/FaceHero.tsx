"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Plus } from "lucide-react";
import { useRef } from "react";
import { Muse } from "./Muse";
import { Magnetic } from "@/components/animations/motion";
import { useStore } from "@/components/providers/StoreProvider";
import { getProduct } from "@/lib/catalog";
import { site } from "@/data/site";
import { cutoutImage, money, PRICES_ON_REQUEST } from "@/lib/utils";

import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------
   SECTION 01 — the cinematic opening.
   A sticky stage (220vh) where the Muse, the hero product and the
   headline move on independent scroll curves:
   - Muse eases in from the left, then slowly scales and drifts away
   - the 24K Gold Serum floats at her lips and rises toward her
   - the headline splits apart; a product panel resolves in its place
------------------------------------------------------------------- */
export function FaceHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { addToCart } = useStore();
  const hero = getProduct("24k-gold-face-elixir")!;

  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  const museScale = useTransform(p, [0, 1], [1, 1.14]);
  const museX = useTransform(p, [0, 1], ["0%", "-7%"]);
  const museOpacity = useTransform(p, [0.75, 1], [1, 0.55]);
  const prodY = useTransform(p, [0, 1], ["0%", "-16%"]);
  const prodX = useTransform(p, [0, 1], ["0%", "-10%"]);
  const prodRot = useTransform(p, [0, 1], [4, -7]);
  const prodScale = useTransform(p, [0, 1], [1, 1.1]);
  const line1X = useTransform(p, [0, 0.6], ["0%", "8%"]);
  const line2X = useTransform(p, [0, 0.6], ["0%", "22%"]);
  const headOpacity = useTransform(p, [0.2, 0.55], [1, 0]);
  const panelOpacity = useTransform(p, [0.45, 0.7], [0, 1]);
  const panelY = useTransform(p, [0.45, 0.75], [40, 0]);
  const glow = useTransform(p, [0, 1], [0.55, 1]);
  const cueOpacity = useTransform(p, [0, 0.12], [1, 0]);

  const s = reduce ? undefined : (v: object) => v;

  return (
    <section ref={ref} className="relative h-[200svh] bg-carbon text-bone md:h-[230vh]" aria-label="CO2 — introduction">
      <div className="sticky top-0 h-[100svh] overflow-hidden grain">
        {/* light */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: reduce ? 0.7 : glow,
            background: "radial-gradient(55% 60% at 64% 46%, rgba(226,198,140,.30) 0%, rgba(184,146,79,.10) 38%, rgba(17,16,13,0) 70%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_10%_110%,rgba(78,122,57,.12),transparent_55%)]" />

        {/* the Muse */}
        <motion.div
          className="absolute bottom-[-4%] left-[-40%] aspect-[900/1100] h-[78%] origin-bottom-left sm:left-[-22%] sm:h-[96%] md:bottom-[-8%] md:left-[-4%] md:h-[112%] lg:left-[2%]"
          initial={reduce ? false : { opacity: 0, x: "-10%" }}
          animate={{ opacity: 1, x: "0%" }}
          transition={{ duration: 2, ease: EASE, delay: 0.25 }}
        >
          <motion.div className="relative h-full w-full origin-[40%_70%]" style={s?.({ scale: museScale, x: museX, opacity: museOpacity })}>
            {site.campaign.heroCharacter ? (
              <Image src={site.campaign.heroCharacter} alt="CO2 campaign" fill priority sizes="70vw" className="object-contain object-bottom" />
            ) : (
              <Muse className="h-full w-full" />
            )}

            {/* hero product, presented at her lips */}
            <motion.div
              className="absolute left-[60%] top-[24%] h-[42%] sm:left-[66%] sm:h-[46%] md:left-[70%] md:top-[22%] md:h-[48%]"
              style={s?.({ y: prodY, x: prodX, rotate: prodRot, scale: prodScale })}
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 80, rotate: 12 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 1.8, ease: EASE, delay: 0.9 }}
                className="relative h-full"
              >
                <div className="h-full animate-float">
                  <Image
                    src={cutoutImage(hero.slug)}
                    alt={`${hero.name} — ${hero.subtitle}`}
                    width={681}
                    height={1000}
                    priority
                    unoptimized
                    className="h-full w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,.55)]"
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* headline — sits in the open space beside the product, never over it */}
        <motion.div className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+3vh)] md:top-[20vh]" style={s?.({ opacity: headOpacity })}>
          <div className="container-site flex md:justify-end">
            <h1 className="font-display text-[clamp(3.6rem,15vw,5rem)] leading-[0.84] tracking-[-0.035em] md:w-[46%] md:text-[clamp(5rem,8.6vw,10rem)]">
              <motion.span className="block overflow-hidden" style={s?.({ x: line1X })}>
                <motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}>
                  The element
                </motion.span>
              </motion.span>
              <motion.span className="block overflow-hidden md:pl-[12%]" style={s?.({ x: line2X })}>
                <motion.span className="block italic text-gold-light" initial={reduce ? false : { y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.4, ease: EASE, delay: 0.62 }}>
                  of you.
                </motion.span>
              </motion.span>
            </h1>
          </div>
        </motion.div>

        {/* intro copy + CTAs */}
        <motion.div
          className="absolute inset-x-0 bottom-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-10"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.2 }}
        >
          <motion.div className="container-site flex flex-col gap-6 md:flex-row md:items-end md:justify-between" style={s?.({ opacity: headOpacity })}>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-bone/75">
              <span className="eyebrow mb-2 block text-gold-light">CO2 — {site.tagline}</span>
              24K gold, botanicals, minerals and high-shine colour. Fifty-two formulas, and six made only for you.
            </p>
            <div className="flex items-center gap-3">
              <Magnetic>
                <Link href="/shop" className="btn btn-gold px-5 md:btn-lg">Shop collection</Link>
              </Magnetic>
              <Magnetic>
                <Link href="/make-it-yours/face" className="btn btn-outline-light px-5 md:btn-lg">Customized Skincare</Link>
              </Magnetic>
            </div>
          </motion.div>
        </motion.div>

        {/* product panel that resolves on scroll */}
        <motion.div
          className="absolute inset-x-0 bottom-[8vh] md:bottom-auto md:right-0 md:top-1/2 md:-translate-y-1/2"
          style={reduce ? { opacity: 0 } : { opacity: panelOpacity, y: panelY }}
        >
          <div className="container-site flex md:justify-end">
            <div className="w-full max-w-md border-l border-gold/50 bg-carbon/85 p-6 backdrop-blur-md md:mr-[2vw] md:bg-transparent md:p-0 md:pl-8 md:backdrop-blur-0">
              <p className="eyebrow text-gold-light">Signature · Face serum</p>
              <h2 className="mt-3 font-display text-4xl leading-[0.95] sm:text-5xl md:text-7xl">{hero.name}</h2>
              <p className="mt-4 hidden text-sm leading-relaxed text-bone/70 sm:block">{hero.lede}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {hero.benefits.map((b) => (
                  <li key={b.title} className="chip chip-dark pointer-events-none h-8 text-xs">{b.title}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {PRICES_ON_REQUEST ? (
                  <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(hero.name)} className="btn btn-light">Request price</a>
                ) : (
                  <button onClick={() => addToCart(hero.slug)} className="btn btn-light">
                    <Plus className="h-4 w-4" /> Add — {money(hero.price)}
                  </button>
                )}
                <Link href={`/product/${hero.slug}`} className="btn btn-ghost text-bone">View product</Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-bone/50 lg:flex" style={s?.({ opacity: cueOpacity })} aria-hidden>
          <span className="eyebrow">Scroll</span>
          <ArrowDown className="h-4 w-4 animate-bounce" strokeWidth={1.2} />
        </motion.div>
      </div>
    </section>
  );
}
