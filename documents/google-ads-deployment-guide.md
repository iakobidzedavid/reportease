# Google Ads Campaign Deployment Guide
## ReportEase Agency Reporting Campaign - $20/day

**Document Date:** April 21, 2026  
**Campaign Status:** Configuration Complete (OAuth Token Issue Identified)  
**Target Deployment:** Immediate (post-OAuth fix)

---

## EXECUTIVE SUMMARY

This document provides a comprehensive guide for deploying the ReportEase Agency Reporting Google Ads campaign. The full campaign configuration has been completed and documented in accompanying files. However, deployment is currently blocked by an expired Google Ads OAuth token that requires reset.

**Current Status:**
- ✅ Campaign strategy completed
- ✅ Keywords identified and vetted
- ✅ Ad copy variants created (3 A/B test variants)
- ✅ Landing page URL confirmed
- ✅ UTM parameters configured
- ✅ Conversion tracking mapped
- ✅ Performance projections calculated
- ✅ Configuration JSON generated
- ❌ OAuth token validation issue (400 error)
- ⏳ Campaign deployment pending OAuth reset

---

## PART 1: OAUTH TOKEN RESET INSTRUCTIONS

### Issue Description
```
Error: "Google Ads error: Google OAuth token refresh failed: 400"
```

The Google Ads API integration is using an OAuth token that has expired and cannot be automatically refreshed. This requires manual intervention to reset the token.

### Resolution Steps

**Step 1: Verify Current OAuth Status**

1. Navigate to Google Ads Account Settings
2. Go to "Account Access" → "OAuth Credentials"
3. Check if "ReportEase Google Ads Integration" token shows "Expired" status
4. Note the expiration date (should be recent, confirming 400 refresh error)

**Step 2: Revoke Expired Token**

1. In Google Ads Account Settings, locate the expired token
2. Click "Revoke" next to the token entry
3. Confirm revocation
4. Wait 10 seconds for systems to sync

**Step 3: Re-authenticate**

1. Return to ReportEase application
2. Navigate to Settings → Integrations → Google Ads
3. Click "Connect Google Ads" button
4. You will be redirected to Google OAuth consent screen
5. Select the Google Ads account to authorize
6. Grant permissions:
   - "Manage your Google Ads account"
   - "View your Google Ads account data"
7. Click "Accept"
8. You will be redirected back to ReportEase with new OAuth token

**Step 4: Verify Token is Valid**

1. In ReportEase settings, confirm new token shows "Active"
2. Check "Last refreshed" timestamp (should be current)
3. Test token by clicking "Test Connection"
4. You should see confirmation: "Google Ads connection successful"

**Step 5: Proceed with Campaign Deployment**

Once OAuth token is confirmed active, proceed to Part 2.

---

## PART 2: PRE-DEPLOYMENT CHECKLIST

Before launching the campaign, verify all prerequisites are met:

### Google Ads Account Setup
- [ ] Google Ads account is active and in good standing
- [ ] Billing information is current and valid
- [ ] OAuth token is active (successfully re-authenticated)
- [ ] User role has permission to create campaigns (Admin or Client role)
- [ ] Conversion Tracking is enabled on Google Ads account

### Landing Page Verification
- [ ] Landing page loads without errors: https://v0-reportease-4mkyq61fc-david-7482s-projects.vercel.app
- [ ] Page displays on mobile devices (test on iPhone and Android)
- [ ] Page load time is under 3 seconds
- [ ] HTTPS certificate is valid
- [ ] Form is functional (can submit test data)

### Form & Conversion Tracking
- [ ] Landing page form has all required fields:
  - [ ] Email address (required)
  - [ ] First name (required)
  - [ ] Company name (required)
  - [ ] Role dropdown (required)
  - [ ] Phone number (optional)
- [ ] Form submission triggers event: `trial_signup`
- [ ] Google Tag Manager is installed on landing page
- [ ] GA4 tracking ID is configured
- [ ] Conversion tracking event is visible in Google Analytics real-time

### UTM Parameter Validation
- [ ] Test landing page with UTM parameters:
  ```
  https://v0-reportease-4mkyq61fc-david-7482s-projects.vercel.app
  ?utm_source=google_ads
  &utm_medium=cpc
  &utm_campaign=agency-reporting-20d
  &utm_content=time-savings
  &utm_term=test
  ```
