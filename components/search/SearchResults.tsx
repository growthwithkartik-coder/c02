"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card/ProductCard";
import { Breadcrumbs } from "@/components/ui/primitives";
import { departments } from "@/data/taxonomy";
import { searchProducts } from "@/lib/catalog";
import { primaryDepartment } from "@/lib/taxonomy";

/* Full search results page — grouped by department, one grid each. */
export function SearchResults() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") ?? "";
  const [input, setInput] = useState(q);
  useEffect(() => setInput(q), [q]);
  const all = useMemo(() => (q.trim() ? searchProducts(q) : []), [q]);
  const groups = departments.map((d) => ({ d, items: all.filter((p) => primaryDepartment(p) === d.id) })).filter((g) => g.items.length);

  return (
    <div className="container-site pb-section pt-[calc(var(--nav-h)+1.75rem)]">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} className="mb-6" />
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/search?q=${encodeURIComponent(input.trim())}`);
        }}
        className="flex max-w-2xl items-center gap-3 border-b border-ink/30 pb-3 focus-within:border-ink"
      >
        <Search className="h-6 w-6 shrink-0 text-taupe" strokeWidth={1.3} />
        <label htmlFor="search-page-q" className="sr-only">Search products</label>
        <input id="search-page-q" type="search" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search by product, concern, ingredient or shade" className="w-full bg-transparent font-display text-3xl outline-none placeholder:text-taupe/60 md:text-5xl" />
        <button type="submit" className="btn btn-primary btn-sm">Search</button>
      </form>
      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">{q ? `${all.length} ${all.length === 1 ? "result" : "results"} for “${q}”` : "Type a product name, concern (e.g. acne, dandruff), ingredient or shade."}</p>

      {q && all.length === 0 && (
        <div className="py-16">
          <p className="font-display text-3xl">No products match “{q}”.</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {departments.map((d) => <li key={d.id}><Link href={`/shop/${d.id}`} className="chip">Browse {d.label}</Link></li>)}
          </ul>
        </div>
      )}

      <div className="mt-10 space-y-section">
        {groups.map(({ d, items }) => (
          <section key={d.id} aria-labelledby={`sr-${d.id}`} className="border-t border-line pt-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 id={`sr-${d.id}`} className="font-display text-display-sm">{d.label} <span className="text-taupe">· {items.length}</span></h2>
              <Link href={`/shop/${d.id}?q=${encodeURIComponent(q)}`} className="link-underline shrink-0 text-xs font-medium uppercase tracking-[0.16em]">Filter in {d.label} →</Link>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => <li key={p.slug} className="flex"><ProductCard product={p} className="w-full" /></li>)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
