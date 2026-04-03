---
name: summarize-diff
description: "Explains what the change does in plain language for a human reviewer — intent, scope, and notable refactors. Use after ingest-pr when a high-level summary is needed."
license: MIT
metadata:
  version: "1.0.0"
  category: pr-review
---

# Summarize Diff

## Instructions

1. Read the normalized ingest output and/or the diff text.
2. Produce a **short TL;DR** (2–4 sentences) of **user-visible or behavior impact**.
3. List **key files** and their role in this PR.
4. Flag **ambiguous** changes (large deletes, renames mixed with edits) for careful review.

## Output format

```markdown
## TL;DR
...

## Files & roles
- `path` — ...

## Ambiguity / attention
- ...
```
