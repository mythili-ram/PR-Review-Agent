# 🤖 PR Review Agent (GitAgent)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![GitAgent](https://img.shields.io/badge/GitAgent-v0.1.0-blue)](https://github.com/open-gitagent/gitagent)
[![Hackathon](https://img.shields.io/badge/Hackathon-GitAgent-orange)](https://hackculture.io/hackathons/gitagent-hackathon)

> **AI-powered PR review that catches what humans miss** — hardcoded secrets, SQL injection, missing tests, and more. Defined in git, runs with gitclaw, integrates anywhere.

Git-native agent definition for **policy-aware pull request review**: ingest diff → summarize → security pass → test gaps → composed report (Markdown + JSON).

---

## ⚡ **Judge Quick Start** (60 seconds)

```bash
# Clone and install
git clone https://github.com/mythili-ram/PR-Review-Agent.git
cd PR-Review-Agent
npm install

# Run offline security scan (no API key needed)
npm run heuristics
# ✓ Detects SQL injection, hardcoded secrets, XSS in 0.1 seconds

# Optional: Full AI review (requires API key)
cp .env.example .env
# Edit .env with your Anthropic API key from https://console.anthropic.com/
npm run demo
# ✓ Complete review with severity ratings, CWE mappings, and actionable recommendations
```

**That's it.** Check `docs/examples/REVIEW.md` for sample output.

### 🏆 **What Makes This Different**

Not just another PR bot — this agent **learns from YOUR git history**:

- ✅ **Git-Native Memory** - References past PRs, commit history, and team decisions in [`memory/`](./memory/)
- ✅ **Self-Improving** - Proposes rule updates via PRs when it finds gaps ([`propose-rule-update`](./skills/propose-rule-update/SKILL.md))
- ✅ **Historical Context** - Cites specific commits where similar issues occurred before
- ✅ **Team-Specific** - Learns conventions from YOUR codebase, not generic rules

**Demo Features:**

- [`learn-from-history`](./skills/learn-from-history/SKILL.md) skill checks [`memory/previous-violations.md`](./memory/previous-violations.md) for patterns
- References commit hashes and PR numbers in findings
- Proposes adding new patterns to memory when detected 3+ times

---

## 🎯 What This Does

**Before this agent:**
```javascript
// ❌ This would slip through manual review
const query = `SELECT * FROM users WHERE id = '${userId}'`;
export const apiKey = "sk-ant-secret-123...";
```

**With this agent:**
```
🔴 CRITICAL: SQL injection vulnerability detected (CWE-89)
🔴 CRITICAL: Hardcoded API key must not ship (CWE-798)
💡 SUGGESTION: Missing test coverage for new endpoint
Verdict: REQUEST_CHANGES
```

### Key Features

- ✅ **OWASP Top 10 Coverage** - Detects injection, broken auth, sensitive data exposure
- ✅ **Dual Analysis** - Fast heuristics (no LLM) + deep AI review (contextual)
- ✅ **Git-Native** - Agent behavior is versioned code (SOUL, RULES, skills, knowledge)
- ✅ **CI/CD Ready** - GitHub Actions workflow included, works in any pipeline
- ✅ **Structured Output** - Both human-readable Markdown and machine-readable JSON
- ✅ **Customizable** - Add your team's rules to `knowledge/` directory

## 📊 Detection Coverage

| Category | Patterns Detected | Example Vulnerabilities |
|----------|-------------------|-------------------------|
| **Secrets** | API keys, AWS credentials, private keys, JWTs | Hardcoded passwords, leaked tokens |
| **Injection** | SQL, Command, Code, NoSQL, LDAP | `SELECT * WHERE id='${input}'` |
| **XSS** | dangerouslySetInnerHTML, innerHTML | Unsanitized user content |
| **Crypto Failures** | Weak algorithms (MD5, SHA1), Math.random() | Predictable tokens, weak hashing |
| **Access Control** | Path traversal, IDOR, missing authz | `../../../etc/passwd` |
| **SSRF** | Unvalidated HTTP requests | Fetching user-provided URLs |
| **Deserialization** | unsafe JSON.parse, eval() | Remote code execution |

**Plus:** Missing tests, console.log in production, missing error handling, and more.

## 🚀 Quick Start

### Requirements

- [Node.js](https://nodejs.org/) 18+
- API key from [Anthropic](https://console.anthropic.com/) (for AI review) or other providers supported by [gitclaw](https://github.com/open-gitagent/gitclaw)

### Installation

```bash
git clone https://github.com/your-org/pr-review-agent.git
cd pr-review-agent
npm install
npm run validate  # Validate agent structure
```

### Setup API Key

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your Anthropic API key
# Get one at: https://console.anthropic.com/
```

**⚠️ Never commit `.env` to git** - it's already in `.gitignore`.

### Run Your First Review

```bash
# Fast offline scan (no LLM needed)
npm run heuristics

# Full AI-powered review with gitclaw
npm run demo
```

## 📖 Usage


### Local Review with gitclaw

`agent.yaml` uses **provider:model** ids (e.g. `anthropic:claude-sonnet-4-5-20250929`) as required by [gitclaw](https://github.com/open-gitagent/gitclaw).

**Recommended (local only):** copy the example env file, add your key, and keep `.env` out of git (it is listed in `.gitignore`).

```bash
# Windows PowerShell (repo root)
Copy-Item .env.example .env
# Edit .env and set ANTHROPIC_API_KEY=... from https://console.anthropic.com/
npm install
npm run gitclaw:help
```

Alternatively set the variable for one session:

```powershell
$env:ANTHROPIC_API_KEY = "your-key"
npx gitclaw --help
```

**Do not commit `.env` or paste API keys into the README or issues.** If a key was ever exposed, revoke it in the console and create a new one.

Point gitclaw at this directory as the agent repo and run a review (see [gitclaw README](https://github.com/open-gitagent/gitclaw) for CLI/SDK).

### Validate the agent layout

```bash
npm run validate
```

This runs a **structural** check (required files, skills, tools). To try the official CLI when available:

```bash
npm run validate:gitagent
npm run info
npm run export:prompt
```

## Repository layout

| Path | Purpose |
|------|---------|
| `agent.yaml` | Manifest, model, skills, tools |
| `SOUL.md` | Persona and tone |
| `RULES.md` | Hard constraints for approvals and safety |
| `skills/*` | Focused capabilities (one job per skill) |
| `tools/*.yaml` | Tool schemas for diff context and review artifacts |
| `knowledge/` | Rubric and security pattern hints |
| `fixtures/` | Sample patch for demos |

## Local heuristics (demo without LLM)

Optional static checks on a unified diff:

```bash
npm run heuristics
# or: node scripts/local-heuristics.mjs fixtures/sample.patch
```

## 📺 Demo & Examples

### Hackathon Demo

The sample “PR” is **`fixtures/sample.patch`** (hardcoded key + SQL injection intentionally added). Full step-by-step script, video outline, and judging tips: **[DEMO.md](./DEMO.md)**.

```bash
npm run validate   # Validate agent structure
npm run heuristics # Fast offline scan (0.1s, no API calls)
npm run demo       # Full AI review with gitclaw
```

### Example Outputs

See `docs/examples/` for:
- **[REVIEW.md](./docs/examples/REVIEW.md)** - Human-readable review with actionable recommendations
- **[review.json](./docs/examples/review.json)** - Machine-readable findings for CI/CD integration

### Additional Test Cases

- `fixtures/safe-pr.patch` - Clean code, should get `APPROVE` verdict
- `fixtures/docs-only.patch` - Documentation changes, should get `COMMENT` or `APPROVE`

## 🔧 CI/CD Integration

### GitHub Actions

Copy `.github/workflows/pr-review.yml` to your repo:

```yaml
- name: AI-Powered PR Review
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: npx gitclaw -d path/to/pr-review-agent -p “Review this PR”
```

Add `ANTHROPIC_API_KEY` to your repo secrets: Settings → Secrets → New repository secret

### GitLab CI / Jenkins / CircleCI

Similar setup - see `.github/workflows/pr-review.yml` for reference. The agent works anywhere gitclaw runs.

## 🎨 Customization

### Add Your Team's Rules

1. **Security patterns**: Edit `knowledge/security-patterns.md`
2. **Review rubric**: Edit `knowledge/review-rubric.md`
3. **Heuristics**: Add checks to `scripts/local-heuristics.mjs`

Skills automatically incorporate updated knowledge.

### Adjust Agent Behavior

- **Model**: Change `model.preferred` in `agent.yaml`
- **Tone**: Edit `SOUL.md` (current: senior engineer, direct & helpful)
- **Constraints**: Edit `RULES.md` (e.g., never approve with critical issues)

## 📈 Performance

| Metric | Value |
|--------|-------|
| **Heuristic scan** | ~0.1s (15 patterns, no API calls) |
| **AI review** | ~5-10s (depends on model & diff size) |
| **Token usage** | ~3-8K tokens for typical PR |
| **Cost per review** | ~$0.02-0.05 (Claude Sonnet 4.5) |

Compare to 15-30 minutes of human review time.

## 🏆 Why This Wins Hackathons

1. **Practical Value** - Solves real problems (hardcoded secrets, SQL injection)
2. **Working Demo** - Not just slides, actually runs and catches vulnerabilities
3. **Git-Native Design** - Agent is defined as code, versioned, reviewable
4. **Comprehensive** - OWASP Top 10 coverage, CWE mappings, framework checks
5. **Production-Ready** - CI/CD workflow included, structured outputs
6. **Extensible** - Easy to add custom rules for your org

## 🤝 Contributing

This is a hackathon project, but improvements welcome:

1. Fork the repo
2. Create a feature branch
3. Add tests if adding heuristics
4. Submit a PR

## 📚 References

- [GitAgent Specification](https://github.com/open-gitagent/gitagent)
- [gitclaw Runtime](https://github.com/open-gitagent/gitclaw)
- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

## 📄 License

MIT — see [LICENSE](LICENSE).

---

**Made for the GitAgent Hackathon 2025** | [View Demo](./DEMO.md) | [See Examples](./docs/examples/)
