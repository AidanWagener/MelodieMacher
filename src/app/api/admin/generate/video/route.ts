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

interface VideoAssets {
  mp3Url: string | null;
  coverUrl: string | null;
  lyrics: string | null;
  songTitle: string;
  occasion: string;
  recipientName: string;
}

interface VideoInstructions {
  canvaSteps: string[];
  capcutSteps: string[];
  recommendedFormat: string;
  suggestedStyle: string;
  colorPalette: string[];
  fontSuggestion: string;
  animationTips: string[];
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();
    const { orderId, lyrics } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    // Get order with deliverables
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, deliverables(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Gather assets
    const mp3 = order.deliverables?.find((d: { type: string }) => d.type === 'mp3');
    const cover = order.deliverables?.find((d: { type: string }) => d.type === 'png');

    const assets: VideoAssets = {
      mp3Url: mp3?.file_url || null,
      coverUrl: cover?.file_url || null,
      lyrics: lyrics || null,
      songTitle: `Song fuer ${order.recipient_name}`,
      occasion: occasionLabels[order.occasion] || order.occasion,
      recipientName: order.recipient_name,
    };

    // Check if MP3 exists
    if (!assets.mp3Url) {
      return NextResponse.json({
        error: 'MP3 erforderlich',
        message: 'Bitte zuerst eine MP3-Datei hochladen'
      }, { status: 400 });
    }

    // Generate AI-powered video suggestions
    let aiSuggestions = null;
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genai = new GoogleGenerativeAI(apiKey.trim());
        const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Erstelle Vorschlaege fuer ein emotionales Lyric-Video:
Song: ${assets.songTitle}
Anlass: ${assets.occasion}
Empfaenger: ${assets.recipientName}
Genre: ${order.genre}

Antworte mit JSON:
{
  "visualStyle": "beschreibe den visuellen Stil in 2-3 Saetzen",
  "colorPalette": ["hex1", "hex2", "hex3", "hex4"],
  "fontStyle": "schriftart-empfehlung mit Begruendung",
  "animationStyle": "animations-beschreibung",
  "backgroundIdea": "hintergrund-idee",
  "moodKeywords": ["keyword1", "keyword2", "keyword3"]
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiSuggestions = JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.error('AI suggestions failed:', err);
      }
    }

    // Build instructions
    const instructions: VideoInstructions = {
      canvaSteps: [
        '1. Oeffne canva.com/create/videos',
        '2. Waehle "Video" Format (empfohlen: 1080x1080 fuer Social Media oder 1920x1080 fuer YouTube)',
        '3. Lade das Album Cover als Hintergrund hoch',
        '4. Fuege die MP3 als Audio-Track hinzu',
        '5. Aktiviere "Auto Captions" unter Audio-Einstellungen',
        '6. Waehle eine passende Schriftart',
        '7. Passe die Farben an (Text sollte gut lesbar sein)',
        '8. Exportiere als MP4 (1080p empfohlen)',
      ],
      capcutSteps: [
        '1. Importiere die MP3 und das Cover in CapCut',
        '2. Erstelle ein neues Projekt (1:1 oder 16:9)',
        '3. Setze das Cover als Hintergrundbild',
        '4. Fuege die Audio-Datei hinzu',
        '5. Nutze "Auto Captions" fuer automatische Untertitel',
        '6. Waehle einen Animationsstil fuer die Lyrics',
        '7. Fuege sanfte Uebergaenge hinzu',
        '8. Exportiere in 1080p',
      ],
      recommendedFormat: '1080x1080 (Instagram/TikTok) oder 1920x1080 (YouTube)',
      suggestedStyle: aiSuggestions?.visualStyle || 'Elegant und emotional, passend zum Anlass',
      colorPalette: aiSuggestions?.colorPalette || ['#1e3a5f', '#d4af37', '#ffffff', '#f5f5f5'],
      fontSuggestion: aiSuggestions?.fontStyle || 'Elegante Serifenschrift fuer Titel, klare Sans-Serif fuer Lyrics',
      animationTips: [
        'Sanfte Fade-Ins fuer jede Textzeile',
        'Subtile Zoom-Effekte auf dem Hintergrundbild',
        'Lyrics sollten synchron zur Musik erscheinen',
        'Vermeide zu schnelle oder ablenkende Animationen',
        aiSuggestions?.animationStyle || '',
      ].filter(Boolean),
    };

    // Video generation options for future implementation
    const videoOptions = {
      remotion: {
        description: 'Self-hosted React video rendering',
        setup: 'Requires Remotion Lambda or dedicated render server',
        quality: 'Highest',
        cost: 'Low (after setup)',
      },
      creatomate: {
        description: 'API-based video generation',
        setup: 'Simple API integration',
        quality: 'High',
        cost: '~$0.10-0.50 per video',
      },
      shotstack: {
        description: 'Cloud video editing API',
        setup: 'Simple API integration',
        quality: 'High',
        cost: '~$0.05-0.20 per video',
      },
    };

    // Build clipboard-ready text
    const clipboardText = `LYRIC VIDEO - ${assets.songTitle}
===============================
Anlass: ${assets.occasion}

ASSETS:
- MP3: ${assets.mp3Url}
- Cover: ${assets.coverUrl || 'Nicht verfuegbar'}

STYLE-EMPFEHLUNGEN:
- Farben: ${instructions.colorPalette.join(', ')}
- Schrift: ${instructions.fontSuggestion}
- Stil: ${instructions.suggestedStyle}

QUICK LINKS:
- Canva: https://www.canva.com/create/videos
- CapCut: https://www.capcut.com`;

    // Build response
    const videoPackage = {
      success: true,
      assets,
      instructions,
      aiSuggestions,
      quickLinks: {
        canva: 'https://www.canva.com/create/videos',
        capcut: 'https://www.capcut.com',
        mp3Download: assets.mp3Url,
        coverDownload: assets.coverUrl,
      },
      clipboardText,
      futureOptions: videoOptions,
      note: 'Automatische Video-Generierung kommt bald. Nutze aktuell Canva oder CapCut.',
    };

    return NextResponse.json(videoPackage);

  } catch (error) {
    console.error('Video preparation error:', error);
    return NextResponse.json({
      error: 'Video preparation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
