"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { Overlay } from "@/components/ui/Overlay";
import { ProductImage } from "@/components/ui/ProductImage";
import { departments, skinConcerns, hairConcerns } from "@/data/taxonomy";
import { getBestSellers, searchProducts } from "@/lib/catalog";
import { cardTypeLabel, primaryDepartment } from "@/lib/taxonomy";
import { isPricePending, priceText } from "@/lib/utils";

const suggestions = ["acne", "dandruff", "glow", "lip gloss", "berry rubin", "24K gold", "charcoal", "hyaluronic", "shampoo", "bath bar"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const router = useRouter();
  const pathname = usePathname();
  const close = () => setSearchOpen(false);

  useEffect(() => close(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const all = useMemo(() => searchProducts(dq), [dq]);
  // results are grouped by department — skin, hair and lip products never share a grid
  const groups = useMemo(
    () => departments.map((d) => ({ d, items: all.filter((p) => primaryDepartment(p) === d.id) })).filter((g) => g.items.length),
    [all],
  );
  const typeHits = useMemo(() => {
    const t = dq.trim().toLowerCase();
    if (!t) return [];
    const concernHits = [...skinConcerns.map((c) => ({ ...c, dept: "skin" })), ...hairConcerns.map((c) => ({ ...c, dept: "hair" }))]
      .filter((c) => c.label.toLowerCase().includes(t))
      .map((c) => ({ id: c.id, label: c.label, href: `/shop/${c.dept}?concern=${c.id}` }));
    const deptHits = departments.filter((d) => d.label.toLowerCase().includes(t) || d.title.toLowerCase().includes(t)).map((d) => ({ id: d.id, label: d.title, href: `/shop/${d.id}` }));
    return [...deptHits, ...concernHits].slice(0, 5);
  }, [dq]);
  const total = all.length;

  return (
    <Overlay open={searchOpen} onClose={close} label="Search products" side="top" className="bg-carbon text-bone">
      <div className="container-site flex h-[var(--nav-h)] items-center justify-between">
        <span className="eyebrow text-bone/50">Search CO2</span>
        <button onClick={close} aria-label="Close search" className="-mr-2 p-2 hover:text-gold-light">
          <X className="h-6 w-6" strokeWidth={1.3} />
        </button>
      </div>
      <div className="container-site overflow-y-auto pb-12" data-lenis-prevent>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
          className="flex items-center gap-4 border-b border-bone/25 pb-4 focus-within:border-gold-light"
        >
          <Search className="h-6 w-6 shrink-0 text-bone/50 md:h-8 md:w-8" strokeWidth={1.2} />
          <label htmlFor="site-search" className="sr-only">Search by product, ingredient or category</label>
          <input
            id="site-search"
            data-autofocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Acne, dandruff, gloss, neem…"
            autoComplete="off"
            className="w-full bg-transparent font-display text-4xl outline-none placeholder:text-bone/25 md:text-7xl"
          />
        </form>

        {!dq.trim() ? (
          <div className="grid gap-12 pt-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow text-bone/50">Try</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button className="chip chip-dark" onClick={() => setQ(s)}>{s}</button>
                  </li>
                ))}
              </ul>
              <p className="eyebrow mt-10 text-bone/50">Browse</p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-lg">
                {departments.map((c) => (
                  <li key={c.id}><Link href={`/shop/${c.id}`} className="font-display text-3xl hover:text-gold-light">{c.label}</Link></li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-7">
              <p className="eyebrow text-bone/50">Most loved</p>
              <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {getBestSellers().slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/product/${p.slug}`} className="group block">
                      <div className="relative aspect-square overflow-hidden"><ProductImage product={p} sizes="200px" className="absolute inset-0" /></div>
                      <p className="mt-2 font-display text-lg leading-tight">{p.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-bone/60" aria-live="polite">
                {total} {total === 1 ? "result" : "results"} for “{dq}”
              </p>
              {typeHits.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {typeHits.map((t) => (
                    <li key={t.id}><Link href={t.href} className="chip chip-dark">{t.label} <ArrowUpRight className="h-3 w-3" /></Link></li>
                  ))}
                </ul>
              )}
            </div>
            {groups.length ? (
              <div className="mt-6 space-y-10">
                {groups.map(({ d, items }) => (
                  <section key={d.id} aria-label={`${d.label} results`}>
                    <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-line-dark pb-2">
                      <h3 className="eyebrow text-gold-light">{d.label} · {items.length}</h3>
                      {items.length > 4 && <Link href={`/shop/${d.id}?q=${encodeURIComponent(dq)}`} className="text-xs uppercase tracking-[0.14em] text-bone/60 hover:text-bone">All {items.length} in {d.label} →</Link>}
                    </div>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                      {items.slice(0, 4).map((p, i) => (
                        <motion.li key={p.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                          <Link href={`/product/${p.slug}`} className="group flex gap-3 sm:block">
                            <div className="relative aspect-square w-24 shrink-0 sm:w-full"><ProductImage product={p} sizes="(max-width:640px) 96px, 25vw" className="absolute inset-0" /></div>
                            <div className="sm:mt-3">
                              <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-bone/40">{cardTypeLabel(p)}</p>
                              <p className="mt-1 font-display text-xl leading-tight group-hover:text-gold-light">{p.name}</p>
                              <p className="mt-1 text-sm text-bone/60">{priceText(isPricePending(p) ? null : p.price)}</p>
                            </div>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : (
              <p className="mt-10 font-display text-3xl text-bone/70">Nothing matches yet — try a concern like “acne” or an ingredient like “aloe”.</p>
            )}
            {total > 0 && (
              <Link href={`/search?q=${encodeURIComponent(dq)}`} className="btn btn-outline-light mt-10">See all {total} results</Link>
            )}
          </div>
        )}
      </div>
    </Overlay>
  );
}
