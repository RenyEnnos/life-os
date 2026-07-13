# Label Taxonomy

Status: canonical  
Authority: issue state and classification  
Owner: repository maintainer  
Last reviewed: 2026-07-12  
Machine-readable source: `.github/labels.json`

## Required dimensions

Every open issue must have exactly:

- one `type:*`;
- one `priority:*`;
- one `status:*`.

Implementation issues also require:

- at least one `area:*`;
- one `risk:*`;
- one `size:*`.

Use authority labels when useful:

- `agent:analysis`
- `agent:implementation`
- `agent:review`
- `human:decision`

## State rules

- `status:needs-triage` — classification incomplete.
- `status:needs-decision` — human choice missing.
- `status:blocked` — known dependency unresolved.
- `status:ready` — Definition of Ready complete.
- `status:in-progress` — active assigned work.
- `status:in-review` — PR or deliverable under review.
- `status:changes-requested` — review found required changes.
- `status:validated` — acceptance criteria independently verified.
- `status:superseded` — retained for history but no longer actionable.

## Authorization rules

The following do not authorize code regardless of priority:

- `type:tracking`
- `type:audit`
- `type:decision`

`status:ready` is necessary but not sufficient: the issue body must satisfy the Definition of Ready.

`size:L` and `size:XL` cannot be `status:ready`.

`risk:critical` requires `human:decision` and an approved rollback plan.

## Automation

`.github/workflows/sync-labels.yml` is manual and idempotent. It creates or updates labels from `.github/labels.json`. It does not delete unmanaged labels.

After merging label-catalog changes, run the workflow from the default branch and then validate issue classification.
