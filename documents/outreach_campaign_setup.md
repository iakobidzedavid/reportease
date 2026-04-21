# ReportEase MVBP Outreach Campaign Setup
## 20-Prospect Cold Email Sequence with Tracking

**Campaign Start Date:** April 22, 2026  
**Campaign Duration:** 4 days (batched sends) + 14 days tracking + 7-day follow-up  
**Total Duration:** 25 days  
**Objective:** Validate MVBP demand, drive trial signups, collect engagement metrics  

---

## CAMPAIGN ARCHITECTURE

### Phase 1: Email Sends (Days 1-4)
- 20 total emails across 4 batches (5 per batch)
- Staggered by 15 minutes within each batch to avoid spam filter
- Personalized subject lines and body copy based on prospect profile
- Template selection based on prospect seniority and industry

### Phase 2: Tracking (Days 1-7)
- Monitor open rates in real-time
- Track link clicks via UTM parameters
- Capture replies automatically via Gmail API

### Phase 3: Follow-Up (Days 7-14)
- Send follow-up emails to non-openers (Day 7)
- Send secondary follow-up to no-responders (Day 14)

### Phase 4: Analysis (Day 21+)
- Aggregate metrics into outreach_metrics.csv
- Calculate open rate, click rate, reply rate, conversion rate
- Segment by template, subject line, prospect seniority

---

## PROSPECT SEGMENTATION STRATEGY

### Segmentation Criteria

