import { describe, it, expect } from 'vitest';
import { youthSessions, POWERS } from './sessions';

describe('youth sessions', () => {
  it('has 15 sessions with unique slugs', () => {
    expect(youthSessions).toHaveLength(15);
    const slugs = youthSessions.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('every session is runnable: ages, timing, steps, practice link', () => {
    for (const s of youthSessions) {
      expect(s.ages.length).toBeGreaterThan(0);
      expect(s.minutes).toBeGreaterThan(0);
      expect(s.steps.length).toBeGreaterThan(0);
      expect(s.steps.reduce((t, st) => t + st.minutes, 0)).toBeLessThanOrEqual(s.minutes + 5);
      expect(s.appHref.startsWith('/')).toBe(true);
      expect(s.materials.length).toBeGreaterThan(0);
    }
  });
  it('covers all three age bands', () => {
    const bands = new Set(youthSessions.flatMap((s) => s.ages));
    expect(bands).toEqual(new Set(['7-10', '11-13', '14-18']));
  });
});

describe('safety powers', () => {
  it('defines the 5 memorable powers', () => {
    expect(POWERS.map((p) => p.name)).toEqual(['STOP', 'THINK', 'CHECK', 'PROTECT', 'TELL']);
  });
});
