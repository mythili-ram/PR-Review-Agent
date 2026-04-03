# 🎬 GitHub Actions Demo Guide

**How to demo PR Guardian in GitHub Actions for judges**

---

## 🎯 Two Demo Options

### **Option 1: Automatic PR Review (Recommended)**
Shows agent automatically reviewing PRs in CI/CD

### **Option 2: Manual Trigger Demo**
Shows agent on-demand with sample vulnerabilities

---

## 🚀 **Option 1: Automatic PR Review Demo**

### **Setup (One-time)**

This workflow runs automatically on every PR. Already configured in `.github/workflows/pr-review.yml`

### **How to Demo:**

#### **Step 1: Create a Test PR**

```bash
# Create a new branch with intentional vulnerability
git checkout -b demo/test-vulnerability

# Add a file with SQL injection
cat > test-security.js << 'EOF'
// Intentional vulnerability for demo
function searchUsers(name) {
  const query = `SELECT * FROM users WHERE name = '${name}'`;
  return db.query(query);
}

const API_KEY = "sk-live-12345abcdef";  // Hardcoded secret
EOF

git add test-security.js
git commit -m "test: add search function (intentional vulnerability for demo)"
git push origin demo/test-vulnerability
```

#### **Step 2: Open PR**

```bash
# Using GitHub CLI
gh pr create \
  --title "test: Add user search feature" \
  --body "Demo PR to showcase PR Guardian's capabilities"

# Or manually at:
# https://github.com/mythili-ram/PR-Review-Agent/compare/main...demo/test-vulnerability
```

#### **Step 3: Watch the Magic**

1. **Go to PR page** - See "Checks" tab
2. **Watch workflows run:**
   - ⚡ Fast Security Scan (~10 seconds)
   - 🧪 Validate GitAgent Structure (~5 seconds)

3. **See automatic comment** posted by PR Guardian:
   ```markdown
   ## 🤖 PR Guardian Review

   Verdict: REQUEST_CHANGES
   Security Scan: 2 critical, 0 warnings, 3 total findings

   ### 🔍 Findings

   #### CRITICAL: sql-injection
   - Category: A03:2021 - Injection
   - CWE: CWE-89
   - Issue: SQL built with string concatenation - use parameterized queries

   #### CRITICAL: secret-exposure
   - Category: A02:2021 - Cryptographic Failures
   - CWE: CWE-798
   - Issue: Hardcoded secret/credential detected

   ### 🧠 Historical Context
   [Shows memory system, past violations, self-improvement capability]
   ```

4. **Check fails** - PR blocked due to critical issues ✅

#### **Step 4: Show to Judges**

Point judges to:
- **PR page:** Shows automated review comment
- **Actions tab:** Shows workflow execution logs
- **Checks tab:** Shows security scan results

**Key talking points:**
- ⚡ "Scan completes in 0.1 seconds - no API calls"
- 🧠 "Agent references past violations from git history"
- 🔄 "If same issue found 3x, proposes PR to update rules"
- 🚫 "Blocks merge automatically on critical issues"

---

## 🎬 **Option 2: Manual Trigger Demo**

### **Best for: Live presentations without creating PRs**

#### **Step 1: Trigger Workflow**

**On GitHub:**
1. Go to: https://github.com/mythili-ram/PR-Review-Agent/actions
2. Click "🎬 Demo for Judges - Manual Trigger"
3. Click "Run workflow" → "Run workflow"

**Using GitHub CLI:**
```bash
gh workflow run "demo-for-judges.yml"
```

#### **Step 2: Watch Execution**

1. Click on the running workflow
2. Expand "🤖 PR Guardian Demo" job
3. Watch each step execute:
   - Shows agent structure (7 skills)
   - Shows git-native memory samples
   - Shows self-improvement capability
   - Runs heuristic scan on sample vulnerability
   - Shows detection coverage (OWASP, CWE)
   - Summarizes key differentiators

#### **Step 3: Review Output**

**What judges will see:**

```
═══════════════════════════════════════════════════════════
🏆 PR Guardian - GitAgent Hackathon 2026
═══════════════════════════════════════════════════════════

📂 Agent Structure:
validate-structure: OK
  skills: ingest-pr, learn-from-history, summarize-diff, 
          security-pass, tests-and-risk, compose-review, 
          propose-rule-update
  tools: read-diff-context, write-review-artifact

═══════════════════════════════════════════════════════════
🧠 Git-Native Memory System
═══════════════════════════════════════════════════════════

📄 Sample from previous-violations.md:
### SQL Injection
**PR #103** - commit 9c4e1f3
**Pattern:** Template literals in database queries
**Impact:** Potential data breach
**Prevention:** Auto-rejects template literals in SQL

═══════════════════════════════════════════════════════════
⚡ Fast Heuristic Scan (0.1 seconds, no API key)
═══════════════════════════════════════════════════════════

🔍 Scanning: fixtures/sample.patch

{
  "verdict": "REQUEST_CHANGES",
  "stats": {
    "total": 4,
    "critical": 3,
    "warning": 0
  },
  "findings": [...]
}

✅ Scan complete - see detected vulnerabilities above
```

---

## 📊 **What Makes This Demo Powerful**

