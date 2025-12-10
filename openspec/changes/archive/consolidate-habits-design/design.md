# Design: Habits Page Bento Layout

## Core Concept
The Habits page will move from a simple grid of cards to a "Bento" style dashboard. This uses varied card sizes to emphasize key metrics.

## Layout Grid
The layout uses a responsive grid system handled by `<BentoGrid>`.

- **Mobile**: Single column stack.
- **Desktop**: Multi-column grid.

### Specific Cards
1.  **Consistency Score (2x1)**: Occupies 2 columns width. Shows weekly consistency percentage.
2.  **Focus Habit (1x2)**: Occupies 1 column width, 2 rows height (or prominent vertical space). Prioritized habit.
3.  **Streak (1x1)**: Standard size. Shows current streak count.
4.  **Habit List (1x1)**: Remaining habits as standard cards.

## Visual Style "Deep Dark"
- **Background**: `#050505`
- **Surface**: `#0f0f0f`
- **Surface Hover**: `#171717`
- **Border**: `rgba(255, 255, 255, 0.06)`

## Animations
- **Entry**: Staggered fade-in + slide-up for grid items using `framer-motion` (via `BentoGrid` or `useStaggerAnimation`).
- **Interaction**: Hover effects on cards (scale/border glow).
