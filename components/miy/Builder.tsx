"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, Loader2, MessageCircle, Save, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { buildProducts, capFinishes, colourFamilySwatches, containers, getBuildProduct, labelPersonalisation, packColours, shadeSwatches, undertoneSwatches, type BuildProduct } from "@/data/customize";
import { customOptionChoices } from "@/data/custom-options";
import { site } from "@/data/site";
import { getProduct } from "@/lib/catalog";
import { packagingSurcharge } from "@/lib/commerce";
import { miy, notifyMiy, uid } from "@/lib/customize/store";
import { cn, money, productImage, PRICES_ON_REQUEST } from "@/lib/utils";
import type { PackSpec } from "@/components/miy/PackagingViewer";

const PackagingViewer = dynamic(() => import("@/components/miy/PackagingViewer").then((m) => m.PackagingViewer), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center bg-carbon text-xs uppercase tracking-[0.18em] text-bone/50">Loading 3D preview…</div>,
});

/* ------------------------------------------------------------------
   Make It Yours — product & packaging builder.

   Listed formulas (catalogue price) → Add to bag / Buy now; the formula
   is confirmed with the customer before it is prepared.
   On-request formulas (no price) → submit a REQUEST; the team confirms
   feasibility, price and timeline. Never shown as a confirmed order.

   Only packaging compatible with the chosen product is offered, and the
   price breakdown only shows figures that exist in the data.
------------------------------------------------------------------- */

type Step = "formula" | "size" | "packaging" | "label" | "details" | "review";

const CATEGORY_LABEL: Record<string, string> = { face: "Face & Skin", lips: "Lips", body: "Body", hair: "Hair" };

const fillFor = (bp: BuildProduct, opts: Record<string, string>) => {
  if (opts["Shade"]) return shadeSwatches[opts["Shade"]] ?? "#C9A27C";
  if (opts["Colour family"]) return colourFamilySwatches[opts["Colour family"]] ?? "#B0606B";
  const p = bp.slug ? getProduct(bp.slug) : null;
  return p?.custom?.fill ?? (bp.category === "hair" ? "#D9C89A" : bp.category === "body" ? "#F1E6D6" : "#E8E0D2");
};

