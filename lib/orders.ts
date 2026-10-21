import "server-only";
import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Order } from "@/types";

/* ------------------------------------------------------------------
   Order store.
   Default: a JSON file on disk (ORDERS_DIR, default ./.data). This is
   right for a Node server / VPS / Docker deployment.
   On serverless hosts (Vercel, Netlify) the filesystem is temporary —
   replace the three functions below with your database (Supabase,
   Postgres, Firestore, Airtable…). The rest of the app only calls
   saveOrder / getOrder / updateOrder.
------------------------------------------------------------------- */

const DIR = process.env.ORDERS_DIR || path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "orders.json");

// in-memory fallback when the disk is read-only
const memory = new Map<string, Order>();
let queue: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<Record<string, Order>> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return Object.fromEntries(memory);
  }
}

async function writeAll(all: Record<string, Order>) {
  for (const [k, v] of Object.entries(all)) memory.set(k, v);
  try {
    await fs.mkdir(DIR, { recursive: true });
    const tmp = FILE + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(all, null, 2));
    await fs.rename(tmp, FILE);
  } catch (e) {
    console.warn("[orders] disk write failed, kept in memory only:", (e as Error).message);
  }
}

function serialized<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

/** Human-friendly, unguessable order id: CO2-261008-7KQ4XM */
export function newOrderId() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(6);
  const rand = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `CO2-${ymd}-${rand}`;
}

export function saveOrder(order: Order) {
  return serialized(async () => {
    const all = await readAll();
    all[order.id] = order;
    await writeAll(all);
    return order;
  });
}

export async function getOrder(id: string) {
  const all = await readAll();
  return all[id] ?? memory.get(id) ?? null;
}

export function updateOrder(id: string, patch: Partial<Order>) {
  return serialized(async () => {
    const all = await readAll();
    const current = all[id] ?? memory.get(id);
    if (!current) return null;
    const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
    all[id] = next;
    await writeAll(all);
    return next;
  });
}

export async function findByRazorpayOrderId(rzpOrderId: string) {
  const all = await readAll();
  return Object.values(all).find((o) => o.razorpayOrderId === rzpOrderId) ?? null;
}
