/**
 * Minimal in-memory rate limiter for the form server actions.
 *
 * Sliding window per key (a coarse client identifier), kept in process memory.
 * This is an abuse-control *extension point*: on a single long-lived server it
 * works as-is; on serverless or multi-instance deployments, swap the Map for
 * Redis/Upstash/etc. behind the same function signature.
 *
 * Privacy: keys are hashed before storage and nothing else is retained.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

function hash(input: string) {
  // djb2 — not cryptographic; just avoids retaining raw IPs in memory.
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export function isRateLimited(identifier: string): boolean {
  const key = hash(identifier);
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const list = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(key, list);
    return true;
  }
  list.push(now);
  hits.set(key, list);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }
  return false;
}
