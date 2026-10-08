import { describe, it, expect } from 'vitest';
import { makeClassCode, normalizeClassCode, isValidClassCode } from './code';

describe('class codes', () => {
  it('generates unambiguous codes', () => {
    for (let i = 0; i < 20; i++) {
      const c = makeClassCode();
      expect(c).toMatch(/^[A-Z2-9]{6}$/);
      expect(c).not.toMatch(/[0O1IL]/);
    }
  });
  it('normalizes user input', () => {
    expect(normalizeClassCode('ab-12 cd')).toBe('ABI2CD');
    expect(normalizeClassCode('0o1il')).toBe('OOIIL');
  });
  it('validates shape', () => {
    expect(isValidClassCode('ABCDEF')).toBe(true);
    expect(isValidClassCode('abc def')).toBe(true);
    expect(isValidClassCode('A!C')).toBe(false);
    expect(isValidClassCode('ABC')).toBe(false);
  });
});
