# Neural Resonance - Implementation Tasks

> **Status**: ✅ Complete  
> **Priority**: #4 (After Synapse Bar, Dynamic Now, Sanctuary Mode)

---

## 1. Database Schema
- [x] 1.1 Create `journal_insights` table migration
- [x] 1.2 Add `mood_score` column to `journal_entries` table
- [x] 1.3 TypeScript types defined

## 2. Type Updates
- [x] 2.1 Add `JournalInsight` interface to `types.ts`
- [x] 2.2 Add `InsightType` enum
- [x] 2.3 Update `JournalEntry` interface with `mood_score`

## 3. Backend API ✅
- [x] 3.1 Create `api/routes/resonance.ts`
- [x] 3.2 Implement `POST /analyze/:entryId` with AI analysis
- [x] 3.3 Implement `GET /insights/:entryId` 
- [x] 3.4 Implement `GET /weekly` summary
- [x] 3.5 Register in `api/app.ts`

## 4. Frontend Hooks
- [x] 4.1 Create `useJournalInsights.ts` hook
- [x] 4.2 Fetch insights for specific entry
- [x] 4.3 Fetch weekly summary insights
- [x] 4.4 `triggerJournalAnalysis()` calls API

## 5. UI Components
- [x] 5.1 Create `ResonancePanel.tsx` sidebar
- [x] 5.2 Create `MoodIndicator.tsx` circular indicator
- [x] 5.3 Create `resonance.css` Glass & Void styling
- [x] 5.4 Integrate into Journal page

## 6. Verification
- [x] 6.1 TypeScript check passes
- [x] 6.2 Journal page renders correctly
- [x] 6.3 ResonancePanel conditional display works
- [x] 6.4 API routes registered
