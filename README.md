# Life OS – Brutalist Dashboard

A personal Life OS to organize habits, tasks & calendar, journal, health, finance, projects (SWOT), rewards, and an aggregated Life Score. Built with React + TypeScript (Vite), Node.js + Express, and Supabase Postgres. Optional Groq AI for low-cost insights.

## Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind + React Router + Recharts
- Backend: Node.js + Express + TypeScript
- Database: Supabase (PostgreSQL) + RLS
- Auth: JWT
- AI: Groq (optional, token-optimized)
- Integrations: Google Calendar, Health (Google Fit/Apple Health – WIP)

## Getting Started

### Prerequisites
- Node.js LTS
- Supabase project connected
- Environment vars in `.env` (see below)

### Install & Run (dev)
```bash
pnpm install
pnpm dev
```
Frontend dev server: `http://localhost:5173/`

### Backend (dev)
```bash
pnpm server
```
API server: `http://localhost:3000/`

## Environment Variables
Create `.env` in project root:
```
# Backend
PORT=3000
JWT_SECRET=change_me
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role

# AI (optional)
GROQ_API_KEY=your_groq_key

# Google Calendar (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/callback
```

## Scripts
- `pnpm dev` – frontend dev server
- `pnpm server` – backend dev server
- `pnpm build` – frontend build
- `pnpm lint` – lint code
- `pnpm test` – run tests

## Deploy
- Frontend: Vercel (recommended)
- Backend: Render/Fly.io/Supabase Functions (future)

## License
MIT
