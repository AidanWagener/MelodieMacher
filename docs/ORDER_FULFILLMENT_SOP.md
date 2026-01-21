# MelodieMacher Order Fulfillment SOP
## Standard Operating Procedure v1.0

> **Purpose:** Step-by-step guide for fulfilling personalized song orders from payment to delivery.
>
> **Remember:** We're selling emotional moments, not MP3s. Every order is someone's wedding, birthday, anniversary. The delivery process IS the product.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│ FULFILLMENT QUICK REFERENCE                             │
├─────────────────────────────────────────────────────────┤
│ Premium: 12h deadline, MP3+MP4+Instrumental, 3 revs    │
│ Plus:    24h deadline, MP3+PDF+Cover, 2 revisions      │
│ Basis:   48h deadline, MP3 only, 1 revision            │
├─────────────────────────────────────────────────────────┤
│ +Rush:   Move to front of queue                         │
│ +Karaoke: Add instrumental version                      │
│ +Gift:   Create reveal page                             │
├─────────────────────────────────────────────────────────┤
│ Status Flow:                                            │
│ pending → paid → in_production → quality_review → delivered │
└─────────────────────────────────────────────────────────┘
```

---

## 1. ORDER RECEIPT (Automatic)

**When:** Stripe webhook fires `checkout.session.completed`

**What happens automatically:**
- [ ] Order status set to `paid` in Supabase
- [ ] Customer receives confirmation email
- [ ] Slack notification sent to `#orders` channel
- [ ] Referral code generated for customer

**You verify:**
- [ ] Slack notification received
- [ ] Order visible in Supabase dashboard
- [ ] All order details captured (story, genre, mood, recipient name)

---

## 2. ORDER TRIAGE (Manual - Within 15 minutes)

**Goal:** Assign priority and start the clock

### Step-by-step:

1. **Open Slack notification**

2. **Check package type and calculate deadline:**

   | Package | Clock Starts | Deadline |
   |---------|--------------|----------|
   | Premium | Payment time | +12 hours |
   | Plus | Payment time | +24 hours |
   | Basis | Payment time | +48 hours |
   | +Rush | Any package | Move to front of queue |

3. **Check for special requirements:**
   - [ ] Custom lyrics provided? (`has_custom_lyrics = true`)
   - [ ] Allow English? (`allow_english = true`)
   - [ ] Karaoke version needed? (`bump_karaoke = true`)
   - [ ] Gift package? (`bump_gift = true`)

4. **Update order status** in Supabase: `paid` → `in_production`

---

## 3. SONG CREATION (Manual - Core Fulfillment)

**Goal:** Create personalized song matching customer specifications

### Inputs from order:

| Field | Description | Location |
|-------|-------------|----------|
| `recipient_name` | Who the song is for | Order details |
| `occasion` | Wedding/Birthday/Anniversary/etc. | Order details |
| `relationship` | Customer's relationship to recipient | Order details |
| `story` | The personal story (50-2000 chars) | Order details |
| `genre` | Pop/Rock/Schlager/Akustik/HipHop/Klassik/Kinder/Electronic/Jazz/Volksmusik | Order details |
| `mood` | 1-5 scale (1=melancholic, 5=energetic) | Order details |
| `custom_lyrics` | Customer-provided lyrics if any | Order details |

### Creation checklist:

- [ ] Read the full story carefully
- [ ] Identify 3-5 key emotional moments/details to include
- [ ] Match genre to occasion appropriately
- [ ] Create song in Suno with specifications
- [ ] Generate MP3 output
- [ ] If Premium: Generate MP4 video version
- [ ] If Premium: Generate instrumental version
- [ ] If Karaoke purchased: Generate karaoke/instrumental version
- [ ] If Plus/Premium: Create album cover image
- [ ] If Plus/Premium: Create lyrics PDF document

### Genre Guidelines:

| Genre | Best For | Mood Range |
|-------|----------|------------|
| Pop | Universal, modern feel | 2-5 |
| Rock | Energetic celebrations | 3-5 |
| Schlager | Traditional German events | 3-5 |
| Akustik/Folk | Intimate, personal moments | 1-4 |
| Hip-Hop | Young, modern recipients | 3-5 |
| Klassik | Elegant, formal occasions | 1-3 |
| Kinder | Children's songs | 3-5 |
| Electronic | Party, club vibes | 4-5 |
| Jazz | Sophisticated, romantic | 2-4 |
| Volksmusik | Traditional, heimatlich | 3-4 |

---

## 4. QUALITY REVIEW (Manual - Before Delivery)

**Goal:** Ensure song meets quality standards before customer sees it

**Update status:** `in_production` → `quality_review`

### QA Checklist:

