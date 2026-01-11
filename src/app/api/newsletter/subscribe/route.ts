import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source, discountCode } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Ungueltige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Add the email to your email marketing platform (e.g., Mailchimp, Klaviyo, Brevo)
    // 2. Create a segment for discount code recipients
    // 3. Send an automated email with the discount code
    // 4. Log the subscription for analytics

    // Example Mailchimp integration (commented out):
    // const mailchimpClient = new Mailchimp(process.env.MAILCHIMP_API_KEY);
    // await mailchimpClient.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
    //   email_address: email,
    //   status: 'subscribed',
    //   merge_fields: {
    //     SOURCE: source,
    //     DISCOUNT: discountCode,
    //   },
    //   tags: ['downsell', 'discount-recipient'],
    // });

    // Example Brevo/Sendinblue integration (commented out):
    // const brevoClient = new Brevo.ContactsApi();
    // await brevoClient.createContact({
    //   email: email,
    //   listIds: [parseInt(process.env.BREVO_LIST_ID)],
    //   attributes: {
    //     SOURCE: source,
    //     DISCOUNT_CODE: discountCode,
    //   },
    // });

    // For now, just log it
    console.log('[Newsletter] New subscription:', {
      email,
      source,
      discountCode,
      timestamp: new Date().toISOString(),
    });

    // Generate a unique subscriber ID for tracking
    const subscriberId = `SUB-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      subscriberId,
      message: 'Erfolgreich angemeldet',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}
