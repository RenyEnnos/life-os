# Research: 06 - University & Academic Management

## Current State Analysis
- **Model**: `Course` and `Assignment` types are defined in both `src/features/university/types.ts` and `api/services/universityService.ts` but with slight inconsistencies.
- **Backend**: `universityService.ts` and `university.ts` (routes) exist and are well-structured, but the database tables `courses` and `assignments` are MISSING from migrations.
- **Frontend Components**: 
  - `UniversityPage.tsx`: Integrated shell but sub-components are using mocks.
  - `CourseGrid.tsx`, `AssignmentList.tsx`, `GradeAnalytics.tsx`, `WhatIfSimulator.tsx`: All currently using mock data.
- **Success Criteria (Gap Analysis)**:
  - [ ] Manage courses and assignments (Needs real CRUD).
  - [ ] GPA and Individual course averages (Logic exists in `useGradeCalculation.ts`? Need to check).
  - [ ] What-If Simulator (Mock UI only).
  - [ ] Assignment deadlines in dashboard (Integration missing).

## Technical Strategy
1. **Database Foundations**: Create migration `013_add_university_tables.sql` for `courses` and `assignments` with RLS policies.
2. **Unified Types**: Standardize types between frontend and backend.
3. **Refactor Components**: Replace `COURSES` and `ASSIGNMENTS` mocks with data from `useUniversity()` hook in:
   - `CourseGrid.tsx`
   - `AssignmentList.tsx`
   - `GradeAnalytics.tsx`
   - `ScheduleWidget.tsx`
4. **Logic Implementation**:
   - `useGradeCalculation.ts`: Implement actual GPA and weighted average logic.
   - `WhatIfSimulator.tsx`: Connect to current grades and allow simulation.
5. **Dashboard Integration**: Add academic deadlines to the "Now" or "Today" zones.

## Requirements Mapping
- **UNI-01**: Course and assignment management with weights.
- **UNI-02**: Automatic GPA and average calculation.
- **UNI-03**: "What-If" simulator for grade prediction.
- **UNI-04**: Academic deadlines in dashboard.

## Proposed Waves
- **Wave 1**: Database Infrastructure & CRUD.
- **Wave 2**: UI Integration (Real Data in Components).
- **Wave 3**: Grade Analytics & What-If Simulator.
- **Wave 4**: Dashboard Integration & Polish.
