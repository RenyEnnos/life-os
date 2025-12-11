# dashboard-widgets Specification

## Purpose
TBD - created by archiving change refine-dashboard-deep-glass. Update Purpose after archive.
## Requirements
### Requirement: Zone1 Focus Display
The Zone1_Now component MUST display a "Current Focus" card with immersive presentation.

#### Scenario: Focus card displays correctly
**Given** the Dashboard is loaded  
**When** Zone1_Now is rendered  
**Then** the following elements MUST be visible:
- Title "Current Focus" with Activity icon in emerald-500
- Task title with large typography (2xl-3xl)
- Timer display with mono-spaced tabular numbers
- Play/Pause and FastForward control buttons
- Atmospheric background decoration (emerald blur)

#### Scenario: Timer uses tabular-nums
**Given** the timer is displayed  
**When** the time value changes  
**Then** the digits MUST NOT cause visual jitter (using `font-mono tabular-nums`)

---

### Requirement: Zone2 Task List
The Zone2_Today component MUST display "Today's Mission" as a clean task list.

#### Scenario: Task list displays with proper styling
**Given** the Dashboard is loaded  
**When** Zone2_Today is rendered  
**Then** the following styling MUST be applied:
- Card uses `noPadding` for edge-to-edge content
- Each task has `border-b border-white/5` separator (except last)
- Tasks display checkbox, title, time, and semantic tag

#### Scenario: Task hover interaction
**Given** a task item in the list  
**When** the user hovers over the task  
**Then** the background MUST change to `bg-white/[0.02]` AND the checkbox border MUST transition to `blue-500/50`

---

### Requirement: Zone3 Context Cards
The Zone3_Context component MUST display Weather and Finance sub-cards with semantic coloring.

#### Scenario: Weather card displays correctly
**Given** the Dashboard is loaded  
**When** Zone3_Context is rendered  
**Then** the Weather card MUST have:
- Blue atmospheric styling (`bg-blue-950/20`, `border-blue-500/10`)
- CloudRain icon and location label
- Temperature display with `tabular-nums`
- Weather condition text

#### Scenario: Finance card displays correctly
**Given** the Dashboard is loaded  
**When** Zone3_Context is rendered  
**Then** the Finance card MUST have:
- Green financial styling (`bg-emerald-950/20`, `border-emerald-500/10`)
- TrendingUp icon and markets label
- Portfolio value with `tabular-nums font-mono`
- Percentage change indicator with directional arrow

#### Scenario: Context card hover interaction
**Given** a context sub-card (Weather or Finance)  
**When** the user hovers over the card  
**Then** the border color MUST intensify (`hover:!border-{color}-500/20`)

