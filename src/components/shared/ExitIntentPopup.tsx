'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const COOKIE_NAME = 'melodie_exit_popup_dismissed';
const COOKIE_DURATION_DAYS = 7;

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Check if popup was already dismissed (cookie)
  const checkCookie = useCallback(() => {
    if (typeof document === 'undefined') return false;
    return document.cookie.includes(COOKIE_NAME);
  }, []);

  // Set dismissal cookie
  const setCookie = useCallback(() => {
    const date = new Date();
    date.setTime(date.getTime() + COOKIE_DURATION_DAYS * 24 * 60 * 60 * 1000);
    document.cookie = `${COOKIE_NAME}=true; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  }, []);

  // Handle exit intent on desktop (mouse leaving viewport)
  useEffect(() => {
    if (checkCookie()) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (hasTriggered) return;

      // Only trigger when mouse leaves from the top of the viewport
      if (e.clientY <= 0) {
        setIsOpen(true);
        setHasTriggered(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [checkCookie, hasTriggered]);

  // Handle back button on mobile
  useEffect(() => {
    if (checkCookie() || hasTriggered) return;

    const handlePopState = () => {
      if (!hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        // Push state back to prevent actual navigation
        window.history.pushState(null, '', window.location.href);
      }
    };

    // Push initial state
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [checkCookie, hasTriggered]);

  const handleClose = () => {
    setIsOpen(false);
    setCookie();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Here you would typically send the email to your backend
      console.log('Email captured:', email);
      setIsSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('MELODIE10');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[61] max-w-md w-full mx-auto flex items-center justify-center"
          >
            <div className="relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Schliessen"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Decorative gradient header */}
              <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 p-6 pb-12">
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Gift className="w-8 h-8 text-gold-400" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 -mt-6 bg-white rounded-t-3xl relative">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-display font-bold text-primary-900 mb-2">
                        Warte! Hier ist dein Geschenk
                      </h3>
                      <p className="text-gray-600">
                        Sichere dir jetzt <span className="font-bold text-gold-600">10% Rabatt</span> auf deinen ersten Song!
                      </p>
                    </div>

                    {/* Discount code */}
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-2 p-4 bg-gold-50 rounded-xl border-2 border-dashed border-gold-300">
                        <span className="text-lg font-mono font-bold text-primary-900 tracking-wider">
                          MELODIE10
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="text-xs text-primary-600 hover:text-primary-700 underline"
                        >
                          Kopieren
                        </button>
                      </div>
                    </div>

                    {/* Email form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Deine E-Mail-Adresse"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full group">
                        Rabatt sichern
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </form>

                    <p className="text-xs text-gray-400 text-center mt-4">
                      Wir senden dir den Code per E-Mail. Kein Spam, versprochen!
                    </p>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-primary-900 mb-2">
                      Geschafft!
                    </h3>
                    <p className="text-gray-600">
                      Dein Rabattcode <span className="font-bold">MELODIE10</span> ist unterwegs!
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
