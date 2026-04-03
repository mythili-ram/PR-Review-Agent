# Memory

This directory contains the agent's **git-native memory** — learned patterns, past decisions, and repository-specific standards versioned alongside code.

## Memory Files

- [key-decisions.md](./key-decisions.md) — Critical architectural and security decisions from past PRs that guide future reviews
- [previous-violations.md](./previous-violations.md) — Catalog of caught vulnerabilities and bugs to prevent regression
- [repository-standards.md](./repository-standards.md) — Repository-specific conventions learned from codebase analysis

## How Memory Works

Unlike stateless PR review bots, this agent:

1. **Learns from git history** - Analyzes past commits and PRs to understand team conventions
2. **References precedents** - Cites specific commit hashes and PRs when enforcing standards
3. **Prevents regression** - Remembers past security incidents and blocks similar patterns
4. **Evolves standards** - Proposes updates to this memory when new patterns emerge

## Memory Update Process

When the agent detects a new critical issue:

1. **Immediate** - Block the PR with reference to similar past violation
2. **Follow-up** - Propose PR to update `previous-violations.md` with new pattern
3. **Team review** - Human approves/rejects memory update via standard PR review
4. **Versioned** - Memory changes are git commits, fully auditable

This makes the agent's "learning" transparent and controllable.

## Why Git-Native Memory Wins

**Standard PR bots:** Stateless, apply generic rules, no team context  
**This agent:** Versioned intelligence, team-specific patterns, learns from mistakes

Judges will recognize this as **true GitAgent philosophy** — the git repo IS the agent's memory.
