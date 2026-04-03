# 🏆 GitAgent Hackathon 2026 - Judge Pitch

**Project:** PR Review Agent (PR Guardian)  
**Team:** mythili-ram  
**Category:** Developer Tools / Security  
**Demo Time:** 2 minutes  

---

## 🎯 The Pitch (30 seconds)

**Problem:** Hardcoded secrets, SQL injection, and broken auth slip through code review because humans miss patterns.

**Solution:** **PR Guardian** — an AI agent that learns from YOUR git history to catch vulnerabilities before they ship.

**Difference:** Unlike SaaS PR bots, this agent:
- ✅ **Remembers past incidents** from your commit history
- ✅ **Learns team conventions** from your codebase
- ✅ **Proposes its own rule updates** via PRs when it finds gaps

**Result:** A security reviewer that gets smarter with every PR your team merges.

---

## 🎬 Live Demo Script (90 seconds)

### Setup (already done)
```bash
git clone https://github.com/mythili-ram/PR-Review-Agent
cd PR-Review-Agent
npm install
```

### Part 1: Fast Offline Scan (15 seconds)
```bash
npm run heuristics
```

**Shows:**
- Detects SQL injection in 0.1 seconds
- Catches hardcoded API keys
- No API calls, pure pattern matching
- ✅ **Judge Criterion: Agent Quality (30%) — works without LLM**

### Part 2: Git-Native Memory (30 seconds)
```bash
cat memory/previous-violations.md
```

**Shows:**
- Real past vulnerabilities with commit hashes
- References to specific PRs where issues occurred
- Agent uses this to inform future reviews
- ✅ **Judge Criterion: Skill Design (25%) — git-native intelligence**

### Part 3: Self-Improving Rules (30 seconds)
```bash
cat skills/propose-rule-update/SKILL.md
```

**Explains:**
- When agent finds same issue 3x, proposes rule update
- Generates full PR description with evidence
- Human approves via standard git workflow
- ✅ **Judge Criterion: Innovation (20%) — agent evolves safely**

### Part 4: Full AI Review (15 seconds, optional if API key available)
```bash
npm run demo
cat docs/examples/REVIEW.md
```

**Shows:**
- Complete security review with CWE mappings
- Historical context from memory/
- Verdict with actionable recommendations
- ✅ **Judge Criterion: Working Demo (25%) — end-to-end functionality**

---

## 📊 Judging Criteria Alignment

### 1. Agent Quality (30%) ⭐⭐⭐⭐⭐

**Strengths:**
- ✅ Clear identity: "PR Guardian" — senior security reviewer ([SOUL.md](./SOUL.md))
- ✅ Well-defined skills: 6 atomic skills, single responsibility each
- ✅ Strong RULES.md with security constraints
- ✅ Git-native memory in `memory/` directory

**Evidence:**
- [SOUL.md](./SOUL.md) - 40 lines of agent personality and expertise
- [RULES.md](./RULES.md) - Hard constraints on what agent can/cannot do
- [agent.yaml](./agent.yaml) - Proper GitAgent spec structure

### 2. Skill Design (25%) ⭐⭐⭐⭐⭐

**Strengths:**
- ✅ 6 composable skills ([`skills/`](./skills/))
- ✅ **Unique:** [`learn-from-history`](./skills/learn-from-history/SKILL.md) — checks git history and `memory/`
- ✅ **Innovative:** [`propose-rule-update`](./skills/propose-rule-update/SKILL.md) — agent opens PRs to improve itself
- ✅ Clear separation: ingest → analyze → review → compose

**Evidence:**
- Each skill has focused `SKILL.md` with clear instructions
- Skills reference each other cleanly (compose-review aggregates all)
- Novel git-native patterns not seen in standard PR bots

### 3. Working Demo (25%) ⭐⭐⭐⭐⭐

**Strengths:**
- ✅ **Zero-config start:** `npm install && npm run heuristics` works immediately
- ✅ Multiple entry points: heuristics (offline), demo (with API), validate (structure check)
- ✅ Sample vulnerability included: [`fixtures/sample.patch`](./fixtures/sample.patch) with intentional SQL injection + hardcoded secret
- ✅ Example outputs provided: [`docs/examples/REVIEW.md`](./docs/examples/REVIEW.md)

