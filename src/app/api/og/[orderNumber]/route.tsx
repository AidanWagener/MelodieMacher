import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

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

const occasionLabels: Record<string, string> = {
  hochzeit: 'Hochzeit',
  geburtstag: 'Geburtstag',
  jubilaeum: 'Jubilaeum',
  firma: 'Firmenfeier',
  taufe: 'Taufe',
  andere: 'Besonderer Anlass',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const supabase = getSupabaseAdmin();
    const orderNumber = params.orderNumber;

    // Fetch order
    const { data: order, error } = await supabase
      .from('orders')
      .select('order_number, recipient_name, occasion, customer_name, genre')
      .eq('order_number', orderNumber)
      .eq('status', 'delivered')
      .single();

    if (error || !order) {
      // Return a default OG image for not found
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
              color: 'white',
              fontFamily: 'sans-serif',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 20 }}>🎵</div>
            <div style={{ fontSize: 36, fontWeight: 'bold' }}>MelodieMacher</div>
            <div style={{ fontSize: 20, opacity: 0.8, marginTop: 10 }}>
              Personalisierte Songs mit Herz
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    // Fetch cover image if exists
    const { data: fullOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('order_number', orderNumber)
      .single();

    let coverUrl: string | null = null;
    if (fullOrder) {
      const { data: coverDeliverable } = await supabase
        .from('deliverables')
        .select('file_url')
        .eq('order_id', fullOrder.id)
        .eq('type', 'png')
        .single();

      if (coverDeliverable) {
        coverUrl = coverDeliverable.file_url;
      }
    }

    const occasionText = occasionLabels[order.occasion] || order.occasion;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
            padding: 60,
            fontFamily: 'sans-serif',
          }}
        >
          {/* Left side - Album Art */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 400,
              height: 400,
              borderRadius: 24,
              background: coverUrl
                ? 'transparent'
                : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 120,
                }}
              >
                🎵
              </div>
            )}
          </div>

          {/* Right side - Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginLeft: 60,
              flex: 1,
              color: 'white',
            }}
          >
            <div
              style={{
                fontSize: 24,
                opacity: 0.8,
                marginBottom: 8,
              }}
            >
              Ein personalisierter Song fuer
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                marginBottom: 16,
                lineHeight: 1.1,
              }}
            >
              {order.recipient_name}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 8,
                  fontSize: 20,
                }}
              >
                {occasionText}
              </div>
            </div>

            {/* Logo / Branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #d4af37 100%)',
                  marginRight: 16,
                  fontSize: 24,
                }}
              >
                🎵
              </div>
              <div style={{ fontSize: 28, fontWeight: 'bold' }}>MelodieMacher</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);

    // Return fallback image on error
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>🎵</div>
          <div style={{ fontSize: 36, fontWeight: 'bold' }}>MelodieMacher</div>
          <div style={{ fontSize: 20, opacity: 0.8, marginTop: 10 }}>
            Personalisierte Songs mit Herz
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
