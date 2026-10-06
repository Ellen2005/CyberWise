// ============================================
// CyberWise Gamification Engine
// Pure functions for XP, levels, ranks, streaks, badges.
// All functions are pure and testable.
// ============================================

import type { Rank, Badge, UserProfile, SkillProgress } from '@/types';

// ---------- XP & Levels ----------

export const XP_PER_LEVEL = 100;
export const MAX_LEVEL = 100;

export const RANKS: Rank[] = [
  { id: 'novice', name: 'Cyber Beginner', minXP: 0, icon: 'Shield' },
  { id: 'apprentice', name: 'Scam Spotter', minXP: 500, icon: 'Swords' },
  { id: 'analyst', name: 'Phishing Detective', minXP: 1500, icon: 'Search' },
  { id: 'specialist', name: 'Security Defender', minXP: 3500, icon: 'Target' },
  { id: 'expert', name: 'Cyber Expert', minXP: 7000, icon: 'Gem' },
  { id: 'master', name: 'WiseTap Master', minXP: 12000, icon: 'Trophy' },
  { id: 'legend', name: 'WiseTap Legend', minXP: 20000, icon: 'Crown' },
];

export const BADGES: Badge[] = [
  {
    id: 'first-challenge',
    name: 'First Flag',
    description: 'Complete your first challenge.',
    icon: 'Flag',
    category: 'challenge',
    criteria: { completedChallenges: 1 },
    xpBonus: 50,
  },
  {
    id: 'phishing-detective',
    name: 'Phishing Detective',
    description: 'Perfect score in the Phishing Challenge.',
    icon: 'Fish',
    category: 'challenge',
    criteria: { phishingPerfect: true },
    xpBonus: 100,
  },
  {
    id: 'streak-3',
    name: '3-Day Streak',
    description: 'Learn 3 days in a row.',
    icon: 'Flame',
    category: 'streak',
    criteria: { streak: 3 },
    xpBonus: 30,
  },
  {
    id: 'streak-7',
    name: '7-Day Streak',
    description: 'Learn 7 days in a row.',
    icon: 'Sun',
    category: 'streak',
    criteria: { streak: 7 },
    xpBonus: 100,
  },
  {
    id: 'streak-30',
    name: '30-Day Streak',
    description: 'Learn 30 days in a row.',
    icon: 'Zap',
    category: 'streak',
    criteria: { streak: 30 },
    xpBonus: 500,
  },
  {
    id: 'challenges-10',
    name: 'Challenge Hunter',
    description: 'Complete 10 challenges.',
    icon: 'Crosshair',
    category: 'milestone',
    criteria: { completedChallenges: 10 },
    xpBonus: 150,
  },
  {
    id: 'challenges-25',
    name: 'Challenge Veteran',
    description: 'Complete 25 challenges.',
    icon: 'Medal',
    category: 'milestone',
    criteria: { completedChallenges: 25 },
    xpBonus: 300,
  },
  {
    id: 'challenges-100',
    name: 'Challenge Master',
    description: 'Complete 100 challenges.',
    icon: 'Award',
    category: 'milestone',
    criteria: { completedChallenges: 100 },
    xpBonus: 1000,
  },
  {
    id: 'lessons-5',
    name: 'Curious Learner',
    description: 'Complete 5 lessons.',
    icon: 'BookOpen',
    category: 'learn',
    criteria: { completedLessons: 5 },
    xpBonus: 50,
  },
  {
    id: 'lessons-20',
    name: 'Dedicated Learner',
    description: 'Complete 20 lessons.',
    icon: 'BookMarked',
    category: 'learn',
    criteria: { completedLessons: 20 },
    xpBonus: 200,
  },
  {
    id: 'first-story',
    name: 'Story Explorer',
    description: 'Complete your first Cyber Story.',
    icon: 'BookOpen',
    category: 'story',
    criteria: { completedStories: 1 },
    xpBonus: 50,
  },
  {
    id: 'stories-5',
    name: 'Story Seeker',
    description: 'Complete 5 Cyber Stories.',
    icon: 'Library',
    category: 'story',
    criteria: { completedStories: 5 },
    xpBonus: 150,
  },
  {
    id: 'log-hunter',
    name: 'Log Hunter',
    description: 'Solve a log analysis challenge.',
    icon: 'Search',
    category: 'challenge',
    criteria: { logAnalysisSolved: true },
    xpBonus: 75,
  },
  {
    id: 'web-explorer',
    name: 'Web Explorer',
    description: 'Solve a web security challenge.',
    icon: 'Globe',
    category: 'challenge',
    criteria: { webSolved: true },
    xpBonus: 75,
  },
  {
    id: 'crypto-1',
    name: 'Code Breaker',
    description: 'Solve a cryptography challenge.',
    icon: 'Lock',
    category: 'challenge',
    criteria: { cryptoSolved: true },
    xpBonus: 75,
  },
  {
    id: 'incident-responder',
    name: 'Incident Responder',
    description: 'Complete an investigation challenge.',
    icon: 'Siren',
    category: 'challenge',
    criteria: { investigationSolved: true },
    xpBonus: 100,
  },
  {
    id: 'level-5',
    name: 'Level 5',
    description: 'Reach level 5.',
    icon: 'Star',
    category: 'milestone',
    criteria: { level: 5 },
    xpBonus: 100,
  },
  {
    id: 'level-10',
    name: 'Level 10',
    description: 'Reach level 10.',
    icon: 'Sparkles',
    category: 'milestone',
    criteria: { level: 10 },
    xpBonus: 250,
  },
  {
    id: 'level-20',
    name: 'Level 20',
    description: 'Reach level 20.',
    icon: 'Rocket',
    category: 'milestone',
    criteria: { level: 20 },
    xpBonus: 500,
  },
  {
    id: 'level-50',
    name: 'Level 50',
    description: 'Reach level 50.',
    icon: 'Crown',
    category: 'milestone',
    criteria: { level: 50 },
    xpBonus: 1500,
  },
  {
    id: 'ctf-first',
    name: 'CTF Rookie',
    description: 'Solve your first CTF flag.',
    icon: 'Target',
    category: 'ctf',
    criteria: { ctfSolved: true },
    xpBonus: 100,
  },
  {
    id: 'ctf-10',
    name: 'CTF Competitor',
    description: 'Solve 10 CTF flags.',
    icon: 'Swords',
    category: 'ctf',
    criteria: { ctfSolvedCount: 10 },
    xpBonus: 300,
  },
];

