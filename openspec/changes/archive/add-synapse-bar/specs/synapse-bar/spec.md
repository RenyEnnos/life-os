## ADDED Requirements

### Requirement: Synapse Bar Global Access
The system SHALL provide a global Command Palette accessible from any page via keyboard shortcut.

#### Scenario: User opens Synapse Bar with keyboard shortcut
- **WHEN** user presses `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
- **THEN** the Synapse Bar dialog appears centered on screen with focus trap enabled
- **AND** the search input receives focus automatically

#### Scenario: User closes Synapse Bar with escape key
- **WHEN** Synapse Bar is open
- **AND** user presses `Escape`
- **THEN** the dialog closes
- **AND** focus returns to previously focused element

#### Scenario: User closes Synapse Bar by clicking outside
- **WHEN** Synapse Bar is open
- **AND** user clicks outside the dialog
- **THEN** the dialog closes

---

### Requirement: Synapse Bar Search Functionality
The system SHALL provide real-time fuzzy search across all commands.

#### Scenario: User searches for a command
- **WHEN** user types in the search input
- **THEN** commands are filtered in real-time using fuzzy matching
- **AND** matching results are highlighted
- **AND** results are grouped by category (Actions, Missions, Rituals, Resources, Memory, Nexus)

#### Scenario: User searches with no results
- **WHEN** user search query matches no commands
- **THEN** the system displays "No results found" message
- **AND** suggests invoking Nexus for AI assistance

---

### Requirement: Synapse Bar Keyboard Navigation
The system SHALL support full keyboard navigation within the command palette.

#### Scenario: User navigates commands with arrow keys
- **WHEN** Synapse Bar is open with visible commands
- **AND** user presses `ArrowDown`
- **THEN** selection moves to next command
- **AND** selected command is visually highlighted

#### Scenario: User executes command with Enter
- **WHEN** a command is selected
- **AND** user presses `Enter`
- **THEN** the command action is executed
- **AND** the Synapse Bar closes

---

### Requirement: Synapse Bar Command Groups
The system SHALL organize commands into semantic groups aligned with Life OS nomenclature.

#### Scenario: Commands are grouped by domain
- **WHEN** Synapse Bar displays commands
- **THEN** commands are organized into the following groups:
  - **Actions**: Task-related commands
  - **Missions**: Project-related commands
  - **Rituals**: Habit-related commands
  - **Resources**: Finance-related commands
  - **Memory**: Journal-related commands
  - **Nexus**: AI assistant commands
- **AND** each group has a visible header label

---

### Requirement: Synapse Bar Visual Design
The system SHALL render the Synapse Bar with "Glass & Void" aesthetic.

#### Scenario: Synapse Bar displays with correct styling
- **WHEN** Synapse Bar opens
- **THEN** the dialog has:
  - Background: semi-transparent dark (`rgba(15, 15, 15, 0.85)`)
  - Backdrop blur: `20px`
  - Border: `1px solid rgba(255, 255, 255, 0.08)`
  - Typography: Geist Sans font family
  - Max width: `640px`
  - Max height: `400px`

#### Scenario: Selected command shows visual feedback
- **WHEN** a command is selected via keyboard or hover
- **THEN** the command displays subtle highlight background (`rgba(255, 255, 255, 0.06)`)
- **AND** transition is smooth (no jarring state changes)

---

### Requirement: Synapse Bar State Management
The system SHALL manage Synapse Bar state through Zustand store.

#### Scenario: Opening Synapse Bar updates store state
- **WHEN** Synapse Bar opens via shortcut
- **THEN** `synapseStore.isOpen` is set to `true`
- **AND** `synapseStore.query` is reset to empty string

#### Scenario: Closing Synapse Bar resets state
- **WHEN** Synapse Bar closes
- **THEN** `synapseStore.isOpen` is set to `false`
- **AND** `synapseStore.query` is preserved for next open (optional UX enhancement)
