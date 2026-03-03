# Phase 20: Fix Frontend Integration Bugs - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning
**Source:** discuss-phase workflow (User Q&A)

<domain>
## Phase Boundary

This phase delivers critical bug fixes and infrastructure improvements blocking the complete usage of the frontend. Specifically, it involves fixing Supabase trigger issues breaking registration, JWT token desync preventing backend data fetching, and the implementation of resilient Error Boundaries and fallback UIs to prevent infinite loading screens on API failure.
</domain>

<decisions>
## Implementation Decisions

### Comportamento de Fallback (Error Boundaries)
- **Fallback UI:** (Claude's Discretion based on UX Best Practices) - When an API fails (e.g., on `/tasks` or `/university`), present a clean, local fallback UI with a clear "Tentar Novamente" (Retry) button instead of redirecting the user away. 
- **Mensagem de Erro:** Display the technical error string/status (e.g., "401 Unauthorized" or "500 Server Error") inside the fallback UI, ensuring developers/power-users can immediately identify the root cause.
- **Estado Offline:** If the application detects a true offline state (network failure), attempt to render cached data (stale-while-revalidate via React Query) rather than instantly showing a hard error screen.
- **Escopo do Erro:** (Claude's Discretion based on UX Best Practices) - Use nested Error Boundaries. An error should only replace the specific widget, list, or section that failed. The global shell (Sidebar, Header, Navigation) must remain operational and unaffected.

### Edge Cases de Autenticação/Sessão
- **Registros Órfãos:** When the Supabase auth trigger fails to create a `profile` record but creates an `auth.users` record, the system should automatically clean up/delete the 'broken' user record so the user is not locked out and can attempt registration again without seeing an "Email already in use" error.
- **Fluxo de Recuperação:** (Claude's Discretion based on Best Practices) - Instead of immediately redirecting to a hard error, the system should ideally attempt a silent creation/sync of the missing profile upon login. If recovery fails, present a clear error forcing re-registration.
- **Sincronia de Token:** (Claude's Discretion based on Best Practices) - Keep it simple. Sync the Supabase session JWT to the exact `localStorage` key the current HTTP client (`src/shared/api/http.ts`) expects (`auth_token`) to minimize refactoring surface area.
- **Sessões Expiradas:** When a token completely expires or a refresh fails, display a modal to the user ("Sua sessão expirou, faça login novamente") keeping the current app state visible but blurred/locked behind the modal, rather than a harsh sudden redirect that loses context.

### Feedback Global de Rede
- **Notificação Toast:** Launch a global toast notification immediately when a connectivity failure or `401 Unauthorized` / Timeout occurs.
- **Auto-recuperação:** When the system detects the network is restored, automatically dismiss offline warnings, display a "Conexão restaurada" toast, and trigger a re-fetch of the current view's data.
- **Limitação de Ruído:** Consolidate network errors. If multiple widgets fail simultaneously, present only a single, unified notification (e.g., "Sistema offline" or "Problemas de conexão") rather than stacking multiple toasts.

### Claude's Discretion
- Best practices for structuring the Supabase PostgreSQL trigger (using `security definer`, handling constraints).
- Exact styling implementation of the Error Boundary fallback cards (aligning with the existing "Premium SaaS/Gems" design language).
- The mechanism to intercept global fetch failures in `React Query` / `axios` to trigger the unified toasts.

</decisions>

<specifics>
## Specific Ideas
- React Query's `QueryCache` and `MutationCache` global callbacks are good candidates for implementing the unified network error toast limitation.
- The `auth.users` cleanup might require edge functions or RPCs since the frontend cannot delete users by default due to RLS. If doing it client-side is restricted, handling it via a robust Supabase Database Function is advised.

</specifics>

<deferred>
## Deferred Ideas
- None — The discussion strictly adhered to the scope of fixing the documented integration bugs.
</deferred>

---

*Phase: 20-fix-frontend-integration-bugs*
*Context gathered: 2026-03-03 via /gsd:discuss-phase*
