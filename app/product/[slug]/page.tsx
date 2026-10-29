import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { ArrowRight, Clock, FlaskConical, Leaf, PackageCheck, RotateCcw, Sparkles, Truck } from "lucide-react";
import { ProductGallery } from "@/components/product-gallery/ProductGallery";
import { ProductPurchase } from "@/components/product-details/ProductPurchase";
import { Reviews, RoutineStrip, StickyBuyBar, FrequentlyBought } from "@/components/product-details/ProductExtras";
import { ProductCard } from "@/components/product-card/ProductCard";
import { AddSampleButton } from "@/components/commerce/AddButtons";
import { InYourRoutine } from "@/components/miy/InYourRoutine";
import { buildHref } from "@/components/miy/links";
import { ComboFeature } from "@/components/home/HomeEditorial";
import { Breaker } from "@/components/brand/Breakers";
import { Accordion, Breadcrumbs, Price, Rating, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/animations/motion";
import { JsonLd } from "@/components/ui/JsonLd";
import { getAllProducts, getCustomFormulas, getProduct, getRelated, getRoutine, getFrequentlyBought, collectionsFor, typeLabel, categoryLabel } from "@/lib/catalog";
import { cardTypeLabel, getDepartment, primaryDepartment, supportsTryOn } from "@/lib/taxonomy";
import { customizationFor, sampleFor } from "@/lib/commerce";
import { cautions, combosFor, concernLabels, productFaqs, routinePlace, whenToUse } from "@/lib/product-content";
import { containers, packColours } from "@/data/customize";
import { site } from "@/data/site";
import { CUSTOM_PRICES_ON_REQUEST, isPricePending, money, priceText, productImage, PRICES_ON_REQUEST } from "@/lib/utils";
import { ProductTryOn } from "@/components/tryon/ProductTryOn";
import { DetailSizePrice } from "@/components/ui/SizePrice";

// Only catalogue products (and made-to-order formulas, which redirect to the
// builder) have pages; any other slug — e.g. a removed product — is a hard 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...getAllProducts(), ...getCustomFormulas()].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p || p.custom) return {};
  const title = `${p.name} — ${p.subtitle}`;
  const size = p.size.replace(/\.$/, "");
  const body = p.description === p.shortDescription ? "" : ` ${p.description}`;
  const pending = isPricePending(p);
  const fullDescription = `${p.shortDescription} ${size}${pending ? "" : ` · ${money(p.price)}`}.${body}`;
  // trim to ~300 characters at a word boundary so meta descriptions never end mid-word
  const description = fullDescription.length <= 300 ? fullDescription : `${fullDescription.slice(0, 297).replace(/[\s,;:—–-]+\S*$/, "")}…`;
  const image = p.images[0] ? productImage(p.images[0]) : "/brand/co2-logo-360.png";
  return {
    title,
    description,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { type: "website", title: `${p.name} · CO2`, description, url: `/product/${p.slug}`, images: [{ url: image, width: 1200, height: 1200, alt: p.name }] },
    twitter: { card: "summary_large_image", title: `${p.name} · CO2`, description, images: [image] },
    ...(pending ? {} : { other: { "product:price:amount": String(p.price), "product:price:currency": "INR" } }),
  };
}

