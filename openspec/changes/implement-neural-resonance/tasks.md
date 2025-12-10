# Tasks

- [x] Update Type Definitions <!-- id: 0 -->
    - [x] Add `JournalInsight` interface to types.
    - [x] Update `JournalEntry` with `mood_score`, `last_analyzed_at`.
- [x] Implement Service Layer <!-- id: 1 -->
    - [x] Add `analyzeEntry` to `journal.api.ts`.
    - [x] Implement prompt construction and JSON parsing logic.
    - [x] Handle DB updates (insert insight, update entry).
- [x] Implement UI Components <!-- id: 2 -->
    - [x] Create `InsightCard.tsx` with "Magic/Neon" style.
    - [x] Update `JournalEditor.tsx`:
        - [x] Add "Analyze" button using `useMutation`.
        - [x] Display `InsightCard` when data is present.
- [x] Verify Flow <!-- id: 3 -->
    - [x] Create/Open a journal entry.
    - [x] Click Analyze.
    - [x] Verify DB records created.
    - [x] Check UI display of insights.
