# ReportEase Infrastructure Remediation Guide
**Date:** April 21, 2026  
**Purpose:** Step-by-step fixes for internal_server_error failures  
**Target:** Complete infrastructure setup before task re-execution

---

## Overview

This guide provides specific, executable steps to resolve infrastructure issues preventing:
- Landing page form submission
- MVBP code deployment
- Form validation and lead capture

Follow this guide in order. Each section includes verification steps to confirm the fix worked.

---

## SECTION 1: Environment Variables & Credentials

### Step 1.1: Verify Current Environment

**Command:**
```bash
# Check if .env.local exists
ls -la | grep env
# Should NOT list .env.local (needs to be created)
```

**Expected Output:**
```
.env.example (if you created it)
```

**If you see `.env.local`:** Skip to Step 1.2

---

### Step 1.2: Create Environment Variables File

**File:** `.env.local` (in repository root, NOT committed)

**Content:**
```bash
# GitHub Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=iakobidzedavid/reportease
GITHUB_BRANCH=main

# Vercel Configuration
VERCEL_TOKEN=vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_PROJECT_ID=your-project-id

# v0 Code Generation
V0_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ReportEase

# Form & Lead Capture
FORM_API_ENDPOINT=/api/leads
NOTIFICATION_EMAIL=admin@reportease.com

# Database (add when implemented)
# DATABASE_URL=postgresql://user:password@localhost/reportease
```

**Instructions:**
1. Copy the template above
2. Replace all `xxxx` placeholders with actual values:
   - **GITHUB_TOKEN:** Generate at https://github.com/settings/tokens
     - Scopes needed: `repo`, `workflow`, `read:user`
     - Click "Generate new token (classic)"
   - **VERCEL_TOKEN:** Get from https://vercel.com/account/tokens
   - **V0_API_KEY:** Get from Vercel dashboard > Settings > API
3. Save as `.env.local` in repository root
4. **DO NOT COMMIT THIS FILE** — add to `.gitignore`

**Verification:**
```bash
# Verify file exists
cat .env.local | head -5
# Should show GitHub configuration lines

# Verify it's in .gitignore
grep ".env.local" .gitignore
# Should output: .env.local
```

---

### Step 1.3: Create Environment Documentation File

**File:** `.env.example` (commit this to repo)

**Content:**
```bash
# ENVIRONMENT VARIABLES TEMPLATE
# Copy this to .env.local and fill in actual values
# DO NOT COMMIT .env.local — it contains secrets

# GitHub Configuration
GITHUB_TOKEN=required_for_git_operations
GITHUB_REPO=iakobidzedavid/reportease
GITHUB_BRANCH=main

# Vercel Configuration
VERCEL_TOKEN=required_for_deployment
VERCEL_PROJECT_ID=required_for_preview_urls

# v0 Code Generation Service
V0_API_KEY=required_for_code_generation

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ReportEase

# Form & Lead Capture
FORM_API_ENDPOINT=/api/leads
NOTIFICATION_EMAIL=admin@reportease.com

# Database (add when implemented)
# DATABASE_URL=postgresql://user:password@localhost/reportease
```

**Instructions:**
1. Create `.env.example` in repository root
2. Copy content above (with placeholder values, not secrets)
3. Commit to repository: `git add .env.example && git commit -m "Add environment template"`

**Verification:**
```bash
# File should exist
ls -la .env.example

# Should NOT contain actual secrets
grep "ghp_" .env.example
# Should return nothing
```

---

### Step 1.4: Verify .gitignore Includes Secrets

**File:** `.gitignore`

**Add These Lines:**
```
# Environment variables with secrets
.env.local
.env.*.local
.env.production.local

# Dependencies
node_modules/
.next/
out/
build/
dist/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

**Instructions:**
1. Check if `.gitignore` exists: `cat .gitignore`
2. If it doesn't exist, create it with content above
3. If it exists, add the environment variable lines
4. Commit: `git add .gitignore && git commit -m "Add comprehensive .gitignore"`

**Verification:**
```bash
# Verify .env.local is ignored
git check-ignore .env.local
# Should output: .env.local

