# ReportEase Product Specification Document
## AutoReport: Automated Marketing Reporting Platform

**Version:** 1.0  
**Date:** 2026-04-21  
**Status:** Final Specification (DE Step 7)  
**Target Launch:** Q2 2026 (MVBP)

---

## Executive Summary

ReportEase AutoReport is a SaaS platform that automates marketing reporting for digital marketing agencies (10-50 person shops). The product integrates with marketing data sources (Google Analytics, HubSpot, Facebook Ads, Google Ads), generates scheduled reports from customizable templates, and renders them on interactive dashboards with real-time data syncing.

**Core Value Proposition:**
- **Time Savings:** Reduce weekly reporting time from 8+ hours to under 2 hours per marketing manager
- **Accuracy:** Eliminate manual data-entry errors through automated data pipeline
- **Visualization:** Interactive, shareable dashboards for agency clients and internal stakeholders

**Beachhead Market:** Digital marketing agencies (10-50 FTE), US-based. TAM: ~$120M annually at $1,200/user/year across ~100,000 target accounts.

**Key Metrics (Target):**
- Customer Acquisition Cost (COCA): $300-400/user
- Customer Lifetime Value (LTV): $3,600-4,800 (3-year retention)
- LTV:COCA Ratio: 9:1 to 12:1
- Time saved per user per week: 6 hours
- Churn rate target: <5% monthly

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        ReportEase Platform                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐   ┌─────────────┐    │
│  │   Frontend   │         │  Backend     │   │   Job Queue │    │
│  │  (Next.js)   │◄───────►│  (Node.js)   │◄─►│  (Bull/Redis)    │
│  └──────────────┘         └──────────────┘   └─────────────┘    │
│        ▲                          ▲                    ▲          │
│        │                          │                    │          │
│        └──────────────────────────┼────────────────────┘          │
│                                   │                               │
│                        ┌──────────┴─────────┐                    │
│                        │                    │                    │
│                   ┌────▼────┐         ┌────▼────┐               │
│                   │PostgreSQL   │         │ Redis   │               │
│                   │  Database  │         │  Cache  │               │
│                   └───────────┘         └─────────┘               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
        ▲              ▲              ▲              ▲
        │              │              │              │
   ┌────┴───┐  ┌──────┴──────┐ ┌────┴────┐  ┌────┴────┐
   │ Google │  │   HubSpot   │ │Facebook │  │ Google  │
   │Analytics   │    API      │ │  Ads    │  │  Ads    │
   └────────┘  └─────────────┘ └─────────┘  └─────────┘
   (Data Sources)
```

### 1.2 Architecture Components

**Frontend Layer (Next.js 15 + React 19)**
- Server-side rendering (SSR) for SEO and performance
- Client-side React components for interactive dashboards
- Real-time WebSocket updates for dashboard data
- OAuth integration for data source authentication
- Responsive design (mobile, tablet, desktop)

**Backend Layer (Node.js + Express)**
- RESTful API for all frontend requests
- OAuth 2.0 server for managing user authentication
- Data validation and authorization middleware
- Rate limiting and API security
- Webhook handlers for data source updates

**Data Pipeline**
- Scheduled connectors for each data source (Google Analytics, HubSpot, Ads platforms)
- ETL pipeline: Extract → Transform → Load
- Data warehouse layer (PostgreSQL)
- Real-time sync for high-priority metrics
- Error handling and retry logic for failed syncs

**Job Queue (Bull + Redis)**
- Scheduled report generation jobs
- Recurring data sync jobs
- Email delivery jobs (PDF exports, scheduled emails)
- Failure notifications and retries

**Data Storage**
- PostgreSQL: Transactional data (users, orgs, templates, reports, data sources)
- Redis: Cache layer, session management, job queue
- Optional: S3 for generated reports (PDF exports)

---

## 2. API Design Specifications

### 2.1 Authentication & Authorization API

**Endpoint:** `POST /api/auth/login`
```json
Request:
{
  "email": "manager@agency.com",
  "password": "secure_password"
}

Response (200 OK):
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": "usr_12345",
    "email": "manager@agency.com",
    "name": "Sarah Johnson",
    "organization_id": "org_789",
    "role": "marketing_manager"
  },
  "expires_in": 3600
}
```

**Endpoint:** `POST /api/auth/oauth/authorize`
```json
Request:
{
  "provider": "google_analytics",
  "redirect_uri": "https://app.reportease.com/auth/callback",
  "scope": ["analytics.readonly"]
}

Response (302 Redirect):
Redirect to Google OAuth consent screen with state parameter
```

**Endpoint:** `POST /api/auth/oauth/callback`
```json
Request:
{
  "code": "4/0AX4X...",
  "state": "state_xyz123",
  "provider": "google_analytics"
}

