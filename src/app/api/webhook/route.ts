import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { packageOptions } from '@/lib/order-schema';

// Lazy Stripe initialization to prevent build-time errors
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

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
          genre,
          packageType,
          customerName,
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

        // Database operations (dynamic import to avoid build-time errors)
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
          try {
            const {
              updateOrderStatus,
              getOrderByStripeSession,
              recordPurchase,
              getOrCreateReferralCode,
            } = await import('@/lib/supabase');

            // 1. Update order status in database to 'paid'
            const existingOrder = await getOrderByStripeSession(session.id);

            if (existingOrder) {
              await updateOrderStatus(existingOrder.order_number, 'paid', {
                stripe_payment_intent_id:
                  typeof session.payment_intent === 'string'
                    ? session.payment_intent
                    : session.payment_intent?.id,
              });
              console.log('Order status updated to paid:', existingOrder.order_number);
            } else {
              console.log('Order not found in database, webhook received before checkout completed');
            }

            // 2. Record purchase for loyalty tracking
            const { wasUpgraded } = await recordPurchase(
              session.customer_email!,
              (session.amount_total || 0) / 100,
              customerName
            );

            if (wasUpgraded) {
              console.log('Customer upgraded to VIP:', session.customer_email);
            }

            // 3. Generate referral code for customer
            const referralCode = await getOrCreateReferralCode(session.customer_email!);
            console.log('Referral code for customer:', referralCode);
          } catch (dbError) {
            console.error('Database operations failed:', dbError);
          }
        }

        // Email notifications (dynamic import)
        if (process.env.RESEND_API_KEY) {
          try {
            const { sendOrderConfirmationEmail } = await import('@/lib/notifications');
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
        }

        // Slack notification (dynamic import)
        if (process.env.SLACK_WEBHOOK_URL) {
          try {
            const { sendSlackNotification } = await import('@/lib/notifications');
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
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Refund processed:', charge.id);
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
