# 🎬 Hackathon Demo Guide

This repo includes **multiple sample PRs** you can demo end-to-end:

1. **`fixtures/sample.patch`** (VULNERABLE) - Hardcoded API key + SQL injection
2. **`fixtures/safe-pr.patch`** (SAFE) - Clean code with tests, should get APPROVE
3. **`fixtures/docs-only.patch`** (DOCS) - Documentation changes only

## 🎯 Demo Objective

Show judges that this agent **actually catches real vulnerabilities** that manual reviews miss, and integrates seamlessly into development workflows.

**Key Message:** “PR reviews miss secrets and unsafe SQL; this agent is **defined in git** (SOUL, RULES, skills) and runs with **gitclaw** in under 10 seconds.”

---

## ✅ Pre-Recording Checklist

- [ ] `.env` file created with valid `ANTHROPIC_API_KEY` (get from https://console.anthropic.com/)
- [ ] `npm install` completed successfully
- [ ] Terminal setup: Large font (18-20pt), high contrast theme, full screen
- [ ] Screen recording software ready (OBS, Loom, QuickTime)
- [ ] `cd` to repo directory before recording
- [ ] Test all commands work:
  ```bash
  npm run validate
  npm run heuristics
  npm run demo
  ```
- [ ] Prepare talking points (see script below)
- [ ] Close unnecessary windows/tabs (declutter screen)

---

## 🎥 Recording Script (3 Minutes)

### Intro (30 seconds)

**[On camera or voiceover]**

"Hi, I'm [name], and this is my submission for the GitAgent Hackathon. Manual PR reviews miss critical security issues. This agent catches hardcoded secrets, SQL injection, and other OWASP Top 10 vulnerabilities automatically."

**[Show repo in browser or VS Code]**

"The agent is defined entirely in git: SOUL for personality, RULES for constraints, and 5 specialized skills. Let's see it in action."

### Part 1: Structure Validation (20 seconds)

**[Terminal]**

```bash
npm run validate
```

**[Say while running]**

"First, validate the agent structure. This checks that all required files and skills are present per the GitAgent specification."

**[Output shows]**
```
validate-structure: OK
  skills: ingest-pr, summarize-diff, security-pass, tests-and-risk, compose-review
  tools: read-diff-context, write-review-artifact
```

### Part 2: Fast Heuristic Scan (30 seconds)

**[Terminal]**

```bash
npm run heuristics
```

**[Say while running]**

"Next, offline heuristics scan. This runs 15+ security patterns with zero API calls, covering OWASP Top 10 and common CWEs."

**[Output shows JSON - point to key parts]**

```json
{
  "verdict": "REQUEST_CHANGES",
  "stats": {
    "critical": 2,
    "warning": 3,
    "suggestion": 2
  },
  "findings": [
    {
      "severity": "CRITICAL",
      "rule_id": "secret-exposure",
      "message": "API key (sk- prefix) detected..."
    },
    {
      "severity": "CRITICAL",
      "rule_id": "sql-injection",
      "message": "SQL built with string concatenation..."
    }
  ]
}
```

**[Say]**

"Two critical issues found: hardcoded API key and SQL injection. This took 0.1 seconds with no LLM."

### Part 3: AI-Powered Review (90 seconds)

**[Terminal]**

```bash
npm run demo
```

**[Say while running]**

"Now the full AI review with gitclaw and Claude Sonnet. The agent reads the patch, applies OWASP patterns from the knowledge base, and generates a comprehensive review."

**[As output streams, highlight]**

1. "See the security findings with CWE mappings and fix recommendations"
2. "It caught the hardcoded key and recommends rotation plus secret manager"
3. "The SQL injection gets a code example of the safe alternative"
4. "Verdict: REQUEST_CHANGES - won't approve with critical security issues"

**[Show final output or open REVIEW.md if generated]**

### Part 4: Real-World Integration (20 seconds)

**[Show .github/workflows/pr-review.yml in editor]**

```bash
code .github/workflows/pr-review.yml
```

**[Say]**

"Here's the GitHub Actions workflow - drop this into any repo. It runs heuristics first for fast feedback, then the full AI review, and posts results as a PR comment. Works in GitLab CI, Jenkins, anywhere."

### Closing (20 seconds)

**[Terminal or repo view]**

**[Say]**

"To recap: This agent is git-native, catches OWASP Top 10 vulnerabilities, runs in under 10 seconds, and integrates with your CI/CD. The agent definition is code - version it, review it, improve it. Thanks for watching!"

**[Show repo URL or QR code if submitting video separately]**

---

## 📊 Commands Reference

| Step | Command | Duration | What It Shows |
|------|---------|----------|---------------|
| 1 | `npm run validate` | 1s | Agent structure is valid |
| 2 | `npm run heuristics` | 0.1s | 15+ patterns, 2 critical findings, no API |
| 3 | `npm run demo` | 5-10s | Full AI review with recommendations |
| 4 | Show workflow file | 5s | CI/CD integration ready |

**Total demo time:** ~3 minutes

---

## 🛠️ Technical Details

### Running the Demo Locally

From repo root, after `.env` exists:

```bash
npm run demo
```

This runs `scripts/run-demo.mjs`, which loads `.env` and invokes **gitclaw** with `-d` pointing at this agent directory.

**Manual equivalent (PowerShell):**

```powershell
npx dotenv-cli -e .env -- gitclaw -d . -p "Read fixtures/sample.patch and review per RULES.md"
```

**Manual equivalent (Bash):**

```bash
export $(cat .env | xargs) && gitclaw -d . -p "Read fixtures/sample.patch and review per RULES.md"
```

### Testing with Different Fixtures

```bash
# Vulnerable code (default)
npm run heuristics -- fixtures/sample.patch

# Safe code (should pass)
npm run heuristics -- fixtures/safe-pr.patch

# Docs only (should approve)
npm run heuristics -- fixtures/docs-only.patch
```

---

## 🎨 Presentation Tips

### Visual Elements

1. **Terminal setup:**
   - Use a high-contrast theme (dark with bright text)
   - Font: 18-20pt minimum (judges may watch on phones)
   - Hide distractions: Close other windows, disable notifications

2. **Code highlighting:**
   - Show the vulnerable code in `fixtures/sample.patch` side-by-side with the fix
   - Use syntax highlighting in your editor

3. **Screen recording best practices:**
   - Record at 1080p minimum
   - Show mouse cursor (helps judges follow)
   - Use Cmd/Ctrl+K to clear terminal between commands for clean output
   - Pause slightly after each command runs to let judges read output

### What to Emphasize

✅ **DO highlight:**
- “Two critical issues, caught in 0.1 seconds”
- “OWASP Top 10 coverage with CWE mappings”
- “Agent is defined as code - version it, review it, extend it”
- “Works in any CI/CD pipeline”
- “Both fast heuristics AND deep AI analysis”

❌ **DON'T:**
- Read API keys on screen (blur or redact `.env` if shown)
- Apologize for any minor glitches
- Spend time explaining GitAgent spec basics (judges know it)
- Show package installation or npm update messages

---

## 🏆 How This Maps to Judging Criteria

| Criterion | Weight | What to Emphasize | How This Submission Delivers |
|-----------|--------|-------------------|------------------------------|
| **Agent Quality** | 30% | Clear purpose, useful outputs, proper GitAgent structure | • Clear SOUL (senior engineer persona)<br>• RULES that block approvals with critical issues<br>• Actionable findings with CWE mappings + fixes |
| **Skill Design** | 25% | Well-organized, composable, single-purpose skills | • 5 focused skills in clear pipeline<br>• Each skill does one job (ingest → analyze → compose)<br>• Proper tool usage (read-diff-context, write-review-artifact) |
| **Working Demo** | 25% | Actually runs, not just slides or mockups | • Real gitclaw execution on camera<br>• Multiple test fixtures<br>• Fast heuristics + full AI review<br>• GitHub Actions workflow included |
| **Creativity** | 20% | Novel approach, unique value proposition | • Dual-layer analysis (heuristics + LLM)<br>• Git-native agent definition<br>• Structured outputs (JSON + Markdown)<br>• OWASP + CWE mapping for enterprise adoption |

### Winning Strategy

**Top-tier submissions will:**
1. Show real security vulnerabilities being caught (✅ We have this)
2. Demonstrate actual gitclaw execution (✅ We have this)
3. Provide reusable integration patterns (✅ GitHub Actions workflow)
4. Have polished documentation and examples (✅ README, DEMO, examples/)
5. Include unique differentiation (✅ Dual analysis, git-native rules)

**Your competitive advantages:**
- **Practical value:** Catches real vulnerabilities (not toy examples)
- **Production-ready:** CI/CD workflow + structured outputs
- **Extensible:** Teams can add custom rules to knowledge base
- **Comprehensive:** 15+ heuristic patterns + OWASP Top 10 coverage

---

## 💡 Q&A Preparation

### Common Judge Questions

**Q: “How is this different from GitHub's Dependabot or CodeQL?”**

A: “Those focus on dependencies and known CVE patterns. This agent catches logic vulnerabilities like SQL injection in new code, hardcoded secrets, and missing tests - things that don't have CVE numbers yet. Plus, it's customizable - teams can add their own rules.”

**Q: “What if the AI hallucinates or gives false positives?”**

A: “That's why we have dual-layer analysis. Heuristics catch obvious patterns with zero false positives. The AI provides context and edge cases. Plus, the agent is versioned in git - if it's wrong, update the knowledge base and it learns.”

**Q: “Can this replace human reviewers?”**

A: “No, it augments them. It catches the tedious security patterns so humans can focus on business logic, architecture, and user experience. Think of it as a security-focused pair programmer.”

**Q: “How much does this cost to run?”**

A: “About $0.02-0.05 per review with Claude Sonnet. Compare that to 15-30 minutes of engineer time. The heuristics layer is completely free.”

### If Asked for Another Example

**Option 1: Safe PR**
```bash
npm run heuristics -- fixtures/safe-pr.patch
# Show APPROVE or COMMENT verdict, no critical issues
```

**Option 2: Docs Only**
```bash
npm run heuristics -- fixtures/docs-only.patch
# Show it correctly identifies docs-only changes
```

**Keep your main demo on `fixtures/sample.patch`** - it has the most dramatic findings.

---

## ✅ Final Submission Checklist

### Required for Submission
- [x] Public GitHub repository
- [x] Open-source license (MIT)
- [x] README with setup and usage instructions
- [x] Working demo (video or live capability)
- [x] No secrets committed (`.env` in `.gitignore`)
- [x] Valid GitAgent structure (agent.yaml, SOUL.md, RULES.md, skills/, tools/)

### Quality Multipliers (Highly Recommended)
- [x] Example outputs (docs/examples/)
- [x] Multiple test fixtures
- [x] CI/CD integration example (.github/workflows/)
- [x] Comprehensive knowledge base (OWASP Top 10, CWE mappings)
- [x] Badges and visual polish in README
- [x] Architecture documentation
- [x] Performance metrics

### Video Recording Checklist
- [ ] 2-3 minute demo video recorded
- [ ] All commands shown working (validate, heuristics, demo)
- [ ] Critical findings highlighted and explained
- [ ] CI/CD integration shown
- [ ] No secrets visible on screen
- [ ] Clear audio (microphone or voiceover)
- [ ] Video uploaded (YouTube, Loom, or Vimeo)
- [ ] Video link added to README

---

## 📤 Submission Details

**What to submit:**
1. GitHub repository URL
2. Demo video URL (or indicate it's in README)
3. Brief description (1-2 paragraphs) highlighting key features

**Video hosting options:**
- YouTube (unlisted if you prefer)
- Loom (free, easy screen recording)
- Vimeo
- Direct upload if platform allows

**Timing:**
- Record video after implementing all improvements
- Test everything works before recording
- Keep video under 3 minutes (judges watch many submissions)

---

## 🎯 Success Metrics

You'll know your submission is strong if:
- ✅ Video clearly shows gitclaw running and catching vulnerabilities
- ✅ Judges can clone, run `npm install && npm run demo`, and see results
- ✅ README is easy to follow with clear value proposition
- ✅ Examples directory shows what output looks like
- ✅ GitHub Actions workflow demonstrates real-world integration
- ✅ Knowledge base shows depth (OWASP + CWE coverage)

**Good luck! 🚀**
