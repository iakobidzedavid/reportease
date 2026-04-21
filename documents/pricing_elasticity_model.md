# ReportEase Pricing Elasticity Model
## Data-Driven Demand & Revenue Projections

**Date:** 2026-04-22  
**Purpose:** Quantify demand elasticity across three price points ($800, $1,200, $1,800) with revenue projections and sensitivity analysis.

---

## 1. Elasticity Framework

### Price Elasticity of Demand (PED) Calculation

**Formula:**
```
PED = (% Change in Quantity Demanded) / (% Change in Price)
```

**Interpretation:**
- PED > 1: Elastic (price-sensitive; demand drops significantly with price increase)
- PED = 1: Unit elastic (proportional change)
- PED < 1: Inelastic (price-insensitive; demand relatively stable)

### Industry Benchmarks for B2B SaaS
- Typical PED: -0.8 to -1.5 (slightly to moderately elastic)
- SMB SaaS (our beachhead): -1.2 to -1.8 (more elastic due to budget constraints)
- Enterprise SaaS: -0.6 to -1.0 (less elastic due to ROI-driven purchasing)

**ReportEase assumption:** PED ≈ **-1.4** (moderately elastic; SMB budget-sensitive but ROI-aware)

---

## 2. Demand Estimation by Price Point

### Base Parameters
- **Total addressable market (beachhead):** 100,000 US digital marketing agencies
- **Realistic addressable base (first 18 months):** 15,000–20,000 agencies with active headcount to justify tool investment
- **Baseline conversion rate (at $1,200):** 12–15% (typical SaaS freemium/trial conversion)

### Price Point Scenarios

#### **Scenario A: $800/year (Price Competitive)**

**Demand Calculation:**
- Price differential from baseline ($1,200): -33%
- Expected demand increase (using PED = -1.4): 33% × 1.4 = 46.2% uplift
- Baseline demand at $1,200: 15,000 prospects × 12% = 1,800 customers
- **Adjusted demand at $800:** 1,800 × 1.462 = **2,631 customers** (first 18 months)

**Revenue Projection:**
| Metric | Value |
|---|---|
| Customers | 2,631 |
| Annual price per user | $800 |
| Year 1 ARR (full year, 50% ramp) | $1,050,400 |
| Year 2 ARR (assuming 65% retention + 20% new) | $1,550,000 |
| Year 3 ARR (assuming 70% retention + 20% new) | $2,100,000 |

**Unit Economics:**
- Gross margin (70% typical for SaaS): $560/customer/year
- CAC budget (3:1 LTV:CAC ratio = $1,600 LTV ÷ 3): ~$267/customer
- Payback period: 2.9 months
- LTV (5-year, 65% annual retention): $3,200

**Risk:** Lower margin reduces R&D investment; positions as "budget" alternative (churn risk).

---

#### **Scenario B: $1,200/year (Sweet Spot — Recommended)**

**Demand Calculation:**
- Price differential: $0 (baseline)
- Baseline demand: 15,000 prospects × 12% = **1,800 customers** (first 18 months)
- This assumes "demonstrated demand" from pilot/MVBP phase

**Revenue Projection:**
| Metric | Value |
|---|---|
| Customers | 1,800 |
| Annual price per user | $1,200 |
| Year 1 ARR (full year, 50% ramp) | $1,080,000 |
| Year 2 ARR (assuming 70% retention + 25% new) | $1,890,000 |
| Year 3 ARR (assuming 75% retention + 25% new) | $2,835,000 |

**Unit Economics:**
- Gross margin (72% at $1,200 pricing): $864/customer/year
- CAC budget (3.5:1 LTV:CAC): ~$290/customer
- Payback period: 4.0 months
- LTV (5-year, 70% annual retention): $5,040

**Advantage:** Balanced growth/margin; matches willingness-to-pay modal segment; sustainable unit economics.

---

#### **Scenario C: $1,800/year (Premium)**

**Demand Calculation:**
- Price differential from baseline ($1,200): +50%
- Expected demand decrease (using PED = -1.4): 50% × 1.4 = 70% reduction
- Baseline demand at $1,200: 1,800 customers
- **Adjusted demand at $1,800:** 1,800 × (1 - 0.70) = **540 customers** (first 18 months)

**Revenue Projection:**
| Metric | Value |
|---|---|
| Customers | 540 |
| Annual price per user | $1,800 |
| Year 1 ARR (full year, 50% ramp) | $486,000 |
| Year 2 ARR (assuming 75% retention + 15% new) | $732,000 |
| Year 3 ARR (assuming 80% retention + 15% new) | $1,053,000 |

