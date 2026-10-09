import { describe, it, expect } from 'vitest';
import { scoreInvestigation, passedInvestigation } from './investigation-score';

const REAL = ['a', 'b', 'c', 'd'];

describe('scoreInvestigation', () => {
  it('rewards perfect investigation', () => {
    const s = scoreInvestigation(['a', 'b', 'c', 'd'], REAL, true);
    expect(s.score).toBeCloseTo(0.85);
    expect(passedInvestigation(s)).toBe(true);
    expect(s.falsePositives).toEqual([]);
  });
  it('punishes select-everything (distractors included)', () => {
    const s = scoreInvestigation(['a', 'b', 'c', 'd', 'x', 'y'], REAL, true);
    expect(s.falsePositives).toEqual(['x', 'y']);
    expect(passedInvestigation(s)).toBe(false);
  });
  it('keeps honest partial passes passing', () => {
    const s = scoreInvestigation(['a', 'b'], REAL, true);
    expect(passedInvestigation(s)).toBe(true);
  });
  it('fails wrong verdicts even with full recall', () => {
    const s = scoreInvestigation(['a', 'b', 'c', 'd'], REAL, false);
    expect(passedInvestigation(s)).toBe(false);
  });
  it('fails empty investigation', () => {
    const s = scoreInvestigation([], REAL, true);
    expect(passedInvestigation(s)).toBe(false);
    expect(s.missed).toEqual(REAL);
  });
});
