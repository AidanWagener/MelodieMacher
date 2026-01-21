/**
 * Unified Analytics Interface
 *
 * Simple analytics tracking for GA4.
 */

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

/**
 * Track a page view
 */
export function trackPageView(data?: PageViewData): void {
  const path = data?.path || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const title = data?.title || (typeof document !== 'undefined' ? document.title : '');

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      page_referrer: data?.referrer || document.referrer,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Page View:', { path, title });
  }
}

/**
 * Track a custom event
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.name, event.params);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Event:', event.name, event.params);
  }
}

/**
 * Track a form step completion
 */
export function trackFormStep(data: FormStepData): void {
  const eventName = `form_step_${data.step}`;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      step_number: data.step,
      step_name: data.stepName,
      form_name: data.formName || 'order_form',
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Form Step:', data);
  }
}

/**
 * Track a conversion (purchase)
 */
export function trackConversion(data: ConversionData): void {
  const currency = data.currency || 'EUR';

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

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Conversion:', data);
  }
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

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] View Content:', data);
  }
}

/**
 * Track package selection
 */
export function trackPackageSelection(data: {
  packageId: string;
  packageName: string;
  price: number;
}): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'select_item', {
      items: [{
        item_id: data.packageId,
        item_name: data.packageName,
        price: data.price,
      }],
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Package Selection:', data);
  }
}

/**
 * Track bump/addon addition
 */
export function trackBumpAddition(data: {
  bumpId: string;
  bumpName: string;
  price: number;
}): void {
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

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Bump Addition:', data);
  }
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
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'upsell_click', {
      item_id: data.upsellId,
      item_name: data.upsellName,
      original_price: data.originalPrice,
      discounted_price: data.discountedPrice,
      discount_percentage: Math.round((1 - data.discountedPrice / data.originalPrice) * 100),
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Upsell Click:', data);
  }
}

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
