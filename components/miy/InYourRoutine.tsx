"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useMiy, miy } from "@/lib/customize/store";
import { flows } from "@/lib/customize/flows";

/** On a product page: tells the shopper if this product is in one of their Make It Yours routines (this browser only). */
export function InYourRoutine({ slug }: { slug: string }) {
  const hits = useMiy(() => flows.flatMap((f) => {
    const r = miy.result(f.id);
    const pick = r?.result.picks.find((p) => p.slug === slug);
    return pick ? [{ flow: f, pick }] : [];
  }), [slug]);
  if (!hits?.length) return null;
  const { flow, pick } = hits[0];
  return (
    <div className="flex items-start gap-3 border border-gold/50 bg-gold/5 p-4 text-sm">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
      <p>
        In your <b className="font-medium">{flow.label}</b> routine as the <b className="font-medium">{pick.step.toLowerCase()}</b> step. {pick.reasons[0]?.text}{" "}
        <Link href={`/make-it-yours/${flow.id}/results`} className="underline underline-offset-4">View routine</Link>
      </p>
    </div>
  );
}
