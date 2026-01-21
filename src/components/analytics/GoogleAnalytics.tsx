'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 4 Script Component
 *
 * Loads GA4 scripts and handles automatic page view tracking.
 */

function GoogleAnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

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
 * Track E-commerce Purchase
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
  if (typeof window === 'undefined' || !window.gtag) return;

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
  if (typeof window === 'undefined' || !window.gtag) return;

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
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'add_payment_info', {
    value: data.value,
    currency: data.currency || 'EUR',
    payment_type: data.paymentType,
  });
}

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
