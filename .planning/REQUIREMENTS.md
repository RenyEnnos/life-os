# Requirements: Life OS

**Defined:** 2026-02-26
**Core Value:** A unified, gamified, and AI-powered personal productivity system that reduces cognitive load by centralizing all aspects of life management in one place.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication (AUTH)

- [x] **AUTH-01**: User can sign up with email and password.
- [x] **AUTH-02**: User can log in and maintain a persistent session.
- [x] **AUTH-03**: User can log out and clear session data.
- [x] **AUTH-04**: User can reset password via email link.

### Dashboard (DASH)

- [x] **DASH-01**: User can view a 3-zone layout: Now (Urgent), Today (Habits/Tasks), and Context (Finances/Insights).
- [x] **DASH-02**: User can view dynamic widgets for health metrics, habits, and tasks.
- [x] **DASH-03**: User can access "Quick Capture" from anywhere on the dashboard.

### Habits (HABIT)

- [x] **HABIT-01**: User can create, edit, and delete daily habits.
- [x] **HABIT-02**: User can mark a habit as complete with optimistic UI updates.
- [x] **HABIT-03**: User can view a habit heatmap for consistency visualization.
- [x] **HABIT-04**: User can track habits with streaks and analytics (completion rate).
- [x] **HABIT-05**: User can track quantified habits (e.g., pages read, km run).

### Tasks (TASK)

- [x] **TASK-01**: User can manage tasks via a Kanban board (Todo, In Progress, Done).
- [x] **TASK-02**: User can create tasks with title, description, due date, and priority.
- [x] **TASK-03**: User can drag tasks between columns with persistent state.
- [x] **TASK-04**: User can filter tasks by priority or due date.

### Finances (FIN)

- [x] **FIN-01**: User can log income and expense transactions with date and amount.
- [x] **FIN-02**: User can view a transaction history list (sortable/filterable).
- [x] **FIN-03**: User can view summary cards for balance, daily spend, and budget status.
- [x] **FIN-04**: User can view visual charts (area, donut, bar) of financial trends.

### University (UNI)

- [x] **UNI-01**: User can manage course cards with current average grades.
- [x] **UNI-02**: User can manage assignments with due dates, weights, and grades.
- [x] **UNI-03**: User can calculate current GPA/Average per course automatically.
- [x] **UNI-04**: User can use a "What-If" simulator to predict grades needed for targets.

### AI Assistant (AI)

- [x] **AI-01**: User can use a floating chat interface for insights and planning.
- [x] **AI-02**: User can use "Quick Capture" with AI parsing of natural language inputs.
- [x] **AI-03**: AI suggests categories for financial transactions automatically.
- [x] **AI-04**: AI generates weekly summaries of habits and task completion.

### Gamification (GAME)

- [x] **GAME-01**: User earns XP/Points for completing tasks and habits.
- [x] **GAME-02**: User can view current Level and progress towards next level.
- [x] **GAME-03**: User earns streaks and badges for long-term consistency.

### Journal (JOURN)

- [x] **JOURN-01**: User can write daily reflections and track mood.
- [x] **JOURN-02**: AI generates daily/weekly journal summaries.

## Milestone 3: UX & Gems Evolution (GEMS)

- [ ] **GEMS-01**: Refactor finance and habit dashboards using **Tremor** for a premium SaaS aesthetic.
- [ ] **GEMS-02**: Implement **React Hook Form + Zod** validation across all forms (Tasks, Finances, Auth).
- [ ] **GEMS-03**: Implement **Hybrid Task Views** with a toggle between List and Kanban using `dnd-kit`.
- [x] **GEMS-04**: Consolidate Profile, Settings, and Account into a single **Unified User Hub**.
- [ ] **GEMS-05**: Enhance micro-interactions (completion bursts, page transitions) with **Framer Motion**.
- [ ] **GEMS-06**: Implement contextual **Canvas Confetti** rewards for habit and task completion.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

- **AUTH-05**: OAuth integration (Google, GitHub).
- **FIN-05**: Bank sync/import via Plaid or similar.
- **AI-05**: Local LLM support for private journal insights (e.g., WebLLM).
- **GAME-04**: "Character" avatar that evolves with user productivity.
- **SOCIAL-01**: Private sharing of progress with a "buddy" (Accountability partner).

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time chat | High complexity, distracts from personal focus. |
| Video hosting | High costs, use external links instead. |
| Collaboration | This is a *Personal* OS; no team features. |
| Native App | PWA is sufficient for v1 cross-platform needs. |

## Traceability

Which phases cover which requirements.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | ✓ |
| AUTH-02 | Phase 1 | ✓ |
| AUTH-03 | Phase 1 | ✓ |
| AUTH-04 | Phase 1 | ✓ |
| DASH-01 | Phase 2 | ✓ |
| DASH-02 | Phase 2 | ✓ |
| DASH-03 | Phase 7 | ✓ |
| HABIT-01 | Phase 3 | ✓ |
| HABIT-02 | Phase 3 | ✓ |
| HABIT-03 | Phase 3 | ✓ |
| HABIT-04 | Phase 3 | ✓ |
| HABIT-05 | Phase 3 | ✓ |
| TASK-01 | Phase 4 | ✓ |
| TASK-02 | Phase 4 | ✓ |
| TASK-03 | Phase 4 | ✓ |
| TASK-04 | Phase 4 | ✓ |
| FIN-01 | Phase 5 | ✓ |
| FIN-02 | Phase 5 | ✓ |
| FIN-03 | Phase 5 | ✓ |
| FIN-04 | Phase 5 | ✓ |
| UNI-01 | Phase 6 | ✓ |
| UNI-02 | Phase 6 | ✓ |
| UNI-03 | Phase 6 | ✓ |
| UNI-04 | Phase 6 | ✓ |
| AI-01 | Phase 7 | ✓ |
| AI-02 | Phase 7 | ✓ |
| AI-03 | Phase 7 | ✓ |
| AI-04 | Phase 9 | ✓ |
| GAME-01 | Phase 8 | ✓ |
| GAME-02 | Phase 8 | ✓ |
| GAME-03 | Phase 8 | ✓ |
| JOURN-01 | Phase 9 | ✓ |
| JOURN-02 | Phase 9 | ✓ |
| GEMS-01 | Phase 12 | Pending |
| GEMS-02 | Phase 13 | Pending |
| GEMS-03 | Phase 14 | Pending |
| GEMS-04 | Phase 15 | Complete |
| GEMS-05 | Phase 16 | Pending |
| GEMS-06 | Phase 16 | Pending |

**Coverage:**
- v1 requirements: 32 total (100% complete)
- Milestone 3 requirements: 6 total
- Mapped to phases: 38
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-26*
*Last updated: 2026-03-02 after Milestone 2 Completion*
