# AI API (Groq)

- Base: `/api/ai`
- Requirements: `GROQ_API_KEY` env; optional `GROQ_MODEL`

## Endpoints
- `POST /api/ai/tags` → sugere tags
  - Body: `{ context: string, type: 'habit'|'task'|'journal'|'finance' }`
  - Query: `force=true` (bypassa Low-IA)
- `POST /api/ai/swot` → FOFA
  - Body: `{ context: string }`
  - Query: `force=true`
- `POST /api/ai/plan` → plano semanal
  - Body: `{ context: string }`
  - Query: `force=true`
- `POST /api/ai/summary` → resumo diário
  - Body: `{ context: string }`
  - Query: `force=true`

## Limites e Logs
- Limite diário por função; logs em `ai_logs` com `tokens_used`, `response_time_ms`, `success`.
 - Modo Low-IA: quando ativo no usuário, chamadas requerem `force=true`.
