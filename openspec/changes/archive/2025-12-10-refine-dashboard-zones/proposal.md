# Proposal: Refine Dashboard Zones (Deep Glass Phase 6)

## Problem
The current Dashboard widgets (`Zone1`, `Zone2`, `Zone3`) use legacy components and ad-hoc styling that clashes with the newly implemented "Deep Glass" system (Phase 4 & 5). They lack the unified physics (`BentoCard`), consistent typography (`tabular-nums`), and hierarchical lighting required for the "Glass Cockpit" vision.

## Solution
Refactor the three main zones to strictly adhere to the Deep Glass design language:
1.  **Zone 1 (Focus)**: Implement as a high-priority "Active Glass" card with distinct controls and typography.
2.  **Zone 2 (Mission)**: Convert to a clean, "bleed" list style within a BentoCard.
3.  **Zone 3 (Context)**: Restructure as a container for semantic, atmospheric mini-cards (Weather/Finance).

## Change ID
`refine-dashboard-zones`

## Goal
Create a unified, responsive, and visually immersive "Cockpit" dashboard that fully utilizes the React + Tailwind + Framer Motion stack defined in the Deep Glass protocol.
