import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
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

// Helper to replace template variables
function replaceVariables(content: string, variables: Record<string, string>): string {
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
  }
  return result;
}

// GET - Process scheduled emails (called by cron)
export async function GET(request: NextRequest) {
  const auth = verifyCronAuth(request);
  if (!auth.authorized) {
    return auth.error;
  }

  try {
    const supabase = getSupabaseAdmin();
    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      return NextResponse.json({ error: 'Resend API not configured' }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const now = new Date().toISOString();

    // Get pending emails that are scheduled for now or earlier
    const { data: pendingEmails, error: fetchError } = await supabase
      .from('email_sends')
      .select(`
        *,
        template:email_templates(*),
        order:orders(*)
      `)
      .eq('status', 'pending')
      .lte('scheduled_at', now)
      .limit(50);

    if (fetchError) {
      // Tables might not exist
      if (fetchError.message.includes('does not exist')) {
        return NextResponse.json({
          processed: 0,
          message: 'Drip campaign tables not initialized'
        });
      }
      throw fetchError;
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return NextResponse.json({ processed: 0, message: 'No emails to process' });
    }

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.melodiemacher.de';

    for (const email of pendingEmails) {
      results.processed++;

      try {
        // Skip if no template
        if (!email.template) {
          await supabase
            .from('email_sends')
            .update({ status: 'failed', error_message: 'Template not found' })
            .eq('id', email.id);
          results.failed++;
          continue;
        }

        // Build template variables
        const order = email.order;
        const metadata = email.metadata || {};

        const variables: Record<string, string> = {
          customer_name: email.recipient_name || 'Kunde',
          recipient_name: metadata.recipient_name || order?.recipient_name || '',
          occasion: occasionLabels[metadata.occasion || order?.occasion] || 'besonderen Anlass',
          order_link: `${appUrl}/bestellen`,
          review_link: 'https://g.page/r/YOUR_GOOGLE_REVIEW_LINK', // TODO: Replace with actual link
          referral_link: `${appUrl}/?ref=${order?.order_number || 'friend'}`,
          download_link: order?.delivery_url || `${appUrl}/download/${order?.order_number}`,
        };

        // Replace variables in subject and content
        const subject = replaceVariables(email.template.subject, variables);
        const htmlContent = replaceVariables(email.template.html_content, variables);

        // Send email
        const { error: sendError } = await resend.emails.send({
          from: 'MelodieMacher <hallo@melodiemacher.de>',
          to: email.recipient_email,
          subject,
          html: htmlContent,
        });

        if (sendError) {
          throw new Error(sendError.message);
        }

        // Update email status
        await supabase
          .from('email_sends')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', email.id);

        results.sent++;

        // Schedule next step if exists
        if (email.step_id && email.campaign_id) {
          // Get current step
          const { data: currentStep } = await supabase
            .from('campaign_steps')
            .select('step_order')
            .eq('id', email.step_id)
            .single();

          if (currentStep) {
            // Get next step
            const { data: nextStep } = await supabase
              .from('campaign_steps')
              .select('*, template:email_templates(*)')
              .eq('campaign_id', email.campaign_id)
              .eq('is_active', true)
              .gt('step_order', currentStep.step_order)
              .order('step_order', { ascending: true })
              .limit(1)
              .single();

            if (nextStep) {
              const scheduledAt = new Date();
              scheduledAt.setDate(scheduledAt.getDate() + (nextStep.delay_days || 0));
              scheduledAt.setHours(scheduledAt.getHours() + (nextStep.delay_hours || 0));

              await supabase
                .from('email_sends')
                .insert({
                  campaign_id: email.campaign_id,
                  step_id: nextStep.id,
                  template_id: nextStep.template_id,
                  order_id: email.order_id,
                  recipient_email: email.recipient_email,
                  recipient_name: email.recipient_name,
                  subject: nextStep.template?.subject,
                  status: 'pending',
                  scheduled_at: scheduledAt.toISOString(),
                  metadata: email.metadata,
                });
            } else {
              // No more steps - mark enrollment as completed
              await supabase
                .from('campaign_enrollments')
                .update({
                  status: 'completed',
                  completed_at: new Date().toISOString(),
                })
                .eq('campaign_id', email.campaign_id)
                .eq('order_id', email.order_id);
            }
          }
        }

      } catch (err) {
        results.failed++;
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        results.errors.push(`Email ${email.id}: ${errorMessage}`);

        // Update email status to failed
        await supabase
          .from('email_sends')
          .update({
            status: 'failed',
            error_message: errorMessage,
          })
          .eq('id', email.id);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });

  } catch (error) {
    console.error('Drip processor error:', error);
    return NextResponse.json({
      error: 'Processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Trigger campaign enrollment for an order
export async function POST(request: NextRequest) {
  // Verify cron secret - FAIL CLOSED
  const cronSecret = request.headers.get('x-cron-secret');
  const expectedSecret = process.env.CRON_SECRET;

  // Security: If no secret configured, reject all requests (fail closed)
  if (!expectedSecret) {
    console.error('CRON_SECRET not configured - rejecting enrollment request');
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 });
  }

  if (cronSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { trigger, orderId } = await request.json();
    const supabase = getSupabaseAdmin();

    if (!trigger || !orderId) {
      return NextResponse.json({ error: 'trigger and orderId required' }, { status: 400 });
    }

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Find campaigns matching this trigger
    const { data: campaigns, error: campaignError } = await supabase
      .from('drip_campaigns')
      .select('*')
      .eq('trigger_event', trigger)
      .eq('is_active', true);

    if (campaignError) {
      // Table might not exist
      if (campaignError.message.includes('does not exist')) {
        return NextResponse.json({
          enrolled: 0,
          message: 'Drip campaign tables not initialized'
        });
      }
      throw campaignError;
    }

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ enrolled: 0, message: 'No active campaigns for this trigger' });
    }

    const enrolled = [];

    for (const campaign of campaigns) {
      // Check if already enrolled
      const { data: existing } = await supabase
        .from('campaign_enrollments')
        .select('id')
        .eq('campaign_id', campaign.id)
        .eq('order_id', orderId)
        .single();

      if (existing) continue;

      // Create enrollment
      const { data: enrollment, error: enrollError } = await supabase
        .from('campaign_enrollments')
        .insert({
          campaign_id: campaign.id,
          order_id: orderId,
          customer_email: order.customer_email,
          customer_name: order.customer_name,
          status: 'active',
          metadata: {
            recipient_name: order.recipient_name,
            occasion: order.occasion,
          }
        })
        .select()
        .single();

      if (enrollError) {
        console.error(`Failed to enroll in campaign ${campaign.slug}:`, enrollError);
        continue;
      }

      // Schedule first step
      const { data: steps } = await supabase
        .from('campaign_steps')
        .select('*, template:email_templates(*)')
        .eq('campaign_id', campaign.id)
        .eq('is_active', true)
        .order('step_order', { ascending: true })
        .limit(1);

      if (steps && steps.length > 0) {
        const firstStep = steps[0];
        const scheduledAt = new Date();
        scheduledAt.setDate(scheduledAt.getDate() + (firstStep.delay_days || 0));
        scheduledAt.setHours(scheduledAt.getHours() + (firstStep.delay_hours || 0));

        await supabase
          .from('email_sends')
          .insert({
            campaign_id: campaign.id,
            step_id: firstStep.id,
            template_id: firstStep.template_id,
            order_id: orderId,
            recipient_email: order.customer_email,
            recipient_name: order.customer_name,
            subject: firstStep.template?.subject,
            status: 'pending',
            scheduled_at: scheduledAt.toISOString(),
            metadata: {
              recipient_name: order.recipient_name,
              occasion: order.occasion,
            }
          });
      }

      enrolled.push(campaign.slug);
    }

    return NextResponse.json({
      success: true,
      enrolled: enrolled.length,
      campaigns: enrolled,
    });

  } catch (error) {
    console.error('Campaign enrollment error:', error);
    return NextResponse.json({
      error: 'Enrollment failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
