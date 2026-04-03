---
name: previous-violations
description: Catalog of security and quality violations caught in past PRs to prevent regression
type: reference
last_updated: 2026-04-03
---

# Previous Violations

A running log of security issues, bugs, and quality problems caught in past PRs. Used to train pattern recognition and prevent similar issues.

## Security Violations

### Hardcoded API Keys
**PR #73** - `commit c2d4a1b`  
**File:** `src/services/email.ts`  
**Pattern:** `const SENDGRID_KEY = "SG.abc123..."`  
**Impact:** Production API key exposed in public repo for 3 hours  
**Prevention:** Now checks for any uppercase variables with values matching `/[A-Z0-9_]{20,}/` or known API key prefixes

### SQL Injection
**PR #103** - `commit 9c4e1f3`  
**File:** `src/controllers/user.ts:45`  
**Pattern:** `` db.query(`SELECT * FROM users WHERE name = '${req.body.name}'`) ``  
**Impact:** Potential data breach via search feature  
**Prevention:** Auto-rejects template literals in database query strings

### Missing Authentication
**PR #128** - `commit 7f8e2d9`  
**File:** `src/routes/admin.ts`  
**Pattern:** New admin endpoint added without auth middleware  
**Impact:** Admin panel accessible without login for 2 days  
**Prevention:** Checks that all routes under `/admin/**` and `/api/**` have auth decorators

### XSS via dangerouslySetInnerHTML
**PR #167** - `commit 4g3h2j5`  
**File:** `src/components/UserProfile.tsx:89`  
**Pattern:** `<div dangerouslySetInnerHTML={{ __html: userBio }} />`  
**Impact:** Stored XSS in user profiles  
**Prevention:** Flags all `dangerouslySetInnerHTML` usage with user-generated content

### Weak Cryptography
**PR #198** - `commit 5k6m1n8`  
**File:** `src/utils/hash.ts:12`  
**Pattern:** `crypto.createHash('md5').update(password)`  
**Impact:** Password hashes vulnerable to rainbow tables  
**Prevention:** Rejects MD5, SHA1 for password/token hashing; requires bcrypt, argon2, or scrypt

## Test Coverage Gaps

### Missing Edge Case Tests
**PR #145** - `commit 8p3q9r2`  
**File:** `src/utils/validator.ts`  
**Issue:** Email validator didn't handle Unicode domains  
**Impact:** Production crash on internationalized email addresses  
**Prevention:** Now requires test cases for edge cases (empty strings, Unicode, null, undefined)

### Integration Test Skipped
**PR #201** - `commit 5h6j2k8`  
**File:** `src/auth/middleware.ts`  
**Issue:** Unit tests mocked session store, missed real Redis timeout bug  
**Impact:** Auth failures in production under load  
**Prevention:** Requires integration tests for any auth/session code changes

## Code Quality Issues

### Overly Complex Function
**PR #223** - `commit 2t4u7v1`  
**File:** `src/services/billing.ts:156-289`  
**Issue:** 130-line function with cyclomatic complexity of 18  
**Impact:** Bug fix introduced 3 new bugs, took 2 days to debug  
**Prevention:** Flags functions >50 lines or complexity >10 for refactoring

### Dead Code Not Removed
**PR #256** - `commit 6w8x2y9`  
**File:** `src/legacy/old-auth.ts`  
**Issue:** Commented-out authentication code left in repo  
**Impact:** Confusion during incident response about which auth system was active  
**Prevention:** Requests removal of commented code blocks >10 lines

## Dependency Issues

### Vulnerable Dependency
**PR #278** - `commit 9z1a4b7`  
**File:** `package.json`  
**Issue:** Added `lodash@4.17.20` (CVE-2020-8203)  
**Impact:** Prototype pollution vulnerability  
**Prevention:** Checks for known CVEs in added dependencies (requires npm audit integration)

## Configuration Mistakes

### Production Secrets in .env.example
**PR #302** - `commit 3c5d8e2`  
**File:** `.env.example`  
**Pattern:** Real database credentials instead of placeholders  
**Impact:** Production DB password in public file  
**Prevention:** Checks that `.env.example` contains only placeholder values

### Debug Mode Left Enabled
**PR #334** - `commit 7f2g9h4`  
**File:** `config/production.ts`  
**Pattern:** `DEBUG: true` in production config  
**Impact:** Verbose error messages leaked stack traces to users  
**Prevention:** Flags debug/verbose settings enabled in production configs

---

## Learning Mechanism

This memory enables the agent to:

1. **Pattern Recognition** - Match new code against known vulnerability patterns
2. **Context-Aware Severity** - Escalate issues that caused incidents (not just theoretical)
3. **Team-Specific Rules** - Enforce lessons learned from this team's actual mistakes
4. **Proactive Suggestions** - Recommend specific fixes based on what worked before

Every time a critical issue is caught, it should be added to this file with:
- PR number and commit hash (traceability)
- File and line numbers (specificity)
- Pattern description (reusable detection)
- Impact assessment (severity calibration)
- Prevention mechanism (how agent should catch it next time)