export function xpForLevel(level: number): number {
  return (level - 1) * XP_PER_LEVEL;
}

export function levelFromXp(totalXp: number): number {
  if (totalXp <= 0) return 1;
  return Math.min(Math.floor(totalXp / XP_PER_LEVEL) + 1, MAX_LEVEL);
}

export function xpToNextLevel(totalXp: number): { currentLevelXp: number; nextLevelXp: number; xpIntoLevel: number; remaining: number; progress: number } {
  const level = levelFromXp(totalXp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const xpIntoLevel = totalXp - currentLevelXp;
  const needed = nextLevelXp - currentLevelXp;
  const remaining = Math.max(0, needed - xpIntoLevel);
  const progress = Math.min(100, Math.round((xpIntoLevel / needed) * 100));
  return { currentLevelXp, nextLevelXp, xpIntoLevel, remaining, progress };
}

export function rankFromXp(totalXp: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (totalXp >= rank.minXP) {
      current = rank;
    } else {
      break;
    }
  }
  return current;
}

export interface XpResult {
  newTotalXp: number;
  level: number;
  rank: Rank;
  leveledUp: boolean;
  newBadges: Badge[];
}

export function applyXp(
  currentXp: number,
  xpToAdd: number,
  currentBadges: string[] = [],
  stats: {
    completedChallenges?: number;
    completedLessons?: number;
    completedStories?: number;
    streak?: number;
    logAnalysisSolved?: boolean;
    webSolved?: boolean;
    cryptoSolved?: boolean;
    investigationSolved?: boolean;
    ctfSolved?: boolean;
    ctfSolvedCount?: number;
    phishingPerfect?: boolean;
  } = {}
): XpResult {
  const newTotalXp = currentXp + Math.max(0, xpToAdd);
  const oldLevel = levelFromXp(currentXp);
  const newLevel = levelFromXp(newTotalXp);
  const newRank = rankFromXp(newTotalXp);

  // Check for newly earned badges
  const newBadges = BADGES.filter((badge) => {
    if (currentBadges.includes(badge.id)) return false;
    const c = badge.criteria;
    return Object.entries(c).every(([key, value]) => {
      switch (key) {
        case 'completedChallenges': return (stats.completedChallenges || 0) >= (value as number);
        case 'completedLessons': return (stats.completedLessons || 0) >= (value as number);
        case 'completedStories': return (stats.completedStories || 0) >= (value as number);
        case 'streak': return (stats.streak || 0) >= (value as number);
        case 'phishingPerfect': return stats.phishingPerfect === true;
        case 'logAnalysisSolved': return stats.logAnalysisSolved === true;
        case 'webSolved': return stats.webSolved === true;
        case 'cryptoSolved': return stats.cryptoSolved === true;
        case 'investigationSolved': return stats.investigationSolved === true;
        case 'ctfSolved': return stats.ctfSolved === true;
        case 'ctfSolvedCount': return (stats.ctfSolvedCount || 0) >= (value as number);
        case 'level': return newLevel >= (value as number);
        default: return false;
      }
    });
  });

  return {
    newTotalXp,
    level: newLevel,
    rank: newRank,
    leveledUp: newLevel > oldLevel,
    newBadges,
  };
}

