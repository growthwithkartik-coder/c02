"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { PRICES_ON_REQUEST } from "@/lib/utils";
import { getProduct } from "@/lib/catalog";

export function HeroAddButton({ slug, name }: { slug: string; name: string }) {
  const { addToCart } = useStore();
  const [done, setDone] = useState(false);
  if (PRICES_ON_REQUEST) {
    const p = getProduct(slug);
    return (
      <Link href={p ? `/product/${p.slug}` : "/shop"} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-bone transition-colors hover:bg-gold hover:text-carbon" aria-label={`${name} — view product, price on request`}>
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        addToCart(slug);
        setDone(true);
        window.setTimeout(() => setDone(false), 1600);
      }}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-bone transition-colors hover:bg-gold hover:text-carbon"
      aria-label={`Add ${name} to bag`}
    >
      {done ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
