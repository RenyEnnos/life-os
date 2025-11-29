# Score API

- Base: `/api/score`
- Auth required

## Endpoint
- `GET /api/score` → retorna `{ score: number (0-100), trend: 'up'|'down'|'stable', statusText: string }`
- Cálculo baseado em tarefas concluídas/atrasadas, quantidade de hábitos, média de passos 7 dias, e registro financeiro.
