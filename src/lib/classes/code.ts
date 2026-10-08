// Short human-readable class invite codes: unambiguous characters only
// (no 0/O, 1/I/L) so they survive whiteboards and voice notes.

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function makeClassCode(length = 6): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

export function normalizeClassCode(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[\s-]/g, '')
    .replace(/0/g, 'O')
    .replace(/1/g, 'I');
}

export function isValidClassCode(raw: string): boolean {
  const code = normalizeClassCode(raw);
  return new RegExp(`^[${ALPHABET}]{4,8}$`).test(code);
}
