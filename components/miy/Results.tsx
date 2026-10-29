"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bookmark, BookmarkCheck, Check, Info, Pencil, RotateCcw, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductImage } from "@/components/ui/ProductImage";
import { getBuildProduct } from "@/data/customize";
import { getFlow, flows, type FlowId } from "@/lib/customize/flows";
import type { Recommendation } from "@/lib/customize/recommend";
import { miy, notifyMiy, uid } from "@/lib/customize/store";
import { getProduct } from "@/lib/catalog";
import { cardTypeLabel } from "@/lib/taxonomy";
import { customizationFor, sampleFor } from "@/lib/commerce";
import { useTryOn } from "@/components/tryon/TryOnProvider";
import { cn, CUSTOM_PRICES_ON_REQUEST, isPricePending, listedPrice, money, productImage, PRICES_ON_REQUEST } from "@/lib/utils";
import { buildHref } from "@/components/miy/links";

import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";
export function Results({ flowId }: { flowId: FlowId }) {
  const flow = getFlow(flowId)!;
  const router = useRouter();
  const { addMany, toast } = useStore();
  const tryOn = useTryOn();
  const [data, setData] = useState<{ answers: Record<string, unknown>; result: Recommendation } | null | undefined>(undefined);
  const [saved, setSaved] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    const r = miy.result(flowId);
    setData(r as typeof data);
    if (r) {
      setPicked(r.result.picks.map((p) => p.slug));
      setSaved(miy.saved().some((s) => s.flow === flowId && s.result.createdAt === r.result.createdAt));
    }
  }, [flowId]);

  const r = data?.result;
  const picks = useMemo(() => (r ? r.picks.map((p) => ({ ...p, product: getProduct(p.slug)! })).filter((p) => p.product) : []), [r]);
  const samples = picks.filter((p) => sampleFor(p.slug));

  if (data === undefined) return <div className="min-h-[60vh]" />;
  if (!r) {
    return (
      <section className="container-site grid min-h-[60vh] place-items-center pt-[calc(var(--nav-h)+2rem)] text-center">
        <div>
          <p className="eyebrow text-taupe">{flow.label}</p>
          <h1 className="mt-3 font-display text-5xl">No routine yet.</h1>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">Answer the {flow.label.toLowerCase()} consultation and your suggested routine will appear here.</p>
          <Link href={`/make-it-yours/${flowId}`} className="btn btn-primary mt-8">Start the consultation</Link>
        </div>
      </section>
    );
  }

  function save() {
    miy.save({ id: uid("routine"), name: `${flow.label} routine`, flow: flowId, answers: data!.answers as never, result: r!, savedAt: new Date().toISOString() });
    notifyMiy();
    setSaved(true);
    toast({ title: "Routine saved", body: "Find it any time in your account, on this device.", action: { label: "View", href: "/account?tab=routines" } });
  }

  const date = new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      {/* header */}
      <section className="bg-carbon pb-14 pt-[calc(var(--nav-h)+2.5rem)] text-bone grain">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="eyebrow text-bone/50">
            <Link href="/make-it-yours" className="hover:text-bone">Make It Yours</Link> <span aria-hidden>/</span> <Link href={`/make-it-yours/${flowId}`} className="hover:text-bone">{flow.label}</Link> <span aria-hidden>/</span> <span className="text-bone/80">Your routine</span>
          </nav>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="eyebrow text-gold-light">Your {flow.label.toLowerCase()} routine · {date}</p>
              <h1 className="mt-4 font-display text-[clamp(2.4rem,5.4vw,5rem)] leading-[0.98]">{r.headline}</h1>
              <p className="mt-5 max-w-2xl text-bone/70">{r.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end">
              <button type="button" onClick={save} disabled={saved} className="btn btn-gold btn-sm">
                {saved ? <><BookmarkCheck className="h-4 w-4" /> Saved</> : <><Bookmark className="h-4 w-4" /> Save routine</>}
              </button>
              <Link href={`/make-it-yours/${flowId}?review=1&edit=`} onClick={(e) => { e.preventDefault(); miy.setDraft(flowId, { answers: data!.answers as never, step: 0, updatedAt: new Date().toISOString() }); router.push(`/make-it-yours/${flowId}?review=1`); }} className="btn btn-outline-light btn-sm"><Pencil className="h-3.5 w-3.5" /> Edit answers</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container-site space-y-section py-section">
        {/* 1. profile */}
        <section aria-labelledby="profile" className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-taupe">01</p>
            <h2 id="profile" className="mt-2 font-display text-display-sm">Your beauty profile</h2>
            <p className="mt-3 text-sm text-ink-soft">What you told us — used only to build this suggestion, and stored only in this browser.</p>
          </div>
          <dl className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-8 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
            {r.profile.map((row) => (
              <div key={row.label} className="bg-bone p-4">
                <dt className="text-[0.6875rem] uppercase tracking-[0.16em] text-taupe">{row.label}</dt>
                <dd className="mt-1 text-[0.95rem]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 2. routine */}
        <section aria-labelledby="routine">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="eyebrow text-taupe">02</p>
              <h2 id="routine" className="mt-2 font-display text-display-sm">Your suggested routine</h2>
            </div>
            <p className="text-sm text-ink-soft lg:col-span-5 lg:col-start-8">Steps in the order you&apos;d use them. Nothing has been added to your bag — explore first, buy later if you like.</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {r.routine.map((b, bi) => (
              <article key={b.id} className={cn("p-6 md:p-8", bi === 0 ? "bg-stone" : bi === 1 ? "bg-carbon text-bone" : "bg-bone-2")}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-3xl">{b.title}</h3>
                  <span className="text-xs uppercase tracking-[0.16em] opacity-60">{b.steps.length} steps</span>
                </div>
                {b.note && <p className="mt-2 text-sm opacity-70">{b.note}</p>}
                <ol className="mt-6 space-y-3">
                  {b.steps.map((s, i) => {
                    const p = s.slug ? getProduct(s.slug) : null;
                    const bp = s.buildId ? getBuildProduct(s.buildId) : null;
                    return (
                      <li key={i} className="flex items-center gap-4">
                        <span className="w-6 shrink-0 text-xs tabular-nums opacity-50">{String(i + 1).padStart(2, "0")}</span>
                        {p ? (
                          <Link href={`/product/${p.slug}`} className="group flex flex-1 items-center gap-4">
                            <span className="relative h-14 w-14 shrink-0 bg-bone/80"><Image src={productImage(p.images[0], 640)} alt="" fill sizes="56px" className="object-contain" /></span>
                            <span className="min-w-0">
                              <span className="block text-[0.6875rem] uppercase tracking-[0.16em] opacity-60">{s.step}</span>
                              <span className="block truncate font-display text-xl leading-tight group-hover:underline">{p.name}</span>
                            </span>
                          </Link>
                        ) : (
                          <span className="flex flex-1 items-center gap-4">
                            <span className="grid h-14 w-14 shrink-0 place-items-center border border-current/20 text-[0.625rem] uppercase tracking-[0.14em] opacity-70">{bp ? <Sparkles className="h-4 w-4" /> : "Your pick"}</span>
                            <span>
                              <span className="block text-[0.6875rem] uppercase tracking-[0.16em] opacity-60">{s.step}</span>
                              <span className="block text-sm leading-snug opacity-85">{s.text}</span>
                              {bp && <Link href={buildHref(bp.id)} className="mt-1 inline-block text-xs underline underline-offset-4">Customize {bp.label.toLowerCase()} →</Link>}
                            </span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </article>
            ))}
          </div>
        </section>

        {/* 3. recommended products */}
        {picks.length > 0 && (
          <section aria-labelledby="picks">
            <p className="eyebrow text-taupe">03</p>
            <h2 id="picks" className="mt-2 font-display text-display-sm">Recommended products — and why</h2>
            <p className="mt-3 flex max-w-3xl items-start gap-2 text-sm text-ink-soft">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span><b className="font-medium text-ink">From product info</b> means it comes from the product&apos;s own listed ingredients, concern grouping or skin types. <b className="font-medium text-ink">Matches your preference</b> means it fits something you told us (texture, scent family, budget) — not a product claim.</span>
            </p>
            <ul className="mt-10 space-y-6">
              {picks.map(({ product: p, step, reasons }) => {
                const s = sampleFor(p.slug);
                const c = customizationFor(p);
                const on = picked.includes(p.slug);
                return (
                  <li key={p.slug} className="grid gap-6 border border-line p-5 md:grid-cols-12 md:p-6">
                    <Link href={`/product/${p.slug}`} className="relative block aspect-square md:col-span-3">
                      <ProductImage product={p} sizes="(max-width:768px) 90vw, 22vw" className="absolute inset-0" />
                    </Link>
                    <div className="md:col-span-5">
                      <p className="eyebrow text-gold-deep">{step} · {cardTypeLabel(p)}</p>
                      <h3 className="mt-2 font-display text-3xl leading-tight"><Link href={`/product/${p.slug}`} className="hover:underline">{p.name}</Link></h3>
                      <p className="mt-1 text-sm text-ink-soft">{p.subtitle}</p>
                      <ul className="mt-4 space-y-2.5 text-sm">
                        {reasons.map((x, i) => (
                          <li key={i} className="flex gap-3">
                            <span className={cn("mt-0.5 h-fit shrink-0 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.14em]", x.kind === "verified" ? "bg-ink text-bone" : "border border-gold text-gold-deep")}>
                              {x.kind === "verified" ? "From product info" : "Matches your preference"}
                            </span>
                            <span className="text-ink-soft">{x.text}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-xs text-taupe">Key ingredients: {p.ingredients.map((i) => i.name).join(" · ")}</p>
                    </div>
                    <div className="flex flex-col gap-3 md:col-span-4 md:border-l md:border-line md:pl-6">
                      <dl className="grid grid-cols-2 gap-y-2 text-sm">
                        <dt className="text-taupe">Full size</dt><dd className="text-right">{p.size.split("/")[0]}{isPricePending(p) ? "" : ` · ${money(p.price)}`}</dd>
                        {s && <><dt className="text-taupe">Travel size</dt><dd className="text-right">{PRICES_ON_REQUEST ? s.size : `${s.size} · ${money(s.price)}`}</dd></>}
                        {isPricePending(p) && <><dt className="text-taupe">Price</dt><dd className="text-right">On request</dd></>}
                        <dt className="text-taupe">Customizable</dt><dd className="text-right">{c ? (c.mode === "listed" ? "Made to order" : "On request") : "No"}</dd>
                      </dl>
                      <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm">
                        <input type="checkbox" checked={on} onChange={() => setPicked((x) => (on ? x.filter((y) => y !== p.slug) : [...x, p.slug]))} className="h-4 w-4 accent-ink" />
                        Include in &ldquo;add selected&rdquo;
                      </label>
                      <div className="mt-auto flex flex-wrap gap-2">
                        <Link href={`/product/${p.slug}`} className="btn btn-outline btn-sm">View product</Link>
                        {c && <Link href={buildHref(c.id, { from: p.slug })} className="btn btn-sm border border-gold text-gold-deep hover:bg-gold hover:text-carbon"><Sparkles className="h-3.5 w-3.5" /> Customize</Link>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {r.excluded.length > 0 && (
          <section aria-labelledby="excluded" className="border border-dashed border-line p-6">
            <h2 id="excluded" className="text-sm font-semibold uppercase tracking-[0.14em]">Left out for you</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
              {r.excluded.map((e) => (
                <li key={e.slug}><Link href={`/product/${e.slug}`} className="text-ink underline underline-offset-4">{getProduct(e.slug)?.name}</Link> — {e.reason}</li>
              ))}
            </ul>
          </section>
        )}

        {/* 4. customize */}
        {r.custom.length > 0 && (
          <section aria-labelledby="customize" className="bg-carbon p-6 text-bone md:p-12">
            <p className="eyebrow text-gold-light">04</p>
            <h2 id="customize" className="mt-2 font-display text-display-sm">Customize your product</h2>
            <p className="mt-3 max-w-2xl text-sm text-bone/70">These open the builder pre-filled from your answers — change anything, choose packaging, and review before you commit. A recommendation is not a custom formula: a formula is only made once you build and confirm it.</p>
            <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {r.custom.map((c) => {
                const bp = getBuildProduct(c.buildId)!;
                const p = bp.slug ? getProduct(bp.slug) : null;
                const shown = Object.entries(c.prefill).filter(([k, v]) => v && !k.startsWith("_")).slice(0, 4);
                return (
                  <li key={c.buildId} className="flex flex-col border border-line-dark p-6">
                    <p className="text-[0.6875rem] uppercase tracking-[0.16em] text-gold-light">{CUSTOM_PRICES_ON_REQUEST || PRICES_ON_REQUEST ? `${bp.mode === "listed" ? "Made to order" : "On request"} · price as per customization` : bp.mode === "listed" ? `Made to order · ${p ? money(p.price) : ""}` : "On request · price confirmed after review"}</p>
                    <h3 className="mt-2 font-display text-3xl">{bp.label}</h3>
                    <p className="mt-2 text-sm text-bone/65">{c.why}</p>
                    {shown.length > 0 && (
                      <dl className="mt-5 space-y-1.5 border-t border-line-dark pt-4 text-xs">
                        {shown.map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4"><dt className="text-bone/50">{k}</dt><dd className="text-right">{v}</dd></div>
                        ))}
                      </dl>
                    )}
                    <Link href={buildHref(c.buildId, { prefill: c.prefill })} className="btn btn-gold btn-sm mt-auto self-start translate-y-0 pt-0" style={{ marginTop: "1.5rem" }}>Customize <ArrowRight className="h-3.5 w-3.5" /></Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* 5. try first */}
        <section aria-labelledby="try" className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-taupe">05</p>
            <h2 id="try" className="mt-2 font-display text-display-sm">Try before committing</h2>
          </div>
          <div className="lg:col-span-8">
            {samples.length > 0 ? (
              <>
                <ul className="divide-y divide-line border-y border-line">
                  {samples.map(({ product: p }) => {
                    const s = sampleFor(p.slug)!;
                    return (
                      <li key={p.slug} className="flex items-center gap-4 py-4">
                        <span className="relative h-12 w-12 shrink-0 bg-bone-2"><Image src={productImage(p.images[0], 640)} alt="" fill sizes="48px" className="object-contain" /></span>
                        <span className="flex-1 text-sm"><span className="block font-medium">{p.name}</span><span className="text-taupe">Travel size {s.size}</span></span>
                        {!PRICES_ON_REQUEST && <span className="text-sm tabular-nums">{money(s.price)}</span>}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {PRICES_ON_REQUEST ? (
                    <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`${flow.label} routine — travel sizes (${samples.map((x) => x.product.name).join(", ")})`)} className="btn btn-primary" data-request-price>Request price for {samples.length} samples</a>
                  ) : (
                  <button type="button" onClick={() => addMany(samples.map((x) => ({ slug: x.slug, size: "sample" as const, bundle: `${flow.label} routine samples` })))} className="btn btn-primary">
                    Add {samples.length} samples — {money(samples.reduce((t, x) => t + sampleFor(x.slug)!.price, 0))}
                  </button>
                  )}
                  <Link href="/sampling" className="text-sm underline underline-offset-4">Visit the Sampling Studio</Link>
                </div>
              </>
            ) : flowId === "lips" ? (
              <div className="border border-line p-6">
                <p className="text-ink-soft">Travel sizes aren&apos;t offered for lip products. Try every gloss shade on your own face instead — live camera or a photo, processed on your device.</p>
                <button type="button" onClick={() => tryOn.open(picks[0]?.slug)} className="btn btn-primary mt-5"><Sparkles className="h-4 w-4" /> Try shades on</button>
              </div>
            ) : (
              <p className="text-ink-soft">None of the suggested products has a travel size yet. <Link href="/sampling" className="underline">See what you can sample</Link>.</p>
            )}
          </div>
        </section>

        {/* 6. save or continue */}
        <section aria-labelledby="continue" className="border-t border-line pt-12">
          <p className="eyebrow text-taupe">06</p>
          <h2 id="continue" className="mt-2 font-display text-display-sm">Save or continue</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button type="button" onClick={save} disabled={saved} className="flex flex-col items-start gap-3 border border-line p-6 text-left transition-colors hover:border-ink disabled:opacity-60">
              {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              <span className="font-display text-2xl">{saved ? "Routine saved" : "Save this routine"}</span>
              <span className="text-xs text-taupe">Kept in this browser — view it under Account.</span>
            </button>
            <Link href={`/make-it-yours/${flowId}?review=1`} onClick={() => miy.setDraft(flowId, { answers: data!.answers as never, step: 0, updatedAt: new Date().toISOString() })} className="flex flex-col items-start gap-3 border border-line p-6 transition-colors hover:border-ink">
              <Pencil className="h-5 w-5" />
              <span className="font-display text-2xl">Edit your answers</span>
              <span className="text-xs text-taupe">Change anything and rebuild.</span>
            </Link>
            {PRICES_ON_REQUEST ? (
              <a
                target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`${flow.label} routine (${picked.map((s) => getProduct(s)?.name).filter(Boolean).join(", ")})`)}
                className="flex flex-col items-start gap-3 bg-ink p-6 text-left text-bone transition-colors hover:bg-gold hover:text-carbon"
                data-request-price
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="font-display text-2xl">Request routine price</span>
                <span className="text-xs opacity-70">{picked.length} full-size products · price on request, as per customization</span>
              </a>
            ) : (
            <button
              type="button"
              disabled={!picked.length}
              onClick={() => addMany(picked.map((slug) => ({ slug, shade: getProduct(slug)?.shades[0]?.name, bundle: `${flow.label} routine` })))}
              className="flex flex-col items-start gap-3 bg-ink p-6 text-left text-bone transition-colors hover:bg-gold hover:text-carbon disabled:opacity-40"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="font-display text-2xl">Add selected to bag</span>
              <span className="text-xs opacity-70">{picked.length} full-size products · {money(picked.reduce((t, s) => t + (listedPrice(getProduct(s)) ?? 0), 0))}</span>
            </button>
            )}
            <Link href={r.custom[0] ? buildHref(r.custom[0].buildId, { prefill: r.custom[0].prefill }) : "/make-it-yours/build"} className="flex flex-col items-start gap-3 border border-gold p-6 transition-colors hover:bg-gold/10">
              <Sparkles className="h-5 w-5 text-gold-deep" />
              <span className="font-display text-2xl">{r.custom[0] && getBuildProduct(r.custom[0].buildId)?.mode === "request" ? "Request a custom formula" : "Build a custom formula"}</span>
              <span className="text-xs text-taupe">Review everything before you commit.</span>
            </Link>
          </div>
        </section>

        {r.notes.length > 0 && (
          <aside className="bg-bone-2 p-6 text-sm text-ink-soft">
            <p className="font-medium text-ink">Good to know</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">{r.notes.map((n) => <li key={n}>{n}</li>)}</ul>
            <p className="mt-4 text-xs">This is a personalized product <b>recommendation</b> from the CO2 range — not a diagnosis and not a custom-manufactured formulation.</p>
          </aside>
        )}

        <section aria-label="Other consultations" className="flex flex-wrap items-center gap-3 border-t border-line pt-8 text-sm">
          <span className="text-taupe">Explore another category:</span>
          {flows.filter((f) => f.id !== flowId).map((f) => (
            <Link key={f.id} href={`/make-it-yours/${f.id}`} className="chip">{f.label}</Link>
          ))}
          <button
            type="button"
            onClick={() => {
              miy.setResult(flowId, null);
              notifyMiy();
              router.push(`/make-it-yours/${flowId}`);
            }}
            className="ml-auto inline-flex items-center gap-1.5 text-xs underline underline-offset-4"
          >
            <RotateCcw className="h-3 w-3" /> Start this consultation again
          </button>
        </section>
      </div>
    </>
  );
}

export function ResultCheck() {
  return <Check className="h-4 w-4" />;
}
