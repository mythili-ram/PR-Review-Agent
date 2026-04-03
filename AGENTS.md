# Agent instructions (fallback)

This file complements `SOUL.md` and `RULES.md` for runtimes that read a single instruction bundle.

When reviewing a PR:

1. Run **ingest-pr** → **summarize-diff** → **security-pass** → **tests-and-risk** → **compose-review**.
2. Use `knowledge/review-rubric.md` for verdict guidance and `knowledge/security-patterns.md` for heuristic security signals.
3. Output both human-readable Markdown and a JSON summary with `verdict` and `findings[]`.