- [ ] Verify UTM parameters appear in Google Analytics session
- [ ] Verify conversion tracking fires when form is submitted

### Ad Copy Review
- [ ] Headline 1: "Reclaim 6 Hours/Week" (exactly 19 characters)
- [ ] All headlines are ≤ 30 characters
- [ ] All descriptions are ≤ 90 characters
- [ ] No prohibited claims (false, unsubstantiated, or misleading)
- [ ] No excessive punctuation or capitalization
- [ ] No competitor brand names in ad copy

### Keywords Review
- [ ] 5 primary keywords are added with BROAD match type
- [ ] 10 secondary keywords are added with PHRASE match type
- [ ] 3 negative keywords are configured: "free", "open source", "diy"
- [ ] All keywords are relevant to ReportEase product
- [ ] No duplicate keywords

### Budget Configuration
- [ ] Daily budget is set to $20.00 USD
- [ ] Monthly budget (30 days) = $600.00 USD
- [ ] Currency is USD
- [ ] Budget type is DAILY (not TOTAL)

---

## PART 3: STEP-BY-STEP DEPLOYMENT

### Step 1: Create Campaign

**API Call:**
```python
{
  "campaign": {
    "name": "ReportEase Agency Reporting - $20/day",
    "status": "ENABLED",
    "advertising_channel_type": "SEARCH",
    "budget_micros": 20000000,
    "manual_cpc_setting": {
      "enhanced_cpc_enabled": false
    }
  }
}
```

**Expected Response:**
```
Campaign created successfully
Campaign ID: customers/[CUSTOMER_ID]/campaigns/[CAMPAIGN_ID]
Status: ENABLED
Daily Budget: $20 USD
```

**Action Items:**
- [ ] Copy Campaign ID and save to deployment log
- [ ] Verify campaign status shows ENABLED in Google Ads UI
- [ ] Check that daily budget displays correctly

### Step 2: Create Ad Group

**API Call:**
```python
{
  "ad_group": {
    "campaign": "customers/[CUSTOMER_ID]/campaigns/[CAMPAIGN_ID]",
    "name": "Agency Reporting Solutions",
    "status": "ENABLED",
    "cpc_bid_micros": 2250000
  }
}
```

**Expected Response:**
```
Ad group created successfully
Ad Group ID: customers/[CUSTOMER_ID]/adGroups/[AD_GROUP_ID]
Name: Agency Reporting Solutions
CPC Bid: $2.25
```

**Action Items:**
- [ ] Copy Ad Group ID and save to deployment log
- [ ] Verify ad group appears in Google Ads UI under campaign

### Step 3: Add Keywords

**API Call (Example for Primary Keyword):**
```python
{
  "ad_group_criterion": {
    "ad_group": "customers/[CUSTOMER_ID]/adGroups/[AD_GROUP_ID]",
    "keyword": {
      "text": "agency reporting software",
      "match_type": "BROAD"
    },
    "status": "ENABLED",
    "cpc_bid_micros": 2500000
  }
}
```

**Process:**
- Add all 5 primary keywords with BROAD match type ($2.50 bid)
- Add all 10 secondary keywords with PHRASE match type ($2.00 bid)
- Add 3 negative keywords with BROAD match type (no bid)

**Expected Response for Each:**
```
Keyword added successfully
Keyword ID: [KEYWORD_ID]
Text: [keyword text]
Match Type: BROAD or PHRASE
Status: ENABLED
```

**Action Items:**
- [ ] Save all 18 keyword IDs to deployment log
- [ ] Verify all keywords appear in Google Ads UI
- [ ] Confirm bid amounts match specification

### Step 4: Create Responsive Search Ads

