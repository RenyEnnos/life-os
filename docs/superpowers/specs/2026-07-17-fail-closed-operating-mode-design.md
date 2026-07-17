# Fail-Closed Operating Mode Design

Issue: #106  
Decision source: `docs/security/2026-07-16-operating-modes-threat-model.md`

## Decision

LifeOS accepts exactly two operating modes: `local-dev` and `controlled-demo`. The mode is supplied through `LIFEOS_OPERATING_MODE`; absence, unknown values, or contradictions fail with diagnostics that name variables but never values.

A single pure module in `shared/operatingMode.ts` owns the policy. Vite invokes its build validation, while the Express entry point invokes its server validation before listening. This keeps one policy without making browser builds require runtime secrets.

## Mode contracts

`local-dev` preserves the existing loopback development path and fallback invite. It must use `NODE_ENV=development` when that variable is supplied.

`controlled-demo` requires:

- `NODE_ENV=production` at server startup;
- an exact HTTPS `ALLOWED_ORIGIN` without credentials, query, fragment, or wildcard;
- a non-default `LIFEOS_SESSION_SECRET` of at least 32 characters;
- non-empty, email-bound, unique `LIFEOS_INVITES` without the known fallback;
- explicit `LIFEOS_MVP_REPOSITORY=file`;
- absent or false UI bypass/admin flags;
- no service-role secret or unreviewed Sentry/analytics endpoints;
- no public browser source maps or Trae badge in the web artifact.

The existing `JWT_SECRET` alias remains local migration compatibility but cannot satisfy `controlled-demo`.

## Integration and evidence

Vite loads all environment keys before validating, disables source maps and the vendor badge for `controlled-demo`, and keeps current local debugging behavior for `local-dev`. Express validates before constructing/listening. Docker Compose requires the controlled-demo values; CI and canonical E2E declare their synthetic mode explicitly.

Unit tests exercise every rejection without embedding real secrets. Release-contract tests inspect Docker/CI configuration and the built artifact for source maps, the fallback invite, weak Redis defaults, privileged service-role injection, and vendor badge output.

## Scope

This change does not add server-side admin authorization, session/CSRF redesign, durable persistence, data lifecycle, Electron confinement, TLS termination, or partner-beta support. Those remain in #107–#111.

