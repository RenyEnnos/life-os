## MODIFIED Requirements
### Requirement: Sanctuary Mode Audio
The system SHALL provide optional ambient audio using Web Audio API and binaural focus/relax presets.

#### Scenario: Noise playback
- **WHEN** Sanctuary Mode is active
- **AND** user enables sound
- **THEN** white, pink, or brown noise can be generated using Web Audio API
- **AND** no external audio files are loaded for noise

#### Scenario: Binaural focus or relaxation
- **WHEN** Sanctuary Mode is active
- **AND** user selects a binaural preset (Focus or Relax)
- **THEN** a stereo binaural pattern plays in a loop
- **AND** switching between noise and binaural presets crossfades without clicks

#### Scenario: Audio fade transitions
- **WHEN** sound is enabled or disabled
- **THEN** audio volume fades over 500ms
- **AND** there are no abrupt audio changes

---

### Requirement: Sanctuary Mode Visual Design
The system SHALL display a monochrome Deep Glass focused view in Sanctuary Mode.

#### Scenario: Task centered display
- **WHEN** Sanctuary Mode is active
- **THEN** the current task is displayed centered vertically and horizontally
- **AND** background is pure black (`#000`) with soft vignette and glass overlay (`backdrop-blur-3xl`, `border-white/10`)
- **AND** task card uses minimal monochrome accent without color noise

#### Scenario: Minimal controls
- **WHEN** Sanctuary Mode is active
- **THEN** only essential controls are visible:
  - Exit button (top-right)
  - Sound toggle (bottom-right) with noise/binaural selector
  - Reduce-motion friendly animations (opacity/scale under 150ms)

#### Scenario: Calm transitions
- **WHEN** entering or exiting Sanctuary
- **THEN** UI uses liquid fade/blur transitions under 300ms
- **AND** no distracting chrome or notifications appear
