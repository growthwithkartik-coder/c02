"use client";

import Link from "next/link";
import { Check, Info, Plus, Sparkles } from "lucide-react";
import type { Product } from "@/types";
import { planSlugs, productFit } from "@/lib/consultation/engine";
import { useConsultResult } from "@/lib/consultation/store";
import { cn } from "@/lib/utils";

/* "Why this product may suit you" — uses the visitor's saved consultation
   (this device only) and the same engine as the results page. */
export function ProductFit({ product }: { product: Product }) {
  const { result, ready, update } = useConsultResult();
  if (!ready) return <div className="min-h-[7rem]" aria-hidden />;

  if (!result) {
    return (
      <div className="border border-line p-5">
        <p className="flex items-center gap-2 text-sm font-medium"><Sparkles className="h-3.5 w-3.5 text-gold-deep" /> Will this suit your skin?</p>
        <p className="mt-1.5 text-sm text-ink-soft">Take the three-minute Customized Skincare consultation and we&rsquo;ll tell you why this product does — or doesn&rsquo;t — fit your skin, and where it goes in your routine.</p>
        <Link href="/make-it-yours/face" className="btn btn-outline btn-sm mt-4">Start the consultation</Link>
      </div>
    );
  }

  if (product.custom) {
    const mine = result.plan.custom?.slug === product.slug;
    return (
      <div className="border border-line p-5 text-sm">
        <p className="flex items-center gap-2 font-medium"><Sparkles className="h-3.5 w-3.5 text-gold-deep" /> {mine ? "Pre-filled from your consultation" : "Built from your profile"}</p>
        <p className="mt-1.5 text-ink-soft">
          {mine ? "The formula choices below were filled in from your answers. Change anything before adding to cart." : "Fill the choices below, or see the formula we suggested for you."}
        </p>
        <Link href="/customized-skincare/results" className="mt-3 inline-block text-ink underline underline-offset-4">View your results</Link>
      </div>
    );
  }

  const fit = productFit(product, result.answers);
  const inPlan = planSlugs(result.plan).includes(product.slug);
  const added = result.extras.includes(product.slug);
  const name = result.plan.profile.name?.split(" ")[0];
  const head =
    fit.verdict === "good" ? `Why this may suit you${name ? `, ${name}` : ""}` : fit.verdict === "okay" ? "How this fits your skin profile" : "This may not be the best fit for you";

  return (
    <div className={cn("border p-5", fit.verdict === "not-ideal" ? "border-[#7a2b22]/40" : "border-gold/60")}>
      <p className="flex items-center gap-2 text-sm font-medium"><Sparkles className="h-3.5 w-3.5 text-gold-deep" /> {head}</p>
      <p className="mt-1 text-xs text-taupe">From your Customized Skincare answers — {fit.skinLabel.toLowerCase()} skin{inPlan ? " · already in your routine" : ""}.</p>
      <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
        {fit.reasons.slice(0, 4).map((r) => (
          <li key={r} className="flex gap-2.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf" />{r}</li>
        ))}
        {fit.cautions.slice(0, 3).map((c) => (
          <li key={c} className="flex gap-2.5 text-[#7a2b22]"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />{c}</li>
        ))}
        {!fit.reasons.length && !fit.cautions.length && <li>Nothing in this product&rsquo;s pack details is specific to your answers.</li>}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {inPlan ? (
          <span className="inline-flex items-center gap-1.5 text-sm"><Check className="h-4 w-4 text-leaf" /> In your routine</span>
        ) : (
          <button
            type="button"
            onClick={() => update((r) => ({ ...r, extras: added ? r.extras.filter((x) => x !== product.slug) : [...r.extras, product.slug] }))}
            aria-pressed={added}
            className="btn btn-outline btn-sm"
          >
            {added ? <><Check className="h-4 w-4" /> Added to my routine</> : <><Plus className="h-4 w-4" /> Add to my routine</>}
          </button>
        )}
        <Link href="/customized-skincare/results" className="text-sm underline underline-offset-4">View my routine</Link>
      </div>
    </div>
  );
}
