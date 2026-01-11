// Referral System - "Gib 10 Euro, bekomme 10 Euro"
// Generates unique referral codes and manages referral rewards

import { nanoid } from 'nanoid';

export interface ReferralCode {
  code: string;
  createdBy: string; // customer email
  createdAt: Date;
  usageCount: number;
  totalEarned: number; // in cents
  isActive: boolean;
}

export interface ReferralUsage {
  id: string;
  referralCode: string;
  usedBy: string; // new customer email
  orderId: string;
  discountApplied: number; // in cents (1000 = 10 Euro)
  rewardEarned: number; // in cents
  createdAt: Date;
}

export interface ReferralReward {
  customerId: string;
  email: string;
  availableCredits: number; // in cents
  totalEarned: number; // lifetime earnings in cents
  referralCode: string;
}

// Configuration
export const REFERRAL_CONFIG = {
  DISCOUNT_AMOUNT: 1000, // 10 Euro discount for new customer
  REWARD_AMOUNT: 1000, // 10 Euro credit for referrer
  CODE_PREFIX: 'FREUND',
  CODE_LENGTH: 4, // Random part length
  MIN_ORDER_VALUE: 4900, // 49 Euro minimum to use referral
  MAX_USES_PER_CODE: 100, // Maximum uses per referral code
  CREDITS_EXPIRY_DAYS: 365, // Credits expire after 1 year
};

/**
 * Generates a unique referral code in format: FREUND-XXXX
 * @param customerEmail - The email of the customer creating the code
 * @returns The generated referral code
 */
export function generateReferralCode(customerEmail: string): string {
  // Generate 4 random alphanumeric characters (uppercase)
  const randomPart = nanoid(REFERRAL_CONFIG.CODE_LENGTH)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, 'X'); // Replace any special chars

  const code = `${REFERRAL_CONFIG.CODE_PREFIX}-${randomPart}`;

  // In production, store in database:
  // await supabase.from('referral_codes').insert({
  //   code,
  //   created_by: customerEmail,
  //   created_at: new Date().toISOString(),
  //   usage_count: 0,
  //   total_earned: 0,
  //   is_active: true,
  // });

  console.log(`Generated referral code ${code} for ${customerEmail}`);
  return code;
}

/**
 * Generates a shareable referral link
 * @param code - The referral code
 * @returns Full URL for sharing
 */
export function getReferralLink(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://melodiemacher.de';
  return `${baseUrl}/r/${code}`;
}

/**
 * Validates a referral code
 * @param code - The referral code to validate
 * @returns Validation result with details
 */
export async function validateReferralCode(code: string): Promise<{
  isValid: boolean;
  error?: string;
  referrerEmail?: string;
  discountAmount?: number;
}> {
  // Normalize code (uppercase, trim)
  const normalizedCode = code.trim().toUpperCase();

  // Check format
  const codePattern = new RegExp(`^${REFERRAL_CONFIG.CODE_PREFIX}-[A-Z0-9]{${REFERRAL_CONFIG.CODE_LENGTH}}$`);
  if (!codePattern.test(normalizedCode)) {
    return {
      isValid: false,
      error: 'Ungueltiger Rabattcode-Format',
    };
  }

  // In production, fetch from database:
  // const { data: referralCode } = await supabase
  //   .from('referral_codes')
  //   .select('*')
  //   .eq('code', normalizedCode)
  //   .single();

  // Placeholder validation - in production, check database
  const mockReferralCode: ReferralCode | null = {
    code: normalizedCode,
    createdBy: 'referrer@example.com',
    createdAt: new Date(),
    usageCount: 5,
    totalEarned: 5000,
    isActive: true,
  };

  if (!mockReferralCode) {
    return {
      isValid: false,
      error: 'Rabattcode nicht gefunden',
    };
  }

  if (!mockReferralCode.isActive) {
    return {
      isValid: false,
      error: 'Dieser Rabattcode ist nicht mehr gueltig',
    };
  }

  if (mockReferralCode.usageCount >= REFERRAL_CONFIG.MAX_USES_PER_CODE) {
    return {
      isValid: false,
      error: 'Dieser Rabattcode wurde bereits zu oft verwendet',
    };
  }

  return {
    isValid: true,
    referrerEmail: mockReferralCode.createdBy,
    discountAmount: REFERRAL_CONFIG.DISCOUNT_AMOUNT,
  };
}