Response (200 OK):
{
  "data_source_id": "ds_ga_12345",
  "provider": "google_analytics",
  "status": "connected",
  "properties": [
    {
      "id": "UA-12345-1",
      "name": "Main Website",
      "views": [...]
    }
  ]
}
```

### 2.2 Data Sources API

**Endpoint:** `GET /api/data-sources`
```json
Response (200 OK):
{
  "data_sources": [
    {
      "id": "ds_ga_12345",
      "provider": "google_analytics",
      "name": "Main Website",
      "status": "connected",
      "last_sync": "2026-04-21T14:32:00Z",
      "sync_interval": 3600,
      "properties": {
        "property_id": "UA-12345-1",
        "view_id": "456789"
      }
    },
    {
      "id": "ds_hs_67890",
      "provider": "hubspot",
      "name": "HubSpot CRM",
      "status": "connected",
      "last_sync": "2026-04-21T14:30:00Z",
      "sync_interval": 3600
    }
  ],
  "total": 2
}
```

**Endpoint:** `POST /api/data-sources`
```json
Request:
{
  "provider": "facebook_ads",
  "name": "Facebook Ad Account",
  "config": {
    "account_id": "123456789",
    "access_token": "encrypted_token"
  }
}

Response (201 Created):
{
  "id": "ds_fb_11111",
  "provider": "facebook_ads",
  "name": "Facebook Ad Account",
  "status": "connected",
  "last_sync": null,
  "sync_interval": 3600
}
```

**Endpoint:** `DELETE /api/data-sources/{id}`
```json
Response (200 OK):
{
  "message": "Data source disconnected",
  "id": "ds_ga_12345"
}
```

### 2.3 Google Analytics Connector API

**Endpoint:** `GET /api/connectors/google-analytics/properties`
```json
Request Query:
{
  "data_source_id": "ds_ga_12345"
}

Response (200 OK):
{
  "properties": [
    {
      "id": "UA-12345-1",
      "name": "Main Website",
      "type": "web",
      "views": [
        {
          "id": "456789",
          "name": "All Web Site Data",
          "type": "WEB"
        }
      ],
      "timezone": "America/New_York"
    }
  ]
}
```

**Endpoint:** `POST /api/connectors/google-analytics/query`
```json
Request:
{
  "data_source_id": "ds_ga_12345",
  "property_id": "UA-12345-1",
  "view_id": "456789",
  "start_date": "2026-04-01",
  "end_date": "2026-04-21",
  "metrics": [
    "ga:sessions",
    "ga:users",
    "ga:bounceRate",
    "ga:avgSessionDuration"
  ],
  "dimensions": [
    "ga:date",
    "ga:source",
    "ga:medium"
  ],
  "filters": {
    "dimension": "ga:country",
    "operator": "EXACT",
    "value": "United States"
  }
}

Response (200 OK):
{
  "query": {...},
  "data": {
    "rows": [
      {
        "dimensions": ["20260421", "google", "organic"],
        "metrics": ["1523", "1401", "32.5", "245.8"]
      }
    ],
    "total_rows": 1523,
    "contains_sampled_data": false
  },
  "cached": false,
  "generated_at": "2026-04-21T14:35:00Z"
}
```

### 2.4 HubSpot Connector API

**Endpoint:** `POST /api/connectors/hubspot/query`
```json
Request:
{
  "data_source_id": "ds_hs_67890",
  "object_type": "contacts",
  "limit": 100,
  "filters": {
    "property": "lifecyclestage",
    "value": "customer"
  },
  "properties": [
    "firstname",
    "lastname",
    "email",
    "lifecyclestage",
    "hs_lead_status",
    "createdate"
  ]
}

Response (200 OK):
{
  "query": {...},
  "data": {
    "contacts": [
      {
        "id": "1",
        "properties": {
          "firstname": "Jane",
          "lastname": "Doe",
          "email": "jane@company.com",
          "lifecyclestage": "customer",
          "hs_lead_status": "Qualified to Buy",
          "createdate": "2026-01-15T10:30:00Z"
        }
      }
    ],
    "total_count": 342
  },
  "cached": false,
  "generated_at": "2026-04-21T14:36:00Z"
}
```

### 2.5 Facebook Ads Connector API

**Endpoint:** `POST /api/connectors/facebook-ads/query`
```json
Request:
{
  "data_source_id": "ds_fb_11111",
  "account_id": "123456789",
  "start_date": "2026-04-01",
  "end_date": "2026-04-21",
  "fields": [
    "spend",
    "impressions",
    "clicks",
    "cpc",
    "cpm",
    "ctr",
    "conversion_rate",
    "actions"
  ],
  "grouping": "campaign",
  "filters": {
    "status": ["ACTIVE", "PAUSED"]
  }
}

