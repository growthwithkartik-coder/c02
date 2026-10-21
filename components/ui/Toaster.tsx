"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { productImage } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[90] flex w-[min(420px,92vw)] -translate-x-1/2 flex-col gap-2 md:left-auto md:right-6 md:translate-x-0" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center gap-3 bg-carbon p-3 pr-4 text-bone shadow-2xl"
          >
            {t.image && <Image src={productImage(t.image, 640)} alt="" width={48} height={48} className="h-12 w-12 object-contain" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t.title}</p>
              {t.body && <p className="truncate text-xs text-bone/60">{t.body}</p>}
            </div>
            {t.action &&
              (t.action.href ? (
                <Link href={t.action.href} className="text-xs uppercase tracking-[0.16em] text-gold-light hover:underline" onClick={() => dismissToast(t.id)}>
                  {t.action.label}
                </Link>
              ) : (
                <button onClick={t.action.onClick} className="text-xs uppercase tracking-[0.16em] text-gold-light">{t.action.label}</button>
              ))}
            <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-bone/50 hover:text-bone">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