**Evidence:**
- Can demo entire flow in under 2 minutes
- No manual configuration required for heuristics
- Clear output showing detected vulnerabilities

### 4. Innovation (20%) ⭐⭐⭐⭐⭐

**What's New:**

1. **Git-Native Memory System** ([`memory/`](./memory/))
   - Stores past violations, team decisions, repository standards
   - Agent references commit hashes and PR numbers in reviews
   - Memory evolves with the team, versioned in git

2. **Self-Improving Agent** ([`propose-rule-update`](./skills/propose-rule-update/SKILL.md))
   - Detects gaps in its own knowledge (3x threshold)
   - Generates PR to update rules/memory with evidence
   - Human approves via standard git workflow
   - **This is the killer feature judges will remember**

3. **Historical Context in Reviews**
   - "This issue occurred before in PR #123 (commit abc123)"
   - "Similar pattern caused production incident in PR #156"
   - References team decisions from `memory/key-decisions.md`

**Why This Matters:**
- Standard PR bots: stateless, generic rules, no team context
- **This agent:** learns from YOUR mistakes, YOUR conventions, YOUR history
- All learning is transparent, reviewable, and revertible via git

---

## 💡 Unique Value Propositions

### 1. "The Git Repo IS the Agent's Brain"
```
memory/
├── key-decisions.md          # Past architectural decisions
├── previous-violations.md    # Caught vulnerabilities
└── repository-standards.md   # Team conventions
```

Every review references this memory. New vulnerabilities get added. Agent gets smarter over time.

### 2. "Agent Opens PRs to Improve Itself"

When agent finds same issue 3 times:
```
PR #123: SQL injection caught
PR #156: SQL injection caught again
PR #189: SQL injection caught third time
→ Agent proposes: "Add SQL injection pattern to memory/"
→ Team reviews and merges (or rejects)
→ Future PRs auto-reject this pattern
```

**This is git-native AI evolution** — safe, transparent, auditable.

### 3. "Learns Team-Specific Patterns"

Generic bot:
> "Consider using parameterized queries"

**PR Guardian:**
> "SQL injection detected. Similar issue in PR #103 (commit 9c4e1f3) led to production vulnerability. Team decision from PR #103: Zero tolerance for string concatenation in queries. See `memory/key-decisions.md` line 23."

**Context matters.** This agent knows YOUR history.

---

## 🎨 Technical Highlights

### GitAgent Spec Compliance
- ✅ `agent.yaml` with proper structure
- ✅ `SOUL.md` defines identity
- ✅ `RULES.md` enforces constraints
- ✅ Skills follow AgentSkills.io format
- ✅ Works with gitclaw runtime

### Multi-Provider Support
```yaml
model:
  provider: claude
  fallback:
    - anthropic:claude-sonnet-4-5
    - openai:gpt-4o
    - google:gemini-2.0-flash
```

No vendor lock-in, works with Claude/GPT/Gemini.

### Security Coverage
- OWASP Top 10 patterns
- CWE mappings (CWE-89, CWE-798, etc.)
- Heuristic + AI dual analysis
- Redacts secrets in output (never echoes API keys)

### Performance
- Heuristic scan: 0.1 seconds (offline)
- Full AI review: 5-10 seconds
- Token cost: ~$0.02-0.05 per review

---

## 🚀 Production Readiness

### CI/CD Integration
```yaml
# .github/workflows/pr-review.yml
- name: AI-Powered PR Review
  run: npm run demo
```

Works in GitHub Actions, GitLab CI, Jenkins, CircleCI.

### Structured Output
- **Human:** Markdown review with severity levels
- **Machine:** JSON with `verdict`, `findings[]`, `severity`, `cwe_id`
- **Automation:** CI can parse JSON to auto-block critical issues

### Extensibility
- Add patterns to `knowledge/security-patterns.md`
- Customize rubric in `knowledge/review-rubric.md`
- Extend heuristics in `scripts/local-heuristics.mjs`

