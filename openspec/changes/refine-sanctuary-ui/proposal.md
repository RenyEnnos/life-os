# Refine Sanctuary Mode UI

## Summary
Refine the `SanctuaryOverlay` component and integrate it into the root `AppLayout` to create a "Glass & Void" (Minimalist Dark Mode Premium) aesthetic. This change aims to elevate the visual quality of the focus mode, ensuring it completely covers the application interface (including Sidebar) and provides a serene, distraction-free environment with high-end motion design and typography.

## Problem
The current `SanctuaryOverlay` is a basic skeleton. It lacks the polish, z-index layering to cover the sidebar, and the specific "Ritual" aesthetic (dark radial background, serif typography, subtle controls) requested for the premium focus experience.

## Solution
1.  **Architecture**: Move `SanctuaryOverlay` integration to `AppLayout.tsx` at the root level with a high z-index (`z-50`) to ensure full coverage.
2.  **Visuals**: Implement the "Glass & Void" aesthetic:
    *   Background: `#050505` with subtle radial vignette.
    *   Typography: Large serif font for the active task title (e.g., `font-serif`).
    *   Controls: Minimalist, bottom-aligned, fade-in on hover.
3.  **Motion**: Use Framer Motion for smooth 0.8s entrance/exit transitions (`easeInOut`) to make the mode "emerge" rather than pop.
4.  **Interaction**: "Esc" to exit, intuitive audio controls.

## Risks
*   **Z-Index conflicts**: Ensuring it covers *everything* (modals, toasts, sidebar) without trapping focus incorrectly (though it is a focus mode, so capturing focus is desired).
*   **Performance**: Large blur or opacity transitions can be costly; minimal use of heavy blurs, relying more on obscurity and colors.
