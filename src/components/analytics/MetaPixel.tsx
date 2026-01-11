'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { hasAnalyticsConsent } from '@/lib/analytics';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Meta Pixel (Facebook) Integration Component
 *
 * Loads Meta Pixel scripts and provides tracking functionality.
 * Only fires events after GDPR consent has been given.
 *
 * Standard Events Supported:
 * - PageView: Automatic on every page load
 * - ViewContent: When viewing product/package details
 * - InitiateCheckout: When starting the order form
 * - Purchase: After successful payment
 */

export function MetaPixel() {
  const pathname = usePathname();

  // Track page views on route changes
  useEffect(() => {
    if (!META_PIXEL_ID || !hasAnalyticsConsent()) return;

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  if (!META_PIXEL_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[MetaPixel] NEXT_PUBLIC_META_PIXEL_ID not configured');
    }
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            // Check consent before initializing
            if (localStorage.getItem('analytics_consent') === 'true') {
              fbq('consent', 'grant');
            } else {
              fbq('consent', 'revoke');
            }

            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* NoScript fallback for users without JavaScript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/**
 * Update Meta Pixel consent status
 */
export function updateMetaPixelConsent(consent: boolean): void {
  if (typeof window === 'undefined' || !window.fbq) return;

  if (consent) {
    // @ts-expect-error - consent is a valid fbq command
    window.fbq('consent', 'grant');
  } else {
    // @ts-expect-error - consent is a valid fbq command
    window.fbq('consent', 'revoke');
  }
}

/**
 * Track ViewContent event
 * Use when user views a product/package details
 */
export function trackMetaViewContent(data: {
  contentId: string;
  contentName: string;
  contentCategory?: string;
  value?: number;
  currency?: string;
}): void {
  if (typeof window === 'undefined' || !window.fbq || !hasAnalyticsConsent()) return;

  window.fbq('track', 'ViewContent', {
    content_ids: [data.contentId],
    content_name: data.contentName,
    content_category: data.contentCategory,
    content_type: 'product',
    value: data.value,
    currency: data.currency || 'EUR',
  });
}

/**
 * Track InitiateCheckout event
 * Use when user starts the order/checkout process
 */
export function trackMetaInitiateCheckout(data: {
  value?: number;
  currency?: string;
  contentIds?: string[];
  numItems?: number;
}): void {
  if (typeof window === 'undefined' || !window.fbq || !hasAnalyticsConsent()) return;

  window.fbq('track', 'InitiateCheckout', {
    value: data.value,
    currency: data.currency || 'EUR',
    content_ids: data.contentIds,
    num_items: data.numItems || 1,
    content_type: 'product',
  });
}

/**
 * Track AddToCart event
 * Use when user adds bump/addon to order
 */
export function trackMetaAddToCart(data: {
  contentId: string;
  contentName: string;
  value: number;
  currency?: string;
}): void {
  if (typeof window === 'undefined' || !window.fbq || !hasAnalyticsConsent()) return;

  window.fbq('track', 'AddToCart', {
    content_ids: [data.contentId],
    content_name: data.contentName,
    content_type: 'product',
    value: data.value,
    currency: data.currency || 'EUR',
  });
}

/**
 * Track Purchase event
 * Use after successful payment completion
 */
export function trackMetaPurchase(data: {
  value: number;
  currency?: string;
  contentIds?: string[];
  contentName?: string;
  numItems?: number;
  orderId?: string;
}): void {
  if (typeof window === 'undefined' || !window.fbq || !hasAnalyticsConsent()) return;

  window.fbq('track', 'Purchase', {
    value: data.value,
    currency: data.currency || 'EUR',
    content_ids: data.contentIds,
    content_name: data.contentName,
    content_type: 'product',
    num_items: data.numItems || 1,
    order_id: data.orderId,
  });
}

/**
 * Track Lead event
 * Use when user submits contact info
 */
export function trackMetaLead(data?: {
  value?: number;
  currency?: string;
  contentName?: string;
}): void {
  if (typeof window === 'undefined' || !window.fbq || !hasAnalyticsConsent()) return;

  window.fbq('track', 'Lead', {
    value: data?.value,
    currency: data?.currency || 'EUR',
    content_name: data?.contentName,
  });
}

/**
 * Track Custom event
 * Use for custom tracking needs
 */
export function trackMetaCustomEvent(
  eventName: string,
  data?: Record<string, unknown>
): void {
  if (typeof window === 'undefined' || !window.fbq || !hasAnalyticsConsent()) return;

  window.fbq('trackCustom', eventName, data);
}