Response (200 OK):
{
  "query": {...},
  "data": {
    "campaigns": [
      {
        "id": "campaign_123",
        "name": "Summer Sale 2026",
        "status": "ACTIVE",
        "metrics": {
          "spend": "5432.10",
          "impressions": "125000",
          "clicks": "3420",
          "cpc": "1.59",
          "cpm": "43.46",
          "ctr": "2.74",
          "actions": "156"
        }
      }
    ],
    "total_spend": "12450.50",
    "total_results": 8
  },
  "cached": false,
  "generated_at": "2026-04-21T14:37:00Z"
}
```

### 2.6 Reports API

**Endpoint:** `POST /api/reports`
```json
Request:
{
  "name": "Monthly Performance Report - April",
  "template_id": "tpl_standard_monthly",
  "organization_id": "org_789",
  "data_sources": ["ds_ga_12345", "ds_hs_67890", "ds_fb_11111"],
  "date_range": {
    "start": "2026-04-01",
    "end": "2026-04-30"
  },
  "sections": [
    {
      "id": "overview",
      "type": "summary_metrics",
      "title": "Performance Overview",
      "metrics": ["sessions", "users", "conversions", "revenue"]
    },
    {
      "id": "traffic_sources",
      "type": "bar_chart",
      "title": "Traffic by Source",
      "data_source": "ds_ga_12345",
      "dimension": "source",
      "metric": "sessions"
    },
    {
      "id": "pipeline",
      "type": "funnel",
      "title": "Sales Pipeline",
      "data_source": "ds_hs_67890"
    }
  ],
  "schedule": {
    "frequency": "weekly",
    "day": "monday",
    "time": "09:00",
    "timezone": "America/New_York"
  },
  "recipients": ["client@agency.com", "manager@agency.com"]
}

Response (201 Created):
{
  "id": "rpt_12345",
  "name": "Monthly Performance Report - April",
  "template_id": "tpl_standard_monthly",
  "status": "draft",
  "created_at": "2026-04-21T14:40:00Z",
  "schedule": {...}
}
```

**Endpoint:** `GET /api/reports/{id}/preview`
```json
Response (200 OK):
{
  "id": "rpt_12345",
  "html": "<html>... rendered report HTML ...</html>",
  "data": {
    "sections": [
      {
        "id": "overview",
        "data": {
          "sessions": 24521,
          "users": 18932,
          "conversions": 342,
          "revenue": 18750.50
        }
      }
    ]
  }
}
```

**Endpoint:** `POST /api/reports/{id}/generate`
```json
Response (200 OK):
{
  "id": "rpt_12345",
  "status": "processing",
  "job_id": "job_xyz789",
  "estimated_completion": "2026-04-21T14:42:00Z"
}
```

**Endpoint:** `POST /api/reports/{id}/send`
```json
Request:
{
  "recipients": ["client@company.com", "manager@agency.com"],
  "format": "pdf",
  "include_executive_summary": true,
  "message": "Please find attached your April performance report."
}

Response (200 OK):
{
  "id": "rpt_12345",
  "sent_to": 2,
  "status": "sent",
  "sent_at": "2026-04-21T14:41:00Z"
}
```

### 2.7 Dashboards API

**Endpoint:** `GET /api/dashboards/{id}`
```json
Response (200 OK):
{
  "id": "dash_12345",
  "name": "Client Performance Dashboard",
  "organization_id": "org_789",
  "reports": [
    {
      "id": "rpt_12345",
      "name": "Monthly Performance Report",
      "last_updated": "2026-04-21T14:41:00Z"
    }
  ],
  "refresh_interval": 3600,
  "last_refreshed": "2026-04-21T14:41:00Z",
  "widgets": [
    {
      "id": "widget_1",
      "type": "metric_card",
      "title": "Total Sessions",
      "value": 24521,
      "change": "+12.3%",
      "trend": "up"
    }
  ]
}
```

---

## 3. Database Schema

### 3.1 Core Tables

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  organization_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'admin', 'manager', 'analyst'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
```

**organizations**
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  logo_url VARCHAR(512),
  website_url VARCHAR(512),
  industry VARCHAR(100),
  employee_count INT,
  subscription_plan VARCHAR(50) DEFAULT 'free', -- 'free', 'starter', 'professional', 'enterprise'
  subscription_status VARCHAR(50) DEFAULT 'active',
  stripe_customer_id VARCHAR(255),
  monthly_users INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_organizations_slug ON slug
);
```

**data_sources**
```sql
CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'google_analytics', 'hubspot', 'facebook_ads', 'google_ads'
  name VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255),
  provider_credentials JSONB NOT NULL, -- encrypted OAuth tokens
  status VARCHAR(50) DEFAULT 'connected', -- 'connected', 'disconnected', 'error'
  last_sync TIMESTAMP,
  next_sync TIMESTAMP,
  sync_interval INT DEFAULT 3600, -- seconds
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  INDEX idx_data_sources_organization ON organization_id,
  INDEX idx_data_sources_provider ON provider
);
```

**templates**
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'standard', 'custom', 'industry_specific'
  is_public BOOLEAN DEFAULT FALSE,
  config JSONB NOT NULL, -- template structure, sections, widgets
  preview_image_url VARCHAR(512),
  created_by_user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  INDEX idx_templates_organization ON organization_id
);
```

