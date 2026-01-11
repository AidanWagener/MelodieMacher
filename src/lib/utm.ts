/**
 * UTM Parameter Handler
 *
 * Captures UTM parameters on landing and preserves them through the checkout flow.
 * Parameters are stored in sessionStorage and can be passed to Stripe metadata.
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  // Additional tracking parameters
  gclid?: string;        // Google Click ID
  fbclid?: string;       // Facebook Click ID
  ref?: string;          // Referral source
  landing_page?: string; // Initial landing page
  timestamp?: string;    // When the visitor arrived
}

const UTM_STORAGE_KEY = 'melodiemacher_utm';
const UTM_PARAM_KEYS: (keyof UTMParams)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'gclid',
  'fbclid',
  'ref',
];

/**
 * Capture UTM parameters from URL on landing
 * Should be called once when the user first lands on the site
 */
export function captureUTM(): UTMParams | null {
  if (typeof window === 'undefined') return null;

  // Check if we already have UTM params stored (don't overwrite)
  const existingParams = getUTM();
  if (existingParams && Object.keys(existingParams).length > 0) {
    return existingParams;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};
  let hasParams = false;

  // Extract UTM and tracking parameters from URL
  for (const key of UTM_PARAM_KEYS) {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
      hasParams = true;
    }
  }

  // If we have params, add metadata and store
  if (hasParams) {
    utmParams.landing_page = window.location.pathname;
    utmParams.timestamp = new Date().toISOString();

    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
    } catch (e) {
      console.warn('[UTM] Failed to store UTM params:', e);
    }

    return utmParams;
  }

  // Even if no UTM params, store the landing page for attribution
  const landingData: UTMParams = {
    landing_page: window.location.pathname,
    timestamp: new Date().toISOString(),
  };

  // Check referrer for organic attribution
  if (document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      const host = referrerUrl.hostname;

      // Detect common search engines
      if (host.includes('google')) {
        landingData.utm_source = 'google';
        landingData.utm_medium = 'organic';
      } else if (host.includes('bing')) {
        landingData.utm_source = 'bing';
        landingData.utm_medium = 'organic';
      } else if (host.includes('facebook') || host.includes('fb.')) {
        landingData.utm_source = 'facebook';
        landingData.utm_medium = 'social';
      } else if (host.includes('instagram')) {
        landingData.utm_source = 'instagram';
        landingData.utm_medium = 'social';
      } else if (host.includes('tiktok')) {
        landingData.utm_source = 'tiktok';
        landingData.utm_medium = 'social';
      } else if (host.includes('youtube')) {
        landingData.utm_source = 'youtube';
        landingData.utm_medium = 'social';
      } else if (!host.includes(window.location.hostname)) {
        // External referrer
        landingData.utm_source = host;
        landingData.utm_medium = 'referral';
      }
    } catch (e) {
      // Invalid referrer URL
    }
  } else {
    // No referrer - direct traffic
    landingData.utm_source = 'direct';
    landingData.utm_medium = 'none';
  }

  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(landingData));
  } catch (e) {
    console.warn('[UTM] Failed to store landing data:', e);
  }

  return landingData;
}

/**
 * Get stored UTM parameters
 */
export function getUTM(): UTMParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UTMParams;
    }
  } catch (e) {
    console.warn('[UTM] Failed to retrieve UTM params:', e);
  }

  return null;
}

/**
 * Append UTM parameters to a URL
 * Useful for preserving attribution through internal navigation
 */
export function appendUTMToUrl(url: string): string {
  const utmParams = getUTM();
  if (!utmParams) return url;

  try {
    const urlObj = new URL(url, window.location.origin);

    // Only append the core UTM params, not metadata
    const coreParams: (keyof UTMParams)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id',
      'gclid',
      'fbclid',
    ];

    for (const key of coreParams) {
      if (utmParams[key]) {
        urlObj.searchParams.set(key, utmParams[key] as string);
      }
    }

    return urlObj.toString();
  } catch (e) {
    console.warn('[UTM] Failed to append UTM params to URL:', e);
    return url;
  }
}

/**
 * Get UTM parameters formatted for Stripe metadata
 * Stripe metadata values must be strings with max 500 chars
 */
export function getUTMForStripe(): Record<string, string> {
  const utmParams = getUTM();
  if (!utmParams) return {};

  const metadata: Record<string, string> = {};

  // Add each param as separate metadata field
  if (utmParams.utm_source) metadata.utm_source = utmParams.utm_source.slice(0, 500);
  if (utmParams.utm_medium) metadata.utm_medium = utmParams.utm_medium.slice(0, 500);
  if (utmParams.utm_campaign) metadata.utm_campaign = utmParams.utm_campaign.slice(0, 500);
  if (utmParams.utm_term) metadata.utm_term = utmParams.utm_term.slice(0, 500);
  if (utmParams.utm_content) metadata.utm_content = utmParams.utm_content.slice(0, 500);
  if (utmParams.gclid) metadata.gclid = utmParams.gclid.slice(0, 500);
  if (utmParams.fbclid) metadata.fbclid = utmParams.fbclid.slice(0, 500);
  if (utmParams.landing_page) metadata.landing_page = utmParams.landing_page.slice(0, 500);
  if (utmParams.timestamp) metadata.first_touch = utmParams.timestamp.slice(0, 500);

  return metadata;
}

/**
 * Clear stored UTM parameters
 * Call after successful conversion if needed
 */
export function clearUTM(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(UTM_STORAGE_KEY);
  } catch (e) {
    console.warn('[UTM] Failed to clear UTM params:', e);
  }
}

/**
 * Get UTM summary string for logging/debugging
 */
export function getUTMSummary(): string {
  const utmParams = getUTM();
  if (!utmParams) return 'No UTM params';

  const parts: string[] = [];
  if (utmParams.utm_source) parts.push(`source=${utmParams.utm_source}`);
  if (utmParams.utm_medium) parts.push(`medium=${utmParams.utm_medium}`);
  if (utmParams.utm_campaign) parts.push(`campaign=${utmParams.utm_campaign}`);
  if (utmParams.gclid) parts.push('gclid=present');
  if (utmParams.fbclid) parts.push('fbclid=present');

  return parts.length > 0 ? parts.join(', ') : 'Direct traffic';
}

/**
 * React hook for UTM tracking
 * Automatically captures UTM params on mount
 */
export function useUTMCapture(): void {
  if (typeof window !== 'undefined') {
    // Capture on initial load
    captureUTM();
  }
}
