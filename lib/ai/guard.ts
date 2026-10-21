import "server-only";

/* Guard-rails applied to every AI-written string before it reaches the
   browser. The prompts already forbid these, this is the backstop. */

const BANNED = /\b(cures?|curing|heals?|healing|clinically|clinical(ly)? (proven|tested)|proven|guarantee[sd]?|dermatologist[- ](approved|tested|recommended)|certified|prescription|diagnos\w*|miracle|anti[- ]?ageing|anti[- ]?aging|whiten\w*|fairness|permanent(ly)?|eliminat\w+|eradicat\w+)\b/i;
const CONDITIONS = /\b(eczema|psoriasis|rosacea|dermatitis|melasma|infection|fungal|cystic acne)\b/i;

export function safeText(s: unknown, max: number): string | null {
  if (typeof s !== "string") return null;
  const t = s.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, max);
  if (!t) return null;
  if (BANNED.test(t) || CONDITIONS.test(t)) return null;
  return t;
}

/** Looser check for conversational answers: medical words are allowed only when pointing to a professional. */
export function safeAnswer(s: unknown, max: number): string | null {
  if (typeof s !== "string") return null;
  const t = s.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, " ").replace(/<[^>]*>/g, "").trim().slice(0, max);
  if (!t) return null;
  if (/\b(cures?|heals?|clinically proven|guarantee[sd]?|miracle|whiten\w*|fairness)\b/i.test(t)) return null;
  return t;
}
