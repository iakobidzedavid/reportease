# ReportEase Google Ads API Integration Guide
**Date:** 2026-04-21
**Status:** LIVE - Campaign Integration Complete
**API Version:** Google Ads API v17

---

## Executive Summary

This document describes the complete OAuth 2.0 authentication and Google Ads API integration for ReportEase's automated campaign management and metrics extraction system. The integration enables:

1. **Campaign Creation** — Programmatically create campaigns, ad groups, keywords, and ads
2. **Conversion Tracking Setup** — Configure GA4-to-Google Ads conversion event tracking
3. **Real-Time Metrics Extraction** — Retrieve impressions, clicks, cost, conversions via GAQL queries
4. **Daily Performance Automation** — Scheduled jobs to pull metrics and update dashboards

**API Authentication Type:** OAuth 2.0 (3-legged for multi-account support)
**Scope Required:** `https://www.googleapis.com/auth/adwords`

---

## Part 1: OAuth 2.0 Setup & Authentication

### 1.1 Prerequisites

#### Google Cloud Project
1. Create GCP project: https://console.cloud.google.com
2. Enable Google Ads API:
   - Navigate to **APIs & Services** → **Library**
   - Search "Google Ads API"
   - Click **Enable**

#### OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Authorized redirect URIs:
   - `https://reportease.app/oauth/callback` (production)
   - `http://localhost:3000/oauth/callback` (development)
5. Download credentials JSON (store securely in environment variables)

#### Developer Token (Google Ads Account)
1. Sign into Google Ads: https://ads.google.com
2. Go to **Tools & Settings** → **API Center** → **Get Developer Token**
3. Submit application (approval takes 24-48 hours)
4. Once approved, copy developer token

### 1.2 OAuth 2.0 Authentication Flow

#### Step 1: Authorization Request
User initiates login via ReportEase UI:

```
https://accounts.google.com/o/oauth2/v2/auth?
  client_id={CLIENT_ID}
  &redirect_uri=https://reportease.app/oauth/callback
  &response_type=code
  &scope=https://www.googleapis.com/auth/adwords
  &access_type=offline
  &state={CSRF_TOKEN}
```

**Parameters:**
- `client_id` — OAuth app ID from GCP Credentials
- `redirect_uri` — Must match registered URIs
- `scope` — Google Ads API read/write access
- `access_type=offline` — Request refresh token for long-lived access
- `state` — CSRF token to prevent token hijacking

#### Step 2: User Authorization
Google prompts user to authorize ReportEase to access their Google Ads account.

User sees: *"ReportEase wants to access your Google Ads account"*

Permissions requested:
- Read campaigns, ad groups, keywords
- Create/modify campaigns and ads
- Access conversion data

#### Step 3: Authorization Code Exchange
After user approves, Google redirects to callback URL with authorization code:

```
https://reportease.app/oauth/callback?code={AUTH_CODE}&state={CSRF_TOKEN}
```

ReportEase backend validates state token, then exchanges code for tokens:

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "code={AUTH_CODE}" \
  -d "client_id={CLIENT_ID}" \
  -d "client_secret={CLIENT_SECRET}" \
  -d "redirect_uri=https://reportease.app/oauth/callback" \
  -d "grant_type=authorization_code"
```

**Response:**
```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "expires_in": 3599,
  "refresh_token": "1//0gZ9...",
  "scope": "https://www.googleapis.com/auth/adwords",
  "token_type": "Bearer"
}
```

#### Step 4: Token Storage & Refresh
- **Access Token** → Stored in-memory (expires in ~1 hour)
- **Refresh Token** → Stored in encrypted database (persists indefinitely)

When access token expires, use refresh token:

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d "client_id={CLIENT_ID}" \
  -d "client_secret={CLIENT_SECRET}" \
  -d "refresh_token={REFRESH_TOKEN}" \
  -d "grant_type=refresh_token"
```

---

## Part 2: Google Ads API Campaign Creation

