"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product, Review } from "@/types";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductImage } from "@/components/ui/ProductImage";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import { cn, isPricePending, money } from "@/lib/utils";
import { Price } from "@/components/ui/primitives";

/* Sticky purchase bar — appears once the main Add to cart scrolls away. */
export function StickyBuyBar({ product }: { product: Product }) {
  const { addToCart, setQuickView } = useStore();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const target = document.querySelector("[data-add-to-cart]");
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.dataset.buybar = String(show);
    return () => {
      delete document.documentElement.dataset.buybar;
    };
  }, [show]);
  const needsChoice = !!product.custom || product.shades.length > 1;
  if (isPricePending(product)) return null; // nothing to buy yet
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bone/95 backdrop-blur-xl">
          <div className="container-site flex items-center gap-4 py-3 pb-safe">
            <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden sm:block"><ProductImage product={product} sizes="48px" className="absolute inset-0" /></div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl leading-tight">{product.name}</p>
              <p className="text-xs text-taupe">{product.size} · {money(product.price)}</p>
            </div>
            <button
              onClick={() => (needsChoice ? setQuickView(product.slug) : addToCart(product.slug, 1, product.shades[0] ? { shade: product.shades[0].name } : undefined))}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4" /> {product.custom ? "Personalize" : "Add to bag"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Frequently bought together — select and add in one tap. */
