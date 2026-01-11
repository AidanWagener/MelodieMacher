import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to prevent build-time errors when env vars aren't set
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  }
  return url;
}

// Server-side client with service role (for admin operations)
function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
    }
    _supabaseAdmin = createClient(getSupabaseUrl(), serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabaseAdmin;
}

// ============================================
// DATABASE TYPES
// ============================================

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'in_production' | 'quality_review' | 'delivered' | 'refunded';
  customer_email: string;
  customer_name: string;
  recipient_name: string;
  occasion: string;
  relationship: string;
  story: string;
  genre: string;
  mood: number;
  allow_english: boolean;
  package_type: string;
  selected_bundle: string;
  bump_karaoke: boolean;
  bump_rush: boolean;
  bump_gift: boolean;
  has_custom_lyrics: boolean;
  custom_lyrics: string | null;
  base_price: number;
  total_price: number;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  delivery_url: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deliverable {
  id: string;
  order_id: string;
  type: 'mp3' | 'mp4' | 'pdf' | 'png' | 'wav';
  file_url: string;
  file_name: string;
  created_at: string;
}

export interface CustomerLoyalty {
  id: string;
  email: string;
  name: string | null;
  tier: 'standard' | 'vip';
  purchase_count: number;
  total_spent: number;
  first_purchase_date: string;
  last_purchase_date: string;
  vip_since: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralCode {
  id: string;
  code: string;
  created_by_email: string;
  usage_count: number;
  total_earned: number;
  is_active: boolean;
  created_at: string;
}

export interface ReferralUsage {
  id: string;
  referral_code: string;
  used_by_email: string;
  order_id: string;
  discount_applied: number;
  reward_earned: number;
  created_at: string;
}

export interface OccasionReminder {
  id: string;
  customer_email: string;
  recipient_name: string;
  occasion_type: string;
  occasion_date: string;
  next_reminder_date: string;
  is_active: boolean;
  created_at: string;
}

// ============================================
// ORDER OPERATIONS
// ============================================

export async function createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return null;
  }

  return data;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: Order['status'],
  additionalData?: Partial<Order>
): Promise<Order | null> {
  const updateData = {
    status,
    updated_at: new Date().toISOString(),
    ...additionalData,
  };

  const { data, error } = await getSupabaseAdmin()
    .from('orders')
    .update(updateData)
    .eq('order_number', orderNumber)
    .select()
    .single();

  if (error) {
    console.error('Error updating order:', error);
    return null;
  }

  return data;
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

export async function getOrderByStripeSession(sessionId: string): Promise<Order | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('orders')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single();

  if (error) {
    console.error('Error fetching order by session:', error);
    return null;
  }

  return data;
}

// ============================================
// DELIVERABLE OPERATIONS
// ============================================

export async function addDeliverable(deliverable: Omit<Deliverable, 'id' | 'created_at'>): Promise<Deliverable | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('deliverables')
    .insert(deliverable)
    .select()
    .single();

  if (error) {
    console.error('Error adding deliverable:', error);
    return null;
  }

  return data;
}

export async function getDeliverablesByOrderId(orderId: string): Promise<Deliverable[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('deliverables')
    .select('*')
    .eq('order_id', orderId);

  if (error) {
    console.error('Error fetching deliverables:', error);
    return [];
  }

  return data || [];
}

// ============================================
// CUSTOMER LOYALTY OPERATIONS
// ============================================

