import Link from "next/link";
import { collections } from "@/data/collections";
import { combos } from "@/data/combos";
import { getAllProducts } from "@/lib/catalog";
import { getDepartments } from "@/lib/taxonomy";

/* Popular links before the footer — built from the live catalogue, so it
   updates when products or collections change and never links to
   something that doesn't exist. "Popular" = products flagged bestSeller
   (then featured) in data/products.ts. */
export function PopularLinks() {
  const all = getAllProducts();
  const popular = all
    .filter((p) => !p.custom)
    .sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || Number(b.featured) - Number(a.featured) || a.order - b.order)
    .slice(0, 14);
  const groups = [
    { title: "Popular categories", links: getDepartments().map((d) => ({ label: d.title, href: `/shop/${d.id}` })) },
    {
      title: "Shopping experiences",
      links: [
        { label: "Shop All", href: "/shop" },
        { label: "Combos", href: "/combos" },
        { label: "Travel-Size Products", href: "/sampling#travel-sizes" },
        { label: "Sampling Studio", href: "/sampling" },
        { label: "Make It Yours", href: "/make-it-yours" },
        { label: "Virtual Lip Try-On", href: "/shop/lips#try-on" },
      ],
    },
    { title: "Popular collections", links: [...collections.map((c) => ({ label: c.title, href: `/collections/${c.slug}` })), ...combos.slice(0, 4).map((c) => ({ label: c.name, href: `/combos/${c.slug}` }))] },
  ];
  return (
    <section aria-labelledby="popular-links" className="border-t border-line bg-bone-2">
      <div className="container-site py-12 md:py-14">
        <h2 id="popular-links" className="eyebrow text-taupe">Popular on CO2</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">Popular products</p>
            <ul className="mt-3 flex flex-wrap gap-x-1 gap-y-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
              {popular.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/product/${p.slug}`} className="hover:text-ink hover:underline">{p.name}</Link>
                  {i < popular.length - 1 && <span className="ml-1 text-taupe/60" aria-hidden>|</span>}
                </li>
              ))}
            </ul>
          </div>
          {groups.map((g, i) => (
            <div key={g.title} className={i === 2 ? "md:col-span-3" : "md:col-span-2"}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">{g.title}</p>
              <ul className="mt-3 space-y-1.5 text-[0.8125rem] text-ink-soft">
                {g.links.map((l) => (
                  <li key={l.href}><Link href={l.href} className="hover:text-ink hover:underline">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
