import { Resend } from 'resend';
import { orderConfirmationTemplate, songDeliveryTemplate, songDeliveryWithReferralTemplate } from './email';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Slack webhook URL (optional)
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

// ============================================
// EMAIL NOTIFICATIONS
// ============================================

interface OrderConfirmationEmailData {
  to: string;
  customerName: string;
  orderId: string;
  recipientName: string;
  packageName: string;
  deliveryTime: string;
  total: number;
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationEmailData): Promise<boolean> {
  if (!resend) {
    console.log('[DEV] Would send order confirmation email:', data);
    return true;
  }

  try {
    const html = orderConfirmationTemplate({
      customerName: data.customerName,
      orderId: data.orderId,
      recipientName: data.recipientName,
      packageName: data.packageName,
      deliveryTime: data.deliveryTime,
      total: data.total,
    });

    const result = await resend.emails.send({
      from: 'MelodieMacher <hallo@melodiemacher.de>',
      to: data.to,
      subject: `Bestellbestaetigung - Dein Song fuer ${data.recipientName} (${data.orderId})`,
      html,
    });

    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

interface SongDeliveryEmailData {
  to: string;
  customerName: string;
  recipientName: string;
  songTitle: string;
  downloadUrl: string;
  orderId: string;
  referralCode?: string;
  referralLink?: string;
}

export async function sendSongDeliveryEmail(data: SongDeliveryEmailData): Promise<boolean> {
  if (!resend) {
    console.log('[DEV] Would send song delivery email:', data);
    return true;
  }

  try {
    let html: string;

    if (data.referralCode && data.referralLink) {
      html = songDeliveryWithReferralTemplate({
        customerName: data.customerName,
        recipientName: data.recipientName,
        songTitle: data.songTitle,
        downloadUrl: data.downloadUrl,
        orderId: data.orderId,
        referralCode: data.referralCode,
        referralLink: data.referralLink,
        referralDiscountAmount: 10,
      });
    } else {
      html = songDeliveryTemplate({
        customerName: data.customerName,
        recipientName: data.recipientName,
        songTitle: data.songTitle,
        downloadUrl: data.downloadUrl,
        orderId: data.orderId,
      });
    }

    const result = await resend.emails.send({
      from: 'MelodieMacher <hallo@melodiemacher.de>',
      to: data.to,
      subject: `🎉 Dein Song ist fertig! - ${data.songTitle}`,
      html,
    });

    console.log('Delivery email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send delivery email:', error);
    return false;
  }
}

// ============================================
// SLACK NOTIFICATIONS
// ============================================

interface SlackOrderNotification {
  orderId: string;
  customerName: string;
  customerEmail: string;
  recipientName: string;
  occasion: string;
  genre: string;
  packageType: string;
  total: number;
}

export async function sendSlackNotification(data: SlackOrderNotification): Promise<boolean> {
  if (!slackWebhookUrl) {
    console.log('[DEV] Would send Slack notification:', data);
    return true;
  }

  try {
    const packageEmoji = {
      basis: '📦',
      plus: '⭐',
      premium: '👑',
    }[data.packageType] || '📦';

    const message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${packageEmoji} Neue Bestellung! ${data.orderId}`,
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Kunde:*\n${data.customerName}`,
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${data.customerEmail}`,
            },
            {
              type: 'mrkdwn',
              text: `*Fuer:*\n${data.recipientName}`,
            },
            {
              type: 'mrkdwn',
              text: `*Anlass:*\n${data.occasion}`,
            },
            {
              type: 'mrkdwn',
              text: `*Genre:*\n${data.genre}`,
            },
            {
              type: 'mrkdwn',
              text: `*Paket:*\n${data.packageType.toUpperCase()}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Betrag:* €${data.total.toFixed(2)}`,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Bestellung ansehen',
                emoji: true,
              },
              url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${data.orderId}`,
              style: 'primary',
            },
          ],
        },
      ],
    };

    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.status}`);
    }

    console.log('Slack notification sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    return false;
  }
}

// ============================================
// GENERIC EMAIL SEND FUNCTION
// ============================================

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!resend) {
    console.log('[DEV] Would send email:', {
      to: options.to,
      subject: options.subject,
    });
    return true;
  }

  try {
    const result = await resend.emails.send({
      from: 'MelodieMacher <hallo@melodiemacher.de>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log('Email sent:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
