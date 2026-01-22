import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyCronAuth } from '@/lib/cron-auth';

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

interface AnniversaryOrder {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  recipient_name: string;
  occasion: string;
  delivered_at: string;
  daysUntilAnniversary: number;
  detectedDate?: string;
}

// GET - Find orders with upcoming anniversaries and send reminders
export async function GET(request: NextRequest) {
  const auth = verifyCronAuth(request);
  if (!auth.authorized) {
    return auth.error;
  }

  try {
    const supabase = getSupabaseAdmin();
    const resendKey = process.env.RESEND_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.melodiemacher.de';

    // Find orders delivered approximately 1 year ago (350-365 days)
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    const anniversaryWindowStart = new Date();
    anniversaryWindowStart.setDate(anniversaryWindowStart.getDate() - 380);

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'delivered')
      .gte('delivered_at', anniversaryWindowStart.toISOString())
      .lte('delivered_at', oneYearAgo.toISOString())
      .is('anniversary_reminder_sent', null);

    if (error) {
      // Column might not exist
      if (error.message.includes('column')) {
        return NextResponse.json({
          processed: 0,
          message: 'anniversary_reminder_sent column not found. Add it to orders table.'
        });
      }
      throw error;
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        processed: 0,
        message: 'No anniversary orders found'
      });
    }

    const results = {
      processed: 0,
      sent: 0,
      skipped: 0,
      errors: [] as string[],
    };

    const anniversaryOrders: AnniversaryOrder[] = [];

    for (const order of orders) {
      results.processed++;

      const deliveredAt = new Date(order.delivered_at);
      const nextAnniversary = new Date(deliveredAt);
      nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);

      const now = new Date();
      const daysUntil = Math.ceil((nextAnniversary.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Only process if anniversary is within 14 days
      if (daysUntil > 14 || daysUntil < 0) {
        results.skipped++;
        continue;
      }

      anniversaryOrders.push({
        id: order.id,
        order_number: order.order_number,
        customer_email: order.customer_email,
        customer_name: order.customer_name,
        recipient_name: order.recipient_name,
        occasion: order.occasion,
        delivered_at: order.delivered_at,
        daysUntilAnniversary: daysUntil,
      });

      // Send reminder email
      if (resendKey) {
        try {
          const resend = new Resend(resendKey);
          const occasionText = occasionLabels[order.occasion] || order.occasion;

          await resend.emails.send({
            from: 'MelodieMacher <hallo@melodiemacher.de>',
            to: order.customer_email,
            subject: `Bald ist wieder ${occasionText} - Zeit fuer einen neuen Song?`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #1e3a5f;">${occasionText} steht bevor!</h1>
                <p>Hallo ${order.customer_name},</p>
                <p>Vor einem Jahr hast du einen wunderschoenen Song fuer <strong>${order.recipient_name}</strong> bestellt.</p>
                <p>Die Zeit vergeht wie im Flug! ${daysUntil === 0 ? 'Heute' : `In ${daysUntil} Tagen`} jaehrt sich der besondere Anlass.</p>
                <p>Ueberrasche wieder mit einem neuen, einzigartigen Song!</p>
                <p style="margin: 30px 0;">
                  <a href="${appUrl}/bestellen?ref=anniversary&occasion=${order.occasion}" style="background-color: #1e3a5f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Neuen Song bestellen
                  </a>
                </p>
                <p style="color: #666; font-size: 14px;">
                  Als treuer Kunde erhaeltst du <strong>10% Rabatt</strong> mit dem Code: <strong>ANNIVERSARY10</strong>
                </p>
                <p>Mit musikalischen Gruessen,<br>Dein MelodieMacher Team</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                  Du erhaeltst diese E-Mail, weil du vor einem Jahr einen Song bei uns bestellt hast.
                  <a href="${appUrl}/unsubscribe?email=${encodeURIComponent(order.customer_email)}" style="color: #999;">Abmelden</a>
                </p>
              </div>
            `
          });

          // Mark as sent
          await supabase
            .from('orders')
            .update({ anniversary_reminder_sent: new Date().toISOString() })
            .eq('id', order.id);

          results.sent++;
        } catch (err) {
          results.errors.push(`${order.order_number}: ${err instanceof Error ? err.message : 'Send failed'}`);
        }
      } else {
        results.skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      anniversaryOrders: anniversaryOrders.slice(0, 10), // Return first 10 for debugging
    });

  } catch (error) {
    console.error('Anniversary cron error:', error);
    return NextResponse.json({
      error: 'Anniversary processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Detect anniversary dates from order stories using AI
export async function POST(request: NextRequest) {
  const auth = verifyCronAuth(request);
  if (!auth.authorized) {
    return auth.error;
  }

  try {
    const supabase = getSupabaseAdmin();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API not configured' }, { status: 500 });
    }

    // Get delivered orders without detected anniversary date
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, occasion, story, recipient_name, delivered_at')
      .eq('status', 'delivered')
      .is('detected_anniversary_date', null)
      .limit(20);

    if (error) {
      if (error.message.includes('column')) {
        return NextResponse.json({
          processed: 0,
          message: 'detected_anniversary_date column not found'
        });
      }
      throw error;
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ processed: 0, message: 'No orders to analyze' });
    }

    const genai = new GoogleGenerativeAI(apiKey.trim());
    const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const results = {
      processed: 0,
      detected: 0,
      errors: [] as string[],
    };

    for (const order of orders) {
      results.processed++;

      try {
        const prompt = `Analysiere diese Geschichte und finde das genaue Datum des Anlasses:

Anlass: ${occasionLabels[order.occasion] || order.occasion}
Empfaenger: ${order.recipient_name}
Geschichte: ${order.story?.substring(0, 1000) || 'Keine Geschichte verfuegbar'}

Suche nach:
- Konkrete Datumsangaben (z.B. "am 15. Mai", "am 3.7.")
- Relative Angaben die ein Datum implizieren
- Hochzeitsdatum, Geburtstag, Jahrestag

Antworte NUR mit JSON:
{
  "dateFound": true/false,
  "date": "YYYY-MM-DD" oder null,
  "confidence": "high/medium/low",
  "source": "wo im Text gefunden"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);

          if (analysis.dateFound && analysis.date && analysis.confidence !== 'low') {
            await supabase
              .from('orders')
              .update({
                detected_anniversary_date: analysis.date,
                anniversary_detection_source: analysis.source,
                updated_at: new Date().toISOString()
              })
              .eq('id', order.id);

            results.detected++;
          } else {
            // Mark as analyzed but no date found
            await supabase
              .from('orders')
              .update({
                detected_anniversary_date: 'none',
                updated_at: new Date().toISOString()
              })
              .eq('id', order.id);
          }
        }
      } catch (err) {
        results.errors.push(`${order.order_number}: ${err instanceof Error ? err.message : 'Analysis failed'}`);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });

  } catch (error) {
    console.error('Anniversary detection error:', error);
    return NextResponse.json({
      error: 'Detection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
