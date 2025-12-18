## ADDED Requirements
### Requirement: Agora Day-Part States
Nexus SHALL render an Agora section that adapts its content to the current day-part to reduce decision paralysis.

#### Scenario: Morning focus and ritual
- **WHEN** the user opens Nexus between 05:00 and 11:59
- **THEN** Agora shows a morning state with cool monochrome glow
- **AND** surfaces two CTAs: the top focus task from Fluxo (time_block = morning or any) and one ritual/habit from Health
- **AND** both CTAs appear with a smooth entrance animation under 200ms

#### Scenario: Afternoon execution and recovery
- **WHEN** the user opens Nexus between 12:00 and 17:59
- **THEN** Agora shows an execution state
- **AND** surfaces a pair of CTAs: execution task queue (Fluxo) and a micro-break or hydration nudge (Health)
- **AND** completed CTAs trigger a light haptic-style animation (framer-motion spring, <250ms)

#### Scenario: Night reflection and unwind
- **WHEN** the user opens Nexus at or after 18:00
- **THEN** Agora shows a night state
- **AND** surfaces a reflection CTA (journal/summary) and a wind-down ritual (Sanctuary/Health)
- **AND** tasks marked high energy are deprioritized in the CTA slot

---

### Requirement: Decisionless CTAs
Nexus SHALL present at most three actionable CTAs in Agora, prioritized by Synapse signals, to minimize choice load.

#### Scenario: CTA stack driven by Synapse
- **WHEN** Synapse provides ordered suggestions
- **THEN** Agora displays the top three CTAs with a primary action each (no nested menus)
- **AND** each CTA includes a short rationale (≤80 chars) indicating context (e.g., “Based on morning focus”)
- **AND** if Synapse is unavailable, Agora falls back to static defaults (focus task, hydration, reflection)

---

### Requirement: Deep Glass OLED Presentation
Agora SHALL follow the “A Estética do Silêncio” visual language with Deep Glass layers on OLED black.

#### Scenario: Glassmorphism baseline
- **WHEN** Agora is rendered
- **THEN** the background is pure black (`#000`)
- **AND** cards use glass layers (`bg-white/5`, `backdrop-blur-3xl`, `border-white/10`, `shadow-black/50`)
- **AND** accent colors are low-chroma monochrome; no flat white backgrounds are shown

#### Scenario: Motion and accessibility
- **WHEN** user has reduced-motion enabled
- **THEN** animations degrade to opacity-only transitions under 150ms
- **AND** layout remains responsive on mobile and desktop without overlap or clipped content
