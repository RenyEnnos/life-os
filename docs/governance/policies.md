# Repository Policies

Status: CANONICAL \
Authority: change-control policies \
Audience: contributor; AI agent \
Owner: repository maintainer \
Last reviewed: 2026-07-18 \
Review by: 2027-01-14 \
Update trigger: dependency, documentation, branch/PR, ADR, change-size or rollback policy changes \
Supersedes: none \
Superseded by: none \
Authorizes implementation: no

## Dependency policy

Before adding or materially upgrading a dependency, document:

- concrete problem;
- current solution and its deficiency;
- alternatives, including no dependency;
- maintenance health and ownership;
- license;
- known security posture;
- bundle, binary, runtime, and build impact;
- compatibility with supported runtimes;
- transitive dependency cost;
- exit or replacement plan;
- human approval.

A package is not justified by popularity, fewer lines of code, aesthetics, or an agent recommendation alone.

GitHub Actions are dependencies and follow the same rule. Prefer official GitHub actions. Pinning policy must be decided for security-sensitive workflows.

## Documentation policy

Every CANONICAL, ACTIVE_SUPPORTING, PROPOSAL, or DECISION_PENDING document must state immediately after its title:

- Status;
- Authority;
- Audience;
- Owner;
- Last reviewed;
- Review by;
- Update trigger;
- Supersedes;
- Superseded by;
- Authorizes implementation.

Allowed states:

- `CANONICAL`
- `ACTIVE_SUPPORTING`
- `PROPOSAL`
- `DECISION_PENDING`
- `SUPERSEDED`
- `HISTORICAL`
- `DUPLICATE`
- `CONTRADICTORY`
- `DELETE_CANDIDATE`
- `MISSING_REQUIRED`

Allowed audiences are: `end user`, `contributor`, `AI agent`, `operator/release`, `product/business`, `security`, and `history`. A repository without an explicitly delegated steward uses `repository maintainer` as Owner; a role name must not imply a team that does not exist.

Only one document may be CANONICAL for a subject. `docs/README.md` is the sole authority/search index and must change in the same PR as an indexed path, state, authority, owner, active exception, update trigger, or review date. Historical material must not remain in the primary execution path without a clear warning and archive plan.

Documentation must describe delivered behavior or clearly label future intent. It must not convert an aspiration into a claim.

Lifecycle:

- security and operations documents are reviewed within 90 days or immediately on their update trigger;
- other CANONICAL and ACTIVE_SUPPORTING documents are reviewed within 180 days or immediately on their update trigger;
- PROPOSAL and DECISION_PENDING documents expire after 30 days unless explicitly renewed;
- an active plan expires when its issue closes, its PR merges, or it has no recorded activity for 30 days;
- audits are immutable snapshots: add snapshot date, audited SHA, current successor, evidence-only authority, and `Authorizes implementation: no`; supersede them with a new audit rather than rewriting their findings.

Expiry does not silently delete a document. It becomes DECISION_PENDING or HISTORICAL, leaves the primary index, and receives an owning issue/action. Archive remains intentionally searchable; agents opt in to it only for provenance or recovery.

## Branch and PR policy

- No direct commits to `main`.
- One implementation issue per branch and PR.
- Draft PR while incomplete.
- Human review is the permanent default for agent-authored PRs. A temporary higher-authority exception applies only when its exact source, scope, owner, and termination condition are active in `docs/README.md`.
- Squash is the configured merge method. GitHub protection/settings and any admin bypass are tracked by #100 and must not be inferred from this file alone.
- Structural changes and features must not share a PR.
- Generated files must be traceable to their source.
- Force-push to shared branches is prohibited without coordination.

## Concurrency policy

Only one structural implementation issue may be active at a time. Parallel work is allowed when file ownership and contracts do not overlap.

Agents must not create parallel solutions to the same problem.

## ADR policy

An ADR is required for decisions that are expensive to reverse, including:

- canonical runtime;
- persistence technology;
- authentication or authorization model;
- sync architecture;
- communication protocol;
- major module boundaries;
- structural dependency;
- data migration strategy;
- release architecture.

An accepted ADR records a human-approved decision. An agent may draft one but cannot make it accepted. A provisional ADR may operate only under an explicit higher-authority mandate indexed in `docs/README.md`, with owner, scope, reversibility, and termination condition. Provisional operation is not permanent ratification.

## Change-size policy

- `size:XS` — local, obvious, low-risk.
- `size:S` — one behavior or document unit.
- `size:M` — small vertical slice with bounded integration.
- `size:L` — must be decomposed.
- `size:XL` — program or migration, never one implementation ticket.

Line count is not the only measure. Risk, number of contracts, runtimes, data paths, and review complexity determine size.

## Rollback policy

High- and critical-risk work must define:

- detection signal;
- rollback trigger;
- rollback steps;
- data compatibility;
- responsible human;
- post-rollback verification.

“Revert the PR” is insufficient when data or external state changes.
