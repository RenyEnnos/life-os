## 2025-12-19 - English Aria Labels
**Learning:** The application UI is English-first (despite some Portuguese messages). Aria labels must be in English.
**Action:** Use English for all `aria-label` and `aria-description` texts.

## 2025-12-19 - Hidden Actions Accessibility
**Learning:** Interactive elements using `group-hover:opacity-100` are invisible to keyboard users.
**Action:** Always add `focus-visible:opacity-100` alongside `group-hover:opacity-100`.

## 2025-12-24 - Accessibility of Habit Toggles
**Learning:** The habit toggle button was completely invisible to screen readers as it only contained an icon or an empty div.
**Action:** Added dynamic `aria-label` to `HabitItem` toggle button to indicate state (complete/incomplete) and habit title.

## 2025-12-27 - Task List Accessibility
**Learning:** Task items were missing crucial accessibility context. Checkboxes lacked labels, priority dots relied on color, and delete buttons were generic.
**Action:** Added dynamic `aria-label` to checkboxes ("Mark [Task] as complete"), `title`/`aria-label` to priority dots, and context to delete buttons ("Delete task: [Task]").

## 2025-02-07 - Accessible Form Labels with useId
**Learning:** Hardcoded IDs for form labels limit component reusability and can cause duplicate ID errors. React's `useId` hook provides a robust solution for generating unique IDs for `htmlFor`/`id` association.
**Action:** Use `useId` when adding accessibility attributes to forms to ensure uniqueness and maintainability.
