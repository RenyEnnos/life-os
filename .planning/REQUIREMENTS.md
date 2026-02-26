# Requirements: Life OS

**Defined:** 2026-02-26
**Core Value:** A unified, gamified, and AI-powered personal productivity system that reduces cognitive load by centralizing all aspects of life management in one place.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication (AUTH)

- [ ] **AUTH-01**: User can sign up with email and password.
- [ ] **AUTH-02**: User can log in and maintain a persistent session.
- [ ] **AUTH-03**: User can log out and clear session data.
- [ ] **AUTH-04**: User can reset password via email link.

### Dashboard (DASH)

- [ ] **DASH-01**: User can view a 3-zone layout: Now (Urgent), Today (Habits/Tasks), and Context (Finances/Insights).
- [ ] **DASH-02**: User can view dynamic widgets for health metrics, habits, and tasks.
- [ ] **DASH-03**: User can access "Quick Capture" from anywhere on the dashboard.

### Habits (HABIT)

- [ ] **HABIT-01**: User can create, edit, and delete daily habits.
- [ ] **HABIT-02**: User can mark a habit as complete with optimistic UI updates.
- [ ] **HABIT-03**: User can view a habit heatmap for consistency visualization.
- [ ] **HABIT-04**: User can track habits with streaks and analytics (completion rate).
- [ ] **HABIT-05**: User can track quantified habits (e.g., pages read, km run).

### Tasks (TASK)

- [ ] **TASK-01**: User can manage tasks via a Kanban board (Todo, In Progress, Done).
- [ ] **TASK-02**: User can create tasks with title, description, due date, and priority.
- [ ] **TASK-03**: User can drag tasks between columns with persistent state.
- [ ] **TASK-04**: User can filter tasks by priority or due date.

### Finances (FIN)

- [ ] **FIN-01**: User can log income and expense transactions with date and amount.
- [ ] **FIN-02**: User can view a transaction history list (sortable/filterable).
- [ ] **FIN-03**: User can view summary cards for balance, daily spend, and budget status.
- [ ] **FIN-04**: User can view visual charts (area, donut, bar) of financial trends.

### University (UNI)

- [ ] **UNI-01**: User can manage course cards with current average grades.
- [ ] **UNI-02**: User can manage assignments with due dates, weights, and grades.
- [ ] **UNI-03**: User can calculate current GPA/Average per course automatically.
- [ ] **UNI-04**: User can use a "What-If" simulator to predict grades needed for targets.

### AI Assistant (AI)

- [ ] **AI-01**: User can use a floating chat interface for insights and planning.
- [ ] **AI-02**: User can use "Quick Capture" with AI parsing of natural language inputs.
- [ ] **AI-03**: AI suggests categories for financial transactions automatically.
- [ ] **AI-04**: AI generates weekly summaries of habits and task completion.

### Gamification (GAME)

- [ ] **GAME-01**: User earns XP/Points for completing tasks and habits.
- [ ] **GAME-02**: User can view current Level and progress towards next level.
- [ ] **GAME-03**: User earns streaks and badges for long-term consistency.

### Journal (JOURN)

- [ ] **JOURN-01**: User can write daily reflections and track mood.
- [ ] **JOURN-02**: AI generates daily/weekly journal summaries.

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

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01..04 | Phase 1 | Pending |
| DASH-01..03 | Phase 1 | Pending |
| HABIT-01..05| Phase 1 | Pending |
| TASK-01..04 | Phase 1 | Pending |
| FIN-01..04  | Phase 2 | Pending |
| UNI-01..04  | Phase 2 | Pending |
| AI-01..04   | Phase 3 | Pending |
| GAME-01..03 | Phase 4 | Pending |
| JOURN-01..02| Phase 4 | Pending |

**Coverage:**
- v1 requirements: 32 total
- Mapped to phases: 32
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-26*
*Last updated: 2026-02-26 after initial definition*
