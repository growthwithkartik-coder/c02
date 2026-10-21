"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/types";
import { categories } from "@/data/categories";
import { ProductCard } from "@/components/product-card/ProductCard";
import { cn } from "@/lib/utils";

const useIsoLayout = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* SECTION 04 — the whole catalogue as one moving shelf.
   Desktop: the section pins and vertical scroll drives the shelf
   sideways (two rows). Touch / small screens: a native swipe shelf. */
export function ProductUniverse({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<string>("all");
  const list = useMemo(() => (filter === "all" ? products : products.filter((p) => p.category === filter)), [products, filter]);
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, products.filter((p) => p.category === c.id).length])), [products]);

  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);
  const reduce = useReducedMotion();

  useIsoLayout(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const measure = () => {
      const ok = mq.matches && !reduce;
      setPinned(ok);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [list, reduce]);

  // pin length: shelf moves ~1.8× faster than the page so it never drags on
  const pinLength = Math.min(Math.max(distance / 1.8, 900), 4200);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(smooth, [0, 1], ["0%", "100%"]);

  // keep the section in view when the filter changes the shelf length
  function choose(id: string) {
    setFilter(id);
    if (pinned && section.current) {
      const top = section.current.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
    }
  }

  const chips = [{ id: "all", label: "All", count: products.length }, ...categories.map((c) => ({ id: c.id, label: c.label, count: counts[c.id] }))];

  return (
    <section
      ref={section}
      className="relative bg-carbon text-bone"
      style={pinned ? { height: `calc(100vh + ${pinLength}px)` } : undefined}
      aria-labelledby="universe-title"
    >
      <div className={cn("overflow-hidden", pinned ? "sticky top-0 flex h-screen flex-col" : "py-section")}>
        <div className={cn("container-site flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", pinned ? "pt-[calc(var(--nav-h)+2.5vh)]" : "")}>
          <div>
            <p className="eyebrow text-gold-light"><span className="mr-3">05 —</span>The product universe</p>
            <h2 id="universe-title" className="mt-3 font-display text-[clamp(2.5rem,4.6vw,4.75rem)] leading-[0.95]">
              Every formula, <span className="italic text-gold-light">one shelf.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <div role="toolbar" aria-label="Filter the shelf by category" className="-mx-gutter flex gap-2 overflow-x-auto px-gutter no-scrollbar lg:mx-0 lg:px-0">
              {chips.map((c) => (
                <button key={c.id} type="button" onClick={() => choose(c.id)} aria-pressed={filter === c.id} className="chip chip-dark shrink-0">
                  {c.label} <span className="tabular-nums opacity-50">{c.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={cn("relative", pinned ? "mt-[3vh] flex-1 min-h-0" : "mt-10")}>
          <motion.div
            ref={track}
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={pinned ? { x } : undefined}
            className={cn(
              "grid grid-flow-col gap-x-5 gap-y-6 px-gutter",
              pinned ? "h-full w-max auto-cols-[clamp(190px,21vh,260px)] grid-rows-2 content-start" : "auto-cols-[62vw] grid-rows-2 overflow-x-auto snap-x snap-mandatory no-scrollbar sm:auto-cols-[38vw] md:auto-cols-[30vw]",
            )}
          >
            {list.map((p) => (
              <div key={p.slug} className="snap-start">
                <ProductCard product={p} variant="compact" dark sizes="270px" />
              </div>
            ))}
            <div className="row-span-2 flex snap-start items-center">
              <Link href={filter === "all" ? "/shop" : `/shop/${filter}`} className="group flex aspect-square w-full flex-col justify-between border border-line-dark p-6 transition-colors hover:border-gold-light">
                <span className="eyebrow text-bone/50">{list.length} products</span>
                <span className="font-display text-4xl leading-none group-hover:text-gold-light">Shop {filter === "all" ? "everything" : categories.find((c) => c.id === filter)?.label} →</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {pinned && (
          <div className="container-site pb-6 pt-4">
            <div className="h-px w-full bg-line-dark">
              <motion.div className="h-px bg-gold-light" style={{ width: bar }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