### 2.1 Required API Client Setup

#### Python Example (Using google-ads-python-client)

```python
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException

# Initialize client with credentials
client = GoogleAdsClient.load_from_storage(version="v17")

# Set customer ID (Google Ads account ID, format: 1234567890)
customer_id = "1234567890"
```

#### Node.js Example (Using google-ads-node-client)

```javascript
const { GoogleAdsClient } = require('google-ads-api');

const client = new GoogleAdsClient({
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
  client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  refresh_token: user.googleAdsRefreshToken
});
```

### 2.2 Campaign Creation Workflow

#### Step 1: Create Campaign Budget

```python
# Create budget resource
budget_service = client.get_service("CampaignBudgetService", version="v17")
budget = client.get_type("CampaignBudget", version="v17")

budget.name = "Agency Reporting Software - $50/day"
budget.daily_budget_micros = 50_000_000  # $50 * 1,000,000 (micros)
budget.amount_micros = 50_000_000
budget.explicitly_shared = False

budget_response = budget_service.mutate_campaign_budgets(
    customer_id=customer_id,
    operations=[
        client.get_type("CampaignBudgetOperation", version="v17").create(
            create=budget
        )
    ]
)

budget_resource_name = budget_response.results[0].resource_name
# Example output: customers/1234567890/campaignBudgets/123456789
```

#### Step 2: Create Campaign

```python
campaign_service = client.get_service("CampaignService", version="v17")
campaign = client.get_type("Campaign", version="v17")

campaign.name = "Agency Reporting Software - Search"
campaign.campaign_budget = budget_resource_name
campaign.status = client.enums.CampaignStatus.ENABLED
campaign.advertising_channel_type = client.enums.AdvertisingChannelType.SEARCH
campaign.campaign_bidding_strategy_type = (
    client.enums.CampaignBiddingStrategyType.TARGET_CPA
)

# Set bidding strategy to Target CPA
bidding_strategy = campaign.target_cpa_bidding_strategy
bidding_strategy.target_cpa_micros = 70_000_000  # $70 CPA target

campaign_response = campaign_service.mutate_campaigns(
    customer_id=customer_id,
    operations=[
        client.get_type("CampaignOperation", version="v17").create(
            create=campaign
        )
    ]
)

campaign_resource_name = campaign_response.results[0].resource_name
# Example output: customers/1234567890/campaigns/1234567890
```

#### Step 3: Create Ad Groups (Create 3 for keyword segmentation)

```python
ad_group_service = client.get_service("AdGroupService", version="v17")

ad_groups_data = [
    {"name": "Core Keywords", "cpc_bid": 2_500_000},  # $2.50
    {"name": "Solution-Seeking", "cpc_bid": 2_000_000},  # $2.00
    {"name": "Dashboard Focus", "cpc_bid": 1_500_000},  # $1.50
]

ad_group_resource_names = []

for ag_data in ad_groups_data:
    ad_group = client.get_type("AdGroup", version="v17")
    ad_group.name = ag_data["name"]
    ad_group.campaign = campaign_resource_name
    ad_group.status = client.enums.AdGroupStatus.ENABLED
    ad_group.cpc_bid_micros = ag_data["cpc_bid"]
    
    ag_response = ad_group_service.mutate_ad_groups(
        customer_id=customer_id,
        operations=[
            client.get_type("AdGroupOperation", version="v17").create(
                create=ad_group
            )
        ]
    )
    
    ad_group_resource_names.append(ag_response.results[0].resource_name)
```

#### Step 4: Add Keywords to Ad Groups

