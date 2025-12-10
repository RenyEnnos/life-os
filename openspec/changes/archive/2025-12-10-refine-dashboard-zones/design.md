# Design: Deep Glass Dashboard Refinement

## Core components

### Zone 1: The Now (Focus)
-   **Visual Metaphor**: "Active Crystal". High clarity, slight tint, interactive controls.
-   **Typography**: `font-mono tabular-nums` for time comparisons/counters to ensure stability.
-   **Interactions**:
    -   Play/Pause: Primary action, scaling heavy button.
    -   FastForward: Secondary, ghost button.
-   **Layout**: `col-span-1 md:col-span-2` for prominence.

### Zone 2: Today (Missions)
-   **Visual Metaphor**: "Log". Linear, orderly, high contrast text on dark background.
-   **Structure**: `BentoCard` with `noPadding`.
-   **Items**:
    -   `border-b border-white/5` for separation (no nested boxes).
    -   Full width hover effects (`hover:bg-white/[0.02]`).

### Zone 3: Context (Horizon)
-   **Visual Metaphor**: "Sensors". Smaller, specific data points with semantic coloring.
-   **Colors**:
    -   **Weather**: Blue spectrum (`bg-blue-950/20`, text-blue-400`).
    -   **Finance**: Emerald spectrum (`bg-emerald-950/20`, `text-emerald-400`).
-   **Layout**: Grid of mini-cards.

## Code Reference (Provided in Prompt)

### Zone 1 Implementation
```tsx
<BentoCard className="col-span-1 md:col-span-2 relative overflow-hidden h-full min-h-[180px]" ...>
  {/* Content */}
  <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
</BentoCard>
```

### Context Implementation
```tsx
<div className="grid grid-cols-2 gap-4 h-full">
  <BentoCard className="col-span-1 !bg-blue-950/20 ..." />
  <BentoCard className="col-span-1 !bg-emerald-950/20 ..." />
</div>
```
