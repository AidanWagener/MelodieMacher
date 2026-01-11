'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Gift,
  CheckCircle,
  Loader2,
  Mail,
  Tag,
  Copy,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownsellProps {
  onDismiss: () => void;
}

export function Downsell({ onDismiss }: DownsellProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discountCode = 'SPAETER25';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Bitte gib eine gueltige E-Mail-Adresse ein.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'downsell',
          discountCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Anmeldung fehlgeschlagen');
      }

      setIsSubmitted(true);
    } catch (err) {
      // Even if the API fails, show success (the code still works)
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(discountCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = discountCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 lg:p-8 bg-gradient-to-br from-primary-50 to-white border-primary-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <Gift className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-primary-900 mb-3">
              Dein Rabattcode ist bereit!
            </h2>

            {/* Discount Code Display */}
            <div className="mb-6">
              <div
                onClick={copyToClipboard}
                className={cn(
                  'inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-gold-100 to-gold-50',
                  'border-2 border-dashed border-gold-400 cursor-pointer transition-all',
                  'hover:shadow-md hover:scale-[1.02]'
                )}
              >
                <Tag className="w-5 h-5 text-gold-600" />
                <span className="text-2xl font-mono font-bold text-primary-900 tracking-wider">
                  {discountCode}
                </span>
                <button
                  type="button"
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isCopied ? 'bg-green-100 text-green-600' : 'bg-white/50 text-gray-500 hover:text-primary-600'
                  )}
                >
                  {isCopied ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {isCopied ? 'Kopiert!' : 'Klicken zum Kopieren'}
              </p>
            </div>

            <div className="space-y-2 text-gray-600 mb-6">
              <p>
                <strong className="text-primary-900">25% Rabatt</strong> auf deine naechste Bestellung
              </p>
              <p className="text-sm">
                Gueltig 30 Tage. Wir haben dir den Code auch per E-Mail geschickt.
              </p>
            </div>

            <Button
              onClick={onDismiss}
              variant="outline"
              className="gap-2"
            >
              <Heart className="w-4 h-4" />
              Danke, weiter zur Bestelluebersicht
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white border-gray-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 mb-4">
            <Gift className="w-7 h-7 text-primary-600" />
          </div>

          <h2 className="text-xl font-display font-bold text-primary-900 mb-2">
            Kein Problem! Hier ist 25% Rabatt fuer spaeter
          </h2>
          <p className="text-gray-600 mb-6">
            Wir verstehen - jetzt ist vielleicht nicht der richtige Moment.
            Aber falls du spaeter noch jemanden mit einem Song ueberraschen moechtest,
            schenken wir dir <strong className="text-primary-900">25% Rabatt</strong>.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    'text-center sm:text-left',
                    error && 'border-red-500'
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Rabattcode senden
                  </>
                )}
              </Button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </form>

          <button
            onClick={onDismiss}
            className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Nein danke, weiter ohne Rabatt
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
