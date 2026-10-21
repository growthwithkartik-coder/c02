"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, ChevronDown, Heart, Menu, Search, ShoppingBag, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { Logo } from "@/components/ui/Logo";
import { announcements, nav, type NavItem } from "@/data/site";
import { combos, comboGroups } from "@/data/combos";
import { flows } from "@/lib/customize/flows";
import { departments, type DepartmentId } from "@/data/taxonomy";
import { concernsForDepartment, productsInDepartment } from "@/lib/taxonomy";
import { cn, productImage } from "@/lib/utils";
import { useNavTone } from "./nav-theme";

type MegaId = DepartmentId | "shop" | "combos" | "miy";
const megaOf = (n: NavItem): MegaId | null => n.dept ?? n.mega ?? null;

export function Navbar() {
  const pathname = usePathname();
  const { totals, wishlist, setCartOpen, setSearchOpen, setMenuOpen, ready } = useStore();
  const tone = useNavTone();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mega, setMega] = useState<MegaId | null>(null);
  const closeTimer = useRef<number>(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev + 4 && !mega);
    if (y < prev - 4) setHidden(false);
  });

  useEffect(() => setMega(null), [pathname]);
  useEffect(() => {
    document.documentElement.dataset.navHidden = String(hidden);
  }, [hidden]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const solid = scrolled || !!mega;
  const light = tone === "dark" && !solid;
  const openMega = (d: MegaId | null) => {
    window.clearTimeout(closeTimer.current);
    setMega(d);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(null), 140);
  };

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setMega(null);
      }}
    >
      <AnnouncementBar />
      <div
        className={cn(
          "relative transition-[background-color,color,border-color] duration-300",
          solid ? "border-b border-line bg-bone text-ink shadow-[0_1px_0_rgba(0,0,0,.02)]" : "border-b border-transparent",
          light ? "text-bone" : "text-ink",
        )}
      >
        <nav className="container-site flex h-[var(--nav-row)] items-center justify-between gap-4" aria-label="Primary">
          <div className="flex flex-1 items-center gap-6 lg:flex-none">
            <button className="-ml-2 p-2 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" strokeWidth={1.4} />
            </button>
            <Link href="/" className="hidden items-center lg:flex" aria-label="CO2 — home">
              <Logo size={36} priority />
            </Link>
          </div>

          <ul className="hidden flex-1 items-center justify-center gap-4 lg:flex xl:gap-5 2xl:gap-7">
            {nav.map((n) => {
              const id = megaOf(n);
              const active = n.href === "/" ? pathname === "/" : pathname === n.href || pathname.startsWith(n.href + "/") || (n.href === "/shop" && pathname === "/shop");
              if (n.highlight) {
                return (
                  <li key={n.href} className="relative" onMouseEnter={() => openMega(id)}>
                    <Link
                      href={n.href}
                      aria-current={active ? "page" : undefined}
                      onFocus={() => openMega(id)}
                      className={cn(
                        "inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
                        light ? "bg-gold-light text-carbon hover:bg-bone" : "bg-ink text-bone hover:bg-gold hover:text-carbon",
                        active && "ring-1 ring-gold ring-offset-2 ring-offset-transparent",
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                      {n.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={n.href} className={cn("relative flex items-center", n.wide && "hidden xl:flex")} onMouseEnter={() => openMega(id)}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    onFocus={() => id && openMega(id)}
                    className={cn("link-underline whitespace-nowrap py-2 text-[0.75rem] uppercase tracking-[0.13em]", (active || (id && mega === id)) && "bg-[length:100%_1px]")}
                  >
                    {n.label}
                  </Link>
                  {id && (
                    <button
                      type="button"
                      className="ml-0.5 grid h-6 w-4 place-items-center opacity-60 hover:opacity-100"
                      aria-label={`${n.label} menu`}
                      aria-expanded={mega === id}
                      onClick={() => setMega((m) => (m === id ? null : id))}
                    >
                      <ChevronDown className={cn("h-3 w-3 transition-transform", mega === id && "rotate-180")} strokeWidth={1.6} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <Link href="/" className="flex items-center lg:hidden" aria-label="CO2 — home">
            <Logo size={32} priority />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1 lg:flex-none">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn("hidden h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors 2xl:inline-flex", light ? "border-bone/30 text-bone/80 hover:border-bone" : "border-line text-ink-soft hover:border-ink")}
              aria-label="Search products"
            >
              <Search className="h-4 w-4" strokeWidth={1.4} /> <span className="w-36 text-left">Search products…</span>
            </button>
            <IconBtn label="Search" onClick={() => setSearchOpen(true)} className="2xl:hidden">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
            </IconBtn>
            <IconBtn label="Account" href="/account" className="hidden sm:grid">
              <User className="h-[18px] w-[18px]" strokeWidth={1.4} />
            </IconBtn>
            <IconBtn label={`Wishlist (${ready ? wishlist.length : 0})`} href="/wishlist" className="hidden sm:grid" count={ready ? wishlist.length : 0}>
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.4} />
            </IconBtn>
            <IconBtn label={`Bag (${ready ? totals.itemCount : 0} items)`} onClick={() => setCartOpen(true)} count={ready ? totals.itemCount : 0}>
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
            </IconBtn>
          </div>
        </nav>

        <AnimatePresence>
          {mega && (
            <motion.div
              key={mega}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-x-0 top-full hidden border-y border-line bg-bone text-ink shadow-[0_24px_40px_-24px_rgba(17,16,13,.25)] lg:block"
              onMouseEnter={() => openMega(mega)}
            >
              {mega === "shop" ? <ShopPanel /> : mega === "combos" ? <CombosPanel /> : mega === "miy" ? <MiyPanel /> : <MegaPanel id={mega} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

function MegaPanel({ id }: { id: DepartmentId }) {
  const d = departments.find((x) => x.id === id)!;
  const concerns = concernsForDepartment(id);
  const count = productsInDepartment(id).length;
  return (
    <div className="container-site grid grid-cols-12 gap-8 py-9">
      <div className="col-span-3">
        <p className="eyebrow text-taupe">{d.title}</p>
        <Link href={`/shop/${d.id}`} className="mt-3 block font-display text-4xl leading-none hover:text-gold-deep">
          All {d.label.toLowerCase()}
        </Link>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{count} products. {d.description.split(".")[0]}.</p>
        <ul className="mt-5 space-y-2 text-sm">
          <li><Link href={`/make-it-yours/${id === "skin" ? "face" : id}`} className="inline-flex items-center gap-2 underline underline-offset-4"><Sparkles className="h-3.5 w-3.5 text-gold-deep" /> {id === "skin" ? "Skin" : d.label} consultation</Link></li>
          {(id === "skin" || id === "hair" || id === "body") && <li><Link href={`/sampling?cat=${id}`} className="underline underline-offset-4">Travel sizes & samples</Link></li>}
          {id === "lips" && <li><Link href="/shop/lips#try-on" className="underline underline-offset-4">Try shades on your face →</Link></li>}
        </ul>
      </div>
      <div className="col-span-3">
        <p className="eyebrow text-taupe">Product type</p>
        <ul className="mt-4 space-y-2.5">
          {d.sections.map((s) => (
            <li key={s.id}>
              <Link href={`/shop/${d.id}?${s.area ? `area=${s.area}` : `format=${s.formats!.join(",")}`}`} className="link-underline text-[0.9375rem] text-ink-soft hover:text-ink">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-3">
        {concerns.length > 0 ? (
          <>
            <p className="eyebrow text-taupe">Shop by concern</p>
            <ul className="mt-4 space-y-2.5">
              {concerns.map((c) => (
                <li key={c.id}>
                  <Link href={`/shop/${d.id}?concern=${c.id}`} className="link-underline text-[0.9375rem] text-ink-soft hover:text-ink">{c.label}</Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="eyebrow text-taupe">Shades</p>
            <ul className="mt-4 space-y-2.5">
              {productsInDepartment(id).filter((p) => p.shades.length).map((p) => (
                <li key={p.slug}>
                  <Link href={`/product/${p.slug}`} className="flex items-center gap-2.5 text-[0.9375rem] text-ink-soft hover:text-ink">
                    <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: p.shades[0].hex }} aria-hidden /> {p.shades[0].name}
                  </Link>
                </li>
              ))}
              <li><Link href="/customization" className="text-[0.9375rem] text-ink-soft hover:text-ink">Your own shade — customization</Link></li>
            </ul>
          </>
        )}
      </div>
      <Link href={`/shop/${d.id}`} className="group col-span-3 block">
        <div className="relative aspect-[4/3] bg-bone-2">
          <Image src={productImage(d.image, 640)} alt="" fill sizes="320px" className="object-contain" />
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-ink-soft group-hover:text-ink">Shop {d.label.toLowerCase()} →</p>
      </Link>
    </div>
  );
}

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % announcements.length), 4200);
    return () => window.clearInterval(t);
  }, [paused]);
  return (
    <div
      className="relative flex h-[var(--bar-h)] items-center justify-center overflow-hidden bg-carbon px-4 text-center text-[0.6875rem] uppercase tracking-[0.18em] text-bone/85"
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={i} className="truncate" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          <span className="mr-2 text-gold-light" aria-hidden>✦</span>
          {announcements[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function IconBtn({ children, label, href, onClick, count, className }: { children: React.ReactNode; label: string; href?: string; onClick?: () => void; count?: number; className?: string }) {
  const inner = (
    <>
      {children}
      {count ? (
        <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.625rem] font-semibold tabular-nums text-carbon">{count}</span>
      ) : null}
    </>
  );
  const cls = cn("relative grid h-10 w-10 place-items-center transition-opacity hover:opacity-60", className);
  return href ? (
    <Link href={href} aria-label={label} className={cls}>{inner}</Link>
  ) : (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>{inner}</button>
  );
}

function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="link-underline text-[0.9375rem] text-ink-soft hover:text-ink">{children}</Link>
    </li>
  );
}

function ShopPanel() {
  const depts = departments;
  return (
    <div className="container-site grid grid-cols-12 gap-8 py-9">
      <div className="col-span-3">
        <p className="eyebrow text-taupe">Shop all</p>
        <Link href="/shop" className="mt-3 block font-display text-4xl leading-none hover:text-gold-deep">Every CO2 formula</Link>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">Browse the full catalogue with filters for category, price, size, customization and travel sizes.</p>
        <ul className="mt-5 space-y-2.5">
          <PanelLink href="/shop/bestsellers">Bestsellers</PanelLink>
          <PanelLink href="/customization">Customize your product</PanelLink>
          <PanelLink href="/collections">Collections</PanelLink>
          <PanelLink href="/sampling">Sampling Studio</PanelLink>
        </ul>
      </div>
      <ul className="col-span-9 grid grid-cols-4 gap-5">
        {depts.map((d) => (
          <li key={d.id}>
            <Link href={`/shop/${d.id}`} className="group block">
              <div className="relative aspect-[4/5] bg-bone-2">
                <Image src={productImage(d.image, 640)} alt="" fill sizes="200px" className="object-contain p-3" />
              </div>
              <p className="mt-3 font-display text-2xl leading-none group-hover:text-gold-deep">{d.label}</p>
              <p className="mt-1 text-xs text-taupe">{productsInDepartment(d.id).length} products</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CombosPanel() {
  const feature = combos.slice(0, 3);
  return (
    <div className="container-site grid grid-cols-12 gap-8 py-9">
      <div className="col-span-3">
        <p className="eyebrow text-taupe">Combos & routines</p>
        <Link href="/combos" className="mt-3 block font-display text-4xl leading-none hover:text-gold-deep">Better together</Link>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">Complete routines from real CO2 products, priced at the sum of what's inside.</p>
        <Link href="/combos#build" className="mt-5 inline-flex items-center gap-2 text-sm underline underline-offset-4">Build your own combo <ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
      <ul className="col-span-3 space-y-2.5 border-l border-line pl-8">
        <li className="eyebrow mb-3 text-taupe">Collections</li>
        {comboGroups.map((g) => <PanelLink key={g.id} href={`/combos#${g.id}`}>{g.label}</PanelLink>)}
        <PanelLink href="/sampling#sets">Travel Kits</PanelLink>
      </ul>
      <ul className="col-span-6 grid grid-cols-3 gap-5">
        {feature.map((c) => (
          <li key={c.slug}>
            <Link href={`/combos/${c.slug}`} className="group block">
              <div className="relative aspect-square bg-bone-2">
                <Image src={productImage(c.hero, 640)} alt="" fill sizes="220px" className="object-contain p-3" />
              </div>
              <p className="mt-3 font-display text-xl leading-tight group-hover:text-gold-deep">{c.name}</p>
              <p className="text-xs text-taupe">{c.kicker}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MiyPanel() {
  return (
    <div className="bg-carbon text-bone">
      <div className="container-site grid grid-cols-12 gap-8 py-10">
        <div className="col-span-4">
          <p className="eyebrow text-gold-light">Make It Yours</p>
          <p className="mt-3 font-display text-5xl leading-[0.95]">We make it <span className="italic text-gold-light">for you.</span></p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/70">Answer a short consultation, see your suggested routine first, then personalize products and packaging — only when you're ready.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/make-it-yours" className="btn btn-gold btn-sm">Start personalizing</Link>
            <Link href="/make-it-yours/build" className="btn btn-outline-light btn-sm">Open the builder</Link>
          </div>
        </div>
        <ul className="col-span-8 grid grid-cols-4 gap-4">
          {flows.map((f) => (
            <li key={f.id}>
              <Link href={`/make-it-yours/${f.id}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-carbon-3">
                  <Image src={productImage(f.image, 640)} alt="" fill sizes="180px" className="object-contain p-2 opacity-90 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-3 font-display text-2xl leading-none group-hover:text-gold-light">{f.label}</p>
                <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.14em] text-bone/50">{f.kicker.split("·")[0]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
