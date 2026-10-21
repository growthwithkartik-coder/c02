"use client";

import Link from "next/link";
import { Check, Eye, Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";
import { useStore } from "@/components/providers/StoreProvider";
import { useTryOn } from "@/components/tryon/TryOnProvider";
import { ProductImage } from "@/components/ui/ProductImage";
import { Badge, Price, Rating } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { cardTypeLabel, supportsTryOn } from "@/lib/taxonomy";
import { isCustomizable, sampleFor } from "@/lib/commerce";
import { isPricePending, PRICE_ON_REQUEST_LABEL, PRICE_ON_REQUEST_NOTE } from "@/lib/utils";

/* ------------------------------------------------------------------
   Product card. Every card has the same structure so grids align:
   square image frame (full product, never cropped) → type → name →
   one-line description → size / shades → price → Add to bag.
   The Add button is always visible (no hover-only purchase controls).
------------------------------------------------------------------- */
export function ProductCard({
  product,
  variant = "default",
  dark = false,
  priority,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className,
}: {
  product: Product;
  variant?: "default" | "editorial" | "compact";
  dark?: boolean;
  priority?: boolean;
  sizes?: string;
  showCompare?: boolean;
  className?: string;
}) {
  const { addToCart, toggleWishlist, inWishlist, setQuickView, toast } = useStore();
  const tryOn = useTryOn();
  const [added, setAdded] = useState(false);
  const wished = inWishlist(product.slug);
  const href = `/product/${product.slug}`;
  const hasSecond = product.images.length > 1;
  const compact = variant === "compact";
  const canTry = supportsTryOn(product) && !compact;
  const pending = isPricePending(product);

  function quickAdd() {
    if (product.custom || product.shades.length > 1) {
      setQuickView(product.slug);
      return;
    }
    addToCart(product.slug, 1, product.shades[0] ? { shade: product.shades[0].name } : undefined);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className={cn("group relative flex h-full flex-col", className)} data-product={product.slug}>
      <div className="relative">
        <Link href={href} className="block" aria-label={`${product.name} — view product`} data-cursor="View">
          <div className="relative aspect-square">
            <ProductImage product={product} sizes={sizes} priority={priority} className="absolute inset-0" />
            {hasSecond && (
              <ProductImage product={product} index={1} sizes={sizes} className="absolute inset-0 opacity-0 transition-opacity duration-500 md:group-hover:opacity-100" />
            )}
          </div>
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.custom ? <Badge>Made to order</Badge> : product.bestSeller ? <Badge tone="dark">Bestseller</Badge> : product.badge ? <Badge tone="gold">{product.badge}</Badge> : null}
          {!product.custom && !compact && isCustomizable(product) && <Badge className="bg-bone/80 text-gold-deep">Customizable</Badge>}
        </div>

        <button
          type="button"
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wished}
          onClick={() => {
            toggleWishlist(product.slug);
            if (!wished) toast({ title: "Saved to wishlist", body: product.name, image: product.images[0] ?? null, action: { label: "View", href: "/wishlist" } });
          }}
          className="absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-bone/90 text-ink shadow-sm transition-colors hover:bg-bone aria-pressed:bg-carbon aria-pressed:text-gold-light"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} strokeWidth={1.5} />
        </button>

        {!compact && (
          <button
            type="button"
            onClick={() => setQuickView(product.slug)}
            className="absolute bottom-2.5 right-2.5 hidden h-9 items-center gap-1.5 rounded-full bg-bone/90 px-3 text-xs text-ink shadow-sm transition-opacity hover:bg-bone md:inline-flex md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} /> Quick view
          </button>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "pt-3" : "pt-4")}>
        <p className={cn("text-[0.6875rem] uppercase tracking-[0.16em]", dark ? "text-bone/50" : "text-taupe")}>{cardTypeLabel(product)}</p>
        <h3 className={cn("mt-1.5 font-display leading-[1.08]", compact ? "text-lg" : variant === "editorial" ? "text-2xl md:text-[1.75rem]" : "text-[1.3rem] md:text-[1.4rem]")}>
          <Link href={href} className="hover:text-gold-deep">{product.name}</Link>
        </h3>
        {!compact && <p className={cn("mt-1.5 line-clamp-2 text-[0.8125rem] leading-snug", dark ? "text-bone/60" : "text-ink-soft")}>{product.shortDescription}</p>}

        <div className={cn("mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs", dark ? "text-bone/45" : "text-taupe")}>
          <span>{product.size.split("/")[0].trim()}</span>
          {!compact && sampleFor(product.slug) && <span className="inline-flex items-center gap-1">· Travel size {sampleFor(product.slug)!.size}</span>}
          {product.shades.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              {product.shades.map((s) => (
                <span key={s.name} title={s.name} className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: s.hex }} />
              ))}
              <span>{product.shades.map((s) => s.name).join(", ")}</span>
            </span>
          )}
          <Rating product={product} />
        </div>

        <div className="mt-auto pt-4">
          {pending ? (
            <p className={cn("text-[0.95rem] font-medium", dark ? "text-bone" : "text-ink")} data-price-pending>
              {PRICE_ON_REQUEST_LABEL}
              {!compact && <span className={cn("block text-xs font-normal", dark ? "text-bone/50" : "text-taupe")}>{PRICE_ON_REQUEST_NOTE}</span>}
            </p>
          ) : (
            <Price product={product} className={cn("block text-[0.95rem] font-medium", dark ? "text-bone" : "text-ink")} />
          )}
          <div className={cn("mt-3 flex gap-2", compact && "mt-2")}>
            {pending ? (
              <Link
                href={href}
                className={cn("btn btn-sm h-10 flex-1 px-3 text-[0.6875rem]", dark ? "btn-light" : "border border-ink bg-transparent text-ink hover:bg-ink hover:text-bone")}
                aria-label={`${product.name} — price on request, view details`}
              >
                {product.shades.length > 1 ? "See shades" : "View details"}
              </Link>
            ) : (
            <button
              type="button"
              onClick={quickAdd}
              className={cn("btn btn-sm h-10 flex-1 px-3 text-[0.6875rem]", dark ? "btn-light" : "border border-ink bg-transparent text-ink hover:bg-ink hover:text-bone")}
              aria-label={product.custom ? `Personalize ${product.name}` : `Add ${product.name} to bag`}
            >
              {added ? <><Check className="h-3.5 w-3.5" /> Added</> : product.custom ? "Personalize" : "Add to bag"}
            </button>
            )}
            {canTry && (
              <button
                type="button"
                onClick={() => tryOn.open(product.slug)}
                data-testid={`card-tryon-${product.slug}`}
                className="btn btn-sm btn-outline h-10 px-3 text-[0.6875rem]"
                aria-label={`Try ${product.name} on`}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> <span className="hidden xs:inline">Try on</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
