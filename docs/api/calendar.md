# Google Calendar API

- Base: `/api/calendar`
- Requirements: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

## Endpoints
- `GET /api/calendar/auth-url` → retorna URL de autorização
- `GET /api/calendar/callback?code=...` → troca código por tokens (guarda em `calendar_tokens`)
- `GET /api/calendar/events` → lista eventos do calendário primário

## Notas
- Tokens armazenados por usuário; escopo `calendar`.
- Em ambientes sem configuração, endpoints retornam `501`.
