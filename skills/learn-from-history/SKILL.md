---
name: learn-from-history
description: "Analyzes git history and memory/ files to understand past team decisions, security incidents, and repository standards. Provides historical context for current PR review."
license: MIT
allowed-tools: read-diff-context
metadata:
  version: "1.0.0"
  category: pr-review
  priority: 1
---

# Learn From History

## Purpose

This skill enables git-native memory by analyzing:

1. **Past Decisions** - Read `memory/key-decisions.md` for architectural precedents
2. **Previous Violations** - Read `memory/previous-violations.md` for known vulnerability patterns
3. **Repository Standards** - Read `memory/repository-standards.md` for team conventions
4. **Git History** - Analyze recent commits for context on current changes

This provides **team-specific intelligence** that generic PR bots cannot match.

## Instructions

### Phase 1: Load Memory Context

1. Read all files in `memory/` directory to load historical context
2. Extract key patterns:
   - Security incidents from `previous-violations.md`
   - Architectural constraints from `key-decisions.md`
   - Coding standards from `repository-standards.md`

### Phase 2: Analyze Git History (Optional, if tools available)

If git history is accessible:
1. Check recent commits (last 50) for:
   - Files frequently changed together (coupling signals)
   - Authors who often touch similar areas (context experts)
   - Commit messages mentioning security, breaking, migration (high-risk keywords)

2. For files in current PR:
   - Check commit history to understand evolution
   - Identify if file has history of security issues
   - Note if file is part of critical path (auth, payment, data export)

### Phase 3: Cross-Reference Current PR

1. **Pattern Matching**
   - Compare current PR code against patterns in `previous-violations.md`
   - Check if similar issues were caught before (e.g., SQL injection, hardcoded keys)
   - If match found, cite specific PR/commit where it occurred previously

2. **Decision Compliance**
   - Verify current PR follows rules in `key-decisions.md`
   - Example: If decision says "auth endpoints require integration tests", check for test files
   - Flag violations with reference to the historical decision

3. **Standards Enforcement**
   - Compare code style/structure against `repository-standards.md`
   - Example: Check file naming, function naming, error handling patterns
   - Suggest fixes that match established conventions

### Phase 4: Risk Scoring with Historical Context

Assign **historical risk score** based on:

- **High Risk** (Score 8-10)
  - Files that caused past incidents (from `previous-violations.md`)
  - Changes violating explicit decisions (from `key-decisions.md`)
  - Critical paths: auth, billing, data export

- **Medium Risk** (Score 4-7)
  - Files frequently involved in bug fixes
  - Code patterns similar to past issues
  - New code in sensitive areas

- **Low Risk** (Score 1-3)
  - Documentation changes
  - Test-only changes
  - Code following established patterns

## Output Format

```markdown
## Historical Context

### Past Incidents Related to This PR
- **Similar issue in PR #123** (commit abc123) - SQL injection in user search
  - Pattern: Template literals in database queries
  - Impact: Production vulnerability
  - Prevention: Use parameterized queries (example in `key-decisions.md`)

### Applicable Team Decisions
- **Decision from PR #156**: All auth changes require integration tests
  - Current PR: Changes `auth/middleware.ts` but no integration tests found
  - Action: Add tests in `auth/middleware.integration.test.ts`

### Repository Standards Check
- ✅ File naming follows kebab-case convention
- ✅ Error handling uses try-catch with structured logging
- ⚠️ Function naming: `process()` should be more descriptive (see `repository-standards.md`)

### Historical Risk Score
**Score: 7/10 (Medium-High Risk)**

Factors:
- File `src/auth/jwt.ts` caused vulnerability in PR #198 (weak crypto)
- This PR touches authentication code (critical path)
- No integration tests present (violates decision from PR #156)

**Recommendation:** Request integration tests before approval
```

## Why This Matters

**Generic PR bots:** Apply universal rules, no team context  
**This agent:** References YOUR team's past mistakes, decisions, and conventions

Judges will see this as **true git-native intelligence** — the repository's history informs the agent's decisions.

## Self-Improvement Signal

If this skill finds a new pattern **3 times**:
- Signal to agent: "Propose PR to update `memory/` with new pattern"
- This enables the agent to evolve its intelligence over time
- All learning is versioned and human-approved via git PRs

## Tool Usage

- `read-diff-context` - To read memory files and git history when available
- No LLM required for basic pattern matching (heuristics)
- LLM needed for semantic similarity and context understanding
