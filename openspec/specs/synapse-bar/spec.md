# synapse-bar Specification

## Purpose
TBD - created by archiving change add-synapse-bar. Update Purpose after archive.
## Requirements
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
The system SHALL render the Synapse Bar with "Deep Glass" aesthetic.

#### Scenario: Synapse Bar displays with Neural Nexus styling
- **WHEN** Synapse Bar opens
- **THEN** the dialog has:
  - Background: `bg-[#0A0A0B]/90` (polished obsidian)
  - Backdrop blur: `backdrop-blur-2xl`
  - Border: `border border-white/10`
  - Shadow: `shadow-2xl shadow-black/50`
  - Ring: `ring-1 ring-white/5`
  - Max width: `640px` (max-w-2xl)
  - Rounded corners: `rounded-2xl`

#### Scenario: Input field displays spotlight-style
- **WHEN** Synapse Bar opens
- **THEN** the input field has:
  - Height: `h-14`
  - Font size: `text-lg`
  - No visible border
  - Transparent background

#### Scenario: Selected command shows visual feedback
- **WHEN** a command is selected via keyboard or hover
- **THEN** the command displays subtle highlight background (`bg-white/10`)
- **AND** transition is smooth (no jarring state changes)

---

### Requirement: Synapse Bar Context HUD
The system SHALL display a context awareness header showing environmental data.

#### Scenario: Context HUD displays weather information
- **WHEN** Synapse Bar opens
- **THEN** a header bar appears above the input
- **AND** it displays weather information (temperature + condition)
- **AND** uses a CloudRain icon with `text-blue-400/80` styling

#### Scenario: Context HUD displays focus status
- **WHEN** Synapse Bar opens
- **THEN** the header displays focus percentage
- **AND** uses an Activity icon with `text-emerald-400/80` styling

#### Scenario: Context HUD displays market data
- **WHEN** Synapse Bar opens
- **THEN** the header displays Bitcoin price
- **AND** uses a Bitcoin icon with `text-amber-500/80` styling
- **AND** the value is displayed in `font-mono` for tabular alignment

---

### Requirement: Synapse Bar Tactile Feedback
The system SHALL provide BentoCard-style hover physics on command items.

#### Scenario: Command item shows hover feedback
- **WHEN** user hovers over a command item
- **THEN** the item background transitions to `bg-white/5`
- **AND** the icon color transitions to `text-zinc-300`

#### Scenario: Command item shows selection feedback
- **WHEN** a command item is selected via keyboard
- **THEN** the item background shows `bg-white/10`
- **AND** the text color brightens to `text-zinc-50`

---

### Requirement: Synapse Bar Keyboard Legend
The system SHALL display a footer with keyboard shortcut hints.

#### Scenario: Footer displays navigation hints
- **WHEN** Synapse Bar is open
- **THEN** a footer bar appears below the command list
- **AND** it displays hints for `↵` (select) and `esc` (close)
- **AND** keyboard hints use styled `kbd` elements with `bg-white/5`

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


