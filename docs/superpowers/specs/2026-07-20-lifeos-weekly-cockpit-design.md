# LifeOS Weekly Cockpit Integration

Status: proposed design for maintainer review  
Authority: records the human direction in issue #158; does not authorize product code  
Scope: shared product shell, partner navigation, and `/mvp` home  
Related: #88, #153, #158

## Decision

The weekly loop remains the proven product behavior, but it will no longer appear as a separate product named "MVP." It becomes the operational cockpit inside the recognizable LifeOS identity.

The first implementation slice will change the shared shell, partner navigation, and weekly home only. It will preserve all current route paths, loop state, API contracts, authentication, persistence, internal admin boundary, and hidden legacy modules.

This is not a restoration of the historical suite. Historical screenshots and commits are identity references, not executable specifications.

## Design read

Reading this as a redesign with identity preservation for a personal operational product. The visual language is a restrained evolution of the historical LifeOS Deep Glass direction, not a generic SaaS dashboard and not a marketing landing page.

- Design variance: 5. The cockpit can be asymmetric, but the task flow must remain predictable.
- Motion intensity: 3. Motion provides route and press feedback only.
- Visual density: 6. The product should feel capable without becoming a wall of cards.
- Theme: dark only for this slice, matching the current enforced product theme.
- Accent: the existing LifeOS violet, replacing the unrelated bright blue treatment.
- Shape rule: 16px cockpit surfaces, 12px fields, full-pill only for the dock and compact controls. Slice 1 applies local radius overrides and does not change shared `Card` or `BentoCard` defaults.

`design-taste-frontend` is used here only as an anti-slop redesign checklist because its own scope excludes dashboards and multi-step product interfaces. The implementation should follow the existing LifeOS component system and the product-specific hierarchy below.

## Evidence from the grill

### What the original established

- A deep near-black atmosphere with a restrained violet identity.
- A recognizable dock and sidebar grammar.
- A compact personal-control-center character.
- Shared materiality across product surfaces.

### What the original did not prove

- The historical suite was not a stable product specification.
- Captured screens were obscured by a competing onboarding modal.
- At least one captured module showed a Vite import failure.
- Historical dashboard copy contained fake system status, fake sync state, and implementation-oriented language.
- The old navigation exposed a module catalog without proving that the modules formed one usable loop.

### What the current product gets right

- One deterministic weekly loop.
- One authenticated web runtime and a tested persistence contract.
- Explicit onboarding, weekly review, daily execution, and reflection states.
- A protected internal admin boundary.

### What the current product gets wrong

- "MVP" is presented as the product identity.
- The shell exposes only a generic compass and settings.
- The home uses generic black cards and a bright blue accent unrelated to LifeOS.
- All blocks have similar visual weight, so the next action is not dominant.
- The interface reads as a small product inserted inside another product.

## Approaches considered

### Chosen: integrate the loop into the LifeOS shell

Keep the secure weekly-loop behavior and give it one coherent LifeOS shell. Make the current cycle and the next action the cockpit's primary content. Reuse existing tokens, Dock, navigation, and surface primitives.

This is the smallest change that fixes the root cause without restoring unproven features.

### Rejected: restore the historical application

Restoring historical commits would reintroduce broken imports, competing onboarding, fake data, hidden persistence assumptions, and an unvalidated module catalog. It would confuse visual recognition with product correctness.

### Rejected: reskin the current MVP

Changing blue to violet and adding blur would preserve the weak hierarchy and generic form-card structure. Decoration cannot make two product identities become one.

### Rejected: rebuild every loop surface at once

A big-bang rewrite would mix shell, navigation, five states, forms, validation, and behavior in one review. The first slice must prove the shared grammar before individual surfaces adopt it.

## Product model

LifeOS is the product. The weekly cycle is its current operating rhythm.

The partner should understand the product as:

1. Set the context once.
2. Shape the week.
3. Act on today.
4. Close the cycle with reflection.

These are not separate modules. They are states of one cycle.

"Current cycle" in this specification means the existing step derived by `MvpWorkspacePage` from stored loop state. It does not introduce a named cycle, calendar-week label, date boundary, or new persisted field.

The broad historical modules remain hidden and undecided. They can return only when a validated need shows how they support this cycle without creating parallel navigation or persistence models.

## Information architecture

### Product home

`/mvp` remains the authenticated landing route for compatibility. Its visible identity becomes LifeOS Home, not MVP.

The first viewport answers three questions:

- Where am I? In the current LifeOS weekly cycle.
- What do I do now? One dominant next action.
- What happens next? A subordinate four-state cycle indicator.

### Partner navigation

The shared navigation exposes only destinations that exist in the current product:

- Home: `/mvp`
- Week: `/mvp/weekly-review`
- Today: `/mvp/today`
- Reflect: `/mvp/reflection`
- Settings: `/settings`

