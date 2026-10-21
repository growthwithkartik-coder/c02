"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Pencil, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QuestionField } from "./QuestionField";
import { PhotoSuggest } from "./PhotoSuggest";
import { Logo } from "@/components/ui/Logo";
import {
  answerText,
  chapters,
  isAnswered,
  progressOf,
  sanitizeAnswers,
  visibleQuestions,
  type Answers,
  type Question,
} from "@/lib/consultation/questions";
import { buildPlan } from "@/lib/consultation/engine";
import { readDraft, readResult, useAiStatus, writeDraft, writeResult } from "@/lib/consultation/store";
import { cn, productImage } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type View = { kind: "intro" } | { kind: "q"; id: string } | { kind: "review" };

function viewFromParams(sp: URLSearchParams): View {
  const q = sp.get("q");
  if (q === "review") return { kind: "review" };
  if (q) return { kind: "q", id: q };
  return { kind: "intro" };
}

export function ConsultationFlow() {
  const router = useRouter();
  const sp = useSearchParams();
  const reduce = useReducedMotion();
  const status = useAiStatus();
  const [answers, setAnswers] = useState<Answers>({});
  const [loaded, setLoaded] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dir, setDir] = useState(1);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const autoTimer = useRef<number | undefined>(undefined);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const view = viewFromParams(new URLSearchParams(sp.toString()));
  const vq = useMemo(() => visibleQuestions(answers), [answers]);
  const idx = view.kind === "q" ? vq.findIndex((q) => q.id === view.id) : -1;
  const q: Question | undefined = idx >= 0 ? vq[idx] : undefined;
  const progress = progressOf(answers);

  /* ---------- load draft / handle ?restart and ?edit ---------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prev = readResult();
    setHasResult(!!prev);
    if (params.get("restart") === "1") {
      writeDraft(null);
      setAnswers({});
      window.history.replaceState(null, "", `?q=${visibleQuestions({})[0].id}`);
    } else {
      const d = readDraft();
      const base = d?.answers ?? prev?.answers ?? {};
      setAnswers(base);
      const edit = params.get("edit");
      if (edit) {
        setEditing(true);
        window.history.replaceState(null, "", edit === "review" ? "?q=review" : `?q=${edit}`);
      }
    }
    setLoaded(true);
  }, []);

  // persist as you go
  useEffect(() => {
    if (loaded) writeDraft({ answers, updatedAt: new Date().toISOString() });
  }, [answers, loaded]);

  // unknown / hidden question id in the URL → first unanswered
  useEffect(() => {
    if (!loaded || view.kind !== "q" || q) return;
    const first = vq.find((x) => !isAnswered(x, answers)) ?? vq[0];
    window.history.replaceState(null, "", `?q=${first.id}`);
  }, [loaded, view, q, vq, answers]);

  // focus the question title on change (screen readers + keyboard)
  useEffect(() => {
    setError(null);
    if (loaded && view.kind !== "intro") titleRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    return () => window.clearTimeout(autoTimer.current);
  }, [view.kind, q?.id, loaded, reduce]);

  const go = useCallback((v: View, d = 1) => {
    setDir(d);
    const url = v.kind === "intro" ? window.location.pathname : `?q=${v.kind === "review" ? "review" : v.id}`;
    window.history.pushState(null, "", url);
  }, []);

  const patch = useCallback((p: Partial<Answers>) => {
    setAnswers((a) => {
      const next = { ...a, ...p };
      if (p.areas && !p.areas.length) next.areas = [];
      return next;
    });
    setError(null);
  }, []);

  const next = useCallback(() => {
    window.clearTimeout(autoTimer.current);
    if (view.kind === "intro") return go({ kind: "q", id: vq[0].id });
    if (!q) return;
    if (!isAnswered(q, answers)) {
      setError(q.type === "multi" ? "Choose at least one option to continue." : "Choose an answer to continue.");
      return;
    }
    if (editing) return go({ kind: "review" });
    const nvq = visibleQuestions(answers);
    const i = nvq.findIndex((x) => x.id === q.id);
    if (i === nvq.length - 1) return go({ kind: "review" });
    go({ kind: "q", id: nvq[i + 1].id });
  }, [view.kind, q, answers, editing, go, vq]);

  const back = useCallback(() => {
    window.clearTimeout(autoTimer.current);
    if (view.kind === "review") return go({ kind: "q", id: vq[vq.length - 1].id }, -1);
    if (idx <= 0) return go({ kind: "intro" }, -1);
    go({ kind: "q", id: vq[idx - 1].id }, -1);
  }, [view.kind, idx, vq, go]);

  const onPicked = useCallback(() => {
    if (editing) return;
    window.clearTimeout(autoTimer.current);
    autoTimer.current = window.setTimeout(() => {
      document.getElementById("c-next")?.click();
    }, 420);
  }, [editing]);

  // keyboard: 1–9 picks an option, Enter = next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (view.kind !== "q" || !q) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select")) return;
      if (/^[1-9]$/.test(e.key) && (q.type === "single" || q.type === "scale")) {
        const btn = document.querySelector<HTMLButtonElement>(`[data-key="${e.key}"]`);
        btn?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view.kind, q]);

  function restart() {
    writeDraft(null);
    setAnswers({});
    setEditing(false);
    go({ kind: "q", id: visibleQuestions({})[0].id });
  }

  async function finish() {
    const clean = sanitizeAnswers(answers);
    const missing = visibleQuestions(clean).find((x) => !isAnswered(x, clean));
    if (missing) {
      setEditing(false);
      go({ kind: "q", id: missing.id });
      return;
    }
    setSubmitting(true);
    const plan = buildPlan(clean);
    const prev = readResult();
    writeResult({ answers: clean, plan, ai: { status: "pending" }, extras: prev?.extras ?? [], savedAt: new Date().toISOString() });
    router.push("/customized-skincare/results");
  }

  if (!loaded) return <div className="min-h-[100svh] bg-bone" aria-busy="true" />;

  /* ---------- intro ---------- */
  if (view.kind === "intro") {
    const started = progress.done > 0 && !progress.complete;
    return (
      <section className="relative overflow-hidden bg-bone">
        <div className="container-site grid min-h-[100svh] items-center gap-12 pb-16 pt-[calc(var(--nav-h)+2.5rem)] lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow text-gold-deep">Customized Skincare</p>
            <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.03em]">A routine built from what your skin tells us.</h1>
            <p className="lead mt-7 max-w-xl text-ink-soft">
              Answer a short consultation about your skin, goals and preferences. We&rsquo;ll match you to CO2 products, explain why each one was chosen, and lay out the order to use them in — morning, evening and weekly.
            </p>
            <ul className="mt-8 grid max-w-xl gap-3 text-sm text-ink-soft sm:grid-cols-2">
              <li className="border-t border-line pt-3"><b className="block font-medium text-ink">About three minutes</b>Around eighteen quick questions.</li>
              <li className="border-t border-line pt-3"><b className="block font-medium text-ink">No account needed</b>Answers are saved on this device as you go.</li>
              <li className="border-t border-line pt-3"><b className="block font-medium text-ink">Only real CO2 products</b>Every pick comes from the CO2 catalogue and its pack details.</li>
              <li className="border-t border-line pt-3">
                <b className="block font-medium text-ink">{status?.recommendations ? "AI-written explanations" : "Catalogue-matched"}</b>
                {status?.recommendations ? "An AI model explains your matches; it can't add products." : "Matched from pack data. AI explanations aren't switched on yet."}
              </li>
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button type="button" id="c-next" onClick={() => go({ kind: "q", id: started ? (vq.find((x) => !isAnswered(x, answers))?.id ?? vq[0].id) : vq[0].id })} className="btn btn-primary btn-lg">
                {started ? `Continue — ${progress.pct}% done` : "Start the consultation"} <ArrowRight className="h-4 w-4" />
              </button>
              {started && (
                <button type="button" onClick={restart} className="btn btn-outline btn-lg">
                  Start again
                </button>
              )}
              {hasResult && (
                <Link href="/customized-skincare/results" className="btn btn-ghost">
                  View your last results
                </Link>
              )}
            </div>
            <p className="mt-8 max-w-lg text-xs leading-relaxed text-taupe">
              Recommendations are cosmetic and informational. They aren&rsquo;t a diagnosis or a substitute for advice from a dermatologist or doctor.
            </p>
          </div>

          <div className="relative hidden h-[72vh] max-h-[680px] lg:col-span-6 lg:block" aria-hidden>
            <div className="photo absolute right-0 top-0 h-[64%] w-[58%]">
              <Image src={productImage("24k-gold-face-elixir-1")} alt="" fill sizes="30vw" className="object-contain" priority />
            </div>
            <div className="photo absolute bottom-0 left-[6%] h-[52%] w-[46%]">
              <Image src={productImage("night-cream-1")} alt="" fill sizes="25vw" className="object-contain" />
            </div>
            <div className="photo absolute bottom-[8%] right-[6%] h-[30%] w-[30%]">
              <Image src={productImage("red-grapes-face-wash-1", 640)} alt="" fill sizes="18vw" className="object-contain" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- question / review shell ---------- */
  const chapter = q ? chapters.find((c) => c.id === q.chapter) : null;
  const isLast = q ? idx === vq.length - 1 : false;

  return (
    <div className="bg-bone lg:grid lg:min-h-[100svh] lg:grid-cols-[minmax(300px,380px)_1fr] lg:pt-[var(--nav-h)]">
      {/* live skin profile — the card writes itself as you answer */}
      <aside className="hidden bg-carbon text-bone lg:block" aria-label="Your skin profile so far">
        <div className="sticky top-[var(--nav-h)] flex h-[calc(100svh-var(--nav-h))] flex-col overflow-y-auto px-8 pb-8 pt-8 no-scrollbar">
          <div className="flex items-center gap-3">
            <Logo size={34} />
            <div>
              <p className="font-display text-2xl leading-none">Your skin profile</p>
              <p className="mt-1 text-xs text-bone/50">Filled in as you answer</p>
            </div>
          </div>
          <div className="mt-6 h-px bg-line-dark">
            <div className="h-px bg-gold-light transition-[width] duration-700 ease-expo" style={{ width: `${progress.pct}%` }} />
          </div>
          <p className="mt-2 text-xs tabular-nums text-bone/50">{progress.done} of {progress.total} answered</p>

          <div className="mt-6 space-y-6">
            {chapters.map((c) => {
              const qs = vq.filter((x) => x.chapter === c.id);
              if (!qs.length) return null;
              return (
                <div key={c.id}>
                  <p className={cn("text-xs uppercase tracking-[0.18em]", chapter?.id === c.id ? "text-gold-light" : "text-bone/40")}>{c.label}</p>
                  <ul className="mt-2 space-y-0.5">
                    {qs.map((x) => {
                      const done = x.optional ? answerText(x, answers) !== "—" : isAnswered(x, answers);
                      const cur = q?.id === x.id;
                      return (
                        <li key={x.id}>
                          <button
                            type="button"
                            onClick={() => go({ kind: "q", id: x.id }, vq.indexOf(x) < idx ? -1 : 1)}
                            className={cn("grid w-full grid-cols-[7.5rem_1fr] gap-3 py-1 text-left text-[0.8125rem] transition-colors", cur ? "text-bone" : "text-bone/55 hover:text-bone")}
                            aria-current={cur ? "step" : undefined}
                          >
                            <span className={cn("truncate", cur && "underline decoration-gold-light underline-offset-4")}>{x.short}</span>
                            <span className={cn("truncate", done ? "text-bone/85" : "text-bone/25")}>{done ? answerText(x, answers) : "—"}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="mt-auto pt-8 text-[0.6875rem] leading-relaxed text-bone/40">
            Cosmetic personalization only — not a diagnosis. Saved on this device.
          </p>
        </div>
      </aside>

      <div className="flex min-h-[100svh] flex-col lg:min-h-[calc(100svh-var(--nav-h))]">
        {/* top bar */}
        <div className="container-site w-full max-w-4xl pt-[calc(var(--nav-h)+1.25rem)] lg:mx-0 lg:px-14 lg:pt-8 xl:px-20">
          <div className="flex items-center gap-4 text-xs text-ink-soft">
            <span className="tabular-nums">{view.kind === "review" ? "Review" : `${String(idx + 1).padStart(2, "0")} / ${vq.length}`}</span>
            <div className="h-px flex-1 bg-line" role="progressbar" aria-label="Consultation progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.pct}>
              <div className="h-px bg-ink transition-[width] duration-700 ease-expo" style={{ width: `${view.kind === "review" ? 100 : progress.pct}%` }} />
            </div>
            <span className="tabular-nums">{view.kind === "review" ? 100 : progress.pct}%</span>
          </div>
        </div>

        <div className="container-site w-full max-w-4xl flex-1 pb-36 pt-10 lg:mx-0 lg:px-14 lg:pb-16 xl:px-20">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={view.kind === "q" ? q?.id : view.kind}
              custom={dir}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -28 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {view.kind === "q" && q && (
                <>
                  <p className="text-sm text-gold-deep">
                    {chapter?.label}
                    {q.type === "multi" && !q.max && <span className="text-taupe"> — choose all that apply</span>}
                    {q.optional && <span className="text-taupe"> — optional</span>}
                  </p>
                  <h1 id="c-title" ref={titleRef} tabIndex={-1} className="mt-3 max-w-3xl font-display text-[clamp(2.25rem,4.6vw,4rem)] leading-[0.98] tracking-[-0.02em] outline-none">
                    {q.title}
                  </h1>
                  {q.help && <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ink-soft">{q.help}</p>}
                  <div className="mt-9">
                    <QuestionField q={q} answers={answers} onChange={patch} onPicked={q.type === "single" || q.type === "scale" ? onPicked : undefined} />
                  </div>
                  {q.id === "skinType" && answers.skinType === "unsure" && (
                    <p className="mt-5 max-w-2xl text-sm text-ink-soft">No problem — your answer to the next question, about how your skin feels after cleansing, will set the direction.</p>
                  )}
                  {q.id === "skinType" && <PhotoSuggest status={status} onApply={patch} />}
                  {q.note && <p className="mt-6 max-w-2xl border-l-2 border-gold pl-4 text-sm leading-relaxed text-ink-soft">{q.note}</p>}
                  {error && (
                    <p role="alert" className="mt-6 text-sm font-medium text-[#7a2b22]">
                      {error}
                    </p>
                  )}
                </>
              )}

              {view.kind === "review" && (
                <Review answers={answers} vq={vq} titleRef={titleRef} onRestart={restart} onEdit={(id) => { setEditing(true); go({ kind: "q", id }, -1); }} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* step navigation — sticky on mobile */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bone/95 pb-safe pt-3 backdrop-blur lg:sticky lg:bottom-0">
          <div className="container-site flex w-full max-w-4xl items-center justify-between gap-3 lg:mx-0 lg:px-14 xl:px-20">
            <button type="button" onClick={back} className="btn btn-ghost h-12 gap-2 px-1 no-underline hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {view.kind === "review" ? (
              <button type="button" onClick={finish} disabled={submitting} className="btn btn-gold h-12 px-6 sm:btn-lg">
                {submitting ? "Building your routine…" : "See my routine"} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="flex items-center gap-3">
                {editing && (
                  <button type="button" onClick={() => go({ kind: "review" })} className="btn btn-ghost hidden sm:inline-flex">
                    Back to review
                  </button>
                )}
                <button type="button" id="c-next" onClick={next} className="btn btn-primary h-12 px-6 sm:btn-lg">
                  {editing ? "Save answer" : q?.optional && !isAnswered({ ...q, optional: false }, answers) && q.type !== "ingredients" && q.type !== "routine" ? "Skip" : isLast ? "Review answers" : "Next"} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Review({ answers, vq, onEdit, onRestart, titleRef }: { answers: Answers; vq: Question[]; onEdit: (id: string) => void; onRestart: () => void; titleRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <div>
      <p className="text-sm text-gold-deep">Nearly there</p>
      <h1 ref={titleRef} tabIndex={-1} className="mt-3 font-display text-[clamp(2.25rem,4.6vw,4rem)] leading-[0.98] tracking-[-0.02em] outline-none">
        Check your answers.
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">Change anything before we build your routine. You can also edit later from your results.</p>
      <div className="mt-10 space-y-10">
        {chapters.map((c) => {
          const qs = vq.filter((x) => x.chapter === c.id);
          if (!qs.length) return null;
          return (
            <section key={c.id} aria-labelledby={`rv-${c.id}`}>
              <h2 id={`rv-${c.id}`} className="font-display text-2xl">{c.label}</h2>
              <dl className="mt-3 divide-y divide-line border-y border-line">
                {qs.map((q) => {
                  const done = isAnswered(q, answers);
                  return (
                    <div key={q.id} className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 py-3 sm:grid-cols-[12rem_1fr_auto]">
                      <dt className="text-sm text-taupe">{q.short}</dt>
                      <dd className={cn("col-span-2 row-start-2 text-[0.95rem] sm:col-span-1 sm:row-start-auto", !done && "text-[#7a2b22]")}>
                        {done || q.optional ? answerText(q, answers) : "Needs an answer"}
                      </dd>
                      <dd className="row-start-1 sm:row-start-auto">
                        <button type="button" onClick={() => onEdit(q.id)} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-ink-soft hover:text-ink" aria-label={`Edit ${q.short}`}>
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          );
        })}
      </div>
      <p className="mt-8 flex items-center gap-2 text-xs text-taupe">
        <Check className="h-3.5 w-3.5" /> Saved on this device.{" "}
        <button type="button" onClick={onRestart} className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-ink">
          <RotateCcw className="h-3 w-3" /> Start again
        </button>
      </p>
    </div>
  );
}
