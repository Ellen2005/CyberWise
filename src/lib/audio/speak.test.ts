import { describe, it, expect } from 'vitest';
import { pickVoice, personaProfile } from './speak';

const voices = [
  { name: 'Robot Voice', lang: 'en-US', localService: false },
  { name: 'Google US English', lang: 'en-US', localService: false },
  { name: 'Amelie', lang: 'fr-FR', localService: true },
];

describe('pickVoice', () => {
  it('prefers natural/neural vendor voices', () => {
    expect(pickVoice(voices, 'en')?.name).toBe('Google US English');
  });
  it('falls back to local voices, then first match', () => {
    expect(pickVoice(voices, 'fr')?.name).toBe('Amelie');
    expect(pickVoice([{ name: 'X', lang: 'de-DE', localService: true }], 'en')).toBeNull();
  });
});

describe('personaProfile', () => {
  it('gives the scammer a rushed, flatter delivery', () => {
    const s = personaProfile('scammer');
    const n = personaProfile('narrator');
    expect(s.rate).toBeGreaterThan(n.rate);
    expect(s.pitch).toBeLessThan(n.pitch);
  });
});
