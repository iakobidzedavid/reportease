# Google Ads OAuth Authentication Recovery Plan
**Document Date:** 2026-04-21  
**Priority:** CRITICAL  
**Objective:** Restore Google Ads API access to retrieve campaign metrics

---

## Problem Statement

The Google Ads API is returning `HTTP 400: Google OAuth token refresh failed` when attempting to:
- Retrieve account information (`googleads_get_account_info`)
- List campaigns (`googleads_list_campaigns`)
- Execute GAQL queries (`googleads_search`)

This blocks extraction of campaign performance metrics required for:
- CAC (Customer Acquisition Cost) calculation
- Unit economics validation
- ROI analysis on $50/day Google Ads spend
- Business model verification

---

## Root Cause Analysis

**Possible causes of HTTP 400 OAuth token refresh failure:**

1. **Token Expiration**
   - OAuth refresh token has expired (typically 6 months)
   - Solution: Re-authorize application in Google Cloud Console

2. **Invalid Credentials**
   - Client secret or client ID is incorrect
   - Solution: Verify credentials in Google Cloud Console project

3. **Scope Issues**
   - OAuth scopes insufficient for API access
   - Solution: Re-authorize with full Google Ads scope

4. **Account Deactivation**
   - Google Ads account suspended or revoked API access
   - Solution: Check Google Ads account status and API quota

5. **Service Account Configuration**
   - Service account key corrupted or deleted
   - Solution: Generate new service account key

6. **IP Allowlist**
   - API request from unlisted IP address
   - Solution: Verify API allowlist in Google Cloud Console

---

## Step-by-Step Recovery Process

### Step 1: Verify Google Cloud Project Status

**What to do:**
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select the project used for Google Ads API
3. Navigate to **APIs & Services > Credentials**
4. Verify OAuth 2.0 Client ID exists and shows status "Active"

**Expected outcome:**
```
Project ID: [your-project-id]
OAuth Client ID: [your-client-id]
Status: Active ✓
```

**If not found:**
- Proceed to Step 2 to create new credentials

---

### Step 2: Create or Refresh OAuth Credentials

**Steps to refresh OAuth token:**

1. **Clear existing credentials:**
   ```bash
   rm ~/.config/gcloud/application_default_credentials.json
   ```

2. **Re-authenticate via gcloud CLI:**
   ```bash
   gcloud auth application-default login
   ```

3. **Select the correct Google account** when prompted

4. **Grant full API permissions** when prompted by browser

5. **Verify credentials created:**
   ```bash
   cat ~/.config/gcloud/application_default_credentials.json
   ```

**Expected output:**
```json
{
  "type": "authorized_user",
  "client_id": "[client_id]",
  "client_secret": "[client_secret]",
  "refresh_token": "[refresh_token]",
  "universe_domain": "googleapis.com"
}
```

---

### Step 3: Verify Google Ads API is Enabled

**What to do:**
1. Go to Google Cloud Console
2. Navigate to **APIs & Services > Enabled APIs**
3. Search for "Google Ads API"
4. Verify it shows "Enabled" (green checkmark)

**If not enabled:**
1. Click "Google Ads API" in search results
2. Click "Enable" button
3. Wait for activation (typically 1-2 minutes)

---

### Step 4: Check API Quota & Usage

**What to do:**
1. Go to Google Cloud Console
2. Navigate to **APIs & Services > Quotas**
3. Filter by "Google Ads API"
4. Check current usage vs quota limits

**Common limits:**
- Requests per day: 10,000
- Requests per minute: 600

**If quota exceeded:**
- Wait for quota reset (daily at midnight UTC)
- Or request quota increase in Google Cloud Console

---

### Step 5: Test API Authentication

**Option A: Using gcloud CLI**
```bash
gcloud ads search --query "SELECT customer.id FROM customer"
```

**Option B: Using Python test script**
```python
from google.ads.google_ads.client import GoogleAdsClient

client = GoogleAdsClient.load_from_storage()
ga_service = client.get_service("GoogleAdsService")

request = {
    "query": "SELECT customer.id FROM customer LIMIT 1"
}

response = ga_service.search(request)
print(f"✓ Authentication successful. Account: {response[0].customer.id}")
```

**Expected output:**
```
✓ Authentication successful. Account: [customer-id]
```

**If still getting 400 error:**
- Proceed to Step 6

---

### Step 6: Check API Access Restrictions

**What to do:**
1. Go to Google Cloud Console
2. Navigate to **APIs & Services > Credentials**
3. Click on OAuth 2.0 Client ID
4. Check "API restrictions" section

**Verify settings:**
- ✓ Should show "Google Ads API" in allowed APIs
- ✓ Should NOT have IP allowlist restrictions (unless explicitly configured)
- ✓ Should NOT have "User type" restrictions blocking API calls

**If restrictive:**
- Edit credential and remove API/IP restrictions
- Re-test authentication

---

### Step 7: Verify Google Ads Account API Settings

