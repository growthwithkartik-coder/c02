"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Magnetic } from "@/components/animations/motion";
import { useStore } from "@/components/providers/StoreProvider";
import type { Product } from "@/types";
import { site } from "@/data/site";
import { money, priceText, PRICES_ON_REQUEST } from "@/lib/utils";

import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";
const EASE = [0.16, 1, 0.3, 1] as const;

/* SECTION 01 (campaign version) — used automatically instead of the
   illustrated Muse hero once a "hero" campaign image is approved in
   data/campaign-images.json. */
export function CampaignHero({ image, alt, aiGenerated, product }: { image: string; alt: string; aiGenerated: boolean; product: Product }) {
  const reduce = useReducedMotion();
  const { addToCart } = useStore();
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-carbon text-bone" aria-label="CO2 — introduction">
      <motion.div
        className="absolute inset-0 md:left-[38%]"
        initial={reduce ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <Image src={image} alt={alt} fill priority sizes="(max-width:768px) 100vw, 62vw" className="object-cover object-[60%_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/30 to-transparent md:bg-gradient-to-r md:from-carbon md:via-carbon/10 md:to-transparent" aria-hidden />
      </motion.div>

      <div className="container-site relative flex min-h-[100svh] flex-col justify-end pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(var(--nav-h)+2rem)] md:justify-center md:pb-16">
        <div className="max-w-xl">
          <h1 className="font-display text-[clamp(3.6rem,13vw,9.5rem)] leading-[0.84] tracking-[-0.035em]">
            <span className="block overflow-hidden"><motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}>The element</motion.span></span>
            <span className="block overflow-hidden"><motion.span className="block text-gold-light" initial={reduce ? false : { y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.4, ease: EASE, delay: 0.52 }}>of you.</motion.span></span>
          </h1>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-bone/75">
            24K gold, botanicals, minerals and high-shine colour — and a routine built around your skin.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic><Link href="/make-it-yours/face" className="btn btn-gold px-5 md:btn-lg">Customized Skincare</Link></Magnetic>
            <Magnetic><Link href="/shop" className="btn btn-outline-light px-5 md:btn-lg">Shop collection</Link></Magnetic>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line-dark pt-5 text-sm">
            <span className="text-bone/60">Shown:</span>
            <Link href={`/product/${product.slug}`} className="hover:text-gold-light">{product.name}</Link>
            <span className="tabular-nums text-bone/60">{priceText(product.price)}</span>
            {PRICES_ON_REQUEST ? (
              <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(product.name)} className="inline-flex items-center gap-1.5 text-gold-light hover:text-bone">Request price</a>
            ) : (
              <button type="button" onClick={() => addToCart(product.slug)} className="inline-flex items-center gap-1.5 text-gold-light hover:text-bone"><Plus className="h-4 w-4" /> Add</button>
            )}
          </div>
        </div>
      </div>
      {aiGenerated && <p className="absolute bottom-3 right-4 text-[0.6875rem] text-bone/55">AI-generated campaign image · {site.name}</p>}
    </section>
  );
}
