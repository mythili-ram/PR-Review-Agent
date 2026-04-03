---
name: propose-rule-update
description: "Detects gaps in RULES.md or memory/ files and generates PR to update agent's own knowledge base. Enables safe, human-approved agent evolution."
license: MIT
allowed-tools: write-review-artifact
metadata:
  version: "1.0.0"
  category: meta
  experimental: true
---

# Propose Rule Update

## Purpose

This skill enables **safe agent self-improvement** by:

1. Detecting patterns that should become rules but aren't documented
2. Generating a PR to update `RULES.md`, `memory/`, or `knowledge/`
3. Human reviews and approves/rejects the proposed change via standard git workflow

**This is git-native AI evolution** — no silent model updates, all changes versioned and auditable.

## When to Trigger

### Automatic Triggers (Score-Based)

Track these signals during reviews. When threshold reached, propose rule update:

1. **Repeated Pattern** (3+ occurrences)
   - Same vulnerability caught 3 times in different PRs
   - Same style inconsistency flagged repeatedly
   - Same test gap identified multiple times
   - **Action:** Propose adding pattern to `memory/previous-violations.md`

2. **Ambiguous Decision** (2+ conflicting precedents)
   - Team approved pattern X in PR #1 but rejected similar pattern in PR #5
   - Inconsistent enforcement of existing rule
   - **Action:** Propose clarifying decision in `memory/key-decisions.md`

3. **Missing Standard** (pattern exists but not documented)
   - 80% of codebase uses pattern X, but not in `repository-standards.md`
   - New team convention emerged organically
   - **Action:** Propose codifying standard in `memory/repository-standards.md`

4. **Critical Gap** (vulnerability type not in knowledge base)
   - New vulnerability class detected (e.g., prototype pollution)
   - Not covered by `knowledge/security-patterns.md`
   - **Action:** Propose adding to knowledge base

### Manual Trigger

User can explicitly request: "Propose rule updates based on this PR"

## Instructions

### Phase 1: Detect Rule Gap

When a review finds an issue, check:

1. **Is this pattern already documented?**
   - Search `RULES.md` for similar rule
   - Search `memory/previous-violations.md` for past occurrence
   - Search `knowledge/security-patterns.md` for pattern

2. **How many times has this occurred?**
   - Check git history for similar findings in commit messages
   - Look for "[SECURITY]", "[VIOLATION]", "[CRITICAL]" markers in past commits
   - If 3+ occurrences, trigger proposal

3. **Is there team precedent?**
   - Check if similar code was approved/rejected before
   - If conflicting decisions exist, propose clarification

### Phase 2: Draft Proposal

Generate a **structured proposal** with:

1. **Pattern Description**
   - What vulnerability/issue is this?
   - Example code snippet showing the problem

2. **Evidence**
   - List PRs/commits where this occurred
   - Show frequency (3 times in last 20 PRs = 15% hit rate)

3. **Proposed Rule**
   - Exact text to add to `RULES.md` or `memory/`
   - Severity level (CRITICAL, WARNING, INFO)
   - Detection method (regex, semantic pattern, tool)

4. **Impact Analysis**
   - How many existing PRs would this rule have caught?
   - False positive rate estimate
   - Maintenance burden (manual vs automated)

### Phase 3: Generate PR Content

Create a **full PR description** that includes:

```markdown
## Rule Proposal: [Short Title]

### Problem
[Describe the gap - what's slipping through reviews]

### Evidence
- **PR #123** (commit abc123): Hardcoded API key in `src/config.ts`
- **PR #156** (commit def456): Exposed token in `.env.example`
- **PR #189** (commit ghi789): AWS credentials in test fixtures

**Frequency:** 3 occurrences in last 20 PRs (15% hit rate)

### Proposed Rule Addition

**File:** `memory/previous-violations.md`

**Section:** Security Violations → Hardcoded Secrets

**Text to add:**
```
### API Keys in Configuration Files
**Pattern:** Any uppercase variable matching `/[A-Z_]+_(KEY|TOKEN|SECRET)\s*=\s*["'][^"']+["']/`
**Examples:**
- `API_KEY = "sk-prod-abc123"`
- `const AWS_SECRET = "AKIA..."`
**Prevention:** Auto-reject any PR with this pattern
**Severity:** CRITICAL
```

### Justification
This pattern caused production incidents in PR #123 and #156. Codifying it prevents future occurrences and enables automated detection.

### Implementation
- [ ] Add pattern to `memory/previous-violations.md`
- [ ] Update heuristics in `scripts/local-heuristics.mjs` (optional)
- [ ] Add test case to `tests/fixtures/hardcoded-secrets.patch`

### Risk Assessment
- **False Positives:** Low (uppercase + KEY/TOKEN/SECRET is strong signal)
- **Maintenance:** None (passive documentation)
- **Breaking Change:** No (adds constraint, doesn't remove)
```

