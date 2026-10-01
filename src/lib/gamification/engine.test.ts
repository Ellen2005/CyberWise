import { describe, it, expect } from 'vitest';
import {
  levelFromXp,
  xpForLevel,
  xpToNextLevel,
  rankFromXp,
  applyXp,
  updateStreak,
  todayString,
} from './engine';

describe('levelFromXp', () => {
  it('starts at level 1', () => {
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
  });
  it('caps at MAX_LEVEL', () => {
    expect(levelFromXp(999_999)).toBe(100);
  });
});

describe('xpForLevel / xpToNextLevel', () => {
  it('is consistent', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(3)).toBe(200);
    const p = xpToNextLevel(150);
    expect(p.progress).toBe(50);
    expect(p.remaining).toBe(50);
  });
});

describe('rankFromXp', () => {
  it('progresses through ranks', () => {
    expect(rankFromXp(0).id).toBe('novice');
    expect(rankFromXp(500).id).toBe('apprentice');
    expect(rankFromXp(20_000).id).toBe('legend');
  });
});

describe('applyXp', () => {
  it('adds xp and detects level up', () => {
    const r = applyXp(90, 20);
    expect(r.newTotalXp).toBe(110);
    expect(r.leveledUp).toBe(true);
    expect(r.level).toBe(2);
  });
  it('unlocks first-challenge badge once', () => {
    const r = applyXp(0, 10, [], { completedChallenges: 1 });
    expect(r.newBadges.map((b) => b.id)).toContain('first-challenge');
    const again = applyXp(10, 10, ['first-challenge'], { completedChallenges: 2 });
    expect(again.newBadges.map((b) => b.id)).not.toContain('first-challenge');
  });
  it('never goes negative', () => {
    const r = applyXp(50, -1000);
    expect(r.newTotalXp).toBe(50);
  });
});

describe('updateStreak', () => {
  it('starts a streak', () => {
    expect(updateStreak(0, undefined, '2026-09-27').streak).toBe(1);
  });
  it('does not double-count the same day', () => {
    expect(updateStreak(4, '2026-09-27', '2026-09-27').streak).toBe(4);
  });
  it('increments on consecutive days', () => {
    expect(updateStreak(4, '2026-09-26', '2026-09-27').streak).toBe(5);
  });
  it('resets after a gap', () => {
    expect(updateStreak(9, '2026-09-20', '2026-09-27').streak).toBe(1);
  });
  it('todayString is YYYY-MM-DD', () => {
    expect(todayString(new Date('2026-09-27T12:00:00Z'))).toBe('2026-09-27');
  });
});
