# User API

- Base: `/api/user`
- Auth required

## Endpoints
- `GET /api/user/me` → retorna dados do usuário (inclui `preferences`)
- `PUT /api/user/preferences` → atualiza preferências (JSON)

## Preferências sugeridas
- `lowIA: boolean`
- `autoClassifyFinance: boolean`
- `theme: 'dark'|'light'`
