"use client";

import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { productImage } from "@/lib/utils";

type Item = { name: string; note: string; products: { slug: string; name: string; image: string | null }[] };

const families: { id: string; label: string; match: RegExp }[] = [
  { id: "botanical", label: "Botanicals", match: /aloe|neem|tulasi|tulsi|rose|hibiscus|sandal|manjistha|mint|lemon|orange|cucumber|tea tree|apple|turmeric|saffron|lavender|vacha|ajwain|caraway|amla|camphor|bhringraj|brahmi|fenugreek|henna|reetha|shikakai|bergamot|eucalyptus|basil|lotus|licorice|green tea|chamomile|papaya|kesar/i },
  { id: "oils", label: "Oils & butters", match: /oil|butter|jojoba|squalane|wax/i },
  { id: "actives", label: "Actives", match: /hyaluronic|niacinamide|vitamin|salicylic|glycerin|kojic|zinc|panthenol|allantoin|peptide|ceramide|acid|menthol|urea|retin/i },
  { id: "minerals", label: "Minerals & clays", match: /charcoal|clay|mud|calamine|gold|mineral|salt|kaolin|multani/i },
  { id: "foods", label: "Coffee, cacao & milk", match: /coffee|cacao|cocoa|chocolate|milk|honey|walnut|almond|oat|coconut|rice/i },
];

export function IngredientLibrary({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const [fam, setFam] = useState<string | null>(null);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items.filter((i) => (!t || i.name.toLowerCase().includes(t) || i.note.toLowerCase().includes(t)) && (!fam || families.find((f) => f.id === fam)!.match.test(i.name)));
  }, [items, q, fam]);
  const letters = useMemo(() => [...new Set(list.map((i) => i.name[0].toUpperCase()))].sort(), [list]);
  const sorted = useMemo(() => [...list].sort((a, b) => a.name.localeCompare(b.name)), [list]);

  return (
    <section className="container-site pb-section">
      <div className="sticky-under-nav sticky z-10 -mx-gutter flex flex-wrap items-center gap-3 border-b border-line bg-bone/90 px-gutter py-3 backdrop-blur-xl">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" />
          <label htmlFor="ing-q" className="sr-only">Search ingredients</label>
          <input id="ing-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ingredients…" className="input h-10 pl-9 text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button className="chip shrink-0" aria-pressed={!fam} onClick={() => setFam(null)}>All</button>
          {families.map((f) => <button key={f.id} className="chip shrink-0" aria-pressed={fam === f.id} onClick={() => setFam(fam === f.id ? null : f.id)}>{f.label}</button>)}
        </div>
        <p className="ml-auto text-sm text-ink-soft"><span className="tabular-nums text-ink">{list.length}</span> ingredients</p>
      </div>

      {/* most-used */}
      {!q && !fam && (
        <div className="mt-14">
          <p className="eyebrow text-taupe">Most used across the collection</p>
          <ul className="mt-6 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {items.slice(0, 8).map((i) => (
              <li key={i.name} className="bg-bone p-6">
                <p className="font-display text-3xl leading-none">{i.name}</p>
                <p className="mt-2 text-sm text-ink-soft">{i.note}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-taupe">In {i.products.length} products</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <nav className="mt-14 flex flex-wrap gap-2" aria-label="Jump to letter">
        {letters.map((l) => <a key={l} href={`#ing-${l}`} className="grid h-8 w-8 place-items-center border border-line text-sm hover:border-ink">{l}</a>)}
      </nav>

      <div className="mt-10">
        {letters.map((l) => (
          <div key={l} id={`ing-${l}`} className="scroll-mt-40 border-t border-line py-8 md:grid md:grid-cols-12 md:gap-8">
            <p className="font-display text-6xl text-gold-deep md:col-span-1">{l}</p>
            <ul className="mt-4 grid gap-x-8 gap-y-8 sm:grid-cols-2 md:col-span-11 md:mt-0 lg:grid-cols-3">
              {sorted.filter((i) => i.name[0].toUpperCase() === l).map((i) => (
                <li key={i.name}>
                  <p className="font-display text-2xl leading-tight">{i.name}</p>
                  {i.note && <p className="mt-1 text-sm text-ink-soft">{i.note}</p>}
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {i.products.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/product/${p.slug}`} className="group flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-xs hover:border-ink">
                          {p.image && <span className="relative h-6 w-6 overflow-hidden rounded-full"><Image src={productImage(p.image, 640)} alt="" fill sizes="24px" className="object-contain" /></span>}
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-xl text-xs leading-relaxed text-taupe">Ingredient names and roles are taken from CO2 packaging. This library is for information only and isn&rsquo;t medical advice. Always read the full ingredient list on the pack.</p>
    </section>
  );
}
