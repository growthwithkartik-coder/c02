"use client";

import { useEffect, useSyncExternalStore } from "react";

/* Pages with a dark, full-bleed opening render <NavTheme tone="dark" />
   so the transparent navbar uses light text until the user scrolls. */
let tone: "light" | "dark" = "light";
const listeners = new Set<() => void>();

function setTone(t: "light" | "dark") {
  tone = t;
  listeners.forEach((l) => l());
}

export function useNavTone() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => tone,
    () => "light" as const,
  );
}

export function NavTheme({ tone: t }: { tone: "light" | "dark" }) {
  useEffect(() => {
    setTone(t);
    return () => setTone("light");
  }, [t]);
  return null;
}
