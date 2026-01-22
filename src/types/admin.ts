// Admin Dashboard Types

export interface PipelineStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: unknown;
  error?: string;
}

export interface PipelineResult {
  orderId: string;
  orderNumber: string;
  steps: PipelineStep[];
  finalStatus: 'success' | 'partial' | 'failed';
}

export interface PriorityAnalysis {
  priority: 'urgent' | 'high' | 'normal' | 'low';
  reasons: string[];
  suggestedDeadline: string | null;
  urgentPhrases: string[];
}

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'paid' | 'in_production' | 'quality_review' | 'delivered' | 'refunded';
  customer_email: string;
  customer_name: string;
  recipient_name: string;
  occasion: string;
  relationship?: string;
  story?: string;
  genre: string;
  mood?: number;
  allow_english?: boolean;
  package_type: string;
  selected_bundle?: string;
  bump_karaoke: boolean;
  bump_rush: boolean;
  bump_gift: boolean;
  has_custom_lyrics?: boolean;
  custom_lyrics?: string | null;
  base_price?: number;
  total_price: number;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string | null;
  delivery_url?: string | null;
  delivered_at?: string | null;
  created_at: string;
  updated_at: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low' | null;
  priority_reasons?: string[];
  suggested_deadline?: string | null;
  generated_prompt?: string | null;
}

export interface Deliverable {
  id: string;
  order_id: string;
  type: 'mp3' | 'mp4' | 'pdf' | 'png' | 'wav';
  file_url: string;
  file_name: string;
  created_at: string;
}

export interface BatchResult {
  success: { id: string; orderNumber: string }[];
  failed: { id: string; orderNumber: string; error: string }[];
}

export interface CampaignStep {
  id: string;
  campaign_id: string;
  template_id: string;
  step_order: number;
  delay_hours: number;
  delay_days: number;
  condition_type: string;
  condition_value: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables: string[];
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DripCampaign {
  id: string;
  name: string;
  slug: string;
  description?: string;
  trigger_event: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  campaign_steps?: CampaignStep[];
  stats?: {
    totalSent: number;
    openRate: number;
    clickRate: number;
    failedCount: number;
  };
}
