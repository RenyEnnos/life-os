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

### Active

- [ ] **Habits**: Heatmap, streaks, analytics, quantified habits.
- [ ] **Tasks**: Kanban board, Quick Capture with AI parsing.
- [ ] **Finances**: Transaction tracking, AI categorization, visual charts.
- [ ] **University**: Course management, grade calculator, What-If simulator.
- [ ] **AI Assistant**: Chat interface for insights, planning, and action execution.
- [ ] **Journal**: Daily reflections and mood tracking.
- [ ] **Gamification**: Points, levels, streaks, and badges.

### Out of Scope

- **Real-time chat**: High complexity, not core to personal productivity.
- **Video posts**: High storage/bandwidth costs.
- **Mobile app (Native)**: Web-first approach, PWA preferred for v1.

## Context

- **Tech Stack**: Modern web stack focusing on "Feature-Sliced Design".
- **AI Integration**: Heavily relies on Groq and Google Generative AI for "Quick Capture" and data analysis.
- **Environment**: Deployed on Vercel, using Supabase for DB and Auth.
- **Architecture**: Modular domain structure (src/features/).

## Constraints

- **Performance**: Lighthouse score > 90, AI response < 2s.
- **Accessibility**: WCAG 2.1 Level AA.
- **Offline**: PWA support (Vite PWA plugin).
- **Security**: Strict CSP and rate limiting for auth flows.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Feature-Sliced Design | Modularization and isolation of domain logic | ✓ Good |
| Express Backend + Supabase | Governance and security layer over DB | ✓ Good |
| React Query | Robust server-state management and caching | ✓ Good |
| Supabase Auth Migration | Higher security and easier management than custom JWT | ✓ Good |
| Database-backed Onboarding | Ensure continuity across devices and sessions | ✓ Good |
| Widget Framework | Consistent UI/UX for all dashboard items with unified status handling | ✓ Good |

---
*Last updated: 2026-02-26 after Phase 2*
