"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Pencil, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlowField } from "@/components/miy/FlowField";
import { answerLabel, getFlow, isAnswered, pruneAnswers, visibleQuestions, type Answers, type FlowId } from "@/lib/customize/flows";
import { recommend } from "@/lib/customize/recommend";
import { miy, notifyMiy } from "@/lib/customize/store";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   Category consultation — one question per screen, adapting to the
   answers (conditional questions and options), with a progress rail,
   back/next, validation, local draft saving, a review screen with
   per-answer editing, and loading / error states before results.
------------------------------------------------------------------- */

type Phase = "questions" | "review" | "working" | "error";

export function Consultation({ flowId }: { flowId: FlowId }) {
  const flow = getFlow(flowId)!;
  const router = useRouter();
  const sp = useSearchParams();
  const reduce = useReducedMotion();
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("questions");
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [dir, setDir] = useState(1);
  const [returnToReview, setReturnToReview] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<number>(0);
  const lastMove = useRef(0);

  const qs = useMemo(() => visibleQuestions(flow, answers), [flow, answers]);
  const q = qs[Math.min(step, qs.length - 1)];
  const answeredCount = qs.filter((x) => isAnswered(x, answers) && answers[x.id] != null).length;
  const pct = phase === "review" || phase === "working" ? 100 : Math.round((step / qs.length) * 100);

  // restore draft (or a finished result's answers when editing)
  useEffect(() => {
    const edit = sp.get("edit");
    const d = miy.draft(flowId);
    const done = miy.result(flowId);
    const base = d?.answers ?? (edit && done ? done.answers : null);
    if (base) {
      setAnswers(base);
      const vis = visibleQuestions(flow, base);
      if (edit) {
        const i = vis.findIndex((x) => x.id === edit);
        setStep(i >= 0 ? i : 0);
        setReturnToReview(true);
      } else if (sp.get("review") === "1") {
        setPhase("review");
      } else {
        setStep(Math.min(d?.step ?? 0, vis.length - 1));
        setRestored(!!d && Object.keys(d.answers).length > 0);
      }
    }
    setHydrated(true);
  }, [flowId]); // eslint-disable-line react-hooks/exhaustive-deps

  // save draft
  useEffect(() => {
    if (!hydrated) return;
    if (Object.keys(answers).length) miy.setDraft(flowId, { answers, step, updatedAt: new Date().toISOString() });
  }, [answers, step, hydrated, flowId]);

  // move focus to the question title on every step change (screen readers + keyboard)
  useEffect(() => {
    if (hydrated) titleRef.current?.focus({ preventScroll: true });
  }, [step, phase, hydrated]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  function change(patch: Answers) {
    setError(null);
    setAnswers((a) => pruneAnswers(flow, { ...a, ...patch }));
  }

  function go(i: number) {
    window.clearTimeout(advanceTimer.current);
    lastMove.current = Date.now();
    setDir(i > step ? 1 : -1);
    setStep(Math.max(0, Math.min(i, qs.length - 1)));
    if (typeof window !== "undefined" && window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  function next() {
    if (!q) return;
    // ignore a Next press that lands while the previous auto-advance is still animating
    if (Date.now() - lastMove.current < 650) return;
    if (!isAnswered(q, answers)) {
      setError(q.type === "shade" ? "Please choose a depth and an undertone." : q.type === "multi" ? "Choose at least one option to continue." : "Choose an option to continue.");
      return;
    }
    if (returnToReview || step >= qs.length - 1) {
      setReturnToReview(false);
      setDir(1);
      setPhase("review");
      return;
    }
    go(step + 1);
  }

  function back() {
    if (phase === "review") {
      setPhase("questions");
      setStep(qs.length - 1);
      return;
    }
    if (step === 0) router.push("/make-it-yours");
    else go(step - 1);
  }

  async function submit() {
    const missing = qs.find((x) => !isAnswered(x, answers));
    if (missing) {
      setPhase("questions");
      setStep(qs.indexOf(missing));
      setError("This question still needs an answer.");
      return;
    }
    setPhase("working");
    try {
      const result = recommend(flowId, answers);
      await new Promise((r) => setTimeout(r, reduce ? 150 : 1100));
      miy.setResult(flowId, { answers, result });
      miy.setDraft(flowId, null);
      notifyMiy();
      router.push(`/make-it-yours/${flowId}/results`);
    } catch (e) {
      console.error(e);
      setError("Something went wrong while building your routine. Your answers are saved — please try again.");
      setPhase("error");
    }
  }

  function startOver() {
    miy.setDraft(flowId, null);
    setAnswers({});
    setStep(0);
    setPhase("questions");
    setRestored(false);
    setError(null);
  }

  if (!hydrated) {
    return <div className="container-site grid min-h-[60vh] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-taupe" aria-label="Loading consultation" /></div>;
  }

  return (
    <div className="container-site pb-section">
      {/* progress */}
      <div className="sticky-under-nav sticky z-20 -mx-gutter border-b border-line bg-bone/95 px-gutter py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="eyebrow text-taupe">{flow.label} consultation</span>
          <span className="tabular-nums text-ink-soft" aria-live="polite">
            {phase === "questions" ? `Question ${step + 1} of ${qs.length}` : phase === "review" ? "Review your answers" : "Building your routine"}
          </span>
        </div>
        <div className="mt-2.5 h-[3px] w-full overflow-hidden bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Consultation progress">
          <motion.div className="h-full bg-gold" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* rail */}
        <aside className="hidden lg:col-span-3 lg:block">
          <ol className="sticky top-[calc(var(--nav-h)+5.5rem)] space-y-1 border-l border-line">
            {qs.map((x, i) => {
              const done = isAnswered(x, answers) && answers[x.id] != null;
              const current = phase === "questions" && i === step;
              const reachable = done || i <= answeredCount;
              return (
                <li key={x.id}>
                  <button
                    type="button"
                    disabled={!reachable || phase === "working"}
                    onClick={() => {
                      setPhase("questions");
                      go(i);
                    }}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "-ml-px flex w-full items-center gap-3 border-l py-2 pl-4 text-left text-sm transition-colors",
                      current ? "border-ink font-medium text-ink" : done ? "border-transparent text-ink-soft hover:text-ink" : "border-transparent text-taupe/70",
                    )}
                  >
                    <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.625rem] tabular-nums", done ? "bg-ink text-bone" : current ? "border border-ink" : "border border-line")}>
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    {x.short}
                  </button>
                </li>
              );
            })}
            <li>
              <button type="button" disabled={answeredCount < qs.length} onClick={() => setPhase("review")} className={cn("-ml-px flex w-full items-center gap-3 border-l py-2 pl-4 text-left text-sm", phase === "review" ? "border-ink font-medium" : "border-transparent text-taupe")}>
                <span className="grid h-5 w-5 place-items-center rounded-full border border-line text-[0.625rem]">✦</span> Review
              </button>
            </li>
          </ol>
        </aside>

        <div className="lg:col-span-8 lg:col-start-5">
          {restored && phase === "questions" && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-line bg-bone-2 px-4 py-3 text-sm">
              <span>Welcome back — we saved your answers on this device.</span>
              <button type="button" onClick={startOver} className="inline-flex items-center gap-1.5 underline underline-offset-4"><RotateCcw className="h-3.5 w-3.5" /> Start over</button>
            </div>
          )}

          <AnimatePresence mode="wait" initial={false} custom={dir}>
            {phase === "questions" && q && (
              <motion.section
                key={q.id}
                custom={dir}
                initial={reduce ? false : { opacity: 0, x: dir * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: dir * -28 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                aria-labelledby="q-title"
              >
                <p className="eyebrow text-gold-deep">{String(step + 1).padStart(2, "0")} · {q.short}{q.optional ? " · optional" : ""}</p>
                <h2 id="q-title" ref={titleRef} tabIndex={-1} className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] outline-none">{q.title}</h2>
                {q.help && <p className="mt-4 max-w-2xl text-[0.94rem] leading-relaxed text-ink-soft">{q.help}</p>}
                <div className="mt-8">
                  <FlowField
                    q={q}
                    answers={answers}
                    onChange={change}
                    onPicked={() => {
                      if (returnToReview) return;
                      window.clearTimeout(advanceTimer.current);
                      advanceTimer.current = window.setTimeout(() => {
                        if (step < qs.length - 1) go(step + 1);
                      }, reduce ? 0 : 380);
                    }}
                  />
                </div>
                {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
                <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
                  <button type="button" onClick={back} className="btn btn-outline"><ArrowLeft className="h-4 w-4" /> {step === 0 ? "All categories" : "Back"}</button>
                  <div className="flex items-center gap-3">
                    {q.optional && !answers[q.id] && step < qs.length - 1 && (
                      <button type="button" onClick={() => go(step + 1)} className="btn btn-ghost text-sm">Skip</button>
                    )}
                    <button type="button" onClick={next} className="btn btn-primary">
                      {returnToReview ? "Back to review" : step >= qs.length - 1 ? "Review answers" : "Next"} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {phase === "review" && (
              <motion.section key="review" initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} aria-labelledby="q-title">
                <p className="eyebrow text-gold-deep">Almost there</p>
                <h2 id="q-title" ref={titleRef} tabIndex={-1} className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] outline-none">Review your answers.</h2>
                <p className="mt-4 max-w-2xl text-ink-soft">Change anything before we build your routine. You&apos;ll see your suggested routine next — nothing is added to your bag.</p>
                <dl className="mt-8 divide-y divide-line border-y border-line">
                  {qs.map((x, i) => (
                    <div key={x.id} className="grid grid-cols-[1fr_auto] items-start gap-4 py-4 sm:grid-cols-[12rem_1fr_auto]">
                      <dt className="text-xs uppercase tracking-[0.14em] text-taupe sm:pt-0.5">{x.short}</dt>
                      <dd className="col-span-2 row-start-2 text-[0.95rem] sm:col-span-1 sm:row-start-auto">{answerLabel(x, answers)}</dd>
                      <dd className="col-start-2 row-start-1 sm:col-start-3">
                        <button
                          type="button"
                          onClick={() => {
                            setPhase("questions");
                            setReturnToReview(true);
                            go(i);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs underline underline-offset-4"
                          aria-label={`Edit ${x.short}`}
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-xs leading-relaxed text-taupe">Your answers are stored only in this browser so you can come back to them. CO2 suggestions are cosmetic and don&apos;t replace advice from a dermatologist.</p>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <button type="button" onClick={back} className="btn btn-outline"><ArrowLeft className="h-4 w-4" /> Back</button>
                  <button type="button" onClick={submit} className="btn btn-primary btn-lg">Show my routine <ArrowRight className="h-4 w-4" /></button>
                </div>
              </motion.section>
            )}

            {phase === "working" && (
              <motion.section key="working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid min-h-[50vh] place-items-center text-center" aria-live="assertive" aria-busy="true">
                <div>
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold" aria-hidden />
                  <h2 ref={titleRef} tabIndex={-1} className="mt-6 font-display text-4xl outline-none">Building your routine…</h2>
                  <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm text-ink-soft">
                    {["Reading your answers", "Leaving out ingredients you avoid", `Matching ${flow.label.toLowerCase()} products from the CO2 range`, "Putting the steps in order"].map((t, i) => (
                      <motion.li key={t} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduce ? 0 : i * 0.22 }} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-gold-deep" /> {t}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.section>
            )}

            {phase === "error" && (
              <motion.section key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-red-200 bg-red-50 p-8">
                <h2 ref={titleRef} tabIndex={-1} className="font-display text-3xl outline-none">We couldn&apos;t build your routine.</h2>
                <p role="alert" className="mt-3 text-sm text-red-800">{error}</p>
                <div className="mt-6 flex gap-3">
                  <button type="button" onClick={submit} className="btn btn-primary">Try again</button>
                  <button type="button" onClick={() => setPhase("review")} className="btn btn-outline">Back to review</button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <p className="mt-12 text-xs text-taupe">
            Not the right category? <Link href="/make-it-yours#start" className="underline underline-offset-4">Choose another</Link> · Your progress is saved on this device.
          </p>
        </div>
      </div>
    </div>
  );
}
