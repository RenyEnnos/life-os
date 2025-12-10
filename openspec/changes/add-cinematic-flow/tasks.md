# Tasks: Cinematic Flow Implementation

1.  **Update AppLayout Transition Logic**
    - [ ] Replace `src/app/layout/AppLayout.tsx` with the new implementation containing `Deep Flow` variants.
    - [ ] Ensure `AnimatePresence` wraps the mapping of the `Outlet`.
    - [ ] Verify `pageVariants` include `filter: blur()` and `scale`.

2.  **Verify Experience**
    - [ ] Test navigation between Dashboard and other pages.
    - [ ] Confirm scroll position resets to top on navigation.
    - [ ] Confirm particle background does NOT flicker/re-render (memoization check).
