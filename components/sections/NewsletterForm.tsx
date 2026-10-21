"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function NewsletterForm({ dark, compact, source = "footer" }: { dark?: boolean; compact?: boolean; source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [consent, setConsent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState("error");
      setMsg("Please enter a valid email address.");
      return;
    }
    if (!consent) {
      setState("error");
      setMsg("Please tick the box to agree to receive emails from CO2.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source }) });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong — please try again.");
      }
      setState("done");
      setMsg("You're in. Welcome to the CO2 world.");
      setEmail("");
    } catch (err) {
      setState("error");
      setMsg((err as Error).message || "Something went wrong — please try again.");
    }
  }

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      <div className={cn("flex items-center border-b", dark ? "border-bone/30 focus-within:border-gold-light" : "border-ink/30 focus-within:border-ink", compact ? "h-12" : "h-16")}>
        <label htmlFor={`nl-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`nl-${source}`}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={cn("h-full flex-1 bg-transparent outline-none", compact ? "text-sm" : "text-lg", dark ? "placeholder:text-bone/40" : "placeholder:text-taupe")}
        />
        <button type="submit" disabled={state === "loading"} className={cn("ml-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]", dark ? "hover:text-gold-light" : "hover:text-gold")} aria-label="Subscribe">
          {state === "done" ? <Check className="h-4 w-4" /> : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
      <label className={cn("mt-3 flex cursor-pointer items-start gap-2 text-[0.6875rem] leading-snug", dark ? "text-bone/55" : "text-ink-soft")}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#B8924F]" />
        <span>I agree to receive occasional emails from CO2 about products and launches. Unsubscribe any time. See our <a href="/privacy" className="underline">privacy policy</a>.</span>
      </label>
      <p role="status" aria-live="polite" className={cn("mt-3 min-h-[1.25rem] text-xs", state === "error" ? "text-red-400" : dark ? "text-gold-light" : "text-leaf")}>
        {msg}
      </p>
    </form>
  );
}
