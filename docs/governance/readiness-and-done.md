# Definition of Ready and Definition of Done

Status: canonical  
Authority: issue and merge gates  
Owner: repository maintainer  
Last reviewed: 2026-07-12

## Definition of Ready

An implementation issue may receive `status:ready` only when all material items below are resolved.

### Required

- clear problem and expected user or system outcome;
- evidence and current behavior;
- included scope;
- explicit exclusions;
- dependencies and blockers;
- likely affected areas;
- approved product and architecture decisions;
- data, privacy, security, and migration risks;
- measurable acceptance criteria;
- required tests and validation;
- documentation impact;
- rollback or reversibility plan when applicable;
- exactly one `priority:*`, one `type:*`, one `status:*`, one `risk:*`, and one `size:*` label;
- at least one `area:*` label;
- size `size:XS`, `size:S`, or `size:M`.

### Not ready

Use `status:needs-decision` when intent or architecture is unresolved.  
Use `status:blocked` when a known external issue must complete first.  
Use `status:needs-triage` when classification is incomplete.

`size:L` and `size:XL` issues must be decomposed before implementation.

## Definition of Done

A PR is done only when:

- the authorizing issue is linked;
- requested behavior is complete and no unrelated behavior changed;
- each acceptance criterion is answered;
- tests were added or updated for behavior changes;
- applicable typecheck, lint, tests, build, and runtime checks pass;
- actual commands and outcomes are recorded;
- documentation and contracts were updated where required;
- no silent fallback, production mock, disabled test, or untracked TODO was introduced;
- dependency policy was followed;
- migration and rollback instructions exist when required;
- security and privacy impact was reviewed;
- known limitations are declared;
- the diff was self-reviewed;
- required human review approved the PR;
- post-merge verification is defined when the change affects release, data, or infrastructure.

## Validation vocabulary

- **Implemented** — code or documentation exists.
- **Verified** — an applicable check produced evidence.
- **Validated** — acceptance criteria and intended behavior were independently reviewed.
- **Released** — deployed or distributed through the approved release path.
- **Observed in production** — real operational evidence exists.

These terms are not interchangeable.
