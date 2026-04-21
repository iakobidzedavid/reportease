# ReportEase Pricing Framework & Unit Economics Model
**Date:** 2026-04-21  
**Framework:** Disciplined Entrepreneurship, Phase 4 (Business Model Design)  
**Status:** Ready for Validation via Pricing Survey

---

## Overview: Why Pricing Validation Matters

This document establishes **the financial and strategic foundation** for ReportEase pricing. It connects:
1. **Pricing assumption** ($1,200/year) → validated by survey
2. **Unit economics** (CAC, LTV, LTV:CAC ratio) → drives business viability
3. **Business model** (SaaS subscription per user) → revenue stream architecture
4. **Market position** (premium value vs. low-cost alternative) → competitive strategy

**Key Insight:** Pricing is not arbitrary. It directly determines:
- **Customer LTV** (lifetime value) = price × gross margin × retention years
- **Payback period** = CAC ÷ monthly recurring revenue (MRR)
- **Unit economics health** = whether we can profitably acquire customers

---

## Section 1: Pricing Assumptions (Current)

### Base Pricing Model
```
Annual Price Per User: $1,200/year
Monthly Price Per User: $100/month
Typical Agency User Count: 2-4 people
Typical Agency Annual Spend: $2,400-$4,800/year

Pricing Tier Structure (to be validated):
- Standard: $1,200/year per user
- Premium (TBD): $1,800/year per user (if supported by Q5 feature validation)
- Starter (optional): $800/year per user (if Q4 shows strong demand)
```

### Pricing Justification (Current Hypothesis)

**Why $1,200/year?**

1. **Value Metric:**
   - Time saved: 6 hours/week × 52 weeks = 312 hours/year
   - Agency marketing manager fully loaded cost: ~$75,000/year ÷ 2,080 hours = $36/hour
   - Value of time saved: 312 hours × $36 = **$11,232/year**
   - **Ratio:** $11,232 value ÷ $1,200 price = **9.4:1 ROI**

2. **Competitive Benchmarking:**
   - Supermetrics: $900-$1,200/year
   - Whatagraph: $1,200-$2,000/year
   - Looker Studio: Free (limited) to $500+ (premium)
   - ReportEase positioning: **Premium value** (better UX, agency focus)

3. **Market Elasticity:**
   - Agencies currently spend $600-$1,500/year on reporting (estimated)
   - $1,200 is at the **50th percentile** of current spend
   - Justifiable as "switch from existing tool" not "new budget category"

4. **Margin & Profitability:**
   - COGS estimate: $15-30/user/month (cloud hosting, data API costs)
   - Gross margin at $1,200/year: (~$1,200 - $180-360) ÷ $1,200 = **70-85%**
   - Supports >3:1 LTV:CAC target

---

## Section 2: Unit Economics Model (5-Year Projection)

### Customer Acquisition Cost (CAC)

**Acquisition Channels:**

| Channel | Cost per Click | Conversion (Click→Trial) | Conversion (Trial→Customer) | CAC |
|---|---|---|---|---|
| Google Ads | $8-12 | 5% | 20% | $800-$1,200 |
| Email Outreach | $0 (time) | 10% | 15% | $0 (sunk cost, measure separately) |
| Organic/Referral | $0 | 8% | 25% | $0 |

**Blended CAC Assumption:**
- Assume **40% via Ads, 40% via Email, 20% via Organic**
- Blended CAC: (0.40 × $1,000) + (0.40 × $0) + (0.20 × $0) = **$400/customer**

**CAC Payback Period:**
- Monthly Revenue per Customer: $1,200 ÷ 12 = $100/month
- Gross Margin: 75% = $75/month
- Payback: $400 ÷ $75 = **5.3 months**
- Benchmark: <12 months is healthy ✓

---

### Customer Lifetime Value (LTV)

**5-Year Projection:**

```
Year 1:
  - Starting customers: 10 (pilot phase)
  - Churn rate: 5% (conservative, post-trial)
  - Ending cohort: 9.5 customers
  - Revenue: 10 × $1,200 × 12 months = $144,000 (annual revenue, not cohort-specific)
  - Gross margin (75%): $108,000

Year 2:
  - Starting customers: 9.5 (from Y1 cohort)
  - Churn: 5%
  - Ending cohort: 9 customers
  - Revenue: 9.5 × $1,200 = $11,400 (cohort-specific annual revenue)
  - Gross margin: $8,550

Year 3-5:
  - Similar calculations (declining slightly due to churn)
  
Total Gross Profit (5-year, per customer cohort):
Y1: $12,000
Y2: $11,400
Y3: $10,830
Y4: $10,289
Y5: $9,774
────────────
Total: $54,293 per customer acquired

Less: Support costs (estimate $50/customer/year):
5-year support cost: $250 per customer

Net LTV (5-year): $54,293 - $250 = $54,043
```

