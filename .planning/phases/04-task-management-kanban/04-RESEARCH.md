# Research: 04 - Task Management (Kanban)

## Current State Analysis
- **Model**: `Task` currently uses `completed: boolean`. This is insufficient for a Kanban view.
- **Backend**: API and Supabase tables exist but are likely tied to the boolean flag.
- **Components**: `TaskItem.tsx` and `CreateTaskForm.tsx` exist but need adaptation for a multi-status flow.
- **Libraries**: `framer-motion` is already in the project and can be used for smooth drag & drop or simple animations.

## Technical Strategy
1. **Database Migration**: Add a `status` column (enum/text) to the `tasks` table and migrate existing data (`completed: true` -> `status: 'done'`, `false` -> `status: 'todo'`).
2. **Frontend Model**: Update `shared/types.ts` and `src/features/tasks/types.ts` to include `status: 'todo' | 'in-progress' | 'done'`.
3. **Kanban UI**: 
   - Create a `KanbanBoard` container.
   - Create `KanbanColumn` components.
   - Implement drag & drop functionality using `dnd-kit` (recommended for React/TS) or `framer-motion` for basic visual reordering.
4. **Task Lifecycle**: Update `tasks.api.ts` to support updating the status during drag & drop.

## Requirements Mapping
- **TASK-01**: Multi-status Kanban board.
- **TASK-02**: Drag & Drop tasks between columns.
- **TASK-03**: Quick edit/create within the Kanban view.
- **TASK-04**: Persistent status updates in the backend.

## Proposed Waves
- **Wave 1**: Data migration & Status-driven backend.
- **Wave 2**: Kanban Board UI (Layout & Rendering).
- **Wave 3**: Drag & Drop integration & Optimistic updates.
