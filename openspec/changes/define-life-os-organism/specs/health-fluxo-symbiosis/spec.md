## ADDED Requirements
### Requirement: Task-Habit Links with Impact
The system SHALL allow linking Fluxo tasks to Health habits with explicit impact and cost metadata.

#### Scenario: Create symbiotic link
- **WHEN** a user links a task to a habit
- **THEN** they can set `impact_vital` (range -5..+5) and `custo_financeiro` (decimal)
- **AND** the link stores both references and notes
- **AND** the link is persisted in Supabase

#### Scenario: Edit or remove link
- **WHEN** a user edits an existing link
- **THEN** they can update impact or cost
- **AND** they can remove the link without deleting the task or habit

---

### Requirement: Impact Calculation and Signals
The system SHALL compute daily vital load and surface conflicts or wins from linked items.

#### Scenario: Daily vital load
- **WHEN** the day view loads
- **THEN** the system sums `impact_vital` for linked tasks/habits scheduled for the day
- **AND** shows a load indicator (e.g., balanced/overloaded) with a brief explanation

#### Scenario: Conflict detection
- **WHEN** a task marked high energy is linked to a negative impact habit on the same day
- **THEN** the system flags a conflict
- **AND** proposes a mitigating action (e.g., swap to lighter task or add recovery)

---

### Requirement: Cross-Surface Presentation
The system SHALL present symbiosis insights in Nexus/Agora and in task/habit detail views.

#### Scenario: Nexus summary
- **WHEN** Nexus loads
- **THEN** a compact card shows today’s vital load and top linked CTA (e.g., recovery)
- **AND** tapping the CTA opens the associated task or habit

#### Scenario: Detail view overlays
- **WHEN** viewing a linked task or habit
- **THEN** the UI shows linked counterpart(s), impact value, and cost
- **AND** provides a quick action to unlink or adjust impact without leaving the page
