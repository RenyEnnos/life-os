# Repository Policies

Status: canonical  
Authority: change-control policies  
Owner: repository maintainer  
Last reviewed: 2026-07-12

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

Every normative document must state:

- Status;
- Authority;
- Owner;
- Last reviewed;
- Supersedes or Superseded by, when applicable.

Allowed states:

- `canonical`
- `active supporting`
- `proposal`
- `decision pending`
- `superseded`
- `historical`

Only one document may be canonical for a subject. Historical material must not remain in the primary execution path without a clear warning and archive plan.

Documentation must describe delivered behavior or clearly label future intent. It must not convert an aspiration into a claim.

## Branch and PR policy

- No direct commits to `main`.
- One implementation issue per branch and PR.
- Draft PR while incomplete.
- Human review required for agent-authored PRs.
- Squash merge is preferred for focused changes; final repository settings remain a human decision.
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

An ADR records a human-approved decision. An agent may draft one but cannot approve it.

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
