import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';

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

const genreStyles: Record<string, string> = {
  pop: 'modern, vibrant colors, clean design, contemporary',
  rock: 'bold, dynamic, electric energy, dramatic lighting',
  schlager: 'warm, festive, traditional German aesthetic, cheerful',
  akustik: 'natural, earthy tones, intimate, acoustic guitar vibes',
  hiphop: 'urban, bold typography style, street art influence',
  klassik: 'elegant, orchestral, timeless, sophisticated',
  kinder: 'playful, colorful, whimsical, child-friendly illustrations',
  electronic: 'futuristic, neon colors, abstract patterns, digital',
  jazz: 'smooth, sophisticated, vintage feel, warm tones',
  volksmusik: 'traditional, pastoral, Alpine scenery, folk elements',
};

const occasionStyles: Record<string, string> = {
  hochzeit: 'romantic, elegant, wedding theme, soft golden light, love symbols, two hearts',
  geburtstag: 'celebratory, balloons, confetti, joyful, festive',
  jubilaeum: 'commemorative, milestone celebration, golden accents, timeless',
  firma: 'professional, corporate, modern, achievement, success',
  taufe: 'gentle, pure, spiritual, soft pastels, angelic, peaceful',
  andere: 'heartfelt, personal, emotional, meaningful, touching',
};

const moodDescriptors: Record<number, string> = {
  1: 'melancholic, reflective, soft, muted colors, contemplative',
  2: 'gentle, warm, tender, subtle, peaceful',
  3: 'balanced, heartfelt, sincere, natural, harmonious',
  4: 'upbeat, joyful, bright, optimistic, cheerful',
  5: 'energetic, triumphant, vibrant, powerful, exhilarating',
};

async function generateWithImagen(prompt: string, apiKey: string): Promise<Buffer> {
  // Google Imagen 3 API endpoint
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [
        {
          prompt: prompt,
        },
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: '1:1',
        safetyFilterLevel: 'block_few',
        personGeneration: 'dont_allow',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Imagen API error:', errorText);

    // Try alternative endpoint format (Gemini 2.0)
    return await generateWithGemini(prompt, apiKey);
  }

  const data = await response.json();

  if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
    return Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
  }

  throw new Error('No image data in response');
}

async function generateWithGemini(prompt: string, apiKey: string): Promise<Buffer> {
  // Alternative: Use Gemini's image generation capability
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Generate an album cover image: ${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ['image', 'text'],
        responseMimeType: 'image/png',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', errorText);
    throw new Error(`Gemini API failed: ${response.status}`);
  }

  const data = await response.json();

  // Extract image from response
  const parts = data.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, 'base64');
    }
  }

  throw new Error('No image in Gemini response');
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();
    const { orderId, orderNumber } = await request.json();

    if (!orderId || !orderNumber) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // Check for Gemini API key
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'Gemini API not configured. Add GEMINI_API_KEY to env.' }, { status: 500 });
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Build prompt
    const genreStyle = genreStyles[order.genre] || 'modern, artistic';
    const occasionStyle = occasionStyles[order.occasion] || 'heartfelt, personal';
    const moodStyle = moodDescriptors[order.mood] || 'balanced';

    const prompt = `Professional album cover art for a personalized ${order.genre} song.
Theme: ${order.occasion} celebration - ${occasionStyle}
Visual style: ${genreStyle}
Mood and atmosphere: ${moodStyle}
Requirements:
- High quality professional music album artwork
- Square format suitable for streaming platforms
- Abstract or symbolic imagery that evokes emotion
- Rich colors and professional composition
- NO text, NO words, NO letters, NO numbers
- NO human faces or realistic people
- Artistic, evocative, emotionally resonant design`;

    console.log('Generating cover with Imagen/Gemini, prompt:', prompt);

    // Generate image
    let imageBuffer: Buffer;
    try {
      imageBuffer = await generateWithImagen(prompt, geminiKey);
    } catch (imagenError) {
      console.error('Imagen failed, trying Gemini:', imagenError);
      try {
        imageBuffer = await generateWithGemini(prompt, geminiKey);
      } catch (geminiError) {
        console.error('Gemini also failed:', geminiError);
        return NextResponse.json({
          error: 'Image generation failed. Please try again or upload manually.',
          details: String(geminiError)
        }, { status: 500 });
      }
    }

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const fileName = `${orderNumber}/cover_${timestamp}.png`;

    const { error: uploadError } = await supabase.storage
      .from('deliverables')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Cover upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload cover' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('deliverables')
      .getPublicUrl(fileName);

    // Create deliverable record
    const { data: deliverable, error: dbError } = await supabase
      .from('deliverables')
      .insert({
        order_id: orderId,
        type: 'png',
        file_url: publicUrl,
        file_name: `${order.recipient_name}_Cover.png`,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to save deliverable' }, { status: 500 });
    }

    return NextResponse.json({
      deliverable,
      message: 'Album cover generated successfully with Google Imagen',
    });
  } catch (error) {
    console.error('Cover generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
