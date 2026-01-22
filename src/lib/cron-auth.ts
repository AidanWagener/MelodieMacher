import { NextRequest, NextResponse } from 'next/server';

/**
 * Verify cron request authentication
 * Supports multiple methods:
 * 1. x-cron-secret header (manual/external cron)
 * 2. Authorization: Bearer <secret> (Vercel cron)
 * 3. Vercel internal cron (checks VERCEL environment)
 */
export function verifyCronAuth(request: NextRequest): { authorized: boolean; error?: NextResponse } {
  const expectedSecret = process.env.CRON_SECRET;

  // Security: FAIL CLOSED - if no secret configured, reject all
  if (!expectedSecret) {
    console.error('CRON_SECRET not configured - rejecting cron request');
    return {
      authorized: false,
      error: NextResponse.json({ error: 'Cron not configured' }, { status: 503 })
    };
  }

  // Method 1: x-cron-secret header
  const cronSecretHeader = request.headers.get('x-cron-secret');
  if (cronSecretHeader === expectedSecret) {
    return { authorized: true };
  }

  // Method 2: Authorization Bearer token
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ') && authHeader.slice(7) === expectedSecret) {
    return { authorized: true };
  }

  // Method 3: Vercel Cron (on Pro/Enterprise, Vercel validates automatically)
  // The x-vercel-cron-signature header is present for Vercel cron jobs
  // For Pro plans, we can trust Vercel's validation
  if (process.env.VERCEL && request.headers.get('x-vercel-cron-signature')) {
    return { authorized: true };
  }

  return {
    authorized: false,
    error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  };
}