Onboarding is a conditional setup state reached through the dominant action when incomplete. It is not permanent navigation.

Admin remains internal and never appears in partner navigation. Hidden historical modules remain absent.

Route slugs do not change in this slice. URL naming and compatibility redirects require a separate migration decision.

### Mobile navigation

The dock shows Home, Week, Today, Reflect, and Settings. All five controls must fit at 390px without horizontal scrolling. Labels remain accessible even when the visual dock uses icons. The active state must be visible without relying only on color. Exactly one destination has `aria-current="page"` on every route. Home is active only for the exact `/mvp` path, never for descendant routes.

### Desktop navigation

The sidebar uses the same ordering and vocabulary as mobile. It presents the LifeOS mark and product name once. It must not behave like a catalog of every historical feature.

## Visual system

### Palette

Use existing semantic tokens where possible. Calibrate them to one family:

- Void: `#08070B`
- Base: `#0D0C12`
- Raised surface: `#15131C`
- Hairline: `rgba(255, 255, 255, 0.10)`
- Primary text: `#F3F0FA`
- Secondary text: `#A7A1B3`
- LifeOS violet: `#7357D9` with `#FFFFFF` foreground, scoped to the shell, navigation, and home in slice 1

Blue is not a secondary accent. Green, amber, and red appear only for real semantic state.

Slice 1 must not change the global `--primary` token because auth, settings, forms, and hidden modules consume it. Violet is applied through local shell, navigation, and home styles until a later full-product token migration is separately authorized and tested.

### Typography

Reuse the installed font stack. Do not add a dependency in this slice.

- Product title: restrained display weight, sentence case.
- Primary action: clear title plus one short explanatory sentence.
- Utility and cycle state: compact mono only when it represents real status.
- No all-caps marketing copy, fake system telemetry, version labels, or implementation vocabulary.

### Materiality

Deep Glass means layered near-black surfaces, a quiet inner border, and controlled translucency. It does not mean particles, outer neon glows, gradients on every card, or blur on scrolling containers.

Use elevation only for the operational hero and the navigation. Group cycle progress with spacing and a shared rail rather than four independent outlined cards.

### Signature element

The recognizable element is the cycle orbit: the LifeOS mark and the four weekly states share one circular or orbital grammar. The current state is emphasized, the next state is legible, and completed states remain quiet.

This signature must carry information. It is not decorative animation.

### Motion

- Buttons use a 0.98 active scale between 100ms and 160ms.
- The cycle indicator may transition between states without bounce.
- Repeated navigation actions should feel immediate.
- Reduced motion keeps any new home state transition instant.

The existing shared route transition remains unchanged in slice 1 because changing it would affect Settings and every loop surface. A later shell-wide motion pass can replace its scale and blur only with cross-route regression evidence.

## Home composition

### Desktop

```text
+----------------+---------------------------------------------+
| LifeOS         | Current cycle                               |
|                |                                             |
| Home           | One dominant next action                    |
| Week           | clear title + short reason + action         |
| Today          |                                             |
| Reflect        |---------------- cycle orbit ----------------|
|                | context -> week -> today -> reflect          |
| Settings       |                                             |
+----------------+---------------------------------------------+
```

The operational hero occupies the first visual position and contains the only primary button in the initial viewport. The cycle indicator is subordinate and does not repeat the same call to action.

### Mobile

```text
+----------------------------------+
| LifeOS                           |
| Current cycle                    |
|                                  |
| One dominant next action         |
| short reason                     |
| [primary action]                 |
|                                  |
| cycle orbit / compact state rail |
|                                  |
|      persistent bottom dock      |
+----------------------------------+
```

The content must end above the existing shared dock clearance. No nested fixed wrapper or route-specific bottom compensation is allowed.

## Component boundaries

### `AppLayout`

Owns the global atmosphere, content frame, and mobile dock clearance. It does not decide loop state.

### `NavigationSystem`, `Sidebar`, and `navItems`

Own responsive product navigation, labels, active state, and the LifeOS identity mark. They do not expose onboarding, admin, or legacy modules to partners.

### `MvpWorkspacePage`

Owns the weekly-cycle hierarchy and derives the dominant action from the existing loop state. It does not introduce new state or transport.

### Existing store and API

Remain unchanged. The home consumes the same `nextStep`, analytics, workspace state, and route paths already used today.

No new design-system abstraction is introduced. Existing shared components are reused when they support the design; plain layout and CSS grouping are preferred over new card wrappers.

## Data and behavior

The current hydration flow remains authoritative:

1. Authenticate through the existing protected route.
2. Load the workspace through the current MVP store and API adapter.
3. Preserve the existing local `getNextStep` derivation from current plan and state.
4. Render one primary action linked to the existing route.
5. Keep mutations inside their existing surface pages.

