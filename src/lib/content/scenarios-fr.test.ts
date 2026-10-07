import { describe, it, expect } from 'vitest';
import { scenarios } from './scenarios';
import { scenarios2 } from './scenarios-2';
import { localizeScenario, missingFrench } from './localize';

const ALL = [...scenarios, ...scenarios2];

describe('french scenario coverage', () => {
  it('covers every scenario', () => {
    expect(missingFrench(ALL.map((s) => s.id))).toEqual([]);
  });
  it('mirrors structure: slug, choices, verdicts, flags, xp', () => {
    for (const s of ALL) {
      const fr = localizeScenario(s, 'fr');
      expect(fr.slug, s.id).toBe(s.slug);
      expect(fr.xpReward, s.id).toBe(s.xpReward);
      expect(fr.choices.map((c) => c.id), s.id).toEqual(s.choices.map((c) => c.id));
      expect(fr.choices.map((c) => c.verdict), s.id).toEqual(s.choices.map((c) => c.verdict));
      expect(fr.redFlags, s.id).toHaveLength(s.redFlags.length);
      expect(fr.protect, s.id).toHaveLength(s.protect.length);
      for (const c of fr.choices) {
        expect(c.text.trim().length, `${s.id}/${c.id}`).toBeGreaterThan(0);
        expect(c.feedback.trim().length, `${s.id}/${c.id}`).toBeGreaterThan(0);
      }
    }
  });
  it('english passes through untouched', () => {
    for (const s of ALL) {
      expect(localizeScenario(s, 'en')).toBe(s);
    }
  });
});