# Verify it won't be committed
git status | grep ".env"
# Should show .env.local as untracked/ignored
```

---

### Step 1.5: Test API Connectivity

**Test GitHub API:**
```bash
# Install curl if needed
# Test GitHub token validity
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Expected: Returns your GitHub user info
# If error: Token is invalid or expired — regenerate at github.com/settings/tokens
```

**Test Vercel API:**
```bash
# Test Vercel token validity
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  https://api.vercel.com/v6/user

# Expected: Returns your Vercel account info
# If error: Token is invalid — regenerate at vercel.com/account/tokens
```

**Test v0 API:**
```bash
# Test v0 service connectivity
curl -X POST https://api.v0.ai/generate \
  -H "Authorization: Bearer $V0_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Expected: Valid response (may indicate "test" not supported, but proves API works)
# If error: API key invalid or service down
```

**If Any Test Fails:**
- Regenerate the corresponding token
- Update `.env.local` with new value
- Re-run test to confirm

---

## SECTION 2: Form Submission Infrastructure

### Step 2.1: Create API Route Directory

**Create Directory Structure:**
```bash
# Create the api directory
mkdir -p src/app/api/leads

# Verify structure
ls -la src/app/api/
```

**Expected Output:**
```
drwxr-xr-x  api/
  drwxr-xr-x  leads/
```

---

### Step 2.2: Implement Form Submission API Route

**File:** `src/app/api/leads/route.ts`

**Content:**
```typescript
import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LeadData = await request.json();

    // Validate required fields
    if (!body.email || !body.name) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Log the lead (temporary — will be replaced with database)
    console.log('New lead captured:', {
      timestamp: new Date().toISOString(),
      name: body.name,
      email: body.email,
      company: body.company,
      phone: body.phone,
    });

    // TODO: Implement database storage
    // const lead = await db.leads.create({
    //   name: body.name,
    //   email: body.email,
    //   company: body.company,
    //   phone: body.phone,
    //   message: body.message,
    //   createdAt: new Date(),
    // });

    // TODO: Send notification email
    // await sendEmail({
    //   to: process.env.NOTIFICATION_EMAIL,
    //   subject: `New lead: ${body.name}`,
    //   body: `Email: ${body.email}`,
    // });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Lead captured successfully',
        // id: lead.id (when database is implemented)
      },
      { status: 201 }
    );
  } catch (error) {
    // Log error for debugging
    console.error('Form submission error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return error response with proper HTTP status
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process form submission',
        // Include error ID for debugging (don't expose details in production)
        errorId: Math.random().toString(36).substr(2, 9),
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
```

**Instructions:**
1. Create the file `src/app/api/leads/route.ts`
2. Copy the content above
3. Save and verify TypeScript compilation

**Verification:**
```bash
# Check file exists
ls -la src/app/api/leads/route.ts

# Verify TypeScript compiles (no errors)
npx tsc --noEmit src/app/api/leads/route.ts
# Should complete without errors
```

---

### Step 2.3: Create Landing Page Component

**File:** `src/app/landing/page.tsx`

**Content:**
```typescript
'use client';

import { useState } from 'react';
import styles from './landing.module.css';

interface FormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}

export default function LandingPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim()) {
        setError('Name and email are required');
        setLoading(false);
        return;
      }

      // Submit to API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check response status
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Form submission failed');
      }

      // Success
      const data = await response.json();
      console.log('Form submitted successfully:', data);
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', phone: '' });

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('Form submission error:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1>ReportEase</h1>
        <p className={styles.tagline}>Your Time-Saving Reporting Assistant</p>
        <p className={styles.description}>
          Automated marketing reporting that cuts reporting time from 8+ hours/week to under 2 hours.
        </p>
      </section>

      <section className={styles.valueProps}>
        <h2>Why Choose ReportEase?</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>⏱️ Save 6+ Hours/Week</h3>
            <p>Eliminate manual reporting and reclaim valuable team time</p>
          </div>
          <div className={styles.card}>
            <h3>✓ Accuracy Guaranteed</h3>
            <p>Eliminate data-entry errors with automated data pulling</p>
          </div>
          <div className={styles.card}>
            <h3>📊 Interactive Dashboards</h3>
            <p>Beautiful, real-time visualizations for stakeholders</p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Get Early Access</h2>
        {submitted ? (
          <div className={styles.successMessage}>
            <h3>✓ Thank you!</h3>
            <p>We'll be in touch soon with your early access invite.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="company">Company Name</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                placeholder="Your company"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="(555) 123-4567"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Submitting...' : 'Get Early Access'}
            </button>

            <p className={styles.privacy}>
              We respect your privacy. We'll only use your email to send you early
              access information.
            </p>
          </form>
        )}
      </section>
    </main>
  );
}
```

**Instructions:**
1. Create the file `src/app/landing/page.tsx`
2. Copy the content above
3. Create accompanying CSS module (see next step)

---

### Step 2.4: Create Landing Page Styles

**File:** `src/app/landing/landing.module.css`

**Content:**
```css
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
  color: #333;
}

