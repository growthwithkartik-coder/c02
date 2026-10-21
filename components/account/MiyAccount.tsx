"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getBuildProduct } from "@/data/customize";
import { flows } from "@/lib/customize/flows";
import { miy, notifyMiy, useMiy } from "@/lib/customize/store";
import { buildHref } from "@/components/miy/links";

/* Account → "Routines & customizations": saved routines, saved builds and
   customization requests — all stored in this browser only. */
export function MiyAccount() {
  const data = useMiy(() => ({ saved: miy.saved(), builds: miy.builds(), requests: miy.requests(), latest: flows.map((f) => ({ f, r: miy.result(f.id) })).filter((x) => x.r) }));
  if (!data) return null;
  const empty = !data.saved.length && !data.builds.length && !data.requests.length && !data.latest.length;
  if (empty)
    return (
      <div className="border border-line p-8">
        <p className="font-display text-3xl">Nothing saved yet.</p>
        <p className="mt-2 text-sm text-ink-soft">Routines, saved customizations and requests appear here — stored on this device only.</p>
        <Link href="/make-it-yours" className="btn btn-primary mt-6">Start a consultation</Link>
      </div>
    );
  const date = (s: string) => new Date(s).toLocaleDateString("en-IN", { dateStyle: "medium" });
  return (
    <div className="space-y-12">
      {data.latest.length > 0 && (
        <section>
          <h2 className="label">Latest results</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.latest.map(({ f, r }) => (
              <li key={f.id}><Link href={`/make-it-yours/${f.id}/results`} className="block border border-line p-5 hover:border-ink"><span className="eyebrow text-taupe">{f.label}</span><span className="mt-2 block font-display text-xl leading-tight">{r!.result.headline}</span><span className="mt-2 block text-xs text-taupe">{date(r!.result.createdAt)}</span></Link></li>
            ))}
          </ul>
        </section>
      )}
      {data.saved.length > 0 && (
        <section>
          <h2 className="label">Saved routines</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {data.saved.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <span><span className="block font-medium">{s.name}</span><span className="text-xs text-taupe">{s.result.picks.length} products · saved {date(s.savedAt)}</span></span>
                <span className="flex items-center gap-3">
                  <button type="button" onClick={() => { miy.setResult(s.flow, { answers: s.answers, result: s.result }); notifyMiy(); window.location.href = `/make-it-yours/${s.flow}/results`; }} className="text-xs underline underline-offset-4">Open</button>
                  <button type="button" onClick={() => { miy.removeSaved(s.id); notifyMiy(); }} aria-label={`Delete ${s.name}`} className="p-1 text-taupe hover:text-ink"><Trash2 className="h-4 w-4" /></button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {data.builds.length > 0 && (
        <section>
          <h2 className="label">Saved customizations</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {data.builds.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <span className="min-w-0"><span className="block font-medium">{b.label}</span><span className="line-clamp-1 text-xs text-taupe">{Object.entries(b.options).map(([k, v]) => `${k}: ${v}`).join(" · ")}</span></span>
                <span className="flex items-center gap-3">
                  {getBuildProduct(b.buildId) && <Link href={buildHref(b.buildId, { prefill: { ...b.options, _container: Object.entries({ dropper: "Glass dropper bottle", airless: "Airless pump", pump: "Pump bottle", jar: "Glass jar", tube: "Soft tube", compact: "Compact", bullet: "Twist-up case", bottle: "Flip-top bottle" }).find(([, l]) => l === b.options.Packaging)?.[0] ?? "" } })} className="text-xs underline underline-offset-4">Continue</Link>}
                  <button type="button" onClick={() => { miy.removeBuild(b.id); notifyMiy(); }} aria-label={`Delete ${b.label}`} className="p-1 text-taupe hover:text-ink"><Trash2 className="h-4 w-4" /></button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {data.requests.length > 0 && (
        <section>
          <h2 className="label">Customization requests</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {data.requests.map((r) => (
              <li key={r.id} className="grid gap-1 py-4 sm:grid-cols-4 sm:items-center">
                <span className="font-medium">{r.id}</span>
                <span className="text-sm">{r.label}</span>
                <span className="text-sm text-gold-deep">Pending confirmation</span>
                <span className="text-xs text-taupe sm:text-right">{date(r.createdAt)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-taupe">We reply by email with what&apos;s possible and a price. Requests aren&apos;t orders and nothing has been charged.</p>
        </section>
      )}
      <p className="text-xs text-taupe">Stored in this browser only — not a secure customer account. Clearing your browser data removes them.</p>
    </div>
  );
}
