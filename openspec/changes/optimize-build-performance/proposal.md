# Proposal: Optimize Build Performance

**Change ID**: `optimize-build-performance`  
**Status**: DRAFT

## Goal

Fix the VisualLegacy canvas resize bug and optimize the build for production with proper code splitting.

## Background

Two issues identified:
1. **VisualLegacy Canvas Bug**: Canvas only redraws on initial mount. Window/container resize causes stretching/blurring.
2. **Build Optimization**: No manual chunk splitting configured in Vite. Heavy libraries (framer-motion, supabase) should be isolated.

## User Review Required

> [!IMPORTANT]
> The Vite config changes affect build output. Chunk names will change, which may affect caching strategies.

> [!NOTE]
> Routes already use lazy loading correctly. No changes needed there.

## Proposed Changes

---

### Bug Fix

#### [MODIFY] [VisualLegacy.tsx](file:///c:/Users/pedro/Documents/life-os/src/features/gamification/components/VisualLegacy.tsx)

- Extract drawing logic to `useCallback` function `drawConstellation`
- Add `window.resize` listener with `requestAnimationFrame` for redraw
- Clean up listener on unmount

---

### Build Optimization

#### [MODIFY] [vite.config.ts](file:///c:/Users/pedro/Documents/life-os/vite.config.ts)

- Add `build.rollupOptions.output.manualChunks` configuration
- Split chunks: `react-vendor`, `framer-motion`, `supabase`, `ui-vendor`
- Remove obsolete `animejs` from `optimizeDeps.include`

#### [MODIFY] [AppLayout.tsx](file:///c:/Users/pedro/Documents/life-os/src/app/layout/AppLayout.tsx)

- Wrap `Particles` and `SanctuaryOverlay` with `React.memo` to prevent re-renders
- Extract `Dock` to memoized component

## Verification Plan

### Manual Verification

1. Resize browser window and verify VisualLegacy canvas redraws correctly
2. Run `npm run build` and check chunk sizes in output
3. Verify app loads correctly after build changes
