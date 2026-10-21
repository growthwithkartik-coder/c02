"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types";
import type { DepartmentId, FilterId } from "@/data/taxonomy";
import { departments, formats, ingredientFacets, skinConcerns, hairConcerns } from "@/data/taxonomy";
import { skinTypes } from "@/data/categories";
import { ProductCard } from "@/components/product-card/ProductCard";
import { searchProducts } from "@/lib/catalog";
import { areaOf, concernsOf, finishGroupOf, formatOf, ingredientIdsOf } from "@/lib/taxonomy";
import { cn, money, isPricePending, comparePrice, PRICES_ON_REQUEST } from "@/lib/utils";
import { hasSample, isCustomizable } from "@/lib/commerce";

/* ------------------------------------------------------------------
   Department explorer — the product listing for ONE department
   (Skincare, Hair Care, Body Care or Lips). Products from different departments
   never share a grid. Filters are department-specific, multi-select,
   work together (AND across groups, OR within a group) and are synced
   to the URL so every filtered view can be shared or bookmarked:

   ?concern=a,b&area=face&format=serum&skin=Oily&ing=neem&shade=…
   &finish=…&min=&max=&stock=1&best=1&q=&sort=
------------------------------------------------------------------- */

const sorts = [
  { id: "recommended", label: "Recommended" },
  { id: "best", label: "Bestselling" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "new", label: "Newest" },
  { id: "name", label: "Name A–Z" },
].filter((s) => !PRICES_ON_REQUEST || !s.id.startsWith("price"));

type ListKey = "concern" | "area" | "format" | "skin" | "ing" | "shade" | "finish" | "feat";
const LIST_KEYS: ListKey[] = ["concern", "area", "format", "skin", "ing", "shade", "finish", "feat"];

type F = Record<ListKey, string[]> & { min: number | null; max: number | null; stock: boolean; best: boolean; q: string; sort: string };

function parse(sp: URLSearchParams): F {
  const list = (k: string) => (sp.get(k) ? sp.get(k)!.split(",").filter(Boolean) : []);
  const num = (k: string) => (sp.get(k) && !isNaN(Number(sp.get(k))) ? Number(sp.get(k)) : null);
  const f = Object.fromEntries(LIST_KEYS.map((k) => [k, list(k)])) as Record<ListKey, string[]>;
  return { ...f, min: num("min"), max: num("max"), stock: sp.get("stock") === "1", best: sp.get("best") === "1", q: sp.get("q") ?? "", sort: sp.get("sort") ?? "recommended" };
}

function serialize(f: F) {
  const sp = new URLSearchParams();
  for (const k of LIST_KEYS) if (f[k].length) sp.set(k, f[k].join(","));
  if (f.min != null) sp.set("min", String(f.min));
  if (f.max != null) sp.set("max", String(f.max));
  if (f.stock) sp.set("stock", "1");
  if (f.best) sp.set("best", "1");
  if (f.q) sp.set("q", f.q);
  if (f.sort !== "recommended") sp.set("sort", f.sort);
  return sp.toString();
}

const EMPTY: F = { concern: [], area: [], format: [], skin: [], ing: [], shade: [], finish: [], feat: [], min: null, max: null, stock: false, best: false, q: "", sort: "recommended" };

/** Facet value getters, one per list filter. */
const facet: Record<ListKey, (p: Product) => string[]> = {
  concern: (p) => concernsOf(p.slug),
  area: (p) => {
    const a = areaOf(p);
    return a ? [a] : [];
  },
  format: (p) => [formatOf(p)],
  skin: (p) => (p.skinTypes.length >= 6 ? [] : p.skinTypes), // "suits all" products don't narrow
  ing: (p) => ingredientIdsOf(p),
  shade: (p) => p.shades.map((s) => s.name),
  finish: (p) => [finishGroupOf(p)],
  feat: (p) => [...(isCustomizable(p) ? ["customizable"] : []), ...(hasSample(p.slug) ? ["sample"] : []), ...(p.custom ? ["made-to-order"] : [])],
};
const featLabels: Record<string, string> = { customizable: "Can be customized", sample: "Travel size available", "made-to-order": "Made to order" };

