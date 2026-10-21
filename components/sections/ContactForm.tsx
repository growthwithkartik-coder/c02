"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

const TOPICS = ["Order support", "Product question", "Made-to-order formula", "Customization request", "Feedback", "Wholesale & partnerships", "Press", "Other"];

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("topic");
    const hit = TOPICS.find((x) => x.toLowerCase().startsWith((t ?? "").toLowerCase()) && t);
    if (hit) setTopic(hit);
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("sending");
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(() => null);
    if (res?.ok) {
      setState("done");
      form.reset();
    } else {
      setState("error");
      setErr((await res?.json().catch(() => null))?.error ?? "Couldn't send — please try again or email us.");
    }
  }
  if (state === "done") {
    return (
      <div className="border border-line p-10" role="status">
        <p className="font-display text-4xl">Thank you.</p>
        <p className="mt-3 text-ink-soft">Your message is with us. We&apos;ll reply by email ({site.contact.hours}).</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <div className="field"><label htmlFor="c-name" className="label">Name *</label><input id="c-name" name="name" required className="input" autoComplete="name" /></div>
      <div className="field"><label htmlFor="c-email" className="label">Email *</label><input id="c-email" name="email" type="email" required className="input" autoComplete="email" /></div>
      <div className="field"><label htmlFor="c-phone" className="label">Phone</label><input id="c-phone" name="phone" type="tel" className="input" autoComplete="tel" /></div>
      <div className="field"><label htmlFor="c-topic" className="label">Topic</label>
        <select id="c-topic" name="topic" className="input" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="field sm:col-span-2"><label htmlFor="c-order" className="label">Order number (if any)</label><input id="c-order" name="orderId" className="input" placeholder="CO2-…" /></div>
      <div className="field sm:col-span-2"><label htmlFor="c-msg" className="label">Message *</label><textarea id="c-msg" name="message" required className="input" rows={6} /></div>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="sm:col-span-2 flex items-center gap-4">
        <button className="btn btn-primary btn-lg" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
        {state === "error" && <p role="alert" className="text-sm text-red-700">{err}</p>}
      </div>
    </form>
  );
}
