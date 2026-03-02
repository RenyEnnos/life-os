# Research: 10 - Performance Optimization & PWA

## Current State Analysis
- **Build System**: Vite with `rollupOptions.manualChunks` for bundle splitting.
- **PWA**: `vite-plugin-pwa` is installed and partially configured.
- **Icons**: `public/` has `.svg` icons, but `vite.config.ts` expects `.png` files.
- **Performance**: High potential due to React 18 and Vite, but needs verification via Lighthouse.
- **Offline**: Basic service worker exists, but no sophisticated sync or offline fallback UI.

## Technical Strategy
1. **PWA Compliance**: Update `vite.config.ts` to use existing SVG icons or generate PNG versions. Ensure maskable icons are defined.
2. **Offline Fallback**: Implement a simple `OfflinePage.tsx` and configure the service worker to serve it when no network is available.
3. **Bundle Optimization**: Review `manualChunks` to ensure optimal loading of critical features (Auth, Dashboard).
4. **Image Optimization**: Ensure any static assets are properly compressed or served in modern formats (WebP).
5. **Audit & Fix**: Run `npm run lh` (Lighthouse) and address P0/P1 issues related to Performance, SEO, and Accessibility.

## Requirements Mapping
- **PERF-01**: Lighthouse performance score > 90.
- **PERF-02**: Installable PWA with offline support.
- **PERF-03**: Core features work offline (sync on reconnect).

## Proposed Waves
- **Wave 1**: PWA Assets & Icon Fixes.
- **Wave 2**: Offline Support & Fallback UI.
- **Wave 3**: Bundle & Asset Optimization.
- **Wave 4**: Final Audit & Tuning.
