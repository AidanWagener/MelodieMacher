import pg from 'pg';
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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('Could not extract project ref from URL');
  process.exit(1);
}

// Supabase pooler connection string format
// Try multiple connection methods
const connectionConfigs = [
  {
    name: 'Pooler (Transaction Mode)',
    connectionString: `postgresql://postgres.${projectRef}:${serviceKey}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`
  },
  {
    name: 'Pooler (Session Mode)',
    connectionString: `postgresql://postgres.${projectRef}:${serviceKey}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`
  },
  {
    name: 'Direct Connection',
    connectionString: `postgresql://postgres:${serviceKey}@db.${projectRef}.supabase.co:5432/postgres`
  }
];

async function runMigrations() {
  console.log('🚀 Running MelodieMacher Database Migrations\n');
  console.log(`Project: ${projectRef}`);

  let client = null;
  let connected = false;

  // Try each connection config
  for (const config of connectionConfigs) {
    console.log(`\nTrying ${config.name}...`);
    try {
      client = new pg.Client({
        connectionString: config.connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
      });
      await client.connect();
      console.log(`✅ Connected via ${config.name}`);
      connected = true;
      break;
    } catch (err) {
      console.log(`❌ Failed: ${err.message.split('\n')[0]}`);
      if (client) {
        try { await client.end(); } catch {}
      }
      client = null;
    }
  }

  if (!connected || !client) {
    console.error('\n❌ Could not connect to database with any method.');
    console.log('\nPlease run the SQL manually in Supabase Dashboard:');
    console.log('1. Go to https://supabase.com/dashboard/project/' + projectRef);
    console.log('2. Click "SQL Editor" in the sidebar');
    console.log('3. Copy and paste the contents of: supabase/migrations/20240122_drip_campaigns.sql');
    process.exit(1);
  }

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240122_drip_campaigns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('\n📦 Running migration: 20240122_drip_campaigns.sql');

    // Split into statements and run each
    // Handle DO blocks specially
    const statements = [];
    let current = '';
    let inDoBlock = false;

    for (const line of migrationSQL.split('\n')) {
      current += line + '\n';

      if (line.trim().startsWith('DO $$')) {
        inDoBlock = true;
      }

      if (inDoBlock && line.trim() === 'END $$;') {
        statements.push(current.trim());
        current = '';
        inDoBlock = false;
      } else if (!inDoBlock && line.trim().endsWith(';') && !line.trim().startsWith('--')) {
        statements.push(current.trim());
        current = '';
      }
    }

    let success = 0;
    let skipped = 0;
    let errors = 0;

    for (const stmt of statements) {
      if (!stmt || stmt.startsWith('--')) continue;

      try {
        await client.query(stmt);
        success++;

        // Log what was created
        if (stmt.includes('CREATE TABLE')) {
          const tableName = stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
          if (tableName) console.log(`  ✅ Created table: ${tableName}`);
        } else if (stmt.includes('CREATE INDEX')) {
          const indexName = stmt.match(/CREATE INDEX IF NOT EXISTS (\w+)/)?.[1];
          if (indexName) console.log(`  ✅ Created index: ${indexName}`);
        } else if (stmt.includes('INSERT INTO')) {
          const tableName = stmt.match(/INSERT INTO (\w+)/)?.[1];
          if (tableName) console.log(`  ✅ Inserted data into: ${tableName}`);
        } else if (stmt.includes('ALTER TABLE')) {
          console.log(`  ✅ Altered orders table`);
        } else if (stmt.includes('DO $$')) {
          console.log(`  ✅ Added columns to orders table`);
        }
      } catch (err) {
        if (err.message.includes('already exists') || err.message.includes('duplicate')) {
          skipped++;
          const match = stmt.match(/(?:TABLE|INDEX|INTO) (?:IF NOT EXISTS )?(\w+)/);
          if (match) console.log(`  ⏭️  Skipped (exists): ${match[1]}`);
        } else {
          errors++;
          console.error(`  ❌ Error: ${err.message.split('\n')[0]}`);
        }
      }
    }

    // Add Phase 3 columns
    console.log('\n📦 Adding Phase 3 columns...');

    const phase3Columns = [
      { name: 'quality_score', type: 'INTEGER' },
      { name: 'quality_details', type: 'JSONB' },
      { name: 'anniversary_reminder_sent', type: 'TIMESTAMPTZ' },
      { name: 'detected_anniversary_date', type: 'VARCHAR(20)' },
      { name: 'anniversary_detection_source', type: 'TEXT' },
    ];

    for (const col of phase3Columns) {
      try {
        await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
        console.log(`  ✅ Added column: orders.${col.name}`);
        success++;
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`  ⏭️  Exists: orders.${col.name}`);
          skipped++;
        } else {
          console.error(`  ❌ Error adding ${col.name}: ${err.message}`);
          errors++;
        }
      }
    }

    console.log('\n' + '─'.repeat(50));
    console.log(`✅ Success: ${success} | ⏭️ Skipped: ${skipped} | ❌ Errors: ${errors}`);
    console.log('─'.repeat(50));

    if (errors === 0) {
      console.log('\n🎉 All migrations completed successfully!');
    } else {
      console.log('\n⚠️  Some migrations had errors. Check the output above.');
    }

  } finally {
    await client.end();
  }
}

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
