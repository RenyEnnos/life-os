# Cleanup Workspace Files - Tasks

## Prerequisites
- [ ] Ensure dev server is running to verify changes

---

## 1. Delete Root Log Files
**Effort**: 5 min | **Deps**: None | **Parallelizable**: ✅

- [ ] Delete `build_log.txt`
- [ ] Delete `err.txt`
- [ ] Delete `errors.txt`
- [ ] Delete `lint.log`
- [ ] Delete `lint_log.txt`
- [ ] Delete `out.txt`

---

## 2. Consolidate UI Components
**Effort**: 10 min | **Deps**: None | **Parallelizable**: ✅

- [ ] Update `src/features/journal/index.tsx` imports from kebab-case to PascalCase
- [ ] Update `src/features/journal/components/JournalEditor.tsx` import
- [ ] Delete `src/shared/ui/magic-card.tsx`
- [ ] Delete `src/shared/ui/shimmer-button.tsx`
- [ ] Delete `src/shared/ui/shine-border.tsx`

---

## 3. Delete Empty Directories
**Effort**: 1 min | **Deps**: None | **Parallelizable**: ✅

- [ ] Delete `src/hooks/` directory

---

## 4. Verification
**Effort**: 5 min | **Deps**: 1, 2, 3

- [ ] Run `npm run build` - must pass
- [ ] Run `npm run dev` and test Journal page
- [ ] Confirm no console errors
