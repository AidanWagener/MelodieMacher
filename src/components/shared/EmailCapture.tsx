'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Gift, Sparkles, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailCaptureProps {
  /** Delay in seconds before showing popup */
  delaySeconds?: number;
  /** Callback when email is submitted */
  onSubmit?: (email: string) => Promise<void>;
  /** Show on specific pages only */
  enabledPaths?: string[];
}

const COOKIE_NAME = 'melodie_email_captured';
const LEAD_MAGNET_TITLE = '10 Song-Ideen fuer besondere Anlaesse';

export function EmailCapture({
  delaySeconds = 30,
  onSubmit,
  enabledPaths,
}: EmailCaptureProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if popup should be shown
  const shouldShowPopup = useCallback(() => {
    if (typeof window === 'undefined') return false;

    // Check cookie
    const cookies = document.cookie.split(';');
    const hasSeenPopup = cookies.some(
      (cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`)
    );
    if (hasSeenPopup) return false;

    // Check path if enabledPaths is specified
    if (enabledPaths && enabledPaths.length > 0) {
      const currentPath = window.location.pathname;
      const isEnabledPath = enabledPaths.some((path) =>
        currentPath.startsWith(path)
      );
      if (!isEnabledPath) return false;
    }

    return true;
  }, [enabledPaths]);

  // Set cookie to not show again
  const setDismissCookie = (durationDays: number = 30) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + durationDays);
    document.cookie = `${COOKIE_NAME}=true; expires=${expires.toUTCString()}; path=/`;
  };

  // Timer to show popup
  useEffect(() => {
    if (!shouldShowPopup()) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [delaySeconds, shouldShowPopup]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Bitte gib eine gueltige E-Mail-Adresse ein');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Default: just log and simulate API call
        console.log('Email captured:', email);
        // In production: await fetch('/api/email-capture', { method: 'POST', body: JSON.stringify({ email }) });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setIsSuccess(true);
      setDismissCookie(365); // Don't show again for a year

      // Auto-close after success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (err) {
      setError('Etwas ist schiefgelaufen. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setIsVisible(false);
    setDismissCookie(7); // Show again after 7 days if not subscribed
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-500 hover:text-gray-700 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <>
                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-8 text-center text-white">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4"
                  >
                    <Gift className="w-8 h-8" />
                  </motion.div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    Gratis fuer dich!
                  </h2>
                  <p className="text-primary-100 text-sm">
                    Sichere dir jetzt kostenlose Inspiration
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Lead Magnet Description */}
                  <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-gold-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary-900 mb-1">
                          {LEAD_MAGNET_TITLE}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Von romantischen Hochzeitssongs bis zu lustigen
                          Geburtstagsliedern - hole dir kreative Ideen fuer
                          unvergessliche Momente!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email-capture" className="sr-only">
                        E-Mail-Adresse
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="email-capture"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="deine@email.de"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                          disabled={isSubmitting}
                        />
                      </div>
                      {error && (
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5 mr-2" />
                          Gratis herunterladen
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Privacy note */}
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    Wir respektieren deine Privatsphaere. Kein Spam, versprochen!
                    <br />
                    Du kannst dich jederzeit abmelden.
                  </p>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6"
                >
                  <Check className="w-10 h-10 text-green-600" />
                </motion.div>

                <h2 className="text-2xl font-display font-bold text-primary-900 mb-2">
                  Perfekt!
                </h2>
                <p className="text-gray-600 mb-4">
                  Schau in dein E-Mail-Postfach - deine Song-Ideen sind unterwegs!
                </p>
                <p className="text-sm text-gray-500">
                  (Schau auch im Spam-Ordner nach, falls du nichts findest)
                </p>
              </div>
            )}

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-gold-200/50 to-transparent rounded-full" />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to trigger email capture programmatically
 */
export function useEmailCapture() {
  const [shouldShow, setShouldShow] = useState(false);

  const trigger = () => setShouldShow(true);
  const dismiss = () => setShouldShow(false);

  return { shouldShow, trigger, dismiss };
}

export default EmailCapture;
