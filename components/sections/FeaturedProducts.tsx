import type { Product } from "@/types";
import { ProductCard } from "@/components/product-card/ProductCard";
import { Reveal } from "@/components/animations/motion";
import { SectionHeading } from "./SectionHeading";

/* SECTION 03 — the signatures, in an asymmetric editorial grid. */
export function FeaturedProducts({ products }: { products: Product[] }) {
  const [lead, ...rest] = products;
  return (
    <section className="bg-bone pb-section" aria-labelledby="featured-title">
      <div className="container-site">
        <SectionHeading id="featured-title" index="03" kicker="Featured" title="The signatures," italic="up close." link={{ href: "/shop", label: "Shop all products" }} />
        <div className="mt-14 grid gap-x-5 gap-y-12 md:mt-20 md:grid-cols-2 lg:grid-cols-12">
          <Reveal className="md:col-span-2 lg:col-span-6 lg:row-span-2">
            <ProductCard product={lead} variant="editorial" priority sizes="(max-width: 1024px) 100vw, 50vw" />
          </Reveal>
          {rest.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={0.08 * (i % 2)} className="lg:col-span-3">
              <ProductCard product={p} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
