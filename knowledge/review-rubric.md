# Review rubric

Use this to score the PR and justify **Verdict**.

## Blocking (REQUEST_CHANGES)

- Security: injection, auth bypass, secret exposure, unsafe deserialization.
- Data loss: migrations without rollback strategy when risky.
- Breaking public API without version bump or migration notes (if applicable).

## Non-blocking but important (COMMENT)

- Missing tests for changed behavior on high-risk paths.
- Error handling gaps on external I/O.
- Observability: new failures without logging or metrics hooks.

## Suggestions (SUGGESTION)

- Naming, small refactors, duplication.
- Performance nits without proven hotspot.

## Approve when

- No open CRITICAL issues.
- Test gaps are acceptable for trivial changes (docs-only, typo) or explicitly out of scope.