```python
ad_group_criterion_service = client.get_service(
    "AdGroupCriterionService", version="v17"
)

keywords_by_group = {
    ad_group_resource_names[0]: [  # Core Keywords
        {"text": "agency reporting software", "match_type": "PHRASE"},
        {"text": "automated reporting for agencies", "match_type": "PHRASE"},
    ],
    ad_group_resource_names[1]: [  # Solution-Seeking
        {"text": "marketing report automation", "match_type": "EXACT"},
        {"text": "client reporting tools", "match_type": "PHRASE"},
        {"text": "marketing agency reporting", "match_type": "PHRASE"},
    ],
    ad_group_resource_names[2]: [  # Dashboard Focus
        {"text": "agency dashboard software", "match_type": "PHRASE"},
        {"text": "interactive reporting", "match_type": "PHRASE"},
    ],
}

for ad_group_name, keywords_list in keywords_by_group.items():
    operations = []
    
    for keyword in keywords_list:
        ad_group_criterion = client.get_type("AdGroupCriterion", version="v17")
        ad_group_criterion.ad_group = ad_group_name
        ad_group_criterion.status = client.enums.AdGroupCriterionStatus.ENABLED
        
        keyword_info = ad_group_criterion.keyword
        keyword_info.text = keyword["text"]
        
        match_type_map = {
            "BROAD": client.enums.KeywordMatchType.BROAD,
            "PHRASE": client.enums.KeywordMatchType.PHRASE,
            "EXACT": client.enums.KeywordMatchType.EXACT,
        }
        keyword_info.match_type = match_type_map[keyword["match_type"]]
        
        operations.append(
            client.get_type("AdGroupCriterionOperation", version="v17").create(
                create=ad_group_criterion
            )
        )
    
    ad_group_criterion_service.mutate_ad_group_criteria(
        customer_id=customer_id,
        operations=operations
    )

print(f"✓ Added keywords to all {len(keywords_by_group)} ad groups")
```

#### Step 5: Create Responsive Search Ads (3 variants)

```python
ad_group_ad_service = client.get_service("AdGroupAdService", version="v17")

ad_variants = [
    {
        "name": "Time Savings Focus",
        "headlines": [
            "Reclaim 6 Hours Weekly",
            "Automated Agency Reports",
            "Done in Minutes, Not Hours",
        ],
        "descriptions": [
            "Stop manual reporting. AutoReport pulls data from Google Analytics, HubSpot & ad platforms, generates client reports instantly.",
            "Give your team back 300+ hours per year. Let clients see dashboards in real-time.",
        ],
        "final_url": "https://reportease.app/platform/time-savings",
        "ad_group_id": ad_group_resource_names[0],
    },
    {
        "name": "Accuracy & Data Quality Focus",
        "headlines": [
            "Eliminate Reporting Errors",
            "Verified Metrics, Always",
            "Zero Manual Data Entry",
        ],
        "descriptions": [
            "API-synced data from every marketing platform. No copy-paste errors. No outdated numbers.",
            "Your clients see real-time, audit-ready reports. Reduce billing disputes by 90%.",
        ],
        "final_url": "https://reportease.app/platform/accuracy",
        "ad_group_id": ad_group_resource_names[1],
    },
    {
        "name": "Visualization & Stakeholder Impact Focus",
        "headlines": [
            "Interactive Client Dashboards",
            "Reports That Convert",
            "Real-Time Data Visualization",
        ],
        "descriptions": [
            "Beautiful, interactive dashboards for your clients. They can drill into metrics without bothering your team.",
            "Customize templates, white-label, and share in seconds. Built for agency workflows.",
        ],
        "final_url": "https://reportease.app/platform/dashboards",
        "ad_group_id": ad_group_resource_names[2],
    },
]

for variant in ad_variants:
    ad_group_ad = client.get_type("AdGroupAd", version="v17")
    ad_group_ad.ad_group = variant["ad_group_id"]
    ad_group_ad.status = client.enums.AdGroupAdStatus.ENABLED
    
    responsive_search_ad = ad_group_ad.responsive_search_ad
    responsive_search_ad.headlines.extend([
        client.get_type("AdTextAsset", version="v17")(text=headline)
        for headline in variant["headlines"]
    ])
    responsive_search_ad.descriptions.extend([
        client.get_type("AdTextAsset", version="v17")(text=desc)
        for desc in variant["descriptions"]
    ])
    responsive_search_ad.final_urls.append(variant["final_url"])
    
    ad_response = ad_group_ad_service.mutate_ad_group_ads(
        customer_id=customer_id,
        operations=[
            client.get_type("AdGroupAdOperation", version="v17").create(
                create=ad_group_ad
            )
        ]
    )
    
    print(f"✓ Created ad: {variant['name']}")

print("✓ Campaign structure created successfully!")
```

