'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Gift,
  CheckCircle,
  Loader2,
  Music,
  Sparkles,
  Clock,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OneClickUpsellProps {
  sessionId: string | null;
  orderId: string | null;
  onDecline: () => void;
  countdown: number;
}

export function OneClickUpsell({
  sessionId,
  orderId,
  onDecline,
  countdown,
}: OneClickUpsellProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOneClickPurchase = async () => {
    if (!sessionId) {
      setError('Sitzung nicht gefunden. Bitte kontaktieren Sie den Support.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/upsell/one-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          orderId,
          upsellType: 'second-song',
          amount: 3900, // 39 EUR in cents
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Zahlung fehlgeschlagen');
      }

      setIsPurchased(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPurchased) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="p-6 lg:p-8 bg-gradient-to-br from-green-50 to-white border-green-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-primary-900 mb-2">
              Perfekt! Dein zweiter Song wurde hinzugefuegt!
            </h2>
            <p className="text-gray-600 mb-4">
              Du erhaeltst eine separate Bestaetigung per E-Mail. Wir beginnen sofort
              mit der Erstellung beider Songs.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Zahlung erfolgreich - 39 Euro
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="p-6 lg:p-8 bg-gradient-to-br from-gold-50 to-white border-gold-200 relative overflow-hidden">
      {/* Close button */}
      <button
        onClick={onDecline}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm z-10"
      >
        Nein danke
      </button>

      {/* Badge */}
      <div className="flex items-center gap-2 text-gold-600 mb-4">
        <Gift className="w-5 h-5" />
        <span className="text-sm font-medium">
          Exklusives Angebot - nur jetzt!
        </span>
      </div>

      <h2 className="text-2xl font-display font-bold text-primary-900 mb-2">
        Noch einen Song fuer einen besonderen Menschen?
      </h2>
      <p className="text-gray-600 mb-6">
        Als Dankeschoen fuer deine Bestellung bekommst du jetzt{' '}
        <strong className="text-primary-900">50% Rabatt</strong> auf
        einen weiteren Song!
      </p>

      {/* Features */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="w-4 h-4 text-gold-500" />
          Melodie Plus Paket
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Music className="w-4 h-4 text-gold-500" />
          Gleiche hohe Qualitaet
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gold-500" />
          Lieferung in 24h
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-gold-500" />
          Zufriedenheitsgarantie
        </div>
      </div>

      {/* Price and Timer */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary-900">39 Euro</span>
          <span className="text-lg text-gray-400 line-through">79 Euro</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-medium animate-pulse">
          Angebot endet in {formatCountdown(countdown)}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* One-Click Button */}
      <Button
        onClick={handleOneClickPurchase}
        disabled={isProcessing || countdown === 0}
        size="lg"
        variant="secondary"
        className={cn(
          'w-full text-lg py-6 font-semibold transition-all',
          isProcessing && 'opacity-75'
        )}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Wird bearbeitet...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Ja, Song hinzufuegen! (39 Euro)
          </>
        )}
      </Button>

      {/* Security Note */}
      <p className="mt-4 text-center text-xs text-gray-500">
        <Shield className="w-3 h-3 inline mr-1" />
        Sichere Zahlung mit deiner gespeicherten Zahlungsmethode
      </p>
    </Card>
  );
}
