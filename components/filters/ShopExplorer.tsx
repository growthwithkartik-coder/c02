"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Rows3, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types";
import { categories, allTypes, skinTypes } from "@/data/categories";
import { ProductCard } from "@/components/product-card/ProductCard";
import { searchProducts } from "@/lib/catalog";
import { cn, money, isPricePending, comparePrice, PRICES_ON_REQUEST } from "@/lib/utils";

/* ------------------------------------------------------------------
   Shop explorer — search, filters and sorting, synced to the URL
   (?q=&cat=&type=&skin=&min=&max=&stock=&rating=&sort=) so every
   filtered view is shareable. Used by /shop and /shop/[category].
------------------------------------------------------------------- */

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "best", label: "Best selling" },
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
].filter((s) => !PRICES_ON_REQUEST || !s.id.startsWith("price"));

type Filters = {
  q: string;
  cat: string[];
  type: string[];
  skin: string[];
  min: number | null;
  max: number | null;
  stock: boolean;
  rating: number | null;
  sort: string;
};

function parse(sp: URLSearchParams): Filters {
  const list = (k: string) => (sp.get(k) ? sp.get(k)!.split(",").filter(Boolean) : []);
  const num = (k: string) => (sp.get(k) && !isNaN(Number(sp.get(k))) ? Number(sp.get(k)) : null);
  return { q: sp.get("q") ?? "", cat: list("cat"), type: list("type"), skin: list("skin"), min: num("min"), max: num("max"), stock: sp.get("stock") === "1", rating: num("rating"), sort: sp.get("sort") ?? "featured" };
}

function serialize(f: Filters) {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.cat.length) sp.set("cat", f.cat.join(","));
  if (f.type.length) sp.set("type", f.type.join(","));
  if (f.skin.length) sp.set("skin", f.skin.join(","));
  if (f.min != null) sp.set("min", String(f.min));
  if (f.max != null) sp.set("max", String(f.max));
  if (f.stock) sp.set("stock", "1");
  if (f.rating) sp.set("rating", String(f.rating));
  if (f.sort !== "featured") sp.set("sort", f.sort);
  return sp.toString();
}

