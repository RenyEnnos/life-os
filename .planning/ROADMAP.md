# Roadmap: Life OS

## Phases

- [x] **Phase 1: Project Scaffolding & Authentication** - Establish the project foundation and secure user access. (completed 2026-02-26)
- [ ] **Phase 2: Core Infrastructure & Dashboard Layout** - Implement the 3-zone layout and widget framework.
- [ ] **Phase 3: Habit Tracking System** - Build core habit management with heatmap and streaks.
- [ ] **Phase 4: Task Management (Kanban)** - Create the task organization system with drag-and-drop Kanban.
- [ ] **Phase 5: Financial Management** - Implement transaction tracking and financial visualization.
- [ ] **Phase 6: University & Academic Management** - Build course management and grade prediction tools.
- [ ] **Phase 7: AI Assistant & Quick Capture** - Integrate AI for natural language processing and assistant features.
- [ ] **Phase 8: Gamification Engine** - Develop the global XP, level, and rewards system.
- [ ] **Phase 9: Journaling & AI Reflection** - Create reflective tools with AI-generated summaries.
- [ ] **Phase 10: Performance Optimization & PWA** - Ensure high performance and offline capability.
- [ ] **Phase 11: Security Hardening & Polish** - Final security audits and accessibility refinements.

## Phase Details

### Phase 1: Project Scaffolding & Authentication
**Goal**: Establish a secure foundation for user data and application state.
**Depends on**: None
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria**:
  1. User can sign up with email/password and receive a confirmation email.
  2. User can log in and remain authenticated across browser sessions.
  3. User can securely reset a forgotten password via an email link.
  4. User can log out and be redirected to a public landing page.
**Plans**: 3 plans
- [x] 01-01-PLAN.md — Scaffolding & Supabase Setup
- [x] 01-02-PLAN.md — Auth UI & Backend Migration
- [x] 01-03-PLAN.md — Onboarding System

### Phase 2: Core Infrastructure & Dashboard Layout
**Goal**: Implement the primary user interface structure and widget system.
**Depends on**: Phase 1
**Requirements**: DASH-01, DASH-02
**Success Criteria**:
  1. User can view the 3-zone layout (Now/Today/Context) on the main dashboard.
  2. Dynamic widgets for Habits and Tasks are visible with "empty state" handling.
  3. Layout is responsive across mobile, tablet, and desktop views.
**Plans**: 2 plans
- [ ] 02-01-PLAN.md — Dashboard Infrastructure & Widgets
- [ ] 02-02-PLAN.md — 3-Zone Layout & Orchestration

### Phase 3: Habit Tracking System
**Goal**: Enable users to build and monitor daily habits with visual feedback.
**Depends on**: Phase 2
**Requirements**: HABIT-01, HABIT-02, HABIT-03, HABIT-04, HABIT-05
**Success Criteria**:
  1. User can create a new habit (check-off or quantified) and see it on the dashboard.
  2. Completing a habit triggers an optimistic UI update with immediate visual feedback.
  3. User can view a habit heatmap showing their consistency over the last 30 days.
  4. Streaks and completion rates update accurately in real-time.
**Plans**: TBD

### Phase 4: Task Management (Kanban)
**Goal**: Provide a flexible task organization system using a Kanban interface.
**Depends on**: Phase 2
**Requirements**: TASK-01, TASK-02, TASK-03, TASK-04
**Success Criteria**:
  1. User can create, edit, and delete tasks within a Kanban board.
  2. User can drag-and-drop tasks between "Todo", "In Progress", and "Done" columns.
  3. Task state persists correctly after a page reload.
  4. User can filter tasks by priority or due date without noticeable lag.
**Plans**: TBD

### Phase 5: Financial Management
**Goal**: Allow users to track their financial health and spending patterns.
**Depends on**: Phase 2
**Requirements**: FIN-01, FIN-02, FIN-03, FIN-04
**Success Criteria**:
  1. User can log income and expenses with associated categories and dates.
  2. Dashboard displays accurate summary cards for current balance and daily spending.
  3. User can view an interactive chart showing expense trends over time.
  4. Transaction history can be sorted by amount and filtered by date range.
