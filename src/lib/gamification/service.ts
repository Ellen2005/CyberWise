// ============================================
// CyberWise Gamification Service
// Connects user actions to XP, levels, streaks, badges.
// Uses the existing firebase client SDK + Firestore rules
// (rules whitelist the gamification fields users may update).
// The pure logic lives in ./engine.ts (unit-testable).
// ============================================

import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp, collection, getDoc, runTransaction } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import {
  applyXp,
  updateStreak,
  todayString,
  rankFromXp,
  levelFromXp,
  updateSkillProgress,
} from './engine';
import type { XpResult } from './engine';
import type { SkillProgress } from '@/types';

export interface AwardResult {
  xpEarned: number;
  leveledUp: boolean;
  newLevel: number;
  rankName: string;
  streak: number;
  newBadges: string[];
  /** True when this content was already completed: attempt recorded, no XP re-awarded. */
  alreadyCompleted: boolean;
}

/**
 * Award XP to a user, update streak, level, rank, and unlock badges.
 * The single entry point for all XP-awarding actions (client-side,
 * gated by Firestore rules which whitelist updatable fields).
 */
export async function awardXp(
  firestore: Firestore,
  userId: string,
  xpAmount: number,
  options: {
    skillIds?: string[];
    reason?: string;
    stats?: {
      completedChallenges?: number;
      completedLessons?: number;
      completedStories?: number;
      logAnalysisSolved?: boolean;
      webSolved?: boolean;
      cryptoSolved?: boolean;
      investigationSolved?: boolean;
      ctfSolved?: boolean;
      ctfSolvedCount?: number;
      phishingPerfect?: boolean;
    };
  } = {}
): Promise<AwardResult> {
  const userRef = doc(firestore, 'users', userId);
  const today = todayString();

  try {
    const result = await runTransaction(firestore, async (tx: any) => {
      const snapshot = await tx.get(userRef);
      const user: any = snapshot.exists() ? snapshot.data() : {};

      const currentXp = user.xp || 0;
      const currentBadges: string[] = user.badges || [];

      // Update streak
      const streak = updateStreak(user.streak || 0, user.lastActiveDate, today);

      // Compute XP / level / badges
      const xpResult: XpResult = applyXp(currentXp, xpAmount, currentBadges, {
        ...(options.stats || {}),
        streak: streak.streak,
      });

      // Apply skill progress
      const skills: Record<string, SkillProgress> = { ...(user.skills || {}) };
      if (options.skillIds) {
        for (const skillId of options.skillIds) {
          skills[skillId] = updateSkillProgress(skills[skillId], xpAmount);
        }
      }

      const allBadges = [...new Set([...currentBadges, ...xpResult.newBadges.map((b: any) => b.id)])];

      tx.set(
        userRef,
        {
          xp: xpResult.newTotalXp,
          level: xpResult.level,
          rank: xpResult.rank.id,
          rankName: xpResult.rank.name,
          streak: streak.streak,
          lastActiveDate: today,
          badges: allBadges,
          skills,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Record new badges as achievements
      for (const badge of xpResult.newBadges) {
        const achievementRef = doc(firestore, 'users', userId, 'achievements', badge.id);
        tx.set(achievementRef, {
          badgeId: badge.id,
          name: badge.name,
          icon: badge.icon,
          description: badge.description,
          xpBonus: badge.xpBonus,
          unlockedAt: serverTimestamp(),
        });
      }

      return { xpResult, streak, xpEarned: xpAmount };
    });

    return {
      xpEarned: result.xpEarned,
      leveledUp: result.xpResult.leveledUp,
      newLevel: result.xpResult.level,
      rankName: result.xpResult.rank.name,
      streak: result.streak.streak,
      newBadges: result.xpResult.newBadges.map((b) => b.id),
      alreadyCompleted: false,
    };
  } catch (error) {
    console.error('awardXp failed:', error);
    throw error;
  }
}

/**
 * Record a challenge/lesson/story completion on the user's profile.
 */
export async function recordCompletion(
  firestore: Firestore,
  userId: string,
  options: {
    contentType: 'challenge' | 'lesson' | 'story' | 'lab' | 'quiz';
    contentId: string;
    xpAmount?: number;
    skillIds?: string[];
    correct?: boolean;
    hintsUsed?: number;
    timeSpentSeconds?: number;
  }
): Promise<AwardResult> {
  const userRef = doc(firestore, 'users', userId);

  const completedFieldMap: Record<string, string> = {
    challenge: 'completedChallengeIds',
    lesson: 'completedLessonIds',
    story: 'completedStoryIds',
    lab: 'completedLabIds',
    quiz: 'completedLessonIds',
  } as const;

  const field = completedFieldMap[options.contentType];

  // Idempotency: replays record the attempt but must not re-award XP.
  const preSnap = await getDoc(userRef).catch(() => null);
  const alreadyCompleted =
    !!preSnap?.exists() && (((preSnap.data() as any)[field] as string[]) || []).includes(options.contentId);

  try {
    await runTransaction(firestore, async (tx: any) => {
      const snapshot = await tx.get(userRef);
      const user: any = snapshot.exists() ? snapshot.data() : {};

      const completed: string[] = user[field] || [];
      if (!completed.includes(options.contentId)) {
        tx.update(userRef, {
          [field]: arrayUnion(options.contentId),
          updatedAt: serverTimestamp(),
        });
      }

      // Record attempt
      const attemptsCol = collection(firestore, 'users', userId, 'attempts');
      const attemptRef = doc(attemptsCol);
      tx.set(attemptRef, {
        userId,
        contentType: options.contentType,
        contentId: options.contentId,
        status: options.correct === false ? 'failed' : 'completed',
        correct: options.correct ?? true,
        hintsUsed: options.hintsUsed || 0,
        timeSpentSeconds: options.timeSpentSeconds || 0,
        xpEarned: alreadyCompleted ? 0 : options.xpAmount || 0,
        submittedAt: serverTimestamp(),
      });
    });

    if (options.xpAmount && !alreadyCompleted) {
      const awarded = await awardXp(firestore, userId, options.xpAmount, {
        skillIds: options.skillIds,
        reason: `${options.contentType}-completed:${options.contentId}`,
      });
      return { ...awarded, alreadyCompleted: false };
    }

    // No XP — just return current state
    const userSnap = await getDoc(userRef);
    const data = userSnap.data() || {};
    return {
      xpEarned: 0,
      leveledUp: false,
      newLevel: data.level || 1,
      rankName: data.rankName || rankFromXp(data.xp || 0).name,
      streak: data.streak || 0,
      newBadges: [],
      alreadyCompleted,
    };
  } catch (error) {
    console.error('recordCompletion failed:', error);
    throw error;
  }
}

/**
 * Toast copy for a completion result. Replays say so explicitly instead of
 * flashing "+0 XP", which reads as a bug.
 */
export function completionToast(
  r: AwardResult,
  okTitle: string,
  okDesc: string
): { title: string; description: string } {
  if (r.alreadyCompleted) {
    return { title: 'Already recorded', description: 'Review complete — XP was earned on your first pass.' };
  }
  return { title: okTitle, description: okDesc };
}

/**
 * Get a user's gamification state for display.
 */
export async function getUserGamificationState(firestore: Firestore, userId: string) {
  const userRef = doc(firestore, 'users', userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;

  const data = snap.data();
  const xp = data.xp || 0;

  return {
    xp,
    level: data.level || levelFromXp(xp),
    rankName: data.rankName || rankFromXp(xp).name,
    rankIcon: data.rankIcon || rankFromXp(xp).icon,
    streak: data.streak || 0,
    badges: data.badges || [],
    skills: data.skills || {},
    totalXp: data.totalXp || xp,
  };
}