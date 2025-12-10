# Cleanup Workspace Files

## Summary

Clean up the workspace by removing temporary log/debug files, consolidating duplicate UI components, and deleting empty directories.

## Why

Technical debt has accumulated from development artifacts:
- Debug log files pollute the root directory
- Duplicate UI components cause confusion about which version to import
- Empty directories add noise to the project structure

This cleanup improves codebase maintainability and developer experience.

## Problem

The workspace has accumulated:

1. **Temporary log files at root** - Debug artifacts that shouldn't be committed:
   - `build_log.txt`
   - `err.txt`
   - `errors.txt`
   - `lint.log`
   - `lint_log.txt`
   - `out.txt`

2. **Duplicate UI components** - Three component pairs exist with both kebab-case and PascalCase versions:
   - `src/shared/ui/magic-card.tsx` ↔ `src/shared/ui/premium/MagicCard.tsx`
   - `src/shared/ui/shimmer-button.tsx` ↔ `src/shared/ui/premium/ShimmerButton.tsx`
   - `src/shared/ui/shine-border.tsx` ↔ `src/shared/ui/premium/ShineBorder.tsx`

3. **Empty directories**:
   - `src/hooks/` (empty folder)

## User Review Required

> [!IMPORTANT]
> The kebab-case components in `src/shared/ui/` will be deleted. Imports will be updated to use the `premium/` PascalCase versions which are better aligned with the "Deep Dark" design system.

## Proposed Changes

### Root Directory Cleanup

#### [DELETE] build_log.txt
#### [DELETE] err.txt
#### [DELETE] errors.txt
#### [DELETE] lint.log
#### [DELETE] lint_log.txt
#### [DELETE] out.txt

---

### UI Component Consolidation

Keep `premium/` versions (PascalCase), delete kebab-case duplicates.

#### [DELETE] [magic-card.tsx](file:///c:/Users/pedro/Documents/life-os/src/shared/ui/magic-card.tsx)
#### [DELETE] [shimmer-button.tsx](file:///c:/Users/pedro/Documents/life-os/src/shared/ui/shimmer-button.tsx)
#### [DELETE] [shine-border.tsx](file:///c:/Users/pedro/Documents/life-os/src/shared/ui/shine-border.tsx)

#### [MODIFY] [JournalEditor.tsx](file:///c:/Users/pedro/Documents/life-os/src/features/journal/components/JournalEditor.tsx)
- Update import: `@/shared/ui/shine-border` → `@/shared/ui/premium/ShineBorder`

#### [MODIFY] [index.tsx](file:///c:/Users/pedro/Documents/life-os/src/features/journal/index.tsx)
- Update imports: 
  - `@/shared/ui/magic-card` → `@/shared/ui/premium/MagicCard`
  - `@/shared/ui/shimmer-button` → `@/shared/ui/premium/ShimmerButton`

---

### Empty Directory Cleanup

#### [DELETE] src/hooks/ (empty folder)

---

## Verification Plan

### Automated Tests

```bash
npm run build
```

The build must pass without broken imports or missing files.

### Manual Verification

1. Run `npm run dev`
2. Navigate to Journal page to verify MagicCard and ShimmerButton render correctly
3. Verify no console errors
