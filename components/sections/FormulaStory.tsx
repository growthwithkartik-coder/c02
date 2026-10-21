"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cutoutImage } from "@/lib/utils";

export interface FormulaChapter {
  id: string;
  title: string;
  italic: string;
  text: string;
  ingredients: string[];
  image: string; // cutout slug
  tint: string;
  products: { slug: string; name: string }[];
}

/* SECTION 05 — ingredient / formula story. The visual column sticks
   while chapters scroll past; each chapter swaps the product and tint. */
export function FormulaStory({ chapters }: { chapters: FormulaChapter[] }) {
  const [active, setActive] = useState(0);
  const ch = chapters[active];

  return (
    <section className="relative bg-stone/60" aria-labelledby="formula-title">
      <div className="container-site pt-section">
        <p className="eyebrow text-taupe"><span className="mr-3">06 —</span>Ingredients & formula</p>
        <h2 id="formula-title" className="mt-4 max-w-[14ch] font-display text-display-md">
          What&rsquo;s inside is <span className="italic text-gold-deep">printed on the outside.</span>
        </h2>
      </div>

      <div className="container-site grid gap-10 pb-section lg:grid-cols-12">
        {/* sticky visual */}
        <div className="relative hidden lg:col-span-6 lg:block">
          <div className="sticky top-0 flex h-screen items-center">
            <div className="relative aspect-square w-full max-w-[640px]">
              <motion.div className="absolute inset-[6%] rounded-full" animate={{ backgroundColor: ch.tint }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
              <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full animate-[spin_60s_linear_infinite] text-ink/50" aria-hidden>
                <defs>
                  <path id="orbit" d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" />
                </defs>
                <text fontSize="11" letterSpacing="4" fill="currentColor" style={{ textTransform: "uppercase" }}>
                  <textPath href="#orbit">{(ch.ingredients.join(" · ") + " · ").repeat(3).slice(0, 150)}</textPath>
                </text>
              </svg>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={ch.id}
                  className="absolute inset-[14%] flex items-center justify-center"
                  initial={{ opacity: 0, y: 60, rotate: -8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -60, rotate: 6, scale: 0.95 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={cutoutImage(ch.image)} alt="" width={900} height={900} className="max-h-full w-auto object-contain drop-shadow-[0_40px_50px_rgba(40,25,10,.3)]" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-[4%] left-0 flex gap-2">
                {chapters.map((c, i) => (
                  <span key={c.id} className={`h-px transition-all duration-700 ${i === active ? "w-10 bg-ink" : "w-4 bg-ink/30"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* chapters */}
        <div className="lg:col-span-5 lg:col-start-8">
          {chapters.map((c, i) => (
            <Chapter key={c.id} chapter={c} index={i} onActive={() => setActive(i)} />
          ))}
          <p className="mt-6 max-w-md border-t border-line pt-6 text-xs leading-relaxed text-ink-soft">
            Ingredients are listed as they appear on each pack. We don&rsquo;t publish percentages, certifications or clinical results we can&rsquo;t stand behind —
            and nothing here is a medical claim.
          </p>
        </div>
      </div>
    </section>
  );
}

function Chapter({ chapter, index, onActive }: { chapter: FormulaChapter; index: number; onActive: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className="flex min-h-[70vh] flex-col justify-center border-t border-line py-14 lg:min-h-screen">
      {/* mobile visual */}
      <div className="relative mb-8 aspect-[4/3] overflow-hidden lg:hidden" style={{ background: chapter.tint }}>
        <Image src={cutoutImage(chapter.image)} alt="" width={700} height={700} className="absolute inset-0 m-auto h-[82%] w-auto object-contain" />
      </div>
      <p className="eyebrow tabular-nums text-taupe">Chapter {String(index + 1).padStart(2, "0")}</p>
      <h3 className="mt-3 font-display text-5xl leading-[0.95] md:text-6xl">
        {chapter.title} <span className="italic text-gold-deep">{chapter.italic}</span>
      </h3>
      <p className="mt-5 max-w-md leading-relaxed text-ink-soft">{chapter.text}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {chapter.ingredients.map((ing) => (
          <li key={ing} className="chip pointer-events-none bg-bone/60">{ing}</li>
        ))}
      </ul>
      <div className="mt-8">
        <p className="eyebrow text-taupe">Find it in</p>
        <ul className="mt-3 space-y-2">
          {chapter.products.map((p) => (
            <li key={p.slug}>
              <Link href={`/product/${p.slug}`} className="group flex items-center justify-between border-b border-line pb-2 font-display text-2xl hover:text-gold-deep">
                {p.name}
                <span className="font-sans text-xs uppercase tracking-[0.16em] opacity-0 transition-opacity group-hover:opacity-100">View →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
