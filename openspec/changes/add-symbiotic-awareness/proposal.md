# Add Symbiotic Awareness Features

## Summary

Transform Life OS from a passive tool into an **empathic, responsive organism** through three integrated capabilities:

| Feature | Description |
|---------|-------------|
| **Atmospheric Awareness** | Weather integration for context-aware greetings and suggestions |
| **Auto-Aesthetic** | Automatic cover image generation for projects via Unsplash |
| **Synapse v2 (Neural Intent)** | Natural language task parsing powered by Groq/LLaMA |

## Motivation

The dashboard currently uses static placeholder content. Users interact with a "dead" interface that doesn't respond to their physical context (weather, time of day) or creative intent (project naming). By adding server-side proxies for external APIs, we unlock **rich contextual data** without exposing API keys to the client or causing rate-limit issues.

## User Review Required

> [!IMPORTANT]
> **API Keys Required**: The following environment variables must be configured on the server:
> - `OPENWEATHER_API_KEY` — Free tier supports 60 calls/min
> - `UNSPLASH_ACCESS_KEY` — Free tier supports 50 requests/hour

> [!WARNING]
> **Scope Decision**: This proposal focuses on the backend proxy layer and minimal frontend integration. More sophisticated AI suggestions (e.g., "Don't skip leg day because it's raining") are deferred to a future "Nexus Coaching" feature.

## Architecture

```mermaid
flowchart LR
  subgraph Frontend
    A[Zone3_Context]
    B[ProjectModal]
    C[Synapse]
  end
  subgraph Backend API
    D[/api/context/weather]
    E[/api/media/images]
    F[/api/ai/parse-task]
  end
  subgraph External
    G[(OpenWeather)]
    H[(Unsplash)]
    I[(Groq LLaMA)]
  end
  
  A --> D --> G
  B --> E --> H
  C --> F --> I
```

## Proposed Changes

### Backend — Context Service (Weather Proxy)

#### [NEW] [weatherService.ts](file:///c:/Users/pedro/Documents/life-os/api/services/weatherService.ts)

Implements OpenWeather API client with **in-memory cache** (30 min TTL) using `node-cache`. Caches by rounded lat/lon (2 decimal precision) to reduce unique keys.

#### [NEW] [context.ts](file:///c:/Users/pedro/Documents/life-os/api/routes/context.ts)

- `GET /api/context/weather?lat=:lat&lon=:lon` — Returns weather condition, temperature, icon code
- Requires authentication (`authenticateToken`)
- Validates lat/lon with Zod schema

---

### Backend — Media Service (Unsplash Proxy)

#### [NEW] [mediaService.ts](file:///c:/Users/pedro/Documents/life-os/api/services/mediaService.ts)

Implements Unsplash API client. Returns optimized image URLs (`w=600` for performance).

#### [NEW] [media.ts](file:///c:/Users/pedro/Documents/life-os/api/routes/media.ts)

- `GET /api/media/images?query=:query&page=:page` — Returns array of image URLs
- Requires authentication
- Debounce hints sent via response headers (`X-Debounce-Recommended: 800`)

---

### Backend — AI Parse Task

#### [MODIFY] [ai.ts](file:///c:/Users/pedro/Documents/life-os/api/routes/ai.ts)

Add new endpoint:
- `POST /api/ai/parse-task` — Accepts `{ input: string }`, returns structured `{ title, dueDate, priority }` JSON

#### [MODIFY] [aiService.ts](file:///c:/Users/pedro/Documents/life-os/api/services/aiService.ts)

Add `parseTaskFromNaturalLanguage(input: string)` method using Groq provider with JSON mode. Injects current server timestamp into system prompt for temporal context ("tomorrow" → actual date).

---

### Frontend — Atmospheric Awareness

#### [MODIFY] [Zone3_Context.tsx](file:///c:/Users/pedro/Documents/life-os/src/features/dashboard/components/Zone3_Context.tsx)

Add new `WeatherCard` component:
- Uses `navigator.geolocation.getCurrentPosition()` on mount
- Calls `/api/context/weather` with coordinates
- Maps OpenWeather icon codes to Lucide icons (e.g., `01d` → `<Sun />`, `09d` → `<CloudRain />`)
- Renders skeleton while loading
- Shows empathetic suggestion based on condition (simple switch/case, no AI)

---

### Frontend — Auto-Aesthetic

#### [MODIFY] [ProjectModal.tsx](file:///c:/Users/pedro/Documents/life-os/src/features/projects/components/ProjectModal.tsx)

- Add `useDebounce` hook on title input (800ms delay)
- On debounced title change, fetch `/api/media/images?query={title}`
- Display first image as cover preview with animated gradient skeleton
- Add "Shuffle" button to request next random page

---

### Frontend — Synapse v2 (Neural Intent)

#### [MODIFY] [Synapse.tsx](file:///c:/Users/pedro/Documents/life-os/src/shared/ui/synapse/Synapse.tsx)

- When input doesn't start with `/` and is likely natural language:
  - Call `POST /api/ai/parse-task` with input text
  - If successful, pre-fill task creation modal with parsed fields
  - If parsing fails, gracefully fall back to input as title only
- Visual feedback: pulsing border animation during AI processing

---

## Verification Plan

### Automated Tests

| Test | Command | Description |
|------|---------|-------------|
| Weather route | `npm test -- --grep "context.weather"` | Validates endpoint returns valid weather shape |
| Media route | `npm test -- --grep "media.images"` | Validates endpoint returns image URLs |
| AI parse task | `npm test -- --grep "ai.parse-task"` | Validates JSON extraction from NL input |

New test files to create:
- `api/tests/routes.context.test.ts`
- `api/tests/routes.media.test.ts`
- (Extend existing `routes.ai.test.ts`)

### Manual Verification

1. **Weather Integration**:
   - Open Dashboard → Allow location permission
   - Verify weather card shows current condition with correct icon
   - Wait 30 min, verify cache hit (check server logs)

2. **Project Cover**:
   - Create new project → Type "beach vacation"
   - Verify cover image appears after ~1 second
   - Click "Shuffle" → Verify new image loads

3. **Synapse NL Parsing**:
   - Press `Cmd+K` → Type "Buy flowers tomorrow at 10am"
   - Verify task modal opens with pre-filled fields:
     - Title: "Buy flowers"
     - Due: Tomorrow's date
     - Time: 10:00 AM

## Rollout

- [ ] Phase 1: Backend proxy endpoints + tests
- [ ] Phase 2: Weather card integration
- [ ] Phase 3: Project modal cover images
- [ ] Phase 4: Synapse NL parsing
