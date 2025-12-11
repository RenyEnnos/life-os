# Design – Deep Glass Dashboard Widgets

## Architectural Overview

The Dashboard serves as the central "Glass Cockpit" of Life OS. This design document captures the visual and interaction patterns for the three primary zones.

## Visual Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│  ZONE 1 - "Now" (2 cols, dominant)                      │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Current Focus          ▸ 00:24:12  [⏩] [▶]         ││
│  │ Refactor Dashboard UI                               ││
│  └─────────────────────────────────────────────────────┘│
├─────────────────┬───────────────────────────────────────┤
│  ZONE 2 (1 col) │  ZONE 3 - Context (2 cols)            │
│  Today's Mission│  ┌──────────┬──────────┐              │
│  ☐ Task 1       │  │ Weather  │ Finance  │              │
│  ☐ Task 2       │  │ 18° Rain │ $94.2k   │              │
│  ☐ Task 3       │  └──────────┴──────────┘              │
└─────────────────┴───────────────────────────────────────┘
```

## Design Decisions

### Typography
- **Timers & Numbers**: Use `font-mono tabular-nums` to prevent visual jitter during updates
- **Labels**: Uppercase with `tracking-wider text-[10px]` for technical aesthetic
- **Titles**: `text-2xl font-semibold tracking-tight` for hierarchy

### Semantic Colors
| Context  | Background          | Border              | Text               |
|----------|---------------------|---------------------|--------------------| 
| Focus    | `emerald-500/5`     | default             | `emerald-500`      |
| Mission  | `blue-500/10`       | `blue-500/20`       | `blue-400`         |
| Weather  | `blue-950/20`       | `blue-500/10`       | `blue-100/400`     |
| Finance  | `emerald-950/20`    | `emerald-500/10`    | `emerald-100/400`  |

### Micro-interactions
- **Task hover**: `bg-white/[0.02]` + checkbox border transitions to `blue-500/50`
- **Control buttons**: `hover:scale-105 active:scale-95` for tactile feedback
- **Sub-cards**: Border color intensifies on hover (`hover:!border-blue-500/20`)

## Component Props

### BentoCard Extensions
```typescript
interface BentoCardProps {
  // ... existing props
  noPadding?: boolean;  // For edge-to-edge content (lists)
}
```

## Future Considerations
- Connect Zone1 timer to `useSanctuaryStore`
- Connect Zone2 tasks to `useTasks` hook
- Connect Zone3 Weather to Context Gateway API
- Connect Zone3 Finance to Context Gateway API
