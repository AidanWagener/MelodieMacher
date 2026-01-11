-- ============================================
-- MelodieMacher Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(30) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'in_production', 'quality_review', 'delivered', 'refunded')),

  -- Customer Info
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,

  -- Recipient/Song Info
  recipient_name VARCHAR(255) NOT NULL,
  occasion VARCHAR(50) NOT NULL,
  relationship VARCHAR(100),
  story TEXT NOT NULL,
  genre VARCHAR(50) NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5),
  allow_english BOOLEAN DEFAULT FALSE,

  -- Package & Pricing
  package_type VARCHAR(20) NOT NULL CHECK (package_type IN ('basis', 'plus', 'premium')),
  selected_bundle VARCHAR(30) DEFAULT 'none',
  bump_karaoke BOOLEAN DEFAULT FALSE,
  bump_rush BOOLEAN DEFAULT FALSE,
  bump_gift BOOLEAN DEFAULT FALSE,
  has_custom_lyrics BOOLEAN DEFAULT FALSE,
  custom_lyrics TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,

  -- Stripe
  stripe_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),

  -- Delivery
  delivery_url VARCHAR(500),
  delivered_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);

-- ============================================
-- DELIVERABLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('mp3', 'mp4', 'pdf', 'png', 'wav')),
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliverables_order ON deliverables(order_id);

-- ============================================
-- CUSTOMER LOYALTY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customer_loyalty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  tier VARCHAR(10) DEFAULT 'standard' CHECK (tier IN ('standard', 'vip')),
  purchase_count INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  first_purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  vip_since TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_email ON customer_loyalty(email);
CREATE INDEX IF NOT EXISTS idx_loyalty_tier ON customer_loyalty(tier);

-- ============================================
-- REFERRAL CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  created_by_email VARCHAR(255) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_email ON referral_codes(created_by_email);

-- ============================================
-- REFERRAL USAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS referral_usages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_code VARCHAR(20) NOT NULL,
  used_by_email VARCHAR(255) NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  discount_applied DECIMAL(10,2) NOT NULL,
  reward_earned DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_usage_code ON referral_usages(referral_code);

-- ============================================
-- OCCASION REMINDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS occasion_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  occasion_type VARCHAR(50) NOT NULL,
  occasion_date DATE NOT NULL,
  next_reminder_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_reminded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_email ON occasion_reminders(customer_email);
CREATE INDEX IF NOT EXISTS idx_reminders_next ON occasion_reminders(next_reminder_date) WHERE is_active = TRUE;

-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  source VARCHAR(50) -- 'exit_popup', 'footer', 'lead_magnet'
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_loyalty_updated_at ON customer_loyalty;
CREATE TRIGGER update_loyalty_updated_at
  BEFORE UPDATE ON customer_loyalty
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE occasion_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for server-side operations)
CREATE POLICY "Service role has full access to orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to deliverables"
  ON deliverables FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to customer_loyalty"
  ON customer_loyalty FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to referral_codes"
  ON referral_codes FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to referral_usages"
  ON referral_usages FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to occasion_reminders"
  ON occasion_reminders FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to newsletter_subscribers"
  ON newsletter_subscribers FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment to insert test data

-- INSERT INTO orders (order_number, status, customer_email, customer_name, recipient_name, occasion, story, genre, mood, package_type, base_price, total_price)
-- VALUES ('MM-TEST-0001', 'paid', 'test@example.com', 'Test User', 'Birthday Person', 'geburtstag', 'This is a test story for a birthday song.', 'pop', 4, 'plus', 79, 79);
