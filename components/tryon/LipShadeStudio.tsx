"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useTryOn } from "./TryOnProvider";
import { getProduct } from "@/lib/catalog";
import { getTryOnShades, type TryOnShade } from "@/lib/taxonomy";
import { cn, isPricePending, money, productImage } from "@/lib/utils";

/* Lips department: shade selector + preview. Every retail lip shade is a
   swatch; picking one swaps the preview to that shade's product photograph,
   and "Try … on" opens the virtual try-on on exactly that shade. */

const retail = getTryOnShades().filter((s) => !s.indicative);
const groups: { id: TryOnShade["line"]; label: string }[] = [
  { id: "lipstick", label: "Lipstick" },
  { id: "gloss", label: "Lip gloss" },
];

export function LipShadeStudio() {
  const tryOn = useTryOn();
  const [id, setId] = useState(retail[0]?.id);
  const shade = retail.find((s) => s.id === id) ?? retail[0];
  if (!shade) return null;
  const product = getProduct(shade.slug);
  const pending = isPricePending(product);

  return (
    <section id="try-on" className="scroll-mt-[calc(var(--nav-h)+1rem)] bg-carbon text-bone" aria-labelledby="shade-studio-title">
      <div className="container-site grid items-center gap-8 py-10 md:grid-cols-12 md:gap-10 md:py-14">
        <div className="min-w-0 md:col-span-5">
          <p className="eyebrow text-gold-light">Shade selector · Virtual try-on</p>
          <h2 id="shade-studio-title" className="mt-3 font-display text-4xl leading-[1] md:text-5xl">Pick a shade. Try it on your own face.</h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-bone/70">Choose any CO2 lipstick or gloss shade, then turn on your camera for a live preview that follows your lips, or upload a photo. Switch shades without re-uploading.</p>

          {groups.map((g) => {
            const list = retail.filter((s) => s.line === g.id);
            if (!list.length) return null;
            return (
              <div key={g.id} className="mt-7">
                <p className="label text-bone/50" id={`shades-${g.id}`}>{g.label}</p>
                <div role="radiogroup" aria-labelledby={`shades-${g.id}`} className="mt-3 flex flex-wrap gap-3">
                  {list.map((s) => {
                    const active = s.id === shade.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={`${s.name} ${g.label.toLowerCase()}`}
                        title={s.name}
                        onClick={() => setId(s.id)}
                        data-testid={`studio-shade-${s.id}`}
                        className="group flex flex-col items-center gap-2 text-[0.6875rem] outline-none"
                      >
                        <span
                          className={cn(
                            "block h-11 w-11 rounded-full ring-offset-[3px] ring-offset-carbon transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-gold-light",
                            active ? "scale-105 ring-2 ring-gold-light" : "ring-1 ring-white/25 group-hover:ring-white/60",
                          )}
                          style={{ background: s.hex }}
                          aria-hidden
                        />
                        <span className={cn("max-w-[5.5rem] text-center leading-tight transition-colors", active ? "text-bone" : "text-bone/50")}>{s.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <p className="mt-7 flex items-start gap-2 text-xs text-bone/55"><ShieldCheck className="h-4 w-4 shrink-0 text-gold-light" aria-hidden /> Runs entirely in your browser. Nothing is uploaded or saved.</p>
        </div>

        <div className="min-w-0 md:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-bone-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {shade.image && (
                <motion.div key={shade.image} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                  <Image src={productImage(shade.image)} alt={`${product?.name ?? ""} — ${shade.name}`} fill sizes="(max-width:768px) 92vw, 55vw" className="object-contain" data-testid="studio-preview" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3" aria-live="polite">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="h-8 w-8 shrink-0 rounded-full ring-1 ring-white/30" style={{ background: shade.hex }} aria-hidden />
              <div className="min-w-0">
                <p className="truncate font-display text-2xl leading-tight" data-testid="studio-shade-name">{shade.name}</p>
                <p className="text-xs text-bone/55">{product?.name} · {pending || !product ? "Price on request · as per customization" : money(product.price)}</p>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
              <button type="button" onClick={() => tryOn.open(shade.id)} className="btn btn-gold btn-sm h-11 px-4 sm:px-5" data-testid="studio-try">
                <Sparkles className="h-4 w-4" aria-hidden /> Try {shade.name} on
              </button>
              {product && (
                <Link href={`/product/${product.slug}`} className="btn btn-outline-light btn-sm h-11 px-4 sm:px-5">View product</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
