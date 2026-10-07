import { describe, it, expect } from 'vitest';
import { dictionaries } from './dict';

function keys(obj: unknown, prefix = ''): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keys(v, prefix ? `${prefix}.${k}` : k)
  );
}

function get(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], obj);
}

describe('dictionaries', () => {
  it('french covers every english key with non-empty text', () => {
    for (const key of keys(dictionaries.en)) {
      const fr = get(dictionaries.fr, key);
      expect(typeof fr, key).toBe('string');
      expect((fr as string).trim().length, key).toBeGreaterThan(0);
    }
  });
  it('has no leftover emoji in chrome strings', () => {
    const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u;
    for (const key of keys(dictionaries.en)) {
      expect(String(get(dictionaries.en, key))).not.toMatch(EMOJI);
      expect(String(get(dictionaries.fr, key))).not.toMatch(EMOJI);
    }
  });
});
