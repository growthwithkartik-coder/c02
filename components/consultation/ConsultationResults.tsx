"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Info, Pencil, Plus, RefreshCw, RotateCcw, ShoppingBag, Sparkles, Sun, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { Vessel } from "@/components/ui/ProductImage";
import { AskAssistant } from "./AskAssistant";
import { answerText, optLabel, questionById, visibleQuestions, chapters } from "@/lib/consultation/questions";
import { buildPlan, getPickProduct, planSlugs, roleLabels, type Pick, type Plan, type RoutineStep } from "@/lib/consultation/engine";
import { fetchAiStatus, useConsultResult } from "@/lib/consultation/store";
import type { AiLayer, ConsultResult } from "@/lib/consultation/types";
import { cn, money, productImage, priceText, PRICES_ON_REQUEST } from "@/lib/utils";

import { priceWhatsAppHref } from "@/components/commerce/PriceOnRequest";
export function ConsultationResults() {
  const { result, ready, update } = useConsultResult();
  const requested = useRef(false);

  /* ---------- AI explanation layer (optional) ---------- */
  useEffect(() => {
    if (!result || result.ai.status !== "pending" || requested.current) return;
    requested.current = true;
    (async () => {
      const status = await fetchAiStatus();
      if (!status.recommendations) {
        update((r) => ({ ...r, ai: { status: "not-configured", message: "AI explanations aren't configured on this site, so these reasons come straight from CO2's product data." } }));
        return;
      }
      try {
        const res = await fetch("/api/consultation/recommend", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ answers: result.answers }) });
        const data = (await res.json()) as { ai?: AiLayer; error?: string };
        update((r) => ({ ...r, ai: data.ai ?? { status: "error", message: data.error ?? "The AI service didn't respond." } }));
      } catch {
        update((r) => ({ ...r, ai: { status: "offline", message: "You appear to be offline, so these reasons come from CO2's product data." } }));
      }
    })();
  }, [result, update]);

  if (!ready) return <div className="min-h-[100svh] bg-bone" aria-busy="true" />;
  if (!result) return <Empty />;
  return <ResultsView result={result} update={update} onRegenerate={() => { requested.current = false; }} />;
}

function Empty() {
  return (
    <section className="container-site flex min-h-[80svh] flex-col justify-center pb-section pt-[calc(var(--nav-h)+4rem)]">
      <p className="eyebrow text-gold-deep">Customized Skincare</p>
      <h1 className="mt-4 max-w-3xl font-display text-display-md">Your routine starts with a few questions.</h1>
      <p className="lead mt-6 max-w-xl text-ink-soft">There are no saved results on this device yet. The consultation takes about three minutes and needs no account.</p>
      <div className="mt-10">
        <Link href="/customized-skincare" className="btn btn-primary btn-lg">Start the consultation</Link>
      </div>
    </section>
  );
}

