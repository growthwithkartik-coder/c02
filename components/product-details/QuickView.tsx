"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { Overlay } from "@/components/ui/Overlay";
import { ProductImage } from "@/components/ui/ProductImage";
import { Rating } from "@/components/ui/primitives";
import { DetailSizePrice } from "@/components/ui/SizePrice";
import { ProductPurchase } from "./ProductPurchase";
import { getProduct, typeLabel } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function QuickView() {
  const { quickView, setQuickView } = useStore();
  const product = quickView ? getProduct(quickView) : null;
  const [idx, setIdx] = useState(0);
  const close = () => {
    setQuickView(null);
    setIdx(0);
  };

  return (
    <Overlay open={!!product} onClose={close} label={product ? `Quick view: ${product.name}` : "Quick view"} side="center">
      {product && (
        <div className="grid max-h-[92dvh] overflow-y-auto md:grid-cols-2" data-lenis-prevent>
          <div className="relative bg-stone">
            <div className="relative aspect-square">
              <ProductImage product={product} index={idx} sizes="(max-width:768px) 94vw, 550px" className="absolute inset-0" priority />
            </div>
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {product.images.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} aria-label={`View image ${i + 1}`} aria-pressed={idx === i} className={cn("h-14 w-14 overflow-hidden ring-1 ring-bone/60 transition", idx === i ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100")}>
                    <ProductImage product={product} index={i} sizes="64px" className="h-full w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col p-6 md:p-10">
            <div className="flex items-start justify-between gap-4">
              <p className="eyebrow text-taupe">{typeLabel(product.type)}</p>
              <button onClick={close} aria-label="Close quick view" className="-mr-2 -mt-2 p-2 hover:text-gold">
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
            <h2 className="mt-2 font-display text-4xl leading-[0.98] md:text-5xl">{product.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">{product.subtitle}</p>
            <DetailSizePrice product={product} className="mt-4" />
            {product.rating && product.reviewCount ? <div className="mt-3 flex items-center gap-4"><Rating product={product} /></div> : null}
            <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-soft">{product.description}</p>
            {product.benefits.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {product.benefits.map((b) => (
                  <li key={b.title} className="chip pointer-events-none">{b.title}</li>
                ))}
              </ul>
            )}
            <div className="mt-8">
              <ProductPurchase product={product} compact onAdded={close} />
            </div>
            <Link href={`/product/${product.slug}`} onClick={close} className="link-underline mt-6 self-start text-xs font-medium uppercase tracking-[0.16em]">
              Full details, ingredients & how to use →
            </Link>
          </div>
        </div>
      )}
    </Overlay>
  );
}
