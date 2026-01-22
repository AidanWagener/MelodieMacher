import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import { Resend } from 'resend';

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

interface BatchResult {
  success: { id: string; orderNumber: string }[];
  failed: { id: string; orderNumber: string; error: string }[];
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const { action, orderIds } = await request.json();

    if (!action || !orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({
        error: 'Action and orderIds array required'
      }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const results: BatchResult = { success: [], failed: [] };

    // Fetch all orders
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('*, deliverables(*)')
      .in('id', orderIds);

    if (fetchError || !orders) {
      return NextResponse.json({
        error: 'Failed to fetch orders'
      }, { status: 500 });
    }

    switch (action) {
      case 'update_status': {
        const { newStatus } = await request.json();

        for (const order of orders) {
          try {
            const { error } = await supabase
              .from('orders')
              .update({ status: newStatus, updated_at: new Date().toISOString() })
              .eq('id', order.id);

            if (error) throw error;
            results.success.push({ id: order.id, orderNumber: order.order_number });
          } catch (err) {
            results.failed.push({
              id: order.id,
              orderNumber: order.order_number,
              error: err instanceof Error ? err.message : 'Unknown error'
            });
          }
        }
        break;
      }

      case 'deliver_all': {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.melodiemacher.de';

        for (const order of orders) {
          try {
            // Check if order has required deliverables
            const deliverables = order.deliverables || [];
            const hasMP3 = deliverables.some((d: { type: string }) => d.type === 'mp3');

            if (!hasMP3) {
              results.failed.push({
                id: order.id,
                orderNumber: order.order_number,
                error: 'MP3 fehlt'
              });
              continue;
            }

            if (order.status === 'delivered') {
              results.failed.push({
                id: order.id,
                orderNumber: order.order_number,
                error: 'Bereits geliefert'
              });
              continue;
            }

            // Generate delivery URL
            const deliveryUrl = `${appUrl}/download/${order.order_number}`;

            // Update order status
            const { error: updateError } = await supabase
              .from('orders')
              .update({
                status: 'delivered',
                delivery_url: deliveryUrl,
                delivered_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', order.id);

            if (updateError) throw updateError;

            // Send delivery email
            await resend.emails.send({
              from: 'MelodieMacher <hallo@melodiemacher.de>',
              to: order.customer_email,
              subject: `Dein Song fuer ${order.recipient_name} ist fertig!`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h1 style="color: #1e3a5f;">Dein Song ist fertig!</h1>
                  <p>Hallo ${order.customer_name},</p>
                  <p>Großartige Neuigkeiten! Dein personalisierter Song fuer <strong>${order.recipient_name}</strong> ist bereit.</p>
                  <p style="margin: 30px 0;">
                    <a href="${deliveryUrl}" style="background-color: #1e3a5f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                      Song jetzt anhoeren & herunterladen
                    </a>
                  </p>
                  <p>Wir hoffen, dass dieser Song viel Freude bereitet!</p>
                  <p>Mit musikalischen Gruessen,<br>Dein MelodieMacher Team</p>
                </div>
              `
            });

            results.success.push({ id: order.id, orderNumber: order.order_number });
          } catch (err) {
            results.failed.push({
              id: order.id,
              orderNumber: order.order_number,
              error: err instanceof Error ? err.message : 'Unknown error'
            });
          }
        }
        break;
      }

      case 'set_in_production': {
        for (const order of orders) {
          try {
            if (order.status !== 'paid') {
              results.failed.push({
                id: order.id,
                orderNumber: order.order_number,
                error: 'Nur bezahlte Bestellungen koennen in Produktion gesetzt werden'
              });
              continue;
            }

            const { error } = await supabase
              .from('orders')
              .update({ status: 'in_production', updated_at: new Date().toISOString() })
              .eq('id', order.id);

            if (error) throw error;
            results.success.push({ id: order.id, orderNumber: order.order_number });
          } catch (err) {
            results.failed.push({
              id: order.id,
              orderNumber: order.order_number,
              error: err instanceof Error ? err.message : 'Unknown error'
            });
          }
        }
        break;
      }

      default:
        return NextResponse.json({
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

    return NextResponse.json({
      action,
      total: orderIds.length,
      successCount: results.success.length,
      failedCount: results.failed.length,
      ...results
    });

  } catch (error) {
    console.error('Batch operation error:', error);
    return NextResponse.json({
      error: 'Batch operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
