# Advisory tooling lanes

This inventory is the active ownership contract for tooling that produces useful evidence but is not a required release gate.

| Lane | Owner | Real command | What it proves | What it does not prove |
|---|---|---|---|---|
| PWA artifact | Repository maintainer | `npm run build` | Vite can generate the configured service-worker assets as part of the canonical web build | Offline correctness, cache migration, installability or release readiness |
| Bundle analysis | Repository maintainer | `npm run analyze:build` | A local-development web bundle builds and the checked-in analyzer can inspect emitted JavaScript assets | Release-mode output, performance budgets, field performance or user experience |

These lanes remain advisory until a later issue defines a supported product requirement, stable fixture, acceptance threshold and required CI owner. A missing owner or failing command is grounds for removal rather than a release claim.
