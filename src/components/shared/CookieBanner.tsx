'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setIsVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-2xl shadow-gray-900/10">
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Cookie-Einstellungen
            </h3>
            <p className="text-sm text-gray-600">
              Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten.
              Einige sind notwendig, andere helfen uns, die Website zu verbessern.{' '}
              <Link href="/datenschutz" className="text-primary-600 hover:underline">
                Mehr erfahren
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <Button variant="outline" onClick={acceptEssential} className="w-full sm:w-auto">
              Nur notwendige
            </Button>
            <Button onClick={acceptAll} className="w-full sm:w-auto">
              Alle akzeptieren
            </Button>
          </div>
          <button
            onClick={acceptEssential}
            className="absolute top-4 right-4 lg:relative lg:top-0 lg:right-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
