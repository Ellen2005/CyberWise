import { describe, it, expect } from 'vitest';
import { initials, hue, isUrgent, isVoice } from './format';

describe('chat format', () => {
  it('builds initials from messy sender names', () => {
    expect(initials('+237 6XX XXX XXX (unknown number)')).toBe('XX');
    expect(initials('Bank Security')).toBe('BS');
    expect(initials('Faceb00k Security')).toBe('FK');
    expect(initials('')).toBe('?');
  });
  it('assigns stable hues per sender', () => {
    expect(hue('MTN')).toBe(hue('MTN'));
    expect(hue('MTN')).toBeGreaterThanOrEqual(0);
    expect(hue('MTN')).toBeLessThan(360);
  });
  it('detects pressure language in both languages', () => {
    expect(isUrgent('URGENT! Suspended in 24 hours, act NOW')).toBe(true);
    expect(isUrgent('Urgent : votre compte expire dans 2 heures')).toBe(true);
    expect(isUrgent('Hi, how are you today?')).toBe(false);
  });
  it('detects voice scenarios', () => {
    expect(isVoice('WhatsApp voice note', '[Voice note] hello')).toBe(true);
    expect(isVoice('SMS', 'You won money')).toBe(false);
  });
});
