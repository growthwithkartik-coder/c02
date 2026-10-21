import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import type { Product } from "@/types";
import { Marquee, Reveal } from "@/components/animations/motion";
import { site } from "@/data/site";
import { cn, productImage } from "@/lib/utils";

/* SECTION 10 — social / community. Uses CO2 campaign photography
   (product moments); swap in customer photos when you have consent. */
export function Community({ products }: { products: Product[] }) {
  const tiles = products.filter((p) => p.images.length > 1).slice(0, 8);
  const handle = site.social.instagramHandle;
  return (
    <section className="overflow-hidden bg-bone py-section" aria-labelledby="community-title">
      <Marquee className="border-y border-line py-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="mx-8 flex items-center gap-8 font-display text-5xl italic text-ink/80 md:text-7xl">
            #CO2Ritual <span className="text-gold">✦</span>
          </span>
        ))}
      </Marquee>

      <div className="container-site mt-16 md:mt-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-taupe"><span className="mr-3">11 —</span>Community</p>
            <h2 id="community-title" className="mt-4 max-w-[16ch] font-display text-display-md">
              Product moments, <span className="italic text-gold-deep">shared.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-ink-soft">
              Share your ritual with {handle} and #CO2Ritual for a chance to be featured here. Below: moments from the CO2 campaign.
            </p>
            {site.social.instagram ? (
              <a href={site.social.instagram} target="_blank" rel="noreferrer" className="btn btn-outline mt-5"><Instagram className="h-4 w-4" /> Follow {handle}</a>
            ) : null}
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {tiles.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 4) * 0.06} className={cn(i === 0 && "md:col-span-2 md:row-span-2", i === 5 && "md:col-span-2")}>
              <Link href={`/product/${p.slug}`} className="group relative block h-full overflow-hidden" data-cursor="View">
                <div className={cn("relative w-full", i === 0 ? "aspect-square" : i === 5 ? "aspect-[2/1]" : "aspect-square")}>
                  <Image src={productImage(p.images[1])} alt={`${p.name} — campaign moment`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain" />
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-carbon/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="text-sm text-bone">{p.name} →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
        <p className="mt-4 text-xs text-taupe">Campaign photography by CO2. Customer images appear here only with permission.</p>
      </div>
    </section>
  );
}
