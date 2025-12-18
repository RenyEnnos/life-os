## Context
- Stack: React/Vite/Tailwind/Supabase; modules: /gamification, /ai-assistant (Synapse), /sanctuary, /synapse, dashboard widgets and Dynamic Now spec.
- Target: turn Life OS into an “organismo digital vivo” with Nexus/Agora as the active surface, Synapse as orchestrator (Gemini NLP), and symbiosis across Health ↔ Fluxo (Tasks).
- Constraints: keep Deep Glass OLED aesthetic, framer-motion for liquid interactions, and minimal decision surfaces (no paralysis). Avoid mocks; favor real data paths.

## Goals / Non-Goals
- Goals: (1) Agora Dinâmico with time-of-day states and decisionless CTAs; (2) Synapse Neural Resonance suggestions using Gemini with mood/context; (3) Health ↔ Fluxo links with cost + vital impact; (4) Archetypes + Visual Legacy; (5) Elite Identity nomenclature; (6) Sanctuary monocromático + áudio binaural.
- Non-Goals: offline mode, push notifications, template marketplace, multi-tenant RBAC changes.

## Decisions
- Aesthetic: OLED black base (`#000`), glass layers (`bg-black/60` + `backdrop-blur-3xl`), low-chroma accent tokens; motion via framer-motion with reduced-motion support.
- Agora: slot-based layout keyed by day-part (manhã/tarde/noite) and mood; decisionless CTAs limited to ≤3 actions, prioritized by Synapse signals.
- Synapse: use Gemini model (Gemini 1.5/flash for latency) via existing AI middleware; classify intent + mood; cache last response per context; apply server-side rate limit; fallback to heuristic suggestions.
- Symbiosis: introduce link entity (task_id, habit_id, impact_vital (−5..+5), custo_financeiro), derived “carga vital” metric per day; expose in Nexus + detail views.
- Gamification: archetype assignment rule engine using behavior signals (ritual consistency, focus depth, recovery compliance); Visual Legacy uses generative art (canvas/SVG) seeded by archetype + progress milestones.
- Identity: enforce nomenclature (Dashboard→Nexus, Tasks→Fluxo, Assistant→Synapse, Habits/Health remains, Gamification→Arquétipos, Gallery→Legacy, Dynamic section→Agora).
- Safety/telemetry: log suggestion events, accepted CTAs, and link creation; guardrails for AI failure (timeouts, graceful copy).

## Risks / Trade-offs
- Gemini cost/latency: mitigate with flash model + caching; cap request frequency.
- Motion performance on low-end devices: mitigate via reduced-motion, capped blur radius, and GPU-friendly transforms.
- Behavioral inference accuracy: start with deterministic rules + simple mood classifier; collect feedback for iteration.
- Scope spread across modules: sequence phases and keep feature toggles per surface (Agora, Synapse suggestions, Legacy view).

## Migration Plan
- Phase 1: ship Agora base layout + Deep Glass tokens + Synapse flash suggestions + Health↔Fluxo link model; feature flags for Agora and suggestions.
- Phase 2: enable archetype engine + Visual Legacy gallery; expand Synapse context to include health/finance; refine motion.
- Phase 3: roll Sanctuary monochrome + binaural; harden telemetry and QA; lift flags after beta feedback.

## Open Questions
- Mood signal source: infer via text only or add quick mood selector?
- Finance source: do we estimate custo_financeiro manually or integrate with finance module API?
- Visual Legacy renderer: prefer client-only generative (no external textures) or allow CDN assets?