/**
 * Applies a referral discount to an order
 * @param code - The referral code
 * @param newCustomerEmail - Email of the new customer
 * @param orderId - The order ID
 * @param orderTotal - Order total in cents
 * @returns Result of applying the discount
 */
export async function applyReferralDiscount(
  code: string,
  newCustomerEmail: string,
  orderId: string,
  orderTotal: number
): Promise<{
  success: boolean;
  discountAmount: number;
  newTotal: number;
  error?: string;
}> {
  // Validate the code first
  const validation = await validateReferralCode(code);

  if (!validation.isValid) {
    return {
      success: false,
      discountAmount: 0,
      newTotal: orderTotal,
      error: validation.error,
    };
  }

  // Check minimum order value
  if (orderTotal < REFERRAL_CONFIG.MIN_ORDER_VALUE) {
    return {
      success: false,
      discountAmount: 0,
      newTotal: orderTotal,
      error: `Mindestbestellwert von ${REFERRAL_CONFIG.MIN_ORDER_VALUE / 100} Euro erforderlich`,
    };
  }

  // Check if customer already used a referral code
  // In production:
  // const { data: existingUsage } = await supabase
  //   .from('referral_usages')
  //   .select('*')
  //   .eq('used_by', newCustomerEmail)
  //   .limit(1);
  // if (existingUsage?.length > 0) {
  //   return { success: false, error: 'Du hast bereits einen Empfehlungscode verwendet' };
  // }

  const discountAmount = REFERRAL_CONFIG.DISCOUNT_AMOUNT;
  const newTotal = Math.max(0, orderTotal - discountAmount);

  // In production, record the usage and credit the referrer:
  // await supabase.from('referral_usages').insert({
  //   id: nanoid(),
  //   referral_code: code,
  //   used_by: newCustomerEmail,
  //   order_id: orderId,
  //   discount_applied: discountAmount,
  //   reward_earned: REFERRAL_CONFIG.REWARD_AMOUNT,
  //   created_at: new Date().toISOString(),
  // });

  // Update referral code usage count
  // await supabase.from('referral_codes').update({
  //   usage_count: incrementedCount,
  //   total_earned: incrementedTotal,
  // }).eq('code', code);

  // Credit the referrer
  // await creditReferrer(validation.referrerEmail!, REFERRAL_CONFIG.REWARD_AMOUNT);

  console.log(`Applied referral discount: ${code} for order ${orderId}`);

  return {
    success: true,
    discountAmount,
    newTotal,
  };
}

/**
 * Gets or creates a referral code for a customer
 * @param customerEmail - Customer email
 * @returns The customer's referral code
 */
export async function getOrCreateReferralCode(customerEmail: string): Promise<string> {
  // In production, check if customer already has a code:
  // const { data: existingCode } = await supabase
  //   .from('referral_codes')
  //   .select('code')
  //   .eq('created_by', customerEmail)
  //   .single();
  //
  // if (existingCode) {
  //   return existingCode.code;
  // }

  return generateReferralCode(customerEmail);
}

/**
 * Gets referral rewards/credits for a customer
 * @param customerEmail - Customer email
 * @returns Customer's referral rewards
 */
export async function getReferralRewards(customerEmail: string): Promise<ReferralReward> {
  // In production, fetch from database:
  // const { data } = await supabase
  //   .from('referral_rewards')
  //   .select('*')
  //   .eq('email', customerEmail)
  //   .single();

  // Placeholder data
  return {
    customerId: 'cust_123',
    email: customerEmail,
    availableCredits: 2000, // 20 Euro available
    totalEarned: 5000, // 50 Euro lifetime
    referralCode: await getOrCreateReferralCode(customerEmail),
  };
}

