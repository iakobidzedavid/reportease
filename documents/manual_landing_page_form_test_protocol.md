# ReportEase Landing Page Form — Manual Testing Protocol
**Date:** April 21, 2026  
**Purpose:** Validate landing page form rendering, validation, and submission before full task re-execution  
**Status:** Pre-Deployment Test Plan  
**Severity:** Critical Gate — must pass before MVBP deployment  

---

## EXECUTIVE SUMMARY

This document provides a **manual testing protocol** to verify the landing page form fix works correctly before re-executing the full "Fix landing page lead capture form" agent task. This lightweight gate prevents cascading failures by confirming form functionality in an isolated browser environment.

**Key Testing Goals:**
1. ✅ Form renders without JavaScript errors
2. ✅ All form fields display correctly (name, email, company, phone, message)
3. ✅ Form validation works (error messages on invalid input)
4. ✅ Form submission succeeds and shows success state
5. ✅ Submitted data is captured and accessible
6. ✅ User experience is smooth and intuitive

**Test Duration:** ~15-20 minutes per test run  
**Browser Requirements:** Chrome, Firefox, Safari, or Edge (latest version)  
**Environment:** Deployed application at configured URL  

---

## SECTION 1: PRE-TEST SETUP & PREREQUISITES

### 1.1: Verify Application Deployment

Before beginning manual tests, confirm the landing page is deployed and accessible.

**Step 1: Identify Landing Page URL**

The form should be deployed at one of these URLs (confirm which applies to your deployment):

| Environment | URL | Notes |
|---|---|---|
| **Local Development** | `http://localhost:3000/landing` | If running `npm run dev` locally |
| **Vercel Preview** | `https://reportease-[branch].vercel.app/landing` | Preview deployment for feature branch |
| **Vercel Production** | `https://reportease.vercel.app/landing` | Main production deployment |
| **Custom Domain** | `https://reportease.com/landing` | If custom domain configured |
| **GitHub Pages** | `https://iakobidzedavid.github.io/reportease/` | If deployed to GitHub Pages |

**Action Required:**
- [ ] Identify your deployment URL from project documentation or deployment platform
- [ ] Record the URL: `_______________________________`
- [ ] Verify URL is accessible (ping it or visit in browser)

**Troubleshooting:**
- If URL returns 404: Application not deployed — deploy code first using `npm run build && npm start`
- If URL returns 500: Server error — check application logs and fix errors before proceeding
- If URL is unreachable: Network/DNS issue — verify deployment platform status and connectivity

---

### 1.2: Prepare Browser Environment

**Browser Requirements:**
- ✅ Latest version of Chrome, Firefox, Safari, or Edge
- ✅ JavaScript enabled (required for form interactivity)
- ✅ Cookies enabled (for session tracking)
- ✅ Browser developer tools accessible (for error checking)

**Action Required:**
- [ ] Open browser and navigate to identified landing page URL
- [ ] Press `F12` or `Cmd+Option+J` to open Developer Tools
- [ ] Go to **Console** tab
- [ ] Clear any previous messages: `console.clear()`
- [ ] Keep Developer Tools open during entire test

**Why Developer Tools Are Critical:**
- Form submission errors often appear in Console first
- JavaScript errors prevent form functionality
- Network requests show if API calls are being made
- You can monitor real-time form state

---

### 1.3: Prepare Test Data & Documentation

**Test Data to Use (for consistency):**

Use these consistent test values across all test runs so results are comparable:

