import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_SESSION_COOKIE, PROTECTED_PATH_PREFIXES } from '@/lib/auth/constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!needsAuth) {
    return NextResponse.next();
  }

  const session = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  if (session !== '1') {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/saved/:path*', '/onboarding/:path*', '/admin/:path*'],
};