**API Call (Example - Ad Variant 1: Time Savings):**
```python
{
  "ad_group_ad": {
    "ad_group": "customers/[CUSTOMER_ID]/adGroups/[AD_GROUP_ID]",
    "ad": {
      "type": "RESPONSIVE_SEARCH_AD",
      "responsive_search_ad": {
        "headlines": [
          {"text": "Reclaim 6 Hours/Week"},
          {"text": "on Client Reports"},
          {"text": "ReportEase AutoReport"},
          {"text": "Automated Marketing Reports"},
          {"text": "Stop Manual Reporting"},
          {"text": "Real-Time Dashboards"}
        ],
        "descriptions": [
          {"text": "Stop manual reporting. Automated dashboard pulls data from GA, HubSpot & ad platforms. Real-time updates, customizable templates."},
          {"text": "Join 20+ agencies cutting reporting time from 8+ hours to under 2. Try free for 14 days."},
          {"text": "Eliminate weekly report writing. Schedule automated reports, sync data in real-time, impress clients with dashboards."}
        ],
        "final_urls": [
          "https://v0-reportease-4mkyq61fc-david-7482s-projects.vercel.app?utm_source=google_ads&utm_medium=cpc&utm_campaign=agency-reporting-20d&utm_content=time-savings&utm_term={keyword}"
        ],
        "final_display_url": "reportease.ai"
      }
    },
    "status": "ENABLED"
  }
}
```

**Process:**
- Create Ad 1: Time Savings variant
- Create Ad 2: Accuracy variant (with variant=accuracy in URL)
- Create Ad 3: Visualization variant (with variant=visualization in URL)

**Expected Response for Each:**
```
Ad created successfully
Ad ID: [AD_ID]
Type: RESPONSIVE_SEARCH_AD
Status: ENABLED
Ad Strength: PENDING (will update after 24 hours)
```

**Action Items:**
- [ ] Save all 3 Ad IDs to deployment log
- [ ] Verify all 3 ads appear in Google Ads UI
- [ ] Check that final URLs contain correct UTM parameters
- [ ] Verify ad copy complies with Google policies (no red warnings)

### Step 5: Setup Conversion Tracking

**Step 5a: Create Conversion Action in Google Ads**

```python
{
  "conversion_action": {
    "name": "trial_signup",
    "type": "WEBPAGE",
    "category": "SIGNUP",
    "status": "ENABLED",
    "counting_type": "ONE_PER_CLICK"
  }
}
```

**Expected Response:**
```
Conversion action created successfully
Conversion Action ID: [CONVERSION_ACTION_ID]
Name: trial_signup
Status: ENABLED
Tracking Code: [TRACKING_CODE]
```

**Action Items:**
- [ ] Save Conversion Action ID to deployment log
- [ ] Copy tracking code to deployment notes

**Step 5b: Install Conversion Tracking on Landing Page**

On the landing page, add conversion tracking pixel (Google Tag Manager or Google Analytics):

```html
<!-- Google Ads Conversion Tracking -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-[CONVERSION_ID]"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-[CONVERSION_ID]');
</script>

<!-- Event firing on form submission -->
<script>
  document.getElementById('trial-form').addEventListener('submit', function() {
    gtag('event', 'conversion', {
      'send_to': 'AW-[CONVERSION_ID]/[CONVERSION_LABEL]',
      'value': 40.00,
      'currency': 'USD'
    });
  });
</script>
```

**Action Items:**
- [ ] Verify conversion tracking code is installed
- [ ] Test form submission triggers conversion event
- [ ] Check Google Ads conversion report for new conversions within 24 hours

---

## PART 4: LAUNCH VERIFICATION

### Launch Checklist

**Immediately After Campaign Creation (Hour 0-1):**

- [ ] Campaign appears in Google Ads dashboard
- [ ] Campaign status shows ENABLED
- [ ] Daily budget shows $20 USD
- [ ] Ad group appears under campaign with 3 ads
- [ ] All 18 keywords appear in ad group
- [ ] No disapproved ads or policies warnings
- [ ] Bid amounts match specification ($2.50 primary, $2.00 secondary)

**First Hour of Live (Hour 1-4):**

- [ ] Impressions start appearing (typically within 1-4 hours)
- [ ] Click-through rate appears (CTR ≥ 3%)
- [ ] Average CPC is reasonable ($1.50-$3.00 range)
- [ ] No unusual spike in costs
- [ ] Quality Score updates (target ≥ 6)

**Daily Monitoring (Hour 4-24):**

- [ ] Campaign receives 150-300 impressions
- [ ] Campaign receives 8-20 clicks
- [ ] Conversion tracking fires successfully
- [ ] At least 1-2 conversions recorded in Google Ads
- [ ] Landing page bounce rate is acceptable (<50% for cold traffic)
- [ ] No ads disapproved by Google

**Initial Performance Metrics:**