.hero {
  text-align: center;
  color: white;
  margin-bottom: 4rem;
  padding-top: 2rem;
}

.hero h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.tagline {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  opacity: 0.95;
}

.description {
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
}

.valueProps {
  max-width: 1000px;
  margin: 0 auto 4rem;
  color: white;
}

.valueProps h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.card p {
  opacity: 0.9;
  font-size: 0.95rem;
}

.cta {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.cta h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
}

.formGroup label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.formGroup input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.formGroup input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submitButton {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.submitButton:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submitButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.errorMessage {
  padding: 1rem;
  background-color: #fee;
  color: #c33;
  border-radius: 6px;
  border-left: 4px solid #c33;
  margin-bottom: 1rem;
}

.successMessage {
  text-align: center;
  padding: 2rem 1rem;
}

.successMessage h3 {
  color: #4caf50;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.successMessage p {
  color: #666;
}

.privacy {
  font-size: 0.85rem;
  color: #999;
  text-align: center;
  margin-top: 1rem;
}
```

**Instructions:**
1. Create the file `src/app/landing/landing.module.css`
2. Copy the content above
3. Save and verify styling loads

**Verification:**
```bash
# Check both files exist
ls -la src/app/landing/
# Should show page.tsx and landing.module.css
```

---

### Step 2.5: Test Form Locally

**Start Development Server:**
```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Server should start on http://localhost:3000
```

**Test Landing Page:**
1. Open browser: http://localhost:3000/landing
2. Verify page renders with purple gradient
3. Verify form fields appear: Name, Email, Company, Phone
4. Verify submit button renders

**Test Form Submission:**
1. Fill in form:
   - Name: "Test User"
   - Email: "test@example.com"
2. Click "Get Early Access"
3. Check browser console (F12 → Console tab)
4. Should see console message: "Form submitted successfully"
5. Should see success message: "✓ Thank you!"

**If Form Submission Fails:**
1. Check console for error message
2. Check server logs in terminal running `npm run dev`
3. Verify `/api/leads` endpoint exists: `curl http://localhost:3000/api/leads`
   - Should return: `{"error":"Method not allowed"}` (405 status)
4. Test POST to endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/leads \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com"}'
   ```
   - Should return: `{"success":true,"message":"Lead captured successfully"}`

---

## SECTION 3: Deployment Pipeline

### Step 3.1: Create GitHub Actions CI Workflow

**File:** `.github/workflows/ci.yml`

**Create Directory First:**
```bash
mkdir -p .github/workflows
```

**Content:**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Build application
        run: npm run build
        env:
          # These values are available in GitHub Actions context
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload build artifacts
        if: success()
        uses: actions/upload-artifact@v3
        with:
          name: build-${{ matrix.node-version }}
          path: .next/
          retention-days: 5
```

**Instructions:**
1. Create `.github/workflows/ci.yml`
2. Copy content above
3. Commit: `git add .github/workflows/ci.yml && git commit -m "Add CI workflow"`

**Verification:**
```bash
# Check file exists
ls -la .github/workflows/ci.yml

# Verify YAML syntax
cat .github/workflows/ci.yml | grep -E "^(name:|on:|jobs:)" 
# Should output the three main sections
```

---

### Step 3.2: Create GitHub Actions Deploy Workflow

**File:** `.github/workflows/deploy.yml`

**Content:**
```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          CI: true
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Run linter
        run: npm run lint
      
      - name: Deploy to Vercel
        uses: vercel/action@v5
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: .
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Comment PR with deployment URL
        if: github.event_name == 'push'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Deployment successful!\nPreview: https://reportease-main.vercel.app'
            })
```

**Instructions:**
1. Create `.github/workflows/deploy.yml`
2. Copy content above
3. Commit: `git add .github/workflows/deploy.yml && git commit -m "Add deploy workflow"`

**Note:** This requires GitHub secrets to be configured (see Step 3.4)

---

### Step 3.3: Configure GitHub Branch Protection

**Via GitHub Web UI:**
1. Go to https://github.com/iakobidzedavid/reportease/settings/branches
2. Under "Branch protection rules", click "Add rule"
3. Configure:
   - **Branch name pattern:** `main`
   - **Require status checks to pass before merging:** ✓
   - **Require branches to be up to date:** ✓
   - **Dismiss stale pull request approvals:** ✓
   - **Require code reviews:** 1 approval minimum
   - **Require conversation resolution before merging:** ✓

**Verification:**
- After setup, you should see "Branch is protected" on main branch
- PRs will require CI checks to pass before merge

---

### Step 3.4: Configure GitHub Secrets

**Required Secrets:**
1. `VERCEL_TOKEN` — Vercel deployment token
2. `VERCEL_ORG_ID` — Vercel organization ID
3. `VERCEL_PROJECT_ID` — Vercel project ID

**How to Set:**
1. Go to https://github.com/iakobidzedavid/reportease/settings/secrets/actions
2. Click "New repository secret"
3. Add each secret:

**VERCEL_TOKEN:**
- Get from: https://vercel.com/account/tokens
- Name: `VERCEL_TOKEN`
- Value: (paste token)

**VERCEL_ORG_ID:**
- Get from: Vercel Dashboard → Settings → General
- Name: `VERCEL_ORG_ID`
- Value: (your organization ID)

**VERCEL_PROJECT_ID:**
- Get from: Vercel Dashboard → Project → Settings → General
- Name: `VERCEL_PROJECT_ID`
- Value: (your project ID)

**Verification:**
```bash
# After setting secrets, trigger a workflow
git push
# Check GitHub Actions tab to see workflow running
```

---

### Step 3.5: Test CI Pipeline Locally

**With Act (GitHub Actions Simulator):**
```bash
# Install act (on macOS)
brew install act

# Run CI workflow locally
act push -b
# Should build and test without errors

# Run specific workflow
act -j build-and-test
```

**Manual Testing:**
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Run lint
npm run lint
# Should complete without errors

# Run build
npm run build
# Should output: "Compiled successfully"

# Check build output exists
ls -la .next/
# Should show build artifacts
```

---

## SECTION 4: Comprehensive Verification

### Verification Checklist — Complete Each Step

**✓ Environment Configuration**
- [ ] `.env.local` created with all required tokens
- [ ] `.env.example` created and committed to repo
- [ ] `.gitignore` includes `.env.local`
- [ ] All API tokens tested and verified (GitHub, Vercel, v0)

**✓ Form Submission Infrastructure**
- [ ] `src/app/api/leads/route.ts` created and tested
- [ ] `src/app/landing/page.tsx` created
- [ ] `src/app/landing/landing.module.css` created
- [ ] Landing page renders at http://localhost:3000/landing
- [ ] Form submission works and logs success message
- [ ] Form validation rejects invalid emails
- [ ] Form validation requires name and email

**✓ Deployment Pipeline**
- [ ] `.github/workflows/ci.yml` created
- [ ] `.github/workflows/deploy.yml` created
- [ ] GitHub secrets configured (VERCEL_TOKEN, etc.)
- [ ] Branch protection rules enabled on main
- [ ] CI workflow runs on push/PR
- [ ] Deploy workflow runs on main branch push

**✓ Local Testing**
- [ ] `npm install` completes without errors
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts without errors
- [ ] Landing page loads at http://localhost:3000/landing
- [ ] Form renders with all fields
- [ ] Form submission succeeds with test data
- [ ] Form displays success message

**✓ Git Repository**
- [ ] All new files committed to main branch
- [ ] No uncommitted changes: `git status` is clean
- [ ] Remote tracking configured: `git remote -v` shows origin
- [ ] Commits pushed to GitHub: `git log --oneline | head -5`

---

## Final Verification Script

**Run this script to verify everything is configured:**

**File:** `scripts/verify-infrastructure.sh`

```bash
#!/bin/bash

echo "🔍 ReportEase Infrastructure Verification"
echo "=========================================="

errors=0

# Check 1: Environment
echo "✓ Checking environment configuration..."
if [ ! -f ".env.local" ]; then
  echo "  ❌ .env.local not found"
  errors=$((errors+1))
else
  echo "  ✓ .env.local exists"
fi

if [ ! -f ".env.example" ]; then
  echo "  ❌ .env.example not found"
  errors=$((errors+1))
else
  echo "  ✓ .env.example exists"
fi

# Check 2: Application Structure
echo "✓ Checking application structure..."
if [ ! -f "src/app/landing/page.tsx" ]; then
  echo "  ❌ Landing page not found"
  errors=$((errors+1))
else
  echo "  ✓ Landing page exists"
fi

if [ ! -f "src/app/api/leads/route.ts" ]; then
  echo "  ❌ Form API route not found"
  errors=$((errors+1))
else
  echo "  ✓ Form API route exists"
fi

# Check 3: Workflows
echo "✓ Checking GitHub Actions workflows..."
if [ ! -f ".github/workflows/ci.yml" ]; then
  echo "  ❌ CI workflow not found"
  errors=$((errors+1))
else
  echo "  ✓ CI workflow exists"
fi

if [ ! -f ".github/workflows/deploy.yml" ]; then
  echo "  ❌ Deploy workflow not found"
  errors=$((errors+1))
else
  echo "  ✓ Deploy workflow exists"
fi

# Check 4: Dependencies
echo "✓ Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "  ⚠️  node_modules not found, running npm install..."
  npm install
fi

# Check 5: Build
echo "✓ Building application..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "  ✓ Build successful"
else
  echo "  ❌ Build failed"
  errors=$((errors+1))
fi

# Summary
echo ""
echo "=========================================="
if [ $errors -eq 0 ]; then
  echo "✓ All checks passed! Infrastructure is ready."
  exit 0
else
  echo "❌ $errors check(s) failed. Review errors above."
  exit 1
fi
```

**Run it:**
```bash
chmod +x scripts/verify-infrastructure.sh
./scripts/verify-infrastructure.sh
```

---

## Troubleshooting

### Problem: "Cannot find module" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run build
```

---

### Problem: Form submission returns 500 error

**Solution:**
1. Check server logs: `npm run dev` shows errors in terminal
2. Verify route handler exists: `ls src/app/api/leads/route.ts`
3. Test API directly:
   ```bash
   curl -X POST http://localhost:3000/api/leads \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com"}'
   ```
4. Check browser DevTools Console (F12) for error details

---

### Problem: GitHub Actions workflow fails

**Solution:**
1. Check workflow logs: https://github.com/iakobidzedavid/reportease/actions
2. Common issues:
   - Missing secrets: Add to Settings → Secrets
   - TypeScript errors: Run `npm run lint` locally
   - Build errors: Run `npm run build` locally
3. Re-run workflow: Click "Re-run jobs" in Actions tab

---

### Problem: Vercel deployment fails

**Solution:**
1. Verify Vercel token: `echo $VERCEL_TOKEN` (should not be empty)
2. Check Vercel logs: https://vercel.com/dashboard
3. Verify project connection:
   ```bash
   vercel link --yes
   vercel env ls
   ```

---

## Next Steps After Remediation

Once all verification steps pass:

1. **Re-execute Failed Tasks**
   - Run "Fix landing page lead capture form" task again
   - Run "Verify MVBP end-to-end functionality" task again
   - Both should now succeed with proper infrastructure

2. **Implement Additional Features**
   - Add database integration for lead storage
   - Implement email notifications
   - Add analytics tracking
   - Create admin dashboard for lead review

3. **Production Hardening**
   - Set up monitoring and alerting
   - Implement rate limiting
   - Add security headers
   - Enable HTTPS/SSL

4. **Documentation**
   - Update README with environment setup
   - Create deployment guide
   - Document API endpoints
   - Create contributor guidelines

