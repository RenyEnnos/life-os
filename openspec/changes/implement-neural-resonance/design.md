# Design: Neural Resonance Flow

## Architecture

### Data Flow
1.  **Trigger**: User clicks "Analyze Resonance" in `JournalEditor`.
2.  **Service**: `journalApi.analyzeEntry(id, content)` is called.
3.  **AI Layer**:
    *   Constructs prompt: "Analyze this journal... Return JSON..."
    *   Calls Gemini.
    *   Parses JSON response.
4.  **Persistence**:
    *   Inserts into `journal_insights` table.
    *   Updates `journal_entries` table (`mood_score`, `last_analyzed_at`).
5.  **UI Update**:
    *   React Query invalidates/updates the entry cache.
    *   `JournalEditor` shows `InsightCard`.

### Data Structures
**JournalInsight Interface**:
```typescript
interface JournalInsight {
  sentiment: string;
  keywords: string[];
  advice: string;
  correlation_hypothesis: string;
  mood_score: number;
}
```

### UI Components
**InsightCard**:
*   **Visuals**: Dark glassmorphism, subtle glowing border (Neon/Magic).
*   **Content**:
    *   **Header**: "Neural Resonance" with usage timestamp.
    *   **Mood**: Visual indicator (1-10 bar or circular progress).
    *   **Keywords**: Tag cloud.
    *   **Advice**: The "Whisper" from the system.

## Prompt Engineering
The prompt must ensure JSON output to avoid parsing errors.
*   *Input*: Entry Title + Content.
*   *Output Schema*: strict JSON.