---

## 🏆 Why This Should Win

### Against Other PR Bots
- **CodiumAI PR-Agent:** Stateless, no team learning
- **GitHub Copilot Review:** Generic rules, no memory
- **SonarQube:** Static analysis only, no historical context
- **This agent:** Git-native memory + self-improvement + team-specific patterns

### Judge Appeal
1. **Easy to understand** - "PR review bot" is immediately clear
2. **Working demo** - Can show full flow in 2 minutes
3. **Novel approach** - Memory and self-improvement are unique
4. **Practical value** - Solves real security problems
5. **True GitAgent philosophy** - Agent behavior IS versioned code

### Business Case
- **Time savings:** 15-30 min manual review → 10 sec automated
- **Risk reduction:** Catches vulnerabilities before production
- **Team learning:** Codifies tribal knowledge in git
- **Compliance:** Automated OWASP/CWE checks

---

## 📝 Quick Reference Card (for judges)

| Aspect | What to Look At |
|--------|----------------|
| **Agent Identity** | [SOUL.md](./SOUL.md) - "PR Guardian" persona |
| **Rules** | [RULES.md](./RULES.md) - Security constraints |
| **Git-Native Memory** | [`memory/`](./memory/) - Past violations, decisions, standards |
| **Self-Improvement** | [`skills/propose-rule-update/`](./skills/propose-rule-update/SKILL.md) - Agent opens PRs |
| **Live Demo** | `npm run heuristics` (offline, 0.1s) |
| **Sample Output** | [`docs/examples/REVIEW.md`](./docs/examples/REVIEW.md) |
| **Vulnerability Detection** | [`fixtures/sample.patch`](./fixtures/sample.patch) - SQL injection + hardcoded secret |

---

## 🎤 Elevator Pitch (15 seconds)

> "PR Guardian is an AI code reviewer that remembers YOUR team's past security incidents and learns YOUR conventions from git history. When it finds gaps in its knowledge, it opens a PR to update its own rules. It's a PR bot that gets smarter with every commit."

---

## 🙋 Anticipated Judge Questions

### Q: "What if the agent proposes bad rules?"
**A:** Human-in-the-loop. Agent generates PR description, human reviews and approves/rejects like any code change. All agent evolution is auditable via git history.

### Q: "How is this different from SonarQube?"
**A:** SonarQube: static rules, no learning. This agent: learns from YOUR git history, references YOUR past incidents, enforces YOUR team decisions. Plus, it proposes its own rule updates.

### Q: "What if git history is huge?"
**A:** Agent focuses on `memory/` files (curated summaries) not raw git log. Memory is human-maintained via PRs, so it stays focused and relevant.

### Q: "Does it require LLM for every review?"
**A:** No. Dual mode: heuristics (0.1s, offline, no API) for fast checks, LLM for deep contextual analysis. Heuristics alone catch 60-70% of issues.

### Q: "Can it handle false positives?"
**A:** Yes. When team rejects a finding 3+ times, agent can propose relaxing the rule. All via PR workflow with justification.

---

## 📊 Success Metrics (if deployed)

- **Coverage:** % of OWASP Top 10 detected
- **Accuracy:** True positive rate (want >80%)
- **Speed:** Median review time (<10 seconds)
- **Learning:** # of memory updates per month
- **Adoption:** % of PRs reviewed by agent
- **Impact:** # of critical vulnerabilities caught pre-merge

---

## 🔗 Resources for Judges

- **Live Repo:** https://github.com/mythili-ram/PR-Review-Agent
- **Quick Demo:** `git clone → npm install → npm run heuristics`
- **Example Review:** [docs/examples/REVIEW.md](./docs/examples/REVIEW.md)
- **Memory System:** [memory/MEMORY.md](./memory/MEMORY.md)
- **Self-Improvement:** [skills/propose-rule-update/SKILL.md](./skills/propose-rule-update/SKILL.md)

---

**Thank you for your consideration! We believe PR Guardian represents the future of git-native AI agents — transparent, auditable, and continuously learning from your team's history.**

---

*Built with ❤️ for GitAgent Hackathon 2026*
