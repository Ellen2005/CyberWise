import { describe, it, expect } from 'vitest';
import { computeInsights, topicOfAttempt } from './insights';

describe('topicOfAttempt', () => {
  it('maps scenario ids to topics', () => {
    expect(topicOfAttempt({ contentId: 'sc-whatsapp-verify', contentType: 'quiz', status: 'completed' })).toBe('Scams');
    expect(topicOfAttempt({ contentId: 'sc-apk-data', contentType: 'quiz', status: 'completed' })).toBe('Malware');
    expect(topicOfAttempt({ contentId: 'sc-password-reuse', contentType: 'quiz', status: 'completed' })).toBe('Passwords');
  });
  it('maps labs and wwyd', () => {
    expect(topicOfAttempt({ contentId: 'ph-bank-otp', contentType: 'quiz', status: 'completed' })).toBe('Phishing');
    expect(topicOfAttempt({ contentId: 'wwyd-bank-whatsapp', contentType: 'quiz', status: 'completed' })).toBe('Phishing');
    expect(topicOfAttempt({ contentId: 'spot-bank-sms', contentType: 'quiz', status: 'completed' })).toBe('Phishing');
  });
  it('returns null for unknown ids', () => {
    expect(topicOfAttempt({ contentId: 'nope', contentType: 'quiz', status: 'completed' })).toBeNull();
  });
});

describe('computeInsights', () => {
  it('returns empty state with no data', () => {
    const ins = computeInsights([]);
    expect(ins.total).toBe(0);
    expect(ins.recognition.pct).toBeNull();
    expect(ins.decision.pct).toBeNull();
  });
  it('computes recognition and decision rates', () => {
    const ins = computeInsights([
      { contentId: 'ph-bank-otp', contentType: 'quiz', status: 'completed', correct: true },
      { contentId: 'ph-delivery-fee', contentType: 'quiz', status: 'failed', correct: false },
      { contentId: 'wwyd-bank-whatsapp', contentType: 'quiz', status: 'completed', correct: true },
      { contentId: 'sc-whatsapp-verify', contentType: 'quiz', status: 'completed', correct: true },
    ]);
    expect(ins.recognition.total).toBe(4);
    expect(ins.recognition.pct).toBe(75);
    expect(ins.decision.total).toBe(2);
    expect(ins.decision.pct).toBe(100);
  });
  it('computes trend with enough data', () => {
    const mk = (ok: boolean, i: number) => ({
      contentId: 'ph-bank-otp', contentType: 'quiz',
      status: ok ? 'completed' : 'failed', correct: ok, submittedAt: { seconds: 1000 + i },
    });
    const ins = computeInsights([...[false, false, true].map((ok, i) => mk(ok, i)), ...[true, true, true].map((ok, i) => mk(ok, i + 3))]);
    expect(ins.trend.delta).toBeGreaterThan(0);
  });
});
