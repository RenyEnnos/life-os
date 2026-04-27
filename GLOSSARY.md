---
type: reference
status: active
last_updated: 2026-04-27
tags: [glossary, terminology]
---

# LifeOS Glossary

Standardized terminology for the LifeOS project. Use these terms consistently across code, documentation, and commit messages.

## Product Terms

| Term | Definition |
|------|-----------|
| **Canonical MVP** | The invite-only weekly operating loop under `/mvp` routes. Source of truth: `docs/mvp/canonical-mvp.md`. |
| **Weekly Operating Loop** | The core MVP flow: onboarding → weekly review → plan generation → daily execution → reflection → feedback. |
| **Weekly Review** | Step where user reviews past week's progress, sets goals, and generates a new plan. |
| **Daily Check-In** | Daily execution step: user reports energy, focus, and blockers. |
| **Reflection** | End-of-cycle step where user reflects on what worked and what didn't. |
| **Invite-Only** | MVP access model: users need a valid invite code to register. |

## Architecture Terms

| Term | Definition |
|------|-----------|
| **Electron-First** | LifeOS's primary runtime is Electron desktop. Web/Capacitor are future perspectives. |
| **Offline-First** | All data stored locally in SQLite. App works without internet. Cloud sync is optional. |
| **IPC** | Inter-Process Communication. Electron's mechanism for Renderer ↔ Main process communication via `window.api`. |
| **File-Backed Repository** | Default local persistence using JSON files. Zero-config, no database server required. |
| **Prisma Repository** | PostgreSQL-backed persistence via Prisma ORM. Activated when `DATABASE_URL` is configured. |
| **BaseRepository** | Generic SQLite repository pattern in `electron/db/BaseRepository.ts`. Used by IPC handlers. |
| **Legacy Handler** | IPC handler that dynamically proxies `/api/{table}` calls to SQLite. Enables unmigrated features to work offline. |
| **Resource Handler** | Generic IPC handler that routes `resource:invoke` to BaseRepository CRUD by allowlisted table. |
| **Sync Engine** | Background process in Electron main that pushes local changes to Supabase every 10 seconds. |
| **Transparent Offline Fallback** | Pattern where `fetchJSON` intercepts `/api/` calls in Electron and routes them through IPC to SQLite. |

## Design Terms

| Term | Definition |
|------|-----------|
| **Digital Cockpit** | The design philosophy: OLED black, glassmorphism, high contrast, surgical color use. |
| **OLED Black** | Background color `#050505`. Pure black optimized for OLED displays. |
| **Glassmorphism** | Visual effect using `backdrop-blur-xl` + semi-transparent surfaces. |
| **Electric Blue** | Primary accent color `#308ce8`. The only accent color in the system. |
| **Semantic Tokens** | Tailwind classes like `bg-background`, `text-foreground` that map to theme values. |

## Testing Terms

| Term | Definition |
|------|-----------|
| **Authoritative Lane** | Electron Playwright smoke tests (`npm run test:e2e`). Used as release evidence. |
| **Advisory Lane** | Browser Playwright tests (`npm run test:e2e:advisory`). Non-blocking, multi-browser. |
| **Integration Test** | Tests with `.int.test.tsx` suffix. Test feature flows with mocked API layer. |
| **Release Verification Ladder** | Ordered quality gates: e2e → test → typecheck → lint → build. |

## State Management Terms

| Term | Definition |
|------|-----------|
| **Zustand Store** | Lightweight state management with `persist` middleware + IndexedDB adapter. |
| **DynamicNow** | Time-of-day filtering system that hides high-energy tasks after 6pm, prioritizes morning tasks before 9am. |
| **Sanctuary Mode** | Focus mode with ambient noise (white/pink/brown noise via Web Audio API). |

## AI/Assistant Terms

| Term | Definition |
|------|-----------|
| **Synapse** | Intelligent suggestion engine (planned). Sources: `gemini`, `heuristic`, `cache`. |
| **Nexus** | Floating AI assistant widget (`FloatingNexus.tsx`). Provides quick AI access from any screen. |
| **AI Context Map** | Navigation document (`AI_CONTEXT_MAP.md`) that tells AI agents which doc to read for each task. |
