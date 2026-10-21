"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { Logo } from "@/components/ui/Logo";
import { departments } from "@/data/taxonomy";
import { concernsForDepartment } from "@/lib/taxonomy";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const more = [
  { label: "Combos", href: "/combos" },
  { label: "Sampling Studio", href: "/sampling" },
  { label: "Bestsellers", href: "/shop/bestsellers" },
  { label: "Customize Your Product", href: "/customization" },
  { label: "Ingredient Guide", href: "/ingredients" },
  { label: "Our Story", href: "/about" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/* Compact mobile navigation: a left drawer with one expandable row per
   department (types + concerns inside), then secondary links. */
export function MobileMenu() {
  const { menuOpen, setMenuOpen, setSearchOpen } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  return (
    <AnimatePresence>
      {menuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" data-lenis-prevent>
          <motion.div className="absolute inset-0 bg-carbon/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 left-0 flex w-[88vw] max-w-sm flex-col bg-bone text-ink"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <Link href="/" aria-label="CO2 — home"><Logo size={30} /></Link>
              <button onClick={() => setMenuOpen(false)} className="-mr-2 grid h-11 w-11 place-items-center" aria-label="Close menu">
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 pb-safe" aria-label="Mobile">
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                className="mt-4 flex h-11 w-full items-center gap-2 rounded-full border border-line px-4 text-sm text-ink-soft"
              >
                <Search className="h-4 w-4" strokeWidth={1.4} /> Search products
              </button>

              <ul className="mt-4 divide-y divide-line border-y border-line">
                <li><Link href="/" className="flex h-14 items-center text-[0.9375rem] font-medium">Home</Link></li>
                <li><Link href="/shop" className="flex h-14 items-center text-[0.9375rem] font-medium">Shop All</Link></li>
                <li><Link href="/services" className="flex h-14 items-center justify-between text-[0.9375rem] font-medium">Services <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-gold-deep">Packaging · Compliance · Export</span></Link></li>
                {departments.map((d) => {
                  const concerns = concernsForDepartment(d.id);
                  const expanded = open === d.id;
                  return (
                    <li key={d.id}>
                      <div className="flex h-14 items-center justify-between">
                        <Link href={`/shop/${d.id}`} className="flex-1 text-[0.9375rem] font-medium">{d.label}</Link>
                        <button type="button" onClick={() => setOpen(expanded ? null : d.id)} aria-expanded={expanded} aria-label={`${d.label} sections`} className="-mr-2 grid h-11 w-11 place-items-center">
                          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
                        </button>
                      </div>
                      {expanded && (
                        <div className="grid grid-cols-2 gap-x-4 pb-5 text-sm">
                          <ul className="space-y-2.5">
                            <li className="eyebrow text-taupe">Type</li>
                            {d.sections.map((s) => (
                              <li key={s.id}><Link href={`/shop/${d.id}?${s.area ? `area=${s.area}` : `format=${s.formats!.join(",")}`}`} className="text-ink-soft">{s.label}</Link></li>
                            ))}
                          </ul>
                          {concerns.length > 0 && (
                            <ul className="space-y-2.5">
                              <li className="eyebrow text-taupe">Concern</li>
                              {concerns.map((c) => (
                                <li key={c.id}><Link href={`/shop/${d.id}?concern=${c.id}`} className="text-ink-soft">{c.label}</Link></li>
                              ))}
                            </ul>
                          )}
                          {d.id === "lips" && (
                            <ul className="space-y-2.5">
                              <li className="eyebrow text-taupe">Try on</li>
                              <li><Link href="/shop/lips#try-on" className="text-ink-soft">Virtual lip try-on</Link></li>
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <Link href="/make-it-yours" className="mt-5 flex items-center justify-between gap-3 bg-carbon p-4 text-bone">
                <span>
                  <span className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-gold-light"><span className="h-1.5 w-1.5 rounded-full bg-gold-light" aria-hidden />Make It Yours</span>
                  <span className="mt-1 block font-display text-xl leading-tight">Your routine first. Then products made for you.</span>
                </span>
                <span aria-hidden className="text-xl text-gold-light">›</span>
              </Link>

              <ul className="mt-5 grid grid-cols-2 gap-y-3 text-sm text-ink-soft">
                {more.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
              </ul>

              <div className="mt-6 flex gap-2 border-t border-line pt-5 text-sm">
                <Link href="/account" className="chip"><User className="h-3.5 w-3.5" /> Account</Link>
                <Link href="/wishlist" className="chip"><Heart className="h-3.5 w-3.5" /> Wishlist</Link>
              </div>
              <p className="py-6 text-xs text-taupe">{site.name} — {site.tagline}</p>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