**Unit Economics:**
- Gross margin (75%): $1,350/customer/year
- CAC budget (4:1 LTV:CAC for premium): ~$338/customer
- Payback period: 3.0 months
- LTV (5-year, 75% annual retention): $7,560

**Risk:** Significantly reduced addressable market; requires strong product differentiation (white-label, enterprise features).

---

## 3. Comparative Revenue Analysis (Year 1–3)

### Revenue Comparison Table

| **Scenario** | **Year 1 ARR** | **Year 2 ARR** | **Year 3 ARR** | **3-Yr Total** | **Growth CAGR** |
|---|---|---|---|---|---|
| **$800** | $1.05M | $1.55M | $2.10M | $4.70M | 41% |
| **$1,200** | $1.08M | $1.89M | $2.84M | $5.81M | 51% |
| **$1,800** | $0.49M | $0.73M | $1.05M | $2.27M | 48% |

**Key Insight:** $1,200 pricing maximizes 3-year revenue ($5.81M) while $800 drives volume with margin compression; $1,800 limits growth but improves unit margins.

---

## 4. Elasticity Sensitivity Analysis

### How Demand Shifts with ±10% Price Changes

Using PED = -1.4:

| **Price Point** | **Demand at Price** | **Demand at -10%** | **Demand at +10%** | **Change Range** |
|---|---|---|---|---|
| **$800** (-33% vs. $1,200) | 2,631 | 3,113 (+19%) | 2,206 (-16%) | ±457 customers |
| **$1,200** (baseline) | 1,800 | 2,132 (+19%) | 1,512 (-16%) | ±310 customers |
| **$1,800** (+50% vs. $1,200) | 540 | 640 (+19%) | 454 (-16%) | ±93 customers |

**Interpretation:**
- A **10% price decrease** (e.g., $1,200 → $1,080) increases demand ~19%
- A **10% price increase** (e.g., $1,200 → $1,320) decreases demand ~16%
- Elasticity is **relatively symmetric** around baseline price
- **Lowest risk scenario:** $1,200 baseline (largest absolute customer gain/loss with modest price changes)

---

## 5. Customer Acquisition Cost (CAC) Impact

### CAC-to-LTV Ratio Validation (Target: ≥3:1)

| **Scenario** | **LTV (5-yr)** | **Max Sustainable CAC** | **Assumed CAC** | **LTV:CAC Ratio** | **Viability** |
|---|---|---|---|---|---|
| **$800** | $3,200 | $1,067 | $267 | 12:1 | ✅ Excellent |
| **$1,200** | $5,040 | $1,440 | $290 | 17:1 | ✅ Excellent |
| **$1,800** | $7,560 | $1,890 | $338 | 22:1 | ✅ Excellent |

**CAC Assumptions:** 
- All scenarios assume **$200–350 CAC** (typical for SaaS: landing page + email outreach + sales call)
- Industry benchmark for digital marketing SaaS: $200–400 CAC
- All three pricing scenarios **exceed 3:1 threshold** (sustainable)

**Margin for Investment:** 
- $1,200 pricing allows $290 CAC while maintaining 3:1 ratio; leaves room for paid acquisition ($400+/customer)
- $800 pricing tolerates $267 CAC (tight if moving to paid marketing beyond organic/referral)
- $1,800 pricing allows aggressive acquisition up to $450–500 CAC

---

## 6. Churn & Retention Sensitivity

### Churn Impact on 5-Year LTV

**Assumptions:**
- Base monthly churn rate: 1% (12% annual retention drop; typical for SMB SaaS)
- Scenario range: 0.5% (aggressive retention) to 2% (high churn)

#### **$1,200 Pricing — Churn Sensitivity**

| **Monthly Churn Rate** | **Annual Retention** | **5-Yr LTV** | **LTV:CAC (vs. $290 CAC)** |
|---|---|---|---|
| **0.5%** (excellent) | 94% | $6,480 | 22:1 |
| **1.0%** (expected) | 88% | $5,040 | 17:1 |
| **1.5%** (high) | 82% | $3,840 | 13:1 |
| **2.0%** (very high) | 78% | $2,880 | 10:1 |

**Insight:** 
- Even at 2% monthly churn (78% annual), LTV remains $2,880 (10:1 LTV:CAC)
- Sweet spot: 0.8–1.2% monthly churn (target: >12:1 LTV:CAC)
- **Critical threshold:** Don't accept >2% monthly churn at $1,200 pricing (margins compress too much)

---

## 7. Add-On & Expansion Revenue Model

### Increasing LTV Through Expansion

**Base LTV (subscription only):**
- $1,200/year × 5 years × 70% average retention = $5,040

