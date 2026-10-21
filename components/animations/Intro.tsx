"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

/* One-time opening curtain per browser session. */
export function Intro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("co2.intro") === "1";
      sessionStorage.setItem("co2.intro", "1");
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 1700);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-6 bg-carbon text-gold"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <motion.div initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <Logo size={110} priority />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