**reports**
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  template_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'generated', 'sent'
  date_range_start DATE,
  date_range_end DATE,
  generated_html TEXT,
  generated_pdf_url VARCHAR(512),
  data JSONB, -- cached report data
  schedule JSONB, -- cron schedule if recurring
  last_generated TIMESTAMP,
  next_scheduled TIMESTAMP,
  created_by_user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (template_id) REFERENCES templates(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  INDEX idx_reports_organization ON organization_id,
  INDEX idx_reports_template ON template_id
);
```

**report_recipients**
```sql
CREATE TABLE report_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'opened', 'failed'
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id),
  INDEX idx_report_recipients_report ON report_id,
  INDEX idx_report_recipients_email ON recipient_email
);
```

**dashboards**
```sql
CREATE TABLE dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  reports JSONB, -- array of report IDs and settings
  refresh_interval INT DEFAULT 3600, -- seconds
  is_public BOOLEAN DEFAULT FALSE,
  public_token VARCHAR(255) UNIQUE,
  last_refreshed TIMESTAMP,
  created_by_user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  INDEX idx_dashboards_organization ON organization_id
);
```

**scheduled_jobs**
```sql
CREATE TABLE scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  job_type VARCHAR(100) NOT NULL, -- 'data_sync', 'report_generation', 'email_send'
  related_resource_id UUID, -- report_id, data_source_id, etc.
  schedule JSONB NOT NULL, -- cron expression
  status VARCHAR(50) DEFAULT 'active',
  last_run TIMESTAMP,
  next_run TIMESTAMP,
  last_error TEXT,
  retry_count INT DEFAULT 0,
  max_retries INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  INDEX idx_scheduled_jobs_organization ON organization_id,
  INDEX idx_scheduled_jobs_next_run ON next_run
);
```

**audit_logs**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_audit_logs_organization ON organization_id,
  INDEX idx_audit_logs_user ON user_id,
  INDEX idx_audit_logs_created ON created_at
);
```

---

## 4. UI Mockups & User Flows

### 4.1 Signup & Onboarding Flow

**Step 1: Sign Up Page** (`/signup`)
```
┌─────────────────────────────────────────┐
│          ReportEase                      │
│    Your Time-Saving Reporting           │
│          Assistant                       │
├─────────────────────────────────────────┤
│                                          │
│  Email:        [________________]        │
│  Name:         [________________]        │
│  Company:      [________________]        │
│  Password:     [________________]        │
│                                          │
│  [Sign Up Free]      [Login]             │
│                                          │
│  By signing up, you agree to our        │
│  Terms of Service and Privacy Policy    │
│                                          │
└─────────────────────────────────────────┘
```

**Step 2: Email Verification**
```
┌─────────────────────────────────────────┐
│  Verify Your Email                      │
├─────────────────────────────────────────┤
│                                          │
│  We've sent a confirmation link to:    │
│  manager@agency.com                     │
│                                          │
│  [Check your email]                     │
│                                          │
│  Didn't receive it?                     │
│  [Resend verification email]            │
│                                          │
└─────────────────────────────────────────┘
```

**Step 3: Connect First Data Source** (`/onboarding/connect`)
```
┌─────────────────────────────────────────┐
│  Connect Your First Data Source         │
├─────────────────────────────────────────┤
│                                          │
│  Which platform would you like to       │
│  connect first?                         │
│                                          │
│  ┌──────────────┐ ┌──────────────┐     │
│  │ Google       │ │   HubSpot    │     │
│  │ Analytics    │ │              │     │
│  │              │ │ [Connect]    │     │
│  │ [Connect]    │ └──────────────┘     │
│  └──────────────┘                      │
│                                          │
│  ┌──────────────┐ ┌──────────────┐     │
│  │ Facebook     │ │  Google Ads  │     │
│  │ Ads          │ │              │     │
│  │              │ │ [Connect]    │     │
│  │ [Connect]    │ └──────────────┘     │
│  └──────────────┘                      │
│                                          │
│  You can add more data sources later    │
│                                          │
└─────────────────────────────────────────┘
```

**Step 4: OAuth Authorization Flow** (External - Google Analytics example)
```
┌─────────────────────────────────────────┐
│  Google Sign-In                         │
├─────────────────────────────────────────┤
│                                          │
│  ReportEase is requesting access to:   │
│                                          │
│  ✓ View your Google Analytics data     │
│                                          │
│  [Allow]          [Cancel]              │
│                                          │
└─────────────────────────────────────────┘
```

**Step 5: Select Properties/Views** (`/onboarding/properties`)
```
┌─────────────────────────────────────────┐
│  Select Google Analytics Properties     │
├─────────────────────────────────────────┤
│                                          │
│  Which properties would you like to     │
│  track? (Select at least one)           │
│                                          │
│  ☑ Main Website (UA-12345-1)            │
│    └─ View: All Web Site Data           │
│  ☐ Blog (UA-12345-2)                    │
│    └─ View: All Web Site Data           │
│  ☐ E-commerce (UA-12345-3)              │
│    └─ View: All Web Site Data           │
│                                          │
│  [Next]              [Skip]             │
│                                          │
└─────────────────────────────────────────┘
```

