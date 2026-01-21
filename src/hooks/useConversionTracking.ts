'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackConversion, trackUpsellClick } from '@/lib/analytics';
import { trackGA4Purchase } from '@/components/analytics/GoogleAnalytics';
import { getUTM } from '@/lib/utm';

interface ConversionData {
  orderId: string | null;
  sessionId: string | null;
  value: number;
  currency?: string;
  packageType?: string;
  packageName?: string;
  bumps?: string[];
}

interface UseConversionTrackingOptions {
  onConversionTracked?: (data: ConversionData) => void;
}

/**
 * Hook for tracking conversions on the thank you page
 *
 * Fires purchase events to GA4 once per order.
 * Uses sessionStorage to prevent duplicate conversion tracking.
 */
export function useConversionTracking(options?: UseConversionTrackingOptions) {
  const searchParams = useSearchParams();
  const hasTrackedRef = useRef(false);

  const orderId = searchParams?.get('order') || null;
  const sessionId = searchParams?.get('session_id') || null;

  const trackPurchase = useCallback((data: ConversionData) => {
    const trackedOrders = getTrackedOrders();
    if (data.orderId && trackedOrders.includes(data.orderId)) {
      console.log('[Conversion] Already tracked order:', data.orderId);
      return;
    }

    trackConversion({
      transactionId: data.orderId || data.sessionId || 'unknown',
      value: data.value,
      currency: data.currency || 'EUR',
      items: [
        {
          id: data.packageType || 'song_package',
          name: data.packageName || 'Personalisierter Song',
          price: data.value,
          quantity: 1,
        },
      ],
    });

    const items = [
      {
        item_id: data.packageType || 'song_package',
        item_name: data.packageName || 'Personalisierter Song',
        price: data.value,
        quantity: 1,
        item_category: 'personalized_song',
      },
    ];

    if (data.bumps && data.bumps.length > 0) {
      data.bumps.forEach((bump) => {
        items.push({
          item_id: bump,
          item_name: getBumpName(bump),
          price: getBumpPrice(bump),
          quantity: 1,
          item_category: 'addon',
        });
      });
    }

    trackGA4Purchase({
      transactionId: data.orderId || data.sessionId || 'unknown',
      value: data.value,
      currency: data.currency || 'EUR',
      items,
    });

    if (data.orderId) {
      markOrderAsTracked(data.orderId);
    }

    const utm = getUTM();
    if (utm) {
      console.log('[Conversion] Attribution:', utm);
    }

    options?.onConversionTracked?.(data);

    console.log('[Conversion] Tracked purchase:', {
      orderId: data.orderId,
      value: data.value,
      items,
    });
  }, [options]);

  useEffect(() => {
    if (hasTrackedRef.current) return;
    if (!orderId && !sessionId) return;

    const valueParam = searchParams?.get('value');
    const packageParam = searchParams?.get('package');

    const conversionData: ConversionData = {
      orderId,
      sessionId,
      value: valueParam ? parseFloat(valueParam) : 79,
      packageType: packageParam || 'plus',
      packageName: getPackageName(packageParam || 'plus'),
    };

    hasTrackedRef.current = true;
    trackPurchase(conversionData);
  }, [orderId, sessionId, searchParams, trackPurchase]);

  const trackUpsell = useCallback((upsellData: {
    upsellId: string;
    upsellName: string;
    originalPrice: number;
    discountedPrice: number;
  }) => {
    trackUpsellClick(upsellData);
  }, []);

  return {
    orderId,
    sessionId,
    trackPurchase,
    trackUpsell,
    hasTracked: hasTrackedRef.current,
  };
}

function getTrackedOrders(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = sessionStorage.getItem('tracked_orders');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function markOrderAsTracked(orderId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const tracked = getTrackedOrders();
    tracked.push(orderId);
    sessionStorage.setItem('tracked_orders', JSON.stringify(tracked));
  } catch (e) {
    console.warn('[Conversion] Failed to mark order as tracked:', e);
  }
}

function getPackageName(packageType: string): string {
  const names: Record<string, string> = {
    basis: 'Basis Paket',
    plus: 'Plus Paket',
    premium: 'Premium Paket',
  };
  return names[packageType] || 'Personalisierter Song';
}

function getBumpName(bump: string): string {
  const names: Record<string, string> = {
    bumpKaraoke: 'Karaoke Version',
    bumpRush: 'Express Lieferung (24h)',
    bumpGift: 'Geschenkverpackung',
  };
  return names[bump] || bump;
}

function getBumpPrice(bump: string): number {
  const prices: Record<string, number> = {
    bumpKaraoke: 19,
    bumpRush: 29,
    bumpGift: 9,
  };
  return prices[bump] || 0;
}

/**
 * Simple hook for manual conversion tracking
 */
export function useManualConversionTracking() {
  const trackPurchaseEvent = useCallback((data: {
    transactionId: string;
    value: number;
    currency?: string;
    items?: Array<{
      id: string;
      name: string;
      price: number;
      quantity?: number;
    }>;
  }) => {
    trackConversion({
      transactionId: data.transactionId,
      value: data.value,
      currency: data.currency || 'EUR',
      items: data.items || [{
        id: 'song_package',
        name: 'Personalisierter Song',
        price: data.value,
        quantity: 1,
      }],
    });

    return true;
  }, []);

  return { trackPurchaseEvent };
}
