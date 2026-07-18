# Minimal Active Documentation Taxonomy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every active documentation subject one obvious path under product, architecture, contracts, governance, operations, security, audits, or archive.

**Architecture:** Use Git renames to consolidate active files without duplicating prose. Keep ADRs stable, add only architecture/operations indexes and a Supabase boundary note, repair live links mechanically, and archive this plan with the #136 delivery before merge.

**Tech Stack:** Markdown, Git history, repository link validation.

## Global Constraints

- Documentation only; no runtime, schema, workflow, dependency, or configuration behavior changes.
- Do not create empty taxonomy folders or mirror executable routes/schemas in prose.
- Keep `docs/adr/` stable and preserve historical bodies.
- Executable configuration stays beside code and is linked rather than copied.

### Task 1: Move active sources into the minimal taxonomy

- [ ] Move canonical product scope into `docs/product/`.
- [ ] Move the architecture overview into `docs/architecture/` and add an architecture index plus Supabase boundary.
- [ ] Move route, telemetry, and privacy contracts into `docs/contracts/`.
- [ ] Move release, setup, data, and advisory runbooks into `docs/operations/` and add a minimal index.

### Task 2: Repair authority and navigation

- [ ] Update `docs/README.md`, root README, active cross-references, and archived successor metadata to final paths.
- [ ] Confirm old active directories contain no files and no active source points to old paths.

### Task 3: Verify and archive this delivery plan

- [ ] Validate every local Markdown link in non-historical documents and every new index.
- [ ] Confirm one authority path per subject, documentation-only scope, Git rename detection, and `git diff --check`.
- [ ] Move this plan to `docs/archive/deliveries/136-<PR>/implementation-plan.md` with verified outcome metadata before merge.
