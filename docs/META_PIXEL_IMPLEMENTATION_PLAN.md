# Meta Pixel + Cookie Consent Implementation Plan

## BMAD Team Collaboration Document

**Date:** 2026-01-21
**Project:** MelodieMacher
**Pixel ID:** 910798005224040
**Status:** Ready for Implementation

---

## Team Participants

| Agent | Role | Focus Area |
|-------|------|------------|
| 📈 Hermes | Growth Engineer | Analytics strategy, event tracking, conversion optimization |
| 🌅 Aurora | Frontend Lead | Next.js implementation, performance, Core Web Vitals |
| 🏗️ Winston | Architect | Technical design, system integration |
| ⚖️ Gaia | Compliance Officer | GDPR/DSGVO compliance, legal requirements |
| 🎨 Sally | UX Designer | Cookie banner UX, user experience |
| 📊 Mary | Analyst | Business requirements, success metrics |
| 💻 Amelia | Developer | Implementation execution |

---

## 1. REQUIREMENTS ANALYSIS

### 📊 Mary (Analyst)

**Business Requirements:**
1. Track visitor behavior across the entire funnel
2. Enable Facebook/Meta ad optimization through conversion data
3. Attribute conversions to specific ad campaigns
4. Comply with German GDPR/DSGVO regulations

**Success Metrics:**
| Metric | Target |
|--------|--------|
| Pixel fires on PageView | 100% of page loads |
| Events appear in Test Events | Within 30 seconds |
| Conversion tracking accuracy | 100% of purchases tracked |
| GDPR compliance | Full Article 6/7 compliance |

**Key Events to Track:**
1. `PageView` - Every page load
2. `ViewContent` - Package details viewed
3. `InitiateCheckout` - Order form started
4. `AddToCart` - Bump/addon selected
5. `Purchase` - Payment completed
6. `Lead` - Newsletter signup

---

## 2. COMPLIANCE REQUIREMENTS

### ⚖️ Gaia (Compliance Officer)

**GDPR/DSGVO Analysis:**

Per **Article 6** (Lawful Basis) and **Article 7** (Consent), tracking pixels require:

1. **Prior Consent:** User must actively consent BEFORE tracking begins
2. **Informed Consent:** User must understand what they're consenting to
3. **Granular Consent:** Option to accept/reject specific purposes
4. **Easy Withdrawal:** Must be as easy to withdraw as to give consent
5. **Documentation:** Consent must be recorded and auditable

**Legal Implementation Requirements:**

```
MANDATORY COMPLIANCE CHECKLIST:
[ ] Cookie banner displayed BEFORE any tracking fires
[ ] Pixel loads with consent REVOKED by default
[ ] Only after user clicks "Accept" does consent get GRANTED
[ ] User choice persisted in localStorage
[ ] Easy access to change consent (footer link)
[ ] Privacy policy updated with Meta Pixel disclosure
```

**Article 25 - Privacy by Design:**
- Pixel MUST initialize with `fbq('consent', 'revoke')`
- Consent state checked BEFORE every event fire
- No data sent to Meta without explicit consent

**Recommended Approach: Meta Consent Mode**

Meta's official Consent Mode allows:
- Pixel to load immediately (for faster initialization)
- Events queued but NOT sent until consent granted
- Aggregated, anonymized modeling data (with consent mode v2)
- Full compliance with GDPR

---

## 3. TECHNICAL ARCHITECTURE

### 🏗️ Winston (Architect)

**System Design:**

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐     ┌──────────────┐     ┌──────────────┐ │
│  │ CookieBanner│────▶│ ConsentStore │────▶│  MetaPixel   │ │
│  │  Component  │     │ (localStorage)│     │  Component   │ │
│  └─────────────┘     └──────────────┘     └──────────────┘ │
│         │                   │                     │         │
│         │                   │                     ▼         │
│         │                   │            ┌──────────────┐   │
│         │                   └───────────▶│ fbq('consent')│  │
│         │                                │ grant/revoke │   │
│         │                                └──────────────┘   │
│         │                                        │          │
│         ▼                                        ▼          │
│  ┌─────────────┐                        ┌──────────────┐   │
│  │  User sees  │                        │ Events fire  │   │
│  │   banner    │                        │ to Meta only │   │
│  └─────────────┘                        │ if consented │   │
│                                         └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**File Structure:**

