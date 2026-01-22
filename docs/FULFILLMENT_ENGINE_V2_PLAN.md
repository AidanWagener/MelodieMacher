# MelodieMacher Fulfillment Engine v2.0 - Implementation Plan

> **Created:** 2026-01-21
> **Status:** Approved for Implementation
> **Team:** BMAD Party Mode Session

---

## Executive Summary

Transform the basic admin fulfillment dashboard into an **AI-powered experience orchestration system** that handles 90% of work automatically while the admin focuses on the creative 10% (Suno song creation).

### Before vs After

| Before | After |
|--------|-------|
| Manual prompt writing | AI generates perfect Suno prompts |
| One order at a time | Batch process multiple orders |
| Basic download page | Immersive reveal experience |
| No share previews | Beautiful OG images |
| Manual everything | One-click pipeline (prompt → cover → PDF → video) |
| No priority insight | AI detects urgent orders |
| Single delivery email | Multi-day anticipation campaign |
| Fire and forget | Anniversary re-engagement |
| Manual QA | AI quality scoring |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OMNIPOTENT FULFILLMENT ENGINE v2.0                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         ADMIN DASHBOARD                              │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │    │
│  │  │ Order Queue │  │  AI Assist  │  │   Batch     │  │  Analytics │ │    │
│  │  │  + Priority │  │   Panel     │  │  Actions    │  │  Dashboard │ │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      AI ORCHESTRATION LAYER                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ Prompt       │  │ Cover        │  │ Video        │               │    │
│  │  │ Generator    │  │ Generator    │  │ Generator    │               │    │
│  │  │ (Gemini)     │  │ (Imagen)     │  │ (FFmpeg)     │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ PDF          │  │ Priority     │  │ Quality      │               │    │
│  │  │ Generator    │  │ Classifier   │  │ Scorer       │               │    │
│  │  │ (PDFKit)     │  │ (Gemini)     │  │ (ML Model)   │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      DELIVERY ORCHESTRATION                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ Drip         │  │ Experience   │  │ Anniversary  │               │    │
│  │  │ Campaign     │  │ Page         │  │ Scheduler    │               │    │
│  │  │ Engine       │  │ Generator    │  │              │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         DATA LAYER                                   │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│  │  │ Orders       │  │ Deliverables │  │ Campaigns    │               │    │
│  │  │ (Postgres)   │  │ (Storage)    │  │ (Postgres)   │               │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Immediate Wins

### Feature 1.1: AI Prompt Generator

**Purpose:** Auto-generate optimized Suno prompts from customer stories

**Files to Create/Modify:**
- `CREATE` `/src/app/api/admin/generate/prompt/route.ts`
- `MODIFY` `/src/app/admin/orders/[orderNumber]/page.tsx`

**API Specification:**

```typescript
// POST /api/admin/generate/prompt
interface PromptGeneratorRequest {
  orderId: string;
}

interface PromptGeneratorResponse {
  sunoPrompt: string;
  suggestedTags: string[];
  moodDescription: string;
  lyricsOutline: string;
}
```

**Gemini Prompt Template:**

```
You are an expert at creating Suno AI music prompts.

Given this customer order:
- Recipient: {recipient_name}
- Occasion: {occasion}
- Relationship: {relationship}
- Genre: {genre}
- Mood: {mood}/5 ({mood_label})
- Language: {allow_english ? "German or English" : "German only"}
- Story: {story}
{custom_lyrics ? "- Custom lyrics provided: " + custom_lyrics : ""}

Generate:
1. SUNO PROMPT: A detailed prompt for Suno (50-100 words) describing the song style, instrumentation, vocals, and feel
2. SUGGESTED TAGS: 5-8 Suno tags (e.g., "acoustic, heartfelt, female vocals")
3. MOOD: One-sentence mood description
4. LYRICS OUTLINE: Brief structure (Verse 1 theme, Chorus theme, etc.)

Output as JSON.
```

**Acceptance Criteria:**
- [ ] AC1: Button generates prompt in <3 seconds
- [ ] AC2: Prompt is copy-able with one click
- [ ] AC3: Tags are displayed as badges
- [ ] AC4: Works for all occasion types
- [ ] AC5: Handles German special characters

---