**LTV:CAC Ratio:**
- LTV: $54,043
- CAC: $400
- **Ratio: 135:1** (far exceeds 3:1 minimum threshold ✓)

**Note:** This assumes:
- Annual churn: 5% (healthy for self-serve SaaS)
- Gross margin: 75% (achievable with cloud infrastructure)
- No expansion revenue (conservative; doesn't count upsells)

---

### Payback Period & Cash Flow Runway

**Blended Customer Payback (with $400 CAC):**
```
Monthly MRR per customer: $100
Monthly contribution margin: $75 (75% gross margin)

Payback = CAC ÷ monthly contribution margin
        = $400 ÷ $75
        = 5.3 months

Interpretation:
- After acquiring a customer, we recover the acquisition cost in 5.3 months
- Months 6+ are pure profit (until churn)
- If we acquire 10 customers in month 1, we recover $4,000 in months 2-7
```

---

## Section 3: Pricing Sensitivity & Market Scenarios

### Scenario A: Baseline ($1,200/year) — Survey Validates

**Assumptions:** >60% of survey respondents select $1,200 or higher

**Financials (100 customers by end of Year 1):**
```
Annual Revenue:           100 × $1,200 = $120,000
COGS (25% of revenue):    $30,000
Gross Profit:             $90,000 (75% margin)

Operating Costs:
  - Engineering (1 FTE):  $80,000
  - Sales/Marketing:      $25,000 (CAC budget)
  - Operations:           $15,000
  Total OpEx:             $120,000

Operating Loss (Year 1):  $90,000 - $120,000 = -$30,000
```

**Interpretation:** Modest operating loss in Year 1 (pilot phase with 10-20 customers early). Breakeven by Year 2 with 30+ customers.

---

### Scenario B: Lower Price ($800/year) — If Survey Rejects $1,200

**Assumptions:** <40% select $1,200; >50% select $800

**Financials (100 customers by end of Year 1):**
```
Annual Revenue:           100 × $800 = $80,000 (vs. $120K baseline)
COGS (30% of revenue):    $24,000 (higher % due to scaling costs)
Gross Profit:             $56,000 (70% margin, lower than baseline)

Operating Costs (same):   $120,000

Operating Loss (Year 1):  $56,000 - $120,000 = -$64,000 (WORSE)

LTV:CAC Ratio:
- LTV at $800: $54,043 × (800/1,200) = $36,029
- CAC: $400
- Ratio: 90:1 (still healthy but margin compressed)
```

**Decision Point:** If survey strongly rejects $1,200:
- **Option 1:** Lower price to $800 but require shorter sales cycle or channel efficiency
- **Option 2:** Maintain $1,200 but reduce feature scope (sell simpler product)
- **Option 3:** Implement tiered pricing: $800 basic + $1,200 standard

---

### Scenario C: Higher Price ($1,800/year) — If Survey Shows Demand

**Assumptions:** >40% select $1,800; features validated in Q5

**Financials (100 customers: 60% at $1,200, 40% at $1,800):**
```
Blended Revenue:
  60 × $1,200 = $72,000
  40 × $1,800 = $72,000
  Total:       $144,000

Gross Profit (73% avg margin): $105,120

Operating Costs (same):        $120,000

Operating Loss (Year 1):       -$14,880 (BETTER, closer to breakeven)

LTV:CAC Ratio (blended):
- Blended LTV: ($54,043 × 0.60) + ($54,043 × 1.5 × 0.40) = $65,000
- CAC: $400
- Ratio: 162:1 (excellent)
```

**Decision Point:** If survey validates $1,800:
- Implement tiered pricing: $1,200 standard + $1,800 premium
- Map premium features from Q5 to higher tier
- Develop simple upsell process

---

## Section 4: Pricing Strategy Decision Tree

### IF Survey Result THEN Action

```
IF 60%+ select $1,200 THEN
  ├─ Keep $1,200 as standard price ✓
  ├─ Confident pricing assumption VALIDATED
  └─ Proceed to DE Step 15 (Business Model Lock)

IF 40-60% select $1,200 THEN
  ├─ Keep $1,200 but MONITOR closely
  ├─ Conduct follow-up interviews with $800/$1,800 selectors
  ├─ Test different value prop messaging
  └─ Consider A/B testing price on landing page

IF 30-40% select $1,200 AND >50% select $800 THEN
  ├─ ADJUST: Reduce price to $900 or $1,000
  ├─ Re-evaluate positioning (cost savings vs. premium value)
  ├─ Reduce feature scope or extend trial to build confidence
  └─ Maintain margin targets by reducing COGS

IF <30% select $1,200 AND >40% select $1,800 THEN
  ├─ UNUSUAL SIGNAL: Bimodal price preference
  ├─ Implement tiered pricing ($1,000/$1,500 or $800/$1,500)
  ├─ Validate feature mapping for tiers
  └─ Test two-tier GTM strategy

IF >30% select "none of above" THEN
  ├─ RED FLAG: Pricing rejection across all options
  ├─ Conduct qualitative follow-up interviews
  ├─ Review positioning and value prop messaging
  ├─ Possible issues:
  │   ├─ Product doesn't fit market need (feature problem)
  │   ├─ Prospects prefer DIY (positioning problem)
  │   ├─ Trust/credibility issue (brand problem)
  │   └─ Price insensitivity due to high current spend
  └─ Consider halting growth until resolved
```

---

## Section 5: Go-to-Market Pricing Tactics

### Tactic 1: Annual Discount Incentive
**Proposal:** Offer 15% discount for annual prepay
```
Standard monthly: $100/month = $1,200/year
Annual prepay: $1,200 × 0.85 = $1,020/year
Effective monthly: $85/month

Benefit:
- Improves cash flow (upfront payment)
- Signals confidence (discount for commitment)
- Increases retention (sunk cost effect)

Risk:
- Reduces revenue on paper (but improves cash flow)
```

### Tactic 2: Volume Discounts (per-agency)
**Proposal:** Tiered pricing by agency user count
```
1-2 users:   $1,200/user/year (standard)
3-5 users:   $1,000/user/year (17% discount)
6+ users:    $800/user/year (33% discount)

Example: 4-user agency
- Standard: 4 × $1,200 = $4,800/year
- Volume discount: 4 × $1,000 = $4,000/year (saves $800)

Benefit:
- Incentivizes larger user adoption
- Competitive against per-account pricing models
- Expands wallet share per customer

Risk:
- Complex billing (need tiered billing system)
```

### Tactic 3: Free Trial + Upsell
**Proposal:** 14-day free trial, then tiered plan selection
```
Free trial: Full access to standard features
Day 14: Conversion prompt to upgrade

Pricing options at conversion:
- Starter: $800/year (limited integrations)
- Standard: $1,200/year (all features)
- Premium: $1,800/year (API access, white-labeling)

Benefit:
- Reduces conversion friction (try before buy)
- Enables feature-based upselling
- Collects willingness-to-pay signals post-trial

Risk:
- Conversion rate must be >15% to justify free tier economics
```

---

## Section 6: Pricing & Positioning Statement

### Positioning (Pre-Survey)
```
For: Mid-size US digital marketing agencies (10-50 people)

Problem: Marketing managers spend 6-8 hours/week on manual reporting

Solution: ReportEase automates report generation and dashboarding

Value: Reclaim 6+ hours/week, eliminate errors, impress stakeholders

Price: $1,200/year per user (justified by 9.4:1 ROI)

Competitive Differentiation:
- Better UX than Supermetrics/Whatagraph
- Purpose-built for agencies (not enterprises like Looker)
- White-labeling & templates included
```

### Pricing Positioning (TBD Post-Survey)
```
IF $1,200 validated:
  "Industry-standard pricing for premium reporting automation"

IF $800 required:
  "The most affordable professional reporting solution for agencies"

IF $1,800 tiered:
  "Flexible pricing: $1,200 standard or $1,800 for premium features"
```

---

## Section 7: Pricing Communication Strategy

### For Prospects (Landing Page & Email)
```
NOT: "ReportEase costs $1,200/year"

BUT: "Save 6+ hours/week, worth ~$11,000/year in productivity.
     ReportEase: $1,200/year. Your ROI: 9x."

Frame: Value-first (show ROI), then price (show affordability)
```

### For Decision-Makers (Sales Conversations)
```
CMO Focus:     "$1,200/user/year × team size = $2,400-4,800 annual investment.
               Payback: <2 months via time savings. Fully ROI-justified."

CFO Focus:     "Annual subscription model. Predictable cost. 70%+ gross margin
               for us = 3x valuation multiple. 2-year break-even."
```

### For Competition Positioning
```
vs. Supermetrics:    "Same price, better UX, agency-specific templates"
vs. Whatagraph:      "Lower price for same feature set, faster setup"
vs. Looker:          "70% cheaper, simpler, purpose-built for agencies"
vs. DIY (Data Studio): "Free but requires 20 hours/week engineering time"
```

---

## Section 8: Price Lock & De-Risking

### When to Lock Pricing
**Pricing should be locked when:**
1. ✓ Survey validates $1,200 (>60% acceptance)
2. ✓ Competitive analysis confirms positioning
3. ✓ Unit economics model shows path to profitability
4. ✓ Sales team confident in closing at price point
5. ✓ LTV:CAC ratio ≥3:1 (currently 135:1, ✓)

**Current Status:** Awaiting survey validation

### When to Pivot Pricing
**Pricing should be reconsidered if:**
- ❌ Survey shows <40% acceptance of $1,200
- ❌ CAC higher than projected (>$800 due to competitive marketing)
- ❌ Churn higher than 5% annually (suggests pricing above willingness-to-pay)
- ❌ Competitive pricing drops significantly (e.g., Whatagraph goes to $600)
- ❌ Market feedback indicates premium positioning not resonating

---

## Section 9: Revenue Projections (3 Scenarios)

### Conservative Scenario (Price=$800, slower adoption)
```
Year 1: 20 customers    @ $800  = $16,000  revenue
Year 2: 60 customers    @ $800  = $48,000  revenue
Year 3: 150 customers   @ $800  = $120,000 revenue

Year 3 Revenue: $120,000
```

### Base Scenario (Price=$1,200, market acceptance)
```
Year 1: 10 customers    @ $1,200 = $12,000  revenue
Year 2: 40 customers    @ $1,200 = $48,000  revenue
Year 3: 100 customers   @ $1,200 = $120,000 revenue

Year 3 Revenue: $120,000
```

### Aggressive Scenario (Price=$1,200+, premium positioning)
```
Year 1: 15 customers    @ $1,200 = $18,000  revenue
Year 2: 50 customers    @ $1,200 = $60,000  revenue
Year 3: 150 customers   @ $1,200 = $180,000 revenue

Year 3 Revenue: $180,000
```

---

## Appendix: Pricing Survey Link & Timeline

### Survey Deployment
- **Form URL:** [TBD - to be generated from Google Forms]
- **Deployment Date:** [TBD - upon email campaign engagement data available]
- **Collection Window:** 7 days
- **Expected Response Rate:** 40-60% (with $25 gift card incentive)
- **Expected Sample:** 8-12 responses (sufficient for analysis)

### Timeline
- **Day 1:** Create survey form
- **Day 2:** Deploy to top 10-15 prospects
- **Day 3:** Send reminder email
- **Days 4-7:** Collect responses
- **Day 8:** Download data and analyze
- **Day 9:** Write report (`documents/pricing_survey_results.md`)
- **Day 10:** Present recommendation to leadership

### Integration with DE Framework
- **Current Phase:** Phase 5 (Risk Management), Step 21 (Test Assumptions)
- **This Survey Tests:** Pricing assumption ($1,200/year)
- **Next Phase:** Phase 4 (Business Model Design), Step 15 (Design Business Model)
- **Uses Survey Data:** Lock pricing in business model, finalize LTV/CAC projections

---

## Summary & Next Steps

### What We Know (Current)
✓ Pricing assumption: $1,200/year per user  
✓ Justification: 9.4:1 ROI on time savings  
✓ Unit economics: 135:1 LTV:CAC ratio (healthy)  
✓ Market positioning: Premium value vs. competitors  

### What We're Testing (Pricing Survey)
? Is $1,200 accepted by >60% of prospects?  
? What is optimal price (van Westendorp)?  
? What current competitive spend confirms positioning?  
? Which features justify premium pricing?  

### What We'll Lock (Post-Survey)
✓ Final pricing: $1,200 (or adjusted)  
✓ Tier structure: Single or tiered pricing model  
✓ Go-to-market: Discount strategies, trial mechanics  
✓ Revenue model: SaaS subscription per-user per-year  

### Risk Mitigation
- Survey validates before committing to marketing spend
- Flexible to adjust if data shows rejection
- Multiple scenarios modeled (conservative/base/aggressive)
- LTV:CAC remains >3:1 even at $800 (downside protected)

---

**Document Status:** READY FOR SURVEY DEPLOYMENT  
**Next Gate:** Pricing survey completion → Approval of recommendations  
**Owner:** CEO Agent  
**Framework:** Disciplined Entrepreneurship (DE), Phases 4-5  
**Last Updated:** 2026-04-21

---

## References

1. **Disciplined Entrepreneurship** (Bill Aulet, MIT)
   - Step 15: Design Business Model
   - Step 16: Set Pricing Framework
   - Step 17: Calculate Customer LTV
   - Step 19: Calculate COCA
   - Step 21: Test Key Assumptions

2. **van Westendorp Price Sensitivity Method (PSM)**
   - Gold standard for pricing research
   - Calculates acceptable price range and optimal price point

3. **SaaS Unit Economics Benchmarks**
   - LTV:CAC ratio target: ≥3:1 (healthy)
   - Gross margin target: 70%+ (our model: 73-75%)
   - Payback period target: <12 months (our model: 5.3 months)

4. **Competitive Intelligence**
   - Supermetrics: $900-$1,200/year
   - Whatagraph: $1,200-$2,000/year
   - Looker Studio: Free to $500+ premium
