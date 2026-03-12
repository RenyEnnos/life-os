# MVP Desktop Release Readiness

## Supported MVP Surface

The supported MVP surface is desktop, local-first. This recommendation is based on the current verified Electron runtime, not the browser path. Sync and cloud behavior remain out of scope for this release.

## Proven Desktop Capabilities

- Desktop smoke passes in the supported runtime.
- Authenticated smoke is proven via seeded desktop session and post-login dashboard render.
- Desktop login UI is proven via a smoke-only desktop auth fallback in `PLAYWRIGHT_TEST=1`.
- Protected navigation is proven, including authenticated navigation to `#/tasks` without falling back to login.
- A visual post-login protected state is proven via the dashboard `WELCOME BACK` header with the login container absent.
- Task creation is proven from the desktop tasks page.
- Health metric mutation is proven from the post-login desktop dashboard flow.
- Habit creation is proven from the desktop habits page.

## Explicitly Out of Scope

- Sync and cloud-backed behavior.
- Browser/web as the MVP surface.
- Broader claims beyond the verified desktop local-first flow set above.

## Remaining Non-Blocking Debt

- Browser-oriented E2E coverage is still stale against the real Electron runtime and should not be used as MVP evidence.
- Some lint and test warnings are still known in the repo, but they are currently treated as non-blocking for this MVP.
- Release messaging must stay honest about scope: desktop local-first only, with sync excluded.
- The desktop login UI proof currently uses smoke-only credentials in `PLAYWRIGHT_TEST=1`; this is acceptable for release validation of the desktop path, but it is still distinct from a fully configured real Supabase login environment.

## Final Recommendation

Go for a desktop local-first MVP, with explicit scope limits. Ship if the release is positioned strictly as a desktop local-first product, with sync excluded and no claim that the browser path is release-ready.
