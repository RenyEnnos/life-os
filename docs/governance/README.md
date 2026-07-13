# LifeOS Governance

Status: canonical  
Authority: index for repository governance  
Owner: repository maintainer  
Last reviewed: 2026-07-12

## Purpose

LifeOS is operated as an AI-native project with human authority. Agents may analyze and implement, but they do not own product intent, irreversible architecture decisions, security acceptance, or merge authority.

## Governance map

- `AGENTS.md` — mandatory entrypoint for every coding or analysis agent.
- `agent-protocol.md` — execution protocol and stop conditions.
- `readiness-and-done.md` — Definition of Ready and Definition of Done.
- `policies.md` — dependencies, documentation, branches, reviews, concurrency, and change control.
- `labels.md` — issue taxonomy and state machine.
- `../adr/README.md` — architectural decision records.

## Authority hierarchy

1. Human decision recorded in GitHub.
2. Approved ADR.
3. Ready implementation issue.
4. Canonical product or contract documentation.
5. Tests and schemas applicable to the behavior.
6. Current code.
7. Historical documents, comments, bot summaries, and inference.

This hierarchy does not mean current code is automatically correct. It means code is evidence of current behavior when higher-authority sources do not define the desired behavior.

## Operating gates

1. Audit and evidence.
2. Human product decision.
3. Human architecture and security decision.
4. Governance and documentation alignment.
5. Migration or recoding plan.
6. Small implementation issues.
7. Independent review and validation.
8. Merge and post-merge verification.

Skipping a gate requires explicit human approval recorded in the relevant issue.

## Current recovery program

The recovery program is tracked in #82. Until its decisions are resolved, agents must preserve uncertainty rather than manufacture consistency.
