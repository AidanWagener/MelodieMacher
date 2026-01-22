import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { OCCASION_LABELS, PRIORITY_THRESHOLDS } from '@/lib/constants';
import { parseAIJsonResponse } from '@/lib/ai-utils';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface PriorityAnalysis {
  priority: 'urgent' | 'high' | 'normal' | 'low';
  reasons: string[];
  suggestedDeadline: string | null;
  urgentPhrases: string[];
}

interface AnalysisResult {
  orderId: string;
  orderNumber: string;
  analysis: PriorityAnalysis;
}

const DEFAULT_ANALYSIS: PriorityAnalysis = {
  priority: 'normal',
  reasons: ['Automatische Analyse nicht möglich'],
  suggestedDeadline: null,
  urgentPhrases: []
};

/**
 * Core priority analysis logic - shared between POST and GET
 */
async function analyzeOrderPriorities(orderIds: string[]): Promise<AnalysisResult[]> {
  const supabase = getSupabaseAdmin();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API not configured');
  }

  const genai = new GoogleGenerativeAI(apiKey.trim());
  const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Fetch orders
  const { data: orders, error: fetchError } = await supabase
    .from('orders')
    .select('*')
    .in('id', orderIds);

  if (fetchError || !orders) {
    throw new Error('Failed to fetch orders');
  }

  const analyses: AnalysisResult[] = [];

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
      deadline.setHours(deadline.getHours() + PRIORITY_THRESHOLDS.RUSH_DEADLINE_HOURS);

      const analysis: PriorityAnalysis = {
        priority: 'high',
        reasons: ['Rush-Lieferung gebucht'],
        suggestedDeadline: deadline.toISOString(),
        urgentPhrases: []
      };

      analyses.push({
        orderId: order.id,
        orderNumber: order.order_number,
        analysis
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
- Anlass: ${OCCASION_LABELS[order.occasion] || order.occasion}
- Geschichte: ${order.story}
- Erstellt vor: ${orderAge} Stunden
- Rush gebucht: Nein

Suche nach:
1. Zeitangaben wie "morgen", "übermorgen", "in X Tagen", "am [Datum]", "diese Woche", "nächste Woche"
2. Dringlichkeitswörter wie "dringend", "schnell", "eilig", "bitte beeilen"
3. Eventdaten die bald sind (Geburtstag am..., Hochzeit am...)
4. Emotionale Dringlichkeit (letzte Chance, Überraschung muss rechtzeitig da sein)

Bewerte die Priorität:
- "urgent": Konkretes Datum in den nächsten 2-3 Tagen genannt ODER sehr dringende Sprache
- "high": Datum in nächster Woche ODER moderater Zeitdruck
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

      // Safe JSON parsing with validation
      let analysis = parseAIJsonResponse<PriorityAnalysis>(text, DEFAULT_ANALYSIS);

      // Boost priority if order is old
      if (orderAge > PRIORITY_THRESHOLDS.BOOST_TO_URGENT_HOURS) {
        analysis = {
          ...analysis,
          priority: 'urgent',
          reasons: [...analysis.reasons, `Bestellung seit ${orderAge}h offen - ÜBERFÄLLIG`]
        };
      } else if (orderAge > PRIORITY_THRESHOLDS.BOOST_TO_HIGH_HOURS && analysis.priority === 'normal') {
        analysis = {
          ...analysis,
          priority: 'high',
          reasons: [...analysis.reasons, `Bestellung seit ${orderAge}h offen`]
        };
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
        analysis: DEFAULT_ANALYSIS
      });
    }
  }

  return analyses;
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

    const analyses = await analyzeOrderPriorities(orderIds);

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
export async function GET() {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get all orders that need priority analysis
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

    // Directly call the shared function instead of self-fetch
    const orderIds = orders.map(o => o.id);
    const analyses = await analyzeOrderPriorities(orderIds);

    return NextResponse.json({
      analyzed: analyses.length,
      analyses
    });

  } catch (error) {
    console.error('Auto-priority analysis error:', error);
    return NextResponse.json({
      error: 'Analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
