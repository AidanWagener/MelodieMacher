import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

interface PriorityAnalysis {
  priority: 'urgent' | 'high' | 'normal' | 'low';
  reasons: string[];
  suggestedDeadline: string | null;
  urgentPhrases: string[];
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const { orderIds } = await request.json();

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: 'orderIds array required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API not configured' }, { status: 500 });
    }

    const supabase = getSupabaseAdmin();
    const genai = new GoogleGenerativeAI(apiKey.trim());
    const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Fetch orders
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .in('id', orderIds);

    if (fetchError || !orders) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    const analyses: { orderId: string; orderNumber: string; analysis: PriorityAnalysis }[] = [];

    for (const order of orders) {
      // Skip already delivered/refunded orders
      if (['delivered', 'refunded'].includes(order.status)) {
        analyses.push({
          orderId: order.id,
          orderNumber: order.order_number,
          analysis: {
            priority: 'low',
            reasons: ['Bestellung bereits abgeschlossen'],
            suggestedDeadline: null,
            urgentPhrases: []
          }
        });
        continue;
      }

      // If rush is purchased, automatically high priority
      if (order.bump_rush) {
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + 12);

        analyses.push({
          orderId: order.id,
          orderNumber: order.order_number,
          analysis: {
            priority: 'high',
            reasons: ['Rush-Lieferung gebucht'],
            suggestedDeadline: deadline.toISOString(),
            urgentPhrases: []
          }
        });

        // Update in database
        await supabase
          .from('orders')
          .update({
            priority: 'high',
            priority_reasons: ['Rush-Lieferung gebucht'],
            suggested_deadline: deadline.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);

        continue;
      }

      // Use AI to analyze urgency
      const orderAge = Math.floor((Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60));

      const prompt = `Analysiere diese Bestellung auf Dringlichkeit.

Bestelldetails:
- Anlass: ${occasionLabels[order.occasion] || order.occasion}
- Geschichte: ${order.story}
- Erstellt vor: ${orderAge} Stunden
- Rush gebucht: Nein

Suche nach:
1. Zeitangaben wie "morgen", "uebermorgen", "in X Tagen", "am [Datum]", "diese Woche", "naechste Woche"
2. Dringlichkeitswoerter wie "dringend", "schnell", "eilig", "bitte beeilen"
3. Eventdaten die bald sind (Geburtstag am..., Hochzeit am...)
4. Emotionale Dringlichkeit (letzte Chance, Ueberraschung muss rechtzeitig da sein)

Bewerte die Prioritaet:
- "urgent": Konkretes Datum in den naechsten 2-3 Tagen genannt ODER sehr dringende Sprache
- "high": Datum in naechster Woche ODER moderater Zeitdruck
- "normal": Keine besonderen Zeitangaben
- "low": Explizit gesagt dass Zeit keine Rolle spielt

Antworte NUR mit validem JSON:
{
  "priority": "urgent|high|normal|low",
  "reasons": ["Grund 1", "Grund 2"],
  "suggestedDeadline": "ISO-Datum oder null",
  "urgentPhrases": ["gefundene dringende Phrasen"]
}`;

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Parse JSON
        let analysis: PriorityAnalysis;
        try {
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                            text.match(/```\s*([\s\S]*?)\s*```/) ||
                            [null, text];
          const jsonString = jsonMatch[1] || text;
          analysis = JSON.parse(jsonString.trim());
        } catch {
          // Default to normal if parsing fails
          analysis = {
            priority: 'normal',
            reasons: ['Automatische Analyse nicht moeglich'],
            suggestedDeadline: null,
            urgentPhrases: []
          };
        }

        // Boost priority if order is old
        if (orderAge > 48 && analysis.priority === 'normal') {
          analysis.priority = 'high';
          analysis.reasons.push(`Bestellung seit ${orderAge}h offen`);
        } else if (orderAge > 72) {
          analysis.priority = 'urgent';
          analysis.reasons.push(`Bestellung seit ${orderAge}h offen - UEBERFAELLIG`);
        }

        analyses.push({
          orderId: order.id,
          orderNumber: order.order_number,
          analysis
        });

        // Update in database
        await supabase
          .from('orders')
          .update({
            priority: analysis.priority,
            priority_reasons: analysis.reasons,
            suggested_deadline: analysis.suggestedDeadline,
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);

      } catch (aiError) {
        console.error('AI analysis failed for order:', order.id, aiError);
        analyses.push({
          orderId: order.id,
          orderNumber: order.order_number,
          analysis: {
            priority: 'normal',
            reasons: ['Analyse fehlgeschlagen'],
            suggestedDeadline: null,
            urgentPhrases: []
          }
        });
      }
    }

    return NextResponse.json({
      analyzed: analyses.length,
      analyses
    });

  } catch (error) {
    console.error('Priority analysis error:', error);
    return NextResponse.json({
      error: 'Priority analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to analyze all pending orders
export async function GET(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get all orders that need priority analysis (paid, in_production, quality_review)
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id')
      .in('status', ['paid', 'in_production', 'quality_review'])
      .is('priority', null);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: 'No orders need analysis', analyzed: 0 });
    }

    // Redirect to POST with the order IDs
    const orderIds = orders.map(o => o.id);

    // Call POST internally
    const response = await fetch(request.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify({ orderIds })
    });

    return response;

  } catch (error) {
    console.error('Auto-priority analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
