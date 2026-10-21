import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/* Newsletter + contact submissions: appended to a JSONL file and, when
   FORMS_WEBHOOK_URL is set, forwarded (Mailchimp/Klaviyo via Zapier,
   Google Sheets via Apps Script, Slack…). */
const DIR = process.env.ORDERS_DIR || path.join(process.cwd(), ".data");

export async function recordSubmission(kind: "newsletter" | "contact" | "customization", data: Record<string, unknown>): Promise<{ stored: boolean; forwarded: boolean | null }> {
  let stored = false;
  let forwarded: boolean | null = null;
  const entry = { kind, at: new Date().toISOString(), ...data };
  try {
    await fs.mkdir(DIR, { recursive: true });
    await fs.appendFile(path.join(DIR, `${kind}.jsonl`), JSON.stringify(entry) + "\n");
    stored = true;
  } catch (e) {
    console.warn(`[forms] could not write ${kind}:`, (e as Error).message);
  }
  const url = process.env.FORMS_WEBHOOK_URL;
  if (url) {
    try {
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry) });
      forwarded = r.ok;
    } catch (e) {
      forwarded = false;
      console.warn("[forms] webhook failed:", (e as Error).message);
    }
  }
  return { stored, forwarded };
}

export const isEmail = (v: unknown): v is string => typeof v === "string" && v.length < 200 && /^\S+@\S+\.\S+$/.test(v);
export const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
