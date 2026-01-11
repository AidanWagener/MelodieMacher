'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OneClickUpsell } from '@/components/upsell/OneClickUpsell';
import { Downsell } from '@/components/upsell/Downsell';
import {
  CheckCircle,
  Music,
  Clock,
  Mail,
  Gift,
  ChevronRight,
  Sparkles,
  FileText,
  Download,
  Share2,
} from 'lucide-react';
import { trackConversion, trackUpsellClick, hasAnalyticsConsent } from '@/lib/analytics';
import { trackGA4Purchase } from '@/components/analytics/GoogleAnalytics';
import { trackMetaPurchase } from '@/components/analytics/MetaPixel';
import { getUTM, appendUTMToUrl } from '@/lib/utm';
import { packageOptions } from '@/lib/order-schema';
import { ReferralWidget } from '@/components/referral/ReferralWidget';

type UpsellState = 'upsell' | 'downsell' | 'dismissed';

// Helper functions for tracking orders
function getTrackedOrders(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const tracked = sessionStorage.getItem('trackedOrders');
    return tracked ? JSON.parse(tracked) : [];
  } catch {
    return [];
  }
}

function markOrderAsTracked(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const tracked = getTrackedOrders();
    if (!tracked.includes(orderId)) {
      tracked.push(orderId);
      sessionStorage.setItem('trackedOrders', JSON.stringify(tracked));
    }
  } catch {
    // Ignore storage errors
  }
}