function matches(p: Product, f: F, skip?: ListKey) {
  for (const k of LIST_KEYS) {
    if (k === skip || !f[k].length) continue;
    if (k === "skin") {
      // a product that suits every skin type matches any skin-type choice
      if (p.skinTypes.length >= 6) continue;
      if (!p.skinTypes.some((s) => f.skin.includes(s))) return false;
      continue;
    }
    const vals = facet[k](p);
    if (!vals.some((v) => f[k].includes(v))) return false;
  }
  if ((f.min != null || f.max != null) && isPricePending(p)) return false;
    if (f.min != null && p.price < f.min) return false;
  if (f.max != null && p.price > f.max) return false;
  if (f.stock && !(p.availability === "in-stock" || p.availability === "low-stock" || p.availability === "made-to-order")) return false;
  if (f.best && !p.bestSeller) return false;
  return true;
}

const sorters: Record<string, (a: Product, b: Product) => number> = {
  recommended: (a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller) || Number(!!a.custom) - Number(!!b.custom) || a.order - b.order,
  best: (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || Number(b.featured) - Number(a.featured) || a.order - b.order,
  new: (a, b) => b.order - a.order,
  "price-asc": (a, b) => comparePrice(a, b, 1) || a.order - b.order,
  "price-desc": (a, b) => comparePrice(a, b, -1) || a.order - b.order,
  name: (a, b) => a.name.localeCompare(b.name),
};

export function DepartmentExplorer({ department, products, preset }: { department: DepartmentId; products: Product[]; preset?: Partial<Record<ListKey, string[]>> }) {
  const dept = departments.find((d) => d.id === department)!;
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const fromUrl = () => {
    const parsed = parse(new URLSearchParams(sp.toString()));
    // a legacy segment (e.g. /shop/cleansers) pre-selects filters when the URL has none
    if (preset) for (const k of Object.keys(preset) as ListKey[]) if (!parsed[k].length) parsed[k] = preset[k]!;
    return parsed;
  };
  const [f, setF] = useState<F>(fromUrl);
  const [qInput, setQInput] = useState(f.q);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const next = fromUrl();
    setF(next);
    setQInput(next.q);
  }, [sp]); // eslint-disable-line react-hooks/exhaustive-deps

  function update(patch: Partial<F>) {
    const next = { ...f, ...patch };
    setF(next);
    const qs = serialize(next);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }
  useEffect(() => {
    const t = setTimeout(() => qInput !== f.q && update({ q: qInput }), 250);
    return () => clearTimeout(t);
  }, [qInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (k: ListKey, v: string) => update({ [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] } as Partial<F>);
  const clearAll = () => update({ ...EMPTY, sort: f.sort });

  const base = useMemo(() => (f.q ? searchProducts(f.q, products) : products), [f.q, products]);
  const result = useMemo(() => {
    const list = base.filter((p) => matches(p, f));
    if (f.q && f.sort === "recommended") return list;
    if (f.sort === "recommended") {
      // keep like products together: follow the department's section order
      // (e.g. shampoos, then hair oils, then scalp care), then the usual ranking
      const sectionOf = (p: Product) => {
        const i = dept.sections.findIndex((s) => s.formats?.includes(formatOf(p)));
        return i < 0 ? dept.sections.length : i;
      };
      return list.sort((x, y) => sectionOf(x) - sectionOf(y) || sorters.recommended(x, y));
    }
    return list.sort(sorters[f.sort] ?? sorters.recommended);
  }, [base, f, dept]);

  /** count for an option = products matching every OTHER active filter + this option */
  const count = (k: ListKey, v: string) => base.filter((p) => matches(p, f, k) && facet[k](p).includes(v)).length;

  /* ---------- option lists, built only from values present in this department ---------- */
  const present = (k: ListKey) => new Set(products.flatMap((p) => facet[k](p)));
  const concernList = (department === "hair" ? hairConcerns : skinConcerns).filter((c) => present("concern").has(c.id));
  const formatList = formats.filter((x) => present("format").has(x.id));
  const ingList = ingredientFacets.filter((x) => products.filter((p) => ingredientIdsOf(p).includes(x.id)).length >= 2);
  const shadeList = Object.values(
    products.flatMap((p) => p.shades).reduce<Record<string, { name: string; hexes: string[] }>>((acc, s) => {
      (acc[s.name] ??= { name: s.name, hexes: [] }).hexes.push(s.hex);
      return acc;
    }, {}),
  );
  const finishList = [...present("finish")].filter((x) => x !== "—");
  const featList = ["customizable", "sample", "made-to-order"].filter((x) => present("feat").has(x));
  const areaList = [
    { id: "face", label: "Face" },
    { id: "body", label: "Body" },
  ].filter((a) => present("area").has(a.id));

  const prices = products.filter((p) => !isPricePending(p)).map((p) => p.price);
  const priceBands = [
    { label: `Under ${money(500)}`, min: null, max: 499 },
    { label: `${money(500)} – ${money(999)}`, min: 500, max: 999 },
    { label: `${money(1000)} – ${money(1999)}`, min: 1000, max: 1999 },
    { label: `${money(2000)} & above`, min: 2000, max: null },
  ].filter((b) => prices.some((x) => (b.min == null || x >= b.min) && (b.max == null || x <= b.max)));

  const groups: Record<FilterId, React.ReactNode> = {
    concern: concernList.length > 0 && (
      <FilterGroup key="concern" title={department === "hair" ? "Hair concern" : "Skin concern"} active={f.concern.length}>
        {concernList.map((c) => <Check key={c.id} label={c.label} count={count("concern", c.id)} checked={f.concern.includes(c.id)} onChange={() => toggle("concern", c.id)} />)}
      </FilterGroup>
    ),
    area: areaList.length > 1 && (
      <FilterGroup key="area" title="Face or body" active={f.area.length}>
        {areaList.map((a) => <Check key={a.id} label={a.label} count={count("area", a.id)} checked={f.area.includes(a.id)} onChange={() => toggle("area", a.id)} />)}
      </FilterGroup>
    ),
    format: formatList.length > 1 && (
      <FilterGroup key="format" title="Product type" active={f.format.length}>
        {formatList.map((x) => <Check key={x.id} label={x.label} count={count("format", x.id)} checked={f.format.includes(x.id)} onChange={() => toggle("format", x.id)} />)}
      </FilterGroup>
    ),
    skinType: (
      <FilterGroup key="skin" title="Skin type" active={f.skin.length} hint="Products made for every skin type always stay in the results.">
        <div className="flex flex-wrap gap-2 pt-1">
          {skinTypes.map((s) => (
            <button key={s} type="button" className="chip h-8 px-3 text-xs" aria-pressed={f.skin.includes(s)} onClick={() => toggle("skin", s)}>{s}</button>
          ))}
        </div>
      </FilterGroup>
    ),
    ingredient: ingList.length > 1 && (
      <FilterGroup key="ing" title="Key ingredient" active={f.ing.length} collapsible>
        {ingList.map((x) => <Check key={x.id} label={x.label} count={count("ing", x.id)} checked={f.ing.includes(x.id)} onChange={() => toggle("ing", x.id)} />)}
      </FilterGroup>
    ),
    shade: shadeList.length > 1 && (
      <FilterGroup key="shade" title="Shade" active={f.shade.length}>
        <div className="space-y-2.5">
          {shadeList.map((s) => (
            <label key={s.name} className="group flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" className="peer sr-only" checked={f.shade.includes(s.name)} onChange={() => toggle("shade", s.name)} />
              <span className={cn("h-6 w-6 shrink-0 rounded-full ring-offset-2 ring-offset-bone transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-gold", f.shade.includes(s.name) ? "ring-2 ring-ink" : "ring-1 ring-black/10")} style={{ background: s.hexes.length > 1 ? `linear-gradient(90deg, ${s.hexes[0]} 50%, ${s.hexes[1]} 50%)` : s.hexes[0] }} aria-hidden />
              <span className={cn("flex-1", f.shade.includes(s.name) ? "text-ink" : "text-ink-soft")}>{s.name}</span>
              <span className="text-xs tabular-nums text-taupe">{count("shade", s.name)}</span>
            </label>
          ))}
        </div>
      </FilterGroup>
    ),
    finish: finishList.length > 1 && (
      <FilterGroup key="finish" title="Finish" active={f.finish.length}>
        {finishList.map((x) => <Check key={x} label={x} count={count("finish", x)} checked={f.finish.includes(x)} onChange={() => toggle("finish", x)} />)}
      </FilterGroup>
    ),
    price: PRICES_ON_REQUEST ? null : (
      <FilterGroup key="price" title="Price" active={f.min != null || f.max != null ? 1 : 0}>
        {priceBands.map((b) => {
          const on = f.min === b.min && f.max === b.max;
          return <Check key={b.label} label={b.label} checked={on} onChange={() => update(on ? { min: null, max: null } : { min: b.min, max: b.max })} radio />;
        })}
        <div className="flex items-center gap-2 pt-2">
          <input type="number" inputMode="numeric" min={0} aria-label="Minimum price" placeholder={`₹${Math.min(...prices)}`} value={f.min ?? ""} onChange={(e) => update({ min: e.target.value ? Number(e.target.value) : null })} className="input h-10 px-3 text-sm" />
          <span className="text-taupe" aria-hidden>–</span>
          <input type="number" inputMode="numeric" min={0} aria-label="Maximum price" placeholder={`₹${Math.max(...prices)}`} value={f.max ?? ""} onChange={(e) => update({ max: e.target.value ? Number(e.target.value) : null })} className="input h-10 px-3 text-sm" />
        </div>
      </FilterGroup>
    ),
    availability: (
      <FilterGroup key="stock" title="Availability" active={f.stock ? 1 : 0}>
        <Check label="Available to order" checked={f.stock} onChange={() => update({ stock: !f.stock })} count={base.filter((p) => matches(p, { ...f, stock: true })).length} />
      </FilterGroup>
    ),
    feature: featList.length > 0 && (
      <FilterGroup key="feat" title="Features" active={f.feat.length}>
        {featList.map((x) => <Check key={x} label={featLabels[x]} count={count("feat", x)} checked={f.feat.includes(x)} onChange={() => toggle("feat", x)} />)}
      </FilterGroup>
    ),
    bestseller: products.some((p) => p.bestSeller) && (
      <FilterGroup key="best" title="Popular" active={f.best ? 1 : 0}>
        <Check label="Bestsellers only" checked={f.best} onChange={() => update({ best: !f.best })} count={base.filter((p) => matches(p, { ...f, best: true })).length} />
      </FilterGroup>
    ),
  };
  const panel = <div className="space-y-8">{dept.filters.map((id) => groups[id]).filter(Boolean)}</div>;

  /* ---------- active filter pills ---------- */
  const labelFor = (k: ListKey, v: string) => {
    if (k === "concern") return [...skinConcerns, ...hairConcerns].find((c) => c.id === v)?.label ?? v;
    if (k === "format") return formats.find((x) => x.id === v)?.label ?? v;
    if (k === "ing") return ingredientFacets.find((x) => x.id === v)?.label ?? v;
    if (k === "area") return v === "face" ? "Face" : "Body";
    if (k === "feat") return featLabels[v] ?? v;
    return v;
  };
  const pills: { key: string; label: string; remove: () => void }[] = [
    ...LIST_KEYS.flatMap((k) => f[k].map((v) => ({ key: `${k}:${v}`, label: labelFor(k, v), remove: () => toggle(k, v) }))),
    ...(f.min != null || f.max != null ? [{ key: "price", label: `${f.min != null ? money(f.min) : "₹0"} – ${f.max != null ? money(f.max) : "any"}`, remove: () => update({ min: null, max: null }) }] : []),
    ...(f.stock ? [{ key: "stock", label: "Available", remove: () => update({ stock: false }) }] : []),
    ...(f.best ? [{ key: "best", label: "Bestsellers", remove: () => update({ best: false }) }] : []),
    ...(f.q ? [{ key: "q", label: `“${f.q}”`, remove: () => { setQInput(""); update({ q: "" }); } }] : []),
  ];

  const single = f.concern.length === 1 ? [...skinConcerns, ...hairConcerns].find((c) => c.id === f.concern[0]) : null;

  return (
    <div className="container-site pb-section">
      {/* toolbar */}
      <div className="sticky-under-nav sticky z-20 -mx-gutter border-y border-line bg-bone/95 px-gutter py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setDrawer(true)} className="chip lg:hidden" aria-haspopup="dialog">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters {pills.length ? <span className="tabular-nums">({pills.length})</span> : null}
          </button>
          <div className="relative order-last w-full sm:order-none sm:w-auto sm:flex-1 lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" strokeWidth={1.5} />
            <label htmlFor="dept-q" className="sr-only">Search {dept.label.toLowerCase()} products</label>
            <input id="dept-q" type="search" value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder={`Search in ${dept.label}…`} className="input h-10 pl-9 text-sm" />
          </div>
          <p className="text-sm text-ink-soft" aria-live="polite">
            <span className="tabular-nums text-ink">{result.length}</span> {result.length === 1 ? "product" : "products"}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="dept-sort" className="hidden text-xs uppercase tracking-[0.14em] text-taupe sm:block">Sort</label>
            <select id="dept-sort" value={f.sort} onChange={(e) => update({ sort: e.target.value })} className="input h-10 w-auto cursor-pointer pr-8 text-sm">
              {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
        {pills.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Active filters">
            {pills.map((p) => (
              <button key={p.key} type="button" onClick={p.remove} className="chip h-8 border-ink bg-ink px-3 text-xs text-bone" aria-label={`Remove filter ${p.label}`}>
                {p.label} <X className="h-3 w-3" aria-hidden />
              </button>
            ))}
            <button type="button" onClick={clearAll} className="ml-1 text-xs uppercase tracking-[0.14em] text-taupe underline-offset-4 hover:text-ink hover:underline">Reset all</button>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[232px_1fr] xl:gap-14">
        <aside className="hidden lg:block" aria-label={`${dept.label} filters`}>
          <div className="sticky top-[calc(var(--nav-h)+5.5rem)] max-h-[calc(100vh-var(--nav-h)-7rem)] overflow-y-auto pb-10 pr-2 no-scrollbar" data-lenis-prevent>
            {panel}
          </div>
        </aside>

        <div>
          {single && (
            <div className="mb-10 border-l-2 border-gold pl-5">
              <p className="eyebrow text-taupe">Shopping by concern</p>
              <p className="mt-2 font-display text-3xl leading-tight">{single.label}</p>
              <p className="mt-1 max-w-xl text-sm text-ink-soft">{single.blurb} Cosmetic care — patch-test new products, and see a dermatologist for persistent skin conditions.</p>
            </div>
          )}
          {result.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-4xl">Nothing matches every filter.</p>
              <p className="mt-3 text-ink-soft">Remove a filter above, or reset to see all {products.length} {dept.label.toLowerCase()} products.</p>
              <button type="button" onClick={clearAll} className="btn btn-primary mt-8">Reset filters</button>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 md:grid-cols-3 md:gap-y-16 xl:grid-cols-4" data-testid="product-grid">
              {result.map((p, i) => (
                <li key={p.slug} className="flex">
                  <ProductCard product={p} priority={i < 4} sizes="(max-width:768px) 48vw, (max-width:1280px) 30vw, 22vw" className="w-full" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label={`${dept.label} filters`}>
            <motion.div className="absolute inset-0 bg-carbon/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div className="absolute inset-y-0 left-0 flex w-[88vw] max-w-sm flex-col bg-bone" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <p className="font-display text-3xl">Filters</p>
                <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters" className="p-2"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6" data-lenis-prevent>{panel}</div>
              <div className="grid grid-cols-2 gap-2 border-t border-line p-4 pb-safe">
                <button type="button" onClick={clearAll} className="btn btn-outline">Reset</button>
                <button type="button" onClick={() => setDrawer(false)} className="btn btn-primary">Show {result.length}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children, active = 0, hint, collapsible }: { title: string; children: React.ReactNode; active?: number; hint?: string; collapsible?: boolean }) {
  const [open, setOpen] = useState(!collapsible || active > 0);
  return (
    <fieldset className="border-b border-line pb-7 last:border-0">
      <legend className="w-full">
        <button type="button" className="flex w-full items-center justify-between gap-2 text-left" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="eyebrow text-ink">{title}{active ? <span className="ml-2 text-gold-deep">· {active}</span> : null}</span>
          <ChevronDown className={cn("h-4 w-4 text-taupe transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      </legend>
      {open && (
        <div className="mt-4 space-y-2.5">
          {children}
          {hint && <p className="pt-1 text-xs leading-relaxed text-taupe">{hint}</p>}
        </div>
      )}
    </fieldset>
  );
}

function Check({ label, count, checked, onChange, radio }: { label: string; count?: number; checked: boolean; onChange: () => void; radio?: boolean }) {
  const disabled = !checked && count === 0;
  return (
    <label className={cn("group flex items-center gap-3 text-sm", disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer")}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="peer sr-only" />
      <span className={cn("grid h-4 w-4 shrink-0 place-items-center border border-ink/40 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-gold group-hover:border-ink", radio && "rounded-full", checked && "border-ink bg-ink")}>
        {checked && <span className={cn("h-1.5 w-1.5 bg-bone", radio && "rounded-full")} />}
      </span>
      <span className={cn("flex-1", checked ? "text-ink" : "text-ink-soft")}>{label}</span>
      {count != null && <span className="text-xs tabular-nums text-taupe">{count}</span>}
    </label>
  );
}

/** Chips under the department heading — quick links into sections. */
export function SectionChips({ department, dark }: { department: DepartmentId; dark?: boolean }) {
  const dept = departments.find((d) => d.id === department)!;
  return (
    <ul className="flex flex-wrap gap-2">
      <li><Link href={`/shop/${dept.id}`} className={dark ? "chip chip-dark" : "chip"}>All {dept.label.toLowerCase()}</Link></li>
      {dept.sections.map((s) => {
        const qs = s.area ? `area=${s.area}` : `format=${s.formats!.join(",")}`;
        return (
          <li key={s.id}>
            <Link href={`/shop/${dept.id}?${qs}`} className={dark ? "chip chip-dark" : "chip"}>{s.label}</Link>
          </li>
        );
      })}
    </ul>
  );
}