| Field | Test Value | Notes |
|---|---|---|
| **Name** | Test User 1 | Consistent identifier for debugging |
| **Email** | test.user.1@reportease-qa.com | Dedicated QA email (won't interfere with real leads) |
| **Company** | Acme Marketing Group | Representative agency name |
| **Phone** | (555) 123-4567 | Valid US phone format |
| **Message** | Testing form submission via manual protocol | Identifies test submission |

**Documentation Sheet:**

Create a text file to record test results:

```
LANDING PAGE FORM TEST LOG
Date: _______________
Tester: _______________
Browser: _______________
URL: _______________

Test 1: Form Rendering
[  ] Form loads without errors
[  ] All fields visible
[  ] Labels readable
[  ] Submit button visible
Notes: _______________________

Test 2: Field Rendering
[  ] Name field renders
[  ] Email field renders
[  ] Company field renders
[  ] Phone field renders
[  ] Message field renders
Notes: _______________________

[Continue for all test cases below...]
```

---

## SECTION 2: FORM RENDERING & VALIDATION TEST

### TEST 2.1: Initial Form Rendering

**Objective:** Verify form displays correctly on page load without JavaScript errors

**Prerequisites:**
- [ ] Landing page URL loaded in browser
- [ ] Developer Tools Console is open
- [ ] No errors visible in Console tab

**Steps:**

1. **Visual Inspection:**
   - Look at the page and describe what you see
   - Form should be in a centered container on the page
   - All 5 fields should be visible:
     - [ ] Name field (text input)
     - [ ] Email field (email input)
     - [ ] Company field (text input)
     - [ ] Phone field (tel input)
     - [ ] Message field (textarea)
   - [ ] Submit button visible at bottom
   - [ ] Form labels clear and readable

2. **Check Console for Errors:**
   - Look at Console tab in Developer Tools
   - Scan for red error messages
   - Record any errors found:
     - [ ] No errors
     - [ ] Errors found: _______________

3. **Check Network Tab:**
   - Click on Network tab in Developer Tools
   - Refresh page (Ctrl+R or Cmd+R)
   - Look for any failed requests (red status codes: 400, 404, 500, etc.)
   - Record findings:
     - [ ] All resources loaded (200 status)
     - [ ] Failed requests: _______________

**Expected Result:**
- ✅ Form displays cleanly
- ✅ No JavaScript errors in Console
- ✅ All network requests return 200 OK
- ✅ All form fields are interactive (you can click in them)

**Pass/Fail Decision:**
- **PASS:** Form renders, no console errors, all fields visible and clickable
- **FAIL:** Form doesn't display, errors in console, network failures, or fields unresponsive

**If FAIL:** 
- Document error message from Console
- Check that `/landing` page exists in codebase
- Verify form component is imported in landing/page.tsx
- Escalate to dev_lead with console error screenshot

**Document Result:**
- [ ] PASS — Form rendered correctly
- [ ] FAIL — See error logs below

---

### TEST 2.2: Form Field Rendering

**Objective:** Verify each form field is properly configured and accepts input

**Prerequisites:**
- [ ] Test 2.1 PASSED (form renders)
- [ ] Form is visible on page

**Steps:**

For each field, perform these actions:

**Field 1: Name (Text Input)**
1. Click on Name field
2. Type: "Test User 1"
3. Verify text appears in field
4. Check field styling (no red border = no error)
5. Record: [ ] Renders correctly [ ] Error

**Field 2: Email (Email Input)**
1. Click on Email field
2. Type: "test.user.1@reportease-qa.com"
3. Verify text appears in field
4. Check if browser shows email validation icon
5. Record: [ ] Renders correctly [ ] Error

**Field 3: Company (Text Input)**
1. Click on Company field
2. Type: "Acme Marketing Group"
3. Verify text appears
4. Record: [ ] Renders correctly [ ] Error

**Field 4: Phone (Tel Input)**
1. Click on Phone field
2. Type: "(555) 123-4567"
3. Verify text appears
4. Note: Phone fields may have auto-formatting
5. Record: [ ] Renders correctly [ ] Error

**Field 5: Message (Textarea)**
1. Click on Message field
2. Type: "Testing form submission via manual protocol"
3. Verify text appears and wraps on multiple lines
4. Try typing more text to verify textarea expansion
5. Record: [ ] Renders correctly [ ] Error

**Expected Result:**
- ✅ All 5 fields accept text input
- ✅ Text appears as typed
- ✅ No styling errors (red borders, etc.)
- ✅ Fields respond to focus (cursor visible)

**Pass/Fail Decision:**
- **PASS:** All fields render and accept input
- **FAIL:** Any field doesn't accept input, shows errors, or displays incorrectly

**Document Result:**
- [ ] PASS — All fields render correctly
- [ ] FAIL — Field(s) with issues: _______________

---

## SECTION 3: FORM VALIDATION TEST

### TEST 3.1: Required Field Validation

**Objective:** Verify form rejects submissions with missing required fields and shows error messages

**Prerequisites:**
- [ ] Tests 2.1 and 2.2 PASSED
- [ ] Form is clean (no data entered yet)

**Steps:**

1. **Test Empty Submission:**
   - Leave all fields empty
   - Scroll down to view Submit button
   - Click Submit button
   - Expected: Form should show error messages, NOT submit

2. **Check Error Messages:**
   - Look for error text near fields or at top of form
   - Common error messages:
     - "Name is required"
     - "Email is required"
     - "Please fill in required fields"
     - etc.
   - Record errors seen: _____________________________

3. **Verify Form Didn't Submit:**
   - Check URL — should still be `/landing` (not changed)
   - Check Console Network tab — no POST request should be visible
   - Check browser history — no new page loaded
   - Record: [ ] Form rejected empty submission [ ] Form submitted (ERROR)

4. **Test Partial Submission (Name Only):**
   - Clear all fields
   - Enter only Name: "Test User 1"
   - Click Submit
   - Expected: Form shows error for missing email
   - Record errors: _____________________________

5. **Test Partial Submission (Email Only):**
   - Clear all fields
   - Enter only Email: "test.user.1@reportease-qa.com"
   - Click Submit
   - Expected: Form shows error for missing name
   - Record errors: _____________________________

**Expected Result:**
- ✅ Empty submission rejected with error messages
- ✅ Partial submission rejected with field-specific errors
- ✅ Error messages are clear and readable
- ✅ Form doesn't POST request when validation fails
- ✅ Form stays on `/landing` page after validation errors

**Pass/Fail Decision:**
- **PASS:** Form validation prevents empty submissions and shows helpful errors
- **FAIL:** Form submits empty data, no error messages shown, or errors are confusing

**If FAIL:**
- Check form component has validation logic
- Verify required fields have `required` attribute
- Check that form submit handler prevents default
- Escalate to dev_lead with screenshot of empty submission attempt

**Document Result:**
- [ ] PASS — Form validation works correctly
- [ ] FAIL — See validation errors below

---

### TEST 3.2: Email Format Validation

**Objective:** Verify form rejects invalid email addresses and accepts valid ones

**Prerequisites:**
- [ ] Tests 2.1, 2.2, and 3.1 PASSED
- [ ] Form is clean

**Steps:**

1. **Test Invalid Email Format:**
   - Enter Name: "Test User 1"
   - Enter Email: "not-an-email" (missing @domain)
   - Enter Company: "Acme Marketing"
   - Click Submit
   - Expected: Form shows error like "Please enter a valid email"
   - Record error: _____________________________

2. **Test Email Missing Domain:**
   - Enter Name: "Test User 1"
   - Enter Email: "test@" (incomplete)
   - Enter Company: "Acme Marketing"
   - Click Submit
   - Expected: Form shows email validation error
   - Record error: _____________________________

3. **Test Valid Email Format:**
   - Enter Name: "Test User 1"
   - Enter Email: "test.user.1@reportease-qa.com" (valid)
   - Enter Company: "Acme Marketing"
   - Click Submit
   - Expected: Form should accept valid email (no error for this field)
   - Record: [ ] Valid email accepted [ ] Valid email rejected (ERROR)

4. **Test Alternative Email Formats:**
   - Enter Name: "Test User 1"
   - Enter Email: "user+tag@example.com" (with plus addressing)
   - Enter Company: "Acme Marketing"
   - Click Submit
   - Expected: Should be accepted (valid email format)
   - Record: [ ] Plus addressing accepted [ ] Plus addressing rejected

**Expected Result:**
- ✅ Invalid emails rejected with error message
- ✅ Valid emails accepted
- ✅ Error messages specifically mention email format
- ✅ Form doesn't submit until valid email provided

**Pass/Fail Decision:**
- **PASS:** Email validation works correctly for multiple formats
- **FAIL:** Invalid emails accepted, valid emails rejected, or no error messages

**Document Result:**
- [ ] PASS — Email validation works correctly
- [ ] FAIL — See validation issues below

---

## SECTION 4: FORM SUBMISSION TEST

### TEST 4.1: Successful Form Submission

**Objective:** Verify form submits successfully with valid data and shows success state

**Prerequisites:**
- [ ] Tests 2.1, 2.2, 3.1, and 3.2 PASSED
- [ ] Form is clean
- [ ] Developer Tools Console and Network tabs are open

**Steps:**

1. **Fill Form with Valid Data:**
   - [ ] Name: "Test User 1"
   - [ ] Email: "test.user.1@reportease-qa.com"
   - [ ] Company: "Acme Marketing Group"
   - [ ] Phone: "(555) 123-4567"
   - [ ] Message: "Testing form submission via manual protocol"

2. **Submit Form:**
   - Scroll to view Submit button
   - Click Submit button
   - Record timestamp: _______________
   - Note any visual changes on page immediately after click

3. **Monitor Network Request:**
   - Look at Network tab in Developer Tools
   - Should see a POST request to `/api/leads` (or similar)
   - Check request details:
     - [ ] POST request created
     - [ ] URL: _______________
     - [ ] Status code: _______________
     - [ ] Response time: _______________

4. **Check Success State:**
   - Form should change after successful submission
   - Expected behavior:
     - [ ] Form fields become disabled (greyed out)
     - [ ] Submit button becomes disabled
     - [ ] Success message appears (e.g., "Thank you!", "Form submitted")
     - [ ] Form shows confirmation details
   - Record what you see: _____________________________

5. **Verify No Console Errors:**
   - Check Console tab for errors
   - Look for red error messages
   - Record: [ ] No errors [ ] Errors found: _______________

**Expected Result:**
- ✅ POST request sent to form submission API endpoint
- ✅ Request returns 201 or 200 status code
- ✅ Success message displayed to user
- ✅ Form shows disabled/submitted state
- ✅ No JavaScript errors in Console

**Pass/Fail Decision:**
- **PASS:** Form submits with valid data, API request succeeds, success message shown
- **FAIL:** Form doesn't submit, API request fails (4xx/5xx status), or no success feedback

**If FAIL:**
- Check API endpoint exists at `/api/leads/route.ts`
- Verify POST handler returns 201 or 200 status
- Check Console for specific error messages
- Review Network tab request/response payloads
- Escalate to dev_lead with Network tab screenshot

**Document Result:**
- [ ] PASS — Form submitted successfully
- [ ] FAIL — See submission errors below

---

### TEST 4.2: Data Capture Verification

**Objective:** Verify submitted form data is captured and accessible

**Prerequisites:**
- [ ] Test 4.1 PASSED (form submitted successfully)

**Steps:**

1. **Check Email Verification (If Email Service Integrated):**
   - Check inbox for email address used in form: `test.user.1@reportease-qa.com`
   - Expected: Confirmation email or notification email
   - Record: [ ] Email received [ ] Email not received [ ] Email service not configured

2. **Check Admin Notification (If Configured):**
   - If admin notification is configured, check admin email inbox
   - Expected: Email with lead details (Name: Test User 1, Email: test.user.1@reportease-qa.com, etc.)
   - Record: [ ] Admin notified [ ] No notification

3. **Check Database/Backend (If Access Available):**
   - If you have access to application database or logs:
     - Query leads table for email: `test.user.1@reportease-qa.com`
     - Expected: Record exists with all submitted fields
     - Record: [ ] Data in database [ ] Data not found [ ] No database access

4. **Check Server Logs (If Available):**
   - Check application server logs for form submission event
   - Expected: Log entry showing lead captured with timestamp
   - Record: [ ] Log entry found [ ] No logs available

**Expected Result:**
- ✅ Submitted data is captured (visible in at least one of: email, logs, database)
- ✅ Data matches what was submitted
- ✅ Timestamp recorded correctly

**Pass/Fail Decision:**
- **PASS:** Data capture verified through at least one channel (email, logs, or database)
- **FAIL:** No evidence of data capture, data is incomplete, or doesn't match submission

**If FAIL:**
- Verify database connection in application
- Check email service configuration
- Verify server logs are being written
- Escalate to dev_lead with details of missing data

**Document Result:**
- [ ] PASS — Form data captured and verified
- [ ] FAIL — See data capture issues below

---

## SECTION 5: USER EXPERIENCE & EDGE CASES

### TEST 5.1: Form Reset & Re-submission

**Objective:** Verify user can submit form again after initial submission

**Prerequisites:**
- [ ] Test 4.1 PASSED (initial submission successful)

**Steps:**

1. **Identify Reset/New Submission Option:**
   - Look for button or link like "Submit Another Form", "Clear Form", "New Submission"
   - Or check if page has refresh button
   - Record option found: _____________________________

2. **Clear or Reset Form:**
   - Click reset button or refresh page
   - Verify form returns to empty state
   - All fields should be cleared
   - Submit button should be enabled again
   - Record: [ ] Form reset successfully [ ] Form still shows previous data

3. **Submit New Data:**
   - Fill form with different test data:
     - [ ] Name: "Test User 2"
     - [ ] Email: "test.user.2@reportease-qa.com"
     - [ ] Company: "Marketing Innovations Inc"
     - [ ] Phone: "(555) 987-6543"
     - [ ] Message: "Testing second form submission"
   - Click Submit
   - Verify second submission succeeds

4. **Verify Second Submission:**
   - Check success message appears again
   - Check Network tab shows new POST request
   - Record: [ ] Second submission successful [ ] Second submission failed

**Expected Result:**
- ✅ Form can be reset or cleared
- ✅ Second submission succeeds independently
- ✅ Both submissions captured in backend
- ✅ No data from first submission carries over

**Pass/Fail Decision:**
- **PASS:** Form resets and second submission works
- **FAIL:** Form can't be reset, second submission fails, or data mixes

**Document Result:**
- [ ] PASS — Form resets and allows multiple submissions
- [ ] FAIL — See reset/resubmission issues below

---

### TEST 5.2: Browser Compatibility

**Objective:** Verify form works consistently across different browsers

**Prerequisites:**
- [ ] All previous tests PASSED in first browser
- [ ] Have access to at least 2 different browsers

**Steps:**

1. **Test in Chrome/Chromium:**
   - Open form in Chrome, Chromium, or Edge (Chromium-based)
   - Run Quick Smoke Test:
     - [ ] Form renders
     - [ ] Fields accept input
     - [ ] Validation works
     - [ ] Submission succeeds
   - Record issues: _____________________________

2. **Test in Firefox:**
   - Open form in Firefox
   - Run Quick Smoke Test:
     - [ ] Form renders
     - [ ] Fields accept input
     - [ ] Validation works
     - [ ] Submission succeeds
   - Record issues: _____________________________

3. **Test in Safari (if available on Mac):**
   - Open form in Safari
   - Run Quick Smoke Test:
     - [ ] Form renders
     - [ ] Fields accept input
     - [ ] Validation works
     - [ ] Submission succeeds
   - Record issues: _____________________________

**Expected Result:**
- ✅ Form works consistently across Chrome, Firefox, Safari
- ✅ No browser-specific errors
- ✅ Same user experience in all browsers

**Pass/Fail Decision:**
- **PASS:** Form works in all tested browsers
- **FAIL:** Form fails in one or more browsers

**If FAIL:**
- Document which browser fails and how
- Check browser console for errors
- Check if form uses incompatible JavaScript
- Escalate to dev_lead with browser-specific error

**Document Result:**
- [ ] PASS — Form works in multiple browsers
- [ ] FAIL — See browser compatibility issues below

---

## SECTION 6: FINAL VERIFICATION CHECKLIST

**Use this checklist to determine overall pass/fail:**

### Critical Requirements (ALL must PASS):
- [ ] ✅ Form renders without JavaScript errors (Test 2.1)
- [ ] ✅ All form fields render and accept input (Test 2.2)
- [ ] ✅ Form validation prevents empty submissions (Test 3.1)
- [ ] ✅ Email format validation works (Test 3.2)
- [ ] ✅ Form submits successfully with valid data (Test 4.1)
- [ ] ✅ Submitted data is captured (Test 4.2)

### Important Requirements (Most should PASS):
- [ ] ✅ Form can be reset and resubmitted (Test 5.1)
- [ ] ✅ Form works across multiple browsers (Test 5.2)

### Overall Result:

**All Critical Requirements Passed?**
- [ ] YES → **GATE PASSED** — Proceed to re-execute "Fix landing page lead capture form" task
- [ ] NO → **GATE FAILED** — Escalate to dev_lead with documented failures

---

## SECTION 7: FAILURE ESCALATION PROTOCOL

If any test fails, follow this escalation protocol:

### Step 1: Document the Failure

Create a failure report with:
1. **Which test failed:** (Test number and name)
2. **Steps to reproduce:** (Exact steps that caused failure)
3. **Expected behavior:** (What should happen)
4. **Actual behavior:** (What actually happened)
5. **Error messages:** (Any error text from Console or form)
6. **Screenshots:** (Visual evidence of failure)
7. **Browser/Environment:** (Browser type, version, URL tested)

**Example Failure Report:**

```
TEST FAILURE REPORT
Test: 4.1 Successful Form Submission
Date: April 21, 2026
Browser: Chrome 124.0.6367.60

FAILURE DESCRIPTION:
Form submission fails with 500 error when submitting valid data.

STEPS TO REPRODUCE:
1. Navigate to https://localhost:3000/landing
2. Fill form with valid data:
   - Name: Test User 1
   - Email: test.user.1@reportease-qa.com
   - Company: Acme Marketing
3. Click Submit button
4. Observe: POST request returns 500 status

EXPECTED BEHAVIOR:
Form should submit successfully with 201 or 200 status code

ACTUAL BEHAVIOR:
Network tab shows:
- POST /api/leads
- Status: 500
- Response: {"error": "Database connection failed"}

ERROR MESSAGE FROM CONSOLE:
TypeError: Cannot read property 'leads' of undefined at route.ts:45

SCREENSHOTS:
[Screenshot showing 500 error in Network tab]
[Screenshot showing error in Console]
```

### Step 2: Escalate to dev_lead

Contact the development lead with:
1. This failure report (copy text above)
2. Link to this test protocol document
3. Request for debugging assistance
4. Suggested priority: "CRITICAL - blocks MVBP deployment"

### Step 3: Wait for Fix

Do not re-execute the agent task until dev_lead confirms the issue is fixed.

---

## SECTION 8: FINAL SIGN-OFF

After completing all tests, complete this sign-off:

```
LANDING PAGE FORM TEST — FINAL SIGN-OFF
Date: _______________
Tester Name: _______________
Tester Email: _______________
Browser(s) Tested: _______________
URL Tested: _______________

GATE STATUS:
[ ] PASSED — All critical tests passed. Safe to re-execute agent task.
[ ] FAILED — One or more critical tests failed. Escalated to dev_lead.

Test Results Summary:
- Test 2.1 (Form Rendering): [ ] PASS [ ] FAIL
- Test 2.2 (Field Rendering): [ ] PASS [ ] FAIL
- Test 3.1 (Required Field Validation): [ ] PASS [ ] FAIL
- Test 3.2 (Email Validation): [ ] PASS [ ] FAIL
- Test 4.1 (Successful Submission): [ ] PASS [ ] FAIL
- Test 4.2 (Data Capture): [ ] PASS [ ] FAIL
- Test 5.1 (Reset & Resubmission): [ ] PASS [ ] FAIL
- Test 5.2 (Browser Compatibility): [ ] PASS [ ] FAIL

Critical Failures (if any):
1. _____________________________
2. _____________________________
3. _____________________________

Recommendations:
_________________________________________

Tester Signature: _______________
```

---

## APPENDIX A: TROUBLESHOOTING COMMON ISSUES

### Issue: Form Not Found (404 Error)

**Symptom:** URL returns "Page not found" or 404 error

**Possible Causes:**
1. Landing page not created at `/src/app/landing/page.tsx`
2. Wrong URL path (e.g., `/home` instead of `/landing`)
3. Application not deployed or rebuilt

**Solutions:**
1. Verify file exists: `ls src/app/landing/page.tsx`
2. Try different URLs: `/form`, `/signup`, `/contact`
3. Rebuild app: `npm run build && npm start`
4. Check deployment status on Vercel dashboard

---

### Issue: Form Fields Don't Accept Input

**Symptom:** Can't type in form fields, they're read-only or disabled

**Possible Causes:**
1. JavaScript error preventing event handling
2. Form component has `disabled` attribute
3. CSS hiding input fields

**Solutions:**
1. Check Console for JavaScript errors
2. Right-click field → Inspect → Check for `disabled` attribute
3. Verify form fields are visible in Chrome DevTools Elements inspector
4. Check if form has loading state preventing input

---

### Issue: Validation Not Working

**Symptom:** Can submit empty form without error messages

**Possible Causes:**
1. Validation logic not implemented
2. Form submit handler not preventing default
3. Validation happens server-side only

**Solutions:**
1. Check form component imports validation library
2. Search for `onSubmit` handler in form code
3. Check for `e.preventDefault()` in submit handler
4. Review server-side validation in `/api/leads/route.ts`

---

### Issue: Form Submits But Nothing Happens

**Symptom:** Click submit, form seems to submit, but no feedback

**Possible Causes:**
1. Network request fails silently
2. Success message not implemented
3. API endpoint returns error without showing it

**Solutions:**
1. Check Network tab for POST request and status code
2. Check Console for JavaScript errors
3. Look for success message element in HTML (inspect page)
4. Check if success message appears below the fold

---

### Issue: Form Data Not Captured

**Symptom:** Form submits successfully but data isn't in database or email

**Possible Causes:**
1. API endpoint doesn't save data
2. Database connection not configured
3. Email service not set up

**Solutions:**
1. Check `/api/leads/route.ts` has database save logic
2. Check `.env.local` has DATABASE_URL
3. Verify email service API key in environment
4. Check server logs for save errors

---

## APPENDIX B: TEST DATA & REFERENCE

### Valid Test Values

| Field | Valid Examples | Invalid Examples |
|---|---|---|
| **Name** | Test User 1, Jane Doe, John Smith | "", "123", "@name" |
| **Email** | test@example.com, user+tag@domain.co.uk | test@, @example.com, test, test@@example.com |
| **Company** | Acme Corp, Tech Startup LLC, Digital Agency | "", "123", very long text... |
| **Phone** | (555) 123-4567, 555-123-4567, 5551234567 | invalid, 123, "abc" |
| **Message** | Testing form, Customer feedback, Demo request | Can be empty (optional) |

### Expected HTTP Status Codes

| Scenario | Expected Status | Meaning |
|---|---|---|
| **Successful submission** | 201 or 200 | Created or OK |
| **Validation error** | 400 | Bad Request — invalid data |
| **Server error** | 500 | Internal Server Error |
| **Not found** | 404 | Endpoint doesn't exist |
| **Unauthorized** | 401 | Authentication required |

---

## APPENDIX C: ACCESSIBILITY & UX NOTES

When testing, also note:
- [ ] Form labels are associated with inputs (click label, cursor goes to field)
- [ ] Tab key navigation works (can tab through fields in order)
- [ ] Error messages are clear and next to the offending field
- [ ] Success message is prominent and easy to see
- [ ] Form is readable on mobile devices (if responsive)
- [ ] Color contrast is sufficient (text readable against background)
- [ ] Font size is large enough (no tiny text)

---

## END OF TEST PROTOCOL

**Next Step:** Once this protocol is completed with all critical tests passing, proceed to re-execute the "Fix landing page lead capture form" agent task with confidence that the form is working correctly.

**Questions?** Reference this document and the root cause analysis document (2026-04-21_infrastructure_root_cause_analysis.md) for additional context.

---

**Document Version:** 1.0  
**Last Updated:** April 21, 2026  
**Status:** Ready for manual testing execution  
