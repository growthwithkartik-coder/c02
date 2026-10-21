import Image from "next/image";
import Link from "next/link";
import { Camera, ImageUp, ShieldCheck, SplitSquareHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card/ProductCard";
import { TryOnButton } from "@/components/tryon/TryOnButton";
import type { Product } from "@/types";
import { getDepartments, productsInDepartment } from "@/lib/taxonomy";
import { productImage } from "@/lib/utils";

export function SectionHead({ eyebrow, title, text, href, linkLabel, dark }: { eyebrow: string; title: React.ReactNode; text?: string; href?: string; linkLabel?: string; dark?: boolean }) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-5 md:mb-12 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <p className={dark ? "eyebrow text-gold-light" : "eyebrow text-taupe"}>{eyebrow}</p>
        <h2 className="mt-3 font-display text-display-sm">{title}</h2>
        {text && <p className={dark ? "mt-3 text-sm leading-relaxed text-bone/65" : "mt-3 text-sm leading-relaxed text-ink-soft"}>{text}</p>}
      </div>
      {href && (
        <Link href={href} className={dark ? "btn btn-outline-light btn-sm shrink-0" : "btn btn-outline btn-sm shrink-0"}>{linkLabel ?? "Shop all"}</Link>
      )}
    </div>
  );
}

export function ProductRow({ products, dark }: { products: Product[]; dark?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 lg:grid-cols-4">
      {products.map((p) => (
        <li key={p.slug} className="flex">
          <ProductCard product={p} dark={dark} className="w-full" sizes="(max-width:1024px) 46vw, 23vw" />
        </li>
      ))}
    </ul>
  );
}

