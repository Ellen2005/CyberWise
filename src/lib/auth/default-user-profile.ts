import type { UserSettings } from '@/types';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  emailNotifications: true,
  dailyChallengeReminder: true,
  streakReminder: true,
  achievementNotifications: true,
  recommendationNotifications: true,
  newContentNotifications: false,
  reducedMotion: false,
  reduceAnimations: false,
  fontSize: 'default',
  highContrast: false,
  weeklyGoal: 60,
  aiMentorTone: 'encouraging',
};

/** Fields allowed on Firestore user create (see firestore.rules). */
export function buildNewUserProfile(input: {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}) {
  return {
    displayName: input.displayName || 'Learner',
    email: input.email || '',
    photoURL: input.photoURL || null,
    role: 'user' as const,
    xp: 0,
    level: 1,
    rank: 'novice',
    streak: 0,
    badges: [] as string[],
    onboardingCompleted: false,
    profileVisibility: 'private' as const,
    settings: DEFAULT_USER_SETTINGS,
  };
}
