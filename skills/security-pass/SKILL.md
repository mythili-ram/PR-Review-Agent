---
name: security-pass
description: "Heuristic security and safety review of the diff — secrets, injection, unsafe process/exec, auth/cookie mistakes. Cross-check findings with knowledge/security-patterns.md."
license: MIT
metadata:
  version: "1.0.0"
  category: pr-review
---

# Security Pass

## Instructions

1. Scan the diff for patterns in `knowledge/security-patterns.md` (extend mentally with OWASP-style issues relevant to the stack).
2. For each hit, assign **severity** `CRITICAL` | `WARNING` | `INFO` and cite **file + line or hunk**.
3. **Redact** secret values in output; never echo API keys or tokens.
4. If no issues, state **No security findings** with one sentence on coverage limits (heuristics, not formal verification).

## Output format

```markdown
## Security findings

### CRITICAL
- ...

### WARNING
- ...
```