The redesign must not infer progress from presentation state or duplicate plan logic.

## Loading, empty, and error states

- Loading uses a skeleton shaped like the operational hero and cycle rail. It must not show fake values, and a focused test asserts that no primary action is rendered while loading.
- A workspace with no `onboarding.completedAt` directs the user to setup with the same single dominant action. No second empty-state heuristic is introduced.
- Hydration failure stays contextual and preserves the existing retry behavior.
- No transient toast replaces a persistent workspace error.
- Error, loading, and empty states must remain inside the same LifeOS shell.

## Copy constraints

Visible shell, navigation, and home copy changed by slice 1 must not contain:

- MVP
- surface
- phase
- foundation checklist
- readiness
- build, implementation, backlog, or internal file references
- fake sync, system health, XP, or AI claims

Copy on onboarding, weekly review, today, and reflection remains outside slice 1 and is reviewed in later ready issues. Their current vocabulary does not satisfy the final product standard, but this specification does not authorize changing it yet.

## Accessibility

- Maintain semantic navigation landmarks and accessible labels.
- Active navigation uses `aria-current` and a non-color visual indicator.
- Preserve visible keyboard focus at WCAG AA contrast.
- The first heading describes the current cycle, not the implementation stage.
- The cycle indicator uses an ordered list or equivalent semantics.
- Every icon-only dock control has an accessible name.
- Touch targets remain at least 44px.
- Reduced motion is tested in browser automation.

## First implementation slice

Expected product files:

- `src/app/layout/AppLayout.tsx`
- `src/app/layout/NavigationSystem.tsx`
- `src/app/layout/Sidebar.tsx`
- `src/app/layout/navItems.ts`
- `src/features/mvp/pages/MvpWorkspacePage.tsx`
- focused tests beside the changed components

Slice 1 does not change global tokens in `src/index.css`. No other file is presumed necessary.

Explicit exclusions:

- no legacy route reactivation;
- no historical dashboard restoration;
- no changes to form behavior or data mutation;
- no backend, auth, store, schema, persistence, IPC, or API changes;
- no route rename;
- no new dependency;
- no particle, gamification, sanctuary, assistant, or fake telemetry layer;
- no settings redesign in this slice.

## Acceptance criteria

1. For the five-second comprehension check, the maintainer sees one desktop and one mobile screenshot without annotations and answers: current state, next action, and following state. All three answers must match the existing derived loop step in one walkthrough.
2. On the loaded home, exactly one visually primary CTA appears inside the page content. Loading shows none. A contextual error may show one Retry action. Navigation links do not count as page CTAs.
3. No partner-facing shell, navigation, or home string uses internal MVP or engineering vocabulary.
4. The shell's LifeOS identity across desktop and mobile is evaluated only through criterion 10: mark, violet accent, deep material, type hierarchy, and navigation grammar are scored in the saved visual rubric and `visual-verdict` evidence.
5. Navigation exposes Home, Week, Today, Reflect, and Settings only; onboarding is conditional; admin and legacy modules are absent.
6. Existing route, state, API, auth, persistence, and admin contracts remain unchanged. Evidence is a scoped diff containing no contract or backend files, focused regression tests, and the canonical web E2E.
7. Focused tests lock exactly one `aria-current="page"` destination per route, exact-only Home matching, mobile content clearance, the absence of onboarding from navigation, and the invariant that an incomplete workspace has one home CTA targeting `/mvp/onboarding`.
8. Existing canonical web E2E remains green.
9. Playwright screenshots at 390x844, 800x900, and 1440x1000 show no overlap, no horizontal overflow, all five mobile controls fitting at 390px, visible focus, and correct reduced-motion behavior.
10. `visual-verdict` returns `pass`. Separately, the seven-criterion LifeOS interface rubric scores at least 11/14, with no critical criterion at zero and clarity plus primary action at least 3/4. Both results are saved with the iteration evidence.

## Maintainer authorization

Issue #158 records the maintainer's explicit decision to delegate this integration direction to the agent. No second aesthetic approval is required after implementation. Final desktop and mobile screenshots remain mandatory evidence, and a maintainer rejection at any point returns the design to iteration.

## Delivery sequence after this slice

Later slices may apply the proven visual grammar to onboarding, weekly review, today, reflection, auth, and settings one at a time. Each slice requires its own before/after evidence and ready implementation issue.

Historical modules are not part of that automatic sequence. Any return requires evidence of user need, a defined role in the weekly cycle, and a compatible data contract.

## Stop conditions

Stop and return to product decision if implementation requires:

- restoring a hidden module;
- changing route slugs or navigation taxonomy beyond this spec;
- changing stored data or transport;
- introducing a new design-system dependency;
- displaying unverifiable metrics or AI-generated advice;
- weakening existing authentication, admin, privacy, or recovery boundaries.