### Feature 1.2: Batch Approval

**Purpose:** Approve multiple ready orders with one click

**Files to Create/Modify:**
- `CREATE` `/src/app/api/admin/orders/batch/route.ts`
- `MODIFY` `/src/app/admin/page.tsx`

**API Specification:**

```typescript
// POST /api/admin/orders/batch
interface BatchActionRequest {
  action: 'approve' | 'generate_all' | 'deliver_all';
  orderIds: string[];
}

interface BatchActionResponse {
  success: string[];
  failed: { id: string; error: string }[];
}
```

**Acceptance Criteria:**
- [ ] AC1: Checkboxes appear on each order row
- [ ] AC2: "Select all" selects visible orders
- [ ] AC3: Batch action bar appears when >0 selected
- [ ] AC4: Batch deliver only processes orders with all deliverables
- [ ] AC5: Progress indicator shows batch progress
- [ ] AC6: Failed items reported individually

---

### Feature 1.3: Enhanced Delivery Experience Page

**Purpose:** Make the download page a beautiful "reveal" experience

**Files to Create/Modify:**
- `MODIFY` `/src/app/download/[orderNumber]/page.tsx`
- `CREATE` `/src/components/download/AudioPlayer.tsx`
- `CREATE` `/src/components/download/ShareCard.tsx`

**Key Features:**
- Hero section with album art (blurred background effect)
- Custom audio player with waveform visualization
- Story section showing the personal message
- Downloads grid for all files
- Share section with social buttons

**Acceptance Criteria:**
- [ ] AC1: Page loads with smooth animations
- [ ] AC2: Audio player works on mobile and desktop
- [ ] AC3: Album art displayed prominently
- [ ] AC4: Story excerpt shown beautifully
- [ ] AC5: All files downloadable
- [ ] AC6: Share buttons functional
- [ ] AC7: Page is responsive

---

### Feature 1.4: Social Share Cards (OG Images)

**Purpose:** Auto-generate beautiful share images for social media

**Files to Create/Modify:**
- `CREATE` `/src/app/api/og/[orderNumber]/route.tsx`
- `MODIFY` `/src/app/download/[orderNumber]/page.tsx` (metadata)

**Technology:** `@vercel/og` for dynamic image generation

**OG Image Specs:**
- Size: 1200x630px
- Content: Album art + recipient name + occasion + branding
- Style: Gradient background matching brand

**Acceptance Criteria:**
- [ ] AC1: OG image generates in <500ms
- [ ] AC2: Image shows album cover (if available)
- [ ] AC3: Recipient name displayed
- [ ] AC4: Occasion displayed
- [ ] AC5: MelodieMacher branding included
- [ ] AC6: Works on WhatsApp, Facebook, Twitter

---

## Phase 2: Short-Term (One-Click Magic)

### Feature 2.1: One-Click Full Pipeline

**Purpose:** Generate ALL deliverables with a single click

**Pipeline Flow:**

```
TRIGGER: Admin clicks "Alles generieren"
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 1: Generate Suno Prompt (Gemini)           ~2 sec  │
│ → Output: prompt + tags + mood                          │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Generate Album Cover (Imagen)           ~5 sec  │
│ → Output: PNG uploaded to Supabase                      │
└─────────────────────────────────────────────────────────┘
                    │
══════════════════════════════════════════════════════════
│ MANUAL STEP: Admin creates song in Suno using prompt    │
│              Admin uploads MP3                          │
══════════════════════════════════════════════════════════
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Generate Lyrics PDF (PDFKit)            ~1 sec  │
│ → Requires: Lyrics input (from Suno or manual)          │
│ → Output: PDF uploaded to Supabase                      │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 4: Generate Lyric Video (FFmpeg)          ~30 sec  │
│ → Requires: MP3 + Cover + Lyrics                        │
│ → Output: MP4 uploaded to Supabase                      │
└─────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 5: Ready for Delivery                              │
│ → All deliverables complete                             │
│ → Status: quality_review                                │
└─────────────────────────────────────────────────────────┘
```

**Files to Create/Modify:**
- `CREATE` `/src/app/api/admin/pipeline/route.ts`
- `MODIFY` `/src/app/admin/orders/[orderNumber]/page.tsx`

