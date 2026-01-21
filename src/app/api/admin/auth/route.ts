import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Server-side only password - NEVER expose to client
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'melodie2024';
const AUTH_COOKIE_NAME = 'mm_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Simple session token generator
function generateSessionToken(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${random}`;
}

// Verify session token format (basic validation)
function isValidSessionFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('_');
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
}

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Falsches Passwort' },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Create response with httpOnly cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000, // in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentifizierung fehlgeschlagen' },
      { status: 500 }
    );
  }
}

// DELETE - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}

// GET - Check auth status
export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!sessionCookie || !isValidSessionFormat(sessionCookie.value)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
