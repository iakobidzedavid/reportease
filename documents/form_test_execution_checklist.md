# ReportEase Landing Page Form Test — Quick Execution Checklist
**Date:** April 21, 2026  
**Purpose:** Quick reference checklist for manual form testing  
**Format:** One-page printable checklist  

---

## QUICK START

1. Open browser and navigate to: `http://localhost:3000/landing` (or your deployed URL)
2. Open Developer Tools (F12 or Cmd+Option+J)
3. Go to Console tab
4. Work through checklist below
5. Record PASS/FAIL for each section

---

## SECTION 1: INITIAL RENDERING
**Time: 2-3 minutes**

| # | Test | Action | Expected | Result |
|---|---|---|---|---|
| 1.1 | Page loads | Navigate to landing page | Form visible, no errors | ☐ PASS ☐ FAIL |
| 1.2 | Console clean | Check Console tab | No red error messages | ☐ PASS ☐ FAIL |
| 1.3 | Network OK | Check Network tab | All requests = 200 status | ☐ PASS ☐ FAIL |
| 1.4 | Fields visible | Visual inspection | 5 fields: Name, Email, Company, Phone, Message | ☐ PASS ☐ FAIL |
| 1.5 | Submit button | Look for button | Button visible at bottom | ☐ PASS ☐ FAIL |

**Gate 1 Status:** ☐ All Pass (Continue) ☐ Any Fail (STOP - Document & Escalate)

---

## SECTION 2: FIELD INTERACTION
**Time: 3-4 minutes**

| # | Test | Action | Expected | Result |
|---|---|---|---|---|
| 2.1 | Name field | Type "Test User 1" | Text appears | ☐ PASS ☐ FAIL |
| 2.2 | Email field | Type "test@example.com" | Text appears | ☐ PASS ☐ FAIL |
| 2.3 | Company field | Type "Acme Corp" | Text appears | ☐ PASS ☐ FAIL |
| 2.4 | Phone field | Type "(555) 123-4567" | Text appears | ☐ PASS ☐ FAIL |
| 2.5 | Message field | Type "Test message" | Text appears | ☐ PASS ☐ FAIL |
| 2.6 | Tab navigation | Tab through fields | Moves to next field | ☐ PASS ☐ FAIL |

**Gate 2 Status:** ☐ All Pass (Continue) ☐ Any Fail (STOP - Document & Escalate)

---

## SECTION 3: VALIDATION (REQUIRED FIELDS)
**Time: 4-5 minutes**

| # | Test | Action | Expected | Result |
|---|---|---|---|---|
| 3.1 | Empty submit | Leave all empty, click Submit | Form rejected, error shown | ☐ PASS ☐ FAIL |
| 3.2 | Name only | Fill Name only, click Submit | Form rejected, email error | ☐ PASS ☐ FAIL |
| 3.3 | Email only | Fill Email only, click Submit | Form rejected, name error | ☐ PASS ☐ FAIL |
| 3.4 | Invalid email | Enter "invalid", click Submit | Form rejected, email format error | ☐ PASS ☐ FAIL |
| 3.5 | Valid email | Enter valid email, don't submit | No error message | ☐ PASS ☐ FAIL |

**Gate 3 Status:** ☐ All Pass (Continue) ☐ Any Fail (STOP - Document & Escalate)

---

## SECTION 4: SUCCESSFUL SUBMISSION
**Time: 3-4 minutes**

**Fill form with test data:**
- Name: `Test User 1`
- Email: `test.user.1@reportease-qa.com`
- Company: `Acme Marketing Group`
- Phone: `(555) 123-4567`
- Message: `Testing form submission via manual protocol`

| # | Test | Action | Expected | Result |
|---|---|---|---|---|
| 4.1 | Submit valid form | Click Submit | POST request sent to `/api/leads` | ☐ PASS ☐ FAIL |
| 4.2 | HTTP status | Check Network tab | Status = 201 or 200 | ☐ PASS ☐ FAIL |
| 4.3 | Success message | Look at form | "Thank you" or success message appears | ☐ PASS ☐ FAIL |
| 4.4 | Form disabled | After submission | Form fields grayed out/disabled | ☐ PASS ☐ FAIL |
| 4.5 | No console errors | Check Console | No new red errors | ☐ PASS ☐ FAIL |

**Gate 4 Status:** ☐ All Pass (Continue) ☐ Any Fail (STOP - Document & Escalate)

---

## SECTION 5: DATA CAPTURE (OPTIONAL - If Backend Access)
**Time: 2-3 minutes**

