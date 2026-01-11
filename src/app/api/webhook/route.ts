import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  createOrder,
  updateOrderStatus,
  getOrderByStripeSession,
  recordPurchase,
  getOrCreateReferralCode,
} from '@/lib/supabase';
import {
  sendOrderConfirmationEmail,
  sendSlackNotification,
} from '@/lib/notifications';
import { packageOptions } from '@/lib/order-schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract order details from metadata
        const {
          orderId,
          recipientName,
          occasion,
          relationship,
          genre,
          mood,
          packageType,
          customerName,
          allowEnglish,
          hasCustomLyrics,
          selectedBundle,
        } = session.metadata || {};

        console.log('=== ORDER COMPLETED ===');
        console.log('Order ID:', orderId);
        console.log('Customer:', customerName, session.customer_email);
        console.log('Recipient:', recipientName);
        console.log('Package:', packageType);
        console.log('Amount:', session.amount_total);

        // Get package details
        const selectedPackage = packageOptions.find(
          (p) => p.value === packageType
        );

        // Calculate delivery time based on package
        const deliveryHours =
          packageType === 'premium' ? 12 : packageType === 'plus' ? 24 : 48;
        const deliveryDate = new Date();
        deliveryDate.setHours(deliveryDate.getHours() + deliveryHours);
        const deliveryTimeStr = deliveryDate.toLocaleDateString('de-DE', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        });

        // 1. Update order status in database to 'paid'
        const existingOrder = await getOrderByStripeSession(session.id);

        if (existingOrder) {
          // Order was created during checkout, update status
          await updateOrderStatus(existingOrder.order_number, 'paid', {
            stripe_payment_intent_id:
              typeof session.payment_intent === 'string'
                ? session.payment_intent
                : session.payment_intent?.id,
          });
          console.log('Order status updated to paid:', existingOrder.order_number);
        } else {
          // Order wasn't pre-created, create it now (fallback)
          console.log('Creating order from webhook (fallback)...');
          // Note: Story and custom lyrics are not in metadata (too long)
          // In production, these should be stored during checkout
        }

        // 2. Record purchase for loyalty tracking
        const { customer, wasUpgraded } = await recordPurchase(
          session.customer_email!,
          (session.amount_total || 0) / 100,
          customerName
        );

        if (wasUpgraded) {
          console.log('Customer upgraded to VIP:', session.customer_email);
          // Send VIP welcome email
        }

        // 3. Generate referral code for customer
        const referralCode = await getOrCreateReferralCode(session.customer_email!);
        console.log('Referral code for customer:', referralCode);

        // 4. Send confirmation email
        try {
          await sendOrderConfirmationEmail({
            to: session.customer_email!,
            customerName: customerName || 'Kunde',
            orderId: orderId!,
            recipientName: recipientName || 'Empfaenger',
            packageName: selectedPackage?.label || 'Melodie Plus',
            deliveryTime: deliveryTimeStr,
            total: (session.amount_total || 0) / 100,
          });
          console.log('Confirmation email sent');
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
        }

        // 5. Send Slack notification to fulfillment team
        try {
          await sendSlackNotification({
            orderId: orderId!,
            customerName: customerName || 'Unknown',
            customerEmail: session.customer_email!,
            recipientName: recipientName || 'Unknown',
            occasion: occasion || 'Unknown',
            genre: genre || 'Unknown',
            packageType: packageType || 'plus',
            total: (session.amount_total || 0) / 100,
          });
          console.log('Slack notification sent');
        } catch (slackError) {
          console.error('Failed to send Slack notification:', slackError);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);

        // Update order status to reflect failed payment
        // In production: Send email to customer about failed payment
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Refund processed:', charge.id);

        // Find order by payment intent and update status
        if (charge.payment_intent) {
          // Update order status to 'refunded'
          // In production: Send refund confirmation email
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