**Audio Quality:**
- [ ] Song duration appropriate (2-4 minutes)
- [ ] Audio quality clean (no artifacts, distortion)
- [ ] Volume levels consistent
- [ ] No abrupt cuts or transitions

**Content Quality:**
- [ ] Lyrics mention recipient name correctly (spelling & pronunciation)
- [ ] Lyrics reference specific story details provided
- [ ] Genre matches customer selection
- [ ] Mood appropriate for occasion
- [ ] Language correct (German unless `allow_english = true`)

**Deliverable Quality:**
- [ ] If video (Premium): Visual quality acceptable, synced to audio
- [ ] If karaoke: Instrumental clean without vocal bleed
- [ ] If album cover: Professional appearance, occasion-appropriate
- [ ] If lyrics PDF: Formatted correctly, no typos

### Revision Triggers (Redo Required):

- Name pronounced/spelled incorrectly
- Key story details missing from lyrics
- Wrong genre or significantly wrong mood
- Technical audio issues (clicks, pops, distortion)
- Video out of sync (Premium)
- Vocals audible in karaoke version

---

## 5. DELIVERY PREPARATION (Manual)

**Goal:** Package all deliverables for customer

### Deliverables by Package:

| Deliverable | Basis | Plus | Premium |
|-------------|-------|------|---------|
| MP3 Download | Yes | Yes | Yes |
| Lyrics PDF | No | Yes | Yes |
| Album Cover | No | Yes | Yes |
| MP4 Video | No | No | Yes |
| Instrumental | No | No | Yes |
| Karaoke Version | If purchased | If purchased | If purchased |

### Add-on Deliverables:

| Add-on | Deliverable |
|--------|-------------|
| +Karaoke (19 EUR) | Instrumental with on-screen lyrics |
| +Gift (15 EUR) | Digital gift card + surprise reveal page |
| +Rush (29 EUR) | No additional deliverable, priority only |

### Upload Checklist:

- [ ] Upload all files to secure storage (Supabase Storage or similar)
- [ ] Generate time-limited download links (7-day expiry recommended)
- [ ] If Gift Package: Create and test gift reveal page
- [ ] Record all deliverables in `deliverables` table with:
  - `order_id`
  - `type` (mp3/mp4/pdf/png/wav)
  - `file_url`
  - `file_name`

---

## 6. DELIVERY (Semi-Automatic)

**Goal:** Send completed song to customer

### Steps:

1. **Update order in Supabase:**
   - Status: `quality_review` → `delivered`
   - Set `delivery_url` to main download link
   - Set `delivered_at` to current timestamp

2. **Trigger delivery email** with:
   - Personalized greeting using customer name
   - Download link(s) for all deliverables
   - Customer's referral code for sharing
   - Thank you message

3. **Verify delivery:**
   - [ ] Email sent successfully (check Resend dashboard)
   - [ ] Download links working
   - [ ] If Gift: Reveal page accessible

### Email Template Reference:

The system uses `songDeliveryWithReferralTemplate` from `src/lib/notifications.ts`:
- From: `MelodieMacher <hallo@melodiemacher.de>`
- Subject: `Dein Song ist fertig! - [Song Title]`
- Includes: Download link, referral code, referral link

---

## 7. POST-DELIVERY

### Automatic (System Handles):

- Customer receives referral code (`FREUND-XXXX`)
- VIP status checked (2+ purchases = VIP tier)
- Purchase recorded in `customer_loyalty` table

### Manual Follow-up (24h After Delivery):

- [ ] Check for customer response/feedback via email
- [ ] Address any revision requests within package limits
- [ ] If Gift Package: Confirm reveal page was used/viewed
- [ ] If positive feedback: Request review/testimonial

### Revision Limits:

| Package | Revisions Included |
|---------|-------------------|
| Basis | 1 revision |
| Plus | 2 revisions |
| Premium | 3 revisions |

---

## 8. EXCEPTION HANDLING

### Missed Deadline Protocol:

1. **Contact customer immediately** via email:
   - Apologize sincerely
   - Give realistic new ETA
   - Offer compensation (discount code for next order)

2. **Document in Slack `#escalations`:**
   - Order ID
   - Original deadline
   - Reason for delay
   - Resolution offered

3. **Prevent recurrence:**
   - Review workload distribution
   - Consider Rush queue adjustments

### Revision Request Handling:

1. Check remaining revision count for package
2. If revisions available:
   - Acknowledge request within 2 hours
   - Complete revision within 12 hours
   - Decrement revision count
3. If revisions exhausted:
   - Offer additional revision for 29 EUR
   - Or partial refund if quality issue

### Refund Request Protocol:

1. **Verify delivery status** - was song delivered?
2. **Check revision history** - were revisions offered/used?
3. **Assess validity:**
   - Quality issue not resolved → Full refund
   - "Changed mind" → No refund (waiver signed)
   - Partial satisfaction → Partial refund negotiable

