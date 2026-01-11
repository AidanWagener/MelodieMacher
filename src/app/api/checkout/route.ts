import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { orderSchema, calculateTotal, packageOptions, bundleOptions, CUSTOM_LYRICS_PRICE } from '@/lib/order-schema';
import { createOrder } from '@/lib/supabase';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the order data
    const validationResult = orderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Ungueltige Bestelldaten', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const orderData = validationResult.data;

    // ============================================
    // SERVER-SIDE PRICE VERIFICATION
    // ============================================
    // Recalculate total on server to prevent price manipulation
    const serverCalculatedTotal = calculateTotal(orderData);

    // If client sent a different total, reject the request
    if (body.clientTotal && Math.abs(body.clientTotal - serverCalculatedTotal) > 0.01) {
      console.error('Price mismatch detected!', {
        clientTotal: body.clientTotal,
        serverTotal: serverCalculatedTotal,
        orderData,
      });
      return NextResponse.json(
        { error: 'Preis wurde manipuliert. Bitte Seite neu laden.' },
        { status: 400 }
      );
    }

    const total = serverCalculatedTotal;
    const selectedPackage = packageOptions.find((p) => p.value === orderData.packageType);
    const selectedBundle = orderData.selectedBundle !== 'none'
      ? bundleOptions.find((b) => b.id === orderData.selectedBundle)
      : null;

    // Build line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Check if Hochzeits-Bundle is selected (includes Plus package)
    if (orderData.selectedBundle === 'hochzeits-bundle') {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Hochzeits-Bundle',
            description: 'Melodie Plus + Geschenk-Paket + Karaoke-Version (Spare 14 Euro)',
          },
          unit_amount: 9900, // 99 EUR in cents
        },
        quantity: 1,
      });

      // Add Rush if selected separately with Hochzeits-Bundle
      if (orderData.bumpRush) {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Rush-Upgrade',
              description: 'Priorisierte Bearbeitung',
            },
            unit_amount: 2900, // 29 EUR in cents
          },
          quantity: 1,
        });
      }
    } else {
      // Standard package
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: selectedPackage?.label || 'Personalisierter Song',
            description: `Song fuer ${orderData.recipientName} - ${orderData.occasion}`,
          },
          unit_amount: (selectedPackage?.price || 79) * 100, // Convert to cents
        },
        quantity: 1,
      });

      // Check if Perfekt-Bundle is selected (all 3 bumps)
      if (orderData.selectedBundle === 'perfekt-bundle') {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Perfekt-Bundle',
              description: 'Karaoke + Rush + Geschenk-Paket (Spare 14 Euro)',
            },
            unit_amount: 4900, // 49 EUR in cents
          },
          quantity: 1,
        });
      } else {
        // Add individual bumps as line items
        if (orderData.bumpKaraoke) {
          lineItems.push({
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Karaoke-Version',
                description: 'Instrumental mit Lyrics zum Mitsingen',
              },
              unit_amount: 1900, // 19 EUR in cents
            },
            quantity: 1,
          });
        }

        if (orderData.bumpRush) {
          lineItems.push({
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Rush-Upgrade',
                description: 'Priorisierte Bearbeitung',
              },
              unit_amount: 2900, // 29 EUR in cents
            },
            quantity: 1,
          });
        }

        if (orderData.bumpGift) {
          lineItems.push({
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Geschenk-Paket',
                description: 'Digitale Geschenkkarte + Ueberraschungs-Reveal-Seite',
              },
              unit_amount: 1500, // 15 EUR in cents
            },
            quantity: 1,
          });
        }
      }
    }

    // Add custom lyrics if provided
    if (orderData.hasCustomLyrics && orderData.customLyrics && orderData.customLyrics.trim().length > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Eigene Lyrics',
            description: 'Professionelle Vertonung deiner eigenen Texte',
          },
          unit_amount: CUSTOM_LYRICS_PRICE * 100, // 89 EUR in cents
        },
        quantity: 1,
      });
    }

    // Generate order ID
    const orderId = `MM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'klarna'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/danke?session_id={CHECKOUT_SESSION_ID}&order=${orderId}&package=${orderData.packageType}&recipient=${encodeURIComponent(orderData.recipientName)}&value=${total}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/bestellen`,
      customer_email: orderData.customerEmail,
      metadata: {
        orderId,
        recipientName: orderData.recipientName,
        occasion: orderData.occasion,
        relationship: orderData.relationship,
        genre: orderData.genre,
        mood: orderData.mood.toString(),
        packageType: orderData.packageType,
        customerName: orderData.customerName,
        allowEnglish: orderData.allowEnglish ? 'true' : 'false',
        hasCustomLyrics: orderData.hasCustomLyrics ? 'true' : 'false',
        selectedBundle: orderData.selectedBundle || 'none',
        // UTM parameters for attribution
        ...body.utm,
      },
      locale: 'de',
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: false,
      },
    });

    // ============================================
    // STORE ORDER IN DATABASE
    // ============================================
    try {
      const basePrice = selectedPackage?.price || 79;

      await createOrder({
        order_number: orderId,
        status: 'pending',
        customer_email: orderData.customerEmail,
        customer_name: orderData.customerName,
        recipient_name: orderData.recipientName,
        occasion: orderData.occasion,
        relationship: orderData.relationship,
        story: orderData.story,
        genre: orderData.genre,
        mood: orderData.mood,
        allow_english: orderData.allowEnglish,
        package_type: orderData.packageType,
        selected_bundle: orderData.selectedBundle,
        bump_karaoke: orderData.bumpKaraoke,
        bump_rush: orderData.bumpRush,
        bump_gift: orderData.bumpGift,
        has_custom_lyrics: orderData.hasCustomLyrics,
        custom_lyrics: orderData.customLyrics || null,
        base_price: basePrice,
        total_price: total,
        stripe_session_id: session.id,
        stripe_payment_intent_id: null,
        delivery_url: null,
        delivered_at: null,
      });

      console.log('Order stored in database:', orderId);
    } catch (dbError) {
      // Log but don't fail - order will be created from webhook if this fails
      console.error('Failed to store order in database:', dbError);
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId,
      total, // Return server-calculated total
    });
  } catch (error) {
    console.error('Checkout error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: 'Zahlungsfehler: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.' },
      { status: 500 }
    );
  }
}
