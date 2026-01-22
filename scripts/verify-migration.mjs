import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=["']?(.+?)["']?$/);
  if (match) env[match[1]] = match[2];
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function verify() {
  console.log('🔍 Verifying MelodieMacher Database Migration\n');

  const results = { success: [], failed: [] };

  // Check tables
  const tables = ['email_templates', 'drip_campaigns', 'campaign_steps', 'email_sends', 'campaign_enrollments'];

  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error?.message?.includes('does not exist')) {
      results.failed.push(`Table: ${table}`);
    } else {
      results.success.push(`Table: ${table}`);
    }
  }

  // Check order columns
  const columns = [
    'priority', 'priority_reasons', 'suggested_deadline', 'generated_prompt',
    'quality_score', 'quality_details',
    'anniversary_reminder_sent', 'detected_anniversary_date', 'anniversary_detection_source'
  ];

  for (const col of columns) {
    const { error } = await supabase.from('orders').select(col).limit(1);
    if (error?.message?.includes('does not exist')) {
      results.failed.push(`Column: orders.${col}`);
    } else {
      results.success.push(`Column: orders.${col}`);
    }
  }

  // Check seed data
  const { data: templates } = await supabase.from('email_templates').select('slug');
  const { data: campaigns } = await supabase.from('drip_campaigns').select('slug');
  const { data: steps } = await supabase.from('campaign_steps').select('id');

  console.log('✅ SUCCESS:');
  results.success.forEach(s => console.log(`   ${s}`));

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED:');
    results.failed.forEach(f => console.log(`   ${f}`));
  }

  console.log('\n📊 Seed Data:');
  console.log(`   Email templates: ${templates?.length || 0}`);
  console.log(`   Drip campaigns: ${campaigns?.length || 0}`);
  console.log(`   Campaign steps: ${steps?.length || 0}`);

  console.log('\n' + '─'.repeat(50));
  if (results.failed.length === 0) {
    console.log('🎉 All migrations verified successfully!');
  } else {
    console.log(`⚠️  ${results.failed.length} items failed verification`);
  }
}

verify().catch(console.error);
