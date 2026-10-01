import { seedChallenges } from '@/lib/seed/challenges';

const AWARENESS_SLUGS = [
  'spot-the-phishing-email',
  'analyze-the-suspicious-link',
] as const;

/** Deterministic daily challenge from published awareness-friendly challenges. */
export function getDailyChallengeSlug(date: Date = new Date()): string {
  const published = seedChallenges.filter((c) => c.published);
  const awareness = published.filter((c) => AWARENESS_SLUGS.includes(c.slug as (typeof AWARENESS_SLUGS)[number]));
  const pool = awareness.length > 0 ? awareness : published;
  const dayIndex = Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
  const pick = pool[dayIndex % pool.length];
  return pick.slug;
}

export function getDailyChallenge(date: Date = new Date()) {
  const slug = getDailyChallengeSlug(date);
  return seedChallenges.find((c) => c.slug === slug) ?? seedChallenges[0];
}

export const WEEKDAY_FOCUS: Record<number, string> = {
  0: 'Weekly review — revisit a lesson or challenge you found tricky.',
  1: 'Phishing — inspect senders and links before you trust a message.',
  2: 'Scams — slow down when someone pushes urgency or secrecy.',
  3: 'Online safety — think before you share or respond.',
  4: 'Passwords & accounts — unique passwords and MFA where you can.',
  5: 'Social engineering — verify who you are really talking to.',
  6: 'Investigation — use clues, not guesses, to decide what is safe.',
};
