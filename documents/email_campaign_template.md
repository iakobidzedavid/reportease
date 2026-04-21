# ReportEase Cold Outreach Email Campaign Template
**Campaign:** Apollo 20 Agencies - MVBP Trial Offer  
**Created:** 2026-04-21  
**Target Market:** Digital Marketing Agencies (CMO/Marketing Director roles)  
**Expected Send Date:** Upon email data enrichment  

---

## Campaign Overview

This document provides the complete, production-ready email template for the cold outreach campaign to 20 verified CMO/Marketing Director prospects. The template uses personalization variables that will be merged with actual contact data at send time.

---

## Email Template: Version 1 (Primary)

### Subject Line
```
Reclaim 6+ hours/week: [AGENCY_NAME] + ReportEase
```

**Subject Line Variants (for A/B testing, optional):**
- `[AGENCY_NAME]'s manual reporting is costing you 6+ hours/week`
- `Stop drowning in weekly client reports — [AGENCY_NAME]`
- `How [AGENCY_NAME] cuts reporting time by 75%`

---

### Email Body

```
Hi [CONTACT_NAME],

I was researching digital marketing agencies in the 10-50 person range when I noticed 
[AGENCY_NAME] — and I realized something: you're probably spending 6-8 hours every 
single week building client reports manually.

Most marketing managers we talk to say the same thing:
• Weekly client reports take forever to pull together
• Copy-pasting data from Google Analytics, HubSpot, ad platforms causes errors
• Stakeholders want interactive dashboards, not static PDFs
• You'd rather spend time on strategy than data-entry busy work

We built ReportEase specifically for this. It's an AI-powered reporting assistant 
that pulls data from all your marketing platforms and generates polished client 
reports automatically — with interactive dashboards stakeholders actually love.

Here's what [AGENCY_NAME] could get:

✓ 6+ hours/week back in your calendar (no more manual report building)
✓ Zero data-entry errors (automated data validation across platforms)
✓ Interactive dashboards your clients will actually use (not another PDF)
✓ Scheduled reports that send automatically to clients every Monday (or whenever you want)

We're offering a free 7-day trial specifically for agencies like yours. You'll get:
- Instant setup with your existing tools (Google Analytics, HubSpot, LinkedIn Ads, Google Ads, etc.)
- Pre-built report templates designed for agency clients
- Real-time dashboard syncing across all your platforms

No credit card required. No long sales call. Just a real product you can test.

[TRY FREE FOR 7 DAYS]
https://reportease.com/ads/agency-reporting?utm_source=email&utm_medium=outreach&utm_campaign=apollo_20_agencies

In 10 minutes, you'll see exactly how much time you can save this week.

Best,
[SENDER_NAME]
Chief Strategy Officer
ReportEase — Your Time-Saving Reporting Assistant
www.reportease.com
```

---

### Email Component Breakdown

#### Pain Point Opening (Paragraph 1-2)
**Purpose:** Establish relevance by calling out a specific, shared problem  
**Technique:** Research-backed stat + personal observation + emotional resonance  
**Personalization:** `[AGENCY_NAME]`, agency size context

#### Social Proof / Problem Validation (Bullet points)
**Purpose:** Show you understand their exact situation  
**Technique:** Specific pain points from target persona  
**Credibility:** "Most marketing managers we talk to say..."

#### Solution Introduction (Paragraph 3)
**Purpose:** Briefly explain what ReportEase does and why it's different  
**Technique:** Product intro without jargon, emphasize automation  
**Hook:** "specifically for this" (shows relevance)

#### Value Proposition List (4 checkmarks)
**Purpose:** Highlight the 3 main value props + quantify the benefit  
**Framework:** Time savings → Accuracy → Visualization  
**Metrics:** 6+ hours, zero errors, interactive dashboards

#### Trial Offer (Call to Action)
**Purpose:** Lower friction for first engagement  
**Technique:** Free trial (no credit card) + specific benefit (7 days) + speed of value realization (10 minutes)  
**Design:** Big CTA button with UTM-tracked link

#### Signature
**Purpose:** Build trust with real person/company info  
**Elements:** Name, title, company, website

---

## Personalization Variables

