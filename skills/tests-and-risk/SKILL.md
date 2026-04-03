---
name: tests-and-risk
description: "Maps code changes to expected tests and flags coverage gaps; scores risk when prod paths change without tests. Use for any non-trivial PR."
license: MIT
metadata:
  version: "1.0.0"
  category: pr-review
---

# Tests and Risk

## Instructions

1. From the file list, infer **risky** areas: auth, payments, persistence, crypto, concurrency, public API.
2. For each changed source file, look for **paired** test files (e.g. `foo.test.ts`, `foo.spec.ts`, `__tests__/foo`, colocated `*.test.*`).
3. Report **gaps** explicitly: “`src/api/user.ts` changed; no test file referenced.”
4. Suggest **minimal** tests (cases or files) that would satisfy `knowledge/review-rubric.md`.

## Output format

```markdown
## Risk overview
**Level**: LOW | MEDIUM | HIGH
**Rationale**: ...

## Test coverage
| File | Test present? | Notes |
|------|---------------|-------|
| ... | Yes/No/Gap | ... |

## Suggested tests
- ...
```
