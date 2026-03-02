# Research: 07 - AI Assistant & Quick Capture

## Current State Analysis
- **Model**: `aiService` and `synapseSuggestionsService` are highly advanced and already implemented in the backend.
- **Backend**: Routes for `/api/ai/*` and `/api/synapse/*` exist and use `aiManager` (Groq/Gemini).
- **Frontend Components**: 
  - `ChatInterface.tsx` exists in `src/features/ai-assistant`.
  - `QuickCapture.tsx` exists in `src/features/tasks`.
- **Success Criteria (Gap Analysis)**:
  - [x] Create task/habit with NLP (QuickCapture exists).
  - [ ] AI category suggestions (Logic exists in `generateTags`).
  - [ ] Floating AI chat (UI exists but not integrated as a global floating element).
  - [ ] Context-aware insights (Logic exists in `synapseSuggestionsService` but UI integration is missing).

## Technical Strategy
1. **Global Floating Assistant**: Create a `FloatingNexus.tsx` component that toggles the `ChatInterface` and is accessible from any page.
2. **Enhanced Quick Capture**: Move `QuickCapture` to a more global position (e.g., Command Palette or Header) and ensure it supports multiple entity types (Habits, Tasks, Finance).
3. **Synapse Integration**: Create a `SynapseDashboardWidget.tsx` to display the real-time AI suggestions from the backend.
4. **Smart Categorization**: Integrate `aiApi.generateTags` into the Finance and Task creation forms to suggest tags automatically.

## Requirements Mapping
- **DASH-03**: Quick capture interface.
- **AI-01**: Create entity via NLP.
- **AI-02**: Smart category suggestions.
- **AI-03**: Floating chat assistant.
- **AI-04**: Context-aware dashboard insights.

## Proposed Waves
- **Wave 1**: Global Floating Assistant (Chat UI Integration).
- **Wave 2**: Universal Quick Capture & NLP (Header/Global).
- **Wave 3**: Synapse Dashboard Widget (AI Insights).
- **Wave 4**: Smart Tags Integration & Polish.
