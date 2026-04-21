# Apollo Bulk People Enrichment Strategy — DE Step 9b
## Individual Contact Verification & Email Capture

**Date:** April 21, 2026  
**Objective:** Enrich 52 prospect companies with verified decision-maker contact data  
**Expected Outcomes:** Email addresses, phone numbers, LinkedIn URLs for outreach  

---

## Phase 1: Organization-Level Domain Capture

### Input Data (52 companies)
All 52 agencies have been researched with confirmed company domains:

**Sample domains to enrich:**
```
wpromote.com
victorious.com
hirevets.com
marketshare.com
diemark.com
tinuiti.com
mesalabs.com
revampmedia.com
tbhdigital.com
metriclabs.io
[... additional 42 domains ...]
```

### Apollo Bulk Organization Enrichment API

**Endpoint:** POST /api/v1/organizations/bulk_enrich  
**Use Case:** Validate company data and capture organization IDs for people search

```json
{
  "domains__": [
    "wpromote.com",
    "victorious.com",
    "hirevets.com",
    "marketshare.com",
    "diemark.com",
    // ... up to 10 per batch
  ]
}
```

**Expected Output:**
- Verified company names
- Employee headcount
- HQ locations
- LinkedIn URLs
- Primary phone numbers
- Organization IDs (required for people search)

---

## Phase 2: Individual Decision-Maker Identification

### Target Roles per Company

**Primary Decision-Makers (highest priority):**
1. **CMO / Chief Marketing Officer**
   - Decision authority for software purchases
   - Aligned with ROI and team productivity
   - Influence: DECISION-MAKER

2. **VP of Operations / VP of Marketing**
   - Day-to-day oversight of marketing operations
   - Owns process efficiency
   - Influence: DECISION-MAKER + CHAMPION

3. **Director of Operations / Account Services**
   - Manages reporting process
   - Primary pain point owner (8+ hrs/week reporting)
   - Influence: CHAMPION + END-USER

**Secondary Contacts (warm introduction targets):**
4. **Marketing Manager / Account Manager**
   - Weekly report owners
   - Primary end-user of AutoReport
   - Influence: END-USER

### Apollo Bulk People Enrichment API

**Endpoint:** POST /api/v1/people/bulk_enrich  
**Method:** Enrich by domain + job title combination

**Batch Structure (up to 10 people per call):**

```json
{
  "details": [
    {
      "first_name": "Not yet known",
      "last_name": "Not yet known",
      "domain": "wpromote.com",
      "name": "",
      "organization_name": "Wpromote"
    },
    {
      "domain": "victorious.com",
      "organization_name": "Victorious"
    },
    // ... up to 10 per batch
  ],
  "reveal_personal_emails": false,
  "reveal_phone_number": false
}
```

### Apollo People Search (Alternative)

**Endpoint:** POST /api/v1/people/search  
**Method:** Find by company domain + job title filters

```json
{
  "q_organization_domains_list__": ["wpromote.com"],
  "person_titles__": ["CMO", "Chief Marketing Officer", "VP of Operations", "VP of Marketing"],
  "page": 1,
  "per_page": 10
}
```

**Filter sequence:**
1. Search by company domain
2. Filter by job title (CMO, VP Operations, Director of Operations)
3. Capture email, phone, LinkedIn URL
4. Validate email status (verified/unverified/likely_to_engage)

---

## Phase 3: Contact Verification & Quality Assurance

### Email Verification Standards

**Acceptable Email Statuses:**
- ✅ **verified** — Apollo has confirmed email delivery
- ✅ **likely_to_engage** — High-confidence prediction
- ⚠️ **unverified** — Apollo has not yet validated
- ❌ **unavailable** — Email cannot be found or is invalid

**Quality threshold:** Target 70%+ verified emails; use "likely_to_engage" for remaining slots

### Phone Validation

**Capture criteria:**
- Valid US phone format
- Direct/office lines preferred over mobile
- Company main line if individual direct line unavailable

### LinkedIn URL Extraction

**Use cases:**
- Verify seniority and role accuracy
- Warm introduction via LinkedIn message
- Profile research before cold call

---

## Phase 4: Bulk Enrichment Execution Plan

### Batch Processing (52 companies = 6 batches of 9)

**Batch 1 (California companies):**
```
Domains: wpromote.com, victorious.com, hirevets.com, marketshare.com, diemark.com, 
tinuiti.com, mesalabs.com, revampmedia.com, tbhdigital.com
Count: 9 companies
```

**Batch 2 (California continued + Texas):**
```
Domains: metriclabs.io, gravitymedia.com, skai.io, marinsoftware.com, caavo.com,
adroll.com, gravytrain.com, stackmatix.com, singlegrain.com
Count: 9 companies
```

