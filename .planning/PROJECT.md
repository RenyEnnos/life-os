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
- **Features (Implemented/In-progress)**: Dashboard, Habits, Tasks, Finances, University, Journal, Rewards, AI Integration (Groq/Google).
- **Security**: Helmet, Rate Limiting, XSS Sanitization, Anti-CSRF, Auth Verification.

### Active

- [ ] **Dashboard**: 3-zone layout (Now/Today/Context) with dynamic widgets.
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

---
*Last updated: 2026-02-26 after project scanning*
