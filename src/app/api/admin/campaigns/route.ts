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

// GET - List all campaigns with stats
export async function GET() {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data: campaigns, error } = await supabase
      .from('drip_campaigns')
      .select(`
        *,
        campaign_steps (
          id,
          step_order,
          delay_days,
          delay_hours,
          is_active,
          template:email_templates (
            name,
            subject
          )
        ),
        enrollments:campaign_enrollments (count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      // Table might not exist yet
      if (error.message.includes('does not exist')) {
        return NextResponse.json({
          campaigns: [],
          message: 'Drip campaign tables not initialized. Run the migration first.'
        });
      }
      throw error;
    }

    // Get send stats for each campaign
    const campaignStats = await Promise.all(
      (campaigns || []).map(async (campaign) => {
        const { data: stats } = await supabase
          .from('email_sends')
          .select('status')
          .eq('campaign_id', campaign.id);

        const sent = stats?.filter(s => s.status === 'sent').length || 0;
        const opened = stats?.filter(s => s.status === 'opened').length || 0;
        const clicked = stats?.filter(s => s.status === 'clicked').length || 0;
        const failed = stats?.filter(s => s.status === 'failed').length || 0;

        return {
          ...campaign,
          stats: {
            totalSent: sent,
            openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
            clickRate: sent > 0 ? Math.round((clicked / sent) * 100) : 0,
            failedCount: failed,
          }
        };
      })
    );

    return NextResponse.json({ campaigns: campaignStats });

  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json({
      error: 'Failed to fetch campaigns',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Create new campaign or enroll order
export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const { action, ...data } = await request.json();
    const supabase = getSupabaseAdmin();

    switch (action) {
      case 'enroll': {
        // Enroll an order in a campaign
        const { orderId, campaignSlug } = data;

        if (!orderId || !campaignSlug) {
          return NextResponse.json({ error: 'orderId and campaignSlug required' }, { status: 400 });
        }

        // Get campaign
        const { data: campaign, error: campaignError } = await supabase
          .from('drip_campaigns')
          .select('*')
          .eq('slug', campaignSlug)
          .eq('is_active', true)
          .single();

        if (campaignError || !campaign) {
          return NextResponse.json({ error: 'Campaign not found or inactive' }, { status: 404 });
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

        // Check if already enrolled
        const { data: existing } = await supabase
          .from('campaign_enrollments')
          .select('id')
          .eq('campaign_id', campaign.id)
          .eq('order_id', orderId)
          .single();

        if (existing) {
          return NextResponse.json({ error: 'Order already enrolled in this campaign' }, { status: 400 });
        }

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

        if (enrollError) throw enrollError;

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

        return NextResponse.json({
          success: true,
          enrollment,
          message: `Order enrolled in ${campaign.name}`
        });
      }

      case 'create_campaign': {
        // Create a new campaign
        const { name, slug, description, trigger_event } = data;

        if (!name || !slug || !trigger_event) {
          return NextResponse.json({ error: 'name, slug, and trigger_event required' }, { status: 400 });
        }

        const { data: campaign, error } = await supabase
          .from('drip_campaigns')
          .insert({ name, slug, description, trigger_event })
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json({ success: true, campaign });
      }

      case 'toggle_campaign': {
        // Toggle campaign active status
        const { campaignId, isActive } = data;

        const { error } = await supabase
          .from('drip_campaigns')
          .update({ is_active: isActive, updated_at: new Date().toISOString() })
          .eq('id', campaignId);

        if (error) throw error;

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Campaign operation failed:', error);
    return NextResponse.json({
      error: 'Operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