```
src/
├── components/
│   ├── analytics/
│   │   ├── index.ts              # Exports
│   │   ├── MetaPixel.tsx         # Pixel component
│   │   ├── ConsentProvider.tsx   # Consent context
│   │   └── types.ts              # TypeScript types
│   └── consent/
│       ├── CookieBanner.tsx      # Banner UI
│       └── ConsentManager.tsx    # Settings modal
├── lib/
│   └── meta-events.ts            # Event tracking functions
└── types/
    └── fbq.d.ts                  # Global type declarations
```

**State Management:**

```typescript
// Consent State (localStorage)
interface ConsentState {
  analytics: boolean;      // Meta Pixel + GA4
  marketing: boolean;      // Future: email tracking
  timestamp: number;       // When consent was given
  version: string;         // Consent version for audit
}

// localStorage key: 'cookie_consent'
// Default: null (not set = show banner)
```

**Initialization Flow:**

```
1. Page loads
2. MetaPixel component renders
3. fbevents.js loads via Next.js Script
4. Check localStorage for consent
5. If consent NOT given:
   - fbq('consent', 'revoke')
   - Show CookieBanner
6. If consent given:
   - fbq('consent', 'grant')
   - Fire PageView
7. User clicks Accept:
   - Store consent in localStorage
   - fbq('consent', 'grant')
   - Fire PageView immediately
```

---

## 4. UX DESIGN

### 🎨 Sally (UX Designer)

**Cookie Banner Design Requirements:**

1. **Non-intrusive but visible** - Bottom banner, not popup
2. **Clear language** - German, simple terms
3. **Two clear options** - Accept All / Only Essential
4. **Link to details** - Privacy policy reference
5. **Dismissable** - After choice, stays dismissed

**Banner Copy (German):**

```
┌────────────────────────────────────────────────────────────────────┐
│  🍪 Diese Website verwendet Cookies                                │
│                                                                    │
│  Wir nutzen Cookies und aehnliche Technologien, um dir ein        │
│  besseres Erlebnis zu bieten und unsere Werbung zu optimieren.    │
│                                                                    │
│  [Alle akzeptieren]  [Nur notwendige]  [Mehr erfahren]            │
└────────────────────────────────────────────────────────────────────┘
```

**Interaction States:**

| State | Behavior |
|-------|----------|
| First visit | Banner appears at bottom |
| Click "Alle akzeptieren" | Banner dismisses, consent granted, tracking starts |
| Click "Nur notwendige" | Banner dismisses, consent denied, no tracking |
| Click "Mehr erfahren" | Opens privacy policy in new tab |
| Return visit (consented) | No banner, tracking active |
| Return visit (declined) | No banner, no tracking |

**Footer Link:**
Add "Cookie-Einstellungen" link to footer for consent modification.

---

## 5. FRONTEND IMPLEMENTATION

### 🌅 Aurora (Frontend Lead)

**Performance Requirements:**

| Metric | Target | Implementation |
|--------|--------|----------------|
| LCP Impact | < 100ms | Load pixel with `afterInteractive` strategy |
| CLS Impact | 0 | Banner has fixed height, no layout shift |
| FID Impact | < 50ms | No blocking JavaScript |

**Component Specifications:**

#### MetaPixel.tsx

