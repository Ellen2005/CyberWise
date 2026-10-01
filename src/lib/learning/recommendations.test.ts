import { describe, it, expect } from 'vitest';
import { summarizePerformance, recommendNext } from './recommendations';

describe('summarizePerformance', () => {
  it('flags failed topics as weak areas', () => {
    const s = summarizePerformance([
      { contentType: 'challenge', contentId: 'challenge-phishing-001', status: 'failed', correct: false },
    ]);
    expect(s.weakAreas).toContain('Phishing');
  });
  it('lists mastered topics as strengths', () => {
    const s = summarizePerformance([
      { contentType: 'challenge', contentId: 'challenge-phishing-001', status: 'completed', correct: true },
      { contentType: 'challenge', contentId: 'challenge-phishing-002', status: 'completed', correct: true },
    ]);
    expect(s.strengths).toContain('Phishing detection');
    expect(s.weakAreas).not.toContain('Phishing');
  });
  it('handles no data', () => {
    expect(summarizePerformance([])).toEqual({ strengths: [], weakAreas: [], byTopic: {} });
  });
});

describe('recommendNext', () => {
  it('recommends phishing help after phishing failure', () => {
    const recs = recommendNext([
      { contentType: 'challenge', contentId: 'challenge-phishing-001', status: 'failed', correct: false },
    ]);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].topic).toBe('Phishing');
  });
  it('returns starter path for new users', () => {
    const recs = recommendNext([]);
    expect(recs).toHaveLength(3);
    expect(recs[0].href).toBe('/learn/what-is-cybersecurity');
  });
  it('uses interests when nothing failed', () => {
    const recs = recommendNext([], ['Passwords']);
    expect(recs.some((r) => r.topic === 'Passwords')).toBe(true);
  });
});
