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

const moodLabels = ['Melancholisch', 'Sanft', 'Ausgeglichen', 'Froehlich', 'Energetisch'];

const occasionLabels: Record<string, string> = {
  hochzeit: 'Hochzeit',
  geburtstag: 'Geburtstag',
  jubilaeum: 'Jubilaeum',
  firma: 'Firmenfeier',
  taufe: 'Taufe',
  andere: 'Besonderer Anlass',
};

const genreLabels: Record<string, string> = {
  pop: 'Pop',
  rock: 'Rock',
  schlager: 'Schlager',
  akustik: 'Akustik/Folk',
  hiphop: 'Hip-Hop',
  klassik: 'Klassisch',
  kinder: 'Kinderlied',
  electronic: 'Electronic',
  jazz: 'Jazz',
  volksmusik: 'Volksmusik',
};

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API not configured' }, { status: 500 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Build the prompt for Gemini
    const genai = new GoogleGenerativeAI(apiKey.trim());
    const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Du bist ein Experte fuer das Erstellen von Suno AI Musik-Prompts. Deine Aufgabe ist es, einen optimalen Prompt zu generieren, der zu einem emotionalen, personalisierten Song fuehrt.

Kundenbestellung:
- Empfaenger: ${order.recipient_name}
- Anlass: ${occasionLabels[order.occasion] || order.occasion}
- Beziehung zum Empfaenger: ${order.relationship}
- Genre: ${genreLabels[order.genre] || order.genre}
- Stimmung: ${order.mood}/5 (${moodLabels[order.mood - 1]})
- Sprache: ${order.allow_english ? 'Deutsch oder Englisch erlaubt' : 'Nur Deutsch'}

Geschichte/Hintergrund:
${order.story}

${order.has_custom_lyrics && order.custom_lyrics ? `Eigene Lyrics-Ideen vom Kunden:
${order.custom_lyrics}` : ''}

Generiere:
1. SUNO_PROMPT: Einen detaillierten Prompt fuer Suno (80-120 Woerter) der den Song-Stil, Instrumentierung, Gesangsstil und Gefuehl beschreibt. Der Prompt sollte auf Englisch sein (Suno versteht Englisch besser), aber die Lyrics sollen ${order.allow_english ? 'Deutsch oder Englisch' : 'auf Deutsch'} sein.

2. TAGS: 6-8 Suno-Tags auf Englisch (z.B. "acoustic, heartfelt, female vocals, emotional ballad")

3. MOOD_DESCRIPTION: Eine kurze Beschreibung der gewuenschten Stimmung auf Deutsch (1 Satz)

4. LYRICS_OUTLINE: Eine kurze Struktur fuer die Lyrics auf Deutsch:
   - Vers 1 Thema
   - Refrain Thema
   - Vers 2 Thema
   - Bridge/Outro Thema

Antworte NUR mit validem JSON in diesem Format:
{
  "sunoPrompt": "...",
  "suggestedTags": ["tag1", "tag2", ...],
  "moodDescription": "...",
  "lyricsOutline": {
    "verse1": "...",
    "chorus": "...",
    "verse2": "...",
    "bridge": "..."
  }
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    let parsedResponse;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                        text.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, text];
      const jsonString = jsonMatch[1] || text;
      parsedResponse = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return NextResponse.json({
        error: 'Failed to parse AI response',
        rawResponse: text
      }, { status: 500 });
    }

    // Store the generated prompt with the order (optional - for history)
    // Note: This may fail if generated_prompt column doesn't exist - that's OK
    try {
      await supabase
        .from('orders')
        .update({
          generated_prompt: parsedResponse.sunoPrompt,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
    } catch {
      // Column may not exist - continue anyway
    }

    return NextResponse.json({
      sunoPrompt: parsedResponse.sunoPrompt,
      suggestedTags: parsedResponse.suggestedTags || [],
      moodDescription: parsedResponse.moodDescription || '',
      lyricsOutline: parsedResponse.lyricsOutline || null,
      orderNumber: order.order_number,
      recipientName: order.recipient_name
    });

  } catch (error) {
    console.error('Prompt generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate prompt',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
