-- ============================================
-- MelodieMacher Full Database Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- PART 1: Drip Campaign Tables
-- ============================================

-- Email Templates Table
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

-- Drip Campaigns Table
CREATE TABLE IF NOT EXISTS drip_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  trigger_event VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign Steps
CREATE TABLE IF NOT EXISTS campaign_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES drip_campaigns(id) ON DELETE CASCADE,
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  step_order INTEGER NOT NULL,
  delay_hours INTEGER DEFAULT 0,
  delay_days INTEGER DEFAULT 0,
  condition_type VARCHAR(50) DEFAULT 'always',
  condition_value JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Sends Tracking
CREATE TABLE IF NOT EXISTS email_sends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES drip_campaigns(id) ON DELETE SET NULL,
  step_id UUID REFERENCES campaign_steps(id) ON DELETE SET NULL,
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign Enrollments
CREATE TABLE IF NOT EXISTS campaign_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES drip_campaigns(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  current_step INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(campaign_id, order_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_scheduled ON email_sends(scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_campaign_enrollments_status ON campaign_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_campaign_enrollments_campaign ON campaign_enrollments(campaign_id);

-- ============================================
-- PART 2: Orders Table Extensions
-- ============================================

-- Priority columns (Phase 2)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS priority VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS priority_reasons TEXT[];
ALTER TABLE orders ADD COLUMN IF NOT EXISTS suggested_deadline TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS generated_prompt TEXT;

-- Quality scoring columns (Phase 3)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quality_score INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quality_details JSONB;

-- Anniversary tracking columns (Phase 3)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS anniversary_reminder_sent TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS detected_anniversary_date VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS anniversary_detection_source TEXT;

-- ============================================
-- PART 3: Seed Data (Skip if already exists)
-- ============================================

-- Insert templates (will fail silently if slug exists)
INSERT INTO email_templates (name, slug, subject, html_content, variables, category)
SELECT 'Post-Delivery Thank You', 'post-delivery-thanks',
  'Danke fuer deine Bestellung bei MelodieMacher!',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #1e3a5f;">Danke, {{customer_name}}!</h1>
    <p>Wir hoffen, dass der Song fuer <strong>{{recipient_name}}</strong> viel Freude bereitet hat!</p>
    <p>Wenn du zufrieden bist, wuerden wir uns ueber eine Google-Bewertung sehr freuen:</p>
    <p style="margin: 30px 0;">
      <a href="{{review_link}}" style="background-color: #d4af37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
        Jetzt bewerten
      </a>
    </p>
    <p>Mit musikalischen Gruessen,<br>Dein MelodieMacher Team</p>
  </div>',
  '["customer_name", "recipient_name", "review_link"]',
  'engagement'
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE slug = 'post-delivery-thanks');

INSERT INTO email_templates (name, slug, subject, html_content, variables, category)
SELECT 'Referral Request', 'referral-request',
  'Empfehle MelodieMacher und spare 10 EUR!',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #1e3a5f;">Teile die Freude!</h1>
    <p>Hallo {{customer_name}},</p>
    <p>Kennst du jemanden, der auch einen personalisierten Song verschenken moechte?</p>
    <p>Teile deinen Empfehlungslink und ihr beide bekommt <strong>10 EUR Rabatt</strong>!</p>
    <p style="margin: 30px 0;">
      <a href="{{referral_link}}" style="background-color: #1e3a5f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
        Jetzt teilen
      </a>
    </p>
    <p>Mit musikalischen Gruessen,<br>Dein MelodieMacher Team</p>
  </div>',
  '["customer_name", "referral_link"]',
  'engagement'
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE slug = 'referral-request');

INSERT INTO email_templates (name, slug, subject, html_content, variables, category)
SELECT 'Anniversary Reminder', 'anniversary-reminder',
  'Bald ist wieder {{occasion}} - Zeit fuer einen neuen Song?',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #1e3a5f;">{{occasion}} steht bevor!</h1>
    <p>Hallo {{customer_name}},</p>
    <p>Vor einem Jahr hast du einen Song fuer <strong>{{recipient_name}}</strong> zum {{occasion}} bestellt.</p>
    <p>Ueberrasche wieder mit einem neuen, einzigartigen Song!</p>
    <p style="margin: 30px 0;">
      <a href="{{order_link}}" style="background-color: #1e3a5f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
        Neuen Song bestellen
      </a>
    </p>
    <p>Mit musikalischen Gruessen,<br>Dein MelodieMacher Team</p>
  </div>',
  '["customer_name", "recipient_name", "occasion", "order_link"]',
  'reengagement'
WHERE NOT EXISTS (SELECT 1 FROM email_templates WHERE slug = 'anniversary-reminder');

-- Insert campaigns
INSERT INTO drip_campaigns (name, slug, description, trigger_event)
SELECT 'Post-Delivery Engagement', 'post-delivery',
  'Automatische Follow-up Emails nach Lieferung', 'order_delivered'
WHERE NOT EXISTS (SELECT 1 FROM drip_campaigns WHERE slug = 'post-delivery');

INSERT INTO drip_campaigns (name, slug, description, trigger_event)
SELECT 'Anniversary Re-engagement', 'anniversary',
  'Erinnerung ein Jahr nach der Bestellung', 'order_anniversary'
WHERE NOT EXISTS (SELECT 1 FROM drip_campaigns WHERE slug = 'anniversary');

-- Insert campaign steps
INSERT INTO campaign_steps (campaign_id, template_id, step_order, delay_days, condition_type)
SELECT c.id, t.id, 1, 2, 'always'
FROM drip_campaigns c, email_templates t
WHERE c.slug = 'post-delivery' AND t.slug = 'post-delivery-thanks'
AND NOT EXISTS (
  SELECT 1 FROM campaign_steps cs
  WHERE cs.campaign_id = c.id AND cs.step_order = 1
);

INSERT INTO campaign_steps (campaign_id, template_id, step_order, delay_days, condition_type)
SELECT c.id, t.id, 2, 7, 'always'
FROM drip_campaigns c, email_templates t
WHERE c.slug = 'post-delivery' AND t.slug = 'referral-request'
AND NOT EXISTS (
  SELECT 1 FROM campaign_steps cs
  WHERE cs.campaign_id = c.id AND cs.step_order = 2
);

INSERT INTO campaign_steps (campaign_id, template_id, step_order, delay_days, condition_type)
SELECT c.id, t.id, 1, 350, 'always'
FROM drip_campaigns c, email_templates t
WHERE c.slug = 'anniversary' AND t.slug = 'anniversary-reminder'
AND NOT EXISTS (
  SELECT 1 FROM campaign_steps cs
  WHERE cs.campaign_id = c.id AND cs.step_order = 1
);

-- ============================================
-- Done! All tables and columns created.
-- ============================================