export function Builder() {
  const sp = useSearchParams();
  const router = useRouter();
  const reduce = useReducedMotion();
  const { addToCart, toast } = useStore();
  const productId = sp.get("product");
  const from = sp.get("from");
  const next = (sp.get("next") ?? "").split(",").filter((x) => getBuildProduct(x));
  const bp = productId ? getBuildProduct(productId) : undefined;
  const catalogue = bp?.slug ? getProduct(bp.slug) : undefined;

  const [opts, setOpts] = useState<Record<string, string>>({});
  const [container, setContainer] = useState<string>("");
  const [colour, setColour] = useState<string>("");
  const [cap, setCap] = useState<string>("");
  const [labelName, setLabelName] = useState("");
  const [size, setSize] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", phone: "", notes: "" });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string | null>(null);
  const [submit, setSubmit] = useState<{ state: "idle" | "sending" | "done" | "failed"; id?: string; message?: string }>({ state: "idle" });
  const [added, setAdded] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // initialise from product + prefill (consultation results, product pages)
  useEffect(() => {
    if (!bp) return;
    let pf: Record<string, string> = {};
    try {
      pf = JSON.parse(sp.get("pf") ?? "{}");
    } catch {}
    const names = bp.mode === "listed" ? catalogue?.custom?.options ?? [] : (bp.options ?? []).map((o) => o.name);
    const start: Record<string, string> = {};
    for (const n of names) {
      const v = pf[n];
      if (!v) continue;
      const choices = choicesFor(bp, n);
      if (!choices || choices.includes(v)) start[n] = v;
    }
    // starting from a ready-made product: carry its ingredient families as a note
    if (from) {
      const fp = getProduct(from);
      const famKey = names.find((n) => /ingredient (families|preferences)/i.test(n));
      if (fp && famKey && !start[famKey]) start[famKey] = `Inspired by ${fp.name}: ${fp.ingredients.slice(0, 3).map((i) => i.name).join(", ")}`;
    }
    setOpts(start);
    setContainer(pf._container && bp.containers.includes(pf._container as never) ? pf._container : bp.containers[0]);
    setColour(bp.colours[0]);
    setCap(bp.caps[0]);
    setSize(pf.Size && bp.sizes?.includes(pf.Size) ? pf.Size : bp.sizes?.[0] ?? "");
    setStep(0);
    setSubmit({ state: "idle" });
    setAdded(false);
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const steps: Step[] = useMemo(() => {
    if (!bp) return [];
    const s: Step[] = ["formula"];
    if (bp.mode === "request" && bp.sizes && bp.sizes.length > 1) s.push("size");
    s.push("packaging");
    if (labelPersonalisation.enabled) s.push("label");
    // while prices are on request, every build (made-to-order too) is sent as a quote request
    if (bp.mode === "request" || PRICES_ON_REQUEST) s.push("details");
    s.push("review");
    return s;
  }, [bp]);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [step]);

  if (!bp) return <ProductPicker from={from} />;

  const cur = steps[step];
  const optionNames = bp.mode === "listed" ? catalogue?.custom?.options ?? [] : (bp.options ?? []).map((o) => o.name);
  const requiredNames = optionNames.filter((n) => !!choicesFor(bp, n) && !(bp.options ?? []).find((o) => o.name === n)?.optional);

  const packaging = {
    Packaging: containers[container as keyof typeof containers]?.label ?? "",
    "Packaging colour": packColours[colour]?.label ?? "",
    Cap: capFinishes[cap]?.label ?? "",
    ...(labelName.trim() ? { "Label name": labelName.trim() } : {}),
  };
  const allOptions = { ...opts, ...packaging };
  const surcharge = packagingSurcharge(allOptions);
  const total = catalogue ? catalogue.price + surcharge : null;
  const prep = catalogue?.specs.find((s) => s.label === "Preparation")?.value ?? "5–8 working days";

  const spec: PackSpec = {
    container: (container || bp.containers[0]) as PackSpec["container"],
    bodyHex: packColours[colour]?.hex ?? "#EEF1EE",
    clarity: packColours[colour]?.clarity ?? 0,
    capHex: capFinishes[cap]?.hex ?? "#B8924F",
    capMetal: cap === "gold" || cap === "silver",
    fillHex: fillFor(bp, opts),
    title: bp.label.replace(/^Custom /, ""),
    name: labelName.trim() || undefined,
  };

  function validate(s: Step) {
    if (s === "formula") {
      const missing = requiredNames.filter((n) => !opts[n]);
      if (missing.length) return `Please choose: ${missing.join(", ")}`;
    }
    if (s === "size" && !size) return "Please choose a size.";
    if (s === "packaging" && (!container || !colour || !cap)) return "Please choose a container, colour and cap.";
    if (s === "label" && labelName && !/^[\p{L}\p{N} ]*$/u.test(labelName)) return "Labels can use letters, numbers and spaces only.";
    if (s === "details") {
      if (!contact.name.trim()) return "Please add your name.";
      if (!/^\S+@\S+\.\S+$/.test(contact.email)) return "Please add a valid email so we can reply with your quote.";
      if (contact.phone && !/^[+\d][\d\s-]{7,16}$/.test(contact.phone)) return "Please check the phone number.";
    }
    return null;
  }

  function goTo(i: number) {
    for (let k = 0; k < i; k++) {
      const e = validate(steps[k]);
      if (e) {
        setStep(k);
        setErrors(e);
        return;
      }
    }
    setErrors(null);
    setStep(Math.max(0, Math.min(i, steps.length - 1)));
  }

  function addToBag(buyNow = false) {
    if (!catalogue) return;
    for (const s of steps) {
      const e = validate(s);
      if (e) {
        setErrors(e);
        setStep(steps.indexOf(s));
        return;
      }
    }
    addToCart(catalogue.slug, 1, { options: allOptions }, { silent: buyNow });
    setAdded(true);
    if (buyNow) router.push("/checkout");
  }

  function saveBuild() {
    miy.saveBuild({ id: uid("build"), buildId: bp!.id, label: bp!.label, options: { ...allOptions, ...(size ? { Size: size } : {}) }, savedAt: new Date().toISOString() });
    notifyMiy();
    toast({ title: "Customization saved", body: `${bp!.label} — find it in your account on this device.`, action: { label: "View", href: "/account?tab=routines" } });
  }

  async function sendRequest() {
    for (const s of steps) {
      const e = validate(s);
      if (e) {
        setErrors(e);
        setStep(steps.indexOf(s));
        return;
      }
    }
    setSubmit({ state: "sending" });
    const payload = { buildId: bp!.id, options: { ...allOptions, ...(size ? { Size: size } : {}) }, contact, from };
    try {
      const res = await fetch("/api/customize/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.id) throw new Error(json.error || "The request could not be sent.");
      miy.addRequest({ id: json.id, buildId: bp!.id, label: bp!.label, options: payload.options, contact: { name: contact.name, email: contact.email, phone: contact.phone }, status: "pending-confirmation", createdAt: new Date().toISOString(), delivered: true });
      notifyMiy();
      setSubmit({ state: "done", id: json.id });
    } catch (e) {
      setSubmit({ state: "failed", message: (e as Error).message });
    }
  }

  const summary = (
    <>
            <dl className="mt-5 grid grid-cols-2 gap-px bg-line text-sm sm:grid-cols-3">
        {[
          ["Product", bp.label],
          ["Container", packaging.Packaging],
          ["Colour", packaging["Packaging colour"]],
          ["Cap", packaging.Cap],
          ...(size ? [["Size", size]] : catalogue ? [["Size", catalogue.size]] : []),
          ["Label", labelName || "No name"],
        ].map(([k, v]) => (
          <div key={k} className="bg-bone p-3">
            <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-taupe">{k}</dt>
            <dd className="mt-0.5 truncate">{v || "—"}</dd>
          </div>
        ))}
      </dl>
      <PriceBox bp={bp} base={catalogue?.price ?? null} surcharge={surcharge} total={total} size={catalogue?.size ?? size} prep={prep} />
    </>
  );

  const summaryText = `CO2 customization request — ${bp.label}\n${Object.entries({ ...allOptions, ...(size ? { Size: size } : {}) }).map(([k, v]) => `${k}: ${v}`).join("\n")}`;

  return (
    <div className="container-site pb-section">
      <div className="grid gap-10 lg:grid-cols-12">
        {/* preview */}
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
            <PackagingViewer spec={spec} className="aspect-square w-full md:aspect-[5/4] lg:aspect-square" />
            <p className="mt-2 text-[0.6875rem] text-taupe">Illustrative 3D model of the container style, colour, cap and label position — not a photograph of the finished product.</p>
            <div className="hidden lg:block">{summary}</div>
          </div>
        </div>

        {/* steps */}
        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow text-gold-deep">{CATEGORY_LABEL[bp.category]} · {bp.mode === "listed" ? "Made to order" : "On request"}</p>
            <Link href="/make-it-yours/build" className="text-xs underline underline-offset-4">Change product</Link>
          </div>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[0.95]">{bp.label}</h1>
          <p className="mt-2 text-ink-soft">{bp.blurb}{from && getProduct(from) ? ` Starting from ${getProduct(from)!.name}.` : ""}</p>

          <ol className="no-scrollbar mt-8 flex gap-1 overflow-x-auto border-b border-line" aria-label="Builder steps">
            {steps.map((s, i) => (
              <li key={s} className="shrink-0">
                <button type="button" onClick={() => goTo(i)} aria-current={i === step ? "step" : undefined} className={cn("flex items-center gap-2 border-b-2 px-3 py-3 text-xs uppercase tracking-[0.14em] transition-colors", i === step ? "border-ink text-ink" : i < step ? "border-transparent text-ink-soft hover:text-ink" : "border-transparent text-taupe")}>
                  <span className={cn("grid h-5 w-5 place-items-center rounded-full text-[0.625rem]", i < step ? "bg-ink text-bone" : "border border-current")}>{i < step ? <Check className="h-3 w-3" /> : i + 1}</span>
                  {{ formula: "Formula", size: "Size", packaging: "Packaging", label: "Label", details: "Your details", review: "Review" }[s]}
                </button>
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait" initial={false}>
            <motion.section key={cur + bp.id} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.3 }} className="pt-8">
              {cur === "formula" && (
                <>
                  <h2 ref={titleRef} tabIndex={-1} className="font-display text-3xl outline-none">Set your formula.</h2>
                  <p className="mt-2 text-sm text-ink-soft">{bp.mode === "listed" ? "These are the options this made-to-order formula offers." : "Tell us what you'd like — we'll confirm what's possible."}</p>
                  <div className="mt-6 space-y-7">
                    {optionNames.map((n) => {
                      const choices = choicesFor(bp, n);
                      const help = (bp.options ?? []).find((o) => o.name === n)?.help;
                      const optional = !choices || (bp.options ?? []).find((o) => o.name === n)?.optional;
                      return (
                        <fieldset key={n}>
                          <legend className="label">{n} {optional ? <span className="normal-case tracking-normal text-taupe">(optional)</span> : <span aria-hidden>*</span>}</legend>
                          {help && <p className="mt-1 text-xs text-taupe">{help}</p>}
                          {choices ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {choices.map((c) => {
                                const sw = n === "Shade" ? shadeSwatches[c] : n === "Undertone" ? undertoneSwatches[c] : n === "Colour family" ? colourFamilySwatches[c] : undefined;
                                return (
                                  <button key={c} type="button" aria-pressed={opts[n] === c} onClick={() => { setOpts((o) => ({ ...o, [n]: c })); setErrors(null); }} className="chip h-10 px-4">
                                    {sw && <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: sw }} aria-hidden />}
                                    {c}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <input className="input mt-3" maxLength={240} value={opts[n] ?? ""} placeholder={/avoid/i.test(n) ? "e.g. essential oils, nut oils" : "e.g. hyaluronic acid, niacinamide"} onChange={(e) => setOpts((o) => ({ ...o, [n]: e.target.value }))} />
                          )}
                        </fieldset>
                      );
                    })}
                  </div>
                  <p className="mt-6 text-xs text-taupe">Cosmetic personalization only. Tell us about allergies in the notes — we can&apos;t guarantee any product is allergy-safe.</p>
                </>
              )}

              {cur === "size" && (
                <>
                  <h2 ref={titleRef} tabIndex={-1} className="font-display text-3xl outline-none">Choose a size.</h2>
                  <p className="mt-2 text-sm text-ink-soft">The exact volume for each size is confirmed in your quote.</p>
                  <div className="mt-6 grid gap-2 sm:grid-cols-3">
                    {bp.sizes!.map((s) => (
                      <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className={cn("border p-4 text-left text-sm transition-colors", size === s ? "border-ink bg-ink text-bone" : "border-line hover:border-ink")}>{s}</button>
                    ))}
                  </div>
                </>
              )}

              {cur === "packaging" && (
                <>
                  <h2 ref={titleRef} tabIndex={-1} className="font-display text-3xl outline-none">Choose your packaging.</h2>
                  <p className="mt-2 text-sm text-ink-soft">Only containers made for a {bp.label.replace(/^Custom /, "").toLowerCase()} are shown.</p>
                  <fieldset className="mt-6">
                    <legend className="label">Container</legend>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {bp.containers.map((c) => {
                        const x = containers[c];
                        return (
                          <button key={c} type="button" aria-pressed={container === c} onClick={() => setContainer(c)} className={cn("border p-4 text-left transition-colors", container === c ? "border-ink bg-ink text-bone" : "border-line hover:border-ink")}>
                            <span className="block text-sm font-medium">{x.label}</span>
                            <span className={cn("mt-1 block text-xs", container === c ? "text-bone/65" : "text-ink-soft")}>{x.description}</span>
                            <span className={cn("mt-2 block text-[0.6875rem] uppercase tracking-[0.14em]", container === c ? "text-gold-light" : "text-taupe")}>{PRICES_ON_REQUEST ? "Included in quote" : x.surcharge ? `+ ${money(x.surcharge)}` : "Included"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                  <fieldset className="mt-7">
                    <legend className="label">Colour — <span className="normal-case tracking-normal text-ink">{packColours[colour]?.label}</span></legend>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {bp.colours.map((c) => (
                        <button key={c} type="button" aria-pressed={colour === c} aria-label={packColours[c].label} onClick={() => setColour(c)} className={cn("h-11 w-11 rounded-full ring-offset-2 ring-offset-bone transition", colour === c ? "ring-2 ring-ink" : "ring-1 ring-black/15 hover:ring-ink/50")} style={{ background: packColours[c].hex }} />
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="mt-7">
                    <legend className="label">Cap / pump — <span className="normal-case tracking-normal text-ink">{capFinishes[cap]?.label}</span></legend>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {bp.caps.map((c) => (
                        <button key={c} type="button" aria-pressed={cap === c} aria-label={capFinishes[c].label} onClick={() => setCap(c)} className={cn("h-11 w-11 rounded-full ring-offset-2 ring-offset-bone transition", cap === c ? "ring-2 ring-ink" : "ring-1 ring-black/15 hover:ring-ink/50")} style={{ background: capFinishes[c].hex }} />
                      ))}
                    </div>
                  </fieldset>
                </>
              )}

              {cur === "label" && (
                <>
                  <h2 ref={titleRef} tabIndex={-1} className="font-display text-3xl outline-none">Add a name to your label.</h2>
                  <p className="mt-2 text-sm text-ink-soft">{labelPersonalisation.note} Optional.</p>
                  <div className="field mt-6 max-w-md">
                    <label htmlFor="label-name" className="label">Name on label</label>
                    <input id="label-name" className="input" maxLength={labelPersonalisation.maxLength} placeholder="e.g. Aanya's Serum" value={labelName} onChange={(e) => setLabelName(e.target.value)} />
                    <p className="text-xs text-taupe">{labelName.length} / {labelPersonalisation.maxLength}</p>
                  </div>
                </>
              )}

              {cur === "details" && (
                <>
                  <h2 ref={titleRef} tabIndex={-1} className="font-display text-3xl outline-none">Where should we send your quote?</h2>
                  <p className="mt-2 text-sm text-ink-soft">We reply with what&apos;s possible, the price and the preparation time. Nothing is charged now.</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="field"><label htmlFor="c-name" className="label">Name *</label><input id="c-name" className="input" autoComplete="name" value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} /></div>
                    <div className="field"><label htmlFor="c-email" className="label">Email *</label><input id="c-email" type="email" className="input" autoComplete="email" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} /></div>
                    <div className="field"><label htmlFor="c-phone" className="label">Phone / WhatsApp</label><input id="c-phone" type="tel" className="input" autoComplete="tel" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} /></div>
                    <div className="field sm:col-span-2"><label htmlFor="c-notes" className="label">Notes (allergies, references, anything else)</label><textarea id="c-notes" className="input" maxLength={1000} value={contact.notes} onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))} /></div>
                  </div>
                  <p className="mt-4 text-xs text-taupe">Used only to reply to this request. See our <Link href="/privacy" className="underline">privacy policy</Link>.</p>
                </>
              )}

              {cur === "review" && (
                <>
                  <h2 ref={titleRef} tabIndex={-1} className="font-display text-3xl outline-none">{bp.mode === "listed" ? "Review your formula." : "Review your request."}</h2>
                  <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
                    {Object.entries({ ...opts, ...(size ? { Size: size } : {}), ...packaging }).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-6 py-3"><dt className="text-taupe">{k}</dt><dd className="text-right">{v}</dd></div>
                    ))}
                    {(bp.mode === "request" || PRICES_ON_REQUEST) && (<div className="flex justify-between gap-6 py-3"><dt className="text-taupe">Contact</dt><dd className="text-right">{contact.name} · {contact.email}</dd></div>)}
                  </dl>

                  {bp.mode === "listed" && !PRICES_ON_REQUEST ? (
                    <>
                      <ul className="mt-6 space-y-2 text-sm text-ink-soft">
                        <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" /> Prepared to order in {prep} after we confirm your formula with you by email.</li>
                        <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> Made-to-order formulas can&apos;t be returned unless they arrive damaged or incorrect. <Link href="/returns" className="underline">Returns policy</Link></li>
                      </ul>
                      {!added ? (
                        <div className="mt-8 flex flex-wrap gap-3">
                          <button type="button" onClick={() => addToBag(false)} className="btn btn-primary btn-lg flex-1">Add to bag — {money(total ?? 0)}</button>
                          <button type="button" onClick={() => addToBag(true)} className="btn btn-outline btn-lg">Buy now</button>
                          <button type="button" onClick={saveBuild} className="btn btn-ghost text-sm"><Save className="h-4 w-4" /> Save for later</button>
                        </div>
                      ) : (
                        <div className="mt-8 border border-line bg-bone-2 p-6" role="status">
                          <p className="flex items-center gap-2 font-medium"><Check className="h-4 w-4 text-gold-deep" /> Added to your bag with every choice you made.</p>
                          <p className="mt-1 text-sm text-ink-soft">We&apos;ll confirm the formula with you by email before it&apos;s prepared.</p>
                          <div className="mt-5 flex flex-wrap gap-3">
                            {next[0] ? (
                              <Link href={`/make-it-yours/build?product=${next[0]}&next=${next.slice(1).join(",")}`} className="btn btn-primary">Next: {getBuildProduct(next[0])!.label} <ArrowRight className="h-4 w-4" /></Link>
                            ) : (
                              <Link href="/checkout" className="btn btn-primary">Go to checkout</Link>
                            )}
                            <button type="button" onClick={() => setAdded(false)} className="btn btn-outline">Make another</button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : submit.state === "done" ? (
                    <div className="mt-8 border border-line bg-bone-2 p-6" role="status">
                      <p className="eyebrow text-gold-deep">Request received · pending confirmation</p>
                      <p className="mt-2 font-display text-3xl">Thank you, {contact.name.split(" ")[0]}.</p>
                      <p className="mt-2 text-sm text-ink-soft">Reference <b className="font-medium text-ink">{submit.id}</b>. This is a request, not an order — our team will reply to {contact.email} with what&apos;s possible, the price and the preparation time. Nothing has been charged.</p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <a href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(`${summaryText}\nReference: ${submit.id}`)}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><MessageCircle className="h-4 w-4" /> Follow up on WhatsApp</a>
                        <Link href="/account?tab=routines" className="btn btn-ghost text-sm">View in account</Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mt-6 text-sm text-ink-soft">Submitting sends a <b className="font-medium text-ink">customization request</b>. It is not a confirmed order and nothing is charged. We confirm feasibility, price and timeline first.</p>
                      {submit.state === "failed" && (
                        <div role="alert" className="mt-4 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                          {submit.message} Your choices are still here. You can try again, or send them to us on WhatsApp instead:
                          <a href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(summaryText)}`} target="_blank" rel="noreferrer" className="ml-1 underline">open WhatsApp</a>.
                        </div>
                      )}
                      <div className="mt-8 flex flex-wrap gap-3">
                        <button type="button" onClick={sendRequest} disabled={submit.state === "sending"} className="btn btn-primary btn-lg flex-1">
                          {submit.state === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send customization request"}
                        </button>
                        <button type="button" onClick={saveBuild} className="btn btn-ghost text-sm"><Save className="h-4 w-4" /> Save for later</button>
                      </div>
                    </>
                  )}
                </>
              )}

              {errors && <p role="alert" className="mt-5 text-sm text-red-700">{errors}</p>}

              {!(cur === "review" && (added || submit.state === "done")) && (
                <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
                  <button type="button" onClick={() => (step === 0 ? router.push("/make-it-yours/build") : goTo(step - 1))} className="btn btn-outline"><ArrowLeft className="h-4 w-4" /> Back</button>
                  {cur !== "review" && (
                    <button
                      type="button"
                      onClick={() => {
                        const e = validate(cur);
                        if (e) return setErrors(e);
                        setErrors(null);
                        setStep(step + 1);
                      }}
                      className="btn btn-primary"
                    >
                      Next <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </motion.section>
          </AnimatePresence>
          <div className="mt-10 lg:hidden">{summary}</div>
        </div>
      </div>
    </div>
  );
}

function choicesFor(bp: BuildProduct, name: string): string[] | undefined {
  if (bp.mode === "request") return bp.options?.find((o) => o.name === name)?.choices;
  return customOptionChoices[name];
}

function PriceBox({ bp, base, surcharge, total, size, prep }: { bp: BuildProduct; base: number | null; surcharge: number; total: number | null; size: string; prep: string }) {
  return (
    <div className="mt-5 border border-line p-5">
      <p className="label">{PRICES_ON_REQUEST ? "Price" : "Price breakdown"}</p>
      {PRICES_ON_REQUEST ? (
        <div className="mt-3 text-sm">
          <p className="font-medium">Price on request · as per customization</p>
          <p className="mt-1 text-ink-soft">The price depends on the formula, size, packaging and quantity you choose. Send your request and we&apos;ll reply with a quote and timeline{bp.mode === "listed" ? ` (usually prepared in ${prep} once confirmed)` : ""} — nothing is charged now.</p>
        </div>
      ) : bp.mode === "listed" && base != null ? (
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-ink-soft">Base formula</dt><dd className="tabular-nums">{money(base)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-soft">Size</dt><dd>{size} · included</dd></div>
          <div className="flex justify-between"><dt className="text-ink-soft">Packaging</dt><dd className="tabular-nums">{surcharge ? `+ ${money(surcharge)}` : "Included"}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-medium"><dt>Total</dt><dd className="tabular-nums">{money(total ?? base)}</dd></div>
          <p className="pt-1 text-xs text-taupe">Prepared in {prep} once your formula is confirmed. Shipping calculated at checkout.</p>
        </dl>
      ) : (
        <div className="mt-3 text-sm">
          <p className="font-medium">Price confirmed after review</p>
          <p className="mt-1 text-ink-soft">On-request formulas aren&apos;t in the catalogue yet, so there&apos;s no fixed price. We&apos;ll send a quote and timeline — you decide then. Nothing is charged now.</p>
        </div>
      )}
    </div>
  );
}

function ProductPicker({ from }: { from: string | null }) {
  const groups = (["face", "lips", "body", "hair"] as const).map((c) => ({ c, items: buildProducts.filter((b) => b.category === c) })).filter((g) => g.items.length);
  return (
    <div className="container-site pb-section">
      <h1 className="font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.95]">What would you like to <span className="italic">make yours?</span></h1>
      <p className="mt-4 max-w-2xl text-ink-soft">{PRICES_ON_REQUEST ? <>Prices are on request, as per your customization — choose your options, send a request and we&apos;ll reply with a quote and timeline.</> : <>Made-to-order formulas have a fixed price and go through checkout. On-request formulas are quoted first — you send a request, we confirm what&apos;s possible.</>} Not sure? <Link href="/make-it-yours#start" className="underline underline-offset-4">Start with a consultation</Link>.</p>
      <div className="mt-12 space-y-12">
        {groups.map(({ c, items }) => (
          <section key={c} aria-labelledby={`g-${c}`}>
            <h2 id={`g-${c}`} className="eyebrow border-b border-line pb-3 text-taupe">{CATEGORY_LABEL[c]}</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((b) => {
                const p = b.slug ? getProduct(b.slug) : null;
                return (
                  <li key={b.id}>
                    <Link href={`/make-it-yours/build?product=${b.id}${from ? `&from=${from}` : ""}`} className="group flex h-full flex-col border border-line p-5 transition-colors hover:border-ink">
                      <div className="relative mb-4 aspect-[4/3] bg-bone-2">
                        {b.image ? (
                          <Image src={productImage(b.image, 640)} alt="" fill sizes="280px" className="object-contain opacity-80" />
                        ) : (
                          <div className="grid h-full place-items-center"><Sparkles className="h-6 w-6 text-gold-deep" /></div>
                        )}
                      </div>
                      <p className={cn("text-[0.625rem] font-semibold uppercase tracking-[0.16em]", b.mode === "listed" ? "text-gold-deep" : "text-taupe")}>{b.mode === "listed" ? (PRICES_ON_REQUEST ? "Made to order · price on request" : `Made to order · ${p ? money(p.price) : ""}`) : "On request · quoted"}</p>
                      <p className="mt-1 font-display text-2xl leading-tight group-hover:text-gold-deep">{b.label}</p>
                      <p className="mt-1 text-sm text-ink-soft">{b.blurb}</p>
                      <p className="mt-auto pt-4 text-xs text-taupe">{b.containers.map((x) => containers[x].label).join(" · ")}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