function SectionTitle({ n, eyebrow, title, dark }: { n: string; eyebrow: string; title: React.ReactNode; dark?: boolean }) {
  return (
    <div>
      <p className={dark ? "eyebrow text-gold-light" : "eyebrow text-taupe"}>{n} · {eyebrow}</p>
      <h2 className="mt-3 font-display text-display-sm">{title}</h2>
    </div>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  // made-to-order formulas are not catalogue products — they are configured in the builder
  if (p.custom) redirect(buildHref(p.slug));

  const related = getRelated(p, 4);
  const routine = getRoutine(p);
  const fbt = getFrequentlyBought(p);
  const cols = collectionsFor(p);
  const ship = site.commerce;
  const dept = getDepartment(primaryDepartment(p))!;
  const sample = sampleFor(p.slug);
  const cz = customizationFor(p);
  const czProduct = cz?.slug ? getProduct(cz.slug) : null;
  const place = routinePlace(p);
  const when = whenToUse(p);
  const warn = cautions(p);
  const concerns = concernLabels(p);
  const inCombos = combosFor(p);
  const faqs = productFaqs(p);
  const prep = p.specs.find((s) => s.label === "Preparation")?.value;
  const pending = isPricePending(p);
  const availability = pending ? (p.availability === "out-of-stock" ? "Out of stock · price on request" : "Price on request · as per customization") : p.custom ? `Made to order · prepared in ${prep ?? "5–8 working days"}` : p.availability === "in-stock" ? `In stock · ships in ${ship.dispatchDays}` : p.availability === "low-stock" ? "Low stock" : p.availability === "out-of-stock" ? "Out of stock" : String(p.availability);

  const url = `${site.url}/product/${p.slug}`;
  /* Section numbers are assigned in render order, so they stay consecutive
     when an optional section (routine, combos, related) isn't shown. */
  let sectionCount = 0;
  const nextSection = () => String(++sectionCount).padStart(2, "0");
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            description: p.description,
            sku: p.id,
            brand: { "@type": "Brand", name: "CO2" },
            category: `${categoryLabel(p.category)} > ${typeLabel(p.type)}`,
            image: p.images.map((k) => `${site.url}${productImage(k)}`),
            url,
            // no Offer until a real price exists — search engines must never see ₹0
            ...(pending
              ? {}
              : {
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "INR",
                    price: p.price,
                    availability: p.custom ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
                    url,
                    seller: { "@type": "Organization", name: site.legalName },
                  },
                }),
            ...(p.rating && p.reviewCount ? { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount } } : {}),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Shop", item: `${site.url}/shop` },
              { "@type": "ListItem", position: 2, name: dept.label, item: `${site.url}/shop/${dept.id}` },
              { "@type": "ListItem", position: 3, name: p.name, item: url },
            ],
          },
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
        ]}
      />

      {/* 1–2. gallery + product information */}
      <section className="container-site pt-[calc(var(--nav-h)+1.5rem)]">
        <Breadcrumbs className="mb-6" items={[{ label: "Home", href: "/" }, { label: dept.label, href: `/shop/${dept.id}` }, { label: p.name }]} />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+1rem)]">
              <ProductGallery product={p} />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="flex flex-wrap gap-2">
              {p.badge && <Badge tone={p.badge === "Signature" ? "gold" : "dark"}>{p.badge}</Badge>}
              {p.bestSeller && <Badge tone="dark">Bestseller</Badge>}
              {cz && !p.custom && <Badge className="border border-gold/60 text-gold-deep">Customizable</Badge>}
              {sample && <Badge className="border border-line">Travel size available</Badge>}
            </div>
            <p className="eyebrow mt-4 text-taupe">{dept.title} · {cardTypeLabel(p)}</p>
            <h1 className="mt-3 font-display text-[clamp(2.75rem,5vw,4.75rem)] leading-[0.92]">{p.name}</h1>
            <p className="mt-2 text-ink-soft">{p.subtitle}</p>
            <DetailSizePrice product={p} className="mt-5" />
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <a href="#reviews" className="hover:underline"><Rating product={p} showEmpty /></a>
            </div>
            <p className="mt-2 flex items-center gap-2 text-sm"><span className={p.availability === "out-of-stock" ? "h-2 w-2 rounded-full bg-red-600" : pending ? "h-2 w-2 rounded-full bg-gold" : "h-2 w-2 rounded-full bg-leaf"} aria-hidden /> {availability}</p>
            <p className="mt-6 leading-relaxed text-ink-soft">{p.description}</p>

            {supportsTryOn(p) && <ProductTryOn product={p} />}

            <div className="mt-6"><ProductPurchase product={p} /></div>
            <div className="mt-6"><InYourRoutine slug={p.slug} /></div>

            {cz && !p.custom && (
              <Link href={buildHref(cz.id, { from: p.slug })} className="group mt-6 flex items-center justify-between gap-4 bg-carbon p-4 text-bone">
                <span className="flex items-center gap-3 text-sm"><Sparkles className="h-4 w-4 text-gold-light" /> {cz.mode === "listed" ? `Make it yours — start a ${cz.label.toLowerCase()} from this product` : `Request a ${cz.label.toLowerCase()} made your way`}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            <ul className="mt-8 grid grid-cols-2 gap-4 border-y border-line py-5 text-xs text-ink-soft">
              <li className="flex items-center gap-2"><Truck className="h-4 w-4 shrink-0" strokeWidth={1.4} /> Free shipping over {money(ship.freeShippingThreshold)}; otherwise {money(ship.shippingFee)}</li>
              <li className="flex items-center gap-2"><PackageCheck className="h-4 w-4 shrink-0" strokeWidth={1.4} /> {p.custom ? "Made to order" : `Delivered in ${ship.deliveryDays}`}</li>
              <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.4} /> {p.custom ? "Formula kept on file" : `${ship.returnWindowDays}-day returns (unopened)`}</li>
              <li className="flex items-center gap-2"><Leaf className="h-4 w-4 shrink-0" strokeWidth={1.4} /> {p.ingredients.length || p.custom ? "Key ingredients listed below" : "Ingredients on the pack"}</li>
            </ul>
            {cols.length > 0 && (
              <p className="mt-6 text-sm text-ink-soft">
                Part of{" "}
                {cols.map((c, i) => (
                  <span key={c.slug}>
                    <Link href={`/collections/${c.slug}`} className="text-ink underline underline-offset-4">{c.title}</Link>
                    {i < cols.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. overview + 7. texture & experience */}
      <section className="mt-section bg-carbon py-section text-bone grain">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-gold-light">{nextSection()} · Product overview</p>
            <p className="mt-6 font-display text-[clamp(2rem,4vw,3.75rem)] leading-[1.02]">{p.lede || p.shortDescription}</p>
          </Reveal>
          <Reveal delay={0.1} className="space-y-5 text-bone/70 lg:col-span-4 lg:col-start-9 lg:pt-12">
            {p.story.map((s, i) => <p key={i} className="leading-relaxed">{s}</p>)}
          </Reveal>
        </div>
        <div className="container-site mt-14">
          <dl className="grid gap-px bg-line-dark sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["What it is", cardTypeLabel(p)],
              ["Where it fits", `${place.step}${place.order ? ` · ${place.order.charAt(0).toLowerCase()}${place.order.slice(1)}` : ""}`],
              ["Texture", p.texture || "—"],
              ["Finish", p.finish || "—"],
            ].map(([k, v]) => (
              <div key={k} className="bg-carbon p-6">
                <dt className="eyebrow text-bone/45">{k}</dt>
                <dd className="mt-3 text-[0.95rem] leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
          {p.benefits.length > 0 && (
            <ul className="mt-px grid gap-px bg-line-dark sm:grid-cols-3">
              {p.benefits.map((b, i) => (
                <li key={b.title} className="bg-carbon p-6">
                  <p className="text-xs tabular-nums text-gold-light">0{i + 1}</p>
                  <p className="mt-3 font-display text-2xl">{b.title}</p>
                  <p className="mt-2 text-sm text-bone/60">{b.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 4. ingredients */}
      <section id="ingredients" className="container-site scroll-mt-24 pt-section">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionTitle n={nextSection()} eyebrow="Ingredients" title="What's inside." />
            <p className="mt-4 text-sm text-ink-soft">{p.custom ? "Your formula is built from the families you choose. The final ingredient list is declared on your formula card." : "The key ingredients printed on the pack, with the role each one plays in this formula."}</p>
            <Link href="/ingredients" className="mt-5 inline-flex items-center gap-2 text-sm underline underline-offset-4"><FlaskConical className="h-4 w-4" /> Ingredient guide</Link>
          </div>
          <div className="lg:col-span-8">
            {p.ingredients.length === 0 && !p.custom && (
              <p className="border border-line bg-bone-2/60 p-6 text-sm leading-relaxed text-ink-soft">No ingredients are printed on the {p.name.toLowerCase()} photography supplied so far, so none are listed here yet. Please check the pack, or ask us on WhatsApp.</p>
            )}
            <ul className="grid gap-px bg-line sm:grid-cols-2">
              {p.ingredients.map((i, n) => (
                <li key={i.name} className="bg-bone p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-3xl leading-none">{i.name}</p>
                    <span className="text-xs tabular-nums text-taupe">{String(n + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-3 text-sm text-ink-soft"><span className="eyebrow mr-2 text-gold-deep">Role</span>{i.note}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div className="border border-line p-5">
                <p className="label">Full ingredient list</p>
                <p className="mt-2 text-ink-soft">{p.custom ? "Declared on your formula card with your formula code." : "Printed on the pack. The complete INCI list hasn't been added to the website yet — please check the pack, or ask us on WhatsApp."}</p>
              </div>
              <div className="border border-line p-5">
                <p className="label">Usage guidance from the pack</p>
                {warn.length ? <ul className="mt-2 space-y-1 text-ink-soft">{warn.map((w) => <li key={w}>{w}</li>)}</ul> : <p className="mt-2 text-ink-soft">Use as directed. Patch-test new products on a small area first.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. how to use + 6. who might prefer it */}
      <section className="container-site grid gap-10 pt-section lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionTitle n={nextSection()} eyebrow="How to use" title="Use it like this." />
          <ol className="mt-8 space-y-4">
            {p.howToUse.map((s, i) => (
              <li key={i} className="flex gap-5 border-b border-line pb-4">
                <span className="font-display text-3xl leading-none text-taupe/60">{String(i + 1).padStart(2, "0")}</span>
                <span className="pt-1 text-[0.98rem]">{s}</span>
              </li>
            ))}
          </ol>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="label">When</dt><dd className="mt-1 flex items-center gap-2"><Clock className="h-4 w-4 text-gold-deep" /> {when ?? "As directed"}</dd></div>
            <div><dt className="label">Routine step</dt><dd className="mt-1">{place.step}</dd></div>
          </dl>
        </div>
        <div className="bg-bone-2 p-7 md:p-9 lg:col-span-5">
          <SectionTitle n={nextSection()} eyebrow="Who might prefer it" title="Made with this in mind." />
          {p.forWho && <p className="mt-6 text-[0.98rem] leading-relaxed">{p.forWho}</p>}
          <dl className="mt-6 space-y-4 text-sm">
            {p.skinTypes.length > 0 && <div><dt className="label">Listed for</dt><dd className="mt-1">{p.skinTypes.length >= 6 ? "All skin types listed" : `${p.skinTypes.join(", ")} skin`}</dd></div>}
            {concerns.length > 0 && <div><dt className="label">Shopped under</dt><dd className="mt-1 flex flex-wrap gap-2">{concerns.map((c) => <span key={c} className="chip h-8 px-3 text-xs">{c}</span>)}</dd></div>}
            {p.specs.length > 0 && (
              <div>
                <dt className="label">Details</dt>
                <dd className="mt-1">
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                    {p.specs.map((s) => (<Fragment key={s.label}><dt className="text-taupe">{s.label}</dt><dd>{s.value}</dd></Fragment>))}
                  </dl>
                </dd>
              </div>
            )}
          </dl>
          <p className="mt-6 text-xs text-taupe">Not suitable for everyone — check the ingredients against anything you avoid, and patch-test first.</p>
        </div>
      </section>

      {/* 8. make this product yours */}
      <section className="container-site pt-section">
        <div className="grid overflow-hidden bg-carbon text-bone lg:grid-cols-12">
          <div className="p-7 md:p-12 lg:col-span-7">
            <p className="eyebrow text-gold-light">{nextSection()} · Customization</p>
            <h2 className="mt-3 font-display text-display-sm">Make this product <span className="italic text-gold-light">yours.</span></h2>
            {cz ? (
              <>
                <p className="mt-4 max-w-xl text-bone/70">
                  {p.custom
                    ? "This formula is made to order. Choose every option below, pick your packaging and preview it in 3D."
                    : cz.mode === "listed"
                      ? `Start a made-to-order ${cz.label.toLowerCase()} from ${p.name} — we'll carry its key ingredients into your notes, and you choose the rest.`
                      : `There's no made-to-order ${cz.label.replace("Custom ", "").toLowerCase()} in the catalogue yet, but you can send a request based on ${p.name}. We'll confirm what's possible and the price first.`}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {(cz.mode === "listed" ? czProduct?.custom?.options ?? [] : cz.options?.map((o) => o.name) ?? []).map((o) => <li key={o} className="chip chip-dark pointer-events-none">{o}</li>)}
                  <li className="chip chip-dark pointer-events-none">Packaging: {cz.containers.map((c) => containers[c].label).join(" / ")}</li>
                  <li className="chip chip-dark pointer-events-none">Colour: {cz.colours.map((c) => packColours[c].label).join(", ")}</li>
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={buildHref(cz.id, { from: p.custom ? undefined : p.slug })} className="btn btn-gold">Customize this product</Link>
                  <p className="text-sm text-bone/60">{PRICES_ON_REQUEST || CUSTOM_PRICES_ON_REQUEST ? "Price on request · as per customization — quoted before anything is made" : cz.mode === "listed" && czProduct ? `From ${money(czProduct.price)} · confirmed with you before it's prepared` : "On request · quoted before anything is made"}</p>
                </div>
              </>
            ) : (
              <>
                <p className="mt-4 max-w-xl text-bone/70">This product isn&apos;t customizable yet. A consultation can still show where it fits in a routine made around you.</p>
                <Link href={`/make-it-yours/${dept.id === "skin" ? "face" : dept.id}`} className="btn btn-outline-light mt-8">Start a {dept.label.toLowerCase()} consultation</Link>
              </>
            )}
          </div>
          <div className="relative min-h-[260px] bg-carbon-3 lg:col-span-5">
            {p.images[0] ? (
              <Image src={productImage(p.images[p.images.length - 1], 1200)} alt="" fill sizes="(max-width:1024px) 92vw, 40vw" className="object-contain opacity-90" />
            ) : (
              <div className="grid h-full place-items-center"><Sparkles className="h-8 w-8 text-gold-light" /></div>
            )}
          </div>
        </div>
      </section>

      {/* 9. try a sample — only when the price sheet lists a travel size */}
      {sample && (
      <section className="container-site pt-section">
        <div className="grid gap-8 border border-line p-7 md:grid-cols-12 md:items-center md:p-10">
          <div className="md:col-span-7">
            <p className="eyebrow text-taupe">{nextSection()} · Try a sample</p>
            <h2 className="mt-3 font-display text-display-sm">Try the travel size first.</h2>
            <p className="mt-3 max-w-lg text-sm text-ink-soft">The same {p.name} in a {sample.size} travel pack — enough to get to know the texture before choosing the {p.size.split("/")[0].trim()} full size.</p>
          </div>
          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-px bg-line text-sm">
                <div className="bg-bone p-4"><p className="label">Travel size</p><p className="mt-1 font-display text-2xl">{sample.size}</p><p className="tabular-nums">{priceText(sample.price)}</p></div>
                <div className="bg-bone p-4"><p className="label">Full size</p><p className="mt-1 font-display text-2xl">{p.size.split("/")[0].trim()}</p><p className="tabular-nums">{priceText(p.price)}</p></div>
                <div className="col-span-2 flex flex-wrap items-center gap-3 bg-bone p-4">
                  <AddSampleButton slug={p.slug} />
                  <Link href="/sampling" className="text-xs underline underline-offset-4">Sampling Studio</Link>
                </div>
              </div>

          </div>
        </div>
      </section>
      )}

      {/* 10. complete the routine */}
      {routine.length > 1 && (
        <section className="container-site pt-section">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionTitle n={nextSection()} eyebrow="Complete the routine" title="Build the ritual around it." />
            <p className="max-w-sm text-sm text-ink-soft">A simple order of steps using CO2 formulas from the same category. Patch-test new products and adjust to how your skin feels.</p>
          </div>
          <div className="mt-10"><RoutineStrip steps={routine} current={p.slug} /></div>
          {fbt.length > 0 && !p.custom && !pending && (
            <div className="mt-12">
              <p className="eyebrow mb-6 text-taupe">Pairs well with</p>
              <FrequentlyBought product={p} others={fbt} />
            </div>
          )}
        </section>
      )}

      {/* 11. combos */}
      {inCombos.length > 0 && (
        <section className="container-site pt-section">
          <SectionTitle n={nextSection()} eyebrow="Combos" title={`Sets with ${p.name}`} />
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {inCombos.slice(0, 2).map((c, i) => <li key={c.slug}><ComboFeature combo={c} dark={i === 1} className="h-full" /></li>)}
          </ul>
        </section>
      )}

      <Breaker id="discovery" className="mt-section" />

      {/* 12. faqs */}
      <section className="container-site grid gap-10 pt-section lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionTitle n={nextSection()} eyebrow="Questions" title="Good to know." />
          <p className="mt-4 text-sm text-ink-soft">Answers come from this product&apos;s information and our shipping and returns policies.</p>
        </div>
        <div className="lg:col-span-8"><Accordion items={faqs.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} defaultOpen={null} /></div>
      </section>

      {/* 13. reviews */}
      <section id="reviews" className="container-site scroll-mt-24 pt-section">
        <SectionTitle n={nextSection()} eyebrow="Reviews" title="What people say." />
        <div className="mt-10"><Reviews product={p} /></div>
      </section>

      {/* 14. related */}
      {related.length > 0 && (
        <section className="container-site py-section">
          <div className="flex items-end justify-between">
            <SectionTitle n={nextSection()} eyebrow="Related" title="You may also like" />
            <Link href={`/shop/${dept.id}`} className="link-underline text-xs font-medium uppercase tracking-[0.16em]">All {dept.label.toLowerCase()} →</Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-14 lg:grid-cols-4 lg:gap-x-6">
            {related.map((r) => <ProductCard key={r.slug} product={r} sizes="(max-width:1024px) 50vw, 25vw" />)}
          </div>
        </section>
      )}

      <StickyBuyBar product={p} />
    </>
  );
}
