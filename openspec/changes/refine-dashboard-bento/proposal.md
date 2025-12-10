# Proposal: Refine Dashboard Bento Grid

**Change ID**: `refine-dashboard-bento`  
**Status**: DRAFT

## Goal

Polish the Dashboard Bento Grid layout to match the original "Cockpit de Nave Espacial" vision with improved visual hierarchy and spacing.

## Background

The Dashboard Bento Grid is functional but can be refined:
1. The current Urgent Card spans only 1 column instead of the intended 2 columns
2. ArchetypeCard needs a `variant="compact"` to fit better inside 1x1 cells
3. Visual polish: ensure gap consistency and dark aesthetic

## Proposed Changes

### [MODIFY] [index.tsx](file:///c:/Users/pedro/Documents/life-os/src/features/dashboard/index.tsx)
- Adjust `UrgentCard` wrapper to ensure `col-span-2 row-span-2` on desktop
- Verify grid layout matches the ASCII diagram in comments

### [MODIFY] [ArchetypeCard.tsx](file:///c:/Users/pedro/Documents/life-os/src/features/gamification/components/ArchetypeCard.tsx)
- Add `variant?: 'default' | 'compact'` prop
- In compact mode: smaller icon, tighter spacing, hide description

### [MODIFY] [Zone1_Now.tsx](file:///c:/Users/pedro/Documents/life-os/src/features/dashboard/components/Zone1_Now.tsx)
- Ensure `UrgentCard` returns proper `col-span-2 row-span-2` class on desktop

## Verification Plan

### Manual Verification
1. Run `npm run dev` and navigate to Dashboard (`/`)
2. Verify UrgentCard occupies 2x2 grid area on desktop
3. Verify ArchetypeCard looks proportional in 1x1 cell
4. Verify mobile layout (single column stack)
5. Confirm no visual overflow or clipping
