# Restore Cockpit Integrity

## Goal
To restore the functional integrity of the Life OS "Glass Cockpit" by implementing missing critical features (Context HUD, Calendar Integration, Media Hub) and fixing broken core systems (Neural Chat, Realtime Sync, Auth Protection). This ensures the "gated cockpit" experience and the "Symbiotic Awakening" vision are actually realized in the software, moving from "mocked promises" to "functional reality".

## Problem
The current codebase contains several "ghost features" that are advertised in the UI or backend APIs but are functionally disconnected or broken:
- **Context HUD**: Backend API exists but frontend mocks data.
- **Calendar**: OAuth endpoints exist but frontend integration is missing.
- **Media Hub**: Project covers rely on hardcoded localhost URLs.
- **Neural Chat**: Frontend calls non-existent backend route.
- **Realtime**: SSE authentication is broken due to cookie restrictions.
- **Security**: ProtectedRoutes and Calendar Callback allow unauthenticated access.

## Solution
We will systematically wire up the frontend to the existing backend services, implement the missing integration layers, and harden the security/authentication mechanisms. This will be done in three waves:
1. **Connectivity**: Fix the pipes (SSE, Auth, Routes, CORS).
2. **Integration**: Connect the components (Calendar, Context, Chat).
3. **Polish**: Ensure "Deep Glass" aesthetics work in production contexts (Media Hub).

## Risks
- **Auth Refactor**: Changing token storage for SSE might impact other auth flows if not tested carefully.
- **Calendar Scopes**: Google OAuth verification might be required if scopes are too broad (though for personal use it's fine).
