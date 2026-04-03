---
name: compose-review
description: "Merges outputs from summarize-diff, security-pass, and tests-and-risk into a single PR review: Markdown + optional JSON. Enforces RULES.md verdict and tone."
license: MIT
allowed-tools: write-review-artifact
metadata:
  version: "1.0.0"
  category: pr-review
---

# Compose Review

## Instructions

1. Combine prior sections into one **coherent** review.
2. Apply **RULES.md**: never `APPROVE` with open CRITICAL security items; redact secrets.
3. Add **What's good** (at least one genuine positive if possible).
4. End with **Verdict** per rules: `REQUEST_CHANGES` | `COMMENT` | `APPROVE`.
5. Emit **JSON** with schema:
   - `verdict`, `summary`, `findings[]` `{ severity, file, line, message, rule_id }`, `tests`, `security`.

## Output

1. Human-readable **Markdown** (full review).
2. Machine-readable **JSON** in a fenced block or separate artifact path when using write-review-artifact.
