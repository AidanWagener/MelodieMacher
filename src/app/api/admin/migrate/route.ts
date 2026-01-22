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

// POST - Run database migrations
export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const { migration } = await request.json();
    const supabase = getSupabaseAdmin();
    const results: { step: string; status: 'success' | 'skipped' | 'error'; message?: string }[] = [];

    if (migration === 'drip-campaigns' || migration === 'all') {
      // Create email_templates table
      try {
        await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS email_templates (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              slug VARCHAR(100) UNIQUE NOT NULL,
              subject VARCHAR(500) NOT NULL,
              html_content TEXT NOT NULL,
              text_content TEXT,
              variables JSONB DEFAULT '[]'::jsonb,
              category VARCHAR(50) DEFAULT 'transactional',
              is_active BOOLEAN DEFAULT true,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            );
          `
        });
        results.push({ step: 'email_templates', status: 'success' });
      } catch (e) {
        // Table might already exist or RPC not available, try direct query
        const { error } = await supabase.from('email_templates').select('id').limit(1);
        if (error?.message.includes('does not exist')) {
          results.push({ step: 'email_templates', status: 'error', message: 'Cannot create table - run SQL manually' });
        } else {
          results.push({ step: 'email_templates', status: 'skipped', message: 'Table already exists' });
        }
      }

      // Create drip_campaigns table
      try {
        const { error } = await supabase.from('drip_campaigns').select('id').limit(1);
        if (error?.message.includes('does not exist')) {
          results.push({ step: 'drip_campaigns', status: 'error', message: 'Run migration SQL in Supabase dashboard' });
        } else {
          results.push({ step: 'drip_campaigns', status: 'skipped', message: 'Table already exists' });
        }
      } catch {
        results.push({ step: 'drip_campaigns', status: 'error', message: 'Check failed' });
      }

      // Create campaign_steps table
      try {
        const { error } = await supabase.from('campaign_steps').select('id').limit(1);
        if (error?.message.includes('does not exist')) {
          results.push({ step: 'campaign_steps', status: 'error', message: 'Run migration SQL in Supabase dashboard' });
        } else {
          results.push({ step: 'campaign_steps', status: 'skipped', message: 'Table already exists' });
        }
      } catch {
        results.push({ step: 'campaign_steps', status: 'error', message: 'Check failed' });
      }

      // Create email_sends table
      try {
        const { error } = await supabase.from('email_sends').select('id').limit(1);
        if (error?.message.includes('does not exist')) {
          results.push({ step: 'email_sends', status: 'error', message: 'Run migration SQL in Supabase dashboard' });
        } else {
          results.push({ step: 'email_sends', status: 'skipped', message: 'Table already exists' });
        }
      } catch {
        results.push({ step: 'email_sends', status: 'error', message: 'Check failed' });
      }

      // Create campaign_enrollments table
      try {
        const { error } = await supabase.from('campaign_enrollments').select('id').limit(1);
        if (error?.message.includes('does not exist')) {
          results.push({ step: 'campaign_enrollments', status: 'error', message: 'Run migration SQL in Supabase dashboard' });
        } else {
          results.push({ step: 'campaign_enrollments', status: 'skipped', message: 'Table already exists' });
        }
      } catch {
        results.push({ step: 'campaign_enrollments', status: 'error', message: 'Check failed' });
      }
    }

    if (migration === 'order-columns' || migration === 'all') {
      // Add priority columns to orders
      try {
        // Check if column exists by trying to select it
        const { data, error } = await supabase
          .from('orders')
          .select('priority')
          .limit(1);

        if (error?.message.includes('column') && error?.message.includes('does not exist')) {
          results.push({ step: 'orders.priority', status: 'error', message: 'Run ALTER TABLE in Supabase dashboard' });
        } else {
          results.push({ step: 'orders.priority', status: 'skipped', message: 'Column already exists' });
        }
      } catch {
        results.push({ step: 'orders.priority', status: 'error', message: 'Check failed' });
      }

      // Check priority_reasons column
      try {
        const { error } = await supabase
          .from('orders')
          .select('priority_reasons')
          .limit(1);

        if (error?.message.includes('column') && error?.message.includes('does not exist')) {
          results.push({ step: 'orders.priority_reasons', status: 'error', message: 'Run ALTER TABLE in Supabase dashboard' });
        } else {
          results.push({ step: 'orders.priority_reasons', status: 'skipped', message: 'Column already exists' });
        }
      } catch {
        results.push({ step: 'orders.priority_reasons', status: 'error', message: 'Check failed' });
      }

      // Check suggested_deadline column
      try {
        const { error } = await supabase
          .from('orders')
          .select('suggested_deadline')
          .limit(1);

        if (error?.message.includes('column') && error?.message.includes('does not exist')) {
          results.push({ step: 'orders.suggested_deadline', status: 'error', message: 'Run ALTER TABLE in Supabase dashboard' });
        } else {
          results.push({ step: 'orders.suggested_deadline', status: 'skipped', message: 'Column already exists' });
        }
      } catch {
        results.push({ step: 'orders.suggested_deadline', status: 'error', message: 'Check failed' });
      }

      // Check generated_prompt column
      try {
        const { error } = await supabase
          .from('orders')
          .select('generated_prompt')
          .limit(1);

        if (error?.message.includes('column') && error?.message.includes('does not exist')) {
          results.push({ step: 'orders.generated_prompt', status: 'error', message: 'Run ALTER TABLE in Supabase dashboard' });
        } else {
          results.push({ step: 'orders.generated_prompt', status: 'skipped', message: 'Column already exists' });
        }
      } catch {
        results.push({ step: 'orders.generated_prompt', status: 'error', message: 'Check failed' });
      }
    }

    const errors = results.filter(r => r.status === 'error');
    const success = results.filter(r => r.status === 'success');
    const skipped = results.filter(r => r.status === 'skipped');

    return NextResponse.json({
      migration,
      summary: {
        total: results.length,
        success: success.length,
        skipped: skipped.length,
        errors: errors.length,
      },
      results,
      sqlFile: errors.length > 0 ? '/supabase/migrations/20240122_drip_campaigns.sql' : null,
      message: errors.length > 0
        ? 'Some migrations need manual execution. Copy SQL from migration file to Supabase SQL Editor.'
        : 'All migrations complete or already applied.'
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      error: 'Migration check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET - Check migration status
export async function GET() {
  if (!isAuthenticated()) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdmin();
    const status: Record<string, boolean> = {};

    // Check drip campaign tables
    const tables = ['email_templates', 'drip_campaigns', 'campaign_steps', 'email_sends', 'campaign_enrollments'];
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1);
        status[table] = !error || !error.message.includes('does not exist');
      } catch {
        status[table] = false;
      }
    }

    // Check order columns
    const columns = ['priority', 'priority_reasons', 'suggested_deadline', 'generated_prompt'];
    for (const col of columns) {
      try {
        const { error } = await supabase.from('orders').select(col).limit(1);
        status[`orders.${col}`] = !error || !error.message.includes('does not exist');
      } catch {
        status[`orders.${col}`] = false;
      }
    }

    const allReady = Object.values(status).every(v => v);

    return NextResponse.json({
      ready: allReady,
      status,
      message: allReady
        ? 'All database migrations are applied'
        : 'Some migrations are missing. Run POST /api/admin/migrate with { "migration": "all" }'
    });

  } catch (error) {
    console.error('Migration status check error:', error);
    return NextResponse.json({
      error: 'Status check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
