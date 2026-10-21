"use client";

import Link from "next/link";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductCard } from "@/components/product-card/ProductCard";
import { getProducts } from "@/lib/catalog";

export function WishlistView() {
  const { wishlist, ready, addToCart, setCartOpen } = useStore();
  const items = getProducts(wishlist);
  const buyable = items.filter((p) => !p.custom);
  return (
    <div className="container-site pb-section pt-[calc(var(--nav-h)+3rem)]">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
        <div>
          <p className="eyebrow text-taupe">Saved on this device</p>
          <h1 className="mt-3 font-display text-display-md">Wishlist</h1>
        </div>
        {buyable.length > 1 && (
          <button
            className="btn btn-primary"
            onClick={() => {
              buyable.forEach((p) => addToCart(p.slug, 1, p.shades[0] ? { shade: p.shades[0].name } : undefined, { silent: true }));
              setCartOpen(true);
            }}
          >
            Add all to bag
          </button>
        )}
      </div>
      {!ready ? null : items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-4xl">Nothing saved yet.</p>
          <p className="mt-3 text-ink-soft">Tap the heart on any product to keep it here.</p>
          <Link href="/shop" className="btn btn-primary btn-lg mt-8">Browse the shop</Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {items.map((p) => <ProductCard key={p.slug} product={p} sizes="(max-width:768px) 50vw, 25vw" />)}
        </div>
      )}
    </div>
  );
}
