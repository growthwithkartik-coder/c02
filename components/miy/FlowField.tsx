"use client";

import { Check } from "lucide-react";
import { customOptionChoices } from "@/data/custom-options";
import { shadeSwatches, undertoneSwatches } from "@/data/customize";
import { optionsOf, type Answers, type FlowQuestion } from "@/lib/customize/flows";
import { cn } from "@/lib/utils";

/* One consultation question. Pure UI — the parent owns answers + validation. */
export function FlowField({ q, answers, onChange, onPicked }: { q: FlowQuestion; answers: Answers; onChange: (patch: Answers) => void; onPicked?: () => void }) {
  const value = answers[q.id];
  const opts = optionsOf(q, answers);

  const followUp = q.followUp && (Array.isArray(value) ? value : [value]).some((v) => v && q.followUp!.when.includes(String(v))) && (
    <div className="field mt-5">
      <label htmlFor={`f-${q.followUp.id}`} className="label">{q.followUp.label}</label>
      <textarea
        id={`f-${q.followUp.id}`}
        className="input min-h-[6rem]"
        maxLength={600}
        placeholder={q.followUp.placeholder}
        value={String(answers[q.followUp.id] ?? "")}
        onChange={(e) => onChange({ [q.followUp!.id]: e.target.value })}
      />
    </div>
  );
  const extra = q.extraText && (
    <div className="field mt-5">
      <label htmlFor={`f-${q.extraText.id}`} className="label">{q.extraText.label} <span className="normal-case tracking-normal text-taupe">(optional)</span></label>
      <input id={`f-${q.extraText.id}`} className="input" maxLength={200} placeholder={q.extraText.placeholder} value={String(answers[q.extraText.id] ?? "")} onChange={(e) => onChange({ [q.extraText!.id]: e.target.value })} />
    </div>
  );

  if (q.type === "single") {
    return (
      <>
        <div role="radiogroup" aria-labelledby="q-title" className="grid gap-2.5 sm:grid-cols-2">
          {opts.map((o, i) => {
            const on = value === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  onChange({ [q.id]: o.id });
                  if (!q.followUp?.when.includes(o.id)) onPicked?.();
                }}
                onKeyDown={(e) => {
                  const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
                  if (!dir) return;
                  e.preventDefault();
                  const sibs = (e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')) ?? [];
                  sibs[(i + dir + sibs.length) % sibs.length]?.focus();
                }}
                className={cn(
                  "relative flex min-h-[4rem] items-center gap-4 border px-5 py-3.5 text-left transition-colors duration-300",
                  on ? "border-ink bg-ink text-bone" : "border-line bg-bone hover:border-ink",
                )}
              >
                <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border", on ? "border-gold-light bg-gold-light text-carbon" : "border-taupe/60")} aria-hidden>
                  {on && <Check className="h-3 w-3" strokeWidth={2.5} />}
                </span>
                <span className="flex-1">
                  <span className="block text-[0.96rem] font-medium leading-snug">{o.label}</span>
                  {o.hint && <span className={cn("mt-0.5 block text-[0.8125rem] leading-snug", on ? "text-bone/65" : "text-ink-soft")}>{o.hint}</span>}
                </span>
              </button>
            );
          })}
        </div>
        {followUp}
        {extra}
      </>
    );
  }

  if (q.type === "multi") {
    const arr = Array.isArray(value) ? value : [];
    const toggle = (id: string) => {
      let next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      if (q.exclusive) next = id === q.exclusive && !arr.includes(id) ? [id] : next.filter((x) => x !== q.exclusive);
      if (q.max && next.length > q.max) return;
      onChange({ [q.id]: next });
    };
    return (
      <>
        <div role="group" aria-labelledby="q-title" className="grid gap-2.5 sm:grid-cols-2">
          {opts.map((o) => {
            const on = arr.includes(o.id);
            const full = !!q.max && arr.length >= q.max && !on;
            return (
              <button
                key={o.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                aria-disabled={full}
                onClick={() => !full && toggle(o.id)}
                className={cn(
                  "flex min-h-[3.5rem] items-center gap-3.5 border px-5 py-3 text-left transition-colors duration-300",
                  on ? "border-ink bg-ink text-bone" : "border-line bg-bone hover:border-ink",
                  full && "cursor-not-allowed opacity-45 hover:border-line",
                )}
              >
                <span className={cn("grid h-5 w-5 shrink-0 place-items-center border", on ? "border-gold-light bg-gold-light text-carbon" : "border-taupe/60")} aria-hidden>
                  {on && <Check className="h-3 w-3" strokeWidth={2.5} />}
                </span>
                <span>
                  <span className="block text-[0.94rem] leading-snug">{o.label}</span>
                  {o.hint && <span className={cn("block text-xs", on ? "text-bone/60" : "text-taupe")}>{o.hint}</span>}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-taupe" aria-live="polite">
          {q.max ? `${arr.length} of up to ${q.max} selected` : `${arr.length} selected`}
          {q.optional ? " · optional — skip if none apply" : ""}
        </p>
        {followUp}
        {extra}
      </>
    );
  }

  if (q.type === "shade") {
    const [depth, und] = String(value ?? "").split("|");
    const set = (d?: string, u?: string) => onChange({ [q.id]: `${d ?? depth ?? ""}|${u ?? und ?? ""}` });
    return (
      <div className="space-y-8">
        <fieldset>
          <legend className="label">Depth</legend>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {customOptionChoices.Shade.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={depth === s}
                onClick={() => set(s, undefined)}
                className={cn("flex flex-col items-center gap-2 border p-2 text-xs transition-colors", depth === s ? "border-ink" : "border-line hover:border-ink")}
              >
                <span className="h-10 w-full rounded-sm" style={{ background: shadeSwatches[s] }} aria-hidden />
                {s}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label">Undertone</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {customOptionChoices.Undertone.map((u) => (
              <button key={u} type="button" aria-pressed={und === u} onClick={() => set(undefined, u)} className={cn("flex items-center gap-3 border px-4 py-3 text-sm transition-colors", und === u ? "border-ink bg-ink text-bone" : "border-line hover:border-ink")}>
                <span className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: undertoneSwatches[u] }} aria-hidden />
                {u}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-taupe">Unsure? Cool undertones often suit silver jewellery, warm ones gold; neutral sits between. Pick your best guess — we confirm with you before preparing.</p>
        </fieldset>
      </div>
    );
  }

  return (
    <textarea
      id={`f-${q.id}`}
      aria-labelledby="q-title"
      className="input min-h-[8rem]"
      maxLength={800}
      placeholder={q.placeholder}
      value={String(value ?? "")}
      onChange={(e) => onChange({ [q.id]: e.target.value })}
    />
  );
}
