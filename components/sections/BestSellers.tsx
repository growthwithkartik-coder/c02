import type { Product } from "@/types";
import { ProductCard } from "@/components/product-card/ProductCard";
import { Reveal } from "@/components/animations/motion";
import { SectionHeading } from "./SectionHeading";

/* SECTION 08 — best sellers (curated in data/products.ts → bestSeller). */
export function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="bg-stone/50 py-section" aria-labelledby="best-title">
      <div className="container-site">
        <SectionHeading id="best-title" index="08" kicker="Best sellers" title="Best sellers," italic="the CO2 favourites." link={{ href: "/shop?sort=best", label: "Shop best sellers" }} />
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-20 lg:grid-cols-4 lg:gap-x-6">
          {products.slice(0, 8).map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 0.07}>
              <ProductCard product={p} sizes="(max-width: 1024px) 50vw, 25vw" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
