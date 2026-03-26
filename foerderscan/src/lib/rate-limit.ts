/**
 * Einfaches In-Memory Rate Limiting für Next.js API-Routen.
 * Funktioniert auf Vercel (pro Serverless-Instanz).
 * Für produktiven Multi-Instance-Betrieb: Upstash Redis verwenden.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Alten Einträge alle 10 Minuten bereinigen
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximale Anfragen pro Zeitfenster */
  limit: number;
  /** Zeitfenster in Sekunden */
  windowSec: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSec * 1000;
  const entry = store.get(identifier);

  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(identifier, newEntry);
    return { allowed: true, remaining: config.limit - 1, resetAt: newEntry.resetAt };
  }

  entry.count += 1;
  const remaining = Math.max(0, config.limit - entry.count);
  return {
    allowed: entry.count <= config.limit,
    remaining,
    resetAt: entry.resetAt,
  };
}

/** Hilfsfunktion: IP-Adresse aus Next.js Request extrahieren */
export function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
