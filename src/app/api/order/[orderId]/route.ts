import { NextRequest, NextResponse } from 'next/server';

// Status display mapping
const statusLabels: Record<string, { label: string; description: string; progress: number }> = {
  pending: {
    label: 'Ausstehend',
    description: 'Warte auf Zahlungsbestaetigung',
    progress: 10,
  },
  paid: {
    label: 'Bezahlt',
    description: 'Zahlung eingegangen - Song wird bald erstellt',
    progress: 25,
  },
  in_production: {
    label: 'In Produktion',
    description: 'Dein Song wird gerade komponiert',
    progress: 50,
  },
  quality_review: {
    label: 'Qualitaetspruefung',
    description: 'Dein Song wird geprueft und finalisiert',
    progress: 75,
  },
  delivered: {
    label: 'Geliefert',
    description: 'Dein Song wurde erfolgreich zugestellt',
    progress: 100,
  },
  refunded: {
    label: 'Erstattet',
    description: 'Diese Bestellung wurde erstattet',
    progress: 0,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Dynamic import to avoid build-time errors
    const { getOrderByNumber, getDeliverablesByOrderId } = await import('@/lib/supabase');

    // Fetch order from database
    const order = await getOrderByNumber(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Bestellung nicht gefunden' },
        { status: 404 }
      );
    }

    // Get deliverables if order is delivered
    let deliverables: Array<{
      type: string;
      file_name: string;
      file_url: string;
    }> = [];

    if (order.status === 'delivered' && order.delivery_url) {
      const files = await getDeliverablesByOrderId(order.id);
      deliverables = files.map((f) => ({
        type: f.type,
        file_name: f.file_name,
        file_url: f.file_url,
      }));
    }

    // Get status info
    const statusInfo = statusLabels[order.status] || statusLabels.pending;

    // Calculate estimated delivery time
    const orderDate = new Date(order.created_at);
    const deliveryHours =
      order.package_type === 'premium' ? 12 :
      order.package_type === 'plus' ? 24 : 48;

    // If rush upgrade, reduce by 50%
    const actualDeliveryHours = order.bump_rush ? Math.floor(deliveryHours / 2) : deliveryHours;
    const estimatedDelivery = new Date(orderDate.getTime() + actualDeliveryHours * 60 * 60 * 1000);

    // Return sanitized order data (no sensitive info)
    return NextResponse.json({
      order: {
        order_number: order.order_number,
        status: order.status,
        status_label: statusInfo.label,
        status_description: statusInfo.description,
        progress: statusInfo.progress,
        recipient_name: order.recipient_name,
        occasion: order.occasion,
        genre: order.genre,
        package_type: order.package_type,
        bump_karaoke: order.bump_karaoke,
        bump_rush: order.bump_rush,
        bump_gift: order.bump_gift,
        has_custom_lyrics: order.has_custom_lyrics,
        created_at: order.created_at,
        delivered_at: order.delivered_at,
        estimated_delivery: estimatedDelivery.toISOString(),
      },
      deliverables: deliverables.length > 0 ? deliverables : null,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
