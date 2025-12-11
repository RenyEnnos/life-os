# Refine Dashboard – Deep Glass Protocol (Phase 6)

## Summary
Refactor the main Dashboard zones (Zone1_Now, Zone2_Today, Zone3_Context) into a unified "Glass Cockpit" experience using BentoCard physics, tabular typography for data, and semantic colors for context.

## Motivation
The Dashboard is the operational nerve center of Life OS. The current widgets need visual cohesion with the Deep Glass design system to create an immersive, sci-fi cockpit aesthetic while maintaining data clarity.

## Scope

### In Scope
- **Zone1_Now**: "Current Focus" widget with mono-spaced timer (`tabular-nums`), play/pause controls, and atmospheric background decoration
- **Zone2_Today**: "Today's Mission" task list with border separators, hover states, and semantic tag colors  
- **Zone3_Context**: Split into Weather and Finance sub-cards with semantic coloring (blue atmospheric, emerald financial)

### Out of Scope
- Dynamic data connections (tasks, weather API, crypto API) – using mock data
- Sanctuary store integration for focus timer
- Additional dashboard widgets beyond Zone 1-3

## Dependencies
- `BentoCard` component from `@/shared/ui/BentoCard`
- `Button` component from `@/shared/ui/Button`
- `cn` utility from `@/shared/lib/cn`
- Lucide icons

## Related Specs
- `dashboard-widgets` (new capability)

## Status
**Complete** – Applied on 2025-12-11