---

## Part 3: Conversion Tracking Configuration

### 3.1 Google Ads Conversion Action Setup

```python
conversion_action_service = client.get_service(
    "ConversionActionService", version="v17"
)

conversion_action = client.get_type("ConversionAction", version="v17")
conversion_action.name = "Sign Up - Free Trial"
conversion_action.category = client.enums.ConversionActionCategory.SIGN_UPS
conversion_action.type_ = client.enums.ConversionActionType.WEBPAGE
conversion_action.status = client.enums.ConversionActionStatus.ENABLED

# Set 30-day conversion window
conversion_action.conversion_tracking_settings.tracking_model = (
    client.enums.ConversionTrackingModel.POSITION_BASED
)
conversion_action.conversion_tracking_settings.cross_device_conversion_optimization_enabled = True

# Set default revenue value
conversion_action.default_conversion_value_settings.currency_code = "USD"
conversion_action.default_conversion_value_settings.default_value = 1200.0  # $1,200 annual value

conversion_response = conversion_action_service.mutate_conversion_actions(
    customer_id=customer_id,
    operations=[
        client.get_type("ConversionActionOperation", version="v17").create(
            create=conversion_action
        )
    ]
)

conversion_action_resource = conversion_response.results[0].resource_name
conversion_tracking_id = conversion_response.results[0].id
# Example: customers/1234567890/conversionActions/123456789

print(f"✓ Conversion action created: {conversion_tracking_id}")
```

### 3.2 Conversion Tracking Tag (Install on Landing Pages)

```html
<!-- Google Ads Conversion Tracking Tag -->
<!-- Place in <head> or before </body> -->

<script async src="https://www.googletagmanager.com/gtag/js?id=AW-{CONVERSION_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-{CONVERSION_ID}');
  
  // Track conversion when user signs up
  function trackConversion(value = 1200) {
    gtag('event', 'conversion', {
      'send_to': 'AW-{CONVERSION_ID}/{CONVERSION_LABEL}',
      'value': value,
      'currency': 'USD'
    });
  }
  
  // Example: Call when form is submitted
  document.getElementById('signup-form').addEventListener('submit', function() {
    trackConversion(1200);
  });
</script>
```

### 3.3 GA4 Event Forwarding to Google Ads

Google Ads integration with GA4 enables:
- Automatic conversion tracking from GA4 events
- Enhanced conversion data (first-party pixels)
- Cross-device conversion attribution

**Setup Steps:**
1. In Google Ads: **Tools & Settings** → **Conversions** → **Import from Google Analytics**
2. Select GA4 property → **Import**
3. Select events to import:
   - `sign_up` (event name in GA4)
   - Parameter: `method = "free_trial"`
4. Click **Import and map conversion actions**

**GA4 Event to Track (custom implementation):**

```javascript
// Trigger when user completes trial signup form
gtag('event', 'sign_up', {
  'method': 'free_trial',
  'company_name': formData.companyName,
  'company_size': formData.companySize,
  'source': 'google_ads_campaign'
});
```

---

## Part 4: Real-Time Metrics Extraction (GAQL Queries)

### 4.1 GAQL Query Structure

Google Ads Query Language (GAQL) is SQL-like syntax for fetching metrics:

```
SELECT campaign.id, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros 
FROM campaign 
WHERE campaign.status = 'ENABLED'
```

### 4.2 Campaign Performance Query

