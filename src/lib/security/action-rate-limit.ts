import { headers } from 'next/headers';
import { rateLimit } from './rate-limiter';

/** Per-client-IP sliding-window guard for Server Actions. Throws when over limit. */
export async function guardActionRateLimit(
  action: string,
  max = 10,
  windowMs = 60_000
): Promise<void> {
  let ip = 'unknown';
  try {
    const h = await headers();
    ip =
      h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      h.get('x-real-ip') ||
      'unknown';
  } catch {
    // headers() unavailable (e.g. tests) — fall back to shared bucket.
  }
  const { allowed, retryAfterMs } = rateLimit(
    `${action}:${ip}`,
    max,
    windowMs
  );
  if (!allowed) {
    throw new Error(
      `Too many requests. Please wait ${Math.ceil(retryAfterMs / 1000)} seconds before trying again.`
    );
  }
}
