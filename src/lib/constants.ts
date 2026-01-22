/**
 * Occasion type labels (German)
 */
export const OCCASION_LABELS: Record<string, string> = {
  hochzeit: 'Hochzeit',
  geburtstag: 'Geburtstag',
  jubilaeum: 'Jubiläum',
  firma: 'Firmenfeier',
  taufe: 'Taufe',
  andere: 'Besonderer Anlass',
};

/**
 * Priority thresholds for order analysis
 */
export const PRIORITY_THRESHOLDS = {
  /** Hours after which normal priority gets boosted to high */
  BOOST_TO_HIGH_HOURS: 48,
  /** Hours after which order becomes urgent */
  BOOST_TO_URGENT_HOURS: 72,
  /** Default rush deadline in hours */
  RUSH_DEADLINE_HOURS: 12,
};

/**
 * Package type labels (German)
 */
export const PACKAGE_LABELS: Record<string, string> = {
  basis: 'Basis (nur MP3)',
  plus: 'Plus (MP3 + Cover + PDF)',
  premium: 'Premium (alles inkl. Video + Instrumental)',
};

/**
 * Order status labels (German)
 */
export const STATUS_LABELS: Record<string, string> = {
  pending: 'Ausstehend',
  paid: 'Bezahlt',
  in_production: 'In Produktion',
  quality_review: 'Qualitätsprüfung',
  delivered: 'Geliefert',
  refunded: 'Erstattet',
};
