# Research: 09 - Journaling & AI Reflection

## Current State Analysis
- **Model**: `journal_entries` and `journal_insights` tables exist with RLS.
- **Backend**: `triggerJournalAnalysis` logic exists in the backend (Neural Resonance).
- **Frontend Components**: 
  - `JournalEditor.tsx`, `JournalEntryList.tsx`, `ResonancePanel.tsx` exist but are not fully wired together in the main page.
  - `JournalPage.tsx`: **CRITICAL**. Currently a mock-heavy placeholder.
- **Success Criteria (Gap Analysis)**:
  - [x] Daily journal entries (UI exists).
  - [ ] Mood tracking (UI exists, need to ensure it persists to DB).
  - [ ] AI-powered reflections (Logic exists in `triggerJournalAnalysis`, need to trigger it on save).
  - [ ] Weekly summaries (Logic exists in `useJournalInsights`, need a dedicated view).

## Technical Strategy
1. **Refactor JournalPage**: Replace the current mock layout with a functional data-driven architecture using `useJournal` and `useJournalInsights`.
2. **Integrated Editor**: Ensure `JournalEditor` supports real-time saving and triggers the `triggerJournalAnalysis` API upon completion.
3. **Resonance Panel Wiring**: Connect the `ResonancePanel` to real AI insights (mood scores, themes, and suggested actions).
4. **Weekly AI Reflection**: Create a "Weekly Reflection" special card/view that displays the AI-generated weekly summary.
5. **Mood Visualization**: Implement a real `MoodTrendChart` using Recharts to replace the mock CSS bars.

## Requirements Mapping
- **JOURN-01**: Daily journal with mood selection.
- **JOURN-02**: Private and secure storage.
- **AI-04**: Weekly AI-generated mood and productivity trends.

## Proposed Waves
- **Wave 1**: Journal Page Refactoring & CRUD.
- **Wave 2**: AI Analysis Integration (Neural Resonance).
- **Wave 3**: Mood Analytics & Trends UI.
- **Wave 4**: Weekly Reflection View & Polish.
