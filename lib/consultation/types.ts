import type { Answers } from "./questions";
import type { Plan } from "./engine";

/** The optional AI layer returned by /api/consultation/recommend. */
export type AiLayer = {
  status: "ok" | "not-configured" | "error" | "rate-limited" | "pending" | "offline";
  model?: string;
  intro?: string;
  explanations?: Record<string, string>;
  tips?: string[];
  message?: string;
};

export interface ConsultDraft {
  answers: Answers;
  updatedAt: string;
}

export interface ConsultResult {
  answers: Answers;
  plan: Plan;
  ai: AiLayer;
  /** products the customer added to their routine from product pages */
  extras: string[];
  savedAt: string;
}

export interface AiStatus {
  recommendations: boolean;
  ask: boolean;
  photo: boolean;
  provider: string | null;
  model: string | null;
}
