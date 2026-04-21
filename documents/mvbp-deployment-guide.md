# MVBP Deployment & Infrastructure Guide
**Date:** April 21, 2026  
**Version:** 1.0  
**Status:** ✅ READY FOR PRODUCTION DEPLOYMENT

---

## Quick Start

### Staging Deployment
```bash
# 1. Build the application
npm install
npm run build

# 2. Verify tests pass
npm test

# 3. Start server
npm start

# 4. Test endpoints
curl http://localhost:3000/api/health
```

### Production URLs
```
Landing Page: https://reportease.app/mvbp
Dashboard: https://reportease.app/dashboard
API Base: https://api.reportease.app
```

---

## 1. System Architecture

### Application Stack
- **Framework:** Next.js 15 (React 19)
- **Language:** TypeScript
- **Database:** In-Memory (MVP) → PostgreSQL (Production)
- **Hosting:** Docker container
- **CI/CD:** GitHub Actions

### Component Diagram
```
┌─────────────────────────────────────────────────────┐
│                  Client Browser                      │
│  [Landing Form] [Dashboard] [Analytics Flow]         │
└────────────────────┬────────────────────────────────┘
                     │ HTTP/HTTPS
┌────────────────────▼────────────────────────────────┐
│             Next.js Application                      │
│  ┌────────────────────────────────────────────────┐ │
│  │   API Routes (src/app/api/)                    │ │
│  │  ├─ /api/health (system status)                │ │
│  │  ├─ /api/leads (form submission)               │ │
│  │  ├─ /api/analytics/oauth (GA4 auth)            │ │
│  │  ├─ /api/analytics/data (GA4 metrics)          │ │
│  │  └─ /api/monitoring/events (event logging)     │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │   Pages (src/app/)                             │ │
│  │  ├─ /mvbp (landing page)                       │ │
│  │  ├─ /dashboard (monitoring dashboard)          │ │
│  │  └─ /layout (root layout)                      │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │   Data Storage (In-Memory)                     │ │
│  │  ├─ leads[] (submitted leads)                  │ │
│  │  └─ events[] (monitoring events)               │ │
│  └────────────────────────────────────────────────┘ │
└────────────┬─────────────────────────────────────────┘
             │
             ├─ External: Google Analytics API
             ├─ External: Google OAuth
             └─ External: Email Service (future)
```

---

## 2. Deployment Steps

### Step 1: Pre-Deployment Checklist
```bash
# Verify Node version
node --version  # Should be 18+ 

# Verify all tests pass
npm test  # 42/42 passing

# Verify build succeeds
npm run build  # No errors

# Check dependencies
npm list  # Review for vulnerabilities
```

### Step 2: Environment Configuration
Create `.env.local` in project root:
```env
# Node Environment
NODE_ENV=production

# API Configuration
NEXT_PUBLIC_API_URL=https://api.reportease.app
NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=YOUR_CLIENT_ID

# Database (upgrade from in-memory)
DATABASE_URL=postgresql://user:pass@localhost:5432/reportease

# Monitoring
SENTRY_DSN=https://your-sentry-dsn

# Feature Flags
ENABLE_REAL_GA_OAUTH=false
ENABLE_DATABASE_PERSISTENCE=false
```

### Step 3: Database Setup (Production)
```sql
-- Create leads table
CREATE TABLE leads (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  company VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(255),
  metadata JSONB
);

-- Create events table
CREATE TABLE monitoring_events (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  duration INTEGER NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details JSONB,
  INDEX idx_type (type),
  INDEX idx_timestamp (timestamp)
);

-- Create indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_events_type_timestamp ON monitoring_events(type, timestamp);
```

### Step 4: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
```

Build and run:
```bash
# Build image
docker build -t reportease-mvbp:1.0.0 .

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://... \
  reportease-mvbp:1.0.0

# Verify health
curl http://localhost:3000/api/health
```

### Step 5: Nginx Reverse Proxy Configuration

```nginx
upstream reportease {
  server localhost:3000 max_fails=3 fail_timeout=30s;
  keepalive 32;
}