function ResultsView({ result, update, onRegenerate }: { result: ConsultResult; update: (fn: (r: ConsultResult) => ConsultResult) => void; onRegenerate: () => void }) {
  const { plan, ai, answers } = result;
  const { addToCart, setCartOpen, toast } = useStore();
  const slugs = useMemo(() => planSlugs(plan), [plan]);
  const extras = result.extras.filter((s) => !slugs.includes(s) && getPickProduct(s));
  const total = slugs.reduce((s, x) => s + (getPickProduct(x)?.price ?? 0), 0);
  const name = plan.profile.name?.split(" ")[0];

  function addRoutine() {
    for (const s of slugs) {
      const p = getPickProduct(s);
      if (!p) continue;
      addToCart(s, 1, p.shades[0] ? { shade: p.shades[0].name } : undefined, { silent: true });
    }
    setCartOpen(true);
    toast({ title: "Routine added to cart", body: `${slugs.length} products` });
  }

  function regenerate() {
    onRegenerate();
    update((r) => ({ ...r, plan: buildPlan(r.answers), ai: { status: "pending" }, savedAt: new Date().toISOString() }));
  }

  const sections: { id: string; title: string; steps: RoutineStep[] }[] = [
    { id: "body", title: "Body", steps: plan.body },
    { id: "hair", title: "Hair & scalp", steps: plan.hair },
    { id: "lips", title: "Lips", steps: plan.lips },
  ];
  const facePicks = plan.picks.filter((p) => ["cleanse", "treat", "moisturize", "mask", "exfoliate"].includes(p.role));

  return (
    <div className="bg-bone">
      {/* ---------- opening ---------- */}
      <section className="container-site pb-14 pt-[calc(var(--nav-h)+3rem)] md:pb-20">
        <p className="text-sm text-gold-deep">Your Customized Skincare results · saved {new Date(result.savedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}</p>
        <h1 className="mt-4 max-w-5xl font-display text-[clamp(3rem,7.5vw,7rem)] leading-[0.9] tracking-[-0.03em]">
          {name ? `${name}, here's your routine.` : "Here's your routine."}
        </h1>
        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="lead text-ink">{plan.summary}</p>
            {ai.status === "ok" && ai.intro && <p className="mt-4 leading-relaxed text-ink-soft">{ai.intro}</p>}
            <SourceNote ai={ai} />
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:col-start-9">
            {slugs.length > 0 && (PRICES_ON_REQUEST ? (
              <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`My CO2 routine (${slugs.map((s) => getPickProduct(s)?.name).filter(Boolean).join(", ")})`)} className="btn btn-primary btn-lg w-full" data-request-price>
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} /> Request routine price
              </a>
            ) : (
              <button type="button" onClick={addRoutine} className="btn btn-primary btn-lg w-full">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} /> Add routine to cart — {money(total)}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/customized-skincare?edit=review" className="btn btn-outline w-full"><Pencil className="h-3.5 w-3.5" /> Edit answers</Link>
              <Link href="/customized-skincare?restart=1" className="btn btn-outline w-full"><RotateCcw className="h-3.5 w-3.5" /> Start over</Link>
            </div>
            <button type="button" onClick={regenerate} className="btn btn-ghost justify-start text-xs"><RefreshCw className="h-3.5 w-3.5" /> Regenerate recommendations</button>
          </div>
        </div>

        {/* profile */}
        <dl className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <ProfileCell label="Skin type" value={plan.profile.skinLabel} sub={plan.profile.skinNote} />
          <ProfileCell label="Sensitivity" value={plan.profile.sensitivity} />
          <ProfileCell label="Concerns" value={plan.profile.concerns.join(", ") || "None — maintenance"} />
          <ProfileCell label="Goals" value={plan.profile.goals.join(", ") || "—"} />
          <ProfileCell label="Routine covers" value={plan.profile.areas.map((a) => optLabel(questionById("areas"), a)).join(", ")} />
          <ProfileCell label="Texture" value={optLabel(questionById("texture"), answers.texture) || "—"} sub={optLabel(questionById("climate"), answers.climate)} />
          <ProfileCell label="Fragrance" value={optLabel(questionById("fragrance"), answers.fragrance) || "—"} />
          <ProfileCell label="Budget per product" value={optLabel(questionById("budget"), answers.budget) || "—"} sub={optLabel(questionById("steps"), answers.steps)} />
        </dl>
      </section>

      {/* ---------- face routine ---------- */}
      {(plan.morning.length > 0 || plan.evening.length > 0) && (
        <section className="bg-carbon py-section text-bone grain" aria-labelledby="routine-title">
          <div className="container-site">
            <h2 id="routine-title" className="font-display text-display-sm">The order to use them in.</h2>
            <p className="mt-3 max-w-xl text-sm text-bone/60">Apply thinnest to thickest. Give each layer a moment to settle before the next.</p>
            <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
              <RoutineColumn title="Morning" steps={plan.morning} />
              <RoutineColumn title="Evening" steps={plan.evening} />
            </div>
            {plan.weekly.length > 0 && (
              <div className="mt-14 border-t border-line-dark pt-8">
                <h3 className="font-display text-3xl">Once or twice a week</h3>
                <p className="mt-1 text-sm text-bone/55">After cleansing in the evening, before the rest of your routine.</p>
                <ol className="mt-6 grid gap-6 md:grid-cols-2">
                  {plan.weekly.map((s, i) => <StepRow key={s.step + i} step={s} n={i + 1} />)}
                </ol>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- why each product ---------- */}
      {facePicks.length > 0 && (
        <section className="container-site pt-section" aria-labelledby="why-title">
          <h2 id="why-title" className="font-display text-display-sm">Why each product was chosen.</h2>
          <p className="mt-3 max-w-2xl text-sm text-ink-soft">
            The reasons come from what&rsquo;s printed on each CO2 pack — its listed skin types, ingredients, benefits and texture — measured against your answers.
          </p>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {facePicks.map((p) => <PickRow key={p.slug} pick={p} ai={ai} />)}
          </ul>
        </section>
      )}

      {sections.filter((s) => s.steps.length).map((sec) => (
        <section key={sec.id} className="container-site pt-section" aria-labelledby={`sec-${sec.id}`}>
          <h2 id={`sec-${sec.id}`} className="font-display text-display-sm">{sec.title}</h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {sec.steps.map((st) => {
              const pick = plan.picks.find((p) => p.slug === st.slug);
              return pick ? <PickRow key={st.slug} pick={pick} ai={ai} label={st.step} /> : null;
            })}
          </ul>
        </section>
      ))}

      {/* ---------- made to order ---------- */}
      {plan.custom && <CustomFormulaBlock plan={plan} />}

      {/* ---------- extras from product pages ---------- */}
      {extras.length > 0 && (
        <section className="container-site pt-section" aria-labelledby="extras-title">
          <h2 id="extras-title" className="font-display text-display-sm">Added from product pages</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((s) => {
              const p = getPickProduct(s)!;
              return (
                <li key={s} className="flex items-center gap-4 border border-line p-3">
                  <Thumb slug={s} size={64} />
                  <div className="flex-1">
                    <Link href={`/product/${s}`} className="font-medium hover:underline">{p.name}</Link>
                    <p className="text-xs text-ink-soft">{priceText(p.price)} · {p.size}</p>
                  </div>
                  <button type="button" aria-label={`Remove ${p.name} from your routine`} onClick={() => update((r) => ({ ...r, extras: r.extras.filter((x) => x !== s) }))} className="p-2 text-taupe hover:text-ink">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ---------- good to know + assistant ---------- */}
      <section className="container-site grid gap-14 pt-section lg:grid-cols-12" aria-label="Good to know">
        <div className="lg:col-span-6">
          <h2 className="font-display text-display-sm">Good to know.</h2>
          {ai.status === "ok" && ai.tips && ai.tips.length > 0 && (
            <ul className="mt-6 space-y-3">
              {ai.tips.map((t) => (
                <li key={t} className="flex gap-3 text-[0.95rem]"><Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-gold-deep" /><span>{t}</span></li>
              ))}
            </ul>
          )}
          <ul className="mt-6 space-y-3">
            {plan.limitations.map((l) => (
              <li key={l} className="flex gap-3 text-[0.95rem] text-ink-soft"><Info className="mt-1 h-3.5 w-3.5 shrink-0" strokeWidth={1.6} /><span>{l}</span></li>
            ))}
          </ul>
          <p className="mt-8 border-l-2 border-gold pl-4 text-sm leading-relaxed text-ink-soft">
            These recommendations are cosmetic and informational. They don&rsquo;t diagnose any skin condition and aren&rsquo;t a substitute for professional medical advice. Patch-test new products, and see a dermatologist for anything painful, persistent or worsening.
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <AskAssistant answers={answers} routine={[...slugs, ...extras]} />
        </div>
      </section>

      {/* ---------- answers ---------- */}
      <section className="container-site py-section" aria-labelledby="answers-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="answers-title" className="font-display text-display-sm">Your answers</h2>
          <Link href="/customized-skincare?edit=review" className="link-underline text-xs font-medium uppercase tracking-[0.16em]">Edit and regenerate</Link>
        </div>
        <dl className="mt-8 grid gap-x-10 border-t border-line md:grid-cols-2">
          {chapters.flatMap((c) => visibleQuestions(answers).filter((q) => q.chapter === c.id)).map((q) => (
            <div key={q.id} className="grid grid-cols-[9rem_1fr_auto] items-baseline gap-3 border-b border-line py-3 text-sm">
              <dt className="text-taupe">{q.short}</dt>
              <dd>{answerText(q, answers)}</dd>
              <dd><Link href={`/customized-skincare?edit=${q.id}`} className="text-xs text-ink-soft underline-offset-4 hover:underline" aria-label={`Edit ${q.short}`}>Edit</Link></dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

/* ---------------- pieces ---------------- */

function SourceNote({ ai }: { ai: AiLayer }) {
  const base = "mt-6 flex items-start gap-2.5 text-xs leading-relaxed";
  if (ai.status === "pending")
    return <p className={cn(base, "text-taupe")} aria-live="polite"><RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin" /> Checking for AI-written explanations…</p>;
  if (ai.status === "ok")
    return (
      <p className={cn(base, "text-ink-soft")}>
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
        <span>Products were chosen by CO2&rsquo;s catalogue matcher. The personalized explanations marked &ldquo;AI&rdquo; were written by an AI model{ai.model ? ` (${ai.model})` : ""} from the same product data, and checked for medical claims before showing.</span>
      </p>
    );
  return (
    <p className={cn(base, "text-ink-soft")}>
      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>Matched from CO2&rsquo;s product data by a rules-based engine. {ai.message ?? ""}</span>
    </p>
  );
}

function ProfileCell({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-bone p-5">
      <dt className="text-xs text-taupe">{label}</dt>
      <dd className="mt-1.5 font-display text-2xl leading-tight">{value}</dd>
      {sub && <dd className="mt-1 text-xs text-ink-soft">{sub}</dd>}
    </div>
  );
}

function Thumb({ slug, size = 72, dark }: { slug: string; size?: number; dark?: boolean }) {
  const p = getPickProduct(slug);
  if (!p) return null;
  const key = p.images[0];
  return (
    <span className={cn("photo relative block shrink-0", dark ? "bg-carbon-3" : "")} style={{ width: size, height: size }}>
      {key ? <Image src={productImage(key, 640)} alt="" fill sizes={`${size}px`} className="object-contain" /> : <Vessel product={p} className="h-full w-full" />}
    </span>
  );
}

function RoutineColumn({ title, steps }: { title: string; steps: RoutineStep[] }) {
  return (
    <div>
      <h3 className="flex items-center gap-3 font-display text-3xl">
        {title === "Morning" ? <Sun className="h-5 w-5 text-gold-light" strokeWidth={1.3} /> : <span className="h-4 w-4 rounded-full border border-gold-light bg-[radial-gradient(circle_at_70%_30%,transparent_45%,#E2C68C_46%)]" aria-hidden />}
        {title}
      </h3>
      <ol className="mt-6 space-y-6">
        {steps.map((s, i) => <StepRow key={s.step + i} step={s} n={i + 1} />)}
      </ol>
    </div>
  );
}

function StepRow({ step, n }: { step: RoutineStep; n: number }) {
  const p = step.slug ? getPickProduct(step.slug) : null;
  return (
    <li className="grid grid-cols-[2.25rem_auto_1fr] items-start gap-4">
      <span className="pt-1 font-display text-3xl leading-none text-gold-light tabular-nums">{n}</span>
      {p ? <Thumb slug={p.slug} size={64} dark /> : <span className="grid h-16 w-16 place-items-center border border-dashed border-line-dark text-bone/40"><Sun className="h-5 w-5" strokeWidth={1.2} /></span>}
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-bone/50">{step.step}</p>
        {p ? (
          <Link href={`/product/${p.slug}`} className="mt-1 block text-[1.05rem] font-medium hover:text-gold-light">{p.name}</Link>
        ) : (
          <p className="mt-1 text-[1.05rem] font-medium">Your sunscreen</p>
        )}
        {step.note && <p className="mt-1 text-sm leading-relaxed text-bone/60">{step.note}</p>}
      </div>
    </li>
  );
}

function PickRow({ pick, ai, label }: { pick: Pick; ai: AiLayer; label?: string }) {
  const p = getPickProduct(pick.slug);
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);
  if (!p) return null;
  const aiText = ai.status === "ok" ? ai.explanations?.[p.slug] : undefined;
  return (
    <li className="grid gap-6 py-8 md:grid-cols-[180px_1fr_auto] md:gap-10">
      <Link href={`/product/${p.slug}`} className="block w-40 md:w-auto" tabIndex={-1} aria-hidden>
        <span className="photo relative block aspect-square">
          {p.images[0] ? <Image src={productImage(p.images[0], 640)} alt="" fill sizes="180px" className="object-contain" /> : <Vessel product={p} className="h-full w-full" />}
        </span>
      </Link>
      <div className="max-w-2xl">
        <p className="text-sm text-gold-deep">{label ?? roleLabels[pick.role]}</p>
        <h3 className="mt-1 font-display text-[2rem] leading-none"><Link href={`/product/${p.slug}`} className="hover:text-gold-deep">{p.name}</Link></h3>
        <p className="mt-1 text-sm text-ink-soft">{p.subtitle} · {p.size}</p>
        {aiText && (
          <p className="mt-4 text-[0.98rem] leading-relaxed">
            <span className="mr-2 inline-flex translate-y-[-1px] items-center gap-1 rounded-full border border-gold/50 px-2 py-0.5 align-middle text-[0.6875rem] text-gold-deep"><Sparkles className="h-3 w-3" /> AI</span>
            {aiText}
          </p>
        )}
        <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
          {pick.reasons.map((r) => (
            <li key={r} className="flex gap-2.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf" /><span>{r}</span></li>
          ))}
          {pick.cautions.map((c) => (
            <li key={c} className="flex gap-2.5 text-[#7a2b22]"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{c}</span></li>
          ))}
        </ul>
        {pick.alternates.length > 0 && (
          <p className="mt-4 text-xs text-taupe">
            Also a match:{" "}
            {pick.alternates.map((s, i) => {
              const a = getPickProduct(s);
              return a ? (
                <span key={s}>
                  <Link href={`/product/${s}`} className="text-ink-soft underline underline-offset-4 hover:text-ink">{a.name}</Link>{PRICES_ON_REQUEST ? "" : ` (${money(a.price)})`}{i < pick.alternates.length - 1 ? ", " : ""}
                </span>
              ) : null;
            })}
          </p>
        )}
      </div>
      <div className="flex flex-row items-center gap-3 md:flex-col md:items-end">
        <p className={PRICES_ON_REQUEST ? "text-sm text-taupe" : "text-lg tabular-nums md:text-xl"}>{priceText(p.price)}</p>
        {PRICES_ON_REQUEST ? (
          <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(p.name)} className="btn btn-primary btn-sm" data-request-price>Request price</a>
        ) : (
        <button
          type="button"
          onClick={() => {
            addToCart(p.slug, 1, p.shades[0] ? { shade: p.shades[0].name } : undefined);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1800);
          }}
          className="btn btn-primary btn-sm"
        >
          {added ? <><Check className="h-4 w-4" /> Added</> : <><Plus className="h-4 w-4" /> Add to cart</>}
        </button>
        )}
        <Link href={`/product/${p.slug}`} className="btn btn-ghost text-xs">View product</Link>
      </div>
    </li>
  );
}

function CustomFormulaBlock({ plan }: { plan: Plan }) {
  const c = plan.custom!;
  const p = getPickProduct(c.slug);
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);
  if (!p) return null;
  return (
    <section className="mt-section bg-carbon py-section text-bone grain" aria-labelledby="custom-title">
      <div className="container-site grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Vessel product={p} className="aspect-[4/5] w-full" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="text-sm text-gold-light">Made to order for you</p>
          <h2 id="custom-title" className="mt-3 font-display text-display-sm">{p.name}</h2>
          <p className="mt-3 text-bone/65">{p.shortDescription} Pre-filled from your answers — review every choice before you order.</p>
          <dl className="mt-8 grid grid-cols-2 gap-px border border-line-dark bg-line-dark">
            {Object.entries(c.options).map(([k, v]) => (
              <div key={k} className={cn("bg-carbon p-4", k.startsWith("Ingredient") && "col-span-2")}>
                <dt className="text-xs text-bone/50">{k}</dt>
                <dd className="mt-1">{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-6 space-y-1.5 text-sm text-bone/70">
            {c.reasons.map((r) => <li key={r} className="flex gap-2.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-light" />{r}</li>)}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {PRICES_ON_REQUEST ? (
              <a target="_blank" rel="noopener noreferrer" data-whatsapp-price href={priceWhatsAppHref(`${p.name} — ${Object.entries(c.options).map(([k, v]) => `${k}: ${v}`).join("; ")}`)} className="btn btn-gold" data-request-price>Request formula price</a>
            ) : (
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => {
                addToCart(p.slug, 1, { options: c.options });
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1800);
              }}
            >
              {added ? <><Check className="h-4 w-4" /> Added</> : <>Add formula — {money(p.price)}</>}
            </button>
            )}
            <Link href={`/product/${p.slug}`} className="btn btn-outline-light">Review on product page</Link>
          </div>
          <p className="mt-4 text-xs text-bone/45">Cosmetic personalization only. CO2 confirms the final formula by email before preparing it.</p>
        </div>
      </div>
    </section>
  );
}
