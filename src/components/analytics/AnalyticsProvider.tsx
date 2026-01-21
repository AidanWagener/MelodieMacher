'use client';

import { useEffect, Suspense } from 'react';
import { GoogleAnalytics } from './GoogleAnalytics';
import { MetaPixel } from './MetaPixel';
import { ConsentProvider } from './ConsentProvider';
import { CookieBanner } from './CookieBanner';
import { captureUTM } from '@/lib/utm';

/**
 * Analytics Provider Component
 *
 * Wraps all analytics scripts with consent management.
 * Includes:
 * - ConsentProvider for GDPR-compliant consent management
 * - MetaPixel for Facebook/Meta tracking
 * - GoogleAnalytics for GA4 tracking
 * - CookieBanner for user consent UI
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    captureUTM();
  }, []);

  return (
    <ConsentProvider>
      <Suspense fallback={null}>
        <GoogleAnalytics />
      </Suspense>
      <MetaPixel />
      {children}
      <CookieBanner />
    </ConsentProvider>
  );
}
