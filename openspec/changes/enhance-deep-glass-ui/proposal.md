# Proposal: Deep Glass Refinements (Phase 4 & 5)

## Summary
Enhance the "Deep Glass" UI by refining the cinematic navigation transitions and upgrading the input fields to have a "sunken" glass aesthetic.

## Problem Statement
1.  **Navigation**: The current transition includes a vertical slide (`y: 8`) which conflicts with the pure "optical focus" metaphor (blur + scale).
2.  **Inputs**: The current `Input` components are standard flat fields, lacking the depth and "tactile" feel of the rest of the application.

## Solution
1.  **Cinematic Flow (Phase 4 Refinement)**: Update `AppLayout` to remove `y` translation from page variants. The transition will rely solely on `blur` and `scale` to simulate a camera lens refocusing.
2.  **Deep Inputs (Phase 5)**: Refactor `Input` component to use:
    - Inner shadows for depth.
    - Glow effects on focus.
    - Glassmorphism background (`bg-black/20` with `backdrop-blur`).
    - *Note*: `TextArea` will be preserved/updated to match if possible, or left as is if out of scope (assuming safe retention).

## Impact
- **Visual Cohesion**: Navigation and forms will feel like part of the same physical material.
- **Immersion**: Removing the "slide" effect makes the UI feel more grounded and continuous.
