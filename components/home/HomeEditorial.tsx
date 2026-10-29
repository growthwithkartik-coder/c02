import { flows } from "@/lib/customize/flows";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import { LineReveal, Reveal, Parallax } from "@/components/animations/motion";
import { BrandFilm } from "@/components/brand/BrandFilm";
import { ProductCard } from "@/components/product-card/ProductCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { AddComboButton, AddSampleSetButton } from "@/components/commerce/AddButtons";
import { combos, type Combo } from "@/data/combos";
import { sampling } from "@/data/sampling";
import { site } from "@/data/site";
import { getIngredientLibrary, getProduct, getProducts } from "@/lib/catalog";
import { productsInDepartment } from "@/lib/taxonomy";
import { sampleFor, setPrice } from "@/lib/commerce";
import { cn, cutoutImage, isPricePending, listedPrice, money, productImage, priceText, PRICES_ON_REQUEST } from "@/lib/utils";

/* ------------------------------------------------------------------
   Homepage sections (2026 redesign). Server components; interactive
   bits (add to bag) are small client islands.
------------------------------------------------------------------- */

/* ============ 3. HERO ============ */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bone" aria-label="CO2 — beauty, made personal">
      <div className="container-site grid gap-10 pb-10 pt-[calc(var(--nav-h)+2rem)] lg:grid-cols-12 lg:gap-6 lg:pb-0 lg:pt-[calc(var(--nav-h)+3rem)]">
        <div className="relative z-10 lg:col-span-6 lg:pb-16">
          <p className="eyebrow flex items-center gap-3 text-gold-deep">
            <span className="h-px w-8 bg-gold" aria-hidden /> Personalized skincare & cosmetics
          </p>
          <h1 className="mt-6 font-display text-[clamp(3.1rem,7.6vw,7.4rem)] leading-[0.86] tracking-[-0.03em]">
            <LineReveal immediate lines={["Your skin.", "Your needs.", <span key="f" className="italic text-gold-deep">Your formula.</span>]} />
          </h1>
          <p className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-soft">
            Beauty shouldn&apos;t begin with choosing a bottle off a shelf. It should begin with understanding you. Tell us about your skin, your concerns and your preferences — we&apos;ll help you build a personalized routine and customize your products around your needs.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/make-it-yours" className="btn btn-primary btn-lg">Create your routine</Link>
            <Link href="/shop" className="btn btn-outline btn-lg">Explore the collection</Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-x-4 border-t border-line pt-5 text-sm">
            {[
              [String(flows.length), "category consultations"],
              [String(productsInDepartment("skin").length + productsInDepartment("hair").length + productsInDepartment("body").length + productsInDepartment("lips").length), "formulas to explore"],
              [String(Object.keys(sampling.items).length), "travel sizes"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl leading-none">{n}</dd>
                <dd className="mt-1 text-[0.6875rem] leading-tight text-taupe sm:text-xs">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* composition: real product cut-outs + an illustrative formula card */}
        <div className="relative min-h-[420px] lg:col-span-6 lg:min-h-[640px]">
          <div className="absolute inset-x-[6%] bottom-0 top-[4%] rounded-t-[999px] bg-gradient-to-b from-stone to-stone-2 lg:inset-x-[10%]" aria-hidden />
          <div className="absolute inset-x-[6%] bottom-0 top-[4%] rounded-t-[999px] bg-[radial-gradient(60%_50%_at_50%_35%,rgba(226,198,140,.55),transparent_70%)] lg:inset-x-[10%]" aria-hidden />
          <Parallax speed={0.06} className="absolute bottom-[4%] left-1/2 h-[78%] w-[44%] -translate-x-1/2">
            <Image src={cutoutImage("24k-gold-face-elixir")} alt="CO2 24K Gold Serum" fill priority sizes="(max-width:1024px) 44vw, 22vw" className="object-contain object-bottom drop-shadow-[0_30px_30px_rgba(17,16,13,.28)]" />
          </Parallax>
          <Parallax speed={0.12} className="absolute bottom-[3%] left-[4%] h-[40%] w-[34%] lg:left-[6%]">
            <Image src={cutoutImage("renew-firming-cream")} alt="CO2 Anti-Aging Cream" fill sizes="(max-width:1024px) 34vw, 16vw" className="object-contain object-bottom drop-shadow-[0_24px_24px_rgba(17,16,13,.25)]" />
          </Parallax>
          <Parallax speed={0.1} className="absolute bottom-[3%] right-[4%] h-[44%] w-[24%] lg:right-[8%]">
            <Image src={cutoutImage("gloss-berry-rubin")} alt="CO2 Gloss in Berry Rubin" fill sizes="(max-width:1024px) 24vw, 12vw" className="object-contain object-bottom drop-shadow-[0_24px_24px_rgba(17,16,13,.25)]" />
          </Parallax>
          <div className="absolute right-0 top-[8%] w-[58%] max-w-[260px] border border-line bg-bone/95 p-4 text-xs shadow-[0_24px_50px_-24px_rgba(17,16,13,.45)] backdrop-blur sm:right-[2%] lg:right-0">
            <p className="flex items-center justify-between text-[0.625rem] uppercase tracking-[0.18em] text-taupe">
              <span>Example formula card</span>
              <span className="text-gold-deep">✦</span>
            </p>
            <p className="mt-2 font-display text-xl leading-none">Made for you</p>
            <dl className="mt-3 space-y-1.5">
              {[
                ["Base", "Serum"],
                ["Texture", "Fluid"],
                ["Scent", "Fragrance-free"],
                ["Packaging", "Amber dropper"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-line pb-1.5 last:border-0">
                  <dt className="text-taupe">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* the brand statement — part of the hero, not a slogan sticker */}
      <div className="border-t border-line bg-bone-2">
        <div className="container-site grid gap-4 py-8 md:grid-cols-12 md:items-center md:py-10">
          <p className="font-display text-[clamp(2.2rem,4.6vw,4.2rem)] leading-none md:col-span-6">
            We make it <span className="italic text-gold-deep">for you.</span>
          </p>
          <p className="max-w-md text-ink-soft md:col-span-5 md:col-start-8">From your first consultation to the final bottle, your beauty experience begins with you — not with a shelf.</p>
        </div>
      </div>
    </section>
  );
}

/* ============ 5. BREAKER — ONE-SIZE-FITS-ALL ============ */
export function OneSizeBreaker() {
  return (
    <section className="relative overflow-hidden bg-carbon py-[clamp(5rem,11vw,10rem)] text-bone grain" aria-labelledby="osfa">
      <div className="pointer-events-none absolute -right-[10%] top-1/2 h-[120%] w-[60%] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,146,79,.22),transparent_65%)]" aria-hidden />
      <div className="container-site relative">
        <p className="eyebrow text-gold-light">Beauty begins with you</p>
        <h2 id="osfa" className="mt-6 max-w-6xl font-display text-[clamp(2.8rem,7.2vw,7rem)] leading-[0.92] tracking-[-0.025em]">
          <LineReveal lines={["Your beauty routine", <span key="2">shouldn&apos;t be <span className="italic text-gold-light">one-size-</span></span>, <span key="3" className="italic text-gold-light">fits-all.</span>]} />
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-5 md:col-start-7">
            <p className="text-lg leading-relaxed text-bone/75">Different concerns deserve different approaches. That&apos;s why we start by understanding what you need, before helping you decide what belongs in your routine.</p>
            <Link href="/make-it-yours#start" className="btn btn-gold mt-8">Find your starting point <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============ 6. SHOP BY CATEGORY ============ */
export function CategoryEditorial() {
  const tiles = [
    { label: "Skincare", href: "/shop/skin", image: "24k-gold-face-elixir-1", text: "Face washes, serums, creams, sun protection and masks — shop by concern.", count: productsInDepartment("skin").length, cls: "md:col-span-6 md:row-span-2", tone: "bg-stone", aspect: "aspect-square md:aspect-auto md:h-full" },
    { label: "Hair Care", href: "/shop/hair", image: "scalp-clear-hair-oil-1", text: "Shampoos, hair oils, scalp care and beard oil.", count: productsInDepartment("hair").length, cls: "md:col-span-3", tone: "bg-bone-2", aspect: "aspect-[4/5]" },
    { label: "Body Care", href: "/shop/body", image: "coco-glow-body-lotion-1", text: "Lotions, creams, gels, body wash and body soaps.", count: productsInDepartment("body").length, cls: "md:col-span-3", tone: "bg-[#E9E2D6]", aspect: "aspect-[4/5]" },
    { label: "Lips", href: "/shop/lips", image: "gloss-chocolate-dream-1", text: "Lipstick and high-shine gloss — try every shade on.", count: productsInDepartment("lips").length, cls: "md:col-span-6", tone: "bg-[#E8D9D3]", aspect: "aspect-[4/5] md:aspect-[8/5]" },
  ];
  return (
    <section className="container-site py-section" aria-labelledby="cats">
      <div className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow text-taupe">Shop by category</p>
          <h2 id="cats" className="mt-3 font-display text-display-md">Start with what <span className="italic">you need.</span></h2>
        </div>
        <p className="text-ink-soft md:col-span-4 md:col-start-9">Every category has its own page, its own filters and its own consultation — skin by concern, hair by scalp, lips by shade.</p>
      </div>
      <ul className="grid grid-cols-1 gap-4 md:auto-rows-auto md:grid-cols-12 md:gap-5">
        {tiles.map((t, i) => (
          <Reveal as="li" key={t.label} delay={i * 0.05} className={t.cls}>
            <Link href={t.href} className="group flex h-full flex-col">
              <div className={cn("relative overflow-hidden", t.tone, t.aspect, i === 0 && "min-h-[360px]")}>
                <Image src={productImage(t.image, i === 0 ? 1200 : 640)} alt="" fill sizes={i === 0 ? "(max-width:768px) 92vw, 48vw" : "(max-width:768px) 92vw, 24vw"} className="object-contain p-[6%] mix-blend-multiply" />
                <span className="absolute left-4 top-4 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-soft">{String(i + 1).padStart(2, "0")} / {t.count} products</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className={cn("font-display leading-none group-hover:text-gold-deep", i === 0 ? "text-4xl md:text-5xl" : "text-3xl")}>{t.label}</p>
                  <p className="mt-2 max-w-sm text-sm text-ink-soft">{t.text}</p>
                </div>
                <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-bone" aria-hidden>
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
        <Reveal as="li" className="md:col-span-12">
          <Link href="/combos" className="group grid grid-cols-1 items-center gap-6 bg-carbon p-6 text-bone md:grid-cols-12 md:p-10">
            <div className="md:col-span-5">
              <p className="eyebrow text-gold-light">Combos & rituals</p>
              <p className="mt-3 font-display text-4xl leading-none md:text-5xl">Better <span className="italic">together.</span></p>
              <p className="mt-3 max-w-sm text-sm text-bone/65">Complete routines from real CO2 products — {combos.length} sets, in the order you use them.</p>
            </div>
            <ul className="flex flex-wrap items-end justify-center gap-4 md:col-span-6 md:col-start-7" aria-hidden>
              {["neem-rose-face-wash", "24k-gold-face-elixir", "renew-firming-cream"].map((s, i) => (
                <li key={s} className="relative" style={{ width: ["5.5rem", "7rem", "6.5rem"][i], aspectRatio: "3/4" }}>
                  <Image src={productImage(`${s}-1`, 640)} alt="" fill sizes="120px" className="object-contain" />
                </li>
              ))}
              <li className="ml-2 self-center text-xs uppercase tracking-[0.16em] text-gold-light group-hover:underline">Shop combos →</li>
            </ul>
          </Link>
        </Reveal>
      </ul>
    </section>
  );
}

/* ============ 7. MAKE IT YOURS SHOWCASE ============ */
const steps = [
  { n: "01", t: "Tell us about you", b: "Share your concerns, preferences, current routine and the kind of experience you want.", g: "chat" },
  { n: "02", t: "Discover your routine", b: "Receive a suggested routine based on what you tell us — before you buy anything.", g: "routine" },
  { n: "03", t: "Personalize your products", b: "Explore suitable products, ingredients, textures and the packaging available for each one.", g: "bottle" },
  { n: "04", t: "Confirm your order", b: "Review your selections and send them to us — we reply with the price (as per your customization) and the preparation time.", g: "check" },
];

function StepGraphic({ kind }: { kind: string }) {
  const c = "stroke-current";
  return (
    <svg viewBox="0 0 120 80" className="h-20 w-auto text-gold-light" fill="none" strokeWidth="1.2" aria-hidden>
      {kind === "chat" && (
        <>
          <rect x="8" y="10" width="64" height="34" rx="17" className={c} />
          <path d="M22 44l-6 12 16-12" className={c} />
          <rect x="50" y="34" width="62" height="30" rx="15" className={c} opacity=".5" />
          <circle cx="30" cy="27" r="2.4" fill="currentColor" /><circle cx="40" cy="27" r="2.4" fill="currentColor" /><circle cx="50" cy="27" r="2.4" fill="currentColor" />
        </>
      )}
      {kind === "routine" && (
        <>
          <path d="M10 40h100" className={c} opacity=".4" />
          {[18, 46, 74, 102].map((x, i) => <circle key={x} cx={x} cy="40" r={6 + i * 2} className={c} fill={i === 3 ? "currentColor" : "none"} opacity={i === 3 ? 0.9 : 1} />)}
          <text x="10" y="70" fill="currentColor" fontSize="8" letterSpacing="1.5" opacity=".7">AM · PM · WEEKLY</text>
        </>
      )}
      {kind === "bottle" && (
        <>
          <rect x="22" y="30" width="26" height="40" rx="5" className={c} />
          <rect x="28" y="18" width="14" height="12" rx="2" className={c} />
          <path d="M35 18V8" className={c} />
          <rect x="62" y="38" width="30" height="32" rx="4" className={c} opacity=".6" />
          <rect x="66" y="30" width="22" height="8" rx="2" className={c} opacity=".6" />
          <circle cx="104" cy="22" r="5" fill="#B8924F" /><circle cx="104" cy="38" r="5" fill="#9A5A22" /><circle cx="104" cy="54" r="5" fill="#F3EFE8" />
        </>
      )}
      {kind === "check" && (
        <>
          <rect x="16" y="8" width="60" height="64" rx="4" className={c} />
          {[22, 34, 46].map((y) => <path key={y} d={`M26 ${y}h40`} className={c} opacity=".5" />)}
          <circle cx="88" cy="52" r="18" className={c} />
          <path d="M80 52l6 6 11-12" className={c} strokeWidth="1.8" />
        </>
      )}
    </svg>
  );
}

export function MakeItYoursShowcase() {
  return (
    <section className="relative overflow-hidden bg-carbon-2 py-section text-bone" aria-labelledby="miy">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold-light">Make It Yours</p>
            <h2 id="miy" className="mt-5 font-display text-display-md">A little more <span className="italic text-gold-light">you</span> in every bottle.</h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-bone/70">You&apos;ll see a suggested routine <b className="font-medium text-bone">before</b> you&apos;re asked to buy anything. Exploring is free; buying is a separate step, whenever you&apos;re ready.</p>
          </div>
        </div>
        <ol className="mt-14 grid gap-px bg-line-dark md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.08} className="flex flex-col bg-carbon-2 p-7 md:p-8">
              <div className="flex items-start justify-between">
                <span className="font-display text-5xl leading-none text-bone/25">{s.n}</span>
                <StepGraphic kind={s.g} />
              </div>
              <h3 className="mt-8 font-display text-3xl leading-tight">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bone/65">{s.b}</p>
              {i === 1 && <p className="mt-auto pt-6 text-[0.6875rem] uppercase tracking-[0.16em] text-gold-light">No purchase needed</p>}
            </Reveal>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link href="/make-it-yours" className="btn btn-gold btn-lg">Start personalizing</Link>
          <Link href="/guides/customization" className="link-underline text-sm text-bone/75 hover:text-bone">How customization works →</Link>
        </div>
      </div>
    </section>
  );
}

/* ============ 8. VIDEO BREAKER ============ */
export function FilmBreaker() {
  return (
    <section aria-label="Beauty, with you at the centre">
      <BrandFilm className="h-[70vh] min-h-[440px] max-h-[820px]">
        <div className="flex h-full items-center justify-center px-6 text-center text-bone">
          <h2 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.92] drop-shadow-[0_4px_30px_rgba(0,0,0,.4)]">
            Beauty, with you
            <br />
            <span className="italic text-gold-light">at the centre.</span>
          </h2>
        </div>
      </BrandFilm>
    </section>
  );
}

/* ============ 9. CURATED PRODUCTS ============ */
export function Curated() {
  const featured = getProducts(["24k-gold-face-elixir", "coco-glow-body-lotion", "scalp-clear-hair-oil", "gloss-berry-rubin"]);
  const combo = combos.find((c) => c.slug === "daily-skin-essentials")!;
  const custom = getProducts(["custom-serum", "custom-moisturizer", "custom-lip"]);
  return (
    <section className="container-site py-section" aria-labelledby="curated">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow text-taupe">Curated by CO2</p>
          <h2 id="curated" className="mt-3 font-display text-display-md">A few <span className="italic">favourites.</span></h2>
        </div>
        <Link href="/shop" className="btn btn-outline btn-sm self-start md:self-auto">Shop all products</Link>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 lg:grid-cols-4">
        {featured.map((p) => (
          <li key={p.slug} className="flex"><ProductCard product={p} className="w-full" sizes="(max-width:1024px) 46vw, 23vw" /></li>
        ))}
      </ul>

      <div className="mt-section grid gap-5 lg:grid-cols-12">
        <ComboFeature combo={combo} className="lg:col-span-7" />
        <div className="flex flex-col bg-bone-2 p-7 md:p-9 lg:col-span-5">
          <p className="eyebrow text-gold-deep">Customization</p>
          <h3 className="mt-3 font-display text-4xl leading-none">Formulas that start with you.</h3>
          <p className="mt-3 text-sm text-ink-soft">Choose base, texture, shade, scent and packaging. Every formula is confirmed with you before it&apos;s prepared.</p>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {custom.map((p) => (
              <li key={p.slug}>
                <Link href={`/make-it-yours/build?product=${p.slug}`} className="group flex items-center justify-between gap-4 py-4">
                  <span>
                    <span className="block font-display text-2xl leading-tight group-hover:text-gold-deep">{p.name}</span>
                    <span className="text-xs text-taupe">{p.size} · {priceText(listedPrice(p))}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/customization" className="mt-6 text-sm underline underline-offset-4">Customize your product — sizes, packaging &amp; formulas</Link>
        </div>
      </div>
    </section>
  );
}

export function ComboFeature({ combo, className, dark }: { combo: Combo; className?: string; dark?: boolean }) {
  const items = combo.items.map((i) => ({ ...i, p: getProduct(i.slug)! })).filter((i) => i.p);
  const total = items.reduce((s, i) => s + (listedPrice(i.p) ?? 0), 0);
  return (
    <article className={cn("flex flex-col p-7 md:p-9", dark ? "bg-carbon text-bone" : "bg-stone", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className={cn("eyebrow", dark ? "text-gold-light" : "text-ink-soft")}>Highlighted routine · {combo.kicker}</p>
        <Link href={`/combos/${combo.slug}`} className="text-xs underline underline-offset-4">View details</Link>
      </div>
      <h3 className="mt-3 font-display text-4xl leading-none md:text-5xl">{combo.name}</h3>
      <p className={cn("mt-3 max-w-lg text-sm", dark ? "text-bone/70" : "text-ink-soft")}>{combo.description}</p>
      <ol className="mt-7 grid grid-cols-3 gap-3">
        {items.map((i, n) => (
          <li key={i.slug}>
            <Link href={`/product/${i.slug}`} className="group block">
              <div className="relative aspect-square bg-bone/70">
                <ProductImage product={i.p} sizes="(max-width:1024px) 30vw, 14vw" className="absolute inset-0" />
                <span className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-carbon text-[0.625rem] text-bone">{n + 1}</span>
              </div>
              <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.14em] opacity-60">{i.step} · {i.when}</p>
              <p className="text-sm leading-tight group-hover:underline">{i.p.name}</p>
              <p className="text-xs tabular-nums opacity-70">{priceText(listedPrice(i.p))}</p>
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-current/10 pt-5">
        <AddComboButton name={combo.name} slugs={combo.items.map((i) => i.slug)} dark={dark} />
        <p className="text-xs opacity-70">{PRICES_ON_REQUEST ? "Price on request · as per customization." : `Set price = sum of items (${money(total)}).`}{combo.customizable?.length ? " Some steps can be customized." : ""}</p>
      </div>
    </article>
  );
}

/* ============ 10. INGREDIENT STORY ============ */
export function IngredientStory() {
  const lib = getIngredientLibrary();
  const pick = (re: RegExp) => lib.find((x) => re.test(x.name));
  const ings = [
    { e: pick(/^hyaluronic/i), role: "A humectant that holds water at the skin's surface." },
    { e: pick(/^neem$/i), role: "A clarifying botanical used across cleansers, scalp care and bars." },
    { e: pick(/activated charcoal|bamboo charcoal/i), role: "Porous charcoal used to lift oil from the surface." },
    { e: pick(/^aloe vera$/i), role: "A soothing, hydrating base in creams, gels and washes." },
  ].filter((x) => x.e) as { e: NonNullable<ReturnType<typeof pick>>; role: string }[];
  return (
    <section className="bg-bone-2 py-section" aria-labelledby="ings">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:col-span-4 lg:self-start">
            <p className="eyebrow text-taupe">The ingredient story</p>
            <h2 id="ings" className="mt-3 font-display text-display-md">Know what goes into your <span className="italic">routine.</span></h2>
            <p className="mt-5 text-ink-soft">Every ingredient has a purpose. Explore the ingredients in your chosen products, understand their intended role, and make informed decisions about your routine.</p>
            <p className="mt-4 text-xs text-taupe">Shown: key ingredients printed on CO2 packs, and how many CO2 products contain each.</p>
            <Link href="/ingredients" className="btn btn-primary mt-8">Explore ingredients</Link>
          </div>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8">
            {ings.map(({ e, role }, i) => (
              <Reveal as="li" key={e.name} delay={i * 0.06} className={cn("flex flex-col border border-line bg-bone p-6", i % 2 === 1 && "sm:mt-12")}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-display text-4xl leading-none">{e.name}</p>
                  <span className="text-xs tabular-nums text-taupe">in {e.products.length} {e.products.length === 1 ? "product" : "products"}</span>
                </div>
                <p className="mt-3 text-sm text-ink-soft">{role}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {e.products.slice(0, 4).map((p) => (
                    <li key={p.slug}>
                      <Link href={`/product/${p.slug}`} className="relative block h-16 w-16 bg-bone-2" title={p.name} aria-label={p.name}>
                        <Image src={productImage(p.images[0], 640)} alt="" fill sizes="64px" className="object-contain" />
                      </Link>
                    </li>
                  ))}
                  {e.products.length > 4 && <li className="grid h-16 w-16 place-items-center border border-line text-xs text-taupe">+{e.products.length - 4}</li>}
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ============ 11. SAMPLING STUDIO ============ */
export function SamplingSection() {
  if (!sampling.enabled) return null;
  const sets = sampling.sets.slice(0, 3);
  const cheapest = Math.min(...Object.values(sampling.items).map((s) => s.price));
  return (
    <section className="relative overflow-hidden bg-stone py-section" aria-labelledby="sampling">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-ink-soft">The Sampling Studio</p>
            <h2 id="sampling" className="mt-3 font-display text-display-md">Fall in love with the <span className="italic">sample first.</span></h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-ink-soft">Your next favourite product shouldn&apos;t have to be a guessing game. Explore travel-size options, experience the texture, and discover what works for you before choosing the full size.</p>
          </div>
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-px bg-ink/10 text-sm md:grid-cols-4">
          {[
            ["Travel sizes", `${Object.keys(sampling.items).length} formulas`],
            ["Price", PRICES_ON_REQUEST ? "On request" : `From ${money(cheapest)}`],
            ["Sample sets", `${sampling.sets.length} curated`],
            ["Shipping", "Standard rates apply"],
          ].map(([k, v]) => (
            <div key={k} className="bg-stone p-5">
              <dt className="text-xs uppercase tracking-[0.16em] text-ink-soft">{k}</dt>
              <dd className="mt-1 font-display text-2xl">{v}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {sets.map((s) => (
            <li key={s.id} className="flex flex-col bg-bone p-6">
              <p className="font-display text-3xl leading-none">{s.name}</p>
              <p className="mt-2 text-sm text-ink-soft">{s.description}</p>
              <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
                {s.slugs.map((slug) => {
                  const p = getProduct(slug)!;
                  const sm = sampleFor(slug)!;
                  return (
                    <li key={slug} className="flex items-center gap-3">
                      <span className="relative h-10 w-10 shrink-0 bg-bone-2"><Image src={productImage(p.images[0], 640)} alt="" fill sizes="40px" className="object-contain" /></span>
                      <span className="flex-1 leading-tight">{p.name}<span className="block text-xs text-taupe">{sm.size}</span></span>
                      {!PRICES_ON_REQUEST && <span className="tabular-nums text-ink-soft">{money(sm.price)}</span>}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto pt-6">
                <AddSampleSetButton name={s.name} slugs={s.slugs} className="w-full" />
                <p className="mt-2 text-center text-xs text-taupe">{PRICES_ON_REQUEST ? "Price on request · as per customization" : `Set price ${money(setPrice(s.slugs))} — the sum of its samples`}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/sampling" className="btn btn-primary">Visit the Sampling Studio</Link>
          <p className="max-w-lg text-xs text-ink-soft">{sampling.shippingNote} Loved a sample? Every travel size links straight to its full-size product.</p>
        </div>
      </div>
    </section>
  );
}

/* ============ 12. COMBOS ============ */
export function CombosSection() {
  const list = ["hydration-ritual", "clarifying-routine", "body-care-ritual", "wash-day-nourish"].map((s) => combos.find((c) => c.slug === s)!).filter(Boolean);
  return (
    <section className="container-site py-section" aria-labelledby="combos-home">
      <div className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow text-taupe">Combos & routines</p>
          <h2 id="combos-home" className="mt-3 font-display text-display-md">Curated for your <span className="italic">routine.</span></h2>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p className="text-sm text-ink-soft">Each set lists what&apos;s inside, the order to use it and its price — the plain sum of its products, no invented savings.</p>
          <Link href="/combos" className="btn btn-outline btn-sm mt-4">Browse all combos</Link>
        </div>
      </div>
      <ul className="grid gap-5 md:grid-cols-2">
        {list.map((c, i) => (
          <li key={c.slug}><ComboFeature combo={c} dark={i === 1 || i === 2} className="h-full" /></li>
        ))}
      </ul>
    </section>
  );
}

/* ============ 13. PHILOSOPHY ============ */
export function PhilosophySection() {
  const pillars = [
    ["Understanding first", "We ask before we recommend. Your answers shape the routine — not a bestseller list."],
    ["Ingredient transparency", "Key ingredients are listed for every product, and you can leave out the ones you'd rather avoid."],
    ["Routine simplicity", "As few steps as you want. A simple routine you enjoy beats a long one you skip."],
    ["Informed choices", "We separate what a product's own information says from what simply matches your preferences."],
  ];
  return (
    <section id="philosophy" className="relative overflow-hidden bg-bone py-section" aria-labelledby="phil">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-stone">
            <Image src={productImage("night-cream-1", 1200)} alt="CO2 Night Cream" fill sizes="(max-width:1024px) 92vw, 40vw" className="object-contain" />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
          <p className="eyebrow text-taupe">Our philosophy</p>
          <h2 id="phil" className="mt-3 font-display text-display-md">Beauty is personal. <span className="italic text-gold-deep">Your routine should be too.</span></h2>
          <dl className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {pillars.map(([t, b], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <dt className="flex items-baseline gap-3"><span className="text-xs tabular-nums text-gold-deep">0{i + 1}</span><span className="font-display text-2xl leading-tight">{t}</span></dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{b}</dd>
              </Reveal>
            ))}
          </dl>
          <p className="mt-10 border-t border-line pt-5 text-xs text-taupe">CO2 recommendations are cosmetic suggestions. They don&apos;t diagnose skin, scalp or hair conditions or replace advice from a dermatologist.</p>
        </div>
      </div>
    </section>
  );
}

/* ============ 14. COMMUNITY (no fabricated testimonials) ============ */
export function CommunitySection() {
  const cards = [
    { t: "Share how it went", b: "Tried a routine or a sample? Tell us what worked and what didn't — it shapes what we make next.", cta: "Send feedback", href: "/contact?topic=feedback" },
    { t: "Ask a real person", b: `Questions about a formula, a shade or an order — message us on WhatsApp, ${site.contact.hours}.`, cta: "Chat on WhatsApp", href: `https://wa.me/${site.contact.whatsapp}` },
    { t: "See the process", b: "How the consultation, your routine and made-to-order formulas fit together, step by step.", cta: "Read the guide", href: "/guides/customization" },
  ];
  return (
    <section className="border-t border-line bg-bone py-section" aria-labelledby="community">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow text-taupe">The CO2 community</p>
          <h2 id="community" className="mt-3 font-display text-display-sm">We&apos;re just getting started — <span className="italic">help us shape it.</span></h2>
          <p className="mt-4 text-sm text-ink-soft">Customer reviews will appear here as they come in. Until then, here&apos;s how to be part of it.</p>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {cards.map((c, i) => (
            <li key={c.t} className={cn("flex flex-col border border-line p-7", i === 1 && "bg-carbon text-bone")}>
              {i === 1 && <MessageCircle className="h-6 w-6 text-gold-light" strokeWidth={1.3} aria-hidden />}
              <p className={cn("font-display text-3xl leading-tight", i === 1 && "mt-4")}>{c.t}</p>
              <p className={cn("mt-3 text-sm", i === 1 ? "text-bone/70" : "text-ink-soft")}>{c.b}</p>
              {c.href.startsWith("http") ? (
                <a href={c.href} target="_blank" rel="noreferrer" className={cn("btn btn-sm mt-auto self-start", i === 1 ? "btn-gold mt-8" : "btn-outline mt-8")}>{c.cta}</a>
              ) : (
                <Link href={c.href} className="btn btn-sm btn-outline mt-8 self-start">{c.cta}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============ 15. FINAL CTA ============ */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-carbon py-[clamp(5rem,10vw,9rem)] text-bone grain" aria-labelledby="final-cta">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_60%_at_15%_100%,rgba(184,146,79,.28),transparent_70%)]" aria-hidden />
      <div className="container-site relative grid gap-10 lg:grid-cols-12 lg:items-end">
        <h2 id="final-cta" className="font-display text-display-lg lg:col-span-8">
          <LineReveal lines={["Your routine starts", <span key="c" className="italic text-gold-light">with a conversation.</span>]} />
        </h2>
        <div className="lg:col-span-4">
          <p className="text-bone/70">Tell us what you&apos;re looking for. We&apos;ll help you explore a routine and products that fit your preferences.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/make-it-yours" className="btn btn-gold">Build my routine</Link>
            {sampling.enabled && <Link href="/sampling" className="btn btn-outline-light">Try a sample</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
