## ADDED Requirements

### Requirement: Dynamic Now Task Filtering
The system SHALL provide context-aware filtering of tasks based on time of day and energy levels.

#### Scenario: High-energy tasks hidden after 6pm
- **WHEN** the current time is 18:00 or later
- **AND** Dynamic Now filtering is enabled
- **THEN** tasks with `energy_level = 'high'` are hidden from the task list
- **AND** a count of hidden tasks is displayed

#### Scenario: Morning tasks prioritized in morning
- **WHEN** the current time is before 12:00
- **AND** Dynamic Now filtering is enabled
- **THEN** tasks with `time_block = 'morning'` are shown first
- **AND** tasks with `time_block = 'any'` are also shown

#### Scenario: User disables Dynamic Now
- **WHEN** the user toggles Dynamic Now off
- **THEN** all tasks are shown regardless of energy level or time block
- **AND** no filtering is applied

---

### Requirement: Task Energy Level Attribute
The system SHALL allow users to assign an energy level to each task.

#### Scenario: Creating task with energy level
- **WHEN** user creates a new task
- **THEN** they can select energy level: 'high', 'low', or 'any'
- **AND** default value is 'any'

#### Scenario: Editing task energy level
- **WHEN** user edits an existing task
- **THEN** they can change the energy level
- **AND** the change is persisted immediately

---

### Requirement: Task Time Block Attribute
The system SHALL allow users to assign a preferred time block to each task.

#### Scenario: Creating task with time block
- **WHEN** user creates a new task
- **THEN** they can select time block: 'morning', 'afternoon', 'evening', or 'any'
- **AND** default value is 'any'

---

### Requirement: Dynamic Now Toggle
The system SHALL provide a toggle to enable/disable Dynamic Now filtering.

#### Scenario: Toggle visibility on Horizon
- **WHEN** user views the Horizon (Dashboard)
- **THEN** a toggle switch for Dynamic Now is visible
- **AND** the toggle reflects the current enabled state

#### Scenario: Toggle persistence
- **WHEN** user toggles Dynamic Now on or off
- **THEN** the preference is saved to localStorage
- **AND** persists across browser sessions

---

### Requirement: Filtering Transparency
The system SHALL inform users when tasks are hidden by Dynamic Now.

#### Scenario: Hidden tasks notification
- **WHEN** Dynamic Now hides one or more tasks
- **THEN** a message is displayed: "X tasks hidden (high energy after 6pm)"
- **AND** user can click to see or temporarily show hidden tasks
