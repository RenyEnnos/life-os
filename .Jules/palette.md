## 2025-12-19 - English Aria Labels
**Learning:** The application UI is English-first (despite some Portuguese messages). Aria labels must be in English.
**Action:** Use English for all `aria-label` and `aria-description` texts.

## 2025-12-19 - Hidden Actions Accessibility
**Learning:** Interactive elements using `group-hover:opacity-100` are invisible to keyboard users.
**Action:** Always add `focus-visible:opacity-100` alongside `group-hover:opacity-100`.

## 2025-12-23 - Form Label Association
**Learning:** Inputs nested in divs next to labels are not automatically associated. `getByLabelText` fails.
**Action:** Always use `id` on inputs and `htmlFor` on labels to ensure explicit association.
