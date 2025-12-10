# Implement Neural Resonance Analysis

## Summary
Implement "Neural Resonance," a feature that allows users to manually analyze their journal entries using AI (Gemini). The system will generate a "Mood Score," "Sentiment Analysis," "Keywords," and "Nexus Advice," storing these insights in the database and visualizing them in the Journal UI.

## Problem
Currently, journal entries are static text. The system collects data but provides no feedback or insight. The "Neural Resonance" feature aims to close this loop by offering AI-driven reflection, but it lacks the frontend and service logic to trigger and display this analysis. The database schema (`journal_insights`, `mood_score`) is ready, but the bridge is missing.

## Solution
1.  **Backend/API**: Add `analyzeEntry` to `journal.api.ts`. This utilizes `useAI` (or a direct service call if preferred, though the prompt suggests using `generateTags` or similar pattern) to send the entry content to Gemini with a structured prompt.
2.  **Types**: Update `JournalEntry` and add `JournalInsight` interfaces in `src/shared/types.ts` (or `index.ts` if that's where it is).
3.  **UI**:
    *   Add a "Neural Resonance" button to `JournalEditor`.
    *   Create `InsightCard` to display the results (Mood Score, Sentiment, Advice) using a "Magic/Neon" aesthetic.
    *   Handle the asynchronous flow (loading state, optimistic updates or refetch).

## Risks
*   **AI Latency**: Generation can take seconds. UI must handle this gracefully without blocking the user.
*   **Token Usage**: Analysis is manual to conserve costs.
*   **Error Handling**: If the API fails or returns malformed JSON, the UI should simply degrade nicely (toast message) rather than crashing.

## Tech Stack
*   **Frontend**: React, Framer Motion (for the card reveal), Lucide Icons.
*   **Backend**: Supabase (already set up), `aiApi` (wrapper around Gemini).
*   **State**: React Query (`useMutation`).