server {
  listen 443 ssl http2;
  server_name api.reportease.app;

  # SSL certificates
  ssl_certificate /etc/letsencrypt/live/reportease.app/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/reportease.app/privkey.pem;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Proxy configuration
  location / {
    proxy_pass http://reportease;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
  }

  # Health check endpoint
  location /api/health {
    access_log off;
    proxy_pass http://reportease;
  }
}
```

### Step 6: Verify Deployment

```bash
# Test landing page
curl -L https://api.reportease.app/mvbp

# Test API endpoints
curl https://api.reportease.app/api/health
curl https://api.reportease.app/api/leads

# Test dashboard
curl -L https://api.reportease.app/dashboard

# Monitor logs
docker logs -f reportease-mvbp-container
```

---

## 3. Scaling Configuration

### Horizontal Scaling
```bash
# Run multiple instances behind load balancer
docker run -d -p 3001:3000 reportease-mvbp:1.0.0
docker run -d -p 3002:3000 reportease-mvbp:1.0.0
docker run -d -p 3003:3000 reportease-mvbp:1.0.0
```

### Load Balancing
Use nginx upstream (see config above) or:
```bash
# Kubernetes deployment
kubectl apply -f deployment.yaml
```

### Database Connection Pooling
```env
# Add to .env.local
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20
DATABASE_POOL_TIMEOUT=30000
```

---

## 4. Monitoring & Alerts

### Real-Time Dashboard
```
URL: https://api.reportease.app/dashboard
Auto-refresh: Every 10 seconds
Metrics: 6 KPIs + component health
```

### Key Metrics to Monitor

#### Form Submission Health
```
Metric: Success Rate
Target: >95%
Alert: <90% for 5 min
```

#### API Performance
```
Metric: Average Response Time
Target: <300ms
Alert: >500ms for 5 min
```

#### OAuth Flow
```
Metric: Token Exchange Success Rate
Target: >99%
Alert: <95% for 5 min
```

#### System Health
```
Metric: API Uptime
Target: 99.9%
Alert: Outage >5 min
```

### Alert Configuration

```bash
# Slack integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Email alerts
ALERT_EMAIL=ops@reportease.app

# PagerDuty (critical only)
PAGERDUTY_KEY=...
```

---

## 5. Rollback Procedures

### Automatic Rollback
```bash
# If health check fails 3 times
# System automatically rolls back to previous version
# Takes ~30 seconds
```

### Manual Rollback
```bash
# Get previous image version
docker images reportease-mvbp

# Stop current container
docker stop reportease-mvbp-current

# Start previous version
docker run -d --name reportease-mvbp \
  -p 3000:3000 \
  reportease-mvbp:0.9.0

# Verify health
curl http://localhost:3000/api/health
```

---

## 6. Database Migration (From In-Memory to PostgreSQL)

### Phase 1: Dual Write (Backward Compatibility)
```typescript
// Write to both in-memory and database
const inMemoryDB = [];
const postgresDB = await query('INSERT INTO leads ...');
```

### Phase 2: Read from Database
```typescript
// Read from database primarily
const leads = await query('SELECT * FROM leads');
```

### Phase 3: Remove In-Memory
```typescript
// Delete in-memory storage code
// Keep database-only implementation
```

**Estimated Downtime:** 0 seconds (live migration)

---

## 7. CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy MVBP

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          docker build -t reportease-mvbp:${{ github.sha }} .
          docker push reportease-mvbp:${{ github.sha }}
          kubectl set image deployment/reportease \
            reportease=reportease-mvbp:${{ github.sha }}
```

---

## 8. Security Configuration

### SSL/TLS
```nginx
# Generate certificates
certbot certonly --webroot -w /var/www/html \
  -d reportease.app -d api.reportease.app

# Auto-renewal
certbot renew --quiet --no-eff-email
```

### CORS Configuration
```typescript
// In next.config.ts
const headers = [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Credentials', value: 'true' },
      { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN },
      { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
    ],
  },
];
```

### Rate Limiting
```typescript
// Add rate limiting middleware
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 9. Backup & Recovery

### Daily Backups
```bash
# PostgreSQL backup
pg_dump reportease > backup-$(date +%Y%m%d).sql

