# Tasks: Unify UI Ecosystem

- [x] **Phase 1: Foundation (Design Tokens & Config)**
    - [x] Install `tailwindcss-animate` and `@tailwindcss/container-queries`.
    - [x] Refactor `tailwind.config.js` to usage of CSS variables for colors.
    - [x] Define fluid fontSize scale using `clamp()`.
    - [x] Create `src/app/styles/globals.css` (or update existing) with CSS variable definitions (HSL format).

- [x] **Phase 2: Layout Core**
    - [x] Create `NavigationSystem` component that handles Responsive switching (Sidebar <-> BottomNav).
    - [x] Refactor `AppLayout.tsx` to remove hardcoded `pl-24` and use flex/grid layout.
    - [x] Ensure `100dvh` usage and proper mobile viewport handling.

- [x] **Phase 3: Deep Glass Components**
    - [x] Refactor `BentoCard` to use container queries for internal layout.
    - [x] Update `Sidebar` styling to match "Deep Glass" (blur, borders).
    - [x] Update `Dock` (or merge into `NavigationSystem`) for consistent mobile experience.

- [x] **Phase 4: Dashboard & Content**
    - [x] Refactor `DashboardPage` grid system (use `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
    - [x] Verify `Zone1`, `Zone2`, `Zone3` responsiveness.

- [x] **Phase 5: Verification**
    - [x] Audit touch targets (min 44px).
    - [x] Test on simulated viewport sizes (320px, 375px, 768px, 1024px, 1440px).
