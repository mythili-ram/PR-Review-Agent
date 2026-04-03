---
name: key-decisions
description: Critical architectural and security decisions made in past PRs that inform future reviews
type: reference
last_updated: 2026-04-03
---

# Key Decisions

This file records important decisions from past PRs that should guide future reviews. The agent references this when evaluating similar changes.

## Authentication & Authorization

### Decision: Auth middleware required for all API endpoints
**Context:** PR #42 (commit a3f2c1d) - introduced custom auth bypass that led to production incident  
**Rule:** All endpoints in `/api/**` must use the framework's auth middleware  
**Rationale:** Custom implementations were bypassed in edge cases, leading to unauthorized access  
**How to apply:** Flag any PR introducing new routes without auth decorators/middleware

### Decision: JWT tokens must be validated on every request
**Context:** PR #87 (commit 7b3d9e2) - caching JWT validation led to revoked tokens still working  
**Rule:** No caching of JWT validation results across requests  
**Rationale:** Security incident where revoked admin token remained active for 15 minutes  
**How to apply:** Block any caching of `verifyToken()` or similar validation calls

## Data Handling

### Decision: All database queries must use parameterized statements
**Context:** PR #103 (commit 9c4e1f3) - SQL injection in user search feature  
**Rule:** Zero tolerance for string concatenation in SQL/database queries  
**Rationale:** Even "safe" concatenation led to injection when Unicode normalization attacked  
**How to apply:** Auto-reject any PR with template literals in query strings (`SELECT ... WHERE id = '${input}'`)

### Decision: PII must never appear in logs
**Context:** PR #156 (commit 2a1f8g9) - customer SSN logged in error messages  
**Rule:** Structured logging only; no free-form string interpolation with user data  
**Rationale:** Compliance violation, $50K fine from data protection authority  
**How to apply:** Flag any `console.log()`, `logger.info()`, etc. with user input variables

## Testing Standards

### Decision: Authentication/authorization changes require integration tests
**Context:** PR #201 (commit 5h6j2k8) - unit tests passed but integration broke in prod  
**Rule:** Changes to auth flow must include end-to-end test with real tokens  
**Rationale:** Mocked tests missed interaction bugs with session middleware  
**How to apply:** Request changes if PR touches auth code without integration test files

### Decision: API contract changes require version bump and migration guide
**Context:** PR #245 (commit 3m9n1p4) - breaking change deployed without notice  
**Rule:** Breaking API changes = major version bump + migration doc in PR description  
**Rationale:** Partner integrations broke without warning, customer escalations  
**How to apply:** Check for version bump in package.json and migration notes for API schema changes

## Dependencies & Supply Chain

### Decision: Direct dependencies only for critical security packages
**Context:** PR #289 (commit 7q2r5t1) - transitive dependency had CVE, took weeks to patch  
**Rule:** Auth, crypto, and validation libraries must be direct dependencies  
**Rationale:** Transitive dependencies harder to monitor and update quickly  
**How to apply:** If PR adds indirect dep for security-sensitive code, request direct installation

## Performance & Reliability

### Decision: Database migrations must be backward-compatible
**Context:** PR #312 (commit 8s4u3v6) - migration broke older app version during rollout  
**Rule:** Migrations in two steps: additive change first, then removal after deploy  
**Rationale:** Zero-downtime deployments failed when new schema incompatible with old code  
**How to apply:** Flag migrations that drop columns or change types without multi-phase plan

---

## How This Memory Is Used

When reviewing PRs, the agent:

1. **Pattern matching** - Detects similar code patterns to past violations
2. **Context awareness** - References specific commits and PRs that set precedents  
3. **Proactive guidance** - Suggests tests or safeguards based on historical incidents
4. **Consistency** - Applies same standards that were enforced in previous reviews

This ensures the agent learns from the team's history rather than applying generic rules.