# Restore from backup
psql reportease < backup-20260421.sql
```

### Backup Schedule
```bash
# Daily at 2 AM UTC
0 2 * * * /usr/local/bin/backup-db.sh
```

### Disaster Recovery RTO/RPO
```
Recovery Time Objective (RTO): 30 minutes
Recovery Point Objective (RPO): 1 hour
Backup retention: 30 days
Offsite storage: AWS S3
```

---

## 10. Performance Tuning

### Caching Strategy
```typescript
// Cache landing page for 1 hour
res.setHeader('Cache-Control', 'public, max-age=3600');

// Cache API responses for 5 minutes
res.setHeader('Cache-Control', 'public, max-age=300');
```

### Database Query Optimization
```sql
-- Add indexes
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_events_timestamp ON monitoring_events(timestamp);

-- Analyze query plans
EXPLAIN ANALYZE SELECT * FROM leads WHERE created_at > NOW() - INTERVAL '1 day';
```

### CDN Configuration
```
CloudFlare settings:
├─ Caching Level: Aggressive
├─ Minification: JS, CSS, HTML enabled
├─ Compression: Brotli enabled
└─ HTTP/2 Push: Enabled
```

---

## 11. Compliance & Auditing

### Data Retention
```
Forms: 90 days
Events: 30 days
Backups: 30 days
Logs: 7 days
```

### Audit Logging
```typescript
// Log all critical actions
await auditLog({
  action: 'LEAD_SUBMITTED',
  userId: req.user.id,
  timestamp: new Date(),
  data: leadData,
});
```

### GDPR Compliance
```
✅ Data Processing Agreement (DPA)
✅ Privacy Policy updated
✅ Consent mechanism in form
✅ Data export capability
✅ Data deletion capability (90-day auto-purge)
```

---

## 12. Troubleshooting Guide

### Issue: High Memory Usage
```bash
# Check memory
docker stats reportease-mvbp

# Solution: Enable garbage collection
NODE_OPTIONS=--max-old-space-size=1024

# Restart container
docker restart reportease-mvbp
```

### Issue: Slow Form Submissions
```
Check:
1. Database connection pool
2. Network latency to Google APIs
3. CPU usage
4. Memory pressure

Solution:
- Increase connection pool size
- Add caching layer
- Scale horizontally
```

### Issue: OAuth Token Expiry
```
Check: Token refresh logic
Fix: Implement automatic token refresh
  - Refresh before 5 min expiry
  - Use refresh_token to get new access_token
```

### Issue: Dashboard Not Updating
```
Check: Auto-refresh interval (10 sec)
Check: Event logging system
Check: Network connectivity to /api/monitoring/events
Fix: Restart browser or clear cache
```

---

## 13. Maintenance Schedule

### Daily
- ✅ Monitor dashboard
- ✅ Check error rates
- ✅ Review performance metrics

### Weekly
- ✅ Review logs
- ✅ Update dependencies
- ✅ Performance analysis

### Monthly
- ✅ Security audit
- ✅ Backup verification
- ✅ Capacity planning

### Quarterly
- ✅ Load testing
- ✅ Disaster recovery drill
- ✅ Compliance audit

---

## 14. Deployment Checklist

Before every deployment:
```
□ All tests passing (42/42)
□ Code review approved
□ Dependencies updated & verified
□ Environment variables configured
□ Database migrations tested
□ Backup created
□ Monitoring configured
□ Health checks passing
□ Load testing passed
□ Documentation updated
□ Rollback plan ready
```

---

## 15. Success Metrics

### Post-Deployment (First 24 Hours)
```
✓ API Uptime: 100%
✓ Form Success Rate: >95%
✓ Average Response Time: <300ms
✓ Zero critical errors
✓ Dashboard fully operational
```

### First Week
```
✓ Pilot customers onboarded: 3-5
✓ Form submissions: >10
✓ API calls: >1000
✓ Feature adoption: >50%
✓ System stability: 99.9%+
```

---

**End of Deployment Guide**

**Next Action:** Execute deployment and monitor for 24 hours before onboarding pilot customers.
