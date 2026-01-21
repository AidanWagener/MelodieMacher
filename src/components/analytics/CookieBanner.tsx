'use client';

import { useConsent } from './ConsentProvider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X } from 'lucide-react';

export function CookieBanner() {
  const { showBanner, grantConsent, revokeConsent } = useConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6">
      <div className="container-wide">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                Wir nutzen Cookies, um dir ein besseres Erlebnis zu bieten und unsere
                Werbung zu optimieren.{' '}
                <Link
                  href="/datenschutz"
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Mehr erfahren
                </Link>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={revokeConsent}
                className="whitespace-nowrap"
              >
                Nur notwendige
              </Button>
              <Button
                size="sm"
                onClick={grantConsent}
                className="whitespace-nowrap"
              >
                Alle akzeptieren
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