**Plans**: TBD

### Phase 6: University & Academic Management
**Goal**: Centralize academic tracking and provide predictive grade analysis.
**Depends on**: Phase 2
**Requirements**: UNI-01, UNI-02, UNI-03, UNI-04
**Success Criteria**:
  1. User can manage courses and assignments with weights and grades.
  2. Individual course averages and overall GPA are calculated automatically.
  3. "What-If" simulator accurately predicts required grades for a specified GPA target.
  4. Assignment deadlines appear in the "Now" or "Today" dashboard zones.
**Plans**: TBD

### Phase 7: AI Assistant & Quick Capture
**Goal**: Integrate AI to reduce cognitive load via natural language input and smart insights.
**Depends on**: Phase 3, Phase 4, Phase 5
**Requirements**: DASH-03, AI-01, AI-02, AI-03
**Success Criteria**:
  1. User can create a task or habit using a single natural language sentence in "Quick Capture".
  2. AI correctly suggests categories for newly logged financial transactions.
  3. Floating AI chat interface responds to user productivity questions within 2 seconds.
  4. AI can provide context-aware insights based on current dashboard state.
**Plans**: TBD

### Phase 8: Gamification Engine
**Goal**: Increase user retention and engagement through rewards and leveling.
**Depends on**: Phase 3, Phase 4
**Requirements**: GAME-01, GAME-02, GAME-03
**Success Criteria**:
  1. Completing tasks and habits awards XP visible in the user's progress bar.
  2. Reaching XP milestones triggers a "Level Up" animation and state change.
  3. User can view a gallery of earned badges for long-term consistency milestones.
**Plans**: TBD

### Phase 9: Journaling & AI Reflection
**Goal**: Support mental health and self-improvement through reflection and AI analysis.
**Depends on**: Phase 2, Phase 7
**Requirements**: JOURN-01, JOURN-02, AI-04
**Success Criteria**:
  1. User can save a daily journal entry with a mood selection.
  2. AI generates a weekly summary of mood trends and productivity correlations.
  3. Journal entries are private and securely stored with encryption-at-rest.
**Plans**: TBD

### Phase 10: Performance Optimization & PWA
**Goal**: Ensure the application is fast, reliable, and accessible offline.
**Depends on**: Phase 1-9
**Requirements**: N/A (Derived from Constraints)
**Success Criteria**:
  1. Application achieves a Lighthouse performance score of 90 or higher.
  2. App is installable as a PWA on mobile and desktop devices.
  3. Core features (Habits/Tasks) work offline with synchronization upon reconnection.
**Plans**: TBD

### Phase 11: Security Hardening & Polish
**Goal**: Finalize the application with professional-grade security and accessibility.
**Depends on**: Phase 1-10
**Requirements**: N/A (Derived from Constraints)
**Success Criteria**:
  1. UI meets WCAG 2.1 Level AA accessibility standards.
  2. Security audit confirms zero high-risk vulnerabilities and strict CSP implementation.
  3. Rate limiting is active on all sensitive API endpoints.
**Plans**: TBD

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Scaffolding & Auth | 3/3 | Complete    | 2026-02-26 |
| 2. Core Infrastructure | 2/3 | In Progress|  |
| 3. Habit Tracking | 0/1 | Not started | - |
| 4. Task Management | 0/1 | Not started | - |
| 5. Financial Management | 0/1 | Not started | - |
| 6. University Management | 0/1 | Not started | - |
| 7. AI Assistant | 0/1 | Not started | - |
| 8. Gamification Engine | 0/1 | Not started | - |
| 9. Journaling & Reflection | 0/1 | Not started | - |
| 10. Performance & PWA | 0/1 | Not started | - |
| 11. Security & Polish | 0/1 | Not started | - |
