/**
 * Meta Pixel Event Tracking Functions
 *
 * All functions check for fbq existence and consent before firing.
 * Events will only be sent if user has granted analytics consent.
 */

function canTrack(): boolean {
  if (typeof window === 'undefined' || !window.fbq) return false;

  const stored = localStorage.getItem('cookie_consent');
  if (!stored) return false;

  try {
    const parsed = JSON.parse(stored);
    return parsed.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Track PageView event
 */
export function trackMetaPageView(): void {
  if (!canTrack()) return;
  window.fbq('track', 'PageView');
}

/**
 * Track ViewContent event - when user views a product/package
 */
export function trackMetaViewContent(data: {
  contentId: string;
  contentName: string;
  value?: number;
  category?: string;
}): void {
  if (!canTrack()) return;

  window.fbq('track', 'ViewContent', {
    content_ids: [data.contentId],
    content_name: data.contentName,
    content_category: data.category,
    content_type: 'product',
    value: data.value,
    currency: 'EUR',
  });
}

/**
 * Track InitiateCheckout event - when user starts checkout
 */
export function trackMetaInitiateCheckout(data: {
  value: number;
  contentIds?: string[];
  numItems?: number;
}): void {
  if (!canTrack()) return;

  window.fbq('track', 'InitiateCheckout', {
    value: data.value,
    currency: 'EUR',
    content_ids: data.contentIds,
    content_type: 'product',
    num_items: data.numItems || 1,
  });
}

/**
 * Track AddToCart event - when user adds bump/addon
 */
export function trackMetaAddToCart(data: {
  contentId: string;
  contentName: string;
  value: number;
}): void {
  if (!canTrack()) return;

  window.fbq('track', 'AddToCart', {
    content_ids: [data.contentId],
    content_name: data.contentName,
    content_type: 'product',
    value: data.value,
    currency: 'EUR',
  });
}

/**
 * Track Purchase event - after successful payment
 */
export function trackMetaPurchase(data: {
  value: number;
  orderId?: string;
  contentIds?: string[];
  contentName?: string;
  numItems?: number;
}): void {
  if (!canTrack()) return;

  window.fbq('track', 'Purchase', {
    value: data.value,
    currency: 'EUR',
    content_type: 'product',
    content_ids: data.contentIds,
    content_name: data.contentName,
    num_items: data.numItems || 1,
    order_id: data.orderId,
  });
}

/**
 * Track Lead event - newsletter signup, contact form
 */
export function trackMetaLead(data?: {
  value?: number;
  contentName?: string;
}): void {
  if (!canTrack()) return;

  window.fbq('track', 'Lead', {
    value: data?.value,
    currency: 'EUR',
    content_name: data?.contentName,
  });
}

/**
 * Track custom event
 */
export function trackMetaCustomEvent(
  eventName: string,
  data?: Record<string, unknown>
): void {
  if (!canTrack()) return;

  window.fbq('trackCustom', eventName, data);
}
