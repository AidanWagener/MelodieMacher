import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'mm_admin_session';

// Verify session token format
function isValidSessionFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('_');
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
}

// Check if request is authenticated
export function isAuthenticated(): boolean {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
    return !!(sessionCookie && isValidSessionFormat(sessionCookie.value));
  } catch {
    return false;
  }
}

// Return 401 response for unauthenticated requests
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Nicht autorisiert. Bitte anmelden.' },
    { status: 401 }
  );
}

// Wrapper to protect API routes
export function withAuth<T>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T | { error: string }>> {
  if (!isAuthenticated()) {
    return Promise.resolve(unauthorizedResponse() as NextResponse<{ error: string }>);
  }
  return handler();
}