4. **Escalate to owner** for approval if:
   - Refund amount > 50 EUR
   - Customer threatening public complaint
   - Unclear situation

5. **Process via Stripe dashboard** once approved

### Customer Complaint Protocol:

1. Respond within 2 hours
2. Acknowledge feelings, don't be defensive
3. Offer concrete solution
4. Follow up until resolved
5. Document in `#escalations`

---

## 9. ESCALATION MATRIX

| Situation | Escalate To | Timeframe |
|-----------|-------------|-----------|
| Deadline at risk | Owner | 4 hours before deadline |
| Customer complaint | Owner | Immediately |
| Refund request > 50 EUR | Owner | Same day |
| Technical issue blocking delivery | Owner | Immediately |
| Negative public review | Owner | Within 1 hour |

---

## 10. METRICS TO TRACK

### Key Performance Indicators:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Triage time | < 15 min | Payment → `in_production` |
| Deadline hit rate | > 98% | Delivered within SLA |
| Revision rate | < 20% | Orders requiring revision |
| Customer satisfaction | > 4.5/5 | Follow-up survey |
| Refund rate | < 2% | Refunds / Total orders |

### Daily Review:

- [ ] All orders in `paid` status triaged?
- [ ] Any deadlines at risk in next 12 hours?
- [ ] All `quality_review` orders ready for delivery?
- [ ] Any open customer issues?

---

## 11. GDPR/DSGVO COMPLIANCE

### Data Handling Requirements:

1. **Personal Story Data:**
   - Contains personal information about recipient
   - Keep only as long as needed for revisions (30 days max)
   - Anonymize or delete after 30 days post-delivery

2. **Download Links:**
   - Must be time-limited (7-day expiry)
   - No permanent public URLs with personal content
   - Use signed URLs with expiration

3. **Customer Consent:**
   - Customer accepted terms (`acceptTerms: true`)
   - Customer accepted privacy policy (`acceptPrivacy: true`)
   - Customer waived withdrawal right (`waiveWithdrawal: true`)

4. **What "Waiver" Means:**
   - No "I changed my mind" refunds allowed
   - Quality issues still warrant refunds
   - Does not waive consumer protection rights

---

## 12. TOOLS & ACCESS NEEDED

### Required Access:

| Tool | Purpose | Access Level |
|------|---------|--------------|
| Supabase | Order database | Read/Write |
| Stripe | Payment verification | Read only |
| Resend | Email delivery | Send access |
| Slack | Notifications | #orders, #escalations |
| Suno | Song creation | Full access |
| File Storage | Deliverable hosting | Upload access |

### Useful Links:

- Supabase Dashboard: [Your Supabase URL]
- Stripe Dashboard: https://dashboard.stripe.com
- Resend Dashboard: https://resend.com/emails
- Slack Workspace: [Your Slack URL]

---

## Appendix A: Order Status Reference

```
┌──────────────────────────────────────────────────────────────┐
│ ORDER STATUS FLOW                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐    ┌──────┐    ┌───────────────┐               │
│  │ pending │───>│ paid │───>│ in_production │               │
│  └─────────┘    └──────┘    └───────────────┘               │
│       │              │              │                        │
│       │         Webhook         Manual                       │
│       │         fires           triage                       │
│       │                             │                        │
│       │                             v                        │
│       │                    ┌────────────────┐                │
│       │                    │ quality_review │                │
│       │                    └────────────────┘                │
│       │                             │                        │
│       │                          QA pass                     │
│       │                             │                        │
│       │                             v                        │
│       │                    ┌───────────┐                     │
│       │                    │ delivered │                     │
│       │                    └───────────┘                     │
│       │                                                      │
│       v                                                      │
│  ┌──────────┐                                               │
│  │ refunded │  (Exception path)                             │
│  └──────────┘                                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Appendix B: Email Templates Quick Reference

### Order Confirmation (Automatic):
- **Trigger:** `checkout.session.completed`
- **Subject:** `Bestellbestaetigung - Dein Song fuer [Recipient] ([OrderID])`
- **Includes:** Order summary, delivery timeline, what happens next

### Song Delivery:
- **Trigger:** Manual, after QA
- **Subject:** `Dein Song ist fertig! - [Song Title]`
- **Includes:** Download link, referral code, thank you

---

## Appendix C: Emotional Quality Checklist

Before clicking "Deliver", ask yourself:

- [ ] Would YOU be moved if you received this song?
- [ ] Does it feel personal, not generic?
- [ ] If the recipient cried happy tears, would you be surprised?
- [ ] Would you be proud to share this as an example of our work?

**Remember: Every order is someone's moment.**

---

*SOP Version 1.0 - Created January 2026*
*Review and update quarterly or after process changes*
