# 🎬 GitHub Actions Demo Guide

This guide shows **3 ways** judges and evaluators can see your PR-Review-Agent in action using GitHub Actions.

---

## 🚀 Method 1: On-Demand Demo (Recommended for Judges)

**Best for:** Judges who want to click one button and see it work

### How to Run

1. **Go to Actions tab:** https://github.com/mythili-ram/PR-Review-Agent/actions
2. **Select workflow:** "🎬 Live Demo (On-Demand)"
3. **Click "Run workflow"** button
4. **Choose fixture:**
   - `sample.patch` - Vulnerable code (2 critical issues)
   - `safe-pr.patch` - Clean code (should pass)
   - `docs-only.patch` - Documentation changes only
5. **Click green "Run workflow"** button
6. **Watch the demo run** (takes ~30 seconds)

### What You'll See

```
✅ Step 1: Validate GitAgent Structure
   - 5 skills detected
   - 2 tools detected
   - Structure: VALID

⚡ Step 2: Fast Heuristic Scan (0.1s)
   - 🔴 Critical: 2
   - 🟡 Warnings: 3
   - 📋 Verdict: REQUEST_CHANGES

🧠 Step 3: ML Anomaly Detection
   - Z-score analysis
   - Complexity metrics
   - Entropy detection

📊 Results Summary
   - Cost: $0.00 (no API calls)
   - Speed: 0.1 seconds
   - Coverage: OWASP Top 10
```

### Download Results

- Click on the completed workflow run
- Scroll to "Artifacts" section at bottom
- Download `demo-results-[fixture-name]`
- Unzip to see detailed JSON results

---

## 🔄 Method 2: Continuous Demo (Auto-Running)

**Best for:** Showing it works continuously

### How It Works

- **Automatically runs** on every push to main
- **Tests all 3 fixtures** in parallel
- **Runs daily** at 9 AM UTC to keep demo fresh
- **View results:** https://github.com/mythili-ram/PR-Review-Agent/actions/workflows/continuous-demo.yml

### Latest Run Badge

Add this to your README to show status:

```markdown
![Demo Status](https://github.com/mythili-ram/PR-Review-Agent/actions/workflows/continuous-demo.yml/badge.svg)
```

---

## 🔀 Method 3: Live PR Demo (Most Impressive)

**Best for:** Showing real-world integration

### Create a Demo PR

#### Step 1: Create Demo Branch

```bash
cd C:\Users\PREETHIG\PR-Review-Agent

# Create demo branch
git checkout -b demo/vulnerable-code

# Copy vulnerable code to demonstrate detection
echo "export const apiKey = 'sk-demo-vulnerable';" > demo-file.ts
git add demo-file.ts
git commit -m "demo: Add vulnerable code to trigger security scan"

# Push to GitHub
git push origin demo/vulnerable-code
```

#### Step 2: Open Pull Request

1. Go to https://github.com/mythili-ram/PR-Review-Agent/pulls
2. Click "New pull request"
3. Base: `main`, Compare: `demo/vulnerable-code`
4. Title: "🎬 Live Demo - Security Scan in Action"
5. Description:
   ```markdown
   ## 🎯 Demo Purpose

   This PR intentionally contains vulnerable code to demonstrate
   the PR-Review-Agent's detection capabilities.

   **What this shows:**
   - Automatic PR scanning
   - Critical issue detection
   - Review posted as comment
   - PR blocked on critical findings

   **Expected Results:**
   - 🔴 Hardcoded secret detected
   - 🔴 Verdict: REQUEST_CHANGES
   - 📝 Review comment with fix recommendations
   ```
6. Click "Create pull request"

#### Step 3: Watch the Magic

Within seconds:
- ✅ GitHub Actions starts automatically
- ⚡ Heuristic scan runs (0.1s)
- 🧠 ML analysis runs
- 📝 Review comment appears on PR
- 🔴 PR marked with security findings

#### Step 4: Show to Judges

**Share this URL:** `https://github.com/mythili-ram/PR-Review-Agent/pull/[NUMBER]`

Judges will see:
- Live workflow running
- Security findings in comments
- Check status at bottom
- Download artifacts

---

## 📹 Method 4: Record GitHub Actions as Video

### Option A: Screen Record the Workflow

1. **Trigger on-demand demo** (Method 1)
2. **Record screen** while workflow runs
3. **Show:**
   - Clicking "Run workflow"
   - Logs streaming
   - Results summary
   - Artifact download

### Option B: Record PR Creation

1. **Create demo PR** (Method 3)
2. **Record:**
   - Opening PR
   - Workflow starting
   - Comment appearing
   - Status checks

---

## 🎯 Best Demo Strategy for Hackathon

### Recommended Approach:

**1. Add Live Demo Badge to README**

```markdown
# 🤖 PR Review Agent

> AI-powered PR review that catches what humans miss

🎬 **[Try Live Demo →](https://github.com/mythili-ram/PR-Review-Agent/actions/workflows/demo-on-demand.yml)** ← Click "Run workflow"

![Demo Status](https://github.com/mythili-ram/PR-Review-Agent/actions/workflows/continuous-demo.yml/badge.svg)
```

