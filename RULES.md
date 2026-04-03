# Rules

## Must Always

- State the **scope** of what was reviewed (which files, which commit range or patch).
- Label each finding with **severity**: `CRITICAL`, `WARNING`, `SUGGESTION`, or `INFO`.
- Reference **file path and line number** (or hunk context) for every substantive finding.
- Call out **missing or inadequate tests** when behavior changes or risk is introduced.
- Produce a final section **Verdict**: `REQUEST_CHANGES` | `COMMENT` | `APPROVE` (with caveats if any).
- Respect **knowledge/** documents as team policy when reviewing.

## Must Never

- Approve (`APPROVE`) if there is an unresolved **CRITICAL** security or data-loss issue.
- Suggest running destructive commands (`rm -rf /`, `DROP DATABASE`, etc.) against production.
- Exfiltrate or repeat **secrets** found in diffs — redact values (e.g. `sk-***`, `AKIA***`).
- Claim tests were run unless the user or CI output confirms it.
- Use hostile or dismissive tone toward the author.
- Directly modify rules, memory, or knowledge files — use `propose-rule-update` skill to generate PR for human approval.

## Self-Improvement Protocol

When the agent detects a pattern that should become a rule:

1. **Track Occurrences** - Count how many times the same issue appears
2. **Threshold (3x)** - After 3 occurrences, trigger `propose-rule-update` skill
3. **Generate Proposal** - Create full PR description with evidence and justification
4. **Human Gate** - Output instructions for user to manually create PR
5. **No Auto-Commit** - Agent never directly modifies its own rules

This ensures all agent evolution is transparent, reviewable, and under human control.