```typescript
'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { useConsent } from '@/components/analytics/ConsentProvider';

const PIXEL_ID = '910798005224040';

export function MetaPixel() {
  const { hasConsent, isLoaded } = useConsent();

  // Update consent when it changes
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined' || !window.fbq) return;

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
      onLoad={() => {
        // Initialize with consent revoked by default (GDPR compliant)
        window.fbq('consent', 'revoke');
        window.fbq('init', PIXEL_ID);

        // Check if consent already given
        const consent = localStorage.getItem('cookie_consent');
        if (consent) {
          const parsed = JSON.parse(consent);
          if (parsed.analytics) {
            window.fbq('consent', 'grant');
            window.fbq('track', 'PageView');
          }
        }
      }}
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
        `,
      }}
    />
  );
}
```

#### ConsentProvider.tsx

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ConsentContextType {
  hasConsent: boolean;
  isLoaded: boolean;
  grantConsent: () => void;
  revokeConsent: () => void;
}

const ConsentContext = createContext<ConsentContextType | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookie_consent');
    if (stored) {
      const parsed = JSON.parse(stored);
      setHasConsent(parsed.analytics === true);
    }
    setIsLoaded(true);
  }, []);

  const grantConsent = () => {
    const consent = {
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
      version: '1.0',
    };
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    setHasConsent(true);

    // Immediately update pixel consent
    if (window.fbq) {
      window.fbq('consent', 'grant');
      window.fbq('track', 'PageView');
    }
  };

  const revokeConsent = () => {
    const consent = {
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
      version: '1.0',
    };
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    setHasConsent(false);

    if (window.fbq) {
      window.fbq('consent', 'revoke');
    }
  };

  return (
    <ConsentContext.Provider value={{ hasConsent, isLoaded, grantConsent, revokeConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error('useConsent must be used within ConsentProvider');
  return context;
}
```

#### CookieBanner.tsx

```typescript
'use client';

import { useConsent } from '@/components/analytics/ConsentProvider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CookieBanner() {
  const { hasConsent, isLoaded, grantConsent, revokeConsent } = useConsent();

  // Don't render until we've checked localStorage
  if (!isLoaded) return null;

  // Don't render if consent already given/denied
  const stored = typeof window !== 'undefined' ? localStorage.getItem('cookie_consent') : null;
  if (stored) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 shadow-lg p-4 md:p-6">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Wir nutzen Cookies, um dir ein besseres Erlebnis zu bieten und unsere
              Werbung zu optimieren.{' '}
              <Link href="/datenschutz" className="text-primary-600 hover:underline">
                Mehr erfahren
              </Link>
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={revokeConsent}>
              Nur notwendige
            </Button>
            <Button size="sm" onClick={grantConsent}>
              Alle akzeptieren
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### types/fbq.d.ts

```typescript
declare global {
  interface Window {
    fbq: {
      (command: 'consent', action: 'grant' | 'revoke'): void;
      (command: 'init', pixelId: string): void;
      (command: 'track', event: string, params?: Record<string, unknown>): void;
      (command: 'trackCustom', event: string, params?: Record<string, unknown>): void;
    };
    _fbq: unknown;
  }
}

export {};
```

---

## 6. GROWTH ENGINEERING

### 📈 Hermes (Growth Engineer)

**Event Tracking Strategy:**

| Funnel Stage | Event | Trigger | Parameters |
|--------------|-------|---------|------------|
| Awareness | PageView | Every page | page_path |
| Interest | ViewContent | Package card click | content_id, content_name, value |
| Consideration | InitiateCheckout | Order form load | value, currency |
| Intent | AddToCart | Bump selected | content_id, content_name, value |
| Purchase | Purchase | Payment success | value, currency, order_id, content_ids |

**Event Implementation (meta-events.ts):**

```typescript
export function trackMetaPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

export function trackMetaViewContent(data: {
  contentId: string;
  contentName: string;
  value: number;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [data.contentId],
      content_name: data.contentName,
      content_type: 'product',
      value: data.value,
      currency: 'EUR',
    });
  }
}

export function trackMetaInitiateCheckout(value: number) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value,
      currency: 'EUR',
    });
  }
}

export function trackMetaAddToCart(data: {
  contentId: string;
  contentName: string;
  value: number;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [data.contentId],
      content_name: data.contentName,
      content_type: 'product',
      value: data.value,
      currency: 'EUR',
    });
  }
}

