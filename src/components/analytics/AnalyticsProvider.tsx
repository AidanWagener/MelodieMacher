'use client';

import { useEffect, Suspense } from 'react';
import { GoogleAnalytics, updateGoogleAnalyticsConsent } from './GoogleAnalytics';
import { MetaPixel, updateMetaPixelConsent } from './MetaPixel';
import { setAnalyticsConsent, hasAnalyticsConsent } from '@/lib/analytics';
import { captureUTM } from '@/lib/utm';

/**
 * Analytics Provider Component
 *
 * Wraps analytics scripts with consent checking.
 * Captures UTM parameters on initial load.
 *
 * Usage in layout.tsx:
 * ```tsx
 * <AnalyticsProvider>
 *   {children}
 * </AnalyticsProvider>
 * ```
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Capture UTM params on mount
  useEffect(() => {
    captureUTM();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
      <MetaPixel />
      {children}
    </>
  );
}

/**
 * Grant analytics consent
 * Call this when user accepts cookies/tracking
 */
export function grantAnalyticsConsent(): void {
  setAnalyticsConsent(true);
  updateGoogleAnalyticsConsent(true);
  updateMetaPixelConsent(true);

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Consent granted');
  }
}

/**
 * Revoke analytics consent
 * Call this when user declines cookies/tracking
 */
export function revokeAnalyticsConsent(): void {
  setAnalyticsConsent(false);
  updateGoogleAnalyticsConsent(false);
  updateMetaPixelConsent(false);

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Consent revoked');
  }
}

/**
 * Check current consent status
 */
export function checkAnalyticsConsent(): boolean {
  return hasAnalyticsConsent();
}