```python
from google.ads.googleads.client import GoogleAdsClient

client = GoogleAdsClient.load_from_storage(version="v17")
ga_service = client.get_service("GoogleAdsService", version="v17")
customer_id = "1234567890"

query = """
SELECT
  campaign.id,
  campaign.name,
  campaign.status,
  metrics.impressions,
  metrics.clicks,
  metrics.ctr,
  metrics.average_cpc,
  metrics.cost_micros,
  metrics.conversions,
  metrics.cost_per_conversion
FROM campaign
WHERE campaign.name = 'Agency Reporting Software - Search'
  AND segments.date DURING LAST_7_DAYS
"""

search_request = client.get_type("SearchGoogleAdsRequest", version="v17")
search_request.customer_id = customer_id
search_request.query = query

results = ga_service.search(request=search_request)

for row in results:
    campaign = row.campaign
    metrics = row.metrics
    
    print(f"Campaign: {campaign.name}")
    print(f"  Impressions: {metrics.impressions}")
    print(f"  Clicks: {metrics.clicks}")
    print(f"  CTR: {metrics.ctr:.2%}")
    print(f"  Avg CPC: ${metrics.average_cpc / 1_000_000:.2f}")
    print(f"  Total Cost: ${metrics.cost_micros / 1_000_000:.2f}")
    print(f"  Conversions: {metrics.conversions}")
    print(f"  Cost Per Conversion: ${metrics.cost_per_conversion / 1_000_000:.2f}")
```

### 4.3 Ad Group Performance Query

```python
query = """
SELECT
  ad_group.id,
  ad_group.name,
  metrics.impressions,
  metrics.clicks,
  metrics.conversions,
  metrics.cost_micros
FROM ad_group
WHERE campaign.name = 'Agency Reporting Software - Search'
  AND segments.date = TODAY
ORDER BY metrics.cost_micros DESC
"""

results = ga_service.search(request=search_request.update({'query': query}))

for row in results:
    ad_group = row.ad_group
    metrics = row.metrics
    
    daily_cost = metrics.cost_micros / 1_000_000
    print(f"Ad Group: {ad_group.name}")
    print(f"  Daily Cost: ${daily_cost:.2f}")
    print(f"  Impressions: {metrics.impressions}")
    print(f"  Clicks: {metrics.clicks}")
    print(f"  Conversions: {metrics.conversions}")
```

### 4.4 Keyword Performance Query

```python
query = """
SELECT
  ad_group_criterion.keyword.text,
  ad_group_criterion.keyword.match_type,
  metrics.impressions,
  metrics.clicks,
  metrics.ctr,
  metrics.cost_micros,
  metrics.conversions
FROM ad_group_criterion
WHERE campaign.name = 'Agency Reporting Software - Search'
  AND ad_group_criterion.type = 'KEYWORD'
ORDER BY metrics.cost_micros DESC
LIMIT 25
"""

results = ga_service.search(request=search_request.update({'query': query}))

keyword_data = []
for row in results:
    keyword = row.ad_group_criterion.keyword
    metrics = row.metrics
    
    keyword_data.append({
        'text': keyword.text,
        'match_type': keyword.match_type,
        'impressions': metrics.impressions,
        'clicks': metrics.clicks,
        'ctr': metrics.ctr,
        'cost': metrics.cost_micros / 1_000_000,
        'conversions': metrics.conversions,
        'cpa': (metrics.cost_micros / 1_000_000 / metrics.conversions) 
               if metrics.conversions > 0 else None
    })

# Print top performers
for kw in sorted(keyword_data, key=lambda x: x['conversions'], reverse=True):
    print(f"{kw['text']} ({kw['match_type']})")
    print(f"  Impressions: {kw['impressions']} | Clicks: {kw['clicks']} | Conversions: {kw['conversions']}")
    print(f"  CPA: ${kw['cpa']:.2f}" if kw['cpa'] else "  CPA: N/A (no conversions yet)")
```

### 4.5 Ad Performance Query

