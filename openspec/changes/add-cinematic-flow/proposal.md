# Proposal: Cinematic Flow (Deep Glass Phase 4)

## Summary
Implement "Deep Flow" navigation transitions using optical physics (blur + scale) to replace generic slide animations. This update establishes a cinematic feel for the application, reducing perceived latency and enhancing the "Deep Glass" aesthetic.

## Problem Statement
Current page transitions are generic or non-existent, leading to abrupt context switches. This breaks immersion and user focus. Additionally, heavy components can cause perceived rendering delays.

## Solution
- **Physics-Based Transitions**: Use `framer-motion` with custom Bezier curves (`[0.25, 0.1, 0.25, 1]`) and blur filters to simulate focus shifts.
- **Scroll Management**: Integreate a `ScrollToTop` utility to ensure consistent view states.
- **Performance Optimization**: Memoize background elements (`Particles`, `SanctuaryOverlay`) to ensure smooth frame rates during transitions.

## Impact
- **User Experience**: Fluid, organic-feeling navigation.
- **Performance**: Reduced perceived loading times due to motion blur masking.
- **Visuals**: Aligns with the "Deep Glass" design language.
