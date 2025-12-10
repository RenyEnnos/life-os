# Design: Cinematic Flow Architecture

## Core Concepts

### Deep Flow Engine
The transition engine is built on two principles:
1.  **Optical Blur**: Simulating a camera lens changing focus. As the old page leaves, it blurs out (`blur(4px)`). The new page enters from a slightly blurred state (`blur(4px)` -> `blur(0px)`).
2.  **Scale Dynamics**: Slight scaling (`0.98` <-> `1`) adds depth, making the interface feel like it's "breathing" rather than just sliding.

### Component Structure (`AppLayout`)

```mermaid
graph TD
    AL[AppLayout] --> STT[ScrollToTop]
    AL --> P[Particles (Memoized)]
    AL --> SB[Sidebar]
    AL --> M[Main Content]
    M --> AP[AnimatePresence]
    AP --> MD[motion.div (Deep Flow Variants)]
    MD --> O[Outlet]
    AL --> SO[SanctuaryOverlay (Memoized)]
```

## Implementation Details

### Animation Variables
- **Curve**: `[0.25, 0.1, 0.25, 1]` (Custom Cubic Bezier for "snappy" start, smooth end).
- **Duration**: `0.4s`.
- **States**:
    - `initial`: `opacity: 0`, `y: 8`, `scale: 0.98`, `filter: blur(4px)`
    - `animate`: `opacity: 1`, `y: 0`, `scale: 1`, `filter: blur(0px)`
    - `exit`: `opacity: 0`, `y: -8`, `scale: 0.98`, `filter: blur(4px)`

### Optimization Strategy
- **Memoization**: Background particles and overlays are expensive. They are wrapped in `React.memo` to prevent re-renders during route transitions, ensuring the animation budget is spent on the content `div`.
- **Layout Shift Prevention**: The main container has fixed padding/margins to prevent scrollbar jumps.
