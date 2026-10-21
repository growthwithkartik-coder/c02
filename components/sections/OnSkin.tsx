import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/motion";
import { scenesFor } from "@/lib/campaign";
import { getProduct } from "@/lib/catalog";
import { productImage } from "@/lib/utils";

/* SECTION 07 — CO2 on skin: how each product is applied.
   Shows approved campaign images of people using the product
   (data/campaign-images.json). Until a scene is approved, the tile uses
   the real product photograph — never a placeholder face. The steps are
   the "How to use" text printed on each pack. */
export function OnSkin() {
  const scenes = scenesFor("on-skin")
    .map((x) => ({ ...x, product: getProduct(x.scene.product) }))
    .filter((x) => x.product)
    .slice(0, 6);
  if (!scenes.length) return null;
  const anyPhoto = scenes.some((s) => s.image);

  return (
    <section className="bg-bone-2 py-section" aria-labelledby="onskin-title">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-taupe"><span className="mr-3">07 —</span>On skin</p>
            <h2 id="onskin-title" className="mt-4 max-w-[14ch] font-display text-display-md">How CO2 goes on.</h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-ink-soft">
              The steps for each product, as printed on its pack. Not sure which ones are yours? The consultation puts them in order for your skin.
            </p>
            <Link href="/make-it-yours/face" className="btn btn-outline mt-5">Find my routine</Link>
          </div>
        </div>

        <ul className="no-scrollbar -mx-gutter mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-gutter pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-14 md:overflow-visible md:px-0">
          {scenes.map(({ scene, image, product }, i) => {
            const p = product!;
            return (
              <Reveal as="li" key={scene.id} delay={(i % 3) * 0.06} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] md:w-auto">
                <Link href={`/product/${p.slug}`} className="group block">
                  <div className="photo relative aspect-[4/5]">
                    {image ? (
                      <Image src={image.file} alt={scene.alt} fill sizes="(max-width:768px) 78vw, 31vw" className="object-cover transition-transform duration-1000 ease-expo group-hover:scale-[1.03]" />
                    ) : p.images[0] ? (
                      <Image src={productImage(p.images[0])} alt={`${p.name} — ${p.subtitle}`} fill sizes="(max-width:768px) 78vw, 31vw" className="object-contain" />
                    ) : null}
                    <span className="absolute left-3 top-3 bg-bone/90 px-2.5 py-1 text-xs">{scene.step}</span>
                    {image?.source === "ai-generated" && (
                      <span className="absolute bottom-3 right-3 bg-carbon/70 px-2 py-0.5 text-[0.6875rem] text-bone/85">AI-generated image</span>
                    )}
                  </div>
                </Link>
                <div className="mt-5">
                  <Link href={`/product/${p.slug}`} className="font-display text-[1.75rem] leading-tight hover:text-gold-deep">{p.name}</Link>
                  <ol className="mt-3 space-y-1.5 text-sm text-ink-soft">
                    {p.howToUse.map((s, n) => (
                      <li key={n} className="grid grid-cols-[1.5rem_1fr]"><span className="tabular-nums text-taupe">{n + 1}</span>{s}</li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            );
          })}
        </ul>
        {anyPhoto && <p className="mt-10 text-xs text-taupe">Images marked &ldquo;AI-generated&rdquo; were created with an image model from the real product photographs and reviewed by CO2. They show how a product is applied, not a result.</p>}
      </div>
    </section>
  );
}
