# Neural Resonance Requirements

## ADDED Requirements

### REQ-NR-001: Async Analysis Trigger
**When** user saves a journal entry  
**Then** system triggers background AI analysis  
**And** user does not wait for analysis to complete

#### Scenarios
- Entry saved → analysis job queued
- Analysis completes → results stored in `journal_insights`
- Analysis fails → silent failure with console log, no user impact

---

### REQ-NR-002: Mood Detection
**Given** a journal entry with text content  
**When** analysis runs  
**Then** system extracts mood score (0-10)  
**And** stores insight with type='mood'

#### Scenarios
- Entry: "Hoje foi um dia incrível" → mood_score: 8-10
- Entry: "Me sinto exausto e frustrado" → mood_score: 2-4
- Entry minimal/empty → skip mood analysis

---

### REQ-NR-003: Resonance Panel Display
**Given** user is on Journal page  
**When** insights exist for displayed entry  
**Then** show Resonance panel with:
  - Current mood indicator
  - Theme tags extracted
  - Trend compared to last 7 days

#### Scenarios
- No insights yet → show "Analisando..." loading state
- Insights loaded → display formatted content
- Error state → hide panel gracefully

---

### REQ-NR-004: Weekly Synthesis
**Given** user has 3+ entries in past 7 days  
**When** user opens Journal page  
**Then** show weekly resonance summary card
**And** highlight patterns or concerns

#### Scenarios
- Sufficient data → show synthesis
- Insufficient data → show "Continue escrevendo para ver padrões"

---

### REQ-NR-005: Rate Limiting
**Given** an entry already analyzed today  
**When** entry is updated  
**Then** skip re-analysis until next day

#### Scenarios
- First save of day → analyze
- Second save same day → skip
- Next day → analyze again allowed
