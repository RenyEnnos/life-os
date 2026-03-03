# Life OS

## What This Is

Life OS is a comprehensive personal productivity and management application (Personal Operating System) designed to unify habits, tasks, finances, university management, and AI assistance into a single cohesive system. It aims to help users organize their life, track health metrics, manage projects, and achieve goals through a gamified and AI-powered experience.

## Core Value

A unified, gamified, and AI-powered personal productivity system that reduces cognitive load by centralizing all aspects of life management (tasks, habits, finances, education) in one place.

## Requirements

### Validated

- **Frontend Core**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **State/Data**: Zustand, React Query, Supabase (PostgreSQL).
- **Backend Core**: Node.js, Express.
- **Auth & Security**: Supabase Auth (Email/Pass), Reset Password flow, JWT verification in Express middleware.
- **Onboarding**: 5-step interactive flow with database persistence.
- **Dashboard**: 3-zone Bento Grid layout (Now/Today/Context) with reusable Widget framework.
- **Security Features**: Helmet, Rate Limiting, XSS Sanitization, Anti-CSRF.
- **PWA**: Full offline support and installability.
- **Data Authenticity**: Real database connections (Milestone 4).

### Active (Milestone 5: Fix Frontend Integration Bugs)

- [ ] **Supabase Auth Trigger**: Fix the database trigger that prevents new user registration (AuthApiError 500).
- [ ] **Token Synchronization**: Sync Supabase session token to `localStorage` ('auth_token') so that `src/shared/api/http.ts` can properly authenticate requests to the backend (fixing the 401s).
- [ ] **Error Boundaries**: Implement fallbacks and Error Boundaries on routes like `/tasks` and `/university` to prevent infinite loading spinners on failed fetches.

### Out of Scope

- **Real-time chat**: High complexity, not core to personal productivity.
- **Video posts**: High storage/bandwidth costs.
- **Mobile app (Native)**: Web-first approach, PWA preferred for v1.

## Context

- **Tech Stack**: Modern web stack focusing on "Feature-Sliced Design".
- **AI Integration**: Heavily relies on Groq and Google Generative AI for "Quick Capture" and data analysis.
- **Environment**: Deployed on Vercel, using Supabase for DB and Auth.
- **Advanced Tooling**:
  - **Google Stitch**: UI/UX prototyping and screen generation.
  - **Context7**: Real-time documentation and library ID resolution.
  - **TestSprite**: Automated E2E and backend testing suite.
  - **Jules**: Large-scale refactoring and dependency optimization.

## Constraints

- **Performance**: Lighthouse score > 90, AI response < 2s.
- **Accessibility**: WCAG 2.1 Level AA.
- **Offline**: PWA support (Vite PWA plugin).
- **Security**: Strict CSP and rate limiting for auth flows.
- **Testing**: 100% coverage on new features via TestSprite.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Feature-Sliced Design | Modularization and isolation of domain logic | ✓ Good |
| Express Backend + Supabase | Governance and security layer over DB | ✓ Good |
| React Query | Robust server-state management and caching | ✓ Good |
| Supabase Auth Migration | Higher security and easier management than custom JWT | ✓ Good |
| Database-backed Onboarding | Ensure continuity across devices and sessions | ✓ Good |
| Widget Framework | Consistent UI/UX for all dashboard items with unified status handling | ✓ Good |
| **Gems Integration** | Use industry standards (Tremor, RHF) to reduce boilerplate and elevate UI | ⟳ Planned |
| **Tool-Driven Dev** | Mandatory use of Stitch (UI), Context7 (Docs), and TestSprite (QA) | ⟳ Planned |

---
*Last updated: 2026-03-02 after Milestone 2 Completion*
