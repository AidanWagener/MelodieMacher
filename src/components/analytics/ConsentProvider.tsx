'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: string;
}

interface ConsentContextType {
  hasConsent: boolean;
  isLoaded: boolean;
  showBanner: boolean;
  grantConsent: () => void;
  revokeConsent: () => void;
}

const ConsentContext = createContext<ConsentContextType | null>(null);

const CONSENT_KEY = 'cookie_consent';
const CONSENT_VERSION = '1.0';

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      try {
        const parsed: ConsentState = JSON.parse(stored);
        setHasConsent(parsed.analytics === true);
        setShowBanner(false);
      } catch {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
    setIsLoaded(true);
  }, []);

  const grantConsent = useCallback(() => {
    const consent: ConsentState = {
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setHasConsent(true);
    setShowBanner(false);

    // Update pixel consent immediately
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('consent', 'grant');
      window.fbq('track', 'PageView');
    }
  }, []);

  const revokeConsent = useCallback(() => {
    const consent: ConsentState = {
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setHasConsent(false);
    setShowBanner(false);

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('consent', 'revoke');
    }
  }, []);

  return (
    <ConsentContext.Provider value={{ hasConsent, isLoaded, showBanner, grantConsent, revokeConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return context;
}
