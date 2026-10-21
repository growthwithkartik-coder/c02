"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* Desktop cursor: a small dot + a ring that grows and labels itself over
   elements carrying data-cursor="View" (product imagery, sliders…). */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const [hoverLink, setHoverLink] = useState(false);
  const pathname = usePathname();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
    if (!ok) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? null);
      setHoverLink(!!t?.closest("a,button,[role=button],label,select"));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y]);

  useEffect(() => setLabel(null), [pathname]);

  if (!enabled) return null;
  const size = label ? 88 : hoverLink ? 44 : 30;
  return (
    <>
      <motion.div
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full ${label ? "" : "mix-blend-difference"}`}
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: size, height: size, scale: down ? 0.85 : 1, backgroundColor: label ? "rgba(244,239,231,1)" : "rgba(244,239,231,0)", borderWidth: label ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <span className="absolute inset-0 rounded-full border border-bone" style={{ opacity: label ? 0 : 0.8 }} />
        {label && <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-carbon">{label}</span>}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] h-1.5 w-1.5 rounded-full bg-bone mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%", opacity: label ? 0 : 1 }}
      />
    </>
  );
}
