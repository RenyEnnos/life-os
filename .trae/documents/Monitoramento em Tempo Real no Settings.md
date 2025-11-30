## 1. Visão Geral
- Objetivo: exibir métricas de desempenho em tempo real (throughput, latência p95/média, taxa de erros) na seção Settings.
- Fonte de dados: `GET /api/dev/perf/stats` (series temporal + agregados) e ingestão por script k6 com token de teste.
- Requisitos: atualização automática (5s), histórico local (24h), responsivo, filtros avançados com `or()` do Supabase, tratamento de erros.

## 2. Backend (Dados e Filtros)
- Confirmar endpoint de leitura: `GET /api/dev/perf/stats` retorna `{ p95, avgMs, throughput, series: [{ endpoint, timestamp, latency_ms, status }] }`.
- Confirmar ingestão: `POST /api/dev/perf` aceita `{ endpoint, latency_ms, status }` com Bearer token.
- Expandir filtros em endpoints de tarefas/finanças:
  - Adicionar suporte a operador lógico `or()` do Supabase em queries: e.g. `or(type.eq.income,type.eq.expense)`.
  - Validar e normalizar parâmetros no backend (whitelist de colunas, parsing seguro de `or()`), retornando 400 em caso inválido.

## 3. Frontend (Settings → Perf Monitor)
- Criar hook `usePerfStats`:
  - `queryFn`: chama `/api/dev/perf/stats`, atualiza a cada 5s via `refetchInterval`.
  - Persiste últimas 24h em `localStorage` com chaves por usuário; ao iniciar, mescla dados locais e remotos, removendo itens fora da janela.
  - Expõe estado: `{ p95, avgMs, throughput, series, isLoading, error }`.
- Gráficos temporais (LineChart wrappers já existentes):
  - Throughput: pontos por timestamp (requisições/min ou /5s), linha verde.
  - Latência: optar por duas séries (p95/média) ou apenas p95; linha amarela/verdes.
  - Taxa de erros: % por intervalo (status >= 400/500), linha vermelha.
- UI Settings:
  - Seção “Monitoramento de Desempenho” com 3 cards (Throughput, Latência, Erros) usando `LineChart`.
  - Controles: seletor de intervalo (1h, 6h, 24h), endpoint filter (`/api/tasks`, `/api/finances/*`, ALL), botão “limpar histórico”.
  - Estados: `loading` (skeleton), `error` (mensagem brutalista, retry), `empty`.
- Responsividade:
  - Grid 1–2 colunas; `ResponsiveContainer` para gráficos; labels reduzidos em mobile.

## 4. Script de Carga (k6)
- Criar `scripts/load/k6.js` com cenários (stages):
  - VUs: 10→50→10; duração: 1m–3m–1m; endpoints variados (`/api/tasks`, `/api/finances/summary`, `/api/ai/summary`).
  - Ingestão: `http.post('/api/dev/perf', { endpoint, latency_ms: res.timings.duration, status: res.status }, headers({ Authorization: Bearer TOKEN }))`.
  - Token de teste: gerar via login (`/api/auth/login`) e passar por `__ENV.TOKEN` no k6.
  - Intervalos regulares: `sleep(1)` com jitter; endpoints alternados.
- Documentar execução: `k6 run scripts/load/k6.js` com envs.

## 5. Filtros Avançados (UI + Backend)
- UI Builder de filtros:
  - Componentes de chips/inputs que constroem uma expressão `or()` segura (apenas colunas permitidas: `type`, `category`, `tag`).
  - Exibir preview da query e permitir reset.
- Backend:
  - Interpretar `or` via parâmetro `or` string; aplicar `supabase.or(orString)` somente após validação (regex simples e whitelist de colunas/operadores `eq`/`contains`).

## 6. Tratamento de Erros e Segurança
- Hook `usePerfStats`:
  - Retry exponencial com backoff leve; abortar em 429 (limites) e exibir mensagem.
  - Cancelar polling quando aba não ativa (visibilitychange) e retomar ao foco.
- Token de teste:
  - Gerar apenas em ambiente dev; nunca commitar; instruções no README para obter e usar.

## 7. Testes e Validação
- Unit/integração:
  - `usePerfStats` com mock de `/api/dev/perf/stats`: sucesso, erro, reconexão, merge histórico 24h e limpeza.
  - Filtros: construir `or()` válido, parâmetros inválidos → 400.
- Snapshot (Storybook):
  - Stories para Perf Monitor com dados simulados (low/high throughput, high latency, many errors) + snapshots.
- Carga:
  - Executar k6 com diferentes VUs; verificar gráficos atualizados em tempo real; validar p95/média e throughput.
- Mobile:
  - Verificar layout (coluna única), labels abreviados, responsividade.

## 8. Documentação e CHANGELOG
- README: seção “Monitoramento de Desempenho”, uso do k6, como obter token, parâmetros da API e filtros `or()`.
- CHANGELOG: entrada com novos gráficos, perf endpoints, script k6 e filtros avançados.

## 9. Entregáveis
- Hook `usePerfStats` e componentes Settings atualizados.
- Script `scripts/load/k6.js` completo com token.
- Backend filtros com `or()` validado.
- Stories & snapshots dos gráficos e Dev Logs.
- Testes unitários/integrados e instruções no README.

Confirma para aplicar as mudanças (hooks, UI Settings, filtros backend, script k6, testes e documentação).