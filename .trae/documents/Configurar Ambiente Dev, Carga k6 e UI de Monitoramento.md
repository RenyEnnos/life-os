## Backend
- Criar `.env` no projeto usando as chaves do `.env.example`.
- Definir `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (backend) e `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` (frontend).
- Definir `JWT_SECRET` e `AI_TEST_MODE=mock` para evitar chamadas Groq em desenvolvimento.
- Windows PowerShell (sessão atual):
  - `$env:SUPABASE_URL="<url>" ; $env:SUPABASE_SERVICE_ROLE_KEY="<service_role>" ; $env:JWT_SECRET="dev-secret" ; $env:AI_TEST_MODE="mock"`
- Subir serviços com `npm run dev` (client via Vite e backend via Nodemon); verificar logs do backend não acusando erro de Supabase (`api/lib/supabase.ts`).

## Carga de Dados com k6
- Instalar k6 (Windows): `choco install k6` ou baixar binário oficial.
- Obter token JWT:
  - Registrar ou logar: `POST /api/auth/register` ou `POST /api/auth/login` e salvar `token` retornado.
- Executar k6 com token no ambiente:
  - PowerShell: `$env:TOKEN="<JWT>" ; k6 run scripts/load/k6.js`
- Popular métricas: habilitar o `POST` para `/api/dev/perf` no script (`scripts/load/k6.js`), enviando `{ endpoint, latency_ms, status }` com `Authorization: Bearer <TOKEN>`.
- Validar ingestão via `GET /api/dev/perf/stats` (proxy do Vite: `http://localhost:5174/api/dev/perf/stats`).

## UI: Endpoints Mais Acessados e Auto-Refresh
- Selector de endpoints por frequência:
  - Calcular contagem por `endpoint` a partir de `stats.series` e ordenar desc.
  - Popular dropdown com `ep (count)` e manter opção `ALL`.
- Auto-refresh com pausa/continuação:
  - Adicionar estado `autoRefresh` (boolean) e indicador visual: `AUTO-REFRESH: ATIVO/PAUSADO`.
  - Atualizar `usePerfStats` para aceitar `enabled` e `intervalMs` ou controlar o `setInterval` no componente.
  - Ao pausar, limpar `interval` e manter dados; ao retomar, disparar `fetchStats()` imediato.
- Feedback visual:
  - Botões com `disabled`/loading, mensagens de erro (`error`) e `loading` visível.
  - Mostrar contagens em chips/cards (throughput, média, p95) já presentes.

## Qualidade e Responsividade
- Atualização em tempo real: polling a cada 5s; garantir `fetch` imediato ao retomar e ao mudar filtros.
- Responsividade: grids `md:grid-cols-3` e `overflow-x-auto` nas tabelas.
- Acessibilidade e feedback claro: foco/hover nos botões, rótulos e estados visíveis.

## Verificação
- Com envs configurados, subir `npm run dev` e confirmar `GET /api/dev/perf/stats` responde.
- Rodar k6 por 30s com `TOKEN` definido; verificar gráficos atualizando na Settings.
- Testar filtro por endpoint e alternância de janela (1h/6h/24h).
- Pausar/retomar auto-refresh e confirmar indicador visual e retomada imediata.

Confirma prosseguir com as alterações (habilitar POST no k6, ajustar hook/UI e scripts)?