**What to do:**
1. Log in to Google Ads account: https://ads.google.com/
2. Navigate to **Tools & Settings > Linked Accounts**
3. Find the Google Cloud project linked to this account
4. Verify **API access is enabled** for the project

**If API access is disabled:**
1. Click "Enable API access"
2. Grant permissions for the Google Cloud project
3. Wait for changes to propagate (up to 5 minutes)

---

### Step 8: Re-run Authentication Test

**Command:**
```bash
# Run the Google Ads metrics extraction again
python scripts/extract_google_ads_metrics.py
```

**Expected success indicators:**
```
✓ Google Ads API: Connected
✓ Account ID: [customer-id]
✓ Campaigns found: [number]
✓ Metrics retrieved: [number] campaigns
✓ Report generated: /data/google-ads-metrics-2026-04-21.json
```

---

## If OAuth Recovery Fails: Fallback Options

### Option 1: Manual Data Export
1. Log in to Google Ads account
2. Navigate to **Campaigns** tab
3. Select all columns: Impressions, Clicks, Conversions, Cost
4. Click **Download** button
5. Save as CSV
6. Import data into `/data/google-ads-metrics-2026-04-21.json` manually

### Option 2: Service Account Authentication
If OAuth 2.0 continues to fail:

1. **Create Service Account:**
   ```bash
   gcloud iam service-accounts create google-ads-api \
     --display-name="Google Ads API Access"
   ```

2. **Create and download service account key:**
   ```bash
   gcloud iam service-accounts keys create google-ads-key.json \
     --iam-account=google-ads-api@[project-id].iam.gserviceaccount.com
   ```

3. **Add service account to Google Ads account:**
   - In Google Ads: Settings > Linked Accounts
   - Add service account email address
   - Grant "Admin" access

4. **Update code to use service account:**
   ```python
   from google.ads.google_ads.client import GoogleAdsClient
   
   credentials = service_account.Credentials.from_service_account_file(
       'google-ads-key.json',
       scopes=['https://www.googleapis.com/auth/adwords']
   )
   
   client = GoogleAdsClient.load_from_service_account(credentials)
   ```

---

## Verification Checklist

After completing recovery steps, verify:

- [ ] Google Cloud project exists and is active
- [ ] OAuth 2.0 Client ID is created and active
- [ ] Google Ads API is enabled in Google Cloud
- [ ] API quota is available (not exceeded)
- [ ] Google Ads account is linked to Google Cloud project
- [ ] API access is enabled in Google Ads account settings
- [ ] Credentials file is valid and contains refresh token
- [ ] Test query returns successful response
- [ ] `googleads_get_account_info()` returns account details
- [ ] `googleads_list_campaigns()` returns campaign list
- [ ] Metrics can be extracted without errors

---

## Expected Metrics After Recovery

Once OAuth is restored, the following should be available:

### Campaign Metrics
```json
{
  "campaign_id": "12345678",
  "campaign_name": "Agency Reporting Software - Search",
  "impressions": 0,
  "clicks": 0,
  "cost": 0.0,
  "ctr": 0.0,
  "cpc": 0.0
}
```

### Conversion Metrics
```json
{
  "conversions": 0,
  "conversion_rate": 0.0,
  "cost_per_conversion": 0.0,
  "cac": "UNDEFINED (zero conversions)"
}
```

### Budget Metrics
```json
{
  "daily_budget": 50.0,
  "currency": "USD",
  "total_spent": 0.0,
  "remaining_budget": null,
  "campaign_status": "ENABLED"
}
```

---

## Timeline & Next Steps

| Step | Action | Timeline | Owner |
|------|--------|----------|-------|
| 1 | Verify Google Cloud project status | Immediate | API Admin |
| 2 | Refresh OAuth credentials | < 5 min | API Admin |
| 3 | Enable Google Ads API | < 5 min | API Admin |
| 4 | Check API quotas | Immediate | API Admin |
| 5 | Verify account linking | < 5 min | Google Ads Admin |
| 6 | Test authentication | < 5 min | API Admin |
| 7 | Re-run metrics extraction | < 5 min | Data Pipeline |
| 8 | Generate report | < 5 min | Data Pipeline |

**Total estimated recovery time: 30 minutes**

---

## Escalation Contacts

If recovery steps fail:

1. **Google Cloud Support:** https://cloud.google.com/support
2. **Google Ads Support:** https://support.google.com/google-ads/
3. **API Documentation:** https://developers.google.com/google-ads/api

---

## Prevention Measures

To prevent future OAuth failures:

1. **Set OAuth token refresh reminder:** Every 5 months
2. **Monitor API quota usage:** Weekly
3. **Enable API logging:** In Google Cloud Console
4. **Implement token refresh automation:** Automatic token refresh every 30 days
5. **Create backup API credentials:** Store in secure vault

---

**Document prepared by:** CEO Agent  
**Status:** Ready for execution  
**Last updated:** 2026-04-21
