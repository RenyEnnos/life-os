# Proposal: Refactor UI Architecture & Bento System

## Why
A technical diagnosis revealed conflicting architecture patterns in the frontend:
1.  **Duplicate Components**: Two conflicting `BentoGrid` implementations exist (`shared/ui/BentoGrid.tsx` vs `shared/ui/premium/BentoGrid.tsx`).
2.  **Animation Conflicts**: The dashboard uses imperative `animejs` which conflicts with the declarative `framer-motion` used elsewhere.
3.  **Inconsistent Design**: The `index.css` global styles use outdated Tailwind defaults instead of the intended "Deep Dark" premium palette.

## Goal
Establish a unified, performant, and premium design system foundation by consolidating UI components and standardizing animation/styling patterns.

## Capabilities
- **Premium Foundation**: Implement "Deep Dark" color palette and unified design tokens.
- **Unified Components**: Consolidate Bento Grid/Card into a single, reliable component with declarative animations.
- **Modern Dashboard**: Refactor Dashboard to use the new system, removing `animejs` in favor of `framer-motion`.

## Effect
Eliminates technical debt in the UI layer, improves animation performance, and delivers the intended premium visual aesthetic.

## Owners
- @antigravity (Lead Architect)
