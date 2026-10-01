/** Cookie set when Firebase client auth is active (middleware hint only; Firestore rules enforce data access). */
export const AUTH_SESSION_COOKIE = 'cw-session';

export const PROTECTED_PATH_PREFIXES = ['/profile', '/saved', '/onboarding', '/admin'] as const;