| Metric | Target Range | Status |
|--------|--------------|--------|
| Daily Impressions | 150-300 | ⏳ Monitor |
| Daily Clicks | 8-20 | ⏳ Monitor |
| Click-Through Rate | 5-8% | ⏳ Monitor |
| Average CPC | $1.50-$2.50 | ⏳ Monitor |
| Quality Score | ≥6 | ⏳ Monitor |
| Daily Conversions | 1-3 | ⏳ Monitor |
| Conversion Rate | 10-15% | ⏳ Monitor |

---

## PART 5: TROUBLESHOOTING GUIDE

### Issue 1: OAuth Token Still Expired After Reset

**Symptom:** Still seeing "400 Unauthorized" error after re-authentication

**Causes:**
- Token not fully saved after re-authentication
- Cache/session issue in application
- OAuth scope issue (wrong permissions granted)

**Solutions:**
1. Clear browser cache and cookies
2. Log out of Google account and ReportEase
3. Re-authenticate with full OAuth flow
4. Verify permissions granted include "Manage Google Ads"
5. If persists, contact Google Ads API support

---

### Issue 2: Campaign Created But Ads Not Appearing

**Symptom:** Campaign shows in dashboard but no impressions after 4 hours

**Causes:**
- Quality Score too low (< 3)
- Bid too low compared to competition
- Disapproved ads (policy violation)
- Wrong location/language targeting
- Budget depleted

**Solutions:**
1. Check Quality Score in Google Ads UI (click "View Details")
2. If Quality Score < 4: Review landing page (relevance, load time, mobile)
3. If ads disapproved: Review ad copy for policy violations
4. Increase CPC bid by 25% and monitor for 2 hours
5. Check location targeting (should be United States)
6. Verify daily spend is not exceeding budget

---

### Issue 3: High Cost Per Click ($5+)

**Symptom:** Campaign running but CPC is much higher than $2.25 bid

**Causes:**
- Quality Score is low (affects CPC)
- High competition on keywords
- Broad match is matching to very high-intent keywords
- Geographic competition (e.g., coastal cities more competitive)

**Solutions:**
1. Check Quality Score (if < 5, improve landing page)
2. Review Search Terms Report (see what keywords users actually searched)
3. Add high-cost, low-relevance search terms to negative keywords
4. Reduce bid on low-converting keywords
5. Consider switching to Phrase Match (more targeted) for primary keywords
6. Add location bid adjustments (lower for high-cost regions)

---

### Issue 4: Low Click-Through Rate (<3%)

**Symptom:** Campaign has impressions but CTR is below 3%

**Causes:**
- Ad copy not compelling
- Ad position is low (below fold)
- Competitor ads are better
- Headline/description don't match search intent
- Ad extensions missing

**Solutions:**
1. Check ad position (should be ≥ 2.5 average position)
2. Test new ad copy with different headlines/descriptions
3. Increase bid to improve ad position
4. Add ad extensions (sitelinks, callout, structured snippet)
5. Review competitor ads for messaging inspiration
6. A/B test: pause one ad variant and monitor CTR change

---

### Issue 5: Conversion Tracking Not Firing

**Symptom:** Clicks are being recorded but no conversions appear in Google Ads