/**
 * Credits a referrer when their code is used
 * @param referrerEmail - Referrer's email
 * @param amount - Amount to credit in cents
 */
export async function creditReferrer(referrerEmail: string, amount: number): Promise<void> {
  // In production:
  // await supabase.rpc('credit_referral_reward', {
  //   p_email: referrerEmail,
  //   p_amount: amount,
  // });

  console.log(`Credited ${amount / 100} Euro to ${referrerEmail}`);
}

/**
 * Applies referral credits to an order (for referrers using their earned credits)
 * @param customerEmail - Customer email
 * @param orderTotal - Order total in cents
 * @param creditsToApply - Amount of credits to apply in cents
 * @returns Result of applying credits
 */
export async function applyReferralCredits(
  customerEmail: string,
  orderTotal: number,
  creditsToApply: number
): Promise<{
  success: boolean;
  creditsApplied: number;
  newTotal: number;
  remainingCredits: number;
  error?: string;
}> {
  const rewards = await getReferralRewards(customerEmail);

  if (creditsToApply > rewards.availableCredits) {
    return {
      success: false,
      creditsApplied: 0,
      newTotal: orderTotal,
      remainingCredits: rewards.availableCredits,
      error: 'Nicht genuegend Guthaben verfuegbar',
    };
  }

  const actualCreditsApplied = Math.min(creditsToApply, orderTotal);
  const newTotal = orderTotal - actualCreditsApplied;
  const remainingCredits = rewards.availableCredits - actualCreditsApplied;

  // In production, deduct credits:
  // await supabase.from('referral_rewards').update({
  //   available_credits: remainingCredits,
  // }).eq('email', customerEmail);

  console.log(`Applied ${actualCreditsApplied / 100} Euro credits for ${customerEmail}`);

  return {
    success: true,
    creditsApplied: actualCreditsApplied,
    newTotal,
    remainingCredits,
  };
}

/**
 * Gets referral statistics for a customer
 * @param customerEmail - Customer email
 * @returns Referral statistics
 */
export async function getReferralStats(customerEmail: string): Promise<{
  referralCode: string;
  totalReferrals: number;
  totalEarned: number;
  availableCredits: number;
  recentReferrals: Array<{
    date: string;
    reward: number;
  }>;
}> {
  const rewards = await getReferralRewards(customerEmail);

  // In production, fetch detailed stats:
  // const { data: usages } = await supabase
  //   .from('referral_usages')
  //   .select('created_at, reward_earned')
  //   .eq('referral_code', rewards.referralCode)
  //   .order('created_at', { ascending: false })
  //   .limit(10);

  return {
    referralCode: rewards.referralCode,
    totalReferrals: 5,
    totalEarned: rewards.totalEarned,
    availableCredits: rewards.availableCredits,
    recentReferrals: [
      { date: '2024-01-15', reward: 1000 },
      { date: '2024-01-10', reward: 1000 },
    ],
  };
}

/**
 * Stores referral code from URL in session (for landing page)
 * Client-side function
 */
export function storeReferralCodeInSession(code: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('referralCode', code.toUpperCase());
    // Also set a cookie for persistence
    document.cookie = `referralCode=${code.toUpperCase()}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
  }
}

/**
 * Gets stored referral code from session/cookie
 * Client-side function
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;

  // Check sessionStorage first
  const sessionCode = sessionStorage.getItem('referralCode');
  if (sessionCode) return sessionCode;

  // Fall back to cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'referralCode') return value;
  }

  return null;
}

/**
 * Clears stored referral code after use
 */
export function clearStoredReferralCode(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('referralCode');
    document.cookie = 'referralCode=; path=/; max-age=0';
  }
}
