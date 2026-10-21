"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import { getTryOnShades } from "@/lib/taxonomy";

/* Global entry point for the virtual lip try-on. Any "Try It On" button
   calls open(shadeOrProductId). The chosen shade is remembered (on this
   device only) so closing and reopening keeps the customer's choice. */

const TryOnModal = dynamic(() => import("./TryOnModal").then((m) => m.TryOnModal), { ssr: false });

interface TryOnValue {
  isOpen: boolean;
  shadeId: string;
  setShadeId: (id: string) => void;
  open: (shadeId?: string) => void;
  close: () => void;
}

const Ctx = createContext<TryOnValue | null>(null);
const shades = getTryOnShades();

export function TryOnProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [shadeId, setShade] = useState(shades[0].id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = readJSON<string | null>(STORAGE_KEYS.tryOnShade, null);
    if (saved && shades.some((s) => s.id === saved)) setShade(saved);
  }, []);

  const setShadeId = useCallback((id: string) => {
    if (!shades.some((s) => s.id === id)) return;
    setShade(id);
    writeJSON(STORAGE_KEYS.tryOnShade, id);
  }, []);

  const open = useCallback(
    (id?: string) => {
      if (id) {
        // accept a shade id, or a product slug ("custom-lip" opens its first colour family)
        const match = shades.find((s) => s.id === id) ?? shades.find((s) => s.slug === id);
        if (match) setShadeId(match.id);
      }
      setMounted(true);
      setOpen(true);
    },
    [setShadeId],
  );
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ isOpen, shadeId, setShadeId, open, close }), [isOpen, shadeId, setShadeId, open, close]);
  return (
    <Ctx.Provider value={value}>
      {children}
      {mounted && <TryOnModal />}
    </Ctx.Provider>
  );
}

export function useTryOn() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTryOn must be used inside <TryOnProvider>");
  return v;
}
