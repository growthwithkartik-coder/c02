"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useStore } from "./StoreProvider";

/* Lenis smooth scrolling (desktop, motion-allowed only). Paused while an
   overlay is open so the page underneath doesn't move. */
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

export function SmoothScroll() {
  const pathname = usePathname();
  const { cartOpen, searchOpen, menuOpen, quickView, compareOpen } = useStore();
  const locked = cartOpen || searchOpen || menuOpen || !!quickView || compareOpen;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), wheelMultiplier: 0.95 });
    lenisInstance = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    if (locked) {
      lenisInstance?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenisInstance?.start();
      document.documentElement.style.overflow = "";
    }
  }, [locked]);

  // reset scroll on route change
  useEffect(() => {
    if (window.location.hash) return;
    lenisInstance ? lenisInstance.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
