'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useConsent } from './ConsentProvider';

const PIXEL_ID = '910798005224040';

export function MetaPixel() {
  const pathname = usePathname();
  const { hasConsent, isLoaded } = useConsent();
  const hasTrackedInitialRef = useRef(false);

  // Track page views on route changes (only if consent granted)
  useEffect(() => {
    if (!isLoaded || !hasConsent) return;
    if (typeof window === 'undefined' || !window.fbq) return;

    // Skip first render (initial PageView handled by script)
    if (!hasTrackedInitialRef.current) {
      hasTrackedInitialRef.current = true;
      return;
    }

    window.fbq('track', 'PageView');
  }, [pathname, hasConsent, isLoaded]);

  // Handle consent changes
  useEffect(() => {
    if (!isLoaded) return;
    if (typeof window === 'undefined' || !window.fbq) return;

    if (hasConsent) {
      window.fbq('consent', 'grant');
      window.fbq('track', 'PageView');
    } else {
      window.fbq('consent', 'revoke');
    }
  }, [hasConsent, isLoaded]);

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

(function(){
  var consent = false;
  try {
    var stored = localStorage.getItem('cookie_consent');
    if (stored) {
      var parsed = JSON.parse(stored);
      consent = parsed.analytics === true;
    }
  } catch(e) {}

  if (consent) {
    fbq('consent', 'grant');
  } else {
    fbq('consent', 'revoke');
  }

  fbq('init', '${PIXEL_ID}');

  if (consent) {
    fbq('track', 'PageView');
  }
})();
        `,
      }}
    />
  );
}
