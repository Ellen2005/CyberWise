'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { AUTH_SESSION_COOKIE } from '@/lib/auth/constants';

function setSessionCookie(active: boolean) {
  const maxAge = active ? 60 * 60 * 24 * 14 : 0;
  const value = active ? '1' : '';
  document.cookie = `${AUTH_SESSION_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function AuthSessionSync() {
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    setSessionCookie(!!user);
  }, [user, loading]);

  return null;
}
