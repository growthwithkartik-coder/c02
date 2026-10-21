"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartLine, OrderItem, CartTotals } from "@/types";
import { computeTotals, lineKey, maxQtyFor, validateDiscount } from "@/lib/cart";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import { getProduct } from "@/lib/catalog";
import { isPricePending } from "@/lib/utils";

/* ------------------------------------------------------------------
   Global client store: cart, wishlist, compare and UI overlays.
   Cart + wishlist persist to localStorage.
------------------------------------------------------------------- */

type Toast = { id: number; title: string; body?: string; image?: string | null; action?: { label: string; href?: string; onClick?: () => void } };

interface StoreValue {
  ready: boolean;
  // cart
  lines: CartLine[];
  totals: CartTotals & { items: OrderItem[] };
  addToCart: (slug: string, qty?: number, variant?: { shade?: string; options?: Record<string, string>; size?: "full" | "sample"; bundle?: string }, opts?: { silent?: boolean }) => void;
  /** add several lines at once (combos, sample sets) and open the bag once */
  addMany: (items: { slug: string; qty?: number; shade?: string; options?: Record<string, string>; size?: "full" | "sample"; bundle?: string }[]) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  discountCode: string | null;
  applyCode: (code: string) => boolean;
  removeCode: () => void;
  // wishlist
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  inWishlist: (slug: string) => boolean;
  // compare
  compare: string[];
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  // ui
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  quickView: string | null;
  setQuickView: (slug: string | null) => void;
  compareOpen: boolean;
  setCompareOpen: (v: boolean) => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickView, setQuickView] = useState<string | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  // hydrate from storage
  useEffect(() => {
    setLines(readJSON<CartLine[]>(STORAGE_KEYS.cart, []));
    setDiscountCode(readJSON<string | null>(STORAGE_KEYS.code, null));
    setWishlist(readJSON<string[]>(STORAGE_KEYS.wishlist, []));
    setCompare(readJSON<string[]>(STORAGE_KEYS.compare, []));
    setReady(true);
  }, []);

  useEffect(() => { if (ready) writeJSON(STORAGE_KEYS.cart, lines); }, [lines, ready]);
  useEffect(() => { if (ready) writeJSON(STORAGE_KEYS.code, discountCode); }, [discountCode, ready]);
  useEffect(() => { if (ready) writeJSON(STORAGE_KEYS.wishlist, wishlist); }, [wishlist, ready]);
  useEffect(() => { if (ready) writeJSON(STORAGE_KEYS.compare, compare); }, [compare, ready]);

  // sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.cart) setLines(readJSON(STORAGE_KEYS.cart, []));
      if (e.key === STORAGE_KEYS.wishlist) setWishlist(readJSON(STORAGE_KEYS.wishlist, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const totals = useMemo(() => computeTotals(lines, discountCode), [lines, discountCode]);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = ++toastId.current;
      setToasts((list) => [...list.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast],
  );

  const addToCart: StoreValue["addToCart"] = useCallback((slug, qty = 1, variant, opts) => {
    if (isPricePending(getProduct(slug))) return; // shown in the catalogue, not orderable until priced
    const key = lineKey(slug, variant?.shade, variant?.options, variant?.size);
    setLines((cur) => {
      const found = cur.find((l) => l.key === key);
      const max = maxQtyFor(variant?.size);
      if (found) return cur.map((l) => (l.key === key ? { ...l, qty: Math.min(max, l.qty + qty) } : l));
      return [...cur, { key, slug, qty: Math.min(max, qty), shade: variant?.shade, options: variant?.options, size: variant?.size === "sample" ? "sample" : undefined, bundle: variant?.bundle }];
    });
    if (!opts?.silent) setCartOpen(true);
  }, []);

  const addMany: StoreValue["addMany"] = useCallback((items) => {
    setLines((cur) => {
      let next = [...cur];
      for (const it of items) {
        if (isPricePending(getProduct(it.slug))) continue;
        const qty = it.qty ?? 1;
        const key = lineKey(it.slug, it.shade, it.options, it.size);
        const found = next.find((l) => l.key === key);
        const max = maxQtyFor(it.size);
        next = found
          ? next.map((l) => (l.key === key ? { ...l, qty: Math.min(max, l.qty + qty), bundle: l.bundle ?? it.bundle } : l))
          : [...next, { key, slug: it.slug, qty: Math.min(max, qty), shade: it.shade, options: it.options, size: it.size === "sample" ? "sample" : undefined, bundle: it.bundle }];
      }
      return next;
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((cur) =>
      qty <= 0 ? cur.filter((l) => l.key !== key) : cur.map((l) => (l.key === key ? { ...l, qty: Math.min(maxQtyFor(l.size), qty) } : l)),
    );
  }, []);

  const removeLine = useCallback((key: string) => setLines((cur) => cur.filter((l) => l.key !== key)), []);
  const clearCart = useCallback(() => {
    setLines([]);
    setDiscountCode(null);
  }, []);

  const applyCode = useCallback((code: string) => {
    const rule = validateDiscount(code);
    if (!rule) return false;
    setDiscountCode(rule.code);
    return true;
  }, []);
  const removeCode = useCallback(() => setDiscountCode(null), []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug]));
  }, []);
  const inWishlist = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const toggleCompare = useCallback((slug: string) => {
    setCompare((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : c.length >= 3 ? [...c.slice(1), slug] : [...c, slug]));
  }, []);
  const clearCompare = useCallback(() => setCompare([]), []);

  const value: StoreValue = {
    ready,
    lines,
    totals,
    addToCart,
    addMany,
    setQty,
    removeLine,
    clearCart,
    discountCode,
    applyCode,
    removeCode,
    wishlist,
    toggleWishlist,
    inWishlist,
    compare,
    toggleCompare,
    clearCompare,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
    quickView,
    setQuickView,
    compareOpen,
    setCompareOpen,
    toasts,
    toast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
