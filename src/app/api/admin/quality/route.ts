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

interface QualityScore {
  overall: number; // 0-100
  categories: {
    completeness: number;
    packageMatch: number;
    fileQuality: number;
    customerFit: number;
  };
  issues: string[];
  recommendations: string[];
  readyToDeliver: boolean;
}

// POST - Score order quality before delivery
export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch order with deliverables
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, deliverables(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const deliverables = order.deliverables || [];
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Determine required deliverables based on package
    const requiredDeliverables = {
      mp3: true,
      pdf: order.package_type !== 'basis',
      png: order.package_type !== 'basis',
      mp4: order.package_type === 'premium',
      wav: order.package_type === 'premium' || order.bump_karaoke,
    };

    // Score: Completeness (0-100)
    const requiredCount = Object.values(requiredDeliverables).filter(Boolean).length;
    const presentCount = Object.entries(requiredDeliverables)
      .filter(([type, required]) => required && deliverables.some((d: { type: string }) => d.type === type))
      .length;
    const completenessScore = Math.round((presentCount / requiredCount) * 100);

    if (completenessScore < 100) {
      const missing = Object.entries(requiredDeliverables)
        .filter(([type, required]) => required && !deliverables.some((d: { type: string }) => d.type === type))
        .map(([type]) => type.toUpperCase());
      issues.push(`Fehlende Deliverables: ${missing.join(', ')}`);
    }

    // Score: Package Match (0-100)
    let packageMatchScore = 100;
    const packageLabels: Record<string, string> = {
      basis: 'Basis (nur MP3)',
      plus: 'Plus (MP3 + Cover + PDF)',
      premium: 'Premium (alles inkl. Video + Instrumental)'
    };

    if (order.package_type === 'premium') {
      if (!deliverables.some((d: { type: string }) => d.type === 'mp4')) {
        packageMatchScore -= 25;
        recommendations.push('Premium-Paket: Video (MP4) hinzufuegen');
      }
      if (!deliverables.some((d: { type: string }) => d.type === 'wav')) {
        packageMatchScore -= 25;
        recommendations.push('Premium-Paket: Instrumental (WAV) hinzufuegen');
      }
    }

    if (order.bump_karaoke && !deliverables.some((d: { type: string }) => d.type === 'wav')) {
      packageMatchScore -= 30;
      issues.push('Karaoke-Upgrade gebucht aber WAV fehlt');
    }

    // Score: File Quality (basic checks)
    let fileQualityScore = 100;
    const mp3 = deliverables.find((d: { type: string }) => d.type === 'mp3');
    const png = deliverables.find((d: { type: string }) => d.type === 'png');

    if (mp3 && !mp3.file_url) {
      fileQualityScore -= 50;
      issues.push('MP3 URL ungueltig');
    }

    if (png && !png.file_url) {
      fileQualityScore -= 25;
      issues.push('Cover URL ungueltig');
    }

    // Score: Customer Fit (AI-powered analysis)
    let customerFitScore = 80; // Default if AI unavailable

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && mp3) {
      try {
        const genai = new GoogleGenerativeAI(apiKey.trim());
        const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Bewerte wie gut diese Bestellung zum Kunden passt (0-100):

Bestellung:
- Anlass: ${occasionLabels[order.occasion] || order.occasion}
- Empfaenger: ${order.recipient_name}
- Genre gewuenscht: ${order.genre}
- Stimmung: ${order.mood}/5
- Geschichte: ${order.story?.substring(0, 500) || 'Keine'}

Geliefert:
- MP3 vorhanden: Ja
- Cover vorhanden: ${png ? 'Ja' : 'Nein'}
- Deliverables: ${deliverables.length}

Antworte NUR mit JSON:
{
  "score": 85,
  "reasoning": "kurze Begruendung",
  "suggestions": ["verbesserung1", "verbesserung2"]
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          customerFitScore = Math.min(100, Math.max(0, analysis.score || 80));
          if (analysis.suggestions) {
            recommendations.push(...analysis.suggestions.slice(0, 3));
          }
        }
      } catch (err) {
        console.error('AI quality analysis failed:', err);
        // Use default score
      }
    }

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      (completenessScore * 0.4) +
      (packageMatchScore * 0.25) +
      (fileQualityScore * 0.2) +
      (customerFitScore * 0.15)
    );

    // Determine if ready to deliver
    const readyToDeliver = completenessScore === 100 && fileQualityScore >= 80 && issues.length === 0;

    if (!readyToDeliver && issues.length === 0) {
      issues.push('Qualitaetspruefung nicht bestanden');
    }

    const qualityScore: QualityScore = {
      overall: overallScore,
      categories: {
        completeness: completenessScore,
        packageMatch: packageMatchScore,
        fileQuality: fileQualityScore,
        customerFit: customerFitScore,
      },
      issues,
      recommendations: recommendations.slice(0, 5),
      readyToDeliver,
    };

    // Save quality score to order
    await supabase
      .from('orders')
      .update({
        quality_score: overallScore,
        quality_details: qualityScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return NextResponse.json({
      orderId,
      orderNumber: order.order_number,
      packageType: order.package_type,
      qualityScore,
      deliverables: deliverables.map((d: { type: string; file_name: string }) => ({
        type: d.type,
        fileName: d.file_name
      })),
    });

  } catch (error) {
    console.error('Quality scoring error:', error);
    return NextResponse.json({
      error: 'Quality scoring failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET - Get quality scores for all orders in review
export async function GET() {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, order_number, quality_score, quality_details, status, package_type')
      .in('status', ['in_production', 'quality_review'])
      .order('created_at', { ascending: false });

    if (error) {
      // quality_score column might not exist
      if (error.message.includes('column')) {
        return NextResponse.json({
          orders: [],
          message: 'quality_score column not found. Run migration to add it.'
        });
      }
      throw error;
    }

    const scored = orders?.filter(o => o.quality_score !== null) || [];
    const unscored = orders?.filter(o => o.quality_score === null) || [];

    return NextResponse.json({
      total: orders?.length || 0,
      scored: scored.length,
      unscored: unscored.length,
      averageScore: scored.length > 0
        ? Math.round(scored.reduce((sum, o) => sum + (o.quality_score || 0), 0) / scored.length)
        : null,
      orders: orders?.map(o => ({
        id: o.id,
        orderNumber: o.order_number,
        status: o.status,
        packageType: o.package_type,
        qualityScore: o.quality_score,
        readyToDeliver: o.quality_details?.readyToDeliver || false,
      })) || [],
    });

  } catch (error) {
    console.error('Quality fetch error:', error);
    return NextResponse.json({
      error: 'Failed to fetch quality scores',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
