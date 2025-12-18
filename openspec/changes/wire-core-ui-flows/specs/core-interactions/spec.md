## ADDED Requirements

### Requirement: Dashboard Reflects Live User Data
The dashboard SHALL render backend data for the authenticated user instead of static placeholders.

#### Scenario: Newly created records surface on dashboard
- **WHEN** the user creates a task, habit log, finance transaction, or journal entry via any UI entry point
- **THEN** the corresponding dashboard cards (agenda, habit consistency, finance summary, journal counts) refresh within 2 seconds via SSE or query invalidation
- **AND** the new record is visible without manually reloading the page

#### Scenario: Empty states with guidance
- **WHEN** a dashboard section has no data (e.g., no tasks due today, no finance entries)
- **THEN** the UI shows a meaningful empty state and a CTA to create the missing item

---

### Requirement: Dashboard Actions Persist Data
The primary dashboard CTA buttons SHALL perform real mutations and reflect the result in UI.

#### Scenario: Add task from dashboard
- **WHEN** the user clicks the dashboard "Add Task" action and submits a title/optional due date
- **THEN** a task is created for the authenticated user via the tasks API
- **AND** the new task appears in the "Today’s Mission"/agenda list immediately

#### Scenario: Complete task from dashboard
- **WHEN** the user toggles a task checkbox in the dashboard list
- **THEN** the backend updates the task’s completed status
- **AND** the dashboard list and any progress/Agora CTAs reflect the updated state

---

### Requirement: Symbiosis Links Are Manageable
The system SHALL allow linking tasks and habits (symbiosis) and surface the links in vitality cards.

#### Scenario: Create symbiosis link
- **WHEN** the user selects a task and habit to link and sets impact/notes
- **THEN** a row is stored in `task_habit_links` for that user
- **AND** the vital load/symbiosis section on the dashboard updates to include the link

#### Scenario: Remove symbiosis link
- **WHEN** the user removes a link from the UI
- **THEN** the corresponding record is deleted/soft-deleted for that user
- **AND** the link disappears from the dashboard and related calculations
