# Contributing to LifeOS

Status: canonical  
Authority: contribution workflow  
Owner: repository maintainer  
Last reviewed: 2026-07-12

LifeOS is currently undergoing a controlled recovery program. Contributions are issue-driven and must respect the decisions and gates tracked in #82.

## Before contributing

1. Read `AGENTS.md`.
2. Read `docs/governance/README.md`.
3. Find or create an issue using the appropriate issue form.
4. Confirm the issue has one type, priority, and status label.
5. Do not implement until the issue is `status:ready`.
6. For architecture, runtime, persistence, authentication, synchronization, or structural dependencies, confirm that an approved ADR exists.

## Contribution modes

### Audit

Read-only investigation. Deliver evidence, classifications, risks, and recommendations. Do not edit product files.

### Decision

Compare options and prepare a human choice. A decision issue does not authorize implementation. The final choice must be recorded by a maintainer or accepted ADR.

### Documentation and governance

Documentation may be changed only when the issue explicitly authorizes the named files. Do not use documentation work to make an unapproved product or architecture decision.

### Implementation

Implementation requires a `status:ready` issue that satisfies the Definition of Ready. The PR must remain within that issue's scope.

## Branches

Use a branch for every change. Suggested names:

- `audit/<scope>`
- `decision/<scope>`
- `docs/<scope>`
- `fix/<scope>`
- `refactor/<scope>`
- `feature/<scope>`
- `governance/<scope>`

Do not commit directly to `main` unless a maintainer records an emergency exception.

## Commits

Use focused Conventional Commits where practical:

- `docs:` documentation only;
- `governance:` repository policy, templates, or agent instructions;
- `fix:` defect correction;
- `refactor:` behavior-preserving structural change;
- `test:` test-only change;
- `feat:` approved new behavior;
- `chore:` bounded maintenance.

A commit message does not authorize scope beyond the issue.

## Pull requests

Use `.github/pull_request_template.md` and include:

- authorizing issue;
- objective and exclusions;
- files or areas changed;
- acceptance criteria status;
- actual validation commands and outcomes;
- risks, limitations, and rollback;
- documentation impact;
- AI assistance declaration when applicable.

Open AI-authored PRs as draft until self-review and applicable checks complete. Human review is required before merge.

## Review standard

Reviewers verify:

- authorization and scope;
- evidence rather than unsupported claims;
- product and architecture neutrality where decisions are pending;
- tests and validation appropriate to the affected runtime;
- data, security, migration, and rollback risk;
- documentation consistency;
- absence of unrelated cleanup or dependency additions.

Green CI does not replace review. Existing CI is itself under audit in #86.