export function trackMetaPurchase(data: {
  value: number;
  orderId?: string;
  contentIds?: string[];
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: data.value,
      currency: 'EUR',
      content_type: 'product',
      content_ids: data.contentIds,
      order_id: data.orderId,
    });
  }
}
```

**Conversion Optimization Settings:**

In Meta Events Manager, configure:
1. **Optimization Event:** Purchase (primary)
2. **Fallback Events:** InitiateCheckout, ViewContent
3. **Attribution Window:** 7-day click, 1-day view
4. **Aggregated Event Measurement:** Enable for iOS 14.5+

---

## 7. IMPLEMENTATION CHECKLIST

### 💻 Amelia (Developer)

**Pre-Implementation:**
- [ ] Read this entire document
- [ ] Verify Pixel ID: `910798005224040`
- [ ] Confirm no existing pixel code in codebase

**Implementation Tasks:**

```
PHASE 1: Core Infrastructure
[ ] Create src/types/fbq.d.ts
[ ] Create src/components/analytics/ConsentProvider.tsx
[ ] Create src/components/analytics/MetaPixel.tsx
[ ] Create src/components/consent/CookieBanner.tsx
[ ] Update src/components/analytics/index.ts exports

PHASE 2: Integration
[ ] Add ConsentProvider to src/app/layout.tsx
[ ] Add MetaPixel to AnalyticsProvider
[ ] Add CookieBanner to src/app/layout.tsx (or page.tsx)
[ ] Add "Cookie-Einstellungen" link to Footer

PHASE 3: Event Tracking
[ ] Create src/lib/meta-events.ts
[ ] Add trackMetaInitiateCheckout to OrderForm.tsx
[ ] Add trackMetaViewContent to package selection
[ ] Add trackMetaAddToCart to bump selection
[ ] Add trackMetaPurchase to ThankYouContent.tsx

PHASE 4: Testing
[ ] Clear localStorage, verify banner appears
[ ] Click "Alle akzeptieren", verify PageView in Test Events
[ ] Complete test order, verify Purchase in Test Events
[ ] Click "Nur notwendige", verify NO events fire
[ ] Verify banner doesn't reappear after choice
```

**Testing Procedure:**

1. Open https://melodiemacher.de in Incognito
2. Open Facebook Events Manager > Test Events
3. Enter URL: https://melodiemacher.de
4. On site: Cookie banner should appear
5. Click "Alle akzeptieren"
6. In Test Events: PageView should appear within 30s
7. Navigate to /bestellen
8. In Test Events: InitiateCheckout should appear
9. Complete test purchase
10. In Test Events: Purchase should appear

---

## 8. DEPLOYMENT

**Environment Variables:**

```bash
# Not needed - Pixel ID is hardcoded for simplicity
# If you want env-based:
# NEXT_PUBLIC_META_PIXEL_ID=910798005224040
```

**Vercel Deployment:**

```bash
cd melodiemacher
npm run build
vercel --prod
```

**Post-Deployment Verification:**

1. Visit https://melodiemacher.de
2. Open Meta Pixel Helper extension
3. Should show: Pixel ID 910798005224040
4. After accepting cookies: PageView should show checkmark (sent)
5. Check Test Events in Events Manager

---

## 9. SIGN-OFF

| Agent | Approval | Notes |
|-------|----------|-------|
| 📈 Hermes | ✅ | Event strategy complete |
| 🌅 Aurora | ✅ | Performance requirements met |
| 🏗️ Winston | ✅ | Architecture sound |
| ⚖️ Gaia | ✅ | GDPR compliant |
| 🎨 Sally | ✅ | UX approved |
| 📊 Mary | ✅ | Requirements captured |
| 💻 Amelia | ⏳ | Ready for implementation |

---

## EXECUTE IMPLEMENTATION

Run the following command to implement:

```
Implement the Meta Pixel according to docs/META_PIXEL_IMPLEMENTATION_PLAN.md
```

---

*Document generated by BMAD Team - MelodieMacher Project*
