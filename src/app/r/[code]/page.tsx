'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, Music, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  validateReferralCode,
  storeReferralCodeInSession,
  REFERRAL_CONFIG,
} from '@/lib/referral';

export default function ReferralLandingPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    async function validateAndStore() {
      if (!code) {
        setError('Kein Empfehlungscode angegeben');
        setIsValidating(false);
        return;
      }

      try {
        const validation = await validateReferralCode(code);

        if (validation.isValid) {
          // Store the referral code for checkout
          storeReferralCodeInSession(code);
          setIsValid(true);
        } else {
          setError(validation.error || 'Ungueltiger Code');
        }
      } catch (err) {
        setError('Fehler bei der Validierung');
      } finally {
        setIsValidating(false);
        setTimeout(() => setShowContent(true), 100);
      }
    }

    validateAndStore();
  }, [code]);

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gold-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Gift className="w-8 h-8 text-gold-600" />
          </div>
          <p className="text-gray-600">Pruefe deinen Geschenkcode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gold-50 to-white">
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

      <main className="container-narrow py-12 lg:py-20">
        {isValid ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Success Gift Card */}
            <Card className="p-8 lg:p-12 mb-8 overflow-hidden relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-200/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                {/* Gift Icon with animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 mb-6 shadow-lg"
                >
                  <Gift className="w-12 h-12 text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className="text-3xl lg:text-4xl font-display font-bold text-primary-900 mb-4">
                    Dein Freund schenkt dir
                  </h1>

                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-gold-400 to-gold-500 text-white px-8 py-4 rounded-2xl mb-6 shadow-lg">
                    <span className="text-4xl lg:text-5xl font-bold">
                      {REFERRAL_CONFIG.DISCOUNT_AMOUNT / 100} Euro
                    </span>
                    <span className="text-xl ml-2">Rabatt!</span>
                  </div>

                  <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                    Jemand, der dir etwas Gutes tun moechte, hat dir einen Gutschein fuer
                    einen personalisierten Song geschickt.
                  </p>

                  {/* Code Display */}
                  <div className="bg-gray-50 border-2 border-dashed border-gold-300 rounded-xl p-4 mb-8 max-w-xs mx-auto">
                    <p className="text-sm text-gray-500 mb-1">Dein Gutscheincode</p>
                    <p className="font-mono text-xl font-bold text-primary-900">
                      {code.toUpperCase()}
                    </p>
                    <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
                      <Check className="w-3 h-3" />
                      Automatisch aktiviert
                    </p>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                  >
                    <Link href="/bestellen">
                      Jetzt Song erstellen
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Rabatt wird automatisch im Warenkorb abgezogen
                  </p>
                </motion.div>
              </div>
            </Card>

            {/* What is MelodieMacher */}
            <Card className="p-6 lg:p-8 text-left">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-primary-900 mb-2">
                    Was ist MelodieMacher?
                  </h2>
                  <p className="text-gray-600">
                    Wir verwandeln deine Geschichten in einzigartige, personalisierte Songs.
                    Das perfekte Geschenk fuer Hochzeiten, Geburtstage, Jahrestage und mehr!
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-900">48h</p>
                  <p className="text-sm text-gray-600">Express-Lieferung</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-900">1000+</p>
                  <p className="text-sm text-gray-600">Zufriedene Kunden</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary-900">100%</p>
                  <p className="text-sm text-gray-600">Einzigartig</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Error State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="p-8 lg:p-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                <Gift className="w-10 h-10 text-red-500" />
              </div>

              <h1 className="text-2xl lg:text-3xl font-display font-bold text-primary-900 mb-4">
                Oops! Code nicht gueltig
              </h1>

              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {error || 'Der Empfehlungscode konnte nicht verifiziert werden.'}
                <br />
                Aber keine Sorge - du kannst trotzdem einen tollen Song erstellen!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/">Zur Startseite</Link>
                </Button>
                <Button asChild>
                  <Link href="/bestellen">
                    Trotzdem Song erstellen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-auto">
        <div className="container-wide py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p> {new Date().getFullYear()} MelodieMacher</p>
            <div className="flex items-center gap-4">
              <Link href="/impressum" className="hover:text-primary-600 transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-primary-600 transition-colors">
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