| Variable | Source | Example | Required |
|---|---|---|---|
| `[AGENCY_NAME]` | Apollo JSON: `company_name` | "People Media Worldwide" | YES |
| `[CONTACT_NAME]` | Apollo JSON: `contact_name` | "John" | YES |
| `[CONTACT_EMAIL]` | Apollo enriched data: `email` | "john@peoplemedia.com" | YES ⚠️ MISSING |
| `[SENDER_NAME]` | Campaign config | "David Cohen" | YES |

---

## Campaign Settings

### Email Scheduling
- **Sending Tool:** Gmail API (pica_gmail_send_email)
- **Send Frequency:** All 20 emails within 1 hour window
- **Stagger Timing:** 1-2 minute delays between sends
- **Optimal Send Day/Time:** Tuesday-Thursday, 9-11 AM recipient timezone
- **Timezone Handling:** TBD based on contact location data

### Tracking & Analytics

#### Email Opens
- **Method:** Gmail read receipts (if enabled)
- **Tracking Pixel:** Standard Gmail open tracking
- **Metric:** `open_status` (yes/no)
- **Baseline Expectation:** 20-35% open rate

#### Link Clicks
- **Method:** UTM parameter tracking in Google Analytics
- **Landing Page:** https://reportease.com/ads/agency-reporting
- **UTM Parameters:**
  - `utm_source=email`
  - `utm_medium=outreach`
  - `utm_campaign=apollo_20_agencies`
- **Metric:** `click_status` (yes/no)
- **Baseline Expectation:** 2-5% click rate

#### Email Replies
- **Method:** Gmail inbox monitoring + manual classification
- **Tracking:** All replies to campaign emails
- **Metric:** `reply_status` (yes/no)
- **Secondary metric:** `reply_text` (captured reply content)
- **Baseline Expectation:** 1-3% reply rate

#### Trial Signups
- **Method:** Google Analytics UTM tracking
- **Landing Page Goal:** Form submission on /ads/agency-reporting
- **Tracking:** Session ID from email click → signup
- **Metric:** Trial signup conversion rate
- **Baseline Expectation:** 5-15% of clickers sign up

---

## Campaign Results Recording

### CSV Output Structure
**File:** `data/email_campaign_results.csv`

```csv
contact_email,agency_name,contact_name,sent_timestamp,open_status,click_status,reply_status,reply_text,trial_signup
[email],[agency],[name],[timestamp],[yes/no],[yes/no],[yes/no],[reply text],[yes/no]
```

**Fields:**
- `contact_email`: [FROM_APOLLO: enriched contact data]
- `agency_name`: [FROM_APOLLO: company_name]
- `contact_name`: [FROM_APOLLO: contact_name]
- `sent_timestamp`: [GENERATED: ISO 8601 timestamp of send]
- `open_status`: [MEASURED: gmail open receipt]
- `click_status`: [MEASURED: GA UTM click]
- `reply_status`: [MEASURED: gmail reply detection]
- `reply_text`: [CAPTURED: actual reply content]
- `trial_signup`: [MEASURED: GA conversion tracking]

---

## Expected Campaign Metrics

### Email Delivery
- **Bounce Rate:** Expected 0-5% (Apollo verified addresses)
- **Spam Rate:** Expected 2-8% (cold outreach baseline)
- **Deliverability:** Expected 90%+ inbox placement

### Engagement Metrics
| Metric | Calculation | Expected | Baseline |
|---|---|---|---|
| Open Rate | Opens / Sent | 4-7 opens | 20-35% |
| Click Rate | Clicks / Sent | 0-1 click | 2-5% |
| Reply Rate | Replies / Sent | 0-1 reply | 1-3% |
| Trial Signup Rate | Signups / Clickers | 0-1 signup | 5-15% |
| Response Diversity | Replies / Contacts | — | Vary by pain point |

### Success Criteria
- ✅ **Success:** 1+ trial signups, 2+ replies, 3+ clicks
- ⚠️ **Moderate:** 3+ opens, but < 1 reply
- ❌ **Needs Optimization:** < 2 opens, 0 replies, 0 clicks

---

## Pain Point Variations (For Message A/B Testing)

If follow-up campaigns are needed, test these pain point angles:

### Variant A: Time Savings Focus (Current)
**Angle:** "6+ hours/week back in your calendar"  
**Subject:** "Reclaim 6+ hours/week: [Agency Name] + ReportEase"  
**Emotion:** Relief, freedom, productivity  

