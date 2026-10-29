import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { AddComboButton, AddSampleButton } from "@/components/commerce/AddButtons";
import { ComboFeature } from "@/components/home/HomeEditorial";
import { buildHref } from "@/components/miy/links";
import { Breadcrumbs } from "@/components/ui/primitives";
import { ProductImage } from "@/components/ui/ProductImage";
import { combos, comboGroups, getCombo } from "@/data/combos";
import { getProduct } from "@/lib/catalog";
import { sampleFor } from "@/lib/commerce";
import { cardTypeLabel } from "@/lib/taxonomy";
import { isPricePending, listedPrice, money, productImage, priceText, PRICES_ON_REQUEST } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return combos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCombo(slug);
  return c ? { title: `${c.name} — CO2 combo`, description: `${c.purpose} ${c.description}`, alternates: { canonical: `/combos/${c.slug}` } } : {};
}

export default async function ComboPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCombo(slug);
  if (!c) notFound();
  const items = c.items.map((i) => ({ ...i, p: getProduct(i.slug)! })).filter((i) => i.p);
  const unpriced = items.filter((i) => isPricePending(i.p));
  const total = items.reduce((t, i) => t + (listedPrice(i.p) ?? 0), 0);
  const group = comboGroups.find((g) => g.id === c.group);
  const others = combos.filter((x) => x.group === c.group && x.slug !== c.slug).slice(0, 2);
  return (
    <>
      <section className="bg-bone-2 pb-14 pt-[calc(var(--nav-h)+1.5rem)]">
        <div className="container-site">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Combos", href: "/combos" }, { label: c.name }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="relative aspect-square bg-bone lg:col-span-5">
              <Image src={productImage(c.hero, 1200)} alt={c.name} fill priority sizes="(max-width:1024px) 92vw, 40vw" className="object-contain" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="eyebrow text-gold-deep">{group?.label} · {c.kicker}</p>
              <h1 className="mt-3 font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.92]">{c.name}</h1>
              <p className="mt-4 text-lg text-ink-soft">{c.purpose}</p>
              <p className="mt-3 text-ink-soft">{c.description}</p>
              <dl className="mt-8 grid grid-cols-3 gap-px bg-line text-sm">
                <div className="bg-bone-2 p-4"><dt className="label">Products</dt><dd className="mt-1 font-display text-2xl">{items.length}</dd></div>
                <div className="bg-bone-2 p-4"><dt className="label">Set price</dt><dd className="mt-1 font-display text-2xl tabular-nums">{priceText(total)}</dd></div>
                <div className="bg-bone-2 p-4"><dt className="label">Customizable</dt><dd className="mt-1 font-display text-2xl">{c.customizable?.length ? "Partly" : "No"}</dd></div>
              </dl>
              <p className="mt-3 text-xs text-taupe">{PRICES_ON_REQUEST ? "Price on request · as per customization — we quote the set once you tell us the sizes, formulas and packaging you want." : "Set price is the sum of the individual prices below — no bundle discount applies."}{!PRICES_ON_REQUEST && unpriced.length ? ` ${unpriced.map((i) => i.p.name).join(", ")} ${unpriced.length > 1 ? "are" : "is"} price on request and not included.` : ""}</p>
              <div className="mt-8"><AddComboButton name={c.name} slugs={c.items.map((i) => i.slug)} className="btn-lg w-full sm:w-auto" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site py-section" aria-labelledby="inside">
        <h2 id="inside" className="font-display text-display-sm">What&apos;s inside — in order</h2>
        <ol className="mt-10 space-y-5">
          {items.map((i, n) => {
            const s = sampleFor(i.slug);
            const cz = c.customizable?.find((x) => x.slug === i.slug);
            return (
              <li key={i.slug} className="grid gap-5 border border-line p-5 md:grid-cols-12 md:items-center">
                <span className="font-display text-5xl text-taupe/50 md:col-span-1">{String(n + 1).padStart(2, "0")}</span>
                <Link href={`/product/${i.slug}`} className="relative block aspect-square bg-bone-2 md:col-span-2"><ProductImage product={i.p} sizes="200px" className="absolute inset-0" /></Link>
                <div className="md:col-span-5">
                  <p className="eyebrow text-gold-deep">{i.step} · {i.when}</p>
                  <p className="mt-1 font-display text-3xl leading-tight"><Link href={`/product/${i.slug}`} className="hover:underline">{i.p.name}</Link></p>
                  <p className="text-sm text-ink-soft">{cardTypeLabel(i.p)} · {i.p.size.split("/")[0]}</p>
                  <p className="mt-2 text-sm text-ink-soft">{i.p.howToUse[0]}</p>
                  <p className="mt-2 text-xs text-taupe">Key ingredients: {i.p.ingredients.map((x) => x.name).join(" · ")}</p>
                </div>
                <div className="flex flex-col gap-2 md:col-span-4 md:items-end">
                  <p className={isPricePending(i.p) ? "text-sm text-taupe" : "font-display text-2xl tabular-nums"}>{priceText(listedPrice(i.p))}</p>
                  {s && <AddSampleButton slug={i.slug} compact />}
                  {cz && <Link href={buildHref(cz.customSlug, { from: i.p.custom ? undefined : i.slug })} className="inline-flex items-center gap-1.5 text-xs text-gold-deep underline underline-offset-4"><Sparkles className="h-3.5 w-3.5" /> {cz.note}</Link>}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 text-sm text-ink-soft">Patch-test new products and adjust the routine to how your skin, hair or lips feel.</p>
      </section>

      {others.length > 0 && (
        <section className="container-site pb-section" aria-labelledby="more">
          <h2 id="more" className="mb-8 font-display text-display-sm">More {group?.label.toLowerCase()}</h2>
          <ul className="grid gap-5 md:grid-cols-2">{others.map((o, i) => <li key={o.slug}><ComboFeature combo={o} dark={i === 1} className="h-full" /></li>)}</ul>
        </section>
      )}
    </>
  );
}
