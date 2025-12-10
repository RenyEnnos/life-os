# Spec: Neural Resonance Analysis

## ADDED Requirements

### functional
#### Scenario: Triggering Analysis
When the user clicks the "Neural Resonance" button on a journal entry:
*   The system MUST call the AI service with the entry content.
*   The system MUST show a "Thinking" or "Analyzing" state in the UI.
*   The system MUST NOT block the user from editing while analyzing (though disabling save might be wise to avoid conflicts, for now we just show loading).

#### Scenario: Displaying Results
When the analysis is complete:
*   The system MUST display the `InsightCard` below the editor.
*   The `mood_score` (1-10) MUST be visualized.
*   The "Advice" MUST be displayed clearly as a takeaway.

#### Scenario: Data Persistence
Upon successful analysis:
*   A new record MUST be inserted into the `journal_insights` table.
*   The `journal_entries` record MUST be updated with the calculated `mood_score` and `last_analyzed_at` timestamp.

### Visual
#### Scenario: Insight Card Appearance
*   The card MUST use a low-opacity styling ("sussurro digital") to fit the "Deep Dark" aesthetic.
*   It SHOULD NOT look like a standard heavy UI element; it should feel auxiliary.
