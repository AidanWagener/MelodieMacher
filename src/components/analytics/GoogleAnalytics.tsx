'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { hasAnalyticsConsent } from '@/lib/analytics';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 4 Script Component
 *
 * Loads GA4 scripts and handles automatic page view tracking.
 * Only fires events after GDPR consent has been given.
 */

function GoogleAnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !hasAnalyticsConsent()) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Track page view on route change
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[GoogleAnalytics] NEXT_PUBLIC_GA_MEASUREMENT_ID not configured');
    }
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Configure with consent mode defaults (required for GDPR)
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
            });

            // Check if consent already given
            if (localStorage.getItem('analytics_consent') === 'true') {
              gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
              });
            }

            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GoogleAnalyticsPageTracker />
      </Suspense>
    </>
  );
}

/**
 * Update GA4 consent status
 * Call this when user grants consent
 */
export function updateGoogleAnalyticsConsent(consent: boolean): void {
  if (typeof window === 'undefined' || !window.gtag) return;

  // @ts-expect-error - consent is a valid gtag command
  window.gtag('consent', 'update', {
    analytics_storage: consent ? 'granted' : 'denied',
    ad_storage: consent ? 'granted' : 'denied',
    ad_user_data: consent ? 'granted' : 'denied',
    ad_personalization: consent ? 'granted' : 'denied',
  });
}

/**
 * Track E-commerce Purchase
 * Enhanced e-commerce tracking for GA4
 */
export function trackGA4Purchase(data: {
  transactionId: string;
  value: number;
  currency?: string;
  coupon?: string;
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity?: number;
    item_category?: string;
    item_variant?: string;
  }>;
}): void {
  if (typeof window === 'undefined' || !window.gtag || !hasAnalyticsConsent()) return;

  window.gtag('event', 'purchase', {
    transaction_id: data.transactionId,
    value: data.value,
    currency: data.currency || 'EUR',
    coupon: data.coupon,
    items: data.items.map((item, index) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      price: item.price,
      quantity: item.quantity || 1,
      item_category: item.item_category,
      item_variant: item.item_variant,
      index,
    })),
  });
}

/**
 * Track Begin Checkout
 */
export function trackGA4BeginCheckout(data: {
  value: number;
  currency?: string;
  items: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity?: number;
  }>;
}): void {
  if (typeof window === 'undefined' || !window.gtag || !hasAnalyticsConsent()) return;

  window.gtag('event', 'begin_checkout', {
    value: data.value,
    currency: data.currency || 'EUR',
    items: data.items.map((item, index) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      price: item.price,
      quantity: item.quantity || 1,
      index,
    })),
  });
}

/**
 * Track Add Payment Info
 */
export function trackGA4AddPaymentInfo(data: {
  value: number;
  currency?: string;
  paymentType?: string;
}): void {
  if (typeof window === 'undefined' || !window.gtag || !hasAnalyticsConsent()) return;

  window.gtag('event', 'add_payment_info', {
    value: data.value,
    currency: data.currency || 'EUR',
    payment_type: data.paymentType,
  });
}
