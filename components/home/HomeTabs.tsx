"use client";

import { useId, useState } from "react";
import { ProductRow, SectionHead } from "./HomeSections";
import { ConcernTile } from "@/components/shop/DepartmentHero";
import type { Concern } from "@/data/taxonomy";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

/* Accessible tab list (arrow keys move between tabs). */
function Tabs({ tabs, active, onChange, label }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void; label: string }) {
  const base = useId();
  return (
    <div role="tablist" aria-label={label} className="mb-10 flex gap-2 overflow-x-auto no-scrollbar">
      {tabs.map((t, i) => (
        <button
          key={t.id}
          id={`${base}-${t.id}`}
          role="tab"
          type="button"
          aria-selected={active === t.id}
          tabIndex={active === t.id ? 0 : -1}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
            onChange(n.id);
            document.getElementById(`${base}-${n.id}`)?.focus();
          }}
          className={cn("chip shrink-0", active === t.id && "border-ink bg-ink text-bone")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function ConcernPicker({ groups }: { groups: { id: string; label: string; href: string; concerns: Concern[] }[] }) {
  const [active, setActive] = useState(groups[0].id);
  const g = groups.find((x) => x.id === active)!;
  return (
    <section className="bg-bone-2 py-section" aria-labelledby="concern-title">
      <div className="container-site">
        <SectionHead eyebrow="Shop by concern" title={<span id="concern-title">What would you like to work on?</span>} text="Cosmetic concerns, matched to what is printed on each pack — skin and hair kept separate." />
        <Tabs tabs={groups.map((x) => ({ id: x.id, label: x.label }))} active={active} onChange={setActive} label="Concern category" />
        <ul role="tabpanel" className="grid grid-cols-3 gap-x-3 gap-y-7 sm:gap-x-4 md:grid-cols-4 md:gap-x-6 xl:grid-cols-8">
          {g.concerns.map((c) => (
            <li key={c.id}>
              <ConcernTile concern={c} href={`${g.href}?concern=${c.id}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BestsellerTabs({ groups }: { groups: { id: string; label: string; href: string; products: Product[] }[] }) {
  const [active, setActive] = useState(groups[0].id);
  const g = groups.find((x) => x.id === active)!;
  return (
    <section className="py-section" aria-labelledby="best-title">
      <div className="container-site">
        <SectionHead eyebrow="Bestsellers & favourites" title={<span id="best-title">The ones people come back for.</span>} href={g.href} linkLabel={`All ${g.label.toLowerCase()} bestsellers`} />
        <Tabs tabs={groups.map((x) => ({ id: x.id, label: x.label }))} active={active} onChange={setActive} label="Bestseller category" />
        <div role="tabpanel">
          <ProductRow products={g.products} />
        </div>
      </div>
    </section>
  );
}