### Variant B: Accuracy Focus
**Angle:** "Eliminate manual data-entry errors"  
**Subject:** "[Agency Name]: Stop manual reporting errors"  
**Emotion:** Confidence, trust, quality  

### Variant C: Visualization Focus
**Angle:** "Interactive dashboards that impress stakeholders"  
**Subject:** "How [Agency Name] presents smarter client reports"  
**Emotion:** Professionalism, impression, credibility  

### Variant D: ROI Focus
**Angle:** "$X savings / team member / year"  
**Subject:** "[Agency Name]: Calculate your reporting ROI"  
**Emotion:** Numbers, clear business case  

---

## Landing Page Requirements

**URL:** https://reportease.com/ads/agency-reporting

**Must-Have Elements:**
- ✅ Headline matching email subject line tone
- ✅ Hero image showing time savings (6+ hours/week)
- ✅ Trust badges: "Used by 20+ agencies," customer logos
- ✅ Trial signup form (email, company name, platform integrations)
- ✅ 3-step onboarding flow (setup → connect → first report)
- ✅ FAQ addressing objections ("How long to set up?" "Which platforms?")
- ✅ CTAs aligned with email message
- ✅ Google Analytics conversion tracking for trial form submission

**Tracking Requirements:**
- Google Analytics with UTM parameters
- Conversion event: "trial_signup" on form submission
- Session tracking to correlate email→click→signup

---

## Follow-Up Sequence (Post-Campaign)

### If No Reply (Day 3)
**Task:** Send follow-up email to non-responders with different pain point angle  
**Frequency:** 1 follow-up per contact  
**Content:** New subject line, new pain point variant

### If Opens But No Click (Day 5)
**Task:** Send SMS follow-up (if phone data available) or LinkedIn DM  
**Content:** Short message: "Saw you opened our email about agency reporting. Questions?"

### If Clicks But No Signup (Day 7)
**Task:** Email: "Quick question about your reporting setup..."  
**Content:** Address potential objections (integrations, setup time, pricing)

### If Signup (Day 1)
**Task:** Welcome sequence to 7-day trial  
**Content:** Onboarding emails, product tips, success metrics

---

## Campaign Communication Log

**Campaign Manager:** ReportEase CEO Agent  
**Framework:** Disciplined Entrepreneurship (DE Step 21: Test Key Assumptions)  
**Hypothesis Being Tested:**  
> "CMOs/Marketing Managers at 10-50 person digital agencies will engage with (2%+ click rate) and convert on (1%+ trial signup) cold outreach focused on time savings + accuracy."

**Data Collection Points:**
1. Email open rate (validates message relevance)
2. Click rate (validates landing page appeal)
3. Reply rate (validates conversation interest)
4. Trial signup rate (validates product value)

**Success Definition:**
- Open rate ≥ 20% (validates relevance)
- Click rate ≥ 2% (validates landing page fit)
- Trial signups ≥ 1 (validates product interest)
- Reply rate ≥ 1% (validates conversation opportunity)

---

## Production Checklist

Before sending, verify:

- [ ] All 20 Apollo prospects have valid email addresses in enriched dataset
- [ ] Email template personalization variables match JSON field names
- [ ] UTM parameters are correct and linked to GA campaign
- [ ] Landing page /ads/agency-reporting exists and has conversion tracking
- [ ] Gmail API authentication is configured
- [ ] Sender email address is verified and whitelisted
- [ ] Email content has been spam-checked (Grammarly, etc.)
- [ ] Staggered send schedule is configured (1-2 min delays)
- [ ] Results CSV template is ready to receive data
- [ ] Google Analytics is tracking UTM parameters
- [ ] Team is ready to monitor inbox for replies

---

## Notes & Assumptions

1. **Email Addresses:** Campaign is BLOCKED until Apollo enriched data includes actual email field
2. **Timezone Handling:** Currently TBD based on contact location data
3. **Lead Scoring:** No scoring system yet; all 20 prospects treated equally
4. **Reply Routing:** Replies will be monitored in CEO Agent inbox
5. **Follow-up:** Sequence to be triggered automatically based on engagement
6. **Unsubscribe:** Gmail will include unsubscribe option per CAN-SPAM requirements

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-21  
**Next Review:** Post-campaign (after send + 7 days tracking)