### **For Judges:**

1. **Zero Setup** - Just click "Run workflow" button
2. **Visual Proof** - See agent actually working
3. **Performance Metrics** - 0.1s scan time displayed
4. **Memory System** - Shows git-native memory files
5. **Self-Improvement** - Shows propose-rule-update skill
6. **Detection Coverage** - Lists OWASP/CWE patterns

### **Key Differentiators Highlighted:**

✅ **Git-Native Memory**
- Shows actual memory files with past violations
- Demonstrates learning from git history

✅ **Self-Improving**
- Shows skill that proposes PRs to update rules
- Explains 3x threshold mechanism

✅ **Production-Ready**
- Blocks PRs automatically on critical issues
- Posts formatted comments with findings
- Works in standard GitHub Actions workflow

---

## 🎯 **Judge Talking Points**

### **When demoing Option 1 (Auto PR Review):**

> "This agent runs automatically on every PR. Watch - I'll push code with SQL injection and a hardcoded secret. Within 10 seconds, it detects both, posts a detailed review comment, and blocks the merge. But the magic is *how* it detects them..."

> "See this comment? It's not just finding vulnerabilities - it's referencing our *git history*. If we had the same SQL injection in PR #123 six months ago, it would cite that commit hash here. That's git-native memory - no other PR bot does this."

> "And here's the killer feature: If this agent finds SQL injection 3 times, it automatically proposes a PR to add that pattern to its memory. Human reviews and approves it like any code change. The agent evolves *through git*, not through some black-box model update."

### **When demoing Option 2 (Manual Trigger):**

> "Let me show you what's under the hood. I'll trigger this workflow that walks through the agent's capabilities..."

> "First, see the structure - 7 skills, including 2 we built specifically for this hackathon: `learn-from-history` and `propose-rule-update`. No other GitAgent entry has these."

> "Here's the memory system - actual files versioned in git. This is where past violations live. When the agent reviews new code, it cross-references against these patterns."

> "Watch the scan - it completes in 0.1 seconds and catches both vulnerabilities. No API calls, pure pattern matching. Then the AI does deep contextual analysis if needed."

> "The output shows OWASP and CWE mappings - this isn't just flagging issues, it's providing security intelligence teams can use for compliance reporting."

---

## 📝 **Demo Checklist**

Before presenting to judges:

### **Pre-Demo:**
- [ ] Workflow files are committed and pushed
- [ ] At least one successful workflow run exists (for credibility)
- [ ] `fixtures/sample.patch` contains clear vulnerabilities
- [ ] Memory files are populated with examples

### **During Demo:**
- [ ] Show workflow execution in real-time (don't use old runs)
- [ ] Point out 0.1s scan time
- [ ] Highlight git-native memory samples
- [ ] Explain self-improvement mechanism
- [ ] Show how it blocks PRs automatically

### **After Demo:**
- [ ] Share workflow URL with judges
- [ ] Point to JUDGE-PITCH.md for details
- [ ] Offer to run on their test code (if time permits)

---

## 🔗 **Quick Links for Judges**

Share these URLs:

**Workflows:**
- Auto PR Review: `https://github.com/mythili-ram/PR-Review-Agent/actions/workflows/pr-review.yml`
- Manual Demo: `https://github.com/mythili-ram/PR-Review-Agent/actions/workflows/demo-for-judges.yml`

**Example PR with Review:**
- Create a test PR and share URL

**Documentation:**
- Quick Start: [README.md](./README.md)
- Judge Guide: [JUDGE-PITCH.md](./JUDGE-PITCH.md)
- Memory System: [memory/MEMORY.md](./memory/MEMORY.md)

---

## 💡 **Tips for Maximum Impact**

### **Do:**
- ✅ Run demo live during presentation
- ✅ Point out 0.1-second scan time
- ✅ Show memory files in browser
- ✅ Explain self-improvement via PRs
- ✅ Demonstrate PR blocking on critical issues

### **Don't:**
- ❌ Pre-record or use screenshots (live is more impressive)
- ❌ Skip explaining git-native memory (it's the key differentiator)
- ❌ Forget to mention no API key needed for heuristics
- ❌ Rush through self-improvement explanation

---

## 🏆 **Why This Demo Wins**

**Judges evaluate projects on:**
1. **Agent Quality** - Clear identity, strong SOUL/RULES
2. **Skill Design** - Novel git-native skills
3. **Working Demo** - Actually runs and works
4. **Innovation** - Memory + self-improvement

**This GitHub Actions demo proves all four:**

✅ **Agent Quality** - Validation workflow confirms structure  
✅ **Skill Design** - Shows 7 skills including 2 novel ones  
✅ **Working Demo** - Runs in real-time, detects real issues  
✅ **Innovation** - Memory system + self-improvement visible

**No other entry will have this level of polish.**

---

## 🚀 **Ready to Demo?**

1. Commit and push the workflows
2. Practice both demo options
3. Prepare 2-minute pitch from JUDGE-PITCH.md
4. Have workflow URLs ready to share

**You've got this!** 🏆

---

*Last updated: 2026-04-03*  
*For questions, see JUDGE-PITCH.md or UPGRADE-SUMMARY.md*
