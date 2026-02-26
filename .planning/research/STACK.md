# Technology Stack: Life OS

**Project:** Life OS
**Researched:** 2025-03-24
**Overall Confidence:** HIGH

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **React** | 18+ | Frontend Core | Standard, component-based, large ecosystem. |
| **Vite** | Latest | Build Tool | Extremely fast HMR, optimized production builds. |
| **Express** | 4.x | Backend Orchestrator| Governance, security, AI orchestration. |

### Database & Auth
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Supabase** | Latest | Persistence/Auth | PostgreSQL with built-in Auth, RLS, and Realtime. |
| **PostgreSQL** | 16+ | Data Storage | Relational, extensible, great for University/Finance. |

### State & Sync
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **React Query** | 5+ | Server State/Sync | Robust caching, optimistic updates, background sync. |
| **Zustand** | 4+ | Local UI State | Lightweight, no boilerplate, handles sidebars/modals. |
| **IndexedDB** | N/A | Local Persistence | Used via `persistQueryClient` for offline access. |

### AI Integration
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Groq / Google AI**| N/A | Heavy LLM | Fast inference (Groq), Large context (Gemini). |
| **Transformers.js**| 2.x | Local AI | On-device classification/parsing (privacy & speed). |
| **LangChain.js** | Latest | AI Orchestration | Standardizing prompt flows and RAG pipelines. |

### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Vercel** | N/A | Hosting | Seamless integration with Vite/React, Edge functions. |
| **PWA (Vite Plugin)**| Latest | Mobile-like Exp | Offline access, home screen installable (cost-effective). |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Local-First** | React Query + Persist | ElectricSQL / RxDB | High migration cost for brownfield; too much overhead for current scale. |
| **Database** | Supabase | Local SQLite (WASM) | Syncing SQLite to cloud is complex; Supabase has better Auth integration. |
| **Styling** | Tailwind CSS | CSS Modules / Styled | Tailwind allows faster prototyping and strict design tokens. |

## Installation

```bash
# Core Dependencies
npm install @supabase/supabase-js @tanstack/react-query zustand express lucide-react shadcn-ui

# AI & Local Sync
npm install @tanstack/query-sync-storage-persister @xenova/transformers langchain

# Dev Dependencies
npm install -D vite vitest @vitejs/plugin-react-swc tailwindcss postcss autoprefixer
```

## Sources

- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Transformers.js (HuggingFace)](https://huggingface.co/docs/transformers.js)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
