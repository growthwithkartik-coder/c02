"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { Overlay } from "@/components/ui/Overlay";
import { ProductImage } from "@/components/ui/ProductImage";
import { getProducts, typeLabel } from "@/lib/catalog";
import { PRICE_ON_REQUEST_TEXT } from "@/lib/utils";

/* Compare up to three products side by side (enabled on the shop page). */
export function CompareTray() {
  const { compare, toggleCompare, clearCompare, setCompareOpen, compareOpen, addToCart } = useStore();
  const items = getProducts(compare);

  const rows: { label: string; get: (p: (typeof items)[number]) => React.ReactNode }[] = [
    { label: "Price", get: (p) => PRICE_ON_REQUEST_TEXT },
    { label: "Size", get: (p) => p.size },
    { label: "Type", get: (p) => typeLabel(p.type) },
    { label: "Texture", get: (p) => p.texture || "—" },
    { label: "Finish", get: (p) => p.finish || "—" },
    { label: "Suits", get: (p) => p.skinTypes.join(", ") || "—" },
    { label: "Key ingredients", get: (p) => p.ingredients.slice(0, 5).map((i) => i.name).join(", ") || "—" },
    { label: "What it does", get: (p) => p.benefits.map((b) => b.title).join(" · ") || "—" },
  ];

  return (
    <>
      <AnimatePresence>
        {items.length > 0 && !compareOpen && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bone/95 backdrop-blur-xl"
          >
            <div className="container-site flex items-center gap-4 py-3 pb-safe">
              <p className="eyebrow hidden text-taupe sm:block">Compare ({items.length}/3)</p>
              <ul className="flex flex-1 gap-2 overflow-x-auto no-scrollbar">
                {items.map((p) => (
                  <li key={p.slug} className="flex shrink-0 items-center gap-2 border border-line py-1 pl-1 pr-2">
                    <div className="relative h-10 w-10"><ProductImage product={p} sizes="40px" className="absolute inset-0" /></div>
                    <span className="max-w-[9rem] truncate text-sm">{p.name}</span>
                    <button onClick={() => toggleCompare(p.slug)} aria-label={`Remove ${p.name} from comparison`}><X className="h-3.5 w-3.5" /></button>
                  </li>
                ))}
              </ul>
              <button onClick={clearCompare} className="hidden text-xs uppercase tracking-[0.14em] text-taupe hover:text-ink sm:block">Clear</button>
              <button onClick={() => setCompareOpen(true)} disabled={items.length < 2} className="btn btn-primary btn-sm">Compare</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Overlay open={compareOpen} onClose={() => setCompareOpen(false)} label="Compare products" side="center">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <p className="font-display text-3xl">Compare</p>
          <button onClick={() => setCompareOpen(false)} aria-label="Close comparison" className="p-2"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-auto" data-lenis-prevent>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr>
                <th className="w-40 p-4" />
                {items.map((p) => (
                  <th key={p.slug} className="p-4 align-top font-normal">
                    <div className="relative aspect-square w-full max-w-[220px]"><ProductImage product={p} sizes="220px" className="absolute inset-0" /></div>
                    <Link href={`/product/${p.slug}`} className="mt-3 block font-display text-2xl leading-tight hover:text-gold" onClick={() => setCompareOpen(false)}>{p.name}</Link>
                    <button className="btn btn-primary btn-sm mt-3" onClick={() => addToCart(p.slug, 1, p.shades[0] ? { shade: p.shades[0].name } : undefined)} disabled={!!p.custom}>Add to bag</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-line">
                  <th scope="row" className="p-4 align-top text-2xs font-medium uppercase tracking-[0.16em] text-taupe">{r.label}</th>
                  {items.map((p) => (
                    <td key={p.slug} className="p-4 align-top leading-relaxed">{r.get(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Overlay>
    </>
  );
}