**Step 6: Choose First Report Template** (`/onboarding/template`)
```
┌─────────────────────────────────────────┐
│  Create Your First Report               │
├─────────────────────────────────────────┤
│                                          │
│  Choose a template to get started:      │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ Monthly Performance Report       │   │
│  │ └─ Sessions, Users, Conversions  │   │
│  │ [Select]                         │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ Weekly Traffic Overview          │   │
│  │ └─ Traffic sources, channels     │   │
│  │ [Select]                         │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │ Custom Blank Template            │   │
│  │ └─ Start from scratch            │   │
│  │ [Select]                         │   │
│  └──────────────────────────────────┘   │
│                                          │
└─────────────────────────────────────────┘
```

---

### 4.2 Report Builder Interface (`/dashboard/reports/new`)

```
┌──────────────────────────────────────────────────────────────────┐
│ ReportEase Dashboard                  [User Menu] [Notifications] │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│ ◄ Back to Reports                                                 │
│                                                                    │
│ Monthly Performance Report                                        │
│                                                                    │
├─────────────────────┬──────────────────────────────────────────┤
│ Report Settings     │ Preview Pane                             │
├─────────────────────┤                                          │
│                     │                                          │
│ Report Name:        │ ┌──────────────────────────────────────┐│
│ [Monthly Perf...] ▼ │ │ Monthly Performance Report           ││
│                     │ │ April 1-30, 2026                     ││
│ Template:           │ │                                      ││
│ [Standard Monthly]▼ │ │ ┌──────────────────────────────────┐││
│                     │ │ │ Total Sessions      24,521        │││
│                     │ │ │ Total Users         18,932        │││
│ Data Sources:       │ │ │ Conversions         342           │││
│ ☑ Google Analytics  │ │ │ Revenue             $18,750       │││
│ ☑ HubSpot           │ │ └──────────────────────────────────┘││
│ ☐ Facebook Ads      │ │                                      ││
│ ☐ Google Ads        │ │ ┌──────────────────────────────────┐││
│                     │ │ │ Traffic by Source (Bar Chart)    │││
│ Date Range:         │ │ │ ┃                             │││
│ [Apr 1] to [Apr 30] │ │ │ ┃███                          │││
│                     │ │ │ ┃███                          │││
│ Recipients:         │ │ │ ┃██ Organic  (45%)            │││
│ [client@...] [+]    │ │ └──────────────────────────────────┘││
│                     │ │                                      ││
│ Schedule:           │ │ [↓ Scroll to see more sections]      ││
│ [Manually] ▼        │ │                                      ││
│                     │ │ Last updated: Apr 21, 2:45 PM       ││
│ [+ Add Section]     │ └──────────────────────────────────────┘│
│                     │                                          │
│ ┌─────────────────┐ │ [← Back] [Save Draft] [Preview Full]   │
│ │ [Generate Now]  │ │ [Schedule] [Send Now]                  │
│ │ [Save & Close]  │ │                                          │
│ └─────────────────┘ │                                          │
│                     │                                          │
└─────────────────────┴──────────────────────────────────────────┘
```

---

### 4.3 Main Dashboard View (`/dashboard`)

```
┌──────────────────────────────────────────────────────────────────┐
│ ReportEase                              [Search] [User] [Settings]│
├──────────────────────────────────────────────────────────────────┤
│ My Dashboard                                                       │
│                                                                    │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ April 1-21, 2026              [← Prev Month] [Next Month →]│   │
│ └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│ Active Reports & Dashboards                                      │
│ ┌──────────────────────┐ ┌──────────────────────┐               │
│ │ Monthly Performance  │ │ Weekly Traffic       │               │
│ │ Report               │ │ Overview             │               │
│ │ Last updated:        │ │ Last updated:        │               │
│ │ Apr 21, 2:45 PM      │ │ Apr 21, 10:00 AM    │               │
│ │ [View] [Edit] [Send] │ │ [View] [Edit] [Send] │               │
│ └──────────────────────┘ └──────────────────────┘               │
│                                                                    │
│ ┌──────────────────────┐ ┌──────────────────────┐               │
│ │ Lead Gen Analysis    │ │ [+ Create New        │               │
│ │ Report               │ │   Report/Dashboard]  │               │
│ │ Last updated:        │ │                      │               │
│ │ Apr 20, 9:30 AM      │ │                      │               │
│ │ [View] [Edit] [Send] │ │                      │               │
│ └──────────────────────┘ └──────────────────────┘               │
│                                                                    │
│ Recent Reports                                                   │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Report Name           │ Status    │ Generated   │ Action │   │
│ ├──────────────────────────────────────────────────────────┤   │
│ │ Mar Monthly Report    │ Sent      │ Mar 31     │ [View] │   │
│ │ Mar Weekly #4         │ Sent      │ Mar 28     │ [View] │   │
│ │ Q1 Final Report       │ Sent      │ Mar 31     │ [View] │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4.4 Data Source Settings (`/settings/data-sources`)

```
┌──────────────────────────────────────────────────────────────────┐
│ Settings > Data Sources                                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│ Connected Data Sources                                           │
│                                                                    │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Google Analytics (Main Website)                          │   │
│ │ Status: ✓ Connected                                      │   │
│ │ Account: manager@gmail.com                               │   │
│ │ Last sync: 1 hour ago                                    │   │
│ │ Auto-sync: Every hour                                    │   │
│ │ [Edit]  [Disconnect]  [Test Connection]                 │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ HubSpot CRM                                              │   │
│ │ Status: ✓ Connected                                      │   │
│ │ Account: company@hubspot.com                             │   │
│ │ Last sync: 30 minutes ago                                │   │
│ │ Auto-sync: Every hour                                    │   │
│ │ [Edit]  [Disconnect]  [Test Connection]                 │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Facebook Ads                                             │   │
│ │ Status: ⚠ Sync Failed (Unauthorized)                    │   │
│ │ Account: ads@facebook.com                                │   │
│ │ Last sync: 3 hours ago (ERROR)                           │   │
│ │ Auto-sync: Every hour (currently paused)                 │   │
│ │ [Edit]  [Disconnect]  [Test Connection]  [Retry]        │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ [+ Add New Data Source]                                  │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Pipeline Architecture

