"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* Accessible overlay shell: Esc to close, focus moves inside and returns
   to the trigger on close, Tab is trapped within. */
export function Overlay({
  open,
  onClose,
  label,
  side = "right",
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: "right" | "center" | "top";
  children: React.ReactNode;
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const t = window.setTimeout(() => {
      const el = panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? panel.current?.querySelector<HTMLElement>("button, a, input");
      el?.focus();
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const variants =
    side === "right"
      ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
      : side === "top"
        ? { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } }
        : { initial: { opacity: 0, y: 40, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 30, scale: 0.98 } };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" data-lenis-prevent>
          <motion.div
            className="absolute inset-0 bg-carbon/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            {...variants}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute flex flex-col overflow-hidden",
              side === "right" && "inset-y-0 right-0 w-full max-w-[480px] bg-bone",
              side === "top" && "inset-x-0 top-0 max-h-[100dvh] bg-bone",
              side === "center" && "inset-0 m-auto h-fit max-h-[92dvh] w-[min(1100px,94vw)] bg-bone",
              className,
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
