# Phase 17: Eradicate Mocks - Research

**Researched:** 2024-05-23
**Domain:** UI Components and API Services
**Confidence:** HIGH

## Summary

This phase focuses on removing hardcoded mock data and logic across the University features and API Gateway. We need to replace fixed progress indicators with computed values, update the "What If" simulator to use actual assignment weights, and handle API failures gracefully without resorting to static mock data.

**Primary recommendation:** Use existing hooks (`useGradeCalculation`) and data models (`Assignment` weights) to calculate real metrics, and replace API fallback mocks with graceful degradation (null/empty states).

## Architecture Patterns

### 1. Course Progress Calculation
**What goes wrong:** `CourseCard.tsx` currently hardcodes `const progress = 75;`.
**How to fix:** 
- The project already has a `useGradeCalculation(assignments)` hook which exports `calculateProgress(courseId)`.
- Update `CourseCardProps` to accept a `progress` value (`progress: number`).
- In the parent components (where `CourseCard` is rendered), invoke `calculateProgress(course.id)` and pass the result as a prop.

### 2. What-If Simulator Logic
**What goes wrong:** `WhatIfSimulator.tsx` assumes a hardcoded 40% remaining weight (`const remainingWeight = 0.4;`).
**How to fix:**
- Pass `assignments: Assignment[]` as a prop to `WhatIfSimulator`.
- Filter assignments for the selected course.
- Compute the actual weight distribution:
  - `totalWeight` = Sum of all `weight` values for the course's assignments.
  - `completedWeight` = Sum of `weight` for assignments where a `grade` is present (or `status === 'graded'`).
  - `remainingWeight` = `totalWeight - completedWeight`.
  - `currentGrade` = Computed average from graded assignments.
- If `totalWeight` is 0, show a warning that assignments with weights need to be added to simulate grades.

### 3. Context Gateway Mocks
**What goes wrong:** `api/services/contextGateway.ts` catches API errors (rate limits, network issues) and returns a hardcoded `MOCKS` object for Crypto, Weather, and News.
**How to fix:**
- Delete the `MOCKS` object entirely.
- **Crypto:** Return `{}` or `null` on error instead of `MOCKS.crypto`.
- **Weather:** Return `null` on error instead of `MOCKS.weather`.
- **News:** Return `[]` (empty array) on error instead of `MOCKS.news`.
- The client-side UI should be updated (if not already) to handle these empty/null states gracefully (e.g., displaying "News unavailable" or hiding the widget).

## Common Pitfalls

### Pitfall 1: Simulator Division by Zero
**What goes wrong:** If a user has no assignments, or total weight is zero, the required score calculation will return `NaN` or `Infinity`.
**How to avoid:** Ensure the simulator gracefully handles the case where `remainingWeight === 0` or `totalWeight === 0`. Display a message instructing the user to add assignments first.

### Pitfall 2: Unexpected UI behavior when APIs fail
**What goes wrong:** Removing API mocks means the UI will receive `null` or `[]` where it previously always had valid data.
**How to avoid:** Double-check that the dashboard widgets consuming context data (Weather, Crypto, News) check for empty states before attempting to render values.

## Code Examples

### Calculating Actual Remaining Weight
```typescript
const courseAssignments = assignments.filter(a => a.course_id === selectedCourseId);
const totalWeight = courseAssignments.reduce((acc, a) => acc + (a.weight || 1), 0);
const gradedWeight = courseAssignments
    .filter(a => a.grade !== undefined && a.grade !== null)
    .reduce((acc, a) => acc + (a.weight || 1), 0);

const remainingWeightPercentage = totalWeight > 0 ? (totalWeight - gradedWeight) / totalWeight : 0;
```

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Inspected the existing files and types.
- Architecture: HIGH - Mapped out exact fields to use based on the `Assignment` type.
- Pitfalls: HIGH - Empty states for API responses are standard handling procedures.