**Batch 3 (Texas + Florida):**
```
Domains: hirevine.com, localrelevance.com, intuitivedigital.net, measuredmarketing.com,
paradoxdigital.com, moderndigital.io, clicktrust.com, resultsfirst.com, digitalvelocity.us
Count: 9 companies
```

**Batch 4 (Florida continued + New York):**
```
Domains: anchordigital.com, thinkppc.com, sociallysorted.com, acceleratedgrowth.co,
visionsmarketing.com, elevatedigital.com, bluecrewads.com, fusionmarketing.net, analyticsplus.net
Count: 9 companies
```

**Batch 5 (New York + Illinois):**
```
Domains: impactdigital.com, riseinteractive.com, blueacorn.com, cardinaldm.com,
methodmedia.com, analyticsintel.com, growthpartners.io, studiod.digital, metricdigital.com
Count: 9 companies
```

**Batch 6 (Illinois + Pennsylvania):**
```
Domains: orbitmedia.com, icrossing.com, performancedigital.com, chicagoanalytics.com,
milestoneintegration.com, seacademy.com, analytixsolutions.com
Count: 7 companies
```

---

## Phase 5: Data Export & CRM Preparation

### Expected Output Format

**Per prospect company:**
```csv
company_name,domain,organization_id,decision_maker_name,decision_maker_title,
decision_maker_email,email_status,decision_maker_phone,phone_status,
decision_maker_linkedin_url,secondary_contact_name,secondary_contact_title,
secondary_contact_email,secondary_contact_phone,decision_maker_seniority
```

### Integration with Outreach (Step 8)

**Cold Email Sequencing:**
- Email 1: Warm greeting + specific pain point (6 hrs/week reporting)
- Email 2: Social proof + case study
- Email 3: Value calculation + ROI
- Email 4: Demo offer + limited-time discount

**Follow-up Criteria:**
- If email opens but no click → phone call attempt
- If email bounces → search for secondary contact
- If email marked as unavailable → reach out via LinkedIn

---

## API Limits & Rate Management

**Apollo Rate Limits (typical):**
- 1,000 API calls/month for People Enrichment
- 500 API calls/month for Organization Enrichment
- Bulk endpoints often have higher limits

**Expected consumption:**
- Batch 1-6 (6 org enrichments): ~60 calls
- People search (52 companies × avg 2-3 people per): ~150 calls
- **Total estimated:** ~210 API calls (well under 1,000/month limit)

---

## Success Metrics

| Metric | Target | Status |
|---|---|---|
| **Companies enriched** | 52/52 | In Progress |
| **Decision-makers identified** | 40+ (77%+) | Pending |
| **Email addresses verified** | 35+ (67%+) | Pending |
| **Phone numbers captured** | 30+ (58%+) | Pending |
| **LinkedIn URLs found** | 45+ (87%+) | Pending |
| **Secondary contacts (per company)** | 25+ | Pending |
| **Total contacts for outreach** | 75-100 | Pending |

---

## Implementation Checklist

- [ ] **Collect all 52 company domains** → create domain_list.txt
- [ ] **Run Batch 1-6 Apollo Organization Enrichment**
  - [ ] Batch 1 (California)
  - [ ] Batch 2 (California + Texas)
  - [ ] Batch 3 (Texas + Florida)
  - [ ] Batch 4 (Florida + New York)
  - [ ] Batch 5 (New York + Illinois)
  - [ ] Batch 6 (Illinois + Pennsylvania)
- [ ] **Capture organization IDs** from enrichment results
- [ ] **Run Apollo People Search** for each company
  - Target titles: CMO, VP of Operations, VP of Marketing, Director of Operations
- [ ] **Export enriched contacts** to master CSV
- [ ] **Validate 10 sample emails** for delivery accuracy
- [ ] **De-duplicate** across all companies (remove duplicates if person has multiple roles)
- [ ] **Import into CRM / outreach tool**
- [ ] **Segment by decision-maker type** (CMO vs. Director vs. Manager)
- [ ] **Launch cold email sequence** (Step 8)

---

## Risk Mitigation

**Risk:** Not all companies have publicly available decision-maker information  
**Mitigation:** Use Apollo's "similar person" feature to find alternative titles; if CMO not found, escalate to VP Operations or use company main phone line for prospecting call

**Risk:** Email addresses may not be verified  
**Mitigation:** Prioritize "likely_to_engage" status; test sample emails before bulk send; prepare phone/LinkedIn backup outreach

**Risk:** Decision-maker may have recently changed  
**Mitigation:** Validate on LinkedIn before outreach; prepare discovery question: "Who owns the marketing analytics/reporting function?"

---

**Document Status:** READY FOR EXECUTION  
**Next Step:** Run Apollo Bulk Organization Enrichment for Batch 1  
**Maintained By:** ReportEase Research & Prospecting Team
