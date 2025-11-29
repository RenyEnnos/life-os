# Export API

- Base: `/api/export`
- Auth required

## Endpoints
- `GET /api/export/json` → exporta todas as entidades do usuário em JSON
- `GET /api/export/csv?type=transactions|tasks|habits` → exporta tabela específica em CSV

## Respostas
- `200` com dados; `400` tipo inválido.