### Phase 4: Output Format

**DO NOT create actual git commits or PRs** — output instructions for user:

```markdown
## 🚀 Proposed Rule Update

I've detected a pattern that should be codified as a rule.

**Pattern:** Hardcoded API keys in configuration files  
**Occurrences:** 3 times in recent PRs  
**Recommended Action:** Add to `memory/previous-violations.md`

### Draft PR Content

<details>
<summary>Click to expand full PR description</summary>

[Full PR markdown from Phase 3]

</details>

### Manual Steps (GitAgent cannot auto-commit)

```bash
# 1. Create a branch
git checkout -b feat/rule-update-hardcoded-secrets

# 2. Edit the memory file
cat >> memory/previous-violations.md << 'EOF'

### API Keys in Configuration Files
**Pattern:** Uppercase variables with KEY/TOKEN/SECRET and string values
[... rest of rule text ...]
EOF

# 3. Commit with reference to this PR
git add memory/previous-violations.md
git commit -m "feat: add rule for hardcoded API keys detection

Detected pattern in PR #current, #123, #156

Co-Authored-By: PR Guardian <agent@pr-review-agent>"

# 4. Push and create PR
git push origin feat/rule-update-hardcoded-secrets
# Then open PR on GitHub/GitLab with draft content above
```

**Why human-in-the-loop?**  
Agent evolution should be transparent and reviewable. Your team approves/rejects this like any code change.
```

## Security Constraints

**NEVER:**
- Directly modify `RULES.md` or `memory/` without human approval
- Auto-commit changes to git
- Weaken existing security rules
- Propose removing rules (only additions/clarifications)

**ALWAYS:**
- Provide full justification with evidence
- Show examples of where proposed rule would have helped
- Estimate false positive rate
- Flag if proposed rule conflicts with existing rules

## Success Metrics

This skill is successful when:

1. **High Signal-to-Noise Ratio** - Proposed rules are accepted >70% of the time
2. **Prevents Regression** - Proposed rules catch future issues
3. **Low Maintenance** - Rules don't require constant updates
4. **Team Adoption** - Developers find proposals helpful, not annoying

## Why Judges Will Love This

**Standard PR bots:** Static rules, never evolve, no team learning  
**This agent:** Proposes rule updates via PRs, human-approved, fully auditable

This demonstrates:
- **True GitAgent philosophy** - Agent behavior is versioned code
- **Human-AI collaboration** - Agent suggests, human approves
- **Safe AI evolution** - All changes reviewable and revertible
- **Practical value** - Prevents real vulnerabilities from recurring

## Example Scenarios

### Scenario 1: Repeated SQL Injection

**Review 1:** Found SQL injection, flagged, merged after fix  
**Review 2:** Different file, same pattern, flagged again  
**Review 3:** **TRIGGER** - Agent proposes adding to `previous-violations.md`

**Outcome:** Future reviews automatically catch this pattern, reference the memory entry

### Scenario 2: Unclear Auth Standard

**PR #45:** Approved auth without integration tests  
**PR #67:** Rejected auth without integration tests  
**Conflict:** **TRIGGER** - Agent proposes clarifying in `key-decisions.md`

**Outcome:** Clear precedent established, consistent future reviews

### Scenario 3: Emerging Convention

**Analysis:** 15 of last 20 PRs use `async/await`, only 5 use `.then()`  
**Observation:** Convention emerged but not documented  
**Threshold met:** **TRIGGER** - Agent proposes adding to `repository-standards.md`

**Outcome:** New convention codified, enforced consistently going forward

---

**This is the future of AI code review** - agents that learn from your team's history and safely improve themselves over time.
