"use client";

import { useStore } from "@/components/providers/StoreProvider";
import { getProduct } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function AddCollectionButton({ slugs, label, dark }: { slugs: string[]; label: string; dark?: boolean }) {
  const { addToCart, setCartOpen } = useStore();
  return (
    <button
      className={cn("btn btn-lg", dark ? "btn-gold" : "btn-primary")}
      onClick={() => {
        slugs.forEach((s) => {
          const p = getProduct(s);
          addToCart(s, 1, p?.shades[0] ? { shade: p.shades[0].name } : undefined, { silent: true });
        });
        setCartOpen(true);
      }}
    >
      {label}
    </button>
  );
}
