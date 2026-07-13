# AGENTS.md

Status: canonical governance entrypoint  
Authority: repository-wide operating rules for AI agents  
Owner: repository maintainer  
Last reviewed: 2026-07-12  
Related: issues #82, #84, #85, #91

## Purpose

This file defines how AI agents may work in the LifeOS repository. It is intentionally short. Detailed rules live in `docs/governance/`.

## Current freeze

LifeOS is under product, architecture, security, documentation, and debloat review.

Until a human-approved decision or implementation issue says otherwise, agents must not:

- choose web, Electron, PWA, Android, or another runtime as canonical;
- treat legacy code or the newest code as the desired architecture;
- add features or dependencies;
- perform broad rewrites, migrations, renames, or cleanup;
- remove code only because it appears unused;
- turn proposals, old PRDs, comments, or historical plans into requirements;
- begin a second issue after completing the assigned one.

## Authority order

When sources conflict, use this order:

1. explicit human decision recorded in an issue or PR;
2. approved ADR;
3. implementation issue marked ready;
4. canonical product and contract documentation;
5. applicable tests and schemas;
6. current code;
7. comments, historical plans, generated summaries, and agent inference.

A conflict between higher-authority sources is a stop condition. Report it; do not resolve it silently.

## Required execution contract

Every agent must:

1. read the assigned issue and linked decisions;
2. restate the objective, scope, exclusions, and stop conditions;
3. inspect relevant files before editing;
4. identify contradictions, risks, and unknowns;
5. propose a short plan and expected file list;
6. keep the diff limited to the issue;
7. add or update tests for behavior changes;
8. run applicable validation;
9. report commands, results, limitations, and unperformed work;
10. stop when the issue is complete.

## Issue authorization

Only an issue labeled `status:ready` and satisfying the Definition of Ready may authorize implementation.

These issue types never authorize product code by themselves:

- `type:tracking`
- `type:audit`
- `type:decision`
- `type:governance` when explicitly documentary
- research or discovery issues

## Permanent prohibitions

Agents must not:

- commit secrets, credentials, personal data, or production tokens;
- disable tests or weaken assertions merely to obtain a green check;
- add silent fallbacks that hide infrastructure failure;
- claim support, security, compatibility, performance, or readiness without evidence;
- mix feature work with unrelated refactoring;
- add abstractions for hypothetical future use;
- install dependencies without an approved dependency assessment;
- change snapshots without explaining the user-visible behavior;
- modify generated or lock files unless the issue requires it;
- merge their own PR unless explicitly authorized by the maintainer.

## Validation baseline

Use only commands that exist in `package.json` and apply to the changed scope. Do not copy commands from historical documentation.

Minimum expectations for code changes normally include:

- `npm run typecheck`
- `npm run lint`
- relevant tests
- `npm run build`

Runtime-specific checks are governed by the approved runtime ADR. Until issue #85 is decided, do not present one runtime's smoke test as proof for another.

## Detailed governance

Read:

- `docs/governance/README.md`
- `docs/governance/agent-protocol.md`
- `docs/governance/readiness-and-done.md`
- `docs/governance/policies.md`
- `docs/governance/labels.md`
- `docs/adr/README.md`
