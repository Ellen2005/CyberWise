import { describe, it, expect } from 'vitest';
import { getDailyChallengeSlug, getDailyChallenge } from './daily-challenge';

describe('daily challenge', () => {
  it('is deterministic for the same day', () => {
    const d = new Date('2026-09-27T12:00:00Z');
    expect(getDailyChallengeSlug(d)).toBe(getDailyChallengeSlug(new Date('2026-09-27T18:00:00Z')));
  });
  it('resolves to a published challenge', () => {
    const c = getDailyChallenge(new Date('2026-09-27T12:00:00Z'));
    expect(c.published).toBe(true);
    expect(c.slug).toBeTruthy();
  });
});
