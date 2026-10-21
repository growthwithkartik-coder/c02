"use client";

import { useEffect, useRef, useState } from "react";
import { buildProducts, containers, packColours, capFinishes } from "@/data/customize";

/* Customization enquiry — sent to /api/customize/request as a REQUEST
   pending confirmation. Nothing is charged; the team replies with what's
   possible (size, packaging, formula), the price and the timeline. */

const SIZE_CHOICES = ["Travel size", "Regular size", "Larger size (if available)", "Not sure — please advise"];

export function CustomizationInquiry() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const [ref, setRef] = useState("");
  const productRef = useRef<HTMLSelectElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // "Request price" buttons link here with ?item=<product name> — prefill the form.
  useEffect(() => {
    const item = new URLSearchParams(window.location.search).get("item")?.slice(0, 120);
    if (!item) return;
    if (productRef.current) productRef.current.value = "Price for a CO2 product";
    if (notesRef.current && !notesRef.current.value) notesRef.current.value = `Price request: ${item}\n`;
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (d.company) return; // honeypot
    const options: Record<string, string> = {
      "Product to customize": d.product,
      "Size": d.size,
      "Container": d.container,
      "Pack colour": d.colour,
      "Cap finish": d.cap,
      "Quantity": d.quantity,
    };
    setState("sending");
    const res = await fetch("/api/customize/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buildId: "packaging-inquiry",
        from: "customization-page",
        options,
        contact: { name: d.name, email: d.email, phone: d.phone, notes: d.notes },
      }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (res?.ok && json?.ok) {
      setRef(json.id);
      setState("done");
      form.reset();
    } else {
      setState("error");
      setErr(json?.error ?? "Couldn't send your request — please try again or contact us.");
    }
  }

  if (state === "done") {
    return (
      <div className="border border-line bg-bone p-8 md:p-10" role="status">
        <p className="eyebrow text-gold-deep">Request received · pending confirmation</p>
        <p className="mt-3 font-display text-4xl">Thank you.</p>
        <p className="mt-3 text-ink-soft">
          Your customization request{ref ? <> (<span className="font-medium text-ink">{ref}</span>)</> : null} is with us. We&apos;ll reply by email with the sizes and packaging available
          for your product, the price and the timeline. Nothing has been charged.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" aria-describedby="cz-note">
      <div className="field sm:col-span-2">
        <label htmlFor="cz-product" className="label">What would you like to customize? *</label>
        <select ref={productRef} id="cz-product" name="product" required className="input" defaultValue="">
          <option value="" disabled>Choose one</option>
          {buildProducts.map((b) => <option key={b.id} value={b.label}>{b.label}</option>)}
          <option value="Price for a CO2 product">Price for a CO2 product (as per my customization)</option>
          <option value="Packaging for a CO2 product">Packaging / size for a CO2 product I already use</option>
          <option value="Something else">Something else — I&apos;ll describe it below</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="cz-size" className="label">Preferred size</label>
        <select id="cz-size" name="size" className="input" defaultValue={SIZE_CHOICES[3]}>
          {SIZE_CHOICES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cz-container" className="label">Container</label>
        <select id="cz-container" name="container" className="input" defaultValue="No preference">
          <option>No preference</option>
          {Object.values(containers).filter((c) => buildProducts.some((b) => b.containers.includes(c.id))).map((c) => <option key={c.id}>{c.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cz-colour" className="label">Pack colour</label>
        <select id="cz-colour" name="colour" className="input" defaultValue="No preference">
          <option>No preference</option>
          {Object.values(packColours).map((c) => <option key={c.id}>{c.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cz-cap" className="label">Cap finish</label>
        <select id="cz-cap" name="cap" className="input" defaultValue="No preference">
          <option>No preference</option>
          {Object.values(capFinishes).map((c) => <option key={c.id}>{c.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cz-qty" className="label">Quantity (approx.)</label>
        <input id="cz-qty" name="quantity" className="input" inputMode="numeric" placeholder="e.g. 1, 10, 100" />
      </div>
      <div className="field">
        <label htmlFor="cz-phone" className="label">Phone / WhatsApp</label>
        <input id="cz-phone" name="phone" type="tel" className="input" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="cz-name" className="label">Name *</label>
        <input id="cz-name" name="name" required className="input" autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="cz-email" className="label">Email *</label>
        <input id="cz-email" name="email" type="email" required className="input" autoComplete="email" />
      </div>
      <div className="field sm:col-span-2">
        <label htmlFor="cz-notes" className="label">Tell us about your requirements</label>
        <textarea ref={notesRef} id="cz-notes" name="notes" className="input" rows={5} placeholder="Product(s) you want a price for, bottle size you have in mind, labelling, ingredients to avoid, occasion or timeline…" />
      </div>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <p id="cz-note" className="text-sm text-ink-soft sm:col-span-2">
        This is a request, not an order. Exact sizes, packaging availability, price and timeline are confirmed with you by email before anything is made.
      </p>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button className="btn btn-primary btn-lg" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send customization request"}</button>
        {state === "error" && <p role="alert" className="text-sm text-red-700">{err}</p>}
      </div>
    </form>
  );
}
