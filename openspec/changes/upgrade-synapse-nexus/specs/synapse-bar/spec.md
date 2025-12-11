# synapse-bar Specification Delta

## MODIFIED Requirements

### Requirement: Synapse Bar Visual Design (Updated)
The system SHALL render the Synapse Bar with "Deep Glass" aesthetic (upgrade from "Glass & Void").

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

---

## ADDED Requirements

### Requirement: Synapse Bar Context HUD
The system SHALL display a context awareness header showing real-time (or mock) environmental data.

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
