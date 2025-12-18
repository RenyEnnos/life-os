## ADDED Requirements
### Requirement: Context-Aware Suggestions
Synapse SHALL generate ranked suggestions that blend time-of-day, task state, health signals, and inferred mood.

#### Scenario: Morning resonance
- **WHEN** the current time is morning (05:00-11:59)
- **AND** user has open focus tasks in Fluxo
- **THEN** Synapse returns at least one focus suggestion and one ritual/habit suggestion
- **AND** each suggestion includes a reason referencing time-of-day and task metadata

#### Scenario: Mood-aware adjustment
- **WHEN** Synapse detects a low-energy or calm mood from recent inputs
- **THEN** it prioritizes lower-intensity or recovery CTAs
- **AND** de-emphasizes high-energy tasks unless explicitly requested

---

### Requirement: Gemini NLP Pipeline
Synapse SHALL use Gemini to transform natural language inputs into structured intents and suggestion candidates.

#### Scenario: Intent extraction
- **WHEN** user submits free-form text to Synapse
- **THEN** the system calls Gemini with a prompt that requests intent, mood, and priority cues
- **AND** receives structured output with intent labels and confidence
- **AND** logs the request/response metadata (without PII)

#### Scenario: Model fallback
- **WHEN** Gemini is unreachable or times out
- **THEN** Synapse falls back to a local heuristic (time + task queue + health signals)
- **AND** returns suggestions within 1s budget

---

### Requirement: Safety, Latency, and Fallback
Synapse SHALL enforce guardrails for cost, latency, and content quality.

#### Scenario: Rate limiting and caching
- **WHEN** more than three NLP requests occur within 30 seconds for a user
- **THEN** further requests are throttled
- **AND** the last valid response is reused for up to 2 minutes

#### Scenario: Response quality checks
- **WHEN** Gemini returns content
- **THEN** the system filters unsafe or irrelevant suggestions (empty title, >120 chars rationale)
- **AND** drops any suggestion without a valid action target

---

### Requirement: Telemetry and Feedback Loop
Synapse SHALL capture user feedback on suggestions to refine ordering.

#### Scenario: Accept/skip logging
- **WHEN** a user accepts or dismisses a suggestion
- **THEN** the event is logged with suggestion id, context (time, mood flag, surface)
- **AND** future suggestion ordering can down-rank consistently dismissed patterns

#### Scenario: Minimal session summary
- **WHEN** a user completes a session (e.g., closes Nexus or Synapse)
- **THEN** Synapse records a brief session summary (counts of accepted/dismissed)
- **AND** this summary is available for analytics dashboards
