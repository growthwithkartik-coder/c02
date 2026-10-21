"use client";

import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import { ENGINE_VERSION } from "./engine";
import type { AiStatus, ConsultDraft, ConsultResult } from "./types";

/* Consultation persistence — this device only (localStorage).
   No account is needed; nothing is sent anywhere until the customer
   finishes, and then only to this site's own API. */

const EVT = "co2:consult-changed";

export function readDraft(): ConsultDraft | null {
  return readJSON<ConsultDraft | null>(STORAGE_KEYS.consult, null);
}
export function writeDraft(d: ConsultDraft | null) {
  writeJSON(STORAGE_KEYS.consult, d);
}
export function readResult(): ConsultResult | null {
  const r = readJSON<ConsultResult | null>(STORAGE_KEYS.consultResult, null);
  return r && r.plan?.version === ENGINE_VERSION ? r : null;
}
export function writeResult(r: ConsultResult | null) {
  writeJSON(STORAGE_KEYS.consultResult, r);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVT));
}

/** Saved result + live updates across components and tabs. */
export function useConsultResult() {
  const [result, setResult] = useState<ConsultResult | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const load = () => setResult(readResult());
    load();
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEYS.consultResult && load();
    window.addEventListener(EVT, load);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVT, load);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const update = useCallback((fn: (r: ConsultResult) => ConsultResult) => {
    const cur = readResult();
    if (!cur) return;
    writeResult(fn(cur));
  }, []);
  return { result, ready, update };
}

let statusCache: Promise<AiStatus> | null = null;
const OFF: AiStatus = { recommendations: false, ask: false, photo: false, provider: null, model: null };

export function fetchAiStatus(): Promise<AiStatus> {
  if (!statusCache) {
    statusCache = fetch("/api/ai/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : OFF))
      .catch(() => OFF);
  }
  return statusCache;
}

export function useAiStatus() {
  const [s, setS] = useState<AiStatus | null>(null);
  useEffect(() => {
    let live = true;
    fetchAiStatus().then((x) => live && setS(x));
    return () => {
      live = false;
    };
  }, []);
  return s;
}
