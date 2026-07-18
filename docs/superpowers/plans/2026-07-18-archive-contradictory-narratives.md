# Archive Contradictory Narratives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve obsolete desktop and broad-suite documentation as explicitly non-authoritative history while keeping immutable audit evidence searchable and correctly classified.

**Architecture:** Move narrative artifacts into subject-specific archive groups and the March QA snapshot into `docs/audits/`. Add uniform metadata blocks without rewriting historical bodies, publish archive and audit indexes, then repair active inbound links and validate every Markdown target.

**Tech Stack:** Markdown, Git history, shell-based link validation.

## Global Constraints

- Do not rewrite historical or audit bodies as current truth.
- Do not delete history or move active ADR, security, privacy, data, or evidence documents into the archive.
- Every archived narrative must say `Status: HISTORICAL` or `Status: SUPERSEDED` and `Authorizes implementation: no`.
- Every dated audit must record snapshot date, audited SHA or `unknown`, current successor, evidence-only authority, and `Authorizes implementation: no`.
- Keep changes documentation-only and preserve provenance through Git renames.

---

### Task 1: Classify and move historical narratives

**Files:**
- Create: `docs/archive/README.md`
- Move: `docs/ARCHITECTURE-FINAL.md` to `docs/archive/architecture/ARCHITECTURE-FINAL.md`
- Move: `docs/IMPLEMENTATION_SUMMARY.md` to `docs/archive/implementation/IMPLEMENTATION_SUMMARY.md`
- Move: `docs/MVP_READINESS.md`, `docs/MVP_DESKTOP_LAUNCH_CHECKLIST.md`, `docs/MVP_DESKTOP_RELEASE_NOTES.md`, `docs/MVP_DESKTOP_RELEASE_READINESS.md`, and `docs/MVP_POST_MVP_BACKLOG.md` to `docs/archive/release/`
- Move: `docs/prd/prd_v2.2.md` to `docs/archive/product/prd_v2.2.md`

**Interfaces:**
- Consumes: the authority hierarchy in `docs/README.md`.
- Produces: durable archive paths and metadata for link repair.

- [ ] Move the eight files with `git mv` so rename provenance remains visible.
- [ ] Replace each existing warning preamble with a metadata block containing status, authority, snapshot date, successor, and `Authorizes implementation: no`.
- [ ] Add `docs/archive/README.md` listing each archive group and its current successor.
- [ ] Verify old primary paths no longer exist and all eight new paths do.

### Task 2: Classify immutable audit snapshots

**Files:**
- Create: `docs/audits/README.md`
- Move: `docs/QA_RELEASE_AUDIT_2026-03-19.md` to `docs/audits/2026-03-19-qa-release-audit.md`
- Modify: `docs/audits/2026-07-13-lifeos-forensic-audit.md`
- Modify: `docs/audits/2026-07-16-ci-release-evidence-audit.md`

**Interfaces:**
- Consumes: recoverable snapshot SHAs from document evidence and Git history.
- Produces: immutable, searchable, evidence-only audit records.

- [ ] Add the required audit metadata to all three snapshots; use `unknown` for the March audited SHA, `7d8093fdf588e99d0893f7b66940b402457bcf22` for the forensic audit, and `e00b821954ebd701d642137bff3581b413e9ca7b` for the CI audit baseline.
- [ ] Add `docs/audits/README.md` defining immutability, evidence-only authority, and successor documents.
- [ ] Confirm no historical body was rewritten beyond its metadata preamble.

### Task 3: Repair authority indexes and inbound links

**Files:**
- Modify: `docs/README.md`
- Modify: active or retained files discovered by exact-reference search.

**Interfaces:**
- Consumes: final archive and audit paths from Tasks 1 and 2.
- Produces: active navigation that does not present historical material as current authority.

- [ ] Remove the temporary #133 note from `docs/README.md` and link archive/audit indexes only as history/evidence.
- [ ] Rewrite exact references to moved files, including self-references inside archived documents.
- [ ] Run `rg` for every old path and classify any retained occurrence as historical quotation or repair it.

### Task 4: Verify and deliver

**Files:**
- Verify: all changed Markdown files.

**Interfaces:**
- Consumes: completed archive taxonomy and repaired links.
- Produces: evidence for review, PR, and merge.

- [ ] Run a repository Markdown-link checker over non-URL links and require zero missing targets in non-historical files.
- [ ] Run `git diff --check` and confirm the diff is documentation-only.
- [ ] Review rename detection with `git diff --summary` and inspect the final metadata/indexes.
- [ ] Commit with Lore trailers, push, open a draft PR linked to #133, run CI/review, then mark ready and merge only when relevant gates pass.
