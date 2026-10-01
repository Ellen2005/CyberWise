import { describe, it, expect } from 'vitest';
import { rateLimit } from './rate-limiter';

describe('rateLimit', () => {
  it('allows up to max then blocks', () => {
    const key = `test-${Date.now()}`;
    expect(rateLimit(key, 2, 60_000).allowed).toBe(true);
    expect(rateLimit(key, 2, 60_000).allowed).toBe(true);
    const third = rateLimit(key, 2, 60_000);
    expect(third.allowed).toBe(false);
    expect(third.retryAfterMs).toBeGreaterThan(0);
  });
  it('resets after window', async () => {
    const key = `test-${Date.now()}-short`;
    expect(rateLimit(key, 1, 20).allowed).toBe(true);
    expect(rateLimit(key, 1, 20).allowed).toBe(false);
    await new Promise((r) => setTimeout(r, 30));
    expect(rateLimit(key, 1, 20).allowed).toBe(true);
  });
});
