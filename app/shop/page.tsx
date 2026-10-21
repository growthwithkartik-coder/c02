import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card/ProductCard";
import { Breadcrumbs } from "@/components/ui/primitives";
import { getDepartments, productsInDepartment, concernsForDepartment } from "@/lib/taxonomy";
import { productImage } from "@/lib/utils";
import { Suspense } from "react";
import { CatalogExplorer } from "@/components/filters/CatalogExplorer";
import { Breaker } from "@/components/brand/Breakers";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Shop every CO2 product — skincare, hair care, body care and lips — with filters for type, size, customization and travel sizes.",
  alternates: { canonical: "/shop" },
};

const recommended = (a: { featured: boolean; bestSeller: boolean; order: number; custom: unknown }, b: typeof a) =>
  Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller) || Number(!!a.custom) - Number(!!b.custom) || a.order - b.order;

/* The shop landing is a directory: each department has its own tile and
   its own row of products — departments are never mixed in one grid. */
export default function ShopPage() {
  const depts = getDepartments();
  return (
    <>
      <section className="container-site pt-[calc(var(--nav-h)+1.75rem)]">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} className="mb-6" />
        <h1 className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.95]">Shop all</h1>
        <p className="mt-4 max-w-2xl text-ink-soft">Start with a category for its own concern and shade filters, or browse everything below with filters for type, size, customization and travel sizes.</p>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {depts.map((d) => (
            <li key={d.id}>
              <Link href={`/shop/${d.id}`} className="group block">
                <div className="relative aspect-square bg-bone-2">
                  <Image src={productImage(d.image, 640)} alt="" fill sizes="(max-width:1024px) 46vw, 23vw" className="object-contain" />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="font-display text-2xl md:text-3xl group-hover:text-gold-deep">{d.title}</p>
                  <p className="text-xs tabular-nums text-taupe">{productsInDepartment(d.id).length} products</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-section">
        <Suspense>
          <CatalogExplorer products={getAllProducts()} />
        </Suspense>
      </div>
      <Breaker id="discovery" />
    </>
  );
}
