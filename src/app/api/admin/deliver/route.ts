import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase not configured');
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();
    const { orderNumber } = await request.json();

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number required' }, { status: 400 });
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get deliverables
    const { data: deliverables } = await supabase
      .from('deliverables')
      .select('*')
      .eq('order_id', order.id);

    if (!deliverables || deliverables.length === 0) {
      return NextResponse.json({ error: 'No deliverables found' }, { status: 400 });
    }

    // Find main MP3 deliverable for download URL
    const mp3 = deliverables.find(d => d.type === 'mp3');
    if (!mp3) {
      return NextResponse.json({ error: 'MP3 deliverable required' }, { status: 400 });
    }

    // Get or create referral code for customer
    let referralCode = null;
    try {
      const { getOrCreateReferralCode } = await import('@/lib/supabase');
      referralCode = await getOrCreateReferralCode(order.customer_email);
    } catch (e) {
      console.warn('Could not get referral code:', e);
    }

    // Build delivery URL (could be a page with all downloads)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.melodiemacher.de';
    const deliveryUrl = `${baseUrl}/download/${order.order_number}`;

    // Send delivery email
    if (process.env.RESEND_API_KEY) {
      try {
        const { sendSongDeliveryEmail } = await import('@/lib/notifications');

        const songTitle = `Song fuer ${order.recipient_name}`;

        await sendSongDeliveryEmail({
          to: order.customer_email,
          customerName: order.customer_name,
          recipientName: order.recipient_name,
          songTitle: songTitle,
          downloadUrl: mp3.file_url,
          orderId: order.order_number,
          referralCode: referralCode || undefined,
          referralLink: referralCode ? `${baseUrl}/?ref=${referralCode}` : undefined,
        });

        console.log('Delivery email sent to:', order.customer_email);
      } catch (emailError) {
        console.error('Failed to send delivery email:', emailError);
        // Continue with delivery even if email fails
      }
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'delivered',
        delivery_url: deliveryUrl,
        delivered_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('order_number', orderNumber);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    // Send Slack notification about delivery
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `✅ Song geliefert: ${orderNumber}`,
                  emoji: true,
                },
              },
              {
                type: 'section',
                fields: [
                  { type: 'mrkdwn', text: `*Kunde:*\n${order.customer_name}` },
                  { type: 'mrkdwn', text: `*Fuer:*\n${order.recipient_name}` },
                ],
              },
            ],
          }),
        });
      } catch (slackError) {
        console.warn('Slack notification failed:', slackError);
      }
    }

    return NextResponse.json({
      success: true,
      deliveryUrl,
      emailSent: !!process.env.RESEND_API_KEY,
    });
  } catch (error) {
    console.error('Delivery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