**Acceptance Criteria:**
- [ ] AC1: Single button starts pipeline
- [ ] AC2: Visual progress indicator for each step
- [ ] AC3: Prompt auto-copied to clipboard
- [ ] AC4: Pipeline pauses for manual MP3 upload
- [ ] AC5: Continues automatically after MP3 + lyrics
- [ ] AC6: Video generation works end-to-end
- [ ] AC7: All deliverables appear in list after completion

---

### Feature 2.2: Order Priority AI

**Purpose:** Automatically detect urgent orders and prioritize them

**Files to Create/Modify:**
- `CREATE` `/src/app/api/admin/orders/prioritize/route.ts`
- `MODIFY` `/src/app/admin/page.tsx`
- `MODIFY` Database schema (add priority columns)

**Database Changes:**

```sql
ALTER TABLE orders ADD COLUMN priority TEXT DEFAULT 'normal';
ALTER TABLE orders ADD COLUMN priority_reasons JSONB;
ALTER TABLE orders ADD COLUMN suggested_deadline TIMESTAMPTZ;
```

**Priority Levels:**
- `urgent` - Mentioned specific near date, rush language
- `high` - Rush purchased, occasion soon
- `normal` - Standard order
- `low` - No time pressure indicated

**Acceptance Criteria:**
- [ ] AC1: New orders auto-analyzed on load
- [ ] AC2: Priority badge visible in order list
- [ ] AC3: List sortable by priority
- [ ] AC4: Rush orders always marked high/urgent
- [ ] AC5: Deadline suggestions shown
- [ ] AC6: Urgent orders highlighted

---

### Feature 2.3: Auto-Video Pipeline

**Purpose:** Automatically generate lyric videos from MP3 + cover + lyrics

**Technology Options:**
- **Option A: Creatomate API** (Recommended for MVP) - ~$0.10-0.50/video
- **Option B: FFmpeg self-hosted** - Free but complex

**Files to Create/Modify:**
- `MODIFY` `/src/app/api/admin/generate/video/route.ts`
- `CREATE` `/src/lib/video/lyric-video-generator.ts`

**Acceptance Criteria:**
- [ ] AC1: Video generates from MP3 + cover + lyrics
- [ ] AC2: Lyrics appear synced (roughly) to audio
- [ ] AC3: Album art visible in video
- [ ] AC4: Output is MP4, playable on mobile
- [ ] AC5: Video uploaded to Supabase automatically
- [ ] AC6: Generation completes in <60 seconds

---

### Feature 2.4: Drip Campaign System

**Purpose:** Build anticipation with multi-day email sequence

**Campaign Timeline:**

| Day | Email | Content |
|-----|-------|---------|
| 0 | Confirmation | "Danke! Dein Song ist in Arbeit" |
| 1 | Progress 1 | "Unser Komponist arbeitet an deinem Song" |
| 2 | Progress 2 | "Dein Song nimmt Form an!" (if not delivered) |
| Delivery | Reveal | "🎵 Dein Song ist fertig!" |
| +7 | Feedback | "Wie kam der Song an?" |
| +365 | Anniversary | "Ein Jahr seit deinem besonderen Song" |

**Database Schema:**

```sql
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  campaign_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  current_step INT DEFAULT 0,
  next_send_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES email_campaigns(id),
  email_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ
);
```

**Files to Create/Modify:**
- `CREATE` `/src/lib/campaigns/drip-engine.ts`
- `CREATE` `/src/app/api/cron/drip-campaigns/route.ts`
- `CREATE` `/src/lib/email-templates/*.tsx` (5 templates)

**Acceptance Criteria:**
- [ ] AC1: Campaign auto-starts on order creation
- [ ] AC2: Emails sent on schedule (Day 0, 1, 2, +7)
- [ ] AC3: Delivery email bypasses drip if delivered early
- [ ] AC4: Campaign pauses if order cancelled/refunded
- [ ] AC5: Email opens/clicks tracked
- [ ] AC6: Admin can view campaign status

---

## Phase 3: Medium-Term (Intelligence Layer)

### Feature 3.1: ML Quality Scoring

**Purpose:** Auto-evaluate generated content quality

**Scoring Components:**
- Cover quality (Gemini vision analysis)
- Prompt relevance to story
- Lyrics match to request

