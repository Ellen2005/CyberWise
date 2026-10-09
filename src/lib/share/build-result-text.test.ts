import { describe, it, expect } from 'vitest';
import { buildResultText } from './build-result-text';
import { certificateIdFor, isValidCertificateId } from '../gamification/certificates';

describe('buildResultText', () => {
  it('includes score, title, and link — never personal data', () => {
    const { text } = buildResultText('spot', 'Bank SMS alert', 92, 'https://x/spot');
    expect(text).toContain('92%');
    expect(text).toContain('Bank SMS alert');
    expect(text).toContain('https://x/spot');
    expect(text).not.toMatch(/@|OTP|password/i);
  });
  it('challenges low scorers instead of shaming', () => {
    const { text } = buildResultText('risk', 'Risk Check', 30, 'https://x/risk');
    expect(text).toContain('30%');
    expect(text.toLowerCase()).not.toContain('fail');
  });
  it('handles unscored completions', () => {
    const { text } = buildResultText('plan', 'Phishing Week', null, 'https://x/plans');
    expect(text).toContain('Phishing Week');
  });
});

describe('certificates', () => {
  it('issues stable, valid ids', () => {
    const a = certificateIdFor('u1', 'plan-x');
    expect(a).toBe(certificateIdFor('u1', 'plan-x'));
    expect(isValidCertificateId(a)).toBe(true);
    expect(certificateIdFor('u2', 'plan-x')).not.toBe(a);
    expect(isValidCertificateId('nope')).toBe(false);
  });
});
