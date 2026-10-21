import Image from "next/image";
import type { Product } from "@/types";
import { cn, productImage } from "@/lib/utils";

/* Renders a product's photograph, or — for made-to-order formulas, which
   have no photography — an elegant drawn vessel in the formula's colour.

   PRODUCT PHOTOGRAPHY IS NEVER CROPPED. The image is always fitted with
   object-fit: contain inside its frame, so the whole bottle, jar, box,
   cap and base stay visible at every size. The frame gives every tile
   the same dimensions; the photo keeps its own aspect ratio inside it.
   `pad` adds breathing room around the photograph (use it for small
   thumbnails and for non-square sources). Never add scale transforms
   to product photos — use opacity cross-fades for hover states. */
export function ProductImage({
  product,
  index = 0,
  sizes = "(max-width: 768px) 90vw, 33vw",
  className,
  imgClassName,
  priority,
  pad = false,
}: {
  product: Product;
  index?: number;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  pad?: boolean;
}) {
  const key = product.images[index] ?? product.images[0];
  if (!key) return <Vessel product={product} className={className} />;
  return (
    <div className={cn("photo", className)}>
      <Image
        src={productImage(key)}
        alt={`${product.name} — ${product.subtitle}${index ? ` (view ${index + 1})` : ""}`}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-contain object-center", pad && "p-[6%]", imgClassName)}
      />
    </div>
  );
}

export function Vessel({ product, className }: { product: Product; className?: string }) {
  const fill = product.custom?.fill ?? "#C9A47C";
  const kind = product.custom?.vessel ?? "pump";
  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ background: `radial-gradient(120% 90% at 50% 30%, #f7f2ea 0%, #e7ddcf 55%, #d8cab6 100%)` }}
      role="img"
      aria-label={`${product.name} — made to order`}
    >
      <svg viewBox="0 0 200 260" className="h-[72%] w-auto drop-shadow-[0_30px_30px_rgba(60,40,20,.22)]">
        <defs>
          <linearGradient id={`g-${product.slug}`} x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset=".35" stopColor="#fff" stopOpacity="0" />
            <stop offset=".8" stopColor="#000" stopOpacity=".08" />
            <stop offset="1" stopColor="#fff" stopOpacity=".25" />
          </linearGradient>
          <linearGradient id={`cap-${product.slug}`} x1="0" x2="1">
            <stop offset="0" stopColor="#8a6a34" />
            <stop offset=".45" stopColor="#e2c68c" />
            <stop offset="1" stopColor="#8a6a34" />
          </linearGradient>
        </defs>
        {kind === "compact" ? (
          <g>
            <ellipse cx="100" cy="190" rx="78" ry="22" fill="#000" opacity=".08" />
            <rect x="26" y="120" width="148" height="62" rx="31" fill={`url(#cap-${product.slug})`} />
            <ellipse cx="100" cy="122" rx="74" ry="22" fill={fill} />
            <ellipse cx="100" cy="122" rx="74" ry="22" fill={`url(#g-${product.slug})`} />
          </g>
        ) : kind === "lipstick" || kind === "bullet" ? (
          <g>
            <rect x="70" y="120" width="60" height="110" rx="6" fill={`url(#cap-${product.slug})`} />
            <path d="M76 120 V70 Q76 40 124 30 V120Z" fill={fill} />
            <path d="M76 120 V70 Q76 40 124 30 V120Z" fill={`url(#g-${product.slug})`} />
          </g>
        ) : (
          <g>
            {kind === "dropper" ? (
              <>
                <rect x="88" y="14" width="24" height="40" rx="12" fill="#1c1a17" />
                <rect x="80" y="50" width="40" height="22" rx="3" fill={`url(#cap-${product.slug})`} />
              </>
            ) : kind === "jar" ? (
              <rect x="40" y="92" width="120" height="30" rx="4" fill={`url(#cap-${product.slug})`} />
            ) : (
              <>
                <path d="M78 24 h44 a5 5 0 0 1 5 5 v7 h-54 v-7 a5 5 0 0 1 5 -5z" fill="#1c1a17" />
                <rect x="127" y="27" width="22" height="5" rx="2" fill="#1c1a17" />
                <rect x="94" y="36" width="12" height="14" fill="#2a2622" />
                <rect x="84" y="50" width="32" height="22" rx="3" fill={`url(#cap-${product.slug})`} />
              </>
            )}
            <rect x={kind === "jar" ? 34 : 52} y={kind === "jar" ? 120 : 72} width={kind === "jar" ? 132 : 96} height={kind === "jar" ? 96 : 168} rx={kind === "jar" ? 18 : 22} fill={fill} opacity=".92" />
            <rect x={kind === "jar" ? 34 : 52} y={kind === "jar" ? 120 : 72} width={kind === "jar" ? 132 : 96} height={kind === "jar" ? 96 : 168} rx={kind === "jar" ? 18 : 22} fill={`url(#g-${product.slug})`} />
            <text x="100" y={kind === "jar" ? 172 : 160} textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="22" fill="#fff" opacity=".9">
              CO2
            </text>
            <text x="100" y={kind === "jar" ? 190 : 180} textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="7" letterSpacing="2" fill="#fff" opacity=".85">
              YOUR FORMULA
            </text>
          </g>
        )}
      </svg>
      <span className="absolute left-4 top-4 eyebrow text-ink-soft">Made to order</span>
    </div>
  );
}
