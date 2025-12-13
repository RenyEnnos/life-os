# Change: Unify Visual System & High-End Refinement

## Why
The current UI suffers from visual fragmentation:
1.  **Dual Source of Truth**: Colors are defined in `src/design/tokens.ts` (hex) and `tailwind.config.js` (CSS variables), leading to inconsistencies.
2.  **Generic Foundation**: Atomic components like `Button` lack the "Deep Glass" premium feel present in newer cards.
3.  **Inconsistent Depth**: Use of pure black (`#000`) flattens the UI, losing the "Deep Glass" dimensionality.

## What Changes
1.  **Single Source of Truth**: Refactor `src/design/tokens.ts` to define the "Biological Design System" palette, which will drive `index.css` variables and Tailwind config.
2.  **High-End Polish**: Update `Button`, `Input`, `Select`, and `Badge` to use "Deep Glass" styling (inner shadows, gradient borders, fluid responsiveness).
3.  **Visual Unification**: Ensure all components use semantic tokens (e.g., `bg-surface-primary`) instead of hardcoded hex values.

## Impact
- **Consistency**: One palette for the whole app.
- **Aesthetics**: A cohesive, premium "Deep Glass" look.
- **Scalability**: Easier to theme and maintain.
