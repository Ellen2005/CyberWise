import { describe, it, expect } from 'vitest';
import { analyzeUrl } from './url-signals';

describe('analyzeUrl', () => {
  it('flags http', () => {
    const a = analyzeUrl('http://example.com/login');
    expect(a.signals.some((s) => s.label.includes('http'))).toBe(true);
  });
  it('flags lookalike/subdomain tricks and shorteners', () => {
    const a = analyzeUrl('https://paypal.com.secure-login.co/verify');
    expect(a.signals.some((s) => s.label.includes('subdomain'))).toBe(true);
    const b = analyzeUrl('bit.ly/xyz123');
    expect(b.signals.some((s) => s.label.includes('Shortened'))).toBe(true);
  });
  it('flags IP hosts and punycode', () => {
    expect(analyzeUrl('http://192.168.0.5/login').signals.some((s) => s.label.includes('IP'))).toBe(true);
    expect(analyzeUrl('https://xn--paypl-7va.com').signals.some((s) => s.label.includes('punycode'))).toBe(true);
  });
  it('always states the real domain and never guarantees safety', () => {
    const a = analyzeUrl('https://example.com');
    expect(a.signals.some((s) => s.label.startsWith('Real domain:'))).toBe(true);
    expect(a.signals.some((s) => /guaranteed safe/i.test(s.label + s.detail))).toBe(false);
  });
  it('handles garbage input', () => {
    const a = analyzeUrl('not a url at all !!!');
    expect(a.signals[0].label).toBe('Not a valid URL');
  });
});
