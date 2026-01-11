// Occasion Reminder System
// Stores occasion dates and sends email reminders before anniversaries

import { nanoid } from 'nanoid';

export interface OccasionReminder {
  id: string;
  customerEmail: string;
  customerName: string;
  recipientName: string;
  occasion: string;
  occasionDate: Date;
  originalOrderId: string;
  isActive: boolean;
  createdAt: Date;
  lastReminderSent?: Date;
  nextReminderDate?: Date;
}

export interface ReminderNotification {
  id: string;
  reminderId: string;
  sentAt: Date;
  type: 'two_weeks' | 'one_week' | 'day_before';
  emailOpened: boolean;
  clicked: boolean;
}

// Configuration
export const REMINDER_CONFIG = {
  REMINDER_DAYS_BEFORE: [14, 7, 1], // 2 weeks, 1 week, 1 day before
  REPEAT_DISCOUNT_PERCENT: 15, // 15% discount for anniversary orders
  ENABLED_OCCASIONS: [
    'hochzeit',
    'geburtstag',
    'jahrestag',
    'muttertag',
    'vatertag',
    'valentinstag',
    'weihnachten',
    'jubilaeum',
  ],
};

/**
 * Checks if an occasion type supports reminders
 */
export function isReminderEligibleOccasion(occasion: string): boolean {
  const normalizedOccasion = occasion.toLowerCase().trim();
  return REMINDER_CONFIG.ENABLED_OCCASIONS.some(
    (enabled) =>
      normalizedOccasion.includes(enabled) || enabled.includes(normalizedOccasion)
  );
}

/**
 * Creates an occasion reminder for a customer
 */
export async function createOccasionReminder(data: {
  customerEmail: string;
  customerName: string;
  recipientName: string;
  occasion: string;
  occasionDate: Date;
  orderId: string;
}): Promise<OccasionReminder> {
  const reminder: OccasionReminder = {
    id: nanoid(),
    customerEmail: data.customerEmail,
    customerName: data.customerName,
    recipientName: data.recipientName,
    occasion: data.occasion,
    occasionDate: data.occasionDate,
    originalOrderId: data.orderId,
    isActive: true,
    createdAt: new Date(),
    nextReminderDate: calculateNextReminderDate(data.occasionDate),
  };

  // In production, store in database:
  // await supabase.from('occasion_reminders').insert(reminder);

  console.log('Created occasion reminder:', reminder);
  return reminder;
}

/**
 * Calculates the next reminder date for an occasion
 * Returns the first upcoming reminder date (14 days, 7 days, or 1 day before)
 */
export function calculateNextReminderDate(occasionDate: Date): Date {
  const now = new Date();
  const thisYearOccasion = new Date(occasionDate);
  thisYearOccasion.setFullYear(now.getFullYear());

  // If this year's date has passed, use next year
  if (thisYearOccasion < now) {
    thisYearOccasion.setFullYear(now.getFullYear() + 1);
  }

  // Find the earliest reminder date that's still in the future
  for (const daysBefore of REMINDER_CONFIG.REMINDER_DAYS_BEFORE) {
    const reminderDate = new Date(thisYearOccasion);
    reminderDate.setDate(reminderDate.getDate() - daysBefore);

    if (reminderDate > now) {
      return reminderDate;
    }
  }

  // If all reminders for this year have passed, schedule for next year
  const nextYearOccasion = new Date(thisYearOccasion);
  nextYearOccasion.setFullYear(nextYearOccasion.getFullYear() + 1);
  nextYearOccasion.setDate(
    nextYearOccasion.getDate() - REMINDER_CONFIG.REMINDER_DAYS_BEFORE[0]
  );

  return nextYearOccasion;
}

/**
 * Gets all reminders due for sending today
 */
export async function getDueReminders(): Promise<OccasionReminder[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // In production, fetch from database:
  // const { data } = await supabase
  //   .from('occasion_reminders')
  //   .select('*')
  //   .eq('is_active', true)
  //   .gte('next_reminder_date', today.toISOString())
  //   .lt('next_reminder_date', tomorrow.toISOString());

  console.log('Fetching due reminders for', today.toDateString());
  return [];
}

/**
 * Sends a reminder email to a customer
 */
