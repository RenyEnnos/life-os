# Proposal: Foundation & Atmosphere

## Summary
Redefine the "physics" of Life OS by moving away from absolute black to a "Deep Surface" (#030303) model, introducing precision typography (Inter with custom features), and establishing an atmospheric lighting system (Vignette).

## Motivation
- **Depth:** Absolute black (#000000) prevents shadow visibility and spatial depth.
- **Precision:** Default fonts lack the technical/premium "feel" required for the "Cockpit" aesthetic.
- **Atmosphere:** The current interface feels flat; lighting effects (vignette) will create a focal point and immersive environment.

## Proposed Solution
1.  **Deep Surface:** Update `tailwind.config.js` to use `#030303` as background and `#0A0A0B` as surface.
2.  **Tech Typography:** Configure Inter with `cv11` (single-story a), `cv05` (lowercase l with tail), and `ss01` (alternate digits).
3.  **Atmospheric Lighting:** Implement a global `.vignette-radial` utility and apply it in `AppLayout`.

## Risks
- Minor contrast adjustments needed for existing components (mitigated by revised color palette).
- Global layout changes might affect z-indexing of floating elements (e.g., modals, dock).
