## ADDED Requirements

### Requirement: Sanctuary Mode Activation
The system SHALL provide a distraction-free focus mode that removes UI chrome.

#### Scenario: User enters Sanctuary Mode
- **WHEN** user clicks "Enter Sanctuary" on a task
- **OR** user invokes "Enter Sanctuary" from Synapse Bar
- **THEN** the Sidebar and Topbar fade out
- **AND** the selected task is displayed centered on screen
- **AND** `sanctuaryStore.isActive` is set to `true`

#### Scenario: User exits Sanctuary Mode
- **WHEN** user presses `Escape` key
- **OR** user clicks the exit button
- **THEN** the Sidebar and Topbar fade back in
- **AND** the user returns to normal view
- **AND** `sanctuaryStore.isActive` is set to `false`

---

### Requirement: Sanctuary Mode Audio
The system SHALL provide optional ambient audio using Web Audio API.

#### Scenario: White noise playback
- **WHEN** Sanctuary Mode is active
- **AND** user enables sound
- **THEN** white noise is generated using Web Audio API
- **AND** no external audio files are loaded

#### Scenario: Noise type selection
- **WHEN** Sanctuary Mode is active
- **THEN** user can select between white, pink, or brown noise
- **AND** the audio changes smoothly without interruption

#### Scenario: Audio fade transitions
- **WHEN** sound is enabled or disabled
- **THEN** audio volume fades over 500ms
- **AND** there are no abrupt audio changes

---

### Requirement: Sanctuary Mode Visual Design
The system SHALL display a minimalist focused view in Sanctuary Mode.

#### Scenario: Task centered display
- **WHEN** Sanctuary Mode is active
- **THEN** the current task is displayed centered vertically and horizontally
- **AND** background is `#050505` with subtle vignette
- **AND** task card has slight elevation and soft glow

#### Scenario: Minimal controls
- **WHEN** Sanctuary Mode is active
- **THEN** only essential controls are visible:
  - Exit button (top-right)
  - Sound toggle (bottom-right)
  - Sound type selector (if sound enabled)

---

### Requirement: Sanctuary Mode Keyboard Shortcuts
The system SHALL support keyboard navigation in Sanctuary Mode.

#### Scenario: Exit with Escape
- **WHEN** Sanctuary Mode is active
- **AND** user presses `Escape`
- **THEN** Sanctuary Mode exits immediately

#### Scenario: Toggle sound with keyboard
- **WHEN** Sanctuary Mode is active
- **AND** user presses `S` key
- **THEN** sound toggles on/off