export async function sendReminderEmail(reminder: OccasionReminder): Promise<boolean> {
  const daysUntilOccasion = getDaysUntilOccasion(reminder.occasionDate);
  const reminderType = getReminderType(daysUntilOccasion);

  // Generate one-click reorder link with discount
  const reorderLink = generateReorderLink(reminder);

  // In production:
  // const { sendEmail, occasionReminderTemplate } = await import('./email');
  // await sendEmail({
  //   to: reminder.customerEmail,
  //   subject: getEmailSubject(reminder, daysUntilOccasion),
  //   html: occasionReminderTemplate({
  //     customerName: reminder.customerName,
  //     recipientName: reminder.recipientName,
  //     occasion: reminder.occasion,
  //     daysUntil: daysUntilOccasion,
  //     discountPercent: REMINDER_CONFIG.REPEAT_DISCOUNT_PERCENT,
  //     reorderLink,
  //   }),
  // });

  console.log(
    `Sent ${reminderType} reminder to ${reminder.customerEmail} for ${reminder.recipientName}'s ${reminder.occasion}`
  );

  // Record the notification
  await recordReminderNotification(reminder.id, reminderType);

  // Update next reminder date
  await updateNextReminderDate(reminder);

  return true;
}

/**
 * Gets the number of days until an occasion (using this year's date)
 */
export function getDaysUntilOccasion(occasionDate: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const thisYearOccasion = new Date(occasionDate);
  thisYearOccasion.setFullYear(now.getFullYear());
  thisYearOccasion.setHours(0, 0, 0, 0);

  // If this year's date has passed, use next year
  if (thisYearOccasion < now) {
    thisYearOccasion.setFullYear(now.getFullYear() + 1);
  }

  const diffTime = thisYearOccasion.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Gets the reminder type based on days until occasion
 */
function getReminderType(daysUntil: number): 'two_weeks' | 'one_week' | 'day_before' {
  if (daysUntil >= 12) return 'two_weeks';
  if (daysUntil >= 5) return 'one_week';
  return 'day_before';
}

/**
 * Generates email subject line based on occasion and timing
 */
function getEmailSubject(reminder: OccasionReminder, daysUntil: number): string {
  const recipientName = reminder.recipientName;
  const occasion = reminder.occasion;

  if (daysUntil === 1) {
    return `Morgen ist ${recipientName}s ${occasion}! Noch ein Geschenk gesucht?`;
  }

  if (daysUntil <= 7) {
    return `In einer Woche: ${recipientName}s ${occasion} naht!`;
  }

  return `Der ${occasion} von ${recipientName} naht! Bereit fuer ein besonderes Geschenk?`;
}

/**
 * Generates a one-click reorder link with discount
 */
function generateReorderLink(reminder: OccasionReminder): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://melodiemacher.de';
  const params = new URLSearchParams({
    reorder: 'true',
    reminder_id: reminder.id,
    discount: REMINDER_CONFIG.REPEAT_DISCOUNT_PERCENT.toString(),
    recipient: reminder.recipientName,
    occasion: reminder.occasion,
  });

  return `${baseUrl}/bestellen?${params.toString()}`;
}

/**
 * Records that a reminder notification was sent
 */
async function recordReminderNotification(
  reminderId: string,
  type: 'two_weeks' | 'one_week' | 'day_before'
): Promise<void> {
  const notification: ReminderNotification = {
    id: nanoid(),
    reminderId,
    sentAt: new Date(),
    type,
    emailOpened: false,
    clicked: false,
  };

  // In production:
  // await supabase.from('reminder_notifications').insert(notification);

  console.log('Recorded notification:', notification);
}

/**
 * Updates the next reminder date after sending a reminder
 */
async function updateNextReminderDate(reminder: OccasionReminder): Promise<void> {
  const nextDate = calculateNextReminderDate(reminder.occasionDate);

  // In production:
  // await supabase
  //   .from('occasion_reminders')
  //   .update({
  //     last_reminder_sent: new Date().toISOString(),
  //     next_reminder_date: nextDate.toISOString(),
  //   })
  //   .eq('id', reminder.id);

  console.log(`Updated next reminder date to ${nextDate.toDateString()}`);
}

/**
 * Opts a customer into occasion reminders (called from song delivery page)
 */
