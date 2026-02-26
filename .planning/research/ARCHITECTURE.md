# Architecture Patterns: Life OS

**Domain:** Personal Operating System (Life OS)
**Researched:** 2025-03-24
**Confidence:** HIGH

## Recommended Architecture

Life OS follows a **Hybrid Local-First** architecture. It prioritizes instant feedback for high-frequency user actions (Habits, Tasks) while leveraging a robust cloud-based AI pipeline for heavy processing.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Client SPA (React)** | UI Rendering, Optimistic State, Local AI (Transformers.js) | Express API, Supabase Realtime |
| **Local Cache (React Query)** | Data persistence (IndexedDB), Offline support, Cache management | Supabase (PostgREST), Client UI |
| **Express Gateway** | AI Orchestration, Complex Governance, Security Middlewares | Supabase, AI Providers (Groq/Google) |
| **Supabase (DB/Auth)** | Source of Truth, Row Level Security (RLS), Realtime WebSockets | Express API, Client SPA |
| **AI Pipeline** | Long-running analysis, Journal insights, Auto-categorization | Express API, Supabase (results) |

### Data Flow

#### 1. High-Frequency Interaction (e.g., Habit Check-in)
1. **User Action**: User clicks "Habit Done".
2. **Optimistic Update**: React Query updates local UI state immediately (0ms latency).
3. **Async Sync**: Request sent to Supabase (Direct or via Express).
4. **Reconciliation**: If sync fails, UI rolls back and notifies user.

#### 2. AI-Powered Capture (e.g., Quick Task Capture)
1. **User Input**: "Remind me to call John tomorrow at 2pm regarding the project".
2. **Local Analysis**: Client uses `Transformers.js` (optional) or sends to Express.
3. **Heavy AI**: Express sends prompt to **Groq/Google AI**.
4. **Structured Data**: AI returns JSON (title: "Call John", date: "2025-03-25 14:00", tags: ["project"]).
5. **Persistence**: Express saves to Supabase.
6. **Realtime Update**: Client UI updates via WebSocket.

## Patterns to Follow

### Pattern 1: Optimistic Mutations with React Query
**What:** Assume the server call succeeds and update the UI immediately.
**When:** For all high-frequency interactions (Habits, Tasks, XP gain).
**Example:**
```typescript
const mutation = useMutation({
  mutationFn: updateHabit,
  onMutate: async (newHabit) => {
    await queryClient.cancelQueries(['habits']);
    const previous = queryClient.getQueryData(['habits']);
    queryClient.setQueryData(['habits'], (old) => [...old, newHabit]);
    return { previous };
  },
  onError: (err, newHabit, context) => {
    queryClient.setQueryData(['habits'], context.previous);
  },
});
```

### Pattern 2: Domain-Driven Feature Slices (FSD)
**What:** Keep features self-contained in `src/features/[feature_name]`.
**When:** Expanding to new domains like University or Finances.
**Rule:** `features/university` cannot import from `features/finances`. Shared logic goes to `src/shared`.

### Pattern 3: AI Result Stream/Webhook
**What:** AI results are treated as "Eventual Consistency".
**Instead of:** Making the user wait for a 2s AI response.
**Do:** Show a "Processing..." state, let AI write to a dedicated `ai_feedback` table, and use Supabase Realtime to update the UI once ready.

## Evaluation: Express Layer vs. Direct Supabase

| Path | Latency | Governance | Best For |
|------|---------|------------|----------|
| **Direct Supabase** | Low (50-150ms) | RLS (Basic) | CRUD (Tasks, Habits, Finances) |
| **Express Gateway** | Medium (200-500ms)| High (Custom logic, AI) | AI processing, Bulk imports, Auth flows |

**Recommendation:** Use **Direct Supabase** for 90% of data fetching/saving. Use **Express** strictly as a "Controller" for AI and complex operations.

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **DB Performance** | Single Postgres | Optimized Indexes | Postgres Sharding / Read Replicas |
| **AI Costs** | Pay-as-you-go | Fine-tuned smaller models | Self-hosted LLMs (Ollama/vLLM) |
| **Sync Traffic** | Realtime WebSockets | Connection pooling | Distributed Pub/Sub (Redis) |

## Sources

- [Supabase Local-First Guide](https://supabase.com/docs/guides/getting-started/architectures/local-first)
- [Feature-Sliced Design Official Docs](https://feature-sliced.design/)
- [Ink & Switch: Local-First Software](https://www.inkandswitch.com/local-first/)
- [React Query Persistence](https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient)
