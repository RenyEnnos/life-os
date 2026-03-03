# Integrations

## Authentication & Backend Service
- **Supabase:** Used for user authentication, database operations, and type generation.
- **PostgreSQL:** Primary relational database (accessible via Supabase or directly).

## APIs & Third-Party Services
- **Google Generative AI / Groq:** Used for the AI Assistant features (`@google/generative-ai`, `groq-sdk`).
- **Google APIs:** Integration with Google services (Calendar, etc.) via `googleapis`.
- **Sentry:** Error tracking and performance monitoring for both Node and React (`@sentry/node`, `@sentry/react`).

## Observability & Performance
- **Lighthouse:** Automated auditing scripts (`scripts/lighthouse.js`).
- **Web Vitals:** Frontend performance tracking (`web-vitals`).
