"use client";

import { useEffect, useState } from "react";
import { readJSON, writeJSON } from "@/lib/storage";
import type { Answers, FlowId } from "@/lib/customize/flows";
import type { Recommendation } from "@/lib/customize/recommend";

/* ------------------------------------------------------------------
   Make It Yours — browser persistence.
   Everything here lives in this browser only (localStorage). It is a
   convenience so people can leave and come back — NOT a customer
   database. Nothing sensitive is stored.
------------------------------------------------------------------- */

const KEY = {
  drafts: "co2.miy.drafts.v1",
  results: "co2.miy.results.v1",
  saved: "co2.miy.saved.v1",
  requests: "co2.miy.requests.v1",
  builds: "co2.miy.builds.v1",
};

export interface Draft {
  answers: Answers;
  step: number;
  updatedAt: string;
}

export interface SavedRoutine {
  id: string;
  name: string;
  flow: FlowId;
  answers: Answers;
  result: Recommendation;
  savedAt: string;
}

export interface CustomRequest {
  id: string;
  buildId: string;
  label: string;
  options: Record<string, string>;
  contact: { name: string; email: string; phone?: string };
  status: "pending-confirmation";
  createdAt: string;
  delivered: boolean;
}

export interface SavedBuild {
  id: string;
  buildId: string;
  label: string;
  options: Record<string, string>;
  savedAt: string;
}

type Map<T> = Partial<Record<FlowId, T>>;

export const miy = {
  draft: (f: FlowId) => readJSON<Map<Draft>>(KEY.drafts, {})[f] ?? null,
  setDraft(f: FlowId, d: Draft | null) {
    const all = readJSON<Map<Draft>>(KEY.drafts, {});
    if (d) all[f] = d;
    else delete all[f];
    writeJSON(KEY.drafts, all);
  },
  allDrafts: () => readJSON<Map<Draft>>(KEY.drafts, {}),
  result: (f: FlowId) => readJSON<Map<{ answers: Answers; result: Recommendation }>>(KEY.results, {})[f] ?? null,
  setResult(f: FlowId, v: { answers: Answers; result: Recommendation } | null) {
    const all = readJSON<Map<{ answers: Answers; result: Recommendation }>>(KEY.results, {});
    if (v) all[f] = v;
    else delete all[f];
    writeJSON(KEY.results, all);
  },
  saved: () => readJSON<SavedRoutine[]>(KEY.saved, []),
  save(r: SavedRoutine) {
    writeJSON(KEY.saved, [r, ...readJSON<SavedRoutine[]>(KEY.saved, []).filter((x) => x.id !== r.id)].slice(0, 20));
  },
  removeSaved(id: string) {
    writeJSON(KEY.saved, readJSON<SavedRoutine[]>(KEY.saved, []).filter((x) => x.id !== id));
  },
  requests: () => readJSON<CustomRequest[]>(KEY.requests, []),
  addRequest(r: CustomRequest) {
    writeJSON(KEY.requests, [r, ...readJSON<CustomRequest[]>(KEY.requests, [])].slice(0, 30));
  },
  builds: () => readJSON<SavedBuild[]>(KEY.builds, []),
  saveBuild(b: SavedBuild) {
    writeJSON(KEY.builds, [b, ...readJSON<SavedBuild[]>(KEY.builds, []).filter((x) => x.id !== b.id)].slice(0, 20));
  },
  removeBuild(id: string) {
    writeJSON(KEY.builds, readJSON<SavedBuild[]>(KEY.builds, []).filter((x) => x.id !== id));
  },
};

export function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Re-render when any Make It Yours storage changes (other tabs included). */
export function useMiy<T>(read: () => T, deps: unknown[] = []) {
  const [v, setV] = useState<T | null>(null);
  useEffect(() => {
    setV(read());
    const on = () => setV(read());
    window.addEventListener("storage", on);
    window.addEventListener("co2:miy", on);
    return () => {
      window.removeEventListener("storage", on);
      window.removeEventListener("co2:miy", on);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return v;
}

export function notifyMiy() {
  window.dispatchEvent(new Event("co2:miy"));
}
