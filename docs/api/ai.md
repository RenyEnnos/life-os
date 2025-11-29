# AI API (Groq)

- Base: `/api/ai`
- Requirements: `GROQ_API_KEY` env; optional `GROQ_MODEL`

## Endpoints
- `POST /api/ai/classify-transaction`
  - Body: `{ description: string }`
  - Response: `{ category: string, source: 'heuristic'|'cache'|'ai' }`
  - Heurística local executada antes de IA; IA chamada apenas se ambíguo.
- `POST /api/ai/swot-analysis`
  - Body: `{ projectId: string, context: { tasks, notes, journalEntries } }`
  - Response: `{ strengths: string[], weaknesses: string[], opportunities: string[], threats: string[] }`
  - Cache habilitado; limite diário aplicado.
- `POST /api/ai/daily-summary`
  - Body: `{ date: 'YYYY-MM-DD' }`
  - Response: `{ summary: string }`

## Limites e Logs
- Limite diário por função; logs em `ai_logs` com `tokens_used`, `response_time_ms`, `success`.