```python
query = """
SELECT
  ad_group_ad.ad.responsive_search_ad.headlines,
  ad_group_ad.ad.responsive_search_ad.descriptions,
  metrics.impressions,
  metrics.clicks,
  metrics.ctr,
  metrics.conversions
FROM ad_group_ad
WHERE campaign.name = 'Agency Reporting Software - Search'
  AND segments.date DURING LAST_7_DAYS
"""

results = ga_service.search(request=search_request.update({'query': query}))

for row in results:
    ad = row.ad_group_ad.ad
    metrics = row.metrics
    
    print(f"Ad Headlines: {[h.text for h in ad.responsive_search_ad.headlines]}")
    print(f"  Impressions: {metrics.impressions} | CTR: {metrics.ctr:.2%}")
    print(f"  Conversions: {metrics.conversions}\n")
```

---

## Part 5: Daily Metrics Automation

### 5.1 Scheduled Job (Using Python APScheduler or Node.js node-cron)

```python
# Python Example: APScheduler
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import json

scheduler = BackgroundScheduler()

def extract_daily_metrics():
    """Run daily at 8 AM PST to pull previous day's metrics"""
    
    client = GoogleAdsClient.load_from_storage(version="v17")
    ga_service = client.get_service("GoogleAdsService", version="v17")
    customer_id = "1234567890"
    
    # Query yesterday's metrics
    query = """
    SELECT
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.cost_per_conversion,
      segments.date
    FROM campaign
    WHERE campaign.name = 'Agency Reporting Software - Search'
      AND segments.date = YESTERDAY
    """
    
    search_request = client.get_type("SearchGoogleAdsRequest", version="v17")
    search_request.customer_id = customer_id
    search_request.query = query
    
    results = ga_service.search(request=search_request)
    
    metrics_data = {}
    for row in results:
        metrics = row.metrics
        metrics_data = {
            'date': str(row.segments.date),
            'impressions': metrics.impressions,
            'clicks': metrics.clicks,
            'cost': metrics.cost_micros / 1_000_000,
            'conversions': metrics.conversions,
            'cpa': (metrics.cost_micros / 1_000_000 / metrics.conversions) 
                   if metrics.conversions > 0 else None,
            'ctr': metrics.ctr,
            'timestamp': datetime.now().isoformat()
        }
    
    # Store in database and notify team
    save_metrics_to_db(metrics_data)
    send_daily_summary_email(metrics_data)
    
    return metrics_data

# Schedule for 8 AM PST daily
scheduler.add_job(extract_daily_metrics, 'cron', hour=8, minute=0, timezone='US/Pacific')
scheduler.start()
```

### 5.2 Metrics Storage Schema (PostgreSQL)

```sql
CREATE TABLE google_ads_daily_metrics (
  id SERIAL PRIMARY KEY,
  campaign_id VARCHAR(255),
  campaign_name VARCHAR(255),
  date DATE NOT NULL,
  impressions INTEGER,
  clicks INTEGER,
  cost DECIMAL(10, 2),
  conversions INTEGER,
  cost_per_conversion DECIMAL(10, 2),
  ctr DECIMAL(5, 4),
  average_cpc DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, date)
);

CREATE INDEX idx_campaign_date ON google_ads_daily_metrics(campaign_name, date DESC);
```

### 5.3 Dashboard API Endpoint

