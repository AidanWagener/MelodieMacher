'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (approximately 600px)
      const heroHeight = 600;
      setIsVisible(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
          {/* Gradient background */}
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 border-t border-primary-500/30 shadow-2xl shadow-primary-900/50">
            <div className="container-wide py-3 px-4">
              <div className="flex items-center justify-between gap-3">
                {/* Left side - Price and trust */}
                <div className="flex flex-col">
                  <span className="text-gold-400 font-bold text-lg">Ab 49 Euro</span>
                  <div className="flex items-center gap-1 text-primary-100 text-xs">
                    <Shield className="w-3 h-3" />
                    <span>Gaensehaut-Garantie</span>
                  </div>
                </div>

                {/* Right side - CTA Button */}
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="group shadow-lg shadow-gold-500/30"
                >
                  <Link href="/bestellen">
                    Jetzt Song erstellen
                    <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
