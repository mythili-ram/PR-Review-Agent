#!/usr/bin/env node
/**
 * Format heuristic scan results into a markdown PR review comment
 * Usage: node scripts/format-heuristics-review.mjs [path/to/heuristic-results.json]
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const heuristicsPath = process.argv[2] ?? "heuristic-results.json";
const heuristics = JSON.parse(readFileSync(heuristicsPath, "utf8"));

const verdict = heuristics.verdict || "COMMENT";
const stats = heuristics.stats || { critical: 0, warning: 0, suggestion: 0, total: 0 };
const findings = heuristics.findings || [];

// Build the markdown review
let markdown = `## 🤖 AI-Powered PR Review

### Summary
This automated review detected **${stats.total}** potential issues in your pull request.

### Verdict: **${verdict}**
`;

if (verdict === "REQUEST_CHANGES") {
  markdown += `❌ **This PR cannot be merged** - Critical security issues must be addressed.\n`;
} else if (verdict === "COMMENT") {
  markdown += `⚠️ **This PR needs review** - Please address the warnings and suggestions below.\n`;
} else {
  markdown += `✅ **No critical issues found** - Safe to merge.\n`;
}

markdown += `
### Statistics
| Severity | Count |
|----------|-------|
| Critical | ${stats.critical} |
| Warning | ${stats.warning} |
| Suggestion | ${stats.suggestion} |
| **Total** | **${stats.total}** |

`;

if (findings.length > 0) {
  markdown += `### Findings\n\n`;
  
  for (const finding of findings) {
    const icon = finding.severity === "CRITICAL" ? "🔴" : finding.severity === "WARNING" ? "🟡" : "💡";
    const cweTag = finding.cwe ? ` \`${finding.cwe}\`` : "";
    const categoryTag = finding.category ? ` • ${finding.category}` : "";
    
    markdown += `${icon} **${finding.severity}: ${finding.rule_id}**${cweTag}${categoryTag}\n`;
    markdown += `> ${finding.message}\n\n`;
  }
}

markdown += `### How to Fix
1. Review each finding above
2. Make code changes to resolve critical issues
3. For warnings and suggestions, consider best practices
4. Commit and push your changes
5. This review will update automatically

---
*Powered by pr-review-agent | Model: anthropic:claude-sonnet-4-5 | Review ID: ${process.env.GITHUB_RUN_ID || 'N/A'}*
`;

console.log(markdown);