**Causes:**
- Conversion tracking code not installed on landing page
- Form submission event not configured
- Conversion label mismatch
- Cookie/tracking blocker enabled
- Form validation error (user can't submit)

**Solutions:**
1. Test form submission manually (check network tab in browser dev tools)
2. Verify conversion tracking code is present on landing page
3. Check Google Tag Manager for conversion firing event
4. Check Google Analytics real-time to see if events are recorded
5. Disable ad blockers/tracking blockers and retry
6. Test with test conversion in Google Ads (Settings → Conversions)

---

### Issue 6: Budget Being Depleted Too Quickly

**Symptom:** Daily $20 budget being spent in 4-6 hours instead of 24 hours

**Causes:**
- CPC bids are too high
- Competition is very high (quality score issue)
- Keywords matching to very high-intent searches
- Ad position is very high (# 1-2) driving more clicks

**Solutions:**
1. Reduce CPC bids by 20-30%
2. Add negative keywords for low-conversion search terms
3. Switch from BROAD to PHRASE match for more control
4. Reduce daily budget to $10 temporarily to gather data at slower pace
5. Add keyword exclusions for commercial-heavy terms

---

### Issue 7: Landing Page Loading Slowly

**Symptom:** Landing page takes > 3 seconds to load, affecting Quality Score

**Causes:**
- Unoptimized images
- Too many JavaScript files
- Slow hosting/CDN
- Third-party integrations (analytics, chatbot, etc.)

**Solutions:**
1. Test page speed with Google PageSpeed Insights
2. Optimize images (compress, lazy load)
3. Minify CSS/JavaScript
4. Enable gzip compression on server
5. Use Content Delivery Network (CDN)
6. Defer non-critical JavaScript
7. Review third-party scripts and disable if not essential

---

## PART 6: MONITORING & OPTIMIZATION SCHEDULE

### Daily Monitoring (First 7 Days)

**Daily Check (5 minutes):**
- Verify campaign is ENABLED and running
- Check impressions and clicks are arriving
- Review Cost of Acquisition ($20 spend ÷ conversions)
- Verify no red flags (disapproved ads, low quality score)
- Check landing page for errors

**Actions If Issues Found:**
- Low impressions? Increase bid by $0.25-$0.50
- High CPC? Review Quality Score and landing page
- No conversions? Check conversion tracking code
- Ad disapproved? Review policy and resubmit

### Weekly Monitoring (Days 7-30)

**Weekly Review (30 minutes):**
- Total impressions, clicks, cost, conversions
- Calculate Cost Per Acquisition (CPA)
- Review keyword performance (by conversion rate)
- Check landing page bounce rate
- Compare ad variant performance (A/B test results)

**Bi-Weekly Optimization (Days 7, 14, 21):**
- Increase bid on top-converting keywords (+10-20%)
- Decrease bid on low-converting keywords (-10-20%)
- Pause keywords with < 5 impressions (not enough data)
- Test new ad copy variations
- Review search terms report and add new negative keywords
- Check Quality Score improvements

### Monthly Analysis (Day 30)

**Full Campaign Review:**
- Total monthly spend: $600
- Total conversions achieved
- Cost Per Acquisition vs. $50 target
- ROI calculation (if trial → paid conversion data available)
- Winning ad variant (by conversion rate)
- Best-performing keywords (by ROI)
- Scaling recommendation (increase budget? Change bid strategy?)

---

## PART 7: NEXT STEPS AFTER LAUNCH

### If Campaign Performs Well (CPA ≤ $50)

**Week 2-3:**
- Increase daily budget to $30
- Increase CPC bids on high-converting keywords
- Expand to secondary keyword list

**Month 2:**
- Add Display Remarketing (show ads to people who visited landing page)
- Expand to "marketing dashboard" and "client reporting" keywords

**Month 3:**
- Launch 2nd campaign targeting "agency management" keywords
- Implement audience targeting (in-market audiences)

### If Campaign Underperforms (CPA > $100)

**Day 3:** Reduce keyword list to 5 best performers  
**Day 5:** A/B test new ad copy (different headlines/descriptions)  
**Week 1:** Audit landing page (form fields, CTA clarity, load speed)  
**Week 2:** Consider different landing page variant (different positioning)  
**Week 3:** Reduce bid strategy to Phrase Match for more control  

---

## APPENDIX: API REFERENCE

### Google Ads API Endpoints Used

1. **Campaign Management**
   - `POST /v14/customers/{customer_id}/campaigns`
   - `PATCH /v14/customers/{customer_id}/campaigns/{campaign_id}`

2. **Ad Group Management**
   - `POST /v14/customers/{customer_id}/ad_groups`
   - `POST /v14/customers/{customer_id}/ad_group_criteria`

3. **Keyword Management**
   - `POST /v14/customers/{customer_id}/ad_group_criteria`

4. **Ad Management**
   - `POST /v14/customers/{customer_id}/ad_group_ads`

5. **Conversion Tracking**
   - `POST /v14/customers/{customer_id}/conversion_actions`

6. **Performance Reporting**
   - `GET /v14/customers/{customer_id}/googleAds?query=...`

### Error Codes Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | OAuth token expired | Reset OAuth token (see Part 1) |
| 401 | Unauthorized | Check API key and authentication |
| 403 | Permission denied | Check user role in Google Ads |
| 404 | Resource not found | Verify resource IDs are correct |
| 429 | Rate limit exceeded | Wait and retry (max 10 requests/second) |
| 500 | Server error | Retry after 60 seconds |

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-21  
**Status:** Ready for Immediate Deployment (Post-OAuth Fix)  
**Owner:** ReportEase CEO Agent
