import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, unauthorizedResponse } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { OCCASION_LABELS } from '@/lib/constants';
import { parseAIJsonResponse, escapeHtml } from '@/lib/ai-utils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';

interface PipelineStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: unknown;
  error?: string;
}

interface PipelineResult {
  orderId: string;
  orderNumber: string;
  steps: PipelineStep[];
  finalStatus: 'success' | 'partial' | 'failed';
}

// POST - Execute pipeline for a single order
export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const { orderId, skipSteps = [] } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, deliverables(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const pipeline: PipelineResult = {
      orderId: order.id,
      orderNumber: order.order_number,
      steps: [],
      finalStatus: 'success'
    };

    // Step 1: Priority Analysis
    const priorityStep: PipelineStep = { name: 'priority_analysis', status: 'pending' };
    if (!skipSteps.includes('priority')) {
      priorityStep.status = 'running';
      try {
        if (!order.priority) {
          const apiKey = process.env.GEMINI_API_KEY;
          if (apiKey) {
            const genai = new GoogleGenerativeAI(apiKey.trim());
            const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const orderAge = Math.floor((Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60));
            const prompt = `Analysiere Dringlichkeit. Anlass: ${OCCASION_LABELS[order.occasion] || order.occasion}. Geschichte: ${order.story}. Alter: ${orderAge}h. Antworte mit JSON: {"priority":"urgent|high|normal|low","reasons":["..."],"suggestedDeadline":"ISO oder null"}`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const analysis = JSON.parse(jsonMatch[0]);
              await supabase
                .from('orders')
                .update({
                  priority: analysis.priority,
                  priority_reasons: analysis.reasons,
                  suggested_deadline: analysis.suggestedDeadline,
                  updated_at: new Date().toISOString()
                })
                .eq('id', order.id);

              priorityStep.result = analysis;
            }
          }
        } else {
          priorityStep.result = { priority: order.priority, reasons: order.priority_reasons };
        }
        priorityStep.status = 'completed';
      } catch (err) {
        priorityStep.status = 'failed';
        priorityStep.error = err instanceof Error ? err.message : 'Unknown error';
        pipeline.finalStatus = 'partial';
      }
    } else {
      priorityStep.status = 'skipped';
    }
    pipeline.steps.push(priorityStep);

    // Step 2: Generate Suno Prompt
    const promptStep: PipelineStep = { name: 'suno_prompt', status: 'pending' };
    if (!skipSteps.includes('prompt')) {
      promptStep.status = 'running';
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
          const genai = new GoogleGenerativeAI(apiKey.trim());
          const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });

          const prompt = `Erstelle einen Suno AI Musik-Prompt fuer:
Anlass: ${OCCASION_LABELS[order.occasion] || order.occasion}
Empfaenger: ${order.recipient_name}
Genre: ${order.genre}
Geschichte: ${order.story}

Antworte mit JSON:
{
  "sunoPrompt": "vollstaendiger Prompt",
  "suggestedTags": ["tag1", "tag2"],
  "moodDescription": "Stimmung"
}`;

          const result = await model.generateContent(prompt);
          const text = result.response.text();
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const promptData = JSON.parse(jsonMatch[0]);

            // Save to order
            await supabase
              .from('orders')
              .update({
                generated_prompt: promptData.sunoPrompt,
                updated_at: new Date().toISOString()
              })
              .eq('id', order.id);

            promptStep.result = promptData;
          }
        }
        promptStep.status = 'completed';
      } catch (err) {
        promptStep.status = 'failed';
        promptStep.error = err instanceof Error ? err.message : 'Unknown error';
        pipeline.finalStatus = 'partial';
      }
    } else {
      promptStep.status = 'skipped';
    }
    pipeline.steps.push(promptStep);

    // Step 3: Generate Album Cover
    const coverStep: PipelineStep = { name: 'album_cover', status: 'pending' };
    if (!skipSteps.includes('cover')) {
      coverStep.status = 'running';
      try {
        const existingCover = order.deliverables?.find((d: { type: string }) => d.type === 'png');

        if (!existingCover) {
          const apiKey = process.env.GEMINI_API_KEY;
          if (apiKey) {
            const genai = new GoogleGenerativeAI(apiKey.trim());
            const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });

            // Generate cover prompt
            const prompt = `Erstelle eine Bildbeschreibung fuer ein Albumcover:
Anlass: ${OCCASION_LABELS[order.occasion] || order.occasion}
Fuer: ${order.recipient_name}
Genre: ${order.genre}

Antworte mit einem kurzen, beschreibenden Satz auf Englisch fuer ein AI-Bildgenerator.`;

            const result = await model.generateContent(prompt);
            const coverPrompt = result.response.text().trim();

            coverStep.result = {
              coverPrompt,
              note: 'Cover-Prompt generiert. Manuell erstellen und hochladen.'
            };
          }
        } else {
          coverStep.result = { existing: true, url: existingCover.file_url };
        }
        coverStep.status = 'completed';
      } catch (err) {
        coverStep.status = 'failed';
        coverStep.error = err instanceof Error ? err.message : 'Unknown error';
        pipeline.finalStatus = 'partial';
      }
    } else {
      coverStep.status = 'skipped';
    }
    pipeline.steps.push(coverStep);

    // Step 4: Set Status to In Production
    const statusStep: PipelineStep = { name: 'set_in_production', status: 'pending' };
    if (!skipSteps.includes('status') && order.status === 'paid') {
      statusStep.status = 'running';
      try {
        await supabase
          .from('orders')
          .update({
            status: 'in_production',
            updated_at: new Date().toISOString()
          })
          .eq('id', order.id);

        statusStep.result = { newStatus: 'in_production' };
        statusStep.status = 'completed';
      } catch (err) {
        statusStep.status = 'failed';
        statusStep.error = err instanceof Error ? err.message : 'Unknown error';
        pipeline.finalStatus = 'partial';
      }
    } else if (order.status !== 'paid') {
      statusStep.status = 'skipped';
      statusStep.result = { reason: `Status bereits: ${order.status}` };
    } else {
      statusStep.status = 'skipped';
    }
    pipeline.steps.push(statusStep);

    // Step 5: Check deliverables and auto-deliver if ready
    const deliveryStep: PipelineStep = { name: 'check_delivery', status: 'pending' };
    if (!skipSteps.includes('delivery')) {
      deliveryStep.status = 'running';
      try {
        // Re-fetch deliverables
        const { data: deliverables } = await supabase
          .from('deliverables')
          .select('*')
          .eq('order_id', order.id);

        const hasMP3 = deliverables?.some((d: { type: string }) => d.type === 'mp3');

        if (hasMP3 && order.status !== 'delivered') {
          deliveryStep.result = {
            ready: true,
            hasMP3: true,
            deliverableCount: deliverables?.length || 0,
            note: 'Bestellung bereit zur Lieferung'
          };
        } else {
          deliveryStep.result = {
            ready: false,
            hasMP3: !!hasMP3,
            deliverableCount: deliverables?.length || 0,
            note: hasMP3 ? 'Bereits geliefert' : 'MP3 fehlt noch'
          };
        }
        deliveryStep.status = 'completed';
      } catch (err) {
        deliveryStep.status = 'failed';
        deliveryStep.error = err instanceof Error ? err.message : 'Unknown error';
        pipeline.finalStatus = 'partial';
      }
    } else {
      deliveryStep.status = 'skipped';
    }
    pipeline.steps.push(deliveryStep);

    // Determine final status
    const failedSteps = pipeline.steps.filter(s => s.status === 'failed');
    if (failedSteps.length === pipeline.steps.filter(s => s.status !== 'skipped').length) {
      pipeline.finalStatus = 'failed';
    } else if (failedSteps.length > 0) {
      pipeline.finalStatus = 'partial';
    }

    return NextResponse.json(pipeline);

  } catch (error) {
    console.error('Pipeline error:', error);
    return NextResponse.json({
      error: 'Pipeline failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST with action=deliver - Complete delivery
export async function PUT(request: NextRequest) {
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

    // Check if MP3 exists
    const hasMP3 = order.deliverables?.some((d: { type: string }) => d.type === 'mp3');
    if (!hasMP3) {
      return NextResponse.json({ error: 'MP3 fehlt - Upload erforderlich' }, { status: 400 });
    }

    if (order.status === 'delivered') {
      return NextResponse.json({ error: 'Bereits geliefert' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.melodiemacher.de';
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
      .eq('id', orderId);

    if (updateError) throw updateError;

    // Send delivery email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      // Escape user content to prevent XSS
      const safeCustomerName = escapeHtml(order.customer_name || '');
      const safeRecipientName = escapeHtml(order.recipient_name || '');

      await resend.emails.send({
        from: 'MelodieMacher <hallo@melodiemacher.de>',
        to: order.customer_email,
        subject: `Dein Song für ${safeRecipientName} ist fertig!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e3a5f;">Dein Song ist fertig!</h1>
            <p>Hallo ${safeCustomerName},</p>
            <p>Großartige Neuigkeiten! Dein personalisierter Song für <strong>${safeRecipientName}</strong> ist bereit.</p>
            <p style="margin: 30px 0;">
              <a href="${deliveryUrl}" style="background-color: #1e3a5f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Song jetzt anhören & herunterladen
              </a>
            </p>
            <p>Wir hoffen, dass dieser Song viel Freude bereitet!</p>
            <p>Mit musikalischen Grüßen,<br>Dein MelodieMacher Team</p>
          </div>
        `
      });
    }

    return NextResponse.json({
      success: true,
      deliveryUrl,
      emailSent: !!resendKey
    });

  } catch (error) {
    console.error('Delivery error:', error);
    return NextResponse.json({
      error: 'Delivery failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