**2. Create Demo PR and Pin It**

- Create PR with vulnerable code
- Keep it open (don't merge)
- Pin it so it stays at top
- Judges can see live results

**3. Record 2-Minute Video**

- Show on-demand demo running
- Show PR demo with comment
- Narrate what's happening

**4. In Submission Description**

```markdown
## 🎬 How to Demo

Three ways to see it in action:

1. **Click & Run:** [Live On-Demand Demo](https://github.com/mythili-ram/PR-Review-Agent/actions/workflows/demo-on-demand.yml)
   - Click "Run workflow"
   - Select fixture
   - Watch it scan in 30 seconds

2. **See Results:** [Continuous Demo Runs](https://github.com/mythili-ram/PR-Review-Agent/actions/workflows/continuous-demo.yml)
   - Runs automatically on every push
   - Download artifacts to see JSON results

3. **Live PR:** [Demo Pull Request #X](https://github.com/mythili-ram/PR-Review-Agent/pull/X)
   - See actual PR comment from agent
   - View workflow run
   - Download scan results
```

---

## 📊 What Judges Will See

### On-Demand Demo Output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP 1: Validate GitAgent Structure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

validate-structure: OK
  skills: ingest-pr, summarize-diff, security-pass, tests-and-risk, compose-review
  tools: read-diff-context, write-review-artifact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP 2: Fast Heuristic Security Scan
  • 15+ security patterns
  • OWASP Top 10 coverage
  • Zero API calls (completely offline)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "verdict": "REQUEST_CHANGES",
  "stats": {
    "critical": 2,
    "warning": 3
  },
  "findings": [
    {
      "severity": "CRITICAL",
      "rule_id": "secret-exposure",
      "cwe": "CWE-798",
      "message": "Hardcoded secret detected..."
    }
  ]
}

📊 RESULTS SUMMARY:
  🔴 Critical: 2
  🟡 Warnings: 3
  📋 Verdict: REQUEST_CHANGES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎯 DEMO COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Git-native agent (SOUL, RULES, skills all in git)
✓ OWASP Top 10 coverage with CWE mappings
✓ Fast offline scan (no API needed)
✓ ML-based anomaly detection
✓ Production-ready CI/CD integration

💰 Cost: $0.00 (heuristics) | $0.03 (with AI review)
⚡ Speed: 0.1 seconds (heuristics) | 5-10s (AI review)
```

---

## 🔧 Troubleshooting

### If Workflow Doesn't Appear

Make sure workflows are committed:
```bash
git add .github/workflows/
git commit -m "Add demo workflows"
git push origin main
```

### If "Run workflow" Button Missing

- Go to Settings → Actions → General
- Enable "Allow all actions and reusable workflows"
- Enable "Read and write permissions"

### If Workflow Fails

Check the logs:
1. Click on failed workflow run
2. Expand failed step
3. Read error message
4. Most common: `npm ci` failing (run `npm install` locally first)

---

## 🎓 Talking Points for Video

When recording, emphasize:

1. **"One-click demo"** - No setup needed
2. **"Runs in 30 seconds"** - Fast feedback
3. **"Zero cost"** - No API keys required for heuristics
4. **"Production-ready"** - Actually works in CI/CD
5. **"Download results"** - Get JSON for integration
6. **"Works on real PRs"** - Not just a toy

---

## ✅ Pre-Submission Checklist

Before submitting to hackathon:

- [ ] Push both workflow files to GitHub
- [ ] Test on-demand demo (click "Run workflow")
- [ ] Create demo PR and verify comment appears
- [ ] Add demo badge to README
- [ ] Record 2-minute video showing workflows
- [ ] Add demo instructions to submission description
- [ ] Test that artifacts download correctly

---

## 🏆 Why This Approach Wins

**Advantages over video-only:**

✅ **Interactive** - Judges can run it themselves
✅ **Verifiable** - Proves it actually works
✅ **Professional** - Shows CI/CD integration
✅ **Repeatable** - Can run multiple times
✅ **Transparent** - Full logs visible
✅ **Shareable** - Easy to link in submission

**Combined with video:**
- Video shows overview and context
- GitHub Actions proves it works
- Demo PR shows real integration
- On-demand lets judges experiment

---

## 📤 Next Steps

1. **Commit workflows:**
   ```bash
   git add .github/workflows/
   git commit -m "Add interactive GitHub Actions demos"
   git push origin main
   ```

2. **Test on-demand demo:**
   - Go to Actions tab
   - Run "🎬 Live Demo (On-Demand)"
   - Verify it works

3. **Create demo PR:**
   - Follow Method 3 steps
   - Keep PR open
   - Link in submission

4. **Update README:**
   - Add demo badge
   - Add "Try Live Demo" button
   - Link to PR demo

5. **Record video:**
   - Show clicking "Run workflow"
   - Show PR with comments
   - Narrate what's happening

**You're ready to submit!** 🚀
