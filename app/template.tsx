"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Page transition: every route fades up gently on entry. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