export function FrequentlyBought({ product, others }: { product: Product; others: Product[] }) {
  const { addToCart, setCartOpen } = useStore();
  const all = [product, ...others].filter((p) => !isPricePending(p));
  const [picked, setPicked] = useState<string[]>(all.filter((p) => !p.custom).map((p) => p.slug));
  const chosen = all.filter((p) => picked.includes(p.slug));
  const total = chosen.reduce((s, p) => s + p.price, 0);
  if (!others.length || isPricePending(product)) return null;
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
      <ul className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar lg:col-span-8">
        {all.map((p, i) => (
          <li key={p.slug} className="flex shrink-0 items-center gap-3">
            {i > 0 && <Plus className="h-4 w-4 text-taupe" />}
            <label className={cn("group relative block w-40 cursor-pointer md:w-52", !picked.includes(p.slug) && "opacity-45")}>
              <input type="checkbox" className="peer sr-only" checked={picked.includes(p.slug)} disabled={!!p.custom} onChange={() => setPicked((x) => (x.includes(p.slug) ? x.filter((s) => s !== p.slug) : [...x, p.slug]))} />
              <div className="relative aspect-square overflow-hidden peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-gold"><ProductImage product={p} sizes="210px" className="absolute inset-0" /></div>
              <span className={cn("absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border text-[0.7rem]", picked.includes(p.slug) ? "border-ink bg-ink text-bone" : "border-ink/30 bg-bone")}>{picked.includes(p.slug) ? "✓" : ""}</span>
              <span className="mt-2 block font-display text-lg leading-tight">{i === 0 ? "This: " : ""}{p.name}</span>
              <span className="text-sm text-ink-soft">{money(p.price)}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="border-t border-line pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
        <p className="eyebrow text-taupe">Together</p>
        <p className="mt-2 font-display text-5xl tabular-nums">{money(total)}</p>
        <p className="mt-1 text-sm text-ink-soft">{chosen.length} {chosen.length === 1 ? "item" : "items"}</p>
        <button
          disabled={!chosen.length}
          onClick={() => {
            chosen.forEach((p) => addToCart(p.slug, 1, p.shades[0] ? { shade: p.shades[0].name } : undefined, { silent: true }));
            setCartOpen(true);
          }}
          className="btn btn-primary mt-6 w-full"
        >
          Add {chosen.length === all.length ? "all" : "selected"} to bag
        </button>
      </div>
    </div>
  );
}

/* Reviews — shows verified reviews from the catalogue; new reviews are
   kept locally and labelled as pending moderation (wire the form to
   your review provider — Judge.me, Yotpo, your own API — for launch). */
export function Reviews({ product }: { product: Product }) {
  const [local, setLocal] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const all = readJSON<Record<string, Review[]>>(STORAGE_KEYS.reviews, {});
    setLocal(all[product.slug] ?? []);
  }, [product.slug]);

  const [err, setErr] = useState<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const r: Review = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      author: String(fd.get("author") || "").slice(0, 60) || "Anonymous",
      title: String(fd.get("title") || "").slice(0, 120),
      body: String(fd.get("body") || "").slice(0, 2000),
      rating,
      date: new Date().toISOString(),
    };
    if (!r.body) return;
    // send to the team for moderation (recorded with contact submissions); never shown publicly from here
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: r.author, email: String(fd.get("email") || ""), topic: "review", message: `Review for ${product.name} (${product.slug}) — ${rating}/5\n${r.title}\n${r.body}` }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not send your review.");
    } catch (e2) {
      setErr((e2 as Error).message + " Please check your email address and try again.");
      return;
    }
    const all = readJSON<Record<string, Review[]>>(STORAGE_KEYS.reviews, {});
    all[product.slug] = [r, ...(all[product.slug] ?? [])];
    writeJSON(STORAGE_KEYS.reviews, all);
    setLocal(all[product.slug]);
    setSent(true);
    setOpen(false);
    form.current?.reset();
  }

  const reviews = product.reviews;
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        {product.rating && product.reviewCount ? (
          <>
            <p className="font-display text-7xl tabular-nums">{product.rating.toFixed(1)}</p>
            <Stars value={product.rating} />
            <p className="mt-2 text-sm text-ink-soft">{product.reviewCount} verified reviews</p>
          </>
        ) : (
          <>
            <p className="font-display text-4xl leading-tight">No reviews yet.</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">Customer reviews will appear here once they&apos;ve been checked by our team.</p>
          </>
        )}
        <button onClick={() => setOpen((o) => !o)} className="btn btn-outline mt-8" aria-expanded={open}>
          Write a review
        </button>
        {sent && <p className="mt-4 text-sm text-leaf" role="status">Thank you — your review was sent to our team and will appear once it&apos;s moderated.</p>}
      </div>
      <div className="lg:col-span-8">
        <AnimatePresence>
          {open && (
            <motion.form ref={form} onSubmit={submit} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-10 overflow-hidden">
              <div className="grid gap-4 border border-line p-6 sm:grid-cols-2">
                <fieldset className="sm:col-span-2">
                  <legend className="label">Your rating</legend>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-pressed={rating >= n}>
                        <Star className={cn("h-6 w-6", rating >= n ? "fill-gold text-gold" : "text-taupe/50")} />
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="field"><label className="label" htmlFor="rv-a">Name</label><input id="rv-a" name="author" className="input" maxLength={60} /></div>
                <div className="field"><label className="label" htmlFor="rv-e">Email (not published)</label><input id="rv-e" name="email" type="email" required className="input" maxLength={120} /></div>
                <div className="field"><label className="label" htmlFor="rv-t">Title</label><input id="rv-t" name="title" className="input" maxLength={120} /></div>
                <div className="field sm:col-span-2"><label className="label" htmlFor="rv-b">Review</label><textarea id="rv-b" name="body" required className="input" maxLength={2000} /></div>
                <div className="sm:col-span-2"><button className="btn btn-primary">Submit review</button>{err && <p role="alert" className="mt-3 text-sm text-red-700">{err}</p>}</div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        <ul className="divide-y divide-line border-y border-line">
          {[...local.map((r) => ({ ...r, pending: true })), ...reviews.map((r) => ({ ...r, pending: false }))].map((r) => (
            <li key={r.id} className="py-6">
              <div className="flex items-center justify-between">
                <Stars value={r.rating} />
                <span className="text-xs text-taupe">{new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              {r.title && <p className="mt-3 font-medium">{r.title}</p>}
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
              <p className="mt-3 text-xs text-taupe">— {r.author}{r.pending ? " · pending moderation (visible only to you)" : r.verified ? " · verified buyer" : ""}</p>
            </li>
          ))}
          {!local.length && !reviews.length && <li className="py-10 text-sm text-taupe">Be the first to share how this formula works for you.</li>}
        </ul>
      </div>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-4 w-4", i < Math.round(value) ? "fill-gold text-gold" : "text-taupe/40")} />
      ))}
    </span>
  );
}

export function RoutineStrip({ steps, current }: { steps: { step: string; product: Product }[]; current: string }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.step}>
          <Link href={`/product/${s.product.slug}`} className={cn("group block border p-4 transition-colors", s.product.slug === current ? "border-ink" : "border-line hover:border-ink")}>
            <p className="eyebrow tabular-nums text-taupe">Step {i + 1} · {s.step}</p>
            <div className="relative mt-4 aspect-square overflow-hidden"><ProductImage product={s.product} sizes="(max-width:640px) 90vw, 25vw" className="absolute inset-0" /></div>
            <p className="mt-3 font-display text-xl leading-tight">{s.product.name}</p>
            <p className="text-sm text-ink-soft">{s.product.slug === current ? "You are here" : <Price product={s.product} />}</p>
          </Link>
        </li>
      ))}
    </ol>
  );
}