export async function getOrCreateCustomerLoyalty(email: string, name?: string): Promise<CustomerLoyalty | null> {
  // Check if customer exists
  const { data: existing } = await getSupabaseAdmin()
    .from('customer_loyalty')
    .select('*')
    .eq('email', email)
    .single();

  if (existing) {
    return existing;
  }

  // Create new customer
  const { data, error } = await getSupabaseAdmin()
    .from('customer_loyalty')
    .insert({
      email,
      name: name || null,
      tier: 'standard',
      purchase_count: 0,
      total_spent: 0,
      first_purchase_date: new Date().toISOString(),
      last_purchase_date: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating customer loyalty:', error);
    return null;
  }

  return data;
}

export async function recordPurchase(
  email: string,
  amount: number,
  name?: string
): Promise<{ customer: CustomerLoyalty | null; wasUpgraded: boolean }> {
  const customer = await getOrCreateCustomerLoyalty(email, name);

  if (!customer) {
    return { customer: null, wasUpgraded: false };
  }

  const newPurchaseCount = customer.purchase_count + 1;
  const newTotalSpent = customer.total_spent + amount;
  const wasStandard = customer.tier === 'standard';
  const shouldUpgrade = newPurchaseCount >= 2 && wasStandard;

  const updateData: Partial<CustomerLoyalty> = {
    purchase_count: newPurchaseCount,
    total_spent: newTotalSpent,
    last_purchase_date: new Date().toISOString(),
  };

  if (shouldUpgrade) {
    updateData.tier = 'vip';
    updateData.vip_since = new Date().toISOString();
  }

  const { data, error } = await getSupabaseAdmin()
    .from('customer_loyalty')
    .update(updateData)
    .eq('email', email)
    .select()
    .single();

  if (error) {
    console.error('Error recording purchase:', error);
    return { customer: null, wasUpgraded: false };
  }

  return { customer: data, wasUpgraded: shouldUpgrade };
}

// ============================================
// REFERRAL OPERATIONS
// ============================================

export async function getOrCreateReferralCode(email: string): Promise<string | null> {
  // Check if code exists
  const { data: existing } = await getSupabaseAdmin()
    .from('referral_codes')
    .select('code')
    .eq('created_by_email', email)
    .single();

  if (existing) {
    return existing.code;
  }

  // Generate new code
  const code = `FREUND-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const { error } = await getSupabaseAdmin()
    .from('referral_codes')
    .insert({
      code,
      created_by_email: email,
      usage_count: 0,
      total_earned: 0,
      is_active: true,
    });

  if (error) {
    console.error('Error creating referral code:', error);
    return null;
  }

  return code;
}

export async function validateReferralCode(code: string): Promise<{ isValid: boolean; referrerEmail?: string }> {
  const { data, error } = await getSupabaseAdmin()
    .from('referral_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return { isValid: false };
  }

  if (data.usage_count >= 100) {
    return { isValid: false };
  }

  return { isValid: true, referrerEmail: data.created_by_email };
}

export async function recordReferralUsage(
  code: string,
  usedByEmail: string,
  orderId: string,
  discountApplied: number
): Promise<boolean> {
  const rewardAmount = 10; // 10 EUR reward for referrer

  // Record the usage
  const { error: usageError } = await getSupabaseAdmin()
    .from('referral_usages')
    .insert({
      referral_code: code.toUpperCase(),
      used_by_email: usedByEmail,
      order_id: orderId,
      discount_applied: discountApplied,
      reward_earned: rewardAmount,
    });

  if (usageError) {
    console.error('Error recording referral usage:', usageError);
    return false;
  }

  // Update referral code stats - first get current values, then increment
  const { data: currentCode } = await getSupabaseAdmin()
    .from('referral_codes')
    .select('usage_count, total_earned')
    .eq('code', code.toUpperCase())
    .single();

  if (currentCode) {
    const { error: updateError } = await getSupabaseAdmin()
      .from('referral_codes')
      .update({
        usage_count: (currentCode.usage_count || 0) + 1,
        total_earned: (currentCode.total_earned || 0) + rewardAmount,
      })
      .eq('code', code.toUpperCase());

    if (updateError) {
      console.error('Error updating referral code:', updateError);
    }
  }

  return true;
}

// ============================================
// OCCASION REMINDER OPERATIONS
// ============================================

export async function createOccasionReminder(
  email: string,
  recipientName: string,
  occasionType: string,
  occasionDate: string
): Promise<boolean> {
  // Calculate next reminder date (14 days before occasion)
  const occasionDateObj = new Date(occasionDate);
  const reminderDate = new Date(occasionDateObj);
  reminderDate.setDate(reminderDate.getDate() - 14);

  const { error } = await getSupabaseAdmin()
    .from('occasion_reminders')
    .insert({
      customer_email: email,
      recipient_name: recipientName,
      occasion_type: occasionType,
      occasion_date: occasionDate,
      next_reminder_date: reminderDate.toISOString(),
      is_active: true,
    });

  if (error) {
    console.error('Error creating reminder:', error);
    return false;
  }

  return true;
}

export async function getDueReminders(): Promise<OccasionReminder[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await getSupabaseAdmin()
    .from('occasion_reminders')
    .select('*')
    .eq('is_active', true)
    .lte('next_reminder_date', today);

  if (error) {
    console.error('Error fetching due reminders:', error);
    return [];
  }

  return data || [];
}
