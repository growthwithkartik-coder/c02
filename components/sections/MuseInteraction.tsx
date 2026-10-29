"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Product } from "@/types";
import { Muse } from "@/components/face-hero/Muse";
import { useStore } from "@/components/providers/StoreProvider";
import { site } from "@/data/site";
import { cutoutImage, isPricePending, listedPrice, money, priceText, PRICES_ON_REQUEST } from "@/lib/utils";

import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";
/* SECTION 06 — the signature moment.
   The Muse enters from the right, facing the three glosses. As you
   scroll, each gloss in turn rises to her lips; the lips and the whole
   room take on that shade. Swatches let you choose directly. */
export function MuseInteraction({ glosses, photos = {} }: { glosses: Product[]; photos?: Record<string, { src: string; alt: string; ai: boolean }> }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { addToCart } = useStore();
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState<number | null>(null);
  const mobile = useMediaQuery("(max-width: 767px)");
  const idx = manual ?? active;
  const g = glosses[idx];
  const shade = g.shades[0];

  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, { stiffness: 110, damping: 28, mass: 0.4 });
  const museX = useTransform(p, [0, 0.22], ["38%", "0%"]);
  const museOpacity = useTransform(p, [0, 0.15], [0, 1]);
  const textY = useTransform(p, [0, 0.25], [60, 0]);
  const textOpacity = useTransform(p, [0.05, 0.22], [0, 1]);

  useMotionValueEvent(raw, "change", (v) => {
    const n = v < 0.42 ? 0 : v < 0.7 ? 1 : 2;
    if (n !== active) {
      setActive(n);
      setManual(null);
    }
  });

  return (
    <section ref={ref} className="relative h-[300vh] text-bone" aria-labelledby="gloss-title">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* room colour */}
        <motion.div className="absolute inset-0" animate={{ backgroundColor: mix(shade.hex) }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_70%_50%,rgba(255,220,200,.10),transparent_70%)]" aria-hidden />
        <div className="grain absolute inset-0" aria-hidden />

        {/* giant shade name */}
        <AnimatePresence mode="popLayout">
          <motion.p
            key={g.slug}
            aria-hidden
            className="pointer-events-none absolute -left-[2vw] bottom-[6vh] whitespace-nowrap font-display text-[22vw] italic leading-none text-bone/[0.06]"
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {shade.name}
          </motion.p>
        </AnimatePresence>

        {/* Muse, mirrored — enters from the right */}
        <motion.div
          className="absolute bottom-[-6%] right-[-52%] aspect-[900/1100] h-[86%] sm:right-[-30%] md:right-[-8%] md:h-[112%]"
          style={reduce ? undefined : { x: museX, opacity: museOpacity }}
        >
          {photos[g.slug] ? (
            <AnimatePresence mode="popLayout">
              <motion.div key={g.slug} className="absolute inset-y-[8%] left-[6%] right-[18%] overflow-hidden md:inset-y-[12%]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
                <Image src={photos[g.slug].src} alt={photos[g.slug].alt} fill sizes="45vw" className="object-cover" />
                {photos[g.slug].ai && <span className="absolute bottom-2 right-2 bg-carbon/70 px-2 py-0.5 text-[0.6875rem] text-bone/85">AI-generated image</span>}
              </motion.div>
            </AnimatePresence>
          ) : site.campaign.glossCharacter ? (
            <Image src={site.campaign.glossCharacter} alt="CO2 campaign" fill sizes="60vw" className="object-contain object-bottom" />
          ) : (
            <Muse className="h-full w-full" mirror lipTint={shade.hex} tone="gold" />
          )}

          {/* glosses travelling to the lips */}
          {!photos[g.slug] && glosses.map((x, i) => {
            const isActive = i === idx;
            const slot = (i - idx + 3) % 3; // 0 = at lips, 1/2 = waiting
            return (
              <motion.div
                key={x.slug}
                className="absolute h-[22%] md:h-[30%]"
                initial={false}
                animate={
                  isActive
                    ? { left: mobile ? "-4%" : "-15%", top: mobile ? "46%" : "40%", rotate: -14, scale: 1, opacity: 1, filter: "blur(0px)" }
                    : {
                        left: slot === 1 ? "-32%" : "-28%",
                        top: slot === 1 ? "10%" : "68%",
                        rotate: slot === 1 ? 10 : -8,
                        scale: 0.7,
                        opacity: mobile ? 0 : 0.5,
                        filter: "blur(1.5px)",
                      }
                }
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ zIndex: isActive ? 3 : 1 }}
              >
                <Image src={cutoutImage(x.slug)} alt={isActive ? `${x.name} lip gloss` : ""} width={592} height={688} className="h-full w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,.45)]" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* copy */}
        <motion.div className="absolute inset-x-0 top-[calc(var(--nav-h)+3vh)] md:top-[calc(var(--nav-h)+7vh)]" style={reduce ? undefined : { y: textY, opacity: textOpacity }}>
          <div className="container-site">
            <div className="max-w-[min(36rem,92vw)] md:max-w-[30vw]">
              <p className="eyebrow text-bone/60"><span className="mr-3">08 —</span>High-shine lips</p>
              <h2 id="gloss-title" className="mt-4 font-display text-[clamp(2.75rem,5.4vw,5.75rem)] leading-[0.9]">
                Three shades. <span className="block italic">One glass finish.</span>
              </h2>
              <p className="mt-5 hidden max-w-sm text-sm leading-relaxed text-bone/70 md:block">
                Plumping, non-sticky gloss with vitamin E, jojoba oil and shea butter — deep colour that catches the light.
              </p>

              <div className="mt-7 flex items-center gap-3" role="radiogroup" aria-label="Choose a shade">
                {glosses.map((x, i) => (
                  <button
                    key={x.slug}
                    role="radio"
                    aria-checked={i === idx}
                    aria-label={x.shades[0].name}
                    onClick={() => setManual(i)}
                    className="group flex items-center gap-2"
                  >
                    <span className={`block h-9 w-9 rounded-full ring-offset-2 ring-offset-transparent transition ${i === idx ? "ring-2 ring-bone" : "ring-1 ring-bone/30 group-hover:ring-bone/70"}`} style={{ background: x.shades[0].hex }} />
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={g.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }} className="mt-6">
                  <p className="font-display text-3xl">{shade.name}</p>
                  <p className="text-sm text-bone/60">{g.size} · {priceText(listedPrice(g))}{isPricePending(g) ? " · as per customization" : ""}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {isPricePending(g) ? (
                      <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`${g.name} — ${shade.name}`)} className="btn btn-light">Request price</a>
                    ) : (
                      <button onClick={() => addToCart(g.slug, 1, { shade: shade.name })} className="btn btn-light">
                        <Plus className="h-4 w-4" /> Add to cart
                      </button>
                    )}
                    <Link href={`/product/${g.slug}`} className="btn btn-outline-light">View</Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** deepen a shade into a room colour */
function mix(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const k = 0.42;
  const to = (v: number, base: number) => Math.round(v * k + base * (1 - k));
  return `rgb(${to(r, 17)}, ${to(g, 16)}, ${to(b, 13)})`;
}
