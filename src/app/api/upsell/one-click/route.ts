import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, orderId, upsellType, amount } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID erforderlich' },
        { status: 400 }
      );
    }

    // Retrieve the original checkout session to get the payment method
    const originalSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    });

    if (!originalSession.payment_intent) {
      return NextResponse.json(
        { error: 'Keine Zahlungsinformationen gefunden' },
        { status: 400 }
      );
    }

    const paymentIntent = originalSession.payment_intent as Stripe.PaymentIntent;

    // Get the payment method from the original payment
    const paymentMethodId = paymentIntent.payment_method as string;

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Keine Zahlungsmethode gefunden. Bitte bestellen Sie normal.' },
        { status: 400 }
      );
    }

    // Create or get customer
    let customerId = originalSession.customer as string;

    if (!customerId) {
      // Create a new customer if one doesn't exist
      const customer = await stripe.customers.create({
        email: originalSession.customer_email || undefined,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      customerId = customer.id;
    } else {
      // Attach the payment method to the existing customer
      try {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });
      } catch (error) {
        // Payment method might already be attached
        console.log('Payment method attachment:', error);
      }
    }

    // Generate upsell order ID
    const upsellOrderId = `MM-UP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Create a new payment intent for the upsell
    const upsellPaymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents (3900 = 39 EUR)
      currency: 'eur',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      description: 'MelodieMacher - Zweiter Song (50% Rabatt)',
      metadata: {
        upsellOrderId,
        originalOrderId: orderId || 'unknown',
        upsellType,
        discount: '50%',
      },
    });

    if (upsellPaymentIntent.status === 'succeeded') {
      // In production, you would:
      // 1. Create a new order in your database
      // 2. Link it to the original order
      // 3. Send confirmation email
      // 4. Trigger song creation workflow

      return NextResponse.json({
        success: true,
        upsellOrderId,
        paymentIntentId: upsellPaymentIntent.id,
        message: 'Upsell erfolgreich verarbeitet',
      });
    } else if (upsellPaymentIntent.status === 'requires_action') {
      // 3D Secure or other authentication required
      return NextResponse.json(
        { error: 'Zusaetzliche Authentifizierung erforderlich. Bitte bestellen Sie normal.' },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: 'Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('One-click upsell error:', error);

    if (error instanceof Stripe.errors.StripeCardError) {
      return NextResponse.json(
        { error: 'Kartenzahlung abgelehnt: ' + error.message },
        { status: 400 }
      );
    }

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: 'Zahlungsfehler: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}
