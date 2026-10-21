"use client";

import { Camera, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { optLabel, questionById, type Answers } from "@/lib/consultation/questions";
import type { AiStatus } from "@/lib/consultation/types";

type Suggestion = { usable: boolean; reason?: string; skinType?: string | null; concerns?: string[]; observations?: string[] };

/* Optional photo-based suggestion for the skin-type + concerns questions.
   Only offered when the site owner has enabled it (CO2_AI_PHOTO_ANALYSIS).
   The customer reviews and applies the suggestion — nothing is applied
   automatically, and the photo is resized in the browser before upload. */
export function PhotoSuggest({ status, onApply }: { status: AiStatus | null; onApply: (patch: Partial<Answers>) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [s, setS] = useState<Suggestion | null>(null);
  const [consent, setConsent] = useState(false);

  if (!status) return null;
  if (!status.photo) {
    return (
      <p className="mt-8 flex items-start gap-3 border-t border-line pt-5 text-xs leading-relaxed text-taupe">
        <Camera className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} />
        Photo-based suggestions aren&rsquo;t switched on for this site. Your answers are all we need.
      </p>
    );
  }

  async function onFile(f: File | undefined) {
    if (!f) return;
    setError(null);
    setS(null);
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return setError("Please choose a JPEG, PNG or WebP photo.");
    if (f.size > 15 * 1024 * 1024) return setError("That photo is over 15 MB. Please choose a smaller one.");
    setBusy(true);
    try {
      const image = await downscale(f, 1024);
      const res = await fetch("/api/consultation/photo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ image }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "We couldn't analyze that photo.");
      setS(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  const skinQ = questionById("skinType");
  const cQ = questionById("concerns");

  return (
    <div className="mt-8 border border-line p-5">
      <div className="flex items-start gap-3">
        <Camera className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.3} />
        <div className="flex-1">
          <p className="text-sm font-medium">Not sure? Get a suggestion from a photo</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            Optional. An AI model looks at visible shine, dryness, redness and texture and suggests answers you can accept or change. It isn&rsquo;t a diagnosis. Your photo is sent once for analysis and isn&rsquo;t stored by CO2.
          </p>
          <label className="mt-3 flex items-center gap-2 text-xs">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="h-4 w-4 accent-[#1A1814]" />I agree to send my photo for this one-time analysis.
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" disabled={!consent || busy} onClick={() => input.current?.click()} className="btn btn-outline btn-sm">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" strokeWidth={1.4} />}
              {busy ? "Analyzing photo…" : "Choose a photo"}
            </button>
            <span className="text-xs text-taupe">Daylight, no filter, no makeup works best.</span>
          </div>
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" capture="user" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          {error && <p role="alert" className="mt-3 text-sm text-[#7a2b22]">{error}</p>}
          {s && (
            <div className="mt-4 border-t border-line pt-4 text-sm" aria-live="polite">
              {!s.usable ? (
                <p className="text-ink-soft">{s.reason}</p>
              ) : (
                <>
                  <p className="text-xs text-taupe">AI suggestion — please check it against how your skin feels.</p>
                  <ul className="mt-2 space-y-1">
                    {s.skinType && <li>Skin type: <b className="font-medium">{optLabel(skinQ, s.skinType)}</b></li>}
                    {!!s.concerns?.length && <li>Concerns: <b className="font-medium">{s.concerns.map((c) => optLabel(cQ, c)).join(", ")}</b></li>}
                    {s.observations?.map((o) => <li key={o} className="text-ink-soft">{o}</li>)}
                  </ul>
                  <div className="mt-3 flex gap-3">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => { onApply({ ...(s.skinType ? { skinType: s.skinType } : {}), ...(s.concerns?.length ? { concerns: s.concerns } : {}) }); setS(null); }}>
                      Use these answers
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setS(null)}>
                      <X className="h-4 w-4" /> Dismiss
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function downscale(file: File, max: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("We couldn't read that image."));
    };
    img.src = url;
  });
}