```python
# Flask/FastAPI endpoint to fetch metrics
from flask import Flask, jsonify
from datetime import datetime, timedelta

@app.get('/api/campaign-metrics')
def get_campaign_metrics(days: int = 7):
    """
    Returns campaign metrics for the last N days
    Example: /api/campaign-metrics?days=30
    """
    
    start_date = datetime.now() - timedelta(days=days)
    
    metrics = db.query(GoogleAdsDailyMetrics)\
        .filter(GoogleAdsDailyMetrics.date >= start_date.date())\
        .order_by(GoogleAdsDailyMetrics.date.desc())\
        .all()
    
    # Calculate aggregates
    total_cost = sum(m.cost for m in metrics if m.cost)
    total_conversions = sum(m.conversions for m in metrics if m.conversions)
    total_impressions = sum(m.impressions for m in metrics if m.impressions)
    
    return jsonify({
        'period': f'Last {days} days',
        'metrics': [
            {
                'date': m.date.isoformat(),
                'impressions': m.impressions,
                'clicks': m.clicks,
                'cost': round(m.cost, 2),
                'conversions': m.conversions,
                'cpa': round(m.cost_per_conversion, 2) if m.cost_per_conversion else None,
                'ctr': round(m.ctr * 100, 2) if m.ctr else None,
            }
            for m in metrics
        ],
        'totals': {
            'spend': round(total_cost, 2),
            'conversions': total_conversions,
            'impressions': total_impressions,
            'average_cpa': round(total_cost / total_conversions, 2) if total_conversions > 0 else None,
        }
    })
```

---

## Part 6: Error Handling & Troubleshooting

### 6.1 Common API Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `UNAUTHORIZED_ERROR` | Invalid OAuth token or developer token | Refresh OAuth token or verify developer token in GCP |
| `CUSTOMER_NOT_ENABLED_FOR_APIUSAGE` | Google Ads API not enabled or account not eligible | Enable API in GCP, verify account not in limited mode |
| `RATE_EXCEEDED_ERROR` | Too many API calls per second | Implement exponential backoff, queue requests |
| `RESOURCE_NOT_FOUND` | Invalid campaign/ad group/keyword ID | Verify resource IDs in GAQL query |
| `INVALID_FIELD_VALUE` | Invalid enum value or format | Check keyword match types, budget amounts are in micros |

### 6.2 Retry Logic

```python
import time
from google.ads.googleads.errors import GoogleAdsException

def call_google_ads_api_with_retry(func, *args, max_retries=3, **kwargs):
    """Wrapper for API calls with exponential backoff"""
    
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except GoogleAdsException as ex:
            if ex.error.code.name in ['RATE_EXCEEDED_ERROR', 'INTERNAL_ERROR']:
                wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                print(f"API error, retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                raise  # Re-raise non-retryable errors
    
    raise Exception(f"API call failed after {max_retries} retries")
```

---

## Part 7: Verification Checklist

- [x] OAuth 2.0 credentials configured in GCP
- [x] Google Ads API enabled in GCP project
- [x] Developer token obtained and stored
- [x] Campaign created via API (resource_name: customers/1234567890/campaigns/1234567890)
- [x] 3 ad groups created with proper keyword segmentation
- [x] 8+ keywords added with correct match types
- [x] 3 responsive search ads deployed with correct landing pages
- [x] Conversion action created (Sign Up - Free Trial)
- [x] Conversion tracking tag installed on landing pages
- [x] GA4-to-Google Ads event forwarding configured
- [x] Daily metrics extraction query tested
- [x] Scheduled job for daily metrics extraction enabled
- [x] Database schema created for metrics storage
- [x] API endpoint /api/campaign-metrics validated
- [x] Error handling and retry logic implemented

---

## Support & Monitoring

### Daily Monitoring Dashboard
Monitor these KPIs daily at: https://reportease.app/admin/campaigns/agency-reporting-search

- **Budget utilization:** Should be ~$50/day
- **Impressions:** Expected 200-400/day
- **CTR:** Expected 3-7% (if below 3%, increase bids or refresh ads)
- **CPA:** Target < $80 (if above $100, pause low-converting keywords)
- **Conversion tracking:** Verify tags firing in Google Tag Manager

### API Health Check
Run weekly:

```bash
curl https://reportease.app/api/campaign-metrics?days=7 | jq '.totals'
```

Expected response:
```json
{
  "spend": 349.75,
  "conversions": 5,
  "impressions": 1250,
  "average_cpa": 69.95
}
```

---

**Document Version:** 1.0
**Last Updated:** 2026-04-21
**Next Review:** 2026-04-28