/* ---------------- shop by category ---------------- */
export function CategoryTiles() {
  const depts = getDepartments();
  return (
    <section className="container-site py-section" aria-labelledby="cat-title">
      <SectionHead eyebrow="Shop by category" title={<span id="cat-title">Start with what you need.</span>} text="Each category has its own page, its own filters and its own products — skincare by concern, hair care by concern, body care by type and lips by shade." />
      <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {depts.map((d) => (
          <li key={d.id}>
            <Link href={`/shop/${d.id}`} className="group block">
              <div className="relative aspect-square bg-bone-2 ring-1 ring-transparent transition group-hover:ring-ink/25">
                <Image src={productImage(d.image, 640)} alt="" fill sizes="(max-width:1024px) 46vw, 23vw" className="object-contain" />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-2">
                <p className="font-display text-[1.75rem] leading-none group-hover:text-gold-deep md:text-3xl">{d.label}</p>
                <span className="text-xs tabular-nums text-taupe">{productsInDepartment(d.id).length} products</span>
              </div>
              <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-snug text-ink-soft">{d.description.split(" — ")[0].split(".")[0]}.</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------- featured collection (skincare / haircare) ---------------- */
export function FeaturedCollection({ eyebrow, title, text, href, linkLabel, products, chips, tone = "light" }: { eyebrow: string; title: React.ReactNode; text: string; href: string; linkLabel: string; products: Product[]; chips?: { label: string; href: string }[]; tone?: "light" | "stone" }) {
  return (
    <section className={tone === "stone" ? "bg-bone-2 py-section" : "py-section"}>
      <div className="container-site">
        <SectionHead eyebrow={eyebrow} title={title} text={text} href={href} linkLabel={linkLabel} />
        {chips && (
          <ul className="-mt-4 mb-10 flex flex-wrap gap-2">
            {chips.map((c) => <li key={c.href}><Link href={c.href} className="chip h-8 px-3 text-xs">{c.label}</Link></li>)}
          </ul>
        )}
        <ProductRow products={products} />
      </div>
    </section>
  );
}

/* ---------------- lip collection (second beauty portrait) ---------------- */
export function LipCollection({ glosses, portrait }: { glosses: Product[]; portrait: { src: string; alt: string; ai: boolean } | null }) {
  const fallback = glosses.find((g) => g.images.length > 1) ?? glosses[0];
  return (
    <section className="relative overflow-hidden bg-[#2A1418] py-section text-bone" aria-labelledby="lips-title">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_70%_at_20%_40%,rgba(125,31,51,.55),transparent_70%)]" />
      <div className="container-site relative grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* PORTRAIT: approved `lip-model` campaign image; until then the real
            Chocolate Dream product photograph (shown whole). */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-[2/3] max-h-[78vh] w-full max-w-[460px] overflow-hidden bg-carbon">
            {portrait ? (
              <>
                <Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width:1024px) 90vw, 38vw" className="object-cover object-center" />
                {portrait.ai && <span className="absolute bottom-3 right-3 bg-carbon/70 px-2 py-0.5 text-[0.6875rem] text-bone/85">AI-generated image</span>}
              </>
            ) : (
              <Image src={productImage(fallback.images[fallback.images.length - 1])} alt={`${fallback.name} lip gloss`} fill sizes="(max-width:1024px) 90vw, 38vw" className="object-contain" />
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="eyebrow text-gold-light">Lip collection</p>
          <h2 id="lips-title" className="mt-3 font-display text-display-md">Three shades. <span className="italic">One glass finish.</span></h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-bone/70">Plumping, non-sticky high-shine gloss with vitamin E, jojoba oil and shea butter — deep colour that catches the light. Not sure which? Try each one on your own lips first.</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <TryOnButton variant="gold" />
            <Link href="/shop/lips" className="btn btn-outline-light">Shop lips</Link>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6">
            {glosses.map((g) => (
              <li key={g.slug} className="flex">
                <ProductCard product={g} dark className="w-full" sizes="(max-width:640px) 46vw, 20vw" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- virtual try-on explainer ---------------- */
export function TryOnBand() {
  const steps = [
    { icon: Camera, t: "Camera or photo", d: "Turn on your camera for a live preview, or upload a front-facing photo." },
    { icon: SplitSquareHorizontal, t: "Switch & compare", d: "Change shades instantly and drag the before/after divider." },
    { icon: ShieldCheck, t: "Private by design", d: "Face tracking runs in your browser. Nothing is uploaded or saved." },
  ];
  return (
    <section className="container-site py-section" aria-labelledby="tryon-title">
      <div className="grid items-center gap-10 border border-line p-6 md:p-10 lg:grid-cols-12 lg:p-14">
        <div className="lg:col-span-5">
          <p className="eyebrow text-taupe">Virtual lip try-on</p>
          <h2 id="tryon-title" className="mt-3 font-display text-display-sm">See the shade on you before you buy.</h2>
          <div className="mt-7 flex flex-wrap gap-3">
            <TryOnButton />
            <Link href="/shop/lips#try-on" className="btn btn-outline">About try-on</Link>
          </div>
        </div>
        <ol className="grid gap-6 sm:grid-cols-3 lg:col-span-7">
          {steps.map((s) => (
            <li key={s.t} className="border-t border-line pt-5">
              <s.icon className="h-5 w-5 text-gold-deep" strokeWidth={1.4} aria-hidden />
              <p className="mt-3 font-display text-2xl leading-tight">{s.t}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-taupe"><ImageUp className="h-3.5 w-3.5" aria-hidden /> Works on recent desktop and mobile browsers. Camera access requires HTTPS.</p>
    </section>
  );
}

/* ---------------- brand story ---------------- */
export function BrandStory() {
  const tenets = [
    { t: "Printed, not promised.", d: "Every formula is described exactly as its pack describes it. No invented percentages, no borrowed studies, no ratings until real reviews exist." },
    { t: "Botanicals with a reason.", d: "Neem, tulasi, aloe, saffron, sandalwood — chosen for what they bring to a texture, alongside gold, charcoal, hyaluronic acid and niacinamide." },
    { t: "Made personal.", d: "Six formulas are made to order around your shade, finish and preferences — and a free consultation matches the rest of the range to your skin." },
  ];
  return (
    <section className="bg-carbon py-section text-bone grain" aria-labelledby="story-title">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-gold-light">The CO2 philosophy</p>
            <h2 id="story-title" className="mt-4 font-display text-display-md">Say what&rsquo;s inside. <span className="italic text-gold-light">Nothing more.</span></h2>
            <Link href="/about" className="btn btn-outline-light mt-8">Read the CO2 story</Link>
          </div>
          <ol className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
            {tenets.map((x, i) => (
              <li key={x.t} className="border-t border-line-dark pt-5">
                <p className="eyebrow tabular-nums text-gold-light">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-display text-2xl leading-tight">{x.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-bone/60">{x.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
