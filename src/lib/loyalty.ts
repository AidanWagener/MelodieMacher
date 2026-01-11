// Loyalty Program System
// Tracks customer purchases and provides VIP benefits

import { nanoid } from 'nanoid';

export type CustomerTier = 'standard' | 'vip';

export interface CustomerLoyalty {
  id: string;
  email: string;
  name: string;
  tier: CustomerTier;
  purchaseCount: number;
  totalSpent: number; // in cents
  firstPurchaseDate: Date;
  lastPurchaseDate: Date;
  vipSince?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoyaltyBenefit {
  tier: CustomerTier;
  discountPercent: number;
  benefits: string[];
  nextTierRequirement?: {
    purchases: number;
    currentProgress: number;
  };
}

// Configuration
export const LOYALTY_CONFIG = {
  VIP_THRESHOLD_PURCHASES: 2, // 2 purchases to become VIP
  VIP_DISCOUNT_PERCENT: 15, // 15% permanent discount
  STANDARD_DISCOUNT_PERCENT: 0,
  VIP_BADGE_ENABLED: true,
};

/**
 * Gets or creates a customer loyalty record
 */
export async function getOrCreateCustomerLoyalty(
  email: string,
  name?: string
): Promise<CustomerLoyalty> {
  // In production, fetch from database:
  // const { data: existing } = await supabase
  //   .from('customer_loyalty')
  //   .select('*')
  //   .eq('email', email)
  //   .single();
  //
  // if (existing) {
  //   return existing;
  // }

  // Create new loyalty record
  const newCustomer: CustomerLoyalty = {
    id: nanoid(),
    email,
    name: name || '',
    tier: 'standard',
    purchaseCount: 0,
    totalSpent: 0,
    firstPurchaseDate: new Date(),
    lastPurchaseDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // In production:
  // await supabase.from('customer_loyalty').insert(newCustomer);

  console.log('Created loyalty record for:', email);
  return newCustomer;
}

/**
 * Gets the customer's current tier
 */
export async function getCustomerTier(email: string): Promise<{
  tier: CustomerTier;
  purchaseCount: number;
  discountPercent: number;
  isVip: boolean;
}> {
  const loyalty = await getOrCreateCustomerLoyalty(email);

  const tier = loyalty.tier;
  const isVip = tier === 'vip';
  const discountPercent = isVip
    ? LOYALTY_CONFIG.VIP_DISCOUNT_PERCENT
    : LOYALTY_CONFIG.STANDARD_DISCOUNT_PERCENT;

  return {
    tier,
    purchaseCount: loyalty.purchaseCount,
    discountPercent,
    isVip,
  };
}

/**
 * Calculates the loyalty discount for an order
 */
export async function calculateLoyaltyDiscount(
  email: string,
  orderTotal: number
): Promise<{
  discountAmount: number;
  discountPercent: number;
  newTotal: number;
  tier: CustomerTier;
  isVip: boolean;
}> {
  const { tier, discountPercent, isVip } = await getCustomerTier(email);

  const discountAmount = Math.round((orderTotal * discountPercent) / 100);
  const newTotal = orderTotal - discountAmount;

  return {
    discountAmount,
    discountPercent,
    newTotal,
    tier,
    isVip,
  };
}

/**
 * Records a purchase and updates loyalty status
 */
export async function recordPurchase(
  email: string,
  orderAmount: number,
  orderId: string
): Promise<{
  newTier: CustomerTier;
  wasUpgraded: boolean;
  purchaseCount: number;
}> {
  const loyalty = await getOrCreateCustomerLoyalty(email);

  const newPurchaseCount = loyalty.purchaseCount + 1;
  const newTotalSpent = loyalty.totalSpent + orderAmount;

  // Check for tier upgrade
  const wasStandard = loyalty.tier === 'standard';
  const shouldBeVip = newPurchaseCount >= LOYALTY_CONFIG.VIP_THRESHOLD_PURCHASES;
  const newTier: CustomerTier = shouldBeVip ? 'vip' : 'standard';
  const wasUpgraded = wasStandard && shouldBeVip;

  // Update loyalty record
  // In production:
  // await supabase
  //   .from('customer_loyalty')
  //   .update({
  //     purchase_count: newPurchaseCount,
  //     total_spent: newTotalSpent,
  //     last_purchase_date: new Date().toISOString(),
  //     tier: newTier,
  //     vip_since: wasUpgraded ? new Date().toISOString() : loyalty.vipSince,
  //     updated_at: new Date().toISOString(),
  //   })
  //   .eq('email', email);

  // Record the purchase
  // await supabase.from('purchase_history').insert({
  //   id: nanoid(),
  //   customer_email: email,
  //   order_id: orderId,
  //   amount: orderAmount,
  //   created_at: new Date().toISOString(),
  // });

  console.log(`Recorded purchase for ${email}: ${newPurchaseCount} total, tier: ${newTier}`);

  if (wasUpgraded) {
    console.log(`${email} upgraded to VIP!`);
    // In production, send VIP welcome email
    // await sendVipWelcomeEmail(email, loyalty.name);
  }

  return {
    newTier,
    wasUpgraded,
    purchaseCount: newPurchaseCount,
  };
}

/**
 * Gets the loyalty benefits for a customer
 */
export async function getLoyaltyBenefits(email: string): Promise<LoyaltyBenefit> {
  const loyalty = await getOrCreateCustomerLoyalty(email);

  if (loyalty.tier === 'vip') {
    return {
      tier: 'vip',
      discountPercent: LOYALTY_CONFIG.VIP_DISCOUNT_PERCENT,
      benefits: [
        `${LOYALTY_CONFIG.VIP_DISCOUNT_PERCENT}% permanenter Rabatt auf alle Bestellungen`,
        'VIP-Badge auf deinem Profil',
        'Prioritaets-Support',
        'Exklusive Vorschauen auf neue Features',
        'Fruehzeitiger Zugang zu Sonderaktionen',
      ],
    };
  }

  const purchasesUntilVip =
    LOYALTY_CONFIG.VIP_THRESHOLD_PURCHASES - loyalty.purchaseCount;

  return {
    tier: 'standard',
    discountPercent: LOYALTY_CONFIG.STANDARD_DISCOUNT_PERCENT,
    benefits: ['Sammle Kaeufe fuer VIP-Status'],
    nextTierRequirement: {
      purchases: LOYALTY_CONFIG.VIP_THRESHOLD_PURCHASES,
      currentProgress: loyalty.purchaseCount,
    },
  };
}

/**
 * Checks if a customer is eligible for VIP upgrade
 */
export async function checkVipEligibility(email: string): Promise<{
  isEligible: boolean;
  purchasesNeeded: number;
  currentPurchases: number;
}> {
  const loyalty = await getOrCreateCustomerLoyalty(email);

  if (loyalty.tier === 'vip') {
    return {
      isEligible: false, // Already VIP
      purchasesNeeded: 0,
      currentPurchases: loyalty.purchaseCount,
    };
  }

  const purchasesNeeded = Math.max(
    0,
    LOYALTY_CONFIG.VIP_THRESHOLD_PURCHASES - loyalty.purchaseCount
  );

  return {
    isEligible: purchasesNeeded === 0,
    purchasesNeeded,
    currentPurchases: loyalty.purchaseCount,
  };
}

/**
 * Gets VIP badge display data
 */
export function getVipBadgeData(tier: CustomerTier): {
  show: boolean;
  text: string;
  color: string;
  icon: 'crown' | 'star' | 'none';
} {
  if (!LOYALTY_CONFIG.VIP_BADGE_ENABLED || tier !== 'vip') {
    return {
      show: false,
      text: '',
      color: '',
      icon: 'none',
    };
  }

  return {
    show: true,
    text: 'VIP',
    color: 'gold',
    icon: 'crown',
  };
}

/**
 * Generates a progress message for non-VIP customers
 */
export function getProgressMessage(purchaseCount: number): string {
  const remaining = LOYALTY_CONFIG.VIP_THRESHOLD_PURCHASES - purchaseCount;

  if (remaining <= 0) {
    return 'Du bist VIP!';
  }

  if (remaining === 1) {
    return 'Noch 1 Kauf bis zum VIP-Status mit 15% Dauerrabatt!';
  }

  return `Noch ${remaining} Kaeufe bis zum VIP-Status mit 15% Dauerrabatt!`;
}

/**
 * Gets customer's purchase history
 */
export async function getPurchaseHistory(
  email: string
): Promise<
  Array<{
    orderId: string;
    date: Date;
    amount: number;
    songTitle: string;
    recipientName: string;
  }>
> {
  // In production:
  // const { data } = await supabase
  //   .from('purchase_history')
  //   .select('*')
  //   .eq('customer_email', email)
  //   .order('created_at', { ascending: false });

  // Placeholder data
  return [
    {
      orderId: 'ord_123',
      date: new Date('2024-01-15'),
      amount: 7900,
      songTitle: 'Fuer immer Dein',
      recipientName: 'Lisa',
    },
  ];
}

/**
 * Applies combined discounts (loyalty + referral + promo)
 * Determines which discount to apply (usually the highest)
 */
export async function applyBestDiscount(
  email: string,
  orderTotal: number,
  availableDiscounts: {
    referralDiscountCents?: number;
    promoDiscountPercent?: number;
  }
): Promise<{
  appliedDiscount: 'loyalty' | 'referral' | 'promo' | 'none';
  discountAmount: number;
  newTotal: number;
  discountDescription: string;
}> {
  const loyaltyDiscount = await calculateLoyaltyDiscount(email, orderTotal);

  // Calculate all possible discounts
  const loyaltyAmount = loyaltyDiscount.discountAmount;
  const referralAmount = availableDiscounts.referralDiscountCents || 0;
  const promoAmount = availableDiscounts.promoDiscountPercent
    ? Math.round((orderTotal * availableDiscounts.promoDiscountPercent) / 100)
    : 0;

  // Find the best discount
  type DiscountType = 'loyalty' | 'referral' | 'promo' | 'none';
  interface DiscountOption {
    type: DiscountType;
    amount: number;
    description: string;
  }

  const discounts: DiscountOption[] = [
    { type: 'loyalty', amount: loyaltyAmount, description: `${LOYALTY_CONFIG.VIP_DISCOUNT_PERCENT}% VIP-Rabatt` },
    { type: 'referral', amount: referralAmount, description: 'Empfehlungsrabatt' },
    { type: 'promo', amount: promoAmount, description: 'Promo-Rabatt' },
  ];

  const noDiscount: DiscountOption = { type: 'none', amount: 0, description: '' };

  const best = discounts.reduce<DiscountOption>(
    (max, curr) => (curr.amount > max.amount ? curr : max),
    noDiscount
  );

  return {
    appliedDiscount: best.type,
    discountAmount: best.amount,
    newTotal: orderTotal - best.amount,
    discountDescription: best.description,
  };
}

/**
 * Sends VIP welcome email when customer reaches VIP status
 */
async function sendVipWelcomeEmail(email: string, name: string): Promise<void> {
  // In production:
  // const { sendEmail, vipWelcomeTemplate } = await import('./email');
  // await sendEmail({
  //   to: email,
  //   subject: 'Willkommen im MelodieMacher VIP-Club!',
  //   html: vipWelcomeTemplate({ customerName: name }),
  // });

  console.log(`Would send VIP welcome email to ${email}`);
}

/**
 * Gets loyalty statistics for admin dashboard
 */
export async function getLoyaltyStats(): Promise<{
  totalCustomers: number;
  vipCustomers: number;
  averagePurchaseCount: number;
  totalRevenue: number;
}> {
  // In production:
  // const { data } = await supabase.from('customer_loyalty').select('*');

  // Placeholder
  return {
    totalCustomers: 150,
    vipCustomers: 45,
    averagePurchaseCount: 1.8,
    totalRevenue: 1250000, // in cents
  };
}
