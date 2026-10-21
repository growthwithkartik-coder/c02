"use client";

import { useRouter } from "next/navigation";
import { Heart, Check, Mail } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { readResult } from "@/lib/consultation/store";
import type { Product } from "@/types";
import { useStore } from "@/components/providers/StoreProvider";
import { QuantityStepper } from "@/components/ui/primitives";
import { customOptionChoices } from "@/data/custom-options";
import { cn, isPricePending, money } from "@/lib/utils";
import { PriceOnRequestPanel } from "@/components/commerce/PriceOnRequest";
import { announceShade } from "@/lib/shade-events";
import { site } from "@/data/site";
import { sampleFor } from "@/lib/commerce";

/* Shade picker / formula options + quantity + Add to cart, Buy now, Wishlist.
   Used by the product page and the quick-view modal. */
export const ProductPurchase = forwardRef<HTMLDivElement, { product: Product; compact?: boolean; onAdded?: () => void }>(function ProductPurchase(
  { product, compact, onAdded },
  ref,
) {
  const router = useRouter();
  const { addToCart, toggleWishlist, inWishlist, toast } = useStore();
  const [qty, setQty] = useState(1);
  const [shade, setShade] = useState(product.shades[0]?.name);
  const [options, setOptions] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const sample = sampleFor(product.slug);
  const [size, setSize] = useState<"full" | "sample">("full");
  const unit = size === "sample" && sample ? sample.price : product.price;
  const wished = inWishlist(product.slug);
  const isCustom = !!product.custom;
  const required = isCustom ? product.custom!.options.filter((o) => customOptionChoices[o]) : [];
  const pending = isPricePending(product);

  function chooseShade(name: string) {
    setShade(name);
    announceShade({ slug: product.slug, shade: name, image: product.shades.find((s) => s.name === name)?.image });
  }

  // made-to-order: pre-fill from the Customized Skincare consultation, if this is the formula it suggested
  useEffect(() => {
    if (!isCustom) return;
    const r = readResult();
    if (r?.plan.custom?.slug !== product.slug) return;
    const allowed = new Set(product.custom!.options);
    const pre = Object.fromEntries(
      Object.entries(r.plan.custom.options).filter(([k, v]) => allowed.has(k) && (!customOptionChoices[k] || customOptionChoices[k].includes(v))),
    );
    setOptions((cur) => (Object.keys(cur).length ? cur : pre));
  }, [isCustom, product]);

  function validate() {
    if (!isCustom) return true;
    const missing = required.filter((o) => !options[o]);
    if (missing.length) {
      setError(`Please choose: ${missing.join(", ")}`);
      return false;
    }
    setError(null);
    return true;
  }

  function add(buyNow = false) {
    if (!validate()) return;
    addToCart(product.slug, qty, { shade, options: isCustom ? options : undefined, size: size === "sample" ? "sample" : undefined }, { silent: buyNow });
    onAdded?.();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
    if (buyNow) router.push("/checkout");
  }

  return (
    <div ref={ref} className="space-y-6">
      {product.shades.length > 0 && (
        <fieldset>
          <legend className="label">
            Shade — <span className="normal-case tracking-normal text-ink">{shade}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.shades.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => chooseShade(s.name)}
                aria-pressed={shade === s.name}
                aria-label={s.name}
                title={s.name}
                data-testid={`shade-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className={cn("h-10 w-10 rounded-full ring-offset-2 ring-offset-bone transition", shade === s.name ? "ring-1 ring-ink" : "ring-0 hover:ring-1 hover:ring-taupe")}
                style={{ background: s.hex }}
              />
            ))}
          </div>
        </fieldset>
      )}

      {sample && !isCustom && (
        <fieldset>
          <legend className="label">Size</legend>
          <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Choose a size">
            {([
              ["full", "Full size", product.size.split("/")[0].trim(), product.price],
              ["sample", "Travel size", sample.size, sample.price],
            ] as const).map(([id, label, sz, price]) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={size === id}
                onClick={() => setSize(id)}
                className={cn("flex flex-col items-start border px-4 py-3 text-left transition-colors", size === id ? "border-ink bg-ink text-bone" : "border-line hover:border-ink")}
              >
                <span className="text-[0.6875rem] uppercase tracking-[0.16em] opacity-70">{label}</span>
                <span className="mt-1 text-sm">{sz}{!pending && <> · <span className="tabular-nums">{money(price)}</span></>}</span>
              </button>
            ))}
          </div>
          {size === "sample" && <p className="mt-2 text-xs text-taupe">The same formula in a smaller pack. Loved it? Come back for the full size.</p>}
        </fieldset>
      )}

      {isCustom && (
        <fieldset className="space-y-4 border border-line p-5">
          <legend className="px-2 label">Your formula</legend>
          <div className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
            {product.custom!.options.map((o) => {
              const choices = customOptionChoices[o];
              const id = `opt-${product.slug}-${o.replace(/\W+/g, "-")}`;
              return (
                <div key={o} className={cn("field", !choices && "sm:col-span-2")}>
                  <label htmlFor={id} className="label">
                    {o} {choices ? <span aria-hidden>*</span> : <span className="normal-case tracking-normal text-taupe">(optional)</span>}
                  </label>
                  {choices ? (
                    <select
                      id={id}
                      className="input appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231A1814%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10"
                      value={options[o] ?? ""}
                      onChange={(e) => setOptions((x) => ({ ...x, [o]: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      {choices.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <input id={id} className="input" maxLength={240} placeholder="e.g. niacinamide, no fragrance" value={options[o] ?? ""} onChange={(e) => setOptions((x) => ({ ...x, [o]: e.target.value }))} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs leading-relaxed text-ink-soft">
            Cosmetic personalization only — not a medical product. We confirm your formula by email before it is prepared ({product.specs.find((s) => s.label === "Preparation")?.value ?? "5–8 working days"}).
          </p>
        </fieldset>
      )}

      {pending ? (
        <div className="flex flex-wrap items-start gap-3" data-price-pending-wrap>
          <div className="min-w-[14rem] flex-1">
            <PriceOnRequestPanel item={`${product.name}${shade ? ` — ${shade}` : ""}${size === "sample" && sample ? ` (travel size ${sample.size})` : ""}`} />
            <p className="mt-2 text-xs text-taupe">
              Or email{" "}
              <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`Price request — ${product.name}`)}`} className="inline-flex items-center gap-1 text-ink underline underline-offset-4">
                <Mail className="h-3.5 w-3.5" aria-hidden />{site.contact.email}
              </a>
            </p>
          </div>
          <WishlistButton product={product} wished={wished} onToggle={() => {
            toggleWishlist(product.slug);
            if (!wished) toast({ title: "Saved to wishlist", body: product.name, image: product.images[0] ?? null, action: { label: "View", href: "/wishlist" } });
          }} />
        </div>
      ) : (
      <>
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={qty} onChange={setQty} />
        <button type="button" onClick={() => add(false)} className="btn btn-primary btn-lg min-w-[12rem] flex-1" data-add-to-cart>
          {added ? <><Check className="h-4 w-4" /> Added</> : <>Add to bag — {money(unit * qty)}</>}
        </button>
        <button
          type="button"
          onClick={() => {
            toggleWishlist(product.slug);
            if (!wished) toast({ title: "Saved to wishlist", body: product.name, image: product.images[0] ?? null, action: { label: "View", href: "/wishlist" } });
          }}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="grid h-14 w-14 place-items-center border border-line transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-gold-light"
        >
          <Heart className={cn("h-5 w-5", wished && "fill-current")} strokeWidth={1.4} />
        </button>
      </div>
      <button type="button" onClick={() => add(true)} className="btn btn-outline btn-lg w-full">
        Buy now
      </button>
      </>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
});

function WishlistButton({ product, wished, onToggle }: { product: Product; wished: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={wished}
      aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      className="grid h-14 w-14 shrink-0 place-items-center border border-line transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-gold-light"
    >
      <Heart className={cn("h-5 w-5", wished && "fill-current")} strokeWidth={1.4} />
    </button>
  );
}
