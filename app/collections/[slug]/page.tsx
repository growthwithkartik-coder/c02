import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/hero/PageHero";
import { getDepartment, primaryDepartment } from "@/lib/taxonomy";
import { ProductCard } from "@/components/product-card/ProductCard";
import { Reveal } from "@/components/animations/motion";
import { AddCollectionButton } from "@/components/cart/AddCollectionButton";
import { collections, getCollection } from "@/data/collections";
import { getProducts, hasCutout } from "@/lib/catalog";
import { isPricePending, money, PRICES_ON_REQUEST } from "@/lib/utils";
import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  return { title: `${c.title} — Collection`, description: c.description, alternates: { canonical: `/collections/${c.slug}` } };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const items = getProducts(c.products);
  const buyable = items.filter((p) => !p.custom && !isPricePending(p));
  const total = buyable.reduce((s, p) => s + p.price, 0);
  const idx = collections.findIndex((x) => x.slug === c.slug);
  const next = collections[(idx + 1) % collections.length];

  return (
    <>
      <PageHero
        kicker={`${c.kicker} · ${items.length} products`}
        title={c.title}
        intro={c.description}
        crumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: c.title }]}
        dark={c.tone === "dark"}
        image={c.hero === "custom" || !hasCutout(c.hero) ? null : c.hero}
      >
        {PRICES_ON_REQUEST && items.length > 1 && (
          <div className="flex flex-wrap items-center gap-4">
            <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`${c.title} edit (${items.map((p) => p.name).join(", ")})`)} className={c.tone === "dark" ? "btn btn-gold btn-lg" : "btn btn-primary btn-lg"} data-request-price>Request price for the full edit</a>
            <span className={c.tone === "dark" ? "text-sm text-bone/60" : "text-sm text-ink-soft"}>Price on request · as per customization</span>
          </div>
        )}
        {buyable.length > 1 && (
          <div className="flex flex-wrap items-center gap-4">
            <AddCollectionButton slugs={buyable.map((p) => p.slug)} label={`Add the full edit — ${money(total)}`} dark={c.tone === "dark"} />
          </div>
        )}
      </PageHero>

      <section className="container-site py-section">
        <Reveal className="mb-16 max-w-3xl">
          <p className="font-display text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.08]">{c.story}</p>
        </Reveal>
        {/* products are grouped by department so skin, hair and lip products never share a grid */}
        <div className="space-y-16">
          {(["skin", "hair", "body", "lips"] as const)
            .map((d) => ({ d, list: items.filter((p) => primaryDepartment(p) === d) }))
            .filter((g) => g.list.length)
            .map((g, _i, arr) => (
              <div key={g.d}>
                {arr.length > 1 && <h2 className="mb-8 border-b border-line pb-3 font-display text-3xl">{getDepartment(g.d)!.title}</h2>}
                <ul className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 lg:grid-cols-4">
                  {g.list.map((p) => (
                    <li key={p.slug} className="flex">
                      <ProductCard product={p} className="w-full" sizes="(max-width:1024px) 46vw, 23vw" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>

      <section className="border-t border-line">
        <Link href={`/collections/${next.slug}`} className="container-site group flex items-center justify-between py-16">
          <span>
            <span className="eyebrow text-taupe">Next collection</span>
            <span className="mt-2 block font-display text-display-sm group-hover:text-gold-deep">{next.title}</span>
          </span>
          <span className="text-3xl transition-transform duration-500 group-hover:translate-x-2">→</span>
        </Link>
      </section>
    </>
  );
}
