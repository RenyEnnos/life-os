## 2025-12-15 - Keyboard Visibility of Hover-Revealed Actions
**Learning:** The `opacity-0 group-hover:opacity-100` pattern for hiding actions (like edit/delete buttons) makes them completely invisible to keyboard users even when focused.
**Action:** Always include `focus-within:opacity-100` (for containers) or `focus-visible:opacity-100` (for elements) alongside `group-hover` utilities to ensure keyboard users can see what they are focusing on.