**By Seniority:**
- **Tier 1 (Decision-maker):** CEO, Founder, Founder/CEO, Owner, President, CMO
  - Template: Resource Constraint (#5) or White-Labeling (#3)
  - Expected response: Higher, more qualified
  
- **Tier 2 (Influencer):** VP Marketing, Director of Operations, Head of Client Success, VP Strategy
  - Template: Accuracy (#2) or White-Labeling (#3)
  - Expected response: Medium-high, technical questions
  
- **Tier 3 (End User):** Marketing Manager, Operations Manager, Content Manager, Account Manager
  - Template: Time Savings (#1) or Integration Simplicity (#4)
  - Expected response: Medium, immediate pain point

### By Industry Vertical (if visible in Apollo):
- **E-commerce agencies:** Lead with Accuracy (#2), ROI calculation
- **B2B/SaaS agencies:** Lead with Time Savings (#1), scalability
- **Local services agencies:** Lead with White-Labeling (#3), premium positioning
- **Paid media specialists:** Lead with Accuracy (#2), data validation

### By Company Size:
- **10-20 people:** Time Savings focus (most acute pain)
- **20-35 people:** Accuracy or Resource Constraint (operational complexity increases)
- **35-50 people:** White-Labeling or Premium Positioning (scaling challenges, client expectations)

---

## EMAIL SEND SCHEDULE

### Batch 1: Monday, April 22, 9:00 AM PT
**Prospects:** Top 5 by Apollo engagement score
**Template Mix:** 
- 3x Template 1 (Time Savings) — marketing managers
- 1x Template 2 (Accuracy) — ops leader
- 1x Template 5 (Resource Constraint) — owner/CMO

**Subject Lines (A/B Test):**
- 2x "What if reporting took 30 minutes instead of 6 hours?"
- 2x "6 hours/week [Company] could reclaim — starting today"
- 1x "Could your team do more with the same headcount?"

**Send Timing:** 9:00 AM, 9:15 AM, 9:30 AM, 9:45 AM, 10:00 AM (5-min intervals)

---

### Batch 2: Tuesday, April 23, 9:00 AM PT
**Prospects:** Next 5 prospects (engagement score 6-10)
**Template Mix:**
- 2x Template 2 (Accuracy) — ops/quality-focused
- 2x Template 3 (White-Labeling) — strategic/premium agencies
- 1x Template 1 (Time Savings) — marketing manager

**Subject Lines:**
- "Reducing reporting errors at [Company]"
- "[Company]'s competitive edge: white-labeled dashboards"
- "Quick question about [Company]'s reporting process"

**Send Timing:** 9:00 AM, 9:15 AM, 9:30 AM, 9:45 AM, 10:00 AM

---

### Batch 3: Wednesday, April 24, 9:00 AM PT
**Prospects:** Next 5 prospects (engagement score 1-5)
**Template Mix:**
- 1x Template 4 (Integration Simplicity) — tech-focused
- 2x Template 1 (Time Savings) — marketing managers
- 1x Template 5 (Resource Constraint) — owner-level
- 1x Template 2 (Accuracy) — ops

**Subject Lines:** Mix of highest-performing from Batches 1-2

**Send Timing:** 9:00 AM, 9:15 AM, 9:30 AM, 9:45 AM, 10:00 AM

---

### Batch 4: Thursday, April 25, 9:00 AM PT
**Prospects:** Final 5 prospects
**Template Mix:** Based on best-performing templates from Batches 1-3

**Subject Lines:** Only top 2-3 performing subject lines from earlier batches

**Send Timing:** 9:00 AM, 9:15 AM, 9:30 AM, 9:45 AM, 10:00 AM

---

## EMAIL CONTENT CUSTOMIZATION CHECKLIST

For each email send, verify:

- [ ] Prospect's first name inserted in greeting
- [ ] Prospect's company name in body (exact spelling)
- [ ] Industry/vertical mentioned if visible in Apollo profile
- [ ] Company size reflected in time/ROI calculations (e.g., "for a 25-person agency")
- [ ] Email signature includes sender name, title, phone, email
- [ ] Trial link is functional and includes proper UTM parameters
- [ ] Calendar link is functional for demo booking
- [ ] No generic language like "[Company]" remaining in body
- [ ] Subject line matches selected template
- [ ] Tone matches persona (executive vs. manager vs. technical)

---

## TRACKING CONFIGURATION

### Open Tracking (Gmail API)

**Implementation:**
- Add 1x1 pixel to email HTML footer
- Pixel calls Gmail API endpoint to log read event
- Method: `GET /gmail/v1/users/me/messages/{messageId}/attachments/{attachmentId}`

**Data Captured:**
- `email_id` — Unique ID for this email
- `recipient_email` — Prospect's email address
- `open_timestamp` — When email was first opened
- `open_count` — Total number of opens
- `device_type` — Desktop, mobile, tablet (inferred from user-agent)
- `email_client` — Gmail, Outlook, Apple Mail, etc. (inferred from headers)

**Example Tracking Pixel:**
```html
<img src="https://reportease.com/api/tracking/open?email_id=email_001&recipient=prospect@company.com" 
     width="1" height="1" alt="" />
```

### Click Tracking (UTM Parameters)

**All CTAs include UTM parameters:**
```
[TRIAL_LINK] → 
https://reportease.com/trial?
  utm_source=email_outreach
  &utm_medium=cold_email
  &utm_campaign=mvbp_trial_april_2026
  &utm_content=[template_name]
  &email=[recipient_email]
  &batch=[batch_number]

[CALENDAR_LINK] →
https://calendly.com/reportease/15min?
  utm_source=email_outreach
  &utm_medium=cold_email
  &utm_campaign=mvbp_trial_april_2026
  &utm_content=[template_name]
  &email=[recipient_email]
```

**Data Captured:**
- `click_timestamp` — When link was clicked
- `link_url` — Which CTA was clicked (trial vs. demo)
- `recipient_email` — Which prospect clicked
- `template_name` — Which email template drove the click
- `time_to_click` — Hours between send and click

### Reply Tracking (Gmail API + Label Automation)

**Implementation:**
- All outreach emails sent from `outreach@reportease.com`
- Replies automatically labeled with `mvbp_responses`
- Gmail rule: "If FROM: any address AND TO: outreach@reportease.com, APPLY LABEL: mvbp_responses"

**Data Captured:**
- `reply_timestamp` — When prospect replied
- `reply_from` — Prospect's email address
- `reply_body` — Full text of reply
- `sentiment` — Positive, Neutral, Objection (auto-classified)
- `time_to_reply` — Hours between send and first reply

**Sentiment Classification Rules:**
- **Positive:** "interested," "sounds great," "let's talk," "15 minutes works," "when are you free," "I'll try it," "this is exactly what we need"
- **Neutral:** "thanks for reaching out," "interesting," "will review," "maybe," "could be useful"
- **Objection:** "too expensive," "already using," "not right now," "unsubscribe," "no thanks," "we're all set"

---

## REAL-TIME DASHBOARD (Google Sheets Integration)

**Live Tracking Sheet:** `MVBP_Outreach_Metrics_2026_04_22`

**Columns:**
| Field | Type | Notes |
|-------|------|-------|
| Batch | Number | 1-4 |
| Recipient Email | Email | Prospect's email |
| Recipient Name | Text | First name |
| Company | Text | Prospect's company |
| Seniority | Dropdown | Tier 1/2/3 |
| Template Used | Dropdown | 1-5 |
| Subject Line | Text | Subject line sent |
| Send Time | Timestamp | UTC timestamp |
| Email ID | Text | Unique ID for tracking |
| Opened | Boolean | Yes/No (via pixel) |
| Open Count | Number | Total opens |
| First Open Time | Timestamp | When first opened |
| Clicked | Boolean | Yes/No (via UTM) |
| CTA Clicked | Dropdown | Trial, Demo, or None |
| Click Time | Timestamp | When CTA clicked |
| Time to Click | Number | Hours between send and click |
| Replied | Boolean | Yes/No (via Gmail label) |
| Reply Time | Timestamp | When first reply received |
| Reply Content | Text | First 100 chars of reply |
| Sentiment | Dropdown | Positive/Neutral/Objection |
| Follow-Up Status | Dropdown | Sent/Pending/Not Needed |
| Trial Signup | Boolean | Did prospect start trial? |
| Trial Signup Time | Timestamp | When signup occurred |
| Notes | Text | Any additional notes |

**Real-time Metrics (Top of sheet):**
```
Total Emails Sent: 20
Opened: 0 (0%)
Clicked: 0 (0%)
Replied: 0 (0%)
Trial Signups: 0 (0%)

Best Performing Template: —
Best Performing Subject: —
Highest Engagement Company: —
```

---

## FOLLOW-UP SEQUENCE LOGIC

### Follow-Up 1 Trigger: No Open by Day 7

**Condition:** `opened == FALSE` AND `days_since_send >= 7`

**Subject:** `Checking in — did this get buried? [Company]`

**Body:**
```
Hi [First.Name],

Just checking in—sent you a note about AutoReport a week back, and I wanted to make sure 
it didn't get buried in your inbox.

The short version: We automate weekly client reporting for digital agencies. Cuts the time 
from 6+ hours to under 30 minutes. Used by 20+ agencies already.

If the timing isn't right, totally understand. But if reporting is on your radar, I'd love 
a quick conversation.

[TRIAL_LINK] or [CALENDAR_LINK]

Best,
[Your.Name]
```

### Follow-Up 2 Trigger: No Reply by Day 14

**Condition:** `replied == FALSE` AND `days_since_send >= 14`

**Subject:** `One last thing about [Company]'s reporting`

**Body:**
```
[First.Name],

I'm going to step back here—but wanted to share one final thought.

We work with agencies that land on AutoReport when:
1. A reporting error just cost them credibility with a client
2. They're drowning in weekly data-pulling and want that time back
3. They're trying to grow but reporting automation is becoming a blocker

If any of that is [Company]'s situation, we should definitely talk.

Free trial (no credit card): [TRIAL_LINK]

That's it from me. Best of luck with everything.
[Your.Name]
```

---

## SUCCESS METRICS & ANALYSIS FRAMEWORK

### Core Metrics (After 7 Days)

**Open Rate:** # opened / 20 = ?%
- Target: ≥ 35% (7+ people)
- Benchmark: Average B2B SaaS cold email is 15-25%
- ReportEase target: 35%+ (personalized, strong subject lines)

**Click Rate:** # clicked any CTA / 20 = ?%
- Target: ≥ 15% (3+ people)
- Benchmark: Average B2B SaaS cold email is 2-5%
- ReportEase target: 15%+ (compelling CTAs, clear value)

**Reply Rate:** # replied / 20 = ?%
- Target: ≥ 10% (2+ people)
- Benchmark: Average B2B SaaS cold email is 1-3%
- ReportEase target: 10%+ (great personalization, soft ask)

### Segmentation Analysis

**By Template:**
```
Template 1 (Time Savings):  Open% | Click% | Reply%
Template 2 (Accuracy):      Open% | Click% | Reply%
Template 3 (White-Labeling): Open% | Click% | Reply%
Template 4 (Integration):   Open% | Click% | Reply%
Template 5 (Resource Const): Open% | Click% | Reply%
```
- Which template drives most opens?
- Which template drives most clicks?
- Which template drives most replies?

**By Subject Line:**
```
Subject A: [text]           Open% | Click%
Subject B: [text]           Open% | Click%
Subject C: [text]           Open% | Click%
```
- Which subject line wins for open rate?
- Which subject line wins for engagement?

**By Prospect Seniority:**
```
Tier 1 (Decision-makers):   Open% | Click% | Reply%
Tier 2 (Influencers):       Open% | Click% | Reply%
Tier 3 (End Users):         Open% | Click% | Reply%
```
- Do executives reply more than managers?
- Do end users click more?

### Conversion Funnel

```
Emails Sent (20)
    ↓
Opened (7) — 35%
    ↓
Clicked Any CTA (3) — 15%
    ↓
Trial Signup (1) — 5%
    ↓
Booked Demo (0.5) — 2.5%
```

---

## QUALITY CHECKS & VALIDATION

Before sending each batch, verify:

**Email Content:**
- [ ] All prospect names, companies, and references are correct
- [ ] Email is grammatically correct and professional
- [ ] Tone matches template and prospect seniority
- [ ] No placeholder text like "[COMPANY]" or "[TRIAL_LINK]" remains
- [ ] Signature block includes name, title, company, phone, email

**Technical Setup:**
- [ ] Trial link is functional and includes UTM parameters
- [ ] Calendar link is functional and calendar is available
- [ ] Gmail account is authenticated and has send permissions
- [ ] Tracking pixel is configured correctly
- [ ] Email is sent from official ReportEase company email
- [ ] Reply label "mvbp_responses" is created in Gmail
- [ ] Metrics sheet is ready to receive data

**Compliance:**
- [ ] All recipients are from verified Apollo list (B2B)
- [ ] Email includes unsubscribe option
- [ ] No false claims about features or usage numbers
- [ ] Privacy-compliant (no GDPR violations for B2B outreach)
- [ ] CAN-SPAM compliant (physical address, unsubscribe, clear sender)

---

## OUTPUT DELIVERABLES

**After Campaign Completes (Day 21+):**

1. **outreach_metrics.csv** — Complete engagement data for all 20 prospects
   - Columns: recipient_email, open, click, reply, sentiment, template, subject_line, time_to_click, etc.
   - Location: `documents/outreach_metrics.csv`

2. **outreach_analysis.md** — Summary report with findings and recommendations
   - Open rate, click rate, reply rate, sentiment breakdown
   - Best-performing template and subject line
   - Segmentation insights
   - Recommendations for follow-up and scaling
   - Location: `documents/outreach_analysis.md`

3. **outreach_results.json** — Structured data for programmatic use
   - Campaign-level metrics
   - Per-prospect engagement data
   - Location: `documents/outreach_results.json`

---

## SUCCESS CRITERIA

**MINIMUM SUCCESS (Validates Concept):**
- ≥ 5 emails opened (25% open rate)
- ≥ 2 emails clicked (10% click rate)
- ≥ 1 email replied (5% reply rate)
- ≥ 1 trial signup or demo booking
- Positive sentiment in ≥ 50% of replies

**TARGET SUCCESS:**
- ≥ 7 emails opened (35% open rate)
- ≥ 3 emails clicked (15% click rate)
- ≥ 2 emails replied (10% reply rate)
- ≥ 2 trial signups or demo bookings
- Positive or neutral sentiment in ≥ 75% of replies

**EXCELLENCE:**
- ≥ 9 emails opened (45% open rate)
- ≥ 4 emails clicked (20% click rate)
- ≥ 3 emails replied (15% reply rate)
- ≥ 3 trial signups or demo bookings
- Positive sentiment in ≥ 50% of replies

---

## NEXT STEPS

1. ✅ Create 5 email templates (DONE → documents/email_templates.md)
2. ✅ Set up campaign structure and tracking (DONE → this document)
3. ⏳ Load 20 prospects from Apollo list into tracking sheet
4. ⏳ Personalize each email with prospect details
5. ⏳ Send Batch 1 (Monday, April 22, 9 AM)
6. ⏳ Monitor tracking in real-time
7. ⏳ Send Batch 2-4 (Tue-Thu)
8. ⏳ Analyze results (Day 7+)
9. ⏳ Generate outreach_metrics.csv and outreach_analysis.md

---

**Campaign Status:** Ready for Prospect Data & Execution  
**Campaign Owner:** ReportEase Marketing  
**Last Updated:** April 22, 2026
