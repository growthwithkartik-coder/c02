import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DepartmentExplorer } from "@/components/filters/DepartmentExplorer";
import { DepartmentHero } from "@/components/shop/DepartmentHero";
import { CategoryExtras } from "@/components/shop/CategoryExtras";
import { ProductCard } from "@/components/product-card/ProductCard";
import { TryOnButton } from "@/components/tryon/TryOnButton";
import { LipShadeStudio } from "@/components/tryon/LipShadeStudio";
import { JsonLd } from "@/components/ui/JsonLd";
import { departments, type DepartmentId } from "@/data/taxonomy";
import { getAllProducts } from "@/lib/catalog";
import { concernsForDepartment, getDepartment, primaryDepartment, productsInDepartment } from "@/lib/taxonomy";
import { site } from "@/data/site";

/* /shop/[segment]
   - skin | hair | body | lips        → department pages (own grid + own filters)
   - bestsellers                      → bestsellers, grouped by department
   - face, body, cleansers, scalp …   → earlier URLs, kept working: they open the
                                        matching department with filters pre-selected
   (/shop/makeup and /shop/made-personal were removed in Oct 2026 — see
   next.config.ts redirects; made-to-order formulas live at /customization.) */

type Preset = { dept: DepartmentId; preset: Record<string, string[]>; label: string };
const legacy: Record<string, Preset> = {
  face: { dept: "skin", preset: {}, label: "Skincare" },
  cleansers: { dept: "skin", preset: { format: ["face-wash"] }, label: "Face wash & cleansers" },
  treatments: { dept: "skin", preset: { format: ["serum", "treatment-cream"] }, label: "Serums & treatments" },
  masks: { dept: "skin", preset: { format: ["face-mask", "scrub"] }, label: "Masks & scrubs" },
  moisturizers: { dept: "skin", preset: { format: ["moisturizer"] }, label: "Face creams & moisturizers" },
  "sun-care": { dept: "skin", preset: { format: ["sunscreen"] }, label: "Sun protection" },
  "body-care": { dept: "body", preset: { format: ["body-lotion", "body-gel"] }, label: "Lotions, creams & gels" },
  "body-wash": { dept: "body", preset: { format: ["body-wash"] }, label: "Body wash & shower gel" },
  "bath-bars": { dept: "body", preset: { format: ["bath-bar"] }, label: "Body soaps" },
  "hair-care": { dept: "hair", preset: { format: ["shampoo"] }, label: "Shampoos" },
  "hair-oils": { dept: "hair", preset: { format: ["hair-oil"] }, label: "Hair oils" },
  scalp: { dept: "hair", preset: { concern: ["scalp-care"] }, label: "Scalp care" },
  styling: { dept: "hair", preset: { format: ["beard"] }, label: "Beard care" },
  "lip-gloss": { dept: "lips", preset: { format: ["lip-gloss"] }, label: "Lip gloss" },
  lipstick: { dept: "lips", preset: { format: ["lipstick"] }, label: "Lipstick" },
};

const SPECIAL = ["bestsellers"];

export const dynamicParams = false;

export function generateStaticParams() {
  return [...departments.map((d) => d.id), ...SPECIAL, ...Object.keys(legacy)].map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const d = getDepartment(category);
  if (d) return { title: `${d.title} — Shop ${d.label}`, description: d.description, alternates: { canonical: `/shop/${d.id}` } };
  if (category === "bestsellers") return { title: "Bestsellers", description: "The CO2 formulas customers come back for — skin, hair, body and lips.", alternates: { canonical: "/shop/bestsellers" } };
  const l = legacy[category];
  if (l) return { title: `${l.label} — ${getDepartment(l.dept)!.title}`, alternates: { canonical: `/shop/${l.dept}` } };
  return {};
}

export default async function ShopSegmentPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (category === "bestsellers") return <Bestsellers />;
  const l = legacy[category];
  const dept = getDepartment(l?.dept ?? category);
  if (!dept) notFound();

  const products = productsInDepartment(dept.id);
  const crumbs = [{ label: "Home", href: "/" }, { label: dept.label, href: l ? `/shop/${dept.id}` : undefined }, ...(l ? [{ label: l.label }] : [])];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${dept.title} — CO2`,
          url: `${site.url}/shop/${dept.id}`,
          mainEntity: { "@type": "ItemList", numberOfItems: products.length, itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/product/${p.slug}`, name: p.name })) },
        }}
      />
      <DepartmentHero dept={dept} count={products.length} crumbs={crumbs} concerns={concernsForDepartment(dept.id)}>
        {dept.id === "lips" && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <TryOnButton />
            <span className="text-sm text-ink-soft">See every shade on your own face — camera or photo.</span>
          </div>
        )}
      </DepartmentHero>
      {dept.id === "lips" && <LipShadeStudio />}
      <Suspense>
        <DepartmentExplorer department={dept.id} products={products} preset={l?.preset} />
      </Suspense>
      <CategoryExtras dept={dept.id} />
    </>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <ul className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 md:grid-cols-3 md:gap-y-16 lg:grid-cols-4">{children}</ul>;
}

function Bestsellers() {
  const all = getAllProducts().filter((p) => p.bestSeller);
  const groups = (["skin", "hair", "body", "lips"] as DepartmentId[])
    .map((id) => ({ d: getDepartment(id)!, items: all.filter((p) => primaryDepartment(p) === id) }))
    .filter((g) => g.items.length);
  return (
    <>
      <DepartmentHero count={all.length} crumbs={[{ label: "Home", href: "/" }, { label: "Bestsellers" }]} title="Bestsellers" description="The formulas flagged as CO2 bestsellers — grouped by skin, hair, body and lips so you can go straight to what you need." image="noir-charcoal-mask-1" />
      <div className="container-site space-y-section pb-section">
        {groups.map(({ d, items }) => (
          <section key={d.id} aria-labelledby={`best-${d.id}`} className="border-t border-line pt-10">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 id={`best-${d.id}`} className="font-display text-display-sm">{d.label} bestsellers</h2>
              <Link href={`/shop/${d.id}?best=1`} className="link-underline shrink-0 text-xs font-medium uppercase tracking-[0.16em]">All {d.label.toLowerCase()} →</Link>
            </div>
            <Grid>{items.map((p) => <li key={p.slug} className="flex"><ProductCard product={p} className="w-full" /></li>)}</Grid>
          </section>
        ))}
      </div>
    </>
  );
}
