"use client";

import Link from "next/link";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Fragment, useState } from "react";
import type { Answers } from "@/lib/consultation/questions";
import { getPickProduct } from "@/lib/consultation/engine";
import { useAiStatus } from "@/lib/consultation/store";

type Turn = { q: string; a: string; products: string[] };

const SUGGESTED = ["Can I use these with my current vitamin C serum?", "What if my skin feels tight after the cleanser?", "Which product should I start with first?"];

/* Follow-up questions about the routine, answered by the AI from CO2's
   catalogue. When AI isn't configured, it says so instead of pretending. */
export function AskAssistant({ answers, routine }: { answers: Answers; routine: string[] }) {
  const status = useAiStatus();
  const [q, setQ] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(text: string) {
    const question = text.trim();
    if (question.length < 3) return setError("Please type a question.");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/consultation/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question, answers, routine, history: turns.map(({ q, a }) => ({ q, a })) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "The assistant couldn't answer just now.");
      setTurns((t) => [...t, { q: question, a: data.answer, products: data.products ?? [] }]);
      setQ("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-line p-6 md:p-8">
      <p className="flex items-center gap-2 text-sm text-gold-deep"><Sparkles className="h-3.5 w-3.5" /> Ask about your routine</p>
      <h2 className="mt-2 font-display text-3xl leading-tight">Questions about your routine?</h2>

      {status === null ? (
        <p className="mt-4 text-sm text-taupe">Checking the assistant…</p>
      ) : !status.ask ? (
        <div className="mt-4 space-y-3 text-sm text-ink-soft">
          <p>The AI assistant isn&rsquo;t switched on for this site yet, so it can&rsquo;t answer questions here.</p>
          <p>
            For help choosing, write to us from the <Link href="/contact" className="text-ink underline underline-offset-4">contact page</Link> — include your routine and we&rsquo;ll reply personally.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm text-ink-soft">Answers come from an AI model that only knows CO2&rsquo;s products and your answers. It can&rsquo;t give medical advice.</p>
          {turns.length > 0 && (
            <div className="mt-6 space-y-5" aria-live="polite">
              {turns.map((t, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium">{t.q}</p>
                  <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-soft"><Linked text={t.a} /></p>
                </div>
              ))}
            </div>
          )}
          {turns.length === 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button key={s} type="button" className="chip h-auto py-2 text-left text-xs leading-snug" onClick={() => ask(s)} disabled={busy}>{s}</button>
              ))}
            </div>
          )}
          <form
            className="mt-6 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              ask(q);
            }}
          >
            <label htmlFor="ask-q" className="sr-only">Your question</label>
            <input id="ask-q" className="input" maxLength={500} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a question" />
            <button type="submit" className="btn btn-primary h-12 px-4" disabled={busy} aria-label="Ask">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
          {error && <p role="alert" className="mt-3 text-sm text-[#7a2b22]">{error}</p>}
        </>
      )}
    </div>
  );
}

/** Turns [[slug]] references into product links. Unknown slugs were already removed server-side. */
function Linked({ text }: { text: string }) {
  const parts = text.split(/(\[\[[a-z0-9-]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[([a-z0-9-]+)\]\]$/);
        if (!m) return <Fragment key={i}>{part}</Fragment>;
        const p = getPickProduct(m[1]);
        return p ? (
          <Link key={i} href={`/product/${p.slug}`} className="text-ink underline underline-offset-4">{p.name}</Link>
        ) : null;
      })}
    </>
  );
}
