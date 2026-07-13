# Contributing to LifeOS

Status: active governance document  
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

### Audit or discovery

Produces evidence, inventories, risk analysis, or recommendations. It does not authorize implementation.

### Decision

Compares alternatives and records a human decision. A recommendation from an agent is not an approved decision.

### Documentation or governance

May update repository process and canonical documentation when explicitly authorized. It must not smuggle product or architecture decisions into wording changes.

### Implementation

Changes behavior, code, configuration, dependencies, data, or release paths. It requires a complete Definition of Ready.

## Branches

Use short-lived branches:

- `audit/<topic>`
- `decision/<topic>`
- `docs/<topic>`
- `governance/<topic>`
- `fix/<topic>`
- `refactor/<topic>`
- `feature/<topic>`

Do not commit directly to `main`. One implementation issue should map to one branch and one PR.

## Commits

Use Conventional Commit prefixes when practical:

- `docs:`
- `chore:`
- `fix:`
- `refactor:`
- `test:`
- `feat:`
- `ci:`

Commit messages must describe the actual change, not the agent used to create it.

## Pull requests

A PR must:

- link the authorizing issue;
- state what changed and what did not;
- identify risk and rollback;
- list validation commands and actual results;
- answer each acceptance criterion;
- declare documentation impact;
- remain draft while incomplete;
- avoid unrelated changes.

PRs created by agents require human review before merge unless the maintainer explicitly records another rule.

## Dependencies

No new dependency may be added without the assessment required by `docs/governance/policies.md`.

## Documentation

Do not create a second source of truth. Historical documents must be marked and moved according to the documentation policy, not silently rewritten as current requirements.

## Security and data

Never include real secrets, credentials, user data, production exports, or identifying fixtures. Security-sensitive findings should use a private channel when public disclosure would create risk.

## Validation

Run checks applicable to the changed scope. Record exact commands and results. A passing command is evidence only for what that command actually covers.

## Code of conduct

Be direct, respectful, evidence-based, and willing to stop when the repository does not contain enough information for a safe decision.
