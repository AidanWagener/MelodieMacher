/**
 * Unified Analytics Interface
 *
 * GDPR-compliant analytics that only fires after consent.
 * Supports GA4 and Meta Pixel tracking.
 */

// Types for analytics events
export interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
}

export interface ConversionData {
  transactionId: string;
  value: number;
  currency?: string;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }>;
}

export interface FormStepData {
  step: number;
  stepName: string;
  formName?: string;
}

export interface PageViewData {
  path?: string;
  title?: string;
  referrer?: string;
}

// Consent state management
let analyticsConsent = false;

/**
 * Check if analytics consent has been given
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;

  // Check localStorage for consent state
  const consent = localStorage.getItem('analytics_consent');
  analyticsConsent = consent === 'true';
  return analyticsConsent;
}

/**
 * Set analytics consent state
 */
export function setAnalyticsConsent(consent: boolean): void {
  if (typeof window === 'undefined') return;

  analyticsConsent = consent;
  localStorage.setItem('analytics_consent', consent.toString());

  // If consent granted, send any queued events
  if (consent) {
    processEventQueue();
  }
}

// Event queue for events that occur before consent
const eventQueue: Array<() => void> = [];

function processEventQueue(): void {
  while (eventQueue.length > 0) {
    const event = eventQueue.shift();
    if (event) event();
  }
}

function queueOrExecute(fn: () => void): void {
  if (hasAnalyticsConsent()) {
    fn();
  } else {
    eventQueue.push(fn);
  }
}

/**
 * Track a page view
 */
export function trackPageView(data?: PageViewData): void {
  queueOrExecute(() => {
    const path = data?.path || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const title = data?.title || (typeof document !== 'undefined' ? document.title : '');

    // GA4 Page View
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
        page_referrer: data?.referrer || document.referrer,
      });
    }

    // Meta Pixel Page View
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Page View:', { path, title });
    }
  });
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent): void {
  queueOrExecute(() => {
    // GA4 Event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.name, event.params);
    }

    // Meta Pixel Custom Event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', event.name, event.params);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Event:', event.name, event.params);
    }
  });
}

/**
 * Track a form step completion
 */
export function trackFormStep(data: FormStepData): void {
  const eventName = `form_step_${data.step}`;

  queueOrExecute(() => {
    // GA4 Form Step
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        step_number: data.step,
        step_name: data.stepName,
        form_name: data.formName || 'order_form',
      });
    }

    // Meta Pixel Custom Event for form progress
    if (typeof window !== 'undefined' && window.fbq) {
      if (data.step === 1) {
        // First step - InitiateCheckout equivalent
        window.fbq('track', 'InitiateCheckout', {
          content_name: data.formName || 'order_form',
          content_category: 'form_step',
        });
      } else {
        window.fbq('trackCustom', 'FormProgress', {
          step: data.step,
          step_name: data.stepName,
        });
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Form Step:', data);
    }
  });
}

/**
 * Track a conversion (purchase)
 */
export function trackConversion(data: ConversionData): void {
  queueOrExecute(() => {
    const currency = data.currency || 'EUR';

    // GA4 Purchase Event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: data.transactionId,
        value: data.value,
        currency: currency,
        items: data.items?.map((item, index) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          index: index,
        })),
      });
    }

    // Meta Pixel Purchase Event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Purchase', {
        value: data.value,
        currency: currency,
        content_ids: data.items?.map(item => item.id),
        content_name: data.items?.map(item => item.name).join(', '),
        content_type: 'product',
        num_items: data.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Conversion:', data);
    }
  });
}

/**
 * Track View Content event (product page views)
 */
export function trackViewContent(data: {
  contentId: string;
  contentName: string;
  contentCategory?: string;
  value?: number;
  currency?: string;
}): void {
  queueOrExecute(() => {
    // GA4 View Item
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: data.currency || 'EUR',
        value: data.value,
        items: [{
          item_id: data.contentId,
          item_name: data.contentName,
          item_category: data.contentCategory,
          price: data.value,
        }],
      });
    }

    // Meta Pixel ViewContent
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [data.contentId],
        content_name: data.contentName,
        content_category: data.contentCategory,
        content_type: 'product',
        value: data.value,
        currency: data.currency || 'EUR',
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] View Content:', data);
    }
  });
}

/**
 * Track package selection
 */
export function trackPackageSelection(data: {
  packageId: string;
  packageName: string;
  price: number;
}): void {
  queueOrExecute(() => {
    // GA4 Select Item
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_item', {
        items: [{
          item_id: data.packageId,
          item_name: data.packageName,
          price: data.price,
        }],
      });
    }

    // Meta Pixel Custom Event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'SelectPackage', {
        content_ids: [data.packageId],
        content_name: data.packageName,
        value: data.price,
        currency: 'EUR',
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Package Selection:', data);
    }
  });
}

/**
 * Track bump/addon addition
 */
export function trackBumpAddition(data: {
  bumpId: string;
  bumpName: string;
  price: number;
}): void {
  queueOrExecute(() => {
    // GA4 Add to Cart
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'EUR',
        value: data.price,
        items: [{
          item_id: data.bumpId,
          item_name: data.bumpName,
          price: data.price,
          item_category: 'bump',
        }],
      });
    }

    // Meta Pixel AddToCart
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [data.bumpId],
        content_name: data.bumpName,
        content_type: 'product',
        value: data.price,
        currency: 'EUR',
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Bump Addition:', data);
    }
  });
}

/**
 * Track upsell click
 */
export function trackUpsellClick(data: {
  upsellId: string;
  upsellName: string;
  originalPrice: number;
  discountedPrice: number;
}): void {
  queueOrExecute(() => {
    // GA4 Custom Event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'upsell_click', {
        item_id: data.upsellId,
        item_name: data.upsellName,
        original_price: data.originalPrice,
        discounted_price: data.discountedPrice,
        discount_percentage: Math.round((1 - data.discountedPrice / data.originalPrice) * 100),
      });
    }

    // Meta Pixel Custom Event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'UpsellClick', {
        content_ids: [data.upsellId],
        content_name: data.upsellName,
        value: data.discountedPrice,
        currency: 'EUR',
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Upsell Click:', data);
    }
  });
}

// Type declarations for global analytics objects
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
    fbq: (
      command: 'track' | 'trackCustom' | 'init',
      event: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq: unknown;
  }
}
