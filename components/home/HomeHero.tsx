import Image from "next/image";
import Link from "next/link";
import { HeroAddButton } from "./HeroAddButton";
import { site } from "@/data/site";
import { getDepartments } from "@/lib/taxonomy";
import { listedPrice, money, productImage, priceText } from "@/lib/utils";
import type { Product } from "@/types";

/* Homepage hero — split layout so the image never covers the headline,
   navigation or buttons.

   PORTRAIT: the right-hand frame shows the approved AI-generated (or
   photographed) beauty portrait `hero-model` from data/campaign-images.json.
   Until one is approved it shows the real 24K Gold Serum campaign
   photograph instead — never an illustration or a placeholder face. */
export function HomeHero({ portrait, product }: { portrait: { src: string; alt: string; ai: boolean } | null; product: Product }) {
  const depts = getDepartments();
  return (
    <section className="relative bg-bone" aria-label="CO2 — introduction">
      <div className="container-site grid items-center gap-10 pb-12 pt-[calc(var(--nav-h)+2rem)] md:grid-cols-12 md:gap-8 md:pb-16 lg:pt-[calc(var(--nav-h)+2.5rem)]">
        <div className="md:col-span-6 lg:col-span-5">
          <p className="eyebrow text-gold-deep">CO2 — {site.tagline}</p>
          <h1 className="mt-5 font-display text-[clamp(3.25rem,7.4vw,7rem)] leading-[0.88] tracking-[-0.03em]">
            The element <span className="block italic text-gold-deep">of you.</span>
          </h1>
          <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
            Skincare by concern, haircare, high-shine lip gloss and formulas made to your profile — {site.name} keeps every category clearly in its place, so you find what your skin and hair need.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop/skin" className="btn btn-primary btn-lg">Shop skincare</Link>
            <Link href="/make-it-yours/face" className="btn btn-outline btn-lg">Find my routine</Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 text-sm" aria-label="Shop by category">
            {depts.map((d) => (
              <li key={d.id}>
                <Link href={`/shop/${d.id}`} className="link-underline uppercase tracking-[0.14em] text-ink-soft hover:text-ink">{d.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative md:col-span-6 lg:col-span-6 lg:col-start-7">
          <div className={portrait ? "relative mx-auto aspect-[4/5] max-h-[min(78vh,760px)] w-full max-w-[600px] overflow-hidden bg-stone" : "relative mx-auto aspect-square max-h-[min(74vh,700px)] w-full max-w-[700px] bg-bone-2"}>
            {portrait ? (
              <>
                {/* lifestyle portrait: cover is fine here — it is not product packaging */}
                <Image src={portrait.src} alt={portrait.alt} fill priority sizes="(max-width:768px) 92vw, 46vw" className="object-cover object-[50%_25%]" />
                {portrait.ai && <span className="absolute bottom-3 right-3 bg-carbon/70 px-2 py-0.5 text-[0.6875rem] text-bone/85">AI-generated image</span>}
              </>
            ) : (
              <Image src={productImage(product.images[0])} alt={`${product.name} — ${product.subtitle}`} fill priority sizes="(max-width:768px) 92vw, 46vw" className="object-contain" />
            )}
          </div>

          {/* featured product card — sits below/beside the image, never over the headline */}
          <div className="relative mx-auto -mt-10 flex w-[88%] max-w-[420px] items-center gap-4 border border-line bg-bone p-3 shadow-[0_20px_40px_-20px_rgba(17,16,13,.35)] md:absolute md:-bottom-6 md:left-0 md:mt-0 md:w-[min(380px,80%)]">
            <div className="relative h-16 w-16 shrink-0 bg-bone-2">
              <Image src={productImage(product.images[0], 640)} alt="" fill sizes="64px" className="object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-taupe">Signature serum</p>
              <Link href={`/product/${product.slug}`} className="block truncate font-display text-xl leading-tight hover:text-gold-deep">{product.name}</Link>
              <p className="text-sm text-taupe">{priceText(listedPrice(product))}</p>
            </div>
            <HeroAddButton slug={product.slug} name={product.name} />
          </div>
        </div>
      </div>
    </section>
  );
}
