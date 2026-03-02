# Phase 1: Project Scaffolding & Authentication - Context

**Gathered:** 2026-02-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the project foundation and secure user access. This includes the base React+Vite+Tailwind scaffolding (if any adjustments are needed to existing brownfield code) and a fully functional authentication system using Supabase.

</domain>

<decisions>
## Implementation Decisions

### Authentication Flow
- **Methods**: Email and Password as the primary authentication method.
- **Persistence**: User session must persist across browser refreshes (Supabase Auth default).
- **Redirection**: 
  - Successful login redirects to the Dashboard.
  - New signup triggers an Onboarding flow (5 steps).

### Onboarding
- **Steps**: 5-step onboarding flow to capture initial user preferences and profile data (as per PRD).

### Scaffolding
- **UI Framework**: React with Tailwind CSS and Shadcn UI patterns.
- **State Management**: Zustand for local UI state and Auth state.
- **Icons**: Lucide React.

### Claude's Discretion
- **Loading States**: Skeletons for login/signup forms during submission.
- **Error Handling**: Toast notifications for auth errors.
- **Landing Page**: Basic professional landing page structure for unauthenticated users.

</decisions>

<specifics>
## Specific Ideas
- The project is brownfield; Phase 1 should integrate with existing components in `src/features/auth` and `src/components/ui`.
- Use the 3-zone layout structure for the target landing/dashboard shell.

</specifics>

<deferred>
## Deferred Ideas
- **OAuth (Google/GitHub)**: Deferred to v2.
- **Dashboard Widgets**: Implementation of specific widgets belongs in Phase 2.

</deferred>

---

*Phase: 01-project-scaffolding-authentication*
*Context gathered: 2026-02-26*