### 5.1 ETL Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Data Pipeline Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ Extract Phase                                                    │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │  Data Sources                                            │     │
│ │  ├─ Google Analytics API                                │     │
│ │  ├─ HubSpot API                                         │     │
│ │  ├─ Facebook Ads API                                    │     │
│ │  └─ Google Ads API                                      │     │
│ └──────────────────────┬──────────────────────────────────┘     │
│                        │                                         │
│                        ▼                                         │
│ Transform Phase                                                  │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │  Data Transformers (Node.js worker processes)           │     │
│ │  ├─ Normalize data formats                              │     │
│ │  ├─ Validate data integrity                             │     │
│ │  ├─ Calculate derived metrics                           │     │
│ │  ├─ Handle missing/null values                          │     │
│ │  └─ Apply filters and aggregations                      │     │
│ └──────────────────────┬──────────────────────────────────┘     │
│                        │                                         │
│                        ▼                                         │
│ Load Phase                                                       │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │  PostgreSQL Data Warehouse                              │     │
│ │  ├─ Normalized fact tables                              │     │
│ │  ├─ Dimension tables                                    │     │
│ │  ├─ Aggregated views                                    │     │
│ │  └─ Indexed for query performance                       │     │
│ └──────────────────────┬──────────────────────────────────┘     │
│                        │                                         │
│                        ▼                                         │
│ Serve Phase                                                      │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │  Report Generation Engine                               │     │
│ │  ├─ Query aggregated data                               │     │
│ │  ├─ Apply template styling                              │     │
│ │  ├─ Render interactive visualizations                   │     │
│ │  └─ Generate PDF exports                                │     │
│ └──────────────────────┬──────────────────────────────────┘     │
│                        │                                         │
│                        ▼                                         │
│ Deliver Phase                                                    │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │  Delivery Channels                                       │     │
│ │  ├─ Interactive Dashboard (web)                         │     │
│ │  ├─ Email (HTML + PDF attachment)                       │     │
│ │  ├─ Public shared link                                  │     │
│ │  └─ Slack/Teams webhook                                 │     │
│ └─────────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Data Sync Job Schedule

```
Scheduled Jobs Configuration (in Redis/Bull):

Job: sync_google_analytics
├─ Cron: 0 * * * * (hourly)
├─ Timeout: 5 minutes
├─ Retry: 3 attempts with exponential backoff
├─ Data sources: All GA connections
└─ Action: Query GA API, transform data, load to PostgreSQL

Job: sync_hubspot
├─ Cron: 0 * * * * (hourly)
├─ Timeout: 5 minutes
├─ Retry: 3 attempts
├─ Data sources: All HubSpot connections
└─ Action: Query HubSpot API, transform, load

Job: sync_facebook_ads
├─ Cron: 0 * * * * (hourly)
├─ Timeout: 5 minutes
├─ Retry: 3 attempts
├─ Data sources: All Facebook Ads connections
└─ Action: Query FB API, transform, load

Job: generate_scheduled_reports
├─ Cron: 0 0 * * * (daily)
├─ Timeout: 10 minutes
├─ Process: All scheduled reports with daily/weekly/monthly frequency
└─ Action: Query data, render template, store HTML/PDF, send emails

Job: cleanup_old_data
├─ Cron: 0 2 * * 0 (weekly, Sunday 2 AM)
├─ Process: Delete reports older than 90 days
└─ Action: Clean up old cached data, archive historical reports
```

---

## 6. Authentication & Authorization

### 6.1 OAuth Flow (Data Sources)

```
User Authentication Flow:

1. User clicks "Connect Google Analytics"
2. Frontend redirects to: 
   https://accounts.google.com/o/oauth2/v2/auth?
   client_id=REPORTEASE_CLIENT_ID&
   scope=https://www.googleapis.com/auth/analytics.readonly&
   response_type=code&
   redirect_uri=https://app.reportease.com/auth/callback&
   state=random_state_xyz

3. User grants permission on Google consent screen
4. Google redirects to:
   https://app.reportease.com/auth/callback?code=AUTH_CODE&state=xyz

5. Backend exchanges code for access token:
   POST https://oauth2.googleapis.com/token
   {
     client_id: REPORTEASE_CLIENT_ID,
     client_secret: REPORTEASE_SECRET,
     code: AUTH_CODE,
     grant_type: authorization_code,
     redirect_uri: https://app.reportease.com/auth/callback
   }

6. Google returns access token + refresh token
7. Backend encrypts and stores in data_sources table
8. Backend returns success to frontend
9. User can now query Google Analytics data
```