| # | Test | Action | Expected | Result |
|---|---|---|---|---|
| 5.1 | Email received | Check inbox for test email | Confirmation email arrives | ☐ PASS ☐ N/A ☐ FAIL |
| 5.2 | Admin notified | Check admin email | Lead notification sent | ☐ PASS ☐ N/A ☐ FAIL |
| 5.3 | Database entry | Query db for test email | Lead record exists | ☐ PASS ☐ N/A ☐ FAIL |
| 5.4 | Server logs | Check app logs | Submission logged | ☐ PASS ☐ N/A ☐ FAIL |

**Note:** This section requires backend access. Mark N/A if not available.

**Gate 5 Status:** ☐ All Pass or N/A (Continue) ☐ Any Fail (STOP - Document & Escalate)

---

## SECTION 6: MULTIPLE SUBMISSIONS
**Time: 2-3 minutes**

| # | Test | Action | Expected | Result |
|---|---|---|---|---|
| 6.1 | Reset form | Click "New Form" or refresh | Fields clear, form resets | ☐ PASS ☐ FAIL |
| 6.2 | Second submit | Fill with new data, submit | Second submission succeeds | ☐ PASS ☐ FAIL |
| 6.3 | Success msg 2 | Check second success | Success message appears again | ☐ PASS ☐ FAIL |

**Gate 6 Status:** ☐ All Pass (Continue) ☐ Any Fail (STOP - Document & Escalate)

---

## SECTION 7: BROWSER COMPATIBILITY
**Time: 5-10 minutes (if testing multiple browsers)**

Test form in each available browser:

| Browser | Renders? | Validates? | Submits? | Works? |
|---|---|---|---|---|
| **Chrome** | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ PASS ☐ FAIL |
| **Firefox** | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ PASS ☐ FAIL |
| **Safari** | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ PASS ☐ FAIL |
| **Edge** | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ Yes ☐ No | ☐ PASS ☐ FAIL |

**Gate 7 Status:** ☐ All Tested Browsers Pass (Continue) ☐ Any Fails (STOP - Document & Escalate)

---

## FINAL GATE: CRITICAL REQUIREMENTS MET?

**All of these must be PASS:**
- [ ] ✅ Section 1 (Rendering): PASS
- [ ] ✅ Section 2 (Fields): PASS
- [ ] ✅ Section 3 (Validation): PASS
- [ ] ✅ Section 4 (Submission): PASS

**Optional (Should be PASS if available):**
- [ ] ✅ Section 5 (Data Capture): PASS or N/A
- [ ] ✅ Section 6 (Multiple Submissions): PASS
- [ ] ✅ Section 7 (Browser Compat): PASS

---

## FINAL DECISION

**CRITICAL REQUIREMENTS STATUS:**

☐ **ALL PASS** → **✅ GATE PASSED** 
- Safe to re-execute "Fix landing page lead capture form" task
- Form is working correctly

☐ **ANY FAIL** → **❌ GATE FAILED**
- Do NOT re-execute task yet
- Escalate to dev_lead with failure details below
- Wait for fixes before retesting

---

## FAILURE SUMMARY (If Any Section Failed)

**Failed Sections:**
1. _____________________________
2. _____________________________
3. _____________________________

**Critical Error (If any):**
```
[Paste error message from Console here]
```

**Steps to Reproduce:**
1. _____________________________
2. _____________________________
3. _____________________________

**Screenshot/Evidence:**
- [ ] Attached console error screenshot
- [ ] Attached network tab screenshot
- [ ] Described visual issue

---

## SIGN-OFF

| Item | Value |
|---|---|
| **Tester Name** | _________________________ |
| **Date Tested** | _________________________ |
| **URL Tested** | _________________________ |
| **Browser Used** | _________________________ |
| **Overall Result** | ☐ PASS ☐ FAIL |
| **Time Spent** | _____________ minutes |
| **Ready to Re-Execute Task?** | ☐ YES ☐ NO |

**Tester Signature:** _________________________ (Optional)

---

## ESCALATION (If FAILED)

**Send this checklist + root cause analysis to:**
- **dev_lead** — Development team lead
- **Subject:** "Landing Page Form Test — FAILED — Escalation Required"
- **Attach:** This checklist + screenshots + console logs

**Mark as Priority:** CRITICAL (blocks MVBP deployment)

---

## REFERENCE

Full test protocol: `documents/manual_landing_page_form_test_protocol.md`  
Root cause analysis: `documents/2026-04-21_infrastructure_root_cause_analysis.md`  
Remediation guide: `documents/2026-04-21_infrastructure_remediation_guide.md`  

---

**Total Test Duration:** ~20-30 minutes  
**Estimated Complexity:** Low to Medium  
**Skill Required:** Basic browser testing (no coding needed)  

---

*Version 1.0 | April 21, 2026*
