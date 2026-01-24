# Audit: Intelligence & Logic (GAP-002)

## Overview
Analysis of "Life OS Intelligence" implementation (`ai.ts`, `synapse.ts`, `services/`) against `product.md`.
**Status**: ⚠️ FOUNDATIONS EXIST, BUT LOGIC IS FRAGILE

## 1. AI Infrastructure (AIManager)
**Requirement**: "Intelligent Automation", "Grade Forecasting".
- **Current State**:
    - `AIManager` exists and seems to route to LLM providers.
    - Endpoints (`/chat`, `/plan`, `/swot`) are implemented.
    - ✅ **Good**: Architecture is modular (`aiManager.execute`).
    - ⚠️ **Gap**: No specific "Grade Forecasting" or "Financial Prediction" specialized logic found yet. The AI seems generic ("chat", "summary") rather than domain-specific models trained on User Data.

## 2. Synapse (Suggestions)
**Requirement**: "Proactive suggestions based on context".
- **Current State**:
    - `synapseSuggestionsService` exists.
    - Frontend `dynamicCommands.ts` has hardcoded "Weather" and "Crypto".
    - ⚠️ **Gap**: The link between "Backend Synapse Suggestions" and "Frontend Dynamic Commands" seems weak. Frontend uses hardcoded logic in `dynamicCommands.ts` while Backend has a `/suggestions` endpoint. Are they connected?
    - **Risk**: "Brain split" – Frontend doing one thing, Backend doing another.

## 3. Client-Side Calculation
- `useDashboardData.ts` calculates `habitConsistency` and `vitalLoad` on the client.
- ❌ **Issue**: This logic is hidden from the "AI". The AI doesn't know your habit consistency if it's only calculated in the React hook.
- **Recommendation**: Move `habitConsistency` calculation to `habitsApi` or a proper backend service so the AI layer can read it.

## Recommendation (P1 Actions)
1.  **Unify Logic**: Move `habitConsistency` and `vitalLoad` to Backend Services (`habitsService`, `symbiosisService`).
2.  **Connect Synapse**: Ensure Frontend `dynamicCommands` fetches from Backend `/api/synapse/suggestions` instead of just using local `weather/market` logic.
3.  **Domain AI**: Implement specific "Agents" for Grades/Finance in `AIManager`, not just generic chat.
