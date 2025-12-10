# Add Neural Resonance (Ressonância Neural)

## Why This Change?

**Current Problem:**
Journal entries are static text. Users write entries but don't receive any actionable insights from their accumulated data. The Memory feature lacks a "living" quality - it stores but doesn't think.

**Impact Without Change:**
- Valuable patterns in user behavior remain undiscovered
- No emotional intelligence applied to the journal
- Missed opportunity for proactive wellbeing suggestions
- Second brain doesn't "resonate" with user's mental state

## What Changes?

### 1. Async AI Analysis Pipeline
- Background analysis of journal entries when created/updated
- Store AI-generated insights in new `journal_insights` table
- Non-blocking: analysis happens after save, user doesn't wait

### 2. Insight Types Generated
- **Mood Tracking**: Detect emotional patterns over time
- **Theme Extraction**: Identify recurring topics/concerns
- **Energy Correlation**: Link journal content with Dynamic Now energy levels
- **Weekly Resonance**: Synthesize weekly patterns into actionable summary

### 3. UI Integration
- "Resonance" sidebar on Journal page showing recent insights
- Mood trend visualization (simple line chart)
- "Nexus suggests..." proactive recommendations

## Impact

### User Benefits
- **Self-awareness**: See patterns you didn't notice
- **Proactive support**: Get suggestions before burnout
- **Integrated ecosystem**: Journal connects to tasks/energy

### Technical Scope

| Component | Effort |
|-----------|--------|
| Supabase Edge Function | Medium |
| `journal_insights` table | Low |
| UI components | Medium |
| TypeScript types | Low |

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AI analysis slow | Run async via Edge Function, show cached results |
| API costs | Rate limit: max 1 analysis per entry per day |
| Privacy concerns | All processing via user's own LLM API key (optional) |
| Insight quality | Start simple (mood only), iterate based on feedback |

## Design System Alignment
- Insights panel uses Glass & Void aesthetic
- Mood chart with gradient matching energy colors
- "Nexus suggests" uses AI icon (Sparkles) consistency
