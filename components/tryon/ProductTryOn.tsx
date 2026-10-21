"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { TryOnButton } from "./TryOnButton";
import { onShade } from "@/lib/shade-events";
import { shadeIdFor } from "@/lib/taxonomy";

/* Product-page try-on prompt. For multi-shade products it follows the shade
   picked in the purchase panel, so "Try it on" opens on that exact shade. */
export function ProductTryOn({ product }: { product: Product }) {
  const [shade, setShade] = useState(product.shades[0]?.name);
  useEffect(() => onShade(product.slug, (d) => setShade(d.shade)), [product.slug]);
  const label = product.shades.length > 1 && shade ? `Try ${shade} on` : "Try It On";
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4 border border-line bg-bone-2/60 p-4">
      <TryOnButton shade={product.custom ? product.slug : shadeIdFor(product, shade)} variant="gold" label={label} />
      <p className="min-w-[12rem] flex-1 text-sm text-ink-soft">
        See {product.shades.length > 1 ? `all ${product.shades.length} shades` : (shade ?? "the colour families")} on your own lips — live camera or a photo. Processed on your device only.
      </p>
    </div>
  );
}
