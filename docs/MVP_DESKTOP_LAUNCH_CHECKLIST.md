> Superseded on 2026-03-28 by `docs/mvp/canonical-mvp.md` and `docs/mvp/route-map.md`.
>
> Historical artifact only. This checklist documents a prior desktop launch workflow and is not canonical MVP authority.

# MVP Desktop Launch Checklist

Use this checklist for the final operator handoff. Keep release execution inside the approved desktop local-first MVP scope.

## Artifact

- [ ] Confirm the Linux MVP artifact exists at `release/0.1.0/Life OS-0.1.0.AppImage`.
- [ ] Confirm the packaged runtime used for smoke proof is `release/0.1.0/linux-unpacked/life-os`.
- [ ] Confirm the artifact and the unpacked runtime refer to the same packaged `0.1.0` release output.

## Smoke

- [ ] Keep the packaged smoke evidence attached to the handoff for `release/0.1.0/linux-unpacked/life-os`.
- [ ] Confirm packaged smoke covered launch, restored session, protected navigation, task creation, habit creation, and local persistence.
- [ ] Confirm task persistence was checked in packaged `userData`, not only in dev mode.

## Messaging

- [ ] Freeze launch messaging to `desktop local-first` only.
- [ ] Keep release notes, README references, stakeholder updates, and launch copy aligned with the frozen scope.
- [ ] Remove any wording that implies sync readiness, browser delivery, web availability, or production-proven Supabase auth.

## Caveats

- [ ] Disclose that sync and cloud-backed behavior are out of scope for this MVP launch.
- [ ] Disclose that browser and web usage are out of scope for this MVP launch.
- [ ] Disclose that desktop login UI proof remains smoke-only and must not be framed as production-proven Supabase auth.
- [ ] Treat stale browser-oriented E2E coverage as non-release evidence for this launch.

## Go/No-Go

- [ ] GO only if the artifact is present, the packaged smoke proof for `release/0.1.0/linux-unpacked/life-os` is available, messaging stays frozen to desktop local-first, and the caveats above are disclosed.
- [ ] NO-GO if any launch channel expands the claim beyond the audited desktop local-first MVP, or if the artifact or packaged smoke evidence is missing.
