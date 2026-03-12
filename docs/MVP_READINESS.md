# MVP Readiness

## Verdict
No-go for calling the product fully MVP-proven today. Go only if the team explicitly frames this release as a local-first desktop MVP with sync excluded and remaining core-flow validation accepted as follow-up work.

## Proven for MVP
- `npm run electron:build` succeeds, so desktop packaging is validated enough for an MVP release candidate.
- The repo is positioned and documented as a local-first Electron app with SQLite and IPC as the supported default runtime.
- The desktop path is the most credible current MVP candidate.

## Explicitly Out of MVP Scope
- Cloud sync is out of MVP for now.
- Sync code exists, but it depends on separate desktop Supabase configuration and has not been validated as default product behavior.
- The browser/web path should not be treated as the MVP surface today.

## Current Blockers
- Core user flows are not fully proven end to end in the currently supported runtime.
- Auth is not fully proven: existing browser E2E assumptions are stale relative to the current UI contract.
- Smoke coverage is not trustworthy for MVP validation because the current browser E2E setup does not match the real runtime and may depend on missing backend or seed assumptions.

## Recommended Next Steps
- Rebase validation on the supported MVP target, local-first desktop.
- Prove one honest core flow, launch app, authenticate if required by the target path, complete a post-login core action, and confirm persistence.
- Keep sync excluded from release claims until it is configured and separately validated.
