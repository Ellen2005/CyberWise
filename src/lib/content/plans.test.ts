import { describe, it, expect } from 'vitest';
import { plans } from './plans';
import { scenarios } from './scenarios';
import { scenarios2 } from './scenarios-2';
import { RANKS, BADGES } from '../gamification/engine';
import { CHALLENGE_TYPE_META } from '../seed/challenges';

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u;

describe('guided plans', () => {
  it('has 4 audience plans with exactly 7 days each', () => {
    expect(plans).toHaveLength(4);
    for (const p of plans) {
      expect(p.days).toHaveLength(7);
      expect(p.days.map((d) => d.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    }
  });
  it('has unique slugs and internal links', () => {
    const slugs = plans.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of plans) {
      for (const d of p.days) {
        expect(d.href.startsWith('/')).toBe(true);
        expect(d.minutes).toBeGreaterThan(0);
      }
    }
  });
});

describe('scenario coverage', () => {
  it('covers the everyday-threat catalog', () => {
    const haystacks = [...scenarios, ...scenarios2].map((s) =>
      `${s.title} ${s.message} ${s.category}`.toLowerCase()
    );
    const needed = ['whatsapp', 'mobile money', 'mtn', 'apk', 'job', 'exam', 'facebook', 'wi-fi', 'giveaway', 'qr', 'invoice', 'password', 'certificate', 'friend'];
    for (const n of needed) {
      expect(haystacks.some((t) => t.includes(n))).toBe(true);
    }
  });
});

describe('content hygiene', () => {
  it('uses icon names, never emoji, for ranks/bages/types', () => {
    for (const r of RANKS) expect(r.icon).not.toMatch(EMOJI);
    for (const b of BADGES) expect(b.icon).not.toMatch(EMOJI);
    for (const m of Object.values(CHALLENGE_TYPE_META)) expect(m.icon).not.toMatch(EMOJI);
  });
  it('rank names are beginner-friendly', () => {
    const names = RANKS.map((r) => r.name);
    expect(names[0]).toBe('Cyber Beginner');
    expect(names).toContain('Scam Spotter');
  });
});
