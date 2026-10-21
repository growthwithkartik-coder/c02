import "server-only";

/* Small in-memory rate limiter (per server instance). Good enough to stop
   accidental loops and casual abuse; use a shared store (Redis/Upstash)
   behind a load balancer. */
const buckets = new Map<string, { n: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    return { ok: true, retryAfter: 0 };
  }
  b.n++;
  return b.n > limit ? { ok: false, retryAfter: Math.ceil((b.reset - now) / 1000) } : { ok: true, retryAfter: 0 };
}

export function clientKey(req: Request) {
  return (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "local").trim();
}
