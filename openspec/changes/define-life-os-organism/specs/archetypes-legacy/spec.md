## ADDED Requirements
### Requirement: Archetype Assignment
The system SHALL assign an archetype based on behavioral signals and update it as patterns change.

#### Scenario: Initial archetype selection
- **WHEN** a user reaches a minimum activity threshold (e.g., completes 5 tasks + 3 habits in a week)
- **THEN** the system assigns an archetype using signals (focus depth, ritual consistency, recovery balance)
- **AND** shows a short description and next-step suggestion

#### Scenario: Archetype drift
- **WHEN** behavior shifts for at least 7 days (e.g., drop in rituals, rise in execution tasks)
- **THEN** the archetype recalculates
- **AND** the user is notified of the transition with rationale

---

### Requirement: Visual Legacy Gallery
The system SHALL render a generative gallery representing progress and archetype state.

#### Scenario: Milestone render
- **WHEN** a user hits a milestone (e.g., weekly streak, archetype transition)
- **THEN** a new generative piece is added to Legacy
- **AND** the piece metadata includes date, archetype, and key signals used

#### Scenario: Lightweight rendering
- **WHEN** the gallery loads
- **THEN** generative pieces render client-side (canvas/SVG) without heavy assets
- **AND** loading stays under 1.5s on mid-tier devices

---

### Requirement: Feedback Loop to Synapse
The system SHALL feed archetype and progression signals into Synapse for better suggestions.

#### Scenario: Suggestion conditioning
- **WHEN** Synapse prepares suggestions
- **THEN** it includes current archetype and recent streak data in the prompt/context
- **AND** suggestion rationales can reference archetype-aware goals (e.g., “for Navigator, prioritize focus sprints”)
