"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types";
import { formats } from "@/data/taxonomy";
import { ProductCard } from "@/components/product-card/ProductCard";
import { searchProducts } from "@/lib/catalog";
import { hasSample, isCustomizable } from "@/lib/commerce";
import { formatOf, getDepartments, primaryDepartment } from "@/lib/taxonomy";
import { cn, money, isPricePending, comparePrice, PRICES_ON_REQUEST } from "@/lib/utils";

/* ------------------------------------------------------------------
   Shop All — every product with filters (category, product type, price (hidden while prices are on request),
   size, availability, customization, travel size) and sorting, synced
   to the URL. Results stay grouped by category so skin, hair, body, lip
   and lip products never share one grid.
------------------------------------------------------------------- */

const sorts = [
  { id: "recommended", label: "Recommended" },
  { id: "best", label: "Bestselling" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name", label: "Name A–Z" },
].filter((s) => !PRICES_ON_REQUEST || !s.id.startsWith("price"));

const sizeBand = (p: Product) => {
  const n = parseFloat(p.size);
  if (isNaN(n)) return null;
  return n <= 50 ? "small" : n <= 150 ? "regular" : "large";
};
const sizeLabels: Record<string, string> = { small: "Up to 50 ml / g", regular: "51–150 ml / g", large: "Over 150 ml / g" };
const featLabels: Record<string, string> = { customizable: "Can be customized", sample: "Travel size available", "made-to-order": "Made to order" };
const feats = (p: Product) => [...(isCustomizable(p) ? ["customizable"] : []), ...(hasSample(p.slug) ? ["sample"] : []), ...(p.custom ? ["made-to-order"] : [])];

type F = { q: string; dept: string[]; fmt: string[]; size: string[]; feat: string[]; min: number | null; max: number | null; stock: boolean; sort: string };
const EMPTY: F = { q: "", dept: [], fmt: [], size: [], feat: [], min: null, max: null, stock: false, sort: "recommended" };

function parse(sp: URLSearchParams): F {
  const list = (k: string) => (sp.get(k) ? sp.get(k)!.split(",").filter(Boolean) : []);
  const num = (k: string) => (sp.get(k) && !isNaN(Number(sp.get(k))) ? Number(sp.get(k)) : null);
  return { q: sp.get("q") ?? "", dept: list("dept"), fmt: list("fmt"), size: list("size"), feat: list("feat"), min: num("min"), max: num("max"), stock: sp.get("stock") === "1", sort: sp.get("sort") ?? "recommended" };
}
function serialize(f: F) {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  for (const k of ["dept", "fmt", "size", "feat"] as const) if (f[k].length) sp.set(k, f[k].join(","));
  if (f.min != null) sp.set("min", String(f.min));
  if (f.max != null) sp.set("max", String(f.max));
  if (f.stock) sp.set("stock", "1");
  if (f.sort !== "recommended") sp.set("sort", f.sort);
  return sp.toString();
}

const sorters: Record<string, (a: Product, b: Product) => number> = {
  recommended: (a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller) || Number(!!a.custom) - Number(!!b.custom) || a.order - b.order,
  best: (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || a.order - b.order,
  "price-asc": (a, b) => comparePrice(a, b, 1),
  "price-desc": (a, b) => comparePrice(a, b, -1),
  name: (a, b) => a.name.localeCompare(b.name),
};

export function CatalogExplorer({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [f, setF] = useState<F>(() => parse(new URLSearchParams(sp.toString())));
  const [qInput, setQInput] = useState(f.q);
  const [drawer, setDrawer] = useState(false);
  const depts = getDepartments();

  useEffect(() => {
    const n = parse(new URLSearchParams(sp.toString()));
    setF(n);
    setQInput(n.q);
  }, [sp]);
  function update(patch: Partial<F>) {
    const next = { ...f, ...patch };
    setF(next);
    const qs = serialize(next);
    router.replace(qs ? `${pathname}?${qs}#all` : `${pathname}#all`, { scroll: false });
  }
  useEffect(() => {
    const t = setTimeout(() => qInput !== f.q && update({ q: qInput }), 250);
    return () => clearTimeout(t);
  }, [qInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const match = (p: Product, skip?: keyof F) => {
    if (skip !== "dept" && f.dept.length && !f.dept.includes(primaryDepartment(p))) return false;
    if (skip !== "fmt" && f.fmt.length && !f.fmt.includes(formatOf(p))) return false;
    if (skip !== "size" && f.size.length && !f.size.includes(sizeBand(p) ?? "")) return false;
    if (skip !== "feat" && f.feat.length && !f.feat.every((x) => feats(p).includes(x))) return false;
    if ((f.min != null || f.max != null) && isPricePending(p)) return false;
    if (f.min != null && p.price < f.min) return false;
    if (f.max != null && p.price > f.max) return false;
    if (f.stock && (p.availability === "out-of-stock" || p.availability === "price-pending")) return false;
    return true;
  };
  const base = useMemo(() => (f.q ? searchProducts(f.q, products) : products), [f.q, products]);
  const result = useMemo(() => base.filter((p) => match(p)).sort(sorters[f.sort] ?? sorters.recommended), [base, f]); // eslint-disable-line react-hooks/exhaustive-deps
  const count = (k: keyof F, fn: (p: Product) => boolean) => base.filter((p) => match(p, k) && fn(p)).length;
  const toggle = (k: "dept" | "fmt" | "size" | "feat", v: string) => update({ [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] } as Partial<F>);

  // only product types relevant to the selected categories
  const fmtPool = products.filter((p) => !f.dept.length || f.dept.includes(primaryDepartment(p)));
  const fmtList = formats.filter((x) => fmtPool.some((p) => formatOf(p) === x.id));
  const priceBands = [
    { label: `Under ${money(500)}`, min: null, max: 499 },
    { label: `${money(500)} – ${money(999)}`, min: 500, max: 999 },
    { label: `${money(1000)} – ${money(1999)}`, min: 1000, max: 1999 },
    { label: `${money(2000)} & above`, min: 2000, max: null },
  ];
  const active = f.dept.length + f.fmt.length + f.size.length + f.feat.length + (f.min != null || f.max != null ? 1 : 0) + (f.stock ? 1 : 0);

  const panel = (
    <div className="space-y-8">
      <Group title="Category">
        {depts.map((d) => <Check key={d.id} label={d.title} count={count("dept", (p) => primaryDepartment(p) === d.id)} checked={f.dept.includes(d.id)} onChange={() => toggle("dept", d.id)} />)}
      </Group>
      <Group title="Product type" scroll>
        {fmtList.map((x) => <Check key={x.id} label={x.label} count={count("fmt", (p) => formatOf(p) === x.id)} checked={f.fmt.includes(x.id)} onChange={() => toggle("fmt", x.id)} />)}
      </Group>
      {!PRICES_ON_REQUEST && (
        <Group title="Price">
          {priceBands.map((b) => {
            const on = f.min === b.min && f.max === b.max;
            return <Check key={b.label} radio label={b.label} checked={on} onChange={() => update(on ? { min: null, max: null } : { min: b.min, max: b.max })} />;
          })}
        </Group>
      )}
      <Group title="Size">
        {Object.entries(sizeLabels).map(([id, l]) => <Check key={id} label={l} count={count("size", (p) => sizeBand(p) === id)} checked={f.size.includes(id)} onChange={() => toggle("size", id)} />)}
      </Group>
      <Group title="Features">
        {Object.entries(featLabels).map(([id, l]) => <Check key={id} label={l} count={count("feat", (p) => feats(p).includes(id))} checked={f.feat.includes(id)} onChange={() => toggle("feat", id)} />)}
      </Group>
      <Group title="Availability">
        <Check label="Available to order" checked={f.stock} onChange={() => update({ stock: !f.stock })} />
      </Group>
    </div>
  );

  const grouped = depts.map((d) => ({ d, items: result.filter((p) => primaryDepartment(p) === d.id) })).filter((g) => g.items.length);

  return (
    <section id="all" className="container-site scroll-mt-[calc(var(--nav-h)+1rem)] pb-section" aria-labelledby="all-title">
      <div className="sticky-under-nav sticky z-20 -mx-gutter flex flex-wrap items-center gap-3 border-y border-line bg-bone/95 px-gutter py-3 backdrop-blur">
        <h2 id="all-title" className="mr-auto font-display text-2xl">All products <span className="text-base text-taupe">({result.length})</span></h2>
        <label className="relative hidden sm:block">
          <span className="sr-only">Search all products</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" />
          <input value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="Search name, ingredient…" className="input h-10 w-64 pl-9 text-sm" />
        </label>
        <button type="button" onClick={() => setDrawer(true)} className="btn btn-outline btn-sm lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters{active ? ` (${active})` : ""}</button>
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only sm:not-sr-only">Sort</span>
          <select value={f.sort} onChange={(e) => update({ sort: e.target.value })} className="input h-10 w-auto pr-8 text-sm">
            {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block" aria-label="Filters">
          <div className="sticky top-[calc(var(--nav-h)+5rem)] max-h-[calc(100vh-var(--nav-h)-6rem)] overflow-y-auto pr-2" data-lenis-prevent>
            {active > 0 && <button type="button" onClick={() => update({ ...EMPTY, sort: f.sort, q: f.q })} className="mb-6 text-xs underline underline-offset-4">Reset all filters</button>}
            {panel}
          </div>
        </aside>
        <div className="lg:col-span-9">
          {result.length === 0 ? (
            <div className="border border-dashed border-line p-10 text-center">
              <p className="font-display text-3xl">No products match.</p>
              <button type="button" onClick={() => update({ ...EMPTY, sort: f.sort })} className="btn btn-outline btn-sm mt-5">Clear filters</button>
            </div>
          ) : (
            <div className="space-y-14">
              {grouped.map(({ d, items }) => (
                <section key={d.id} aria-label={d.title}>
                  <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
                    <h3 className="font-display text-3xl">{d.title}</h3>
                    <span className="text-xs text-taupe">{items.length} products</span>
                  </div>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 xl:grid-cols-3">
                    {items.map((p) => <li key={p.slug} className="flex"><ProductCard product={p} className="w-full" sizes="(max-width:1280px) 46vw, 25vw" /></li>)}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[80] lg:hidden" data-lenis-prevent>
            <motion.div className="absolute inset-0 bg-carbon/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div role="dialog" aria-modal="true" aria-label="Filters" className="absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col bg-bone" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex h-16 items-center justify-between border-b border-line px-5">
                <p className="font-display text-2xl">Filters</p>
                <button type="button" onClick={() => setDrawer(false)} className="grid h-11 w-11 place-items-center" aria-label="Close filters"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <label className="mb-6 block"><span className="sr-only">Search</span><input value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="Search…" className="input h-11 text-sm" /></label>
                {panel}
              </div>
              <div className="flex gap-3 border-t border-line p-4 pb-safe">
                <button type="button" onClick={() => update({ ...EMPTY, sort: f.sort })} className="btn btn-outline flex-1">Reset</button>
                <button type="button" onClick={() => setDrawer(false)} className="btn btn-primary flex-1">Show {result.length}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Group({ title, children, scroll }: { title: string; children: React.ReactNode; scroll?: boolean }) {
  return (
    <fieldset>
      <legend className="label mb-3">{title}</legend>
      <div className={cn("space-y-2", scroll && "max-h-64 overflow-y-auto pr-1")}>{children}</div>
    </fieldset>
  );
}

function Check({ label, count, checked, onChange, radio }: { label: string; count?: number; checked: boolean; onChange: () => void; radio?: boolean }) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-3 text-sm", count === 0 && !checked && "opacity-40")}>
      <input type={radio ? "radio" : "checkbox"} checked={checked} onChange={onChange} onClick={radio && checked ? onChange : undefined} className="h-4 w-4 accent-ink" />
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-xs tabular-nums text-taupe">{count}</span>}
    </label>
  );
}
