// ============================================
// CyberWise Rate Limiter
// Simple in-memory sliding-window rate limiter for Server Actions.
// NOTE: In-memory is per-instance. For multi-instance production,
// replace with Redis/Firestore-based limiter.
// ============================================

const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 10;

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

// Clean up expired buckets periodically to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      if (bucket.resetAt <= now) {
        buckets.delete(key);
      }
    }
  }, DEFAULT_WINDOW_MS * 2);
}

export function rateLimit(
  key: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= maxRequests) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, remaining: maxRequests - bucket.count, retryAfterMs: 0 };
}

/**
 * Higher-order wrapper for Server Actions.
 * Usage:
 *   export const myAction = withRateLimit('my-action', { max: 5, windowMs: 60_000 }, async (prevState, formData) => { ... });
 */
export function withRateLimit<TArgs extends unknown[], TResult>(
  keyPrefix: string,
  options: { max?: number; windowMs?: number; keyResolver?: (...args: TArgs) => string },
  fn: (...args: TArgs) => Promise<TResult>
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs) => {
    const suffix = options.keyResolver ? options.keyResolver(...args) : 'default';
    const { allowed, retryAfterMs } = rateLimit(
      `${keyPrefix}:${suffix}`,
      options.max ?? DEFAULT_MAX_REQUESTS,
      options.windowMs ?? DEFAULT_WINDOW_MS
    );

    if (!allowed) {
      throw new Error(
        `Too many requests. Please wait ${Math.ceil(retryAfterMs / 1000)} seconds before trying again.`
      );
    }

    return fn(...args);
  };
}