**With Add-On Adoption:**
- 30% adopt advanced integrations @ $200–400/year → $60–120 additional LTV
- 15% adopt white-label @ $500–1,000/year → $75–150 additional LTV
- 25% adopt priority support @ $300/year → $75 additional LTV
- Average add-on LTV per customer: **$210–345** (35–50% uplift)

**Expanded LTV:**
- Base: $5,040
- Add-ons: +$270 (midpoint)
- **Total LTV: $5,310** (5% increase in year 1 revenue potential)

**Implication:**
- Each 10% improvement in add-on adoption = $200 additional LTV per customer
- Targeting 30% add-on adoption (realistic): $5,040 → $5,540 LTV (+10%)

---

## 8. Price Increase Scenarios (Year 2+)

### Testing Price Elasticity with Annual Increase

**Scenario:** After validating product-market fit in Year 1, test price increases.

| **Current Price** | **Increase to** | **Change %** | **Estimated New Demand** | **Expected Churn Impact** | **Net ARR Impact** |
|---|---|---|---|---|---|
| **$1,200** | $1,320 | +10% | 1,512 customers | -2% | +$26,400 (increase) |
| **$1,200** | $1,440 | +20% | 1,260 customers | -5% | +$28,800 (increase) |
| **$1,200** | $1,560 | +30% | 1,008 customers | -8% | -$14,400 (decrease) |

**Implication:**
- **10–20% price increase is viable** (positive ARR impact even with modest churn)
- **30% increase risks net negative outcome** (too elastic at that tier)
- **Recommended strategy:** 
  - Year 1–2: $1,200 (establish foothold)
  - Year 2–3: Introduce tiered model ($599/$1,499/$2,999) to capture different segments
  - Year 3+: Raise primary tier to $1,320–1,440 (organic increase from added features)

---

## 9. Market Share & Penetration Projections

### Beachhead Market Capture (100,000 total agencies)

| **Year** | **$800 Scenario** | **$1,200 Scenario** | **$1,800 Scenario** | **Market Penetration** |
|---|---|---|---|---|
| **Year 1** | 2,631 | 1,800 | 540 | 0.27% / 0.18% / 0.05% |
| **Year 2** | 4,200 | 2,700 | 810 | 0.42% / 0.27% / 0.08% |
| **Year 3** | 6,000 | 3,850 | 1,150 | 0.60% / 0.39% / 0.12% |

**Interpretation:**
- All scenarios capture <1% market share in first 3 years (reasonable for early stage)
- $1,200 scenario positions for 0.4% penetration by year 3 (400+ agencies; validates beachhead focus)
- $800 scenario achieves 0.6% penetration (more aggressive growth, lower margin)

---

## 10. Competitive Pricing & Market Positioning

### How Pricing Affects Competitive Perception

| **Our Price** | **vs. Supermetrics** | **vs. HubSpot Reporting** | **Competitive Position** |
|---|---|---|---|
| **$800** | -33% cheaper | -44% cheaper | "Budget alternative" (churn risk) |
| **$1,200** | Same price | -17% cheaper | "Best value" (validated position) |
| **$1,800** | +52% more | +25% more | "Premium" (requires feature advantage) |

**Recommendation:** $1,200 pricing positions ReportEase as **equivalent value to market leaders but with better UX/support** (not competing on price).

---

## 11. Final Recommendation: Decision Matrix

| **Criterion** | **$800** | **$1,200** | **$1,800** |
|---|---|---|---|
| **Year 1–3 Revenue** | $4.7M | **$5.8M** ✅ | $2.3M |
| **Unit Economics (LTV:CAC)** | 12:1 | **17:1** ✅ | 22:1 |
| **Market Penetration** | High | **Optimal** ✅ | Low |
| **Competitive Positioning** | "Budget" | **"Best Value"** ✅ | "Premium" |
| **GTM Risk** | Margin squeeze | **Balanced** ✅ | Feature gap risk |
| **Expansion Headroom** | Limited | **High** ✅ | Very high |
| **Willingness-to-Pay Fit** | 25% of market | **55% of market** ✅ | 15% of market |

---

## Conclusion

**Primary recommendation: $1,200/year annual pricing**

✅ Maximizes 3-year revenue ($5.8M)  
✅ Maintains healthy unit economics (17:1 LTV:CAC)  
✅ Aligns with 55% of target market's willingness-to-pay  
✅ Leaves room for expansion through add-ons and tiering  
✅ Provides competitive defensibility (value positioning, not price-based)  

**Validation metrics (measure at MVBP launch):**
- Conversion rate >3% at $1,200 messaging
- Churn <12% monthly
- LTV estimate >$3,000 (validates 3:1 threshold)

---

**Model created:** 2026-04-22  
**Next update:** Post-MVBP launch (30-60 days), when real conversion/churn data available
