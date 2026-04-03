#!/usr/bin/env node
/**
 * Offline heuristic pass on a unified diff — demo helper (no LLM).
 * Usage: node scripts/local-heuristics.mjs [path/to/file.patch]
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const patchPath = process.argv[2] ?? join(__dirname, "..", "fixtures", "sample.patch");
const diff = readFileSync(patchPath, "utf8");

const findings = [];
const lines = diff.split("\n");

// Track file context for better reporting
let currentFile = null;
let lineNum = 0;
for (const line of lines) {
  lineNum++;
  if (line.startsWith("diff --git")) {
    currentFile = line.match(/b\/(.*?)$/)?.[1] || "unknown";
  }
}

// === CRITICAL SEVERITY ===

// 1. Secrets Detection (CWE-798)
const secretPatterns = [
  { pattern: /sk-[a-zA-Z0-9]{10,}/, name: "API key (sk- prefix)" },
  { pattern: /AKIA[0-9A-Z]{16}/, name: "AWS access key" },
  { pattern: /xox[baprs]-[0-9a-zA-Z-]{10,}/, name: "Slack token" },
  { pattern: /ghp_[0-9a-zA-Z]{36}/, name: "GitHub token" },
  { pattern: /github_pat_[0-9a-zA-Z_]{82}/, name: "GitHub PAT" },
  { pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/, name: "JWT token" },
  { pattern: /BEGIN (RSA |OPENSSH )?PRIVATE KEY/, name: "Private key" },
  { pattern: /"type":\s*"service_account"/, name: "GCP service account" },
  { pattern: /(postgres|mysql|mongodb):\/\/[^:]+:[^@]+@/, name: "Database URL with credentials" },
];

for (const { pattern, name } of secretPatterns) {
  if (pattern.test(diff)) {
    findings.push({
      severity: "CRITICAL",
      rule_id: "secret-exposure",
      category: "A02:2021 - Cryptographic Failures",
      cwe: "CWE-798",
      message: `${name} detected in diff — must not ship. Use environment variables + secret manager. Rotate if already committed.`,
    });
    break; // Only report once for secrets
  }
}

// Also check for common secret keywords
if (/\b(apiKey|API_KEY|api_key|secret|password|token|credentials)\s*[=:]\s*["'][^"']{8,}["']/i.test(diff)) {
  if (!findings.some(f => f.rule_id === "secret-exposure")) {
    findings.push({
      severity: "CRITICAL",
      rule_id: "secret-exposure",
      category: "A02:2021 - Cryptographic Failures",
      cwe: "CWE-798",
      message: "Hardcoded secret/credential detected — use env + secret manager.",
    });
  }
}

// 2. SQL Injection (CWE-89)
if (/SELECT[\s\S]{0,100}?\$\{[^}]+\}/i.test(diff) ||
    /SELECT\s+[\s\S]{0,100}?['"]?\s*\+\s*[^;]+/i.test(diff) ||
    /query\(["`']SELECT[\s\S]{0,100}?\$\{/i.test(diff)) {
  findings.push({
    severity: "CRITICAL",
    rule_id: "sql-injection",
    category: "A03:2021 - Injection",
    cwe: "CWE-89",
    message: "SQL built with string concatenation or template literals — use parameterized queries or ORM.",
  });
}

// 3. Command Injection (CWE-78)
if (/(exec|spawn|execSync|spawnSync)\s*\([^)]*\$\{|`[^`]*\$\{[^}]+\}[^`]*`[\s\S]{0,50}(exec|system)/i.test(diff)) {
  findings.push({
    severity: "CRITICAL",
    rule_id: "command-injection",
    category: "A03:2021 - Injection",
    cwe: "CWE-78",
    message: "Shell command built with template literals or unsanitized variables — sanitize input or use safe alternatives.",
  });
}

// 4. Code Injection (CWE-95)
if (/\beval\s*\(|\bnew\s+Function\s*\(/i.test(diff)) {
  findings.push({
    severity: "CRITICAL",
    rule_id: "code-injection",
    category: "A03:2021 - Injection",
    cwe: "CWE-95",
    message: "eval() or new Function() detected — arbitrary code execution risk. Use safer alternatives.",
  });
}

// 5. Path Traversal (CWE-22)
if (/\.\.[\/\\]|readFile\([^)]*\$\{|fs\.(read|write)[\s\S]{0,50}?(req\.|params\.|query\.)/i.test(diff)) {
  findings.push({
    severity: "CRITICAL",
    rule_id: "path-traversal",
    category: "A01:2021 - Broken Access Control",
    cwe: "CWE-22",
    message: "Path traversal pattern detected (../ or user input in file paths) — validate and sanitize file paths.",
  });
}

// === WARNING SEVERITY ===

// 6. XSS - dangerouslySetInnerHTML (CWE-79)
if (/dangerouslySetInnerHTML\s*=\s*\{\s*{?\s*__html:\s*[^}]*\}\s*}/i.test(diff)) {
  findings.push({
    severity: "WARNING",
    rule_id: "xss-dangerous-html",
    category: "A03:2021 - Injection",
    cwe: "CWE-79",
    message: "dangerouslySetInnerHTML detected — ensure content is sanitized (use DOMPurify). XSS risk.",
  });
}

// 7. Weak Crypto (CWE-327)
if (/createHash\s*\(\s*['"]md5['"]|createHash\s*\(\s*['"]sha1['"]/i.test(diff)) {
  findings.push({
    severity: "WARNING",
    rule_id: "weak-crypto",
    category: "A02:2021 - Cryptographic Failures",
    cwe: "CWE-327",
    message: "Weak hash algorithm (MD5/SHA1) — use SHA-256+ or bcrypt for passwords.",
  });
}

// 8. Insecure Random (CWE-330)
if (/Math\.random\(\)[\s\S]{0,50}(token|secret|id|key)/i.test(diff)) {
  findings.push({
    severity: "WARNING",
    rule_id: "insecure-random",
    category: "A02:2021 - Cryptographic Failures",
    cwe: "CWE-330",
    message: "Math.random() used for security-sensitive value — use crypto.randomBytes() or crypto.getRandomValues().",
  });
}

// 9. SSRF patterns (CWE-918)
if (/(fetch|axios|request)\s*\([^)]*\$\{|\.get\([^)]*req\.(query|params|body)/i.test(diff)) {
  findings.push({
    severity: "WARNING",
    rule_id: "ssrf-risk",
    category: "A10:2021 - SSRF",
    cwe: "CWE-918",
    message: "HTTP request with user-controlled URL detected — validate URLs against allowlist to prevent SSRF.",
  });
}

// 10. Missing CSRF protection (context-dependent)
if (/(app\.post|router\.post|@Post)\s*\([^)]*['"][^'"]*\/(?!api)[^'"]*['"]/i.test(diff) &&
    !/csrf|csurf/i.test(diff)) {
  findings.push({
    severity: "WARNING",
    rule_id: "missing-csrf",
    category: "A01:2021 - Broken Access Control",
    cwe: "CWE-352",
    message: "State-changing POST route may be missing CSRF protection — verify token validation exists.",
  });
}

// 11. Open Redirect (CWE-601)
if (/redirect\s*\([^)]*\$\{|redirect\s*\([^)]*req\.(query|params)/i.test(diff)) {
  findings.push({
    severity: "WARNING",
    rule_id: "open-redirect",
    category: "A01:2021 - Broken Access Control",
    cwe: "CWE-601",
    message: "Redirect with user input — validate against allowlist to prevent open redirect attacks.",
  });
}

// 12. Insecure Deserialization (CWE-502)
if (/JSON\.parse\([^)]*req\.(body|cookies)|pickle\.loads\(|unserialize\(/i.test(diff)) {
  findings.push({
    severity: "WARNING",
    rule_id: "insecure-deserialization",
    category: "A08:2021 - Software and Data Integrity",
    cwe: "CWE-502",
    message: "Deserializing untrusted data — validate schema or use safe parsing (zod, ajv).",
  });
}

// === SUGGESTION SEVERITY ===

// 13. Console.log in production code
if (/\bconsole\.log\(/i.test(diff) && !/test|spec|fixture/i.test(patchPath)) {
  findings.push({
    severity: "SUGGESTION",
    rule_id: "console-log",
    category: "A09:2021 - Logging Failures",
    message: "console.log() detected — use structured logger (winston, pino) for production.",
  });
}

// 14. Missing error handling
if (/(fetch|axios|query|exec)\([^)]*\)[\s\S]{0,50}?;?\s*$(?![\s\S]{0,100}(catch|try|\.catch|\.then))/m.test(diff)) {
  findings.push({
    severity: "SUGGESTION",
    rule_id: "missing-error-handling",
    message: "Async operation may be missing error handling — add try/catch or .catch().",
  });
}

// 15. Missing input validation
if (/(req\.body|req\.query|req\.params)[\s\S]{0,100}?(?!validate|sanitize|check|typeof)/i.test(diff)) {
  findings.push({
    severity: "SUGGESTION",
    rule_id: "missing-input-validation",
    category: "A03:2021 - Injection",
    message: "User input used without visible validation — add input sanitization (express-validator, zod).",
  });
}

// === STATISTICS ===
const stats = {
  total: findings.length,
  critical: findings.filter(f => f.severity === "CRITICAL").length,
  warning: findings.filter(f => f.severity === "WARNING").length,
  suggestion: findings.filter(f => f.severity === "SUGGESTION").length,
};

// Determine verdict
let verdict = "APPROVE";
if (stats.critical > 0) {
  verdict = "REQUEST_CHANGES";
} else if (stats.warning > 0 || stats.suggestion > 0) {
  verdict = "COMMENT";
}

const out = {
  fixture: patchPath,
  verdict,
  stats,
  findings,
  metadata: {
    heuristic_version: "2.0.0",
    scanned_at: new Date().toISOString(),
    coverage: "OWASP Top 10 (2021), Common CWEs, Framework patterns",
  },
};

console.log(JSON.stringify(out, null, 2));