### 6.2 Session Management

```
User Session Flow:

1. User logs in with email/password
2. Backend validates credentials against password_hash
3. Backend generates JWT tokens:
   - Access token (15 min expiry)
   - Refresh token (7 day expiry)
4. Frontend stores tokens in secure HTTP-only cookies
5. Frontend includes access token in Authorization header for all API requests
6. Backend validates token signature and expiry on each request
7. When access token expires:
   - Frontend calls POST /api/auth/refresh with refresh token
   - Backend validates refresh token and issues new access token
8. User logout: clear cookies, revoke refresh tokens
```

### 6.3 Authorization Model

```
Role-Based Access Control (RBAC):

User Roles:
├─ admin
│  └─ Full access: users, billing, data sources, all reports/templates
├─ manager
│  └─ Create/edit/send reports, manage team templates, view all analytics
└─ analyst
   └─ Create/edit reports, view assigned data sources only

Resource Permissions Matrix:

                          | Admin | Manager | Analyst
─────────────────────────────────────────────────────
View Dashboard            │   ✓   │    ✓    │   ✓
Create Report             │   ✓   │    ✓    │   ✓
Edit Own Report           │   ✓   │    ✓    │   ✓
Edit Others' Reports      │   ✓   │    ✓    │   ✗
Delete Report             │   ✓   │    ✓    │   ✗
View All Dashboards       │   ✓   │    ✓    │   ✓
Create Template           │   ✓   │    ✓    │   ✗
Manage Data Sources       │   ✓   │    ✓    │   ✗
View Team Members         │   ✓   │    ✓    │   ✗
Invite Users              │   ✓   │    ✓    │   ✗
Change Subscription       │   ✓   │    ✗    │   ✗
View Audit Logs           │   ✓   │    ✗    │   ✗
```

---

## 7. Deployment Architecture

### 7.1 Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Production Deployment                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│ CDN Layer (Cloudflare)                                           │
│ ├─ Cache static assets (images, CSS, JS)                        │
│ ├─ DDoS protection                                              │
│ └─ Global edge caching                                          │
│          │                                                       │
│          ▼                                                       │
│ Load Balancer (AWS ALB)                                         │
│ ├─ HTTPS termination                                            │
│ ├─ Route traffic by path                                        │
│ └─ Health checks                                                │
│          │                                                       │
│     ┌────┴────┐                                                 │
│     │          │                                                 │
│     ▼          ▼                                                 │
│ Compute Layer                                                   │
│ ┌──────────────────┐  ┌──────────────────┐                     │
│ │ Frontend (Next.js)│  │ Backend (Node.js)│                     │
│ │ Docker Container │  │ Docker Containers│                     │
│ │ x2 (multi-AZ)    │  │ x4 (auto-scale)  │                     │
│ │ AWS ECS Fargate  │  │ AWS ECS Fargate  │                     │
│ └──────────────────┘  └──────────────────┘                     │
│          │                    │                                  │
│          │                    │                                  │
│          └────────┬───────────┘                                  │
│                   │                                              │
│                   ▼                                              │
│ Data Layer                                                       │
│ ┌──────────────────────────────────────┐                       │
│ │ PostgreSQL RDS Multi-AZ              │                       │
│ │ ├─ Primary instance (2 vCPU)         │                       │
│ │ ├─ Failover replica (automatic)      │                       │
│ │ ├─ Automated daily backups (30 day)  │                       │
│ │ └─ Point-in-time recovery            │                       │
│ └──────────────────────────────────────┘                       │
│                                                                   │
│ Cache Layer                                                      │
│ ┌──────────────────────────────────────┐                       │
│ │ Redis ElastiCache                    │                       │
│ │ ├─ Cache layer for queries           │                       │
│ │ ├─ Session management                │                       │
│ │ ├─ Job queue (Bull)                  │                       │
│ │ └─ Multi-AZ with auto-failover       │                       │
│ └──────────────────────────────────────┘                       │
│                                                                   │
│ Background Jobs                                                  │
│ ┌──────────────────────────────────────┐                       │
│ │ Worker Fleet (ECS Tasks)             │                       │
│ │ ├─ Data sync jobs (3 workers)        │                       │
│ │ ├─ Report generation (2 workers)     │                       │
│ │ ├─ Email delivery (2 workers)        │                       │
│ │ └─ Auto-scale based on queue depth   │                       │
│ └──────────────────────────────────────┘                       │
│                                                                   │
│ Storage                                                          │
│ ┌──────────────────────────────────────┐                       │
│ │ S3 Bucket (PDF exports)              │                       │
│ │ ├─ Lifecycle policy: delete after 90d│                       │
│ │ ├─ Server-side encryption            │                       │
│ │ └─ Versioning enabled                │                       │
│ └──────────────────────────────────────┘                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Deployment Steps