export async function optInToReminder(data: {
  customerEmail: string;
  customerName: string;
  recipientName: string;
  occasion: string;
  occasionDate: string; // ISO date string
  orderId: string;
}): Promise<{ success: boolean; message: string }> {
  // Validate occasion date
  const parsedDate = new Date(data.occasionDate);
  if (isNaN(parsedDate.getTime())) {
    return { success: false, message: 'Ungueltiges Datum' };
  }

  // Check if occasion is eligible
  if (!isReminderEligibleOccasion(data.occasion)) {
    return {
      success: false,
      message: 'Fuer diesen Anlass sind keine Erinnerungen verfuegbar',
    };
  }

  // Check for existing reminder
  // In production:
  // const { data: existing } = await supabase
  //   .from('occasion_reminders')
  //   .select('id')
  //   .eq('customer_email', data.customerEmail)
  //   .eq('recipient_name', data.recipientName)
  //   .eq('occasion', data.occasion)
  //   .single();
  // if (existing) {
  //   return { success: false, message: 'Du hast bereits eine Erinnerung fuer diesen Anlass' };
  // }

  await createOccasionReminder({
    customerEmail: data.customerEmail,
    customerName: data.customerName,
    recipientName: data.recipientName,
    occasion: data.occasion,
    occasionDate: parsedDate,
    orderId: data.orderId,
  });

  return {
    success: true,
    message: `Wir erinnern dich rechtzeitig an ${data.recipientName}s ${data.occasion}!`,
  };
}

/**
 * Gets all active reminders for a customer
 */
export async function getCustomerReminders(
  customerEmail: string
): Promise<OccasionReminder[]> {
  // In production:
  // const { data } = await supabase
  //   .from('occasion_reminders')
  //   .select('*')
  //   .eq('customer_email', customerEmail)
  //   .eq('is_active', true)
  //   .order('occasion_date', { ascending: true });

  // Placeholder data
  return [
    {
      id: 'rem_1',
      customerEmail,
      customerName: 'Max',
      recipientName: 'Lisa',
      occasion: 'Hochzeitstag',
      occasionDate: new Date('2024-06-15'),
      originalOrderId: 'ord_123',
      isActive: true,
      createdAt: new Date('2023-06-15'),
      nextReminderDate: new Date('2024-06-01'),
    },
  ];
}

/**
 * Cancels an occasion reminder
 */
export async function cancelReminder(
  reminderId: string,
  customerEmail: string
): Promise<boolean> {
  // In production:
  // const { error } = await supabase
  //   .from('occasion_reminders')
  //   .update({ is_active: false })
  //   .eq('id', reminderId)
  //   .eq('customer_email', customerEmail);
  // return !error;

  console.log(`Cancelled reminder ${reminderId} for ${customerEmail}`);
  return true;
}

/**
 * Gets similar occasions for cross-sell suggestions
 */
export function getSimilarOccasions(occasion: string): string[] {
  const occasionGroups: Record<string, string[]> = {
    romantic: ['Hochzeit', 'Jahrestag', 'Valentinstag', 'Verlobung', 'Hochzeitstag'],
    family: ['Geburtstag', 'Muttertag', 'Vatertag', 'Weihnachten', 'Taufe'],
    celebration: ['Jubilaeum', 'Abschluss', 'Ruhestand', 'Befoerderung'],
  };

  const normalizedOccasion = occasion.toLowerCase();

  for (const [, occasions] of Object.entries(occasionGroups)) {
    if (occasions.some((o) => normalizedOccasion.includes(o.toLowerCase()))) {
      return occasions.filter(
        (o) => !normalizedOccasion.includes(o.toLowerCase())
      );
    }
  }

  // Default suggestions
  return ['Geburtstag', 'Jahrestag', 'Muttertag'];
}

/**
 * Cron job function to process daily reminders
 * Should be called by a scheduled job (e.g., Vercel Cron, Railway Cron)
 */
export async function processDailyReminders(): Promise<{
  sent: number;
  failed: number;
}> {
  const dueReminders = await getDueReminders();
  let sent = 0;
  let failed = 0;

  for (const reminder of dueReminders) {
    try {
      await sendReminderEmail(reminder);
      sent++;
    } catch (error) {
      console.error(`Failed to send reminder ${reminder.id}:`, error);
      failed++;
    }
  }

  console.log(`Daily reminders processed: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}
