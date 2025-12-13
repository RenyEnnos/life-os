# Tasks: Unify Visual System

- [x] **Phase 1: Token Unification** <!-- id: token-unification -->
    - [x] Refactor `src/design/tokens.ts` to define the "Deep Glass" palette.
    - [x] Update `src/index.css` to match `tokens.ts` values (HSL format).
    - [x] Clean up `tailwind.config.js` to rely purely on CSS variables.

- [x] **Phase 2: Atomic Polish** <!-- id: atomic-polish -->
    - [x] Refactor `Button.tsx` with "Deep Glass" styles (inner shadows, gradient borders).
    - [x] Refactor `Input.tsx` to match the new token system (ensure no hardcoded opacity clashes).
    - [x] Audit `Badge` or create it if missing, applying the same glass style.

- [x] **Phase 3: Integration & Audit** <!-- id: integration -->
    - [x] Verify `Login` and `Dashboard` pages for visual regressions.
    - [x] Remove hardcoded colors from `AppLayout` or other containers in favor of `bg-background`.
    - [x] Test responsiviness on 320px viewport.