export function ShopExplorer({ products, lockedCategory, lockedType }: { products: Product[]; lockedCategory?: string; lockedType?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [f, setF] = useState<Filters>(() => parse(new URLSearchParams(sp.toString())));
  const [drawer, setDrawer] = useState(false);
  const [dense, setDense] = useState(false);
  const [qInput, setQInput] = useState(f.q);

  // URL → state (back/forward)
  useEffect(() => {
    const next = parse(new URLSearchParams(sp.toString()));
    setF(next);
    setQInput(next.q);
  }, [sp]);

  function update(patch: Partial<Filters>) {
    const next = { ...f, ...patch };
    setF(next);
    const qs = serialize(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // debounce search input → URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (qInput !== f.q) update({ q: qInput });
    }, 250);
    return () => clearTimeout(t);
  }, [qInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const prices = products.filter((p) => !isPricePending(p)).map((p) => p.price);
  const priceFloor = Math.min(...prices);
  const priceCeil = Math.max(...prices);
  const hasRatings = products.some((p) => p.rating);

  const visibleTypes = useMemo(() => {
    if (lockedType) return [];
    const cats = lockedCategory ? [lockedCategory] : f.cat.length ? f.cat : categories.map((c) => c.id);
    return allTypes.filter((t) => cats.includes(t.category) && products.some((p) => p.type === t.id));
  }, [f.cat, lockedCategory, lockedType, products]);

  const result = useMemo(() => {
    let list = f.q ? searchProducts(f.q, products) : products.slice();
    if (!lockedCategory && f.cat.length) list = list.filter((p) => f.cat.includes(p.category));
    if (f.type.length) list = list.filter((p) => f.type.includes(p.type));
    if (f.skin.length) list = list.filter((p) => p.skinTypes.some((s) => f.skin.includes(s)));
    if (f.min != null || f.max != null) list = list.filter((p) => !isPricePending(p));
    if (f.min != null) list = list.filter((p) => p.price >= f.min!);
    if (f.max != null) list = list.filter((p) => p.price <= f.max!);
    if (f.stock) list = list.filter((p) => p.availability === "in-stock" || p.availability === "low-stock");
    if (f.rating) list = list.filter((p) => (p.rating ?? 0) >= f.rating!);
    const by: Record<string, (a: Product, b: Product) => number> = {
      featured: (a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller) || a.order - b.order,
      best: (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || Number(b.featured) - Number(a.featured) || a.order - b.order,
      new: (a, b) => b.order - a.order,
      "price-asc": (a, b) => comparePrice(a, b, 1),
      "price-desc": (a, b) => comparePrice(a, b, -1),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    if (!f.q || f.sort !== "featured") list.sort(by[f.sort] ?? by.featured);
    return list;
  }, [f, products, lockedCategory]);

  const activeCount = (lockedCategory ? 0 : f.cat.length) + f.type.length + f.skin.length + (f.min != null || f.max != null ? 1 : 0) + (f.stock ? 1 : 0) + (f.rating ? 1 : 0);
  const toggle = (key: "cat" | "type" | "skin", v: string) => update({ [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] } as Partial<Filters>);
  const clearAll = () => update({ cat: [], type: [], skin: [], min: null, max: null, stock: false, rating: null, q: "" });

  const priceBands = [
    { label: `Under ${money(400)}`, min: null, max: 399 },
    { label: `${money(400)} – ${money(700)}`, min: 400, max: 700 },
    { label: `${money(701)} – ${money(1500)}`, min: 701, max: 1500 },
    { label: `Over ${money(1500)}`, min: 1501, max: null },
  ];

  const panel = (
    <div className="space-y-9">
      {!lockedCategory && (
        <FilterGroup title="Category">
          {categories.map((c) => (
            <Check key={c.id} label={c.label} count={products.filter((p) => p.category === c.id).length} checked={f.cat.includes(c.id)} onChange={() => toggle("cat", c.id)} />
          ))}
        </FilterGroup>
      )}
      {visibleTypes.length > 1 && (
        <FilterGroup title="Product type">
          {visibleTypes.map((t) => (
            <Check key={t.id} label={t.label} count={products.filter((p) => p.type === t.id).length} checked={f.type.includes(t.id)} onChange={() => toggle("type", t.id)} />
          ))}
        </FilterGroup>
      )}
      {!PRICES_ON_REQUEST && <FilterGroup title="Price">
        {priceBands.map((b) => {
          const on = f.min === b.min && f.max === b.max;
          return <Check key={b.label} label={b.label} checked={on} onChange={() => update(on ? { min: null, max: null } : { min: b.min, max: b.max })} radio />;
        })}
        <div className="flex items-center gap-2 pt-2">
          <input type="number" inputMode="numeric" aria-label="Minimum price" placeholder={`₹${priceFloor}`} value={f.min ?? ""} onChange={(e) => update({ min: e.target.value ? Number(e.target.value) : null })} className="input h-10 px-3 text-sm" />
          <span className="text-taupe">–</span>
          <input type="number" inputMode="numeric" aria-label="Maximum price" placeholder={`₹${priceCeil}`} value={f.max ?? ""} onChange={(e) => update({ max: e.target.value ? Number(e.target.value) : null })} className="input h-10 px-3 text-sm" />
        </div>
      </FilterGroup>}
      <FilterGroup title="Skin type">
        <div className="flex flex-wrap gap-2">
          {skinTypes.map((s) => (
            <button key={s} type="button" className="chip h-8 text-xs" aria-pressed={f.skin.includes(s)} onClick={() => toggle("skin", s)}>
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Availability">
        <Check label="In stock only" checked={f.stock} onChange={() => update({ stock: !f.stock })} />
      </FilterGroup>
      {hasRatings ? (
        <FilterGroup title="Rating">
          {[4, 3].map((r) => (
            <Check key={r} label={`${r}★ & up`} checked={f.rating === r} onChange={() => update({ rating: f.rating === r ? null : r })} radio />
          ))}
        </FilterGroup>
      ) : (
        <FilterGroup title="Rating">
          <p className="text-xs leading-relaxed text-taupe">Ratings appear once verified reviews come in.</p>
        </FilterGroup>
      )}
    </div>
  );

  return (
    <div className="container-site pb-section">
      {/* toolbar */}
      <div className="sticky-under-nav sticky z-20 -mx-gutter border-b border-line bg-bone/90 px-gutter py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setDrawer(true)} className="chip lg:hidden">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters {activeCount ? <span className="tabular-nums">({activeCount})</span> : null}
          </button>
          <div className="relative order-last w-full sm:order-none sm:w-auto sm:flex-1 lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" strokeWidth={1.5} />
            <label htmlFor="shop-q" className="sr-only">Search products</label>
            <input id="shop-q" value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="Search name, ingredient…" className="input h-10 pl-9 text-sm" />
          </div>
          <p className="text-sm text-ink-soft" aria-live="polite">
            <span className="tabular-nums text-ink">{result.length}</span> {result.length === 1 ? "product" : "products"}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="shop-sort" className="sr-only">Sort by</label>
            <select id="shop-sort" value={f.sort} onChange={(e) => update({ sort: e.target.value })} className="input h-10 w-auto cursor-pointer pr-8 text-sm">
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <div className="hidden items-center border border-line md:flex" role="group" aria-label="Grid density">
              <button type="button" aria-pressed={!dense} onClick={() => setDense(false)} className="grid h-10 w-10 place-items-center aria-pressed:bg-ink aria-pressed:text-bone" aria-label="Large tiles"><Rows3 className="h-4 w-4" /></button>
              <button type="button" aria-pressed={dense} onClick={() => setDense(true)} className="grid h-10 w-10 place-items-center aria-pressed:bg-ink aria-pressed:text-bone" aria-label="Compact grid"><LayoutGrid className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
        {activeCount > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {!lockedCategory && f.cat.map((c) => <Pill key={c} onRemove={() => toggle("cat", c)}>{categories.find((x) => x.id === c)?.label}</Pill>)}
            {f.type.map((t) => <Pill key={t} onRemove={() => toggle("type", t)}>{allTypes.find((x) => x.id === t)?.label}</Pill>)}
            {f.skin.map((s) => <Pill key={s} onRemove={() => toggle("skin", s)}>{s}</Pill>)}
            {(f.min != null || f.max != null) && <Pill onRemove={() => update({ min: null, max: null })}>{f.min != null ? money(f.min) : "₹0"} – {f.max != null ? money(f.max) : "any"}</Pill>}
            {f.stock && <Pill onRemove={() => update({ stock: false })}>In stock</Pill>}
            {f.rating && <Pill onRemove={() => update({ rating: null })}>{f.rating}★ & up</Pill>}
            <button onClick={clearAll} className="text-xs uppercase tracking-[0.14em] text-taupe underline-offset-4 hover:text-ink hover:underline">Clear all</button>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr] xl:gap-14">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-[calc(var(--nav-h)+5.5rem)] max-h-[calc(100vh-var(--nav-h)-7rem)] overflow-y-auto pb-10 pr-2 no-scrollbar" data-lenis-prevent>
            {panel}
          </div>
        </aside>

        <div>
          {result.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-4xl">No products match those filters.</p>
              <p className="mt-3 text-ink-soft">Try removing a filter or searching for an ingredient like “aloe”.</p>
              <button onClick={clearAll} className="btn btn-primary mt-8">Clear filters</button>
            </div>
          ) : (
            <motion.ul layout className={cn("grid gap-x-4 gap-y-12 md:gap-x-6", dense ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 xs:grid-cols-2 xl:grid-cols-3")}>
              <AnimatePresence mode="popLayout">
                {result.map((p, i) => (
                  <motion.li key={p.slug} layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 8) * 0.03 }}>
                    <ProductCard product={p} priority={i < 3} showCompare sizes={dense ? "(max-width:768px) 50vw, (max-width:1280px) 33vw, 22vw" : "(max-width:420px) 100vw, (max-width:1280px) 50vw, 30vw"} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
            <motion.div className="absolute inset-0 bg-carbon/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div className="absolute inset-y-0 left-0 flex w-[88vw] max-w-sm flex-col bg-bone" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <p className="font-display text-3xl">Filters</p>
                <button onClick={() => setDrawer(false)} aria-label="Close filters" className="p-2"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6" data-lenis-prevent>{panel}</div>
              <div className="grid grid-cols-2 gap-2 border-t border-line p-4 pb-safe">
                <button onClick={clearAll} className="btn btn-outline">Clear</button>
                <button onClick={() => setDrawer(false)} className="btn btn-primary">Show {result.length}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-4 text-taupe">{title}</legend>
      <div className="space-y-2.5">{children}</div>
    </fieldset>
  );
}

function Check({ label, count, checked, onChange, radio }: { label: string; count?: number; checked: boolean; onChange: () => void; radio?: boolean }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className={cn("grid h-4 w-4 shrink-0 place-items-center border border-ink/40 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-gold group-hover:border-ink", radio && "rounded-full", checked && "border-ink bg-ink")}>
        {checked && <span className={cn("h-1.5 w-1.5 bg-bone", radio && "rounded-full")} />}
      </span>
      <span className={cn("flex-1", checked ? "text-ink" : "text-ink-soft")}>{label}</span>
      {count != null && <span className="text-xs tabular-nums text-taupe">{count}</span>}
    </label>
  );
}

function Pill({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <button type="button" onClick={onRemove} className="chip h-8 border-ink bg-ink text-xs text-bone">
      {children} <X className="h-3 w-3" />
    </button>
  );
}
