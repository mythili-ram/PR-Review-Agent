# 🎥 Video Demo Recording Guide

## ⚡ Quick Start (Windows)

### 1. Setup (2 minutes)
```bash
# Navigate to the repository
cd C:\Users\PREETHIG\PR-Review-Agent

# Install dependencies (if not done)
npm install

# Optional: Setup API key for full AI review
copy .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 2. Run Quick Demo
```bash
# Double-click or run from command prompt:
QUICK-DEMO.bat
```

This will walk through all demo steps with pauses.

---

## 📹 Recording Steps

### Option 1: Use OBS Studio (Free, Professional)

1. **Download OBS:** https://obsproject.com/download
2. **Setup:**
   - Source: Display Capture (full screen) or Window Capture (terminal only)
   - Settings → Video → Base Resolution: 1920x1080
   - Settings → Output → Recording Quality: High Quality, Medium File Size

3. **Record:**
   - Start Recording (or F12)
   - Run QUICK-DEMO.bat
   - Narrate as commands run
   - Stop Recording (F12)

4. **Output:** Videos saved to `C:\Users\[Username]\Videos\`

### Option 2: Use Loom (Easiest)

1. **Install:** https://www.loom.com/download
2. **Click** Loom icon in taskbar
3. **Select:** Screen + Camera or Screen Only
4. **Record** and narrate
5. **Share** link automatically generated

### Option 3: Xbox Game Bar (Built-in Windows)

1. Press `Win + G`
2. Click Record button
3. Run demo
4. Press `Win + Alt + R` to stop
5. Videos in `C:\Users\[Username]\Videos\Captures\`

---

## 🎬 Video Script (3 Minutes)

### Scene 1: Introduction (30 seconds)
**[Face camera or voiceover]**

"Hi, I'm [name], and this is my GitAgent Hackathon submission. Manual PR reviews miss critical security issues. This agent catches hardcoded secrets, SQL injection, and OWASP Top 10 vulnerabilities automatically. It's defined in git, runs with gitclaw, and integrates with CI/CD. Let me show you."

### Scene 2: Show Vulnerable Code (30 seconds)
**[Terminal]**

```bash
type fixtures\sample.patch
```

**[Say]**
"Here's a sample PR with two critical vulnerabilities intentionally added for demo: a hardcoded API key and SQL injection. Let's see if the agent catches them."

### Scene 3: Fast Scan (45 seconds)
**[Terminal]**

```bash
npm run heuristics
```

**[Say while running]**
"First, the fast heuristic scan. This runs 15+ security patterns with zero API calls. It's completely offline."

**[Point to output]**
"Look at that - it found 3 critical issues in 0.1 seconds, including our hardcoded secret and SQL injection, both with CWE mappings and OWASP categories."

### Scene 4: ML Analysis (30 seconds)
**[Terminal]**

```bash
npm run ml:analyze -- fixtures/sample.patch
```

**[Say]**
"The ML layer uses Z-score statistical analysis to detect unusual code patterns like high complexity, deep nesting, or code obfuscation. This sample is simple, so no anomalies detected."

### Scene 5: Dashboard (Optional, 30 seconds)
**[Terminal + Browser]**

```bash
npm run dashboard
```

**[Open browser to http://localhost:3000]**

"Here's the web dashboard showing review history, statistics, and which repositories have the most issues. It's mobile-responsive and updates in real-time."

### Scene 6: CI/CD Integration (20 seconds)
**[Show .github/workflows/pr-review.yml file]**

```bash
type .github\workflows\pr-review.yml
```

**[Say]**
"Here's the GitHub Actions workflow. Drop this into any repository and it automatically scans every PR, posts review comments, and blocks merges on critical issues."

### Scene 7: Closing (15 seconds)
**[Face camera or terminal]**

"To recap: Git-native agent definition, catches OWASP Top 10 vulnerabilities, runs in under 10 seconds, costs $0.03 per review, and integrates with CI/CD. The agent is code - version it, review it, extend it. Check out the repo at github.com/mythili-ram/PR-Review-Agent. Thanks for watching!"

---

## 🎯 Talking Points Checklist

While recording, emphasize:

- ✅ "Two critical issues in 0.1 seconds"
- ✅ "Zero API calls for heuristics"
- ✅ "OWASP Top 10 and CWE mappings"
- ✅ "Costs $0.03 vs 30 minutes of engineer time"
- ✅ "Git-native design - agent behavior is versioned code"
- ✅ "Multi-AI provider support"
- ✅ "Production-ready CI/CD workflow"

---

## ✅ Pre-Recording Checklist

- [ ] Terminal font size: 18-20pt
- [ ] Terminal theme: High contrast (dark with bright text)
- [ ] Close unnecessary windows/tabs
- [ ] Disable notifications (Focus Assist on Windows)
- [ ] Test all commands work:
  ```bash
  npm run validate
  npm run heuristics
  npm run ml:analyze -- fixtures/sample.patch
  ```
- [ ] Optional: Test `npm run dashboard` (requires `npm install` first)
- [ ] Prepare notes/script on second monitor or paper
- [ ] Check microphone audio level

---

## 📤 After Recording

### 1. Upload Video
**YouTube (Recommended):**
- Go to https://youtube.com/upload
- Upload video
- Set to "Unlisted" (not public, but shareable via link)
- Title: "PR-Review-Agent - GitAgent Hackathon 2026 Demo"
- Description: Brief overview + repo link
- Copy share link

**Loom:**
- Automatically uploads after recording
- Copy share link

### 2. Add to README
Edit `README.md` and add video link at the top:

```markdown
# 🤖 PR Review Agent (GitAgent)

> **AI-powered PR review that catches what humans miss** — hardcoded secrets, SQL injection, missing tests, and more.

🎥 **[Watch 3-Minute Demo →](YOUR_VIDEO_LINK_HERE)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
...
```

### 3. Submit to Hackathon
- Repository URL: https://github.com/mythili-ram/PR-Review-Agent
- Video URL: [Your YouTube/Loom link]
- Brief description: "AI-powered security-focused PR review agent with OWASP Top 10 coverage, ML anomaly detection, multi-AI provider support, and CI/CD integration"

---

## 🎨 Bonus: Add Screenshots

Take screenshots of:
1. Terminal output showing critical findings
2. Dashboard UI (http://localhost:3000)
3. GitHub PR comment example

Add to README:

```markdown
## 📸 Screenshots

### Dashboard
![Dashboard](docs/images/dashboard.png)

### Terminal Output
![Terminal](docs/images/terminal.png)
```

---

## 🚀 You're Ready!

Everything is set up and working. Just:
1. Record your 3-minute video following the script
2. Upload to YouTube/Loom
3. Add link to README
4. Submit to hackathon

**Good luck! Your solution is solid and demo-ready.** 🏆