**Development Environment:**
1. Developer pushes code to feature branch
2. GitHub Actions runs tests, linting, build
3. On PR merge to main, auto-deploy to staging
4. Manual approval for production deployment

**Production Deployment:**
```bash
# Build Docker image
docker build -t reportease:latest .

# Push to ECR
aws ecr push reportease:latest

# Update ECS task definition
aws ecs register-task-definition --cli-input-json file://task-def.json

# Update ECS service
aws ecs update-service \
  --cluster reportease-prod \
  --service frontend \
  --force-new-deployment
```

**Database Migrations:**
```bash
# Running migrations safely
npm run migrate:status
npm run migrate:up  # Runs pending migrations
npm run migrate:rollback  # Rollback last migration
```

---

## 8. Feature Roadmap (First 12 Months)

### MVBP (Months 1-2)
- ✓ User authentication (email/password, OAuth for data sources)
- ✓ Google Analytics connector (read-only)
- ✓ Basic report templates (overview, traffic sources, conversions)
- ✓ Report generation engine (HTML rendering)
- ✓ Email delivery (HTML + PDF)
- ✓ Basic dashboard view
- ✓ Signup/onboarding flow

### Phase 1 (Months 2-3)
- HubSpot connector (contacts, deals, pipeline)
- Advanced filtering and segmentation in templates
- Custom report builder (drag-and-drop sections)
- Scheduled reports (daily, weekly, monthly)
- Data source management UI

### Phase 2 (Months 4-5)
- Facebook Ads connector
- Google Ads connector
- Real-time dashboard updates (WebSocket)
- Multi-organization support
- Team member management and roles

### Phase 3 (Months 6-7)
- Advanced visualizations (heatmaps, funnels, trends)
- Predictive analytics (trend forecasting)
- Anomaly detection (alert on unusual metrics)
- Slack/Teams integration
- Public shareable dashboards

### Phase 4 (Months 8-12)
- White-label dashboards for resellers
- Advanced permission/security model
- Integration marketplace (Zapier, etc.)
- Mobile app (iOS/Android)
- Advanced reporting (benchmarking, attribution)

---

## 9. Success Metrics & KPIs

### User Engagement
- **Daily Active Users (DAU):** Target >60% of activated users
- **Report Generation Frequency:** Target 2+ reports/user/week
- **Session Duration:** Target >8 minutes/session for dashboard views
- **Feature Adoption:** Target >80% adoption of report scheduling

### Business Metrics
- **Customer Acquisition Cost (COCA):** Target $300-400/user
- **Customer Lifetime Value (LTV):** Target $3,600-4,800
- **Monthly Churn Rate:** Target <5%
- **Net Revenue Retention:** Target >100% (expansion within accounts)

### Product Quality
- **API Uptime:** Target 99.9%
- **Data Sync Success Rate:** Target >99.5%
- **Report Generation Time:** Target <30 seconds for avg report
- **Mobile Performance:** Target <3 second page load time

### Customer Satisfaction
- **Net Promoter Score (NPS):** Target >50
- **Customer Support Response Time:** Target <2 hours
- **Bug Resolution Time:** Target <24 hours for critical bugs

---

## 10. Risk Mitigation

### Technical Risks

**Risk:** API rate limits from third-party data sources
- Mitigation: Implement request queuing, caching, batch processing
- Fallback: Graceful degradation with cached data

**Risk:** Data sync failures
- Mitigation: Retry logic with exponential backoff, error alerting
- Fallback: Use most recent valid cached data

**Risk:** Performance degradation with large datasets
- Mitigation: Database indexing strategy, query optimization, caching
- Fallback: Pagination, sampling for massive datasets

### Market Risks

**Risk:** Customer adoption slower than projected
- Mitigation: Aggressive product-market fit testing, iterate on UX
- Fallback: Pivot to adjacent market segments

**Risk:** Competition from established players (Supermetrics, etc.)
- Mitigation: Focus on ease-of-use and time savings; build strong integrations
- Fallback: Position as specialized solution for agencies

---

## Conclusion

This product specification provides a comprehensive blueprint for building ReportEase AutoReport MVBP. The system architecture is scalable, the API design is clean and extensible, and the deployment architecture supports production traffic from day one.

**Next Steps:**
1. Review and approve specification with product team
2. Begin frontend development (Next.js pages and components)
3. Begin backend development (Node.js API and connectors)
4. Setup CI/CD pipeline and testing infrastructure
5. Prepare for user testing and validation

**Estimated Development Timeline for MVBP:**
- Week 1-2: Backend API scaffolding and database setup
- Week 2-3: Google Analytics connector implementation
- Week 3-4: Frontend pages and report builder
- Week 4-5: Email delivery and scheduling
- Week 5-6: Testing, polish, deployment setup
- Week 6: MVBP ready for beta testing with early customers

---

**Document Owner:** CEO Agent  
**Last Updated:** 2026-04-21  
**Status:** Final (Ready for Development)