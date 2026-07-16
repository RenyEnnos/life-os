# Architecture Decision Records

Status: canonical  
Authority: durable architecture decisions  
Owner: repository maintainer  
Last reviewed: 2026-07-12

## Purpose

ADRs record decisions that are costly to reverse. They explain context and trade-offs; they do not replace implementation issues.

## Lifecycle

- `proposed` — drafted for discussion;
- `provisional` — active, reversible decision made under an explicit autonomous mandate; requires later maintainer ratification, rejection, or replacement;
- `accepted` — approved by the maintainer;
- `rejected` — considered and declined;
- `superseded` — replaced by another ADR;
- `deprecated` — no longer recommended but not yet removed.

Only a human maintainer may mark an ADR accepted.

A provisional ADR may direct ongoing recovery work only when an explicit maintainer mandate authorizes provisional decisions. It must name its rollback trigger and may not represent itself as human-ratified.

## Naming

Use:

`NNNN-short-kebab-title.md`

Example:

`0001-canonical-runtime.md`

## Template

```markdown
# ADR-NNNN: Title

Status: proposed
Date: YYYY-MM-DD
Decision owner: repository maintainer
Related issues:
Supersedes:
Superseded by:

## Context

Observed facts, constraints, and the decision that must be made.

## Decision drivers

- driver
- driver

## Options considered

### Option A

Benefits, costs, risks, and evidence.

### Option B

Benefits, costs, risks, and evidence.

## Decision

Human-approved choice. Leave unresolved while status is proposed.

## Consequences

### Positive

### Negative

### Risks

## Migration and rollback

Steps, data compatibility, rollback trigger, and verification.

## Validation

Evidence required to confirm the decision works.
```

## Required ADR topics during recovery

The recovery program currently requires decisions for runtime/release, persistence, authentication/authorization, and any retained multi-runtime strategy.
