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

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();
    const { orderId, orderNumber, lyrics } = await request.json();

    if (!orderId || !orderNumber) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
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

    // Check if MP3 exists (required for video)
    const { data: mp3Deliverable } = await supabase
      .from('deliverables')
      .select('file_url')
      .eq('order_id', orderId)
      .eq('type', 'mp3')
      .single();

    if (!mp3Deliverable) {
      return NextResponse.json({
        error: 'MP3 required first. Please upload the song before generating video.',
      }, { status: 400 });
    }

    // Check if album cover exists (optional but nice to have)
    const { data: coverDeliverable } = await supabase
      .from('deliverables')
      .select('file_url')
      .eq('order_id', orderId)
      .eq('type', 'png')
      .single();

    // For now, return info about manual video creation
    // In production, this would:
    // 1. Use Remotion with a render server
    // 2. Or use a video generation API like Creatomate, Shotstack, or Synthesia
    // 3. Or use FFmpeg on a serverless function

    // Video generation options for future implementation:
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
      manual: {
        description: 'Use Canva, CapCut, or similar',
        setup: 'None',
        quality: 'Varies',
        cost: 'Time only',
      },
    };

    // For MVP: Return instructions for manual video creation
    const videoInstructions = `
LYRIC VIDEO CREATION GUIDE for ${order.recipient_name}

1. QUICK METHOD (Canva):
   - Go to canva.com/create/videos
   - Choose "Album Art Video" template
   - Upload the album cover: ${coverDeliverable?.file_url || 'Generate cover first'}
   - Add animated text with lyrics
   - Add the MP3 as background audio
   - Export as MP4

2. PRO METHOD (CapCut):
   - Import the MP3 audio
   - Add the album cover as background
   - Use "Auto Captions" to generate lyrics
   - Style the captions to match mood
   - Export as 1080p MP4

3. AUTOMATED (Future):
   - Creatomate API integration coming soon
   - Will auto-generate from MP3 + lyrics + cover

Song Details:
- Recipient: ${order.recipient_name}
- Occasion: ${order.occasion}
- Genre: ${order.genre}
- Mood: ${order.mood}/5

MP3 URL: ${mp3Deliverable.file_url}
Cover URL: ${coverDeliverable?.file_url || 'Not generated yet'}
`;

    // For now, we don't auto-generate the video
    // The admin should upload it manually after creating it
    return NextResponse.json({
      success: false,
      message: 'Automatic video generation not yet implemented. Please create manually and upload.',
      instructions: videoInstructions,
      resources: {
        mp3Url: mp3Deliverable.file_url,
        coverUrl: coverDeliverable?.file_url,
        songTitle: `Song fuer ${order.recipient_name}`,
        lyrics: lyrics || order.story,
      },
      futureOptions: videoOptions,
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
