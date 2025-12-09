# Design: UI Refactoring & Standardization

## Problem
The current codebase suffers from "Library Drift":
- **Animation**: Mixed usage of `animejs` (imperative) and `framer-motion` (declarative).
- **Styling**: Mixed usage of Tailwind defaults and custom "premium" variables.
- **Components**: Copy-pasted variations of `BentoGrid` causing divergence.

## Solution

### 1. The "Deep Dark" Token System
We will standardized on a `zinc-950` based palette (`#050505`) to achieve the OLED-friendly "off" look rather than "grey".
- Variables: `--color-background`, `--color-surface`, `--bento-radius`.
- Strategy: Overwrite `index.css` completely to remove legacy tailwind utility pollution.

### 2. Consolidated Bento Component
Instead of separate `BentoGrid` and `BentoGridItem`, we will introduce a `BentoCard` pattern that handles its own layout presence.
- **File**: `src/shared/ui/BentoCard.tsx`
- **Pattern**: `BentoGrid` handles the container (Layout), `BentoCard` handles the content and interaction (Spotlight/Hover).
- **Animation**: `Framer Motion` for entry staggering (`staggerChildren`) and hover effects.

### 3. Dashboard Refactoring
The Dashboard acts as the primary consumer of this new system.
- **Action**: Remove `animejs` imports and `useEffect` based animations.
- **Action**: Replace direct div/grid usage with declarative `<BentoGrid>` > `<BentoCard>` structure.