**Auto-approve threshold:** Score >= 80 with no flags

**Files to Create:**
- `CREATE` `/src/lib/ai/quality-scorer.ts`
- `MODIFY` Order detail page (quality indicators)

---

### Feature 3.2: Anniversary Re-engagement System

**Purpose:** Remind customers on occasion anniversary

**Logic:**
- Store occasion_date with order
- Daily cron checks for upcoming anniversaries (±7 days)
- Send nostalgia email with discount offer

**Files to Create:**
- `CREATE` `/src/app/api/cron/anniversaries/route.ts`
- `CREATE` Anniversary email template

---

## Implementation Roadmap

### Sprint 1: Foundation (Week 1-2)

| Task | Effort | Dependencies |
|------|--------|--------------|
| 1.1 AI Prompt Generator API | 4h | Gemini API key |
| 1.1 Prompt Generator UI | 4h | API complete |
| 1.2 Batch selection UI | 3h | - |
| 1.2 Batch API endpoint | 3h | - |
| 1.4 OG Image generator | 4h | - |
| 1.4 Metadata updates | 2h | OG generator |

**Deliverable:** Admin can generate prompts with AI, batch select orders, share links have beautiful previews.

---

### Sprint 2: Experience (Week 3-4)

| Task | Effort | Dependencies |
|------|--------|--------------|
| 1.3 Audio player component | 6h | - |
| 1.3 Enhanced download page | 8h | Audio player |
| 1.3 Animations & polish | 4h | Page complete |
| 2.2 Priority analysis API | 4h | - |
| 2.2 Priority UI + sorting | 3h | API complete |
| DB: Add priority columns | 1h | - |

**Deliverable:** Beautiful download experience, orders auto-prioritized.

---

### Sprint 3: Pipeline (Week 5-6)

| Task | Effort | Dependencies |
|------|--------|--------------|
| 2.1 Pipeline orchestration API | 8h | All generators |
| 2.1 Pipeline UI component | 6h | API complete |
| 2.3 Video generation | 8h | API key or FFmpeg |
| Integration testing | 4h | All above |

**Deliverable:** One-click pipeline generates everything except manual Suno step.

---

### Sprint 4: Campaigns (Week 7-8)

| Task | Effort | Dependencies |
|------|--------|--------------|
| 2.4 Campaign DB schema | 2h | - |
| 2.4 Drip engine core | 6h | Schema |
| 2.4 Email templates (5) | 8h | - |
| 2.4 Cron job setup | 2h | Engine |
| 2.4 Campaign status UI | 4h | Engine |

**Deliverable:** Automated drip campaigns build anticipation.

---

### Sprint 5: Intelligence (Week 9-10)

| Task | Effort | Dependencies |
|------|--------|--------------|
| 3.1 Quality scoring API | 8h | - |
| 3.1 Auto-approve logic | 4h | Scoring |
| 3.1 Quality UI indicators | 3h | API |
| 3.2 Anniversary system | 6h | - |
| 3.2 Anniversary email | 2h | - |

**Deliverable:** AI quality scoring, anniversary re-engagement.

---

## Total Estimated Effort

**~120 hours** across 5 sprints (10 weeks)

---

## Technical Dependencies

| Dependency | Required For | Status |
|------------|--------------|--------|
| Gemini API Key | Prompt generation, Priority AI, Quality scoring | ✅ Have |
| Imagen API | Cover generation | ✅ Have (via Gemini) |
| Vercel OG | Share cards | Need to install |
| Creatomate API (optional) | Video generation | Need API key |
| FFmpeg (alternative) | Video generation | Need server setup |
| Resend | Email campaigns | ✅ Have |

---

## Success Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Time to fulfill order | ~30 min | ~5 min |
| Manual steps per order | 8+ | 2-3 |
| Customer share rate | Unknown | 20%+ |
| Repeat customer rate | Unknown | 15%+ |
| Admin satisfaction | N/A | High |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Gemini API rate limits | Implement caching, queue system |
| Video generation slow | Use async processing, show progress |
| Email deliverability | Use Resend best practices, monitor bounce rate |
| Suno changes their system | Keep manual override always available |

---

*Document generated by BMAD Party Mode - 2026-01-21*
