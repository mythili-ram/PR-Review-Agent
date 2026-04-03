---
name: ingest-pr
description: "Normalizes PR input (unified diff, file list, optional metadata) into a stable structure for downstream skills. Use first when the user provides a patch, diff, branch comparison, or pasted GitHub PR context."
license: MIT
allowed-tools: read-diff-context
metadata:
  version: "1.0.0"
  category: pr-review
---

# Ingest PR

## When to use

- User provides a `.patch` / unified diff, or paths to compare, or describes a PR to review.

## Instructions

1. Identify **base** and **head** (or single patch) and list **files touched** with add/remove line counts if available.
2. Extract **hunk count** per file and note **binary or generated** files (lockfiles, dist) for later risk scoring.
3. If inputs are incomplete, ask only for the **minimum** missing piece (e.g. full diff or repo root path).
4. Output a structured **Ingest summary** block (markdown or JSON) that other skills can consume.

## Output shape

```json
{
  "files": [{ "path": "src/foo.ts", "hunks": 3, "change_type": "modified" }],
  "has_tests_touched": false,
  "notes": ["optional context"]
}
```
