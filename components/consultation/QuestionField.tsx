"use client";

import { Check } from "lucide-react";
import { avoidGroups, ingredientFamilies, type Answers, type IngredientAnswer, type Question } from "@/lib/consultation/questions";
import { cn } from "@/lib/utils";

/* Renders the input for one consultation question. Pure UI — the parent
   owns the answers object and validation. */
export function QuestionField({
  q,
  answers,
  onChange,
  onPicked,
}: {
  q: Question;
  answers: Answers;
  onChange: (patch: Partial<Answers>) => void;
  /** called after a single-choice pick (used for auto-advance) */
  onPicked?: () => void;
}) {
  const value = answers[q.id];

  if (q.type === "single") {
    return (
      <div role="radiogroup" aria-labelledby="c-title" className={cn("grid gap-2.5", (q.options?.length ?? 0) > 4 ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
        {q.options!.map((o, i) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              data-key={i + 1}
              onClick={() => {
                onChange({ [q.id]: o.id } as Partial<Answers>);
                onPicked?.();
              }}
              className={cn(
                "group relative flex min-h-[4.25rem] items-center gap-4 border px-5 py-4 text-left transition-colors duration-300",
                on ? "border-ink bg-ink text-bone" : "border-line bg-bone hover:border-ink",
              )}
            >
              <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border", on ? "border-gold-light bg-gold-light text-carbon" : "border-taupe/60")} aria-hidden>
                {on && <Check className="h-3 w-3" strokeWidth={2.5} />}
              </span>
              <span className="flex-1">
                <span className="block text-[0.98rem] font-medium leading-snug">{o.label}</span>
                {o.hint && <span className={cn("mt-0.5 block text-[0.8125rem] leading-snug", on ? "text-bone/65" : "text-ink-soft")}>{o.hint}</span>}
              </span>
              {i < 9 && <kbd className={cn("hidden font-sans text-[0.6875rem] tabular-nums lg:block", on ? "text-bone/45" : "text-taupe/70")}>{i + 1}</kbd>}
            </button>
          );
        })}
      </div>
    );
  }

  if (q.type === "multi") {
    const arr = (Array.isArray(value) ? value : []) as string[];
    const toggle = (id: string) => {
      let next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      if (q.exclusive) next = id === q.exclusive ? (next.includes(id) ? [id] : []) : next.filter((x) => x !== q.exclusive);
      if (q.max && next.length > q.max) next = next.slice(next.length - q.max);
      onChange({ [q.id]: next } as Partial<Answers>);
    };
    if (q.big) {
      return (
        <div role="group" aria-labelledby="c-title" className="grid gap-2.5 sm:grid-cols-2">
          {q.options!.map((o) => {
            const on = arr.includes(o.id);
            return (
              <button key={o.id} type="button" aria-pressed={on} onClick={() => toggle(o.id)} className={cn("flex min-h-[5.5rem] items-start gap-4 border p-5 text-left transition-colors duration-300", on ? "border-ink bg-ink text-bone" : "border-line hover:border-ink")}>
                <span className={cn("mt-1 grid h-5 w-5 shrink-0 place-items-center border", on ? "border-gold-light bg-gold-light text-carbon" : "border-taupe/60")} aria-hidden>
                  {on && <Check className="h-3 w-3" strokeWidth={2.5} />}
                </span>
                <span>
                  <span className="block font-display text-[1.75rem] leading-none">{o.label}</span>
                  {o.hint && <span className={cn("mt-2 block text-[0.8125rem]", on ? "text-bone/65" : "text-ink-soft")}>{o.hint}</span>}
                </span>
              </button>
            );
          })}
        </div>
      );
    }
    return (
      <div role="group" aria-labelledby="c-title" className="flex flex-wrap gap-2">
        {q.options!.map((o) => {
          const on = arr.includes(o.id);
          const rank = q.max ? arr.indexOf(o.id) : -1;
          return (
            <button key={o.id} type="button" aria-pressed={on} onClick={() => toggle(o.id)} className="chip h-11 px-5 text-[0.875rem]">
              {on && (rank >= 0 ? <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-light text-[0.6875rem] font-semibold text-carbon">{rank + 1}</span> : <Check className="h-3.5 w-3.5" />)}
              {o.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (q.type === "scale") {
    const idx = q.options!.findIndex((o) => o.id === value);
    return (
      <div role="radiogroup" aria-labelledby="c-title" className="relative pt-2">
        <div className="absolute left-[12.5%] right-[12.5%] top-[1.55rem] h-px bg-line" aria-hidden />
        <div className="absolute left-[12.5%] top-[1.55rem] h-px bg-ink transition-[width] duration-500 ease-expo" style={{ width: idx > 0 ? `${(idx / (q.options!.length - 1)) * 75}%` : 0 }} aria-hidden />
        <div className="relative grid grid-cols-4">
          {q.options!.map((o, i) => {
            const on = value === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={on}
                data-key={i + 1}
                onClick={() => {
                  onChange({ [q.id]: o.id } as Partial<Answers>);
                  onPicked?.();
                }}
                className="group flex flex-col items-center gap-3 px-1 text-center"
              >
                <span className={cn("grid h-7 w-7 place-items-center rounded-full border bg-bone transition-all duration-300", on ? "scale-110 border-ink bg-ink" : i <= idx ? "border-ink" : "border-taupe/50 group-hover:border-ink")}>
                  {on && <span className="h-2 w-2 rounded-full bg-gold-light" />}
                </span>
                <span className={cn("text-[0.8125rem] leading-tight sm:text-sm", on ? "font-medium text-ink" : "text-ink-soft")}>{o.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (q.type === "text") {
    const v = (value as string) ?? "";
    const isName = q.id === "name";
    return (
      <div>
        <label htmlFor={`c-${q.id}`} className="sr-only">{q.title}</label>
        {isName ? (
          <input id={`c-${q.id}`} className="input h-14 max-w-md text-lg" autoComplete="given-name" maxLength={40} value={v} placeholder="First name" onChange={(e) => onChange({ name: e.target.value })} />
        ) : (
          <>
            <textarea id={`c-${q.id}`} className="input min-h-[9rem]" maxLength={1200} value={v} placeholder="e.g. I love gel textures, my skin gets drier in winter, I'm getting married in March…" onChange={(e) => onChange({ notes: e.target.value })} />
            <p className="mt-1.5 text-right text-xs tabular-nums text-taupe">{v.length} / 1200</p>
          </>
        )}
      </div>
    );
  }

  if (q.type === "routine") {
    const arr = answers.currentProducts ?? [];
    return (
      <div className="space-y-6">
        <div role="group" aria-label="Products you use now" className="flex flex-wrap gap-2">
          {q.options!.map((o) => {
            const on = arr.includes(o.id);
            return (
              <button key={o.id} type="button" aria-pressed={on} className="chip h-11 px-5 text-[0.875rem]" onClick={() => onChange({ currentProducts: on ? arr.filter((x) => x !== o.id) : [...arr, o.id] })}>
                {on && <Check className="h-3.5 w-3.5" />}
                {o.label}
              </button>
            );
          })}
        </div>
        <div className="field">
          <label htmlFor="c-routineText" className="label">Describe your routine (optional)</label>
          <textarea id="c-routineText" className="input min-h-[6.5rem]" maxLength={600} value={answers.routineText ?? ""} placeholder="e.g. Gel cleanser twice a day, a vitamin C serum I like, and SPF 50. Clay masks dry me out." onChange={(e) => onChange({ routineText: e.target.value })} />
        </div>
      </div>
    );
  }

  if (q.type === "ingredients") {
    const v: IngredientAnswer = answers.ingredients ?? { prefer: [], avoid: [] };
    const set = (patch: Partial<IngredientAnswer>) => onChange({ ingredients: { ...v, ...patch } });
    return (
      <div className="space-y-8">
        <fieldset>
          <legend className="label mb-3">Ingredients I like</legend>
          <div className="flex flex-wrap gap-2">
            {ingredientFamilies.map((f) => {
              const on = v.prefer.includes(f.id);
              return (
                <button key={f.id} type="button" aria-pressed={on} className="chip h-10 px-4" onClick={() => set({ prefer: on ? v.prefer.filter((x) => x !== f.id) : [...v.prefer, f.id] })}>
                  {on && <Check className="h-3.5 w-3.5" />}
                  {f.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label mb-3">Ingredients to avoid</legend>
          <div className="flex flex-wrap gap-2">
            {avoidGroups.map((g) => {
              const on = v.avoid.includes(g.id);
              return (
                <button key={g.id} type="button" aria-pressed={on} title={g.hint} className={cn("chip h-10 px-4", on && "!border-[#7a2b22] !bg-[#7a2b22]")} onClick={() => set({ avoid: on ? v.avoid.filter((x) => x !== g.id) : [...v.avoid, g.id] })}>
                  {on && <span aria-hidden>×</span>}
                  {g.label}
                  {g.hint && <span className={cn("text-xs", on ? "text-bone/60" : "text-taupe")}>{g.hint}</span>}
                </button>
              );
            })}
          </div>
          <div className="field mt-4 max-w-md">
            <label htmlFor="c-avoidText" className="label">Anything else to avoid</label>
            <input id="c-avoidText" className="input" maxLength={160} value={v.avoidText ?? ""} placeholder="e.g. honey, turmeric" onChange={(e) => set({ avoidText: e.target.value })} />
          </div>
        </fieldset>
      </div>
    );
  }

  return null;
}