// ---------- Streaks ----------

export function todayString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function yesterdaysString(date: Date = new Date()): string {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function updateStreak(
  currentStreak: number,
  lastActiveDate: string | undefined,
  today: string = todayString()
): { streak: number; date: string } {
  if (!lastActiveDate) {
    return { streak: 1, date: today };
  }
  if (lastActiveDate === today) {
    // Already active today - don't increment
    return { streak: currentStreak, date: today };
  }
  if (lastActiveDate === yesterdaysString(new Date(today + 'T00:00:00Z'))) {
    return { streak: currentStreak + 1, date: today };
  }
  // Streak broken
  return { streak: 1, date: today };
}

// ---------- Skills ----------

export const MAX_SKILL_LEVEL = 5;
export const XP_PER_SKILL_LEVEL = 200;

export function updateSkillProgress(
  skill: SkillProgress | undefined,
  xpEarned: number
): SkillProgress {
  const currentLevel = skill?.level ?? 0;
  const currentXp = skill?.xp ?? 0;
  const newXp = currentXp + xpEarned;
  const newLevel = Math.min(MAX_SKILL_LEVEL, Math.floor(newXp / XP_PER_SKILL_LEVEL));
  const progress = Math.min(100, Math.round((newXp / (XP_PER_SKILL_LEVEL * MAX_SKILL_LEVEL)) * 100));
  return {
    skillId: skill?.skillId || '',
    level: Math.max(currentLevel, newLevel),
    xp: newXp,
    progress,
    lastPracticed: new Date().toISOString(),
  };
}

export function skillLevelLabel(level: number): string {
  const labels = ['Not Started', 'Novice', 'Apprentice', 'Practitioner', 'Advanced', 'Master'];
  return labels[Math.min(level, 5)];
}

// ---------- Daily Goal ----------

export function isDailyGoalMet(weekMinutes: number[], goalMinutes: number): boolean {
  return weekMinutes[weekMinutes.length - 1] >= goalMinutes;
}

export function weeklyGoalProgress(minutes: number[], goalMinutes: number): number {
  const total = minutes.reduce((a, b) => a + b, 0);
  return Math.min(100, Math.round((total / goalMinutes) * 100));
}