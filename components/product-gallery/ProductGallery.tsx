"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, X } from "lucide-react";
import { useEffect, useState } from "react";
import { onShade } from "@/lib/shade-events";
import type { Product } from "@/types";
import { Vessel } from "@/components/ui/ProductImage";
import { Overlay } from "@/components/ui/Overlay";
import { cn, cutoutImage, productImage } from "@/lib/utils";

/* Large gallery with hover-zoom (desktop), thumbnails, and a full-screen
   lightbox. Adds the studio cut-out as an extra view when one exists. */
export function ProductGallery({ product }: { product: Product }) {
  const views: { src: string; alt: string; kind: "photo" | "cutout" }[] = [
    ...product.images.map((k, i) => ({ src: productImage(k), alt: `${product.name} — view ${i + 1}`, kind: "photo" as const })),
    ...(product.cutout ? [{ src: cutoutImage(product.cutout), alt: `${product.name} — studio view`, kind: "cutout" as const }] : []),
  ];
  const [idx, setIdx] = useState(0);
  // magnifier is opt-in (click to zoom, click again or leave to reset) so the
  // default view always shows the complete, uncropped product
  const [zoomOn, setZoomOn] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);

  // multi-shade products: show the photograph of the shade picked in the purchase panel
  useEffect(
    () =>
      onShade(product.slug, ({ image }) => {
        const i = image ? product.images.indexOf(image) : -1;
        if (i >= 0) {
          setZoomOn(false);
          setIdx(i);
        }
      }),
    [product],
  );

  if (!views.length) return <Vessel product={product} className="aspect-square w-full" />;
  const v = views[idx];

  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 lg:flex-row">
      {views.length > 1 && (
        <ul className="-m-1 flex gap-3 overflow-x-auto p-1 lg:m-0 lg:flex-col lg:overflow-visible lg:p-0" aria-label="Product images">
          {views.map((x, i) => (
            <li key={x.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === idx}
                className={cn("relative block h-20 w-20 overflow-hidden transition md:h-24 md:w-24", x.kind === "cutout" ? "bg-stone-2/60" : "bg-stone", i === idx ? "ring-1 ring-ink ring-offset-2 ring-offset-bone" : "opacity-60 hover:opacity-100")}
              >
                <Image src={x.src} alt="" fill sizes="96px" className={x.kind === "cutout" ? "object-contain p-2" : "object-contain"} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        data-testid="gallery-stage"
        data-image={v.src}
        className={cn("relative aspect-square flex-1 overflow-hidden", zoomOn ? "cursor-zoom-out" : "cursor-zoom-in", v.kind === "cutout" ? "bg-[radial-gradient(80%_70%_at_50%_45%,#F7F1E7,#E3D9CA)]" : "bg-bone-2")}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          setZoomOn((z) => !z);
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !zoomOn) return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => { setZoom(null); setZoomOn(false); }}
        data-cursor={zoomOn ? "Close" : "Zoom"}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={v.src} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <Image
              src={v.src}
              alt={v.alt}
              fill
              priority={idx === 0}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={cn("transition-transform duration-300 ease-out", v.kind === "cutout" ? "object-contain p-[8%]" : "object-contain")}
              style={zoomOn && zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          </motion.div>
        </AnimatePresence>
        <button type="button" onClick={() => setLightbox(true)} className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-bone/85 backdrop-blur hover:bg-bone" aria-label="Open full-screen image">
          <Expand className="h-4 w-4" strokeWidth={1.5} />
        </button>
        {views.length > 1 && (
          <p className="absolute bottom-5 left-5 text-xs tabular-nums text-ink/70">
            {String(idx + 1).padStart(2, "0")} / {String(views.length).padStart(2, "0")}
          </p>
        )}
      </div>

      <Overlay open={lightbox} onClose={() => setLightbox(false)} label={`${product.name} images`} side="center" className="h-[92dvh] bg-carbon">
        <button onClick={() => setLightbox(false)} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-bone/90" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <div className="relative flex-1">
          <Image src={v.src} alt={v.alt} fill sizes="94vw" className="object-contain" />
        </div>
        {views.length > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {views.map((x, i) => (
              <button key={x.src} onClick={() => setIdx(i)} aria-label={`Image ${i + 1}`} className={cn("h-2 w-8 rounded-full", i === idx ? "bg-bone" : "bg-bone/30")} />
            ))}
          </div>
        )}
      </Overlay>
    </div>
  );
}