export function ThankYouContent() {
  const searchParams = useSearchParams();
  const [upsellState, setUpsellState] = useState<UpsellState>('upsell');
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutes
  const conversionTrackedRef = useRef(false);

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order');
  const packageType = searchParams.get('package') || 'plus';
  const recipientName = searchParams.get('recipient') || '';
  const orderValue = searchParams.get('value');

  // Track conversion on mount
  useEffect(() => {
    if (conversionTrackedRef.current) return;
    if (!orderId && !sessionId) return;

    // Check if already tracked in this session
    const trackedOrders = getTrackedOrders();
    if (orderId && trackedOrders.includes(orderId)) {
      console.log('[Conversion] Already tracked order:', orderId);
      conversionTrackedRef.current = true;
      return;
    }

    // Get package details
    const pkg = packageOptions.find((p) => p.value === packageType);
    const value = orderValue ? parseFloat(orderValue) : (pkg?.price || 79);
    const packageName = pkg?.label || 'Personalisierter Song';

    // Fire conversion events
    if (hasAnalyticsConsent()) {
      // Unified tracking
      trackConversion({
        transactionId: orderId || sessionId || 'unknown',
        value: value,
        currency: 'EUR',
        items: [{
          id: packageType,
          name: packageName,
          price: value,
          quantity: 1,
        }],
      });

      // GA4 Enhanced E-commerce
      trackGA4Purchase({
        transactionId: orderId || sessionId || 'unknown',
        value: value,
        currency: 'EUR',
        items: [{
          item_id: packageType,
          item_name: packageName,
          price: value,
          quantity: 1,
          item_category: 'personalized_song',
        }],
      });

      // Meta Pixel Purchase
      trackMetaPurchase({
        value: value,
        currency: 'EUR',
        contentIds: [packageType],
        contentName: packageName,
        numItems: 1,
        orderId: orderId || undefined,
      });

      // Log UTM attribution
      const utm = getUTM();
      if (utm) {
        console.log('[Conversion] Attribution:', utm);
      }

      console.log('[Conversion] Tracked purchase:', {
        orderId,
        value,
        packageType,
      });
    }

    // Mark as tracked
    if (orderId) {
      markOrderAsTracked(orderId);
    }
    conversionTrackedRef.current = true;
  }, [orderId, sessionId, packageType, orderValue]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle upsell click with tracking
  const handleUpsellClick = useCallback((upsellData: {
    upsellId: string;
    upsellName: string;
    originalPrice: number;
    discountedPrice: number;
  }) => {
    trackUpsellClick(upsellData);
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpsellDecline = () => {
    setUpsellState('downsell');
  };

  const handleDownsellDismiss = () => {
    setUpsellState('dismissed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container-wide py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-gold-400 flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-primary-900">
              MelodieMacher
            </span>
          </Link>
        </div>
      </header>

      <main className="container-narrow py-12 lg:py-16">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
            Vielen Dank fuer deine Bestellung!
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Wir haben deine Bestellung erhalten und beginnen sofort mit der
            Erstellung deines personalisierten Songs.
          </p>
          {orderId && (
            <p className="mt-4 text-sm text-gray-500">
              Bestellnummer: <span className="font-mono font-medium">{orderId}</span>
            </p>
          )}
        </motion.div>

        {/* Order Summary Card */}
        {orderId && (
          <Card className="p-6 lg:p-8 mb-8 bg-white border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary-900">
                Deine Bestellung
              </h2>
              <span className="text-sm text-gray-500 font-mono">{orderId}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {recipientName && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Song fuer:</span>
                  <span className="font-medium text-primary-900">{recipientName}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Paket:</span>
                <span className="font-medium text-primary-900">
                  {packageType === 'premium' ? 'Melodie Premium' :
                   packageType === 'basis' ? 'Melodie Basis' : 'Melodie Plus'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Bezahlt</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Lieferung:</span>
                <span className="font-medium text-primary-900">
                  {packageType === 'premium' ? 'Same-Day' :
                   packageType === 'basis' ? '48 Stunden' : '24 Stunden'}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* What Happens Next - Enhanced Timeline */}
        <Card className="p-6 lg:p-8 mb-8">
          <h2 className="text-xl font-semibold text-primary-900 mb-6">
            Was passiert jetzt?
          </h2>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary-400 via-gold-400 to-green-400" />

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4 relative">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center z-10 ring-4 ring-white">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-primary-900">
                      Bestaetigung per E-Mail
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Jetzt
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Du erhaeltst gleich eine E-Mail mit allen Details zu deiner
                    Bestellung und einer Zusammenfassung deiner Geschichte.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 relative">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-400 flex items-center justify-center z-10 ring-4 ring-white">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-primary-900">
                      Song wird komponiert
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 text-xs font-medium">
                      In Bearbeitung
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Unser Team liest deine Geschichte sorgfaeltig und komponiert
                    deinen einzigartigen, personalisierten Song mit Liebe zum Detail.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 relative">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center z-10 ring-4 ring-white">
                  <FileText className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-primary-900 mb-1">
                    Qualitaetspruefung
                  </h3>
                  <p className="text-sm text-gray-600">
                    Jeder Song durchlaeuft eine manuelle Qualitaetspruefung,
                    um sicherzustellen, dass er perfekt zu deiner Geschichte passt.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 relative">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center z-10 ring-4 ring-white">
                  <Download className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-primary-900">
                      Lieferung per E-Mail
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                      {packageType === 'premium' ? 'Heute' :
                       packageType === 'basis' ? 'In 48h' : 'In 24h'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Du erhaeltst eine E-Mail mit einem sicheren Download-Link
                    zu deinem fertigen Song. Bereit zum Teilen und Ueberraschen!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* One-Click Upsell Section */}
        {upsellState === 'upsell' && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <OneClickUpsell
              sessionId={sessionId}
              orderId={orderId}
              onDecline={handleUpsellDecline}
              countdown={countdown}
            />
          </motion.div>
        )}

        {/* Downsell Section */}
        {upsellState === 'downsell' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Downsell onDismiss={handleDownsellDismiss} />
          </motion.div>
        )}

        {/* Referral Widget - Show after upsell is dismissed or expired */}
        {(upsellState === 'dismissed' || countdown === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <ReferralWidget variant="full" />
          </motion.div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Zurueck zur Startseite
          </Link>
        </div>
      </main>
    </div>
  );
}
