## Objetivo
Alinhar 100% do frontend ao backend, removendo mocks e garantindo sincronização, segurança, performance, estados de carregamento/erro, testes e CI/CD.

## Inventário e Priorização (Core)
1. Autenticação e Perfil
- Endpoints: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/verify`, `/api/auth/profile`
- Front: `AuthContext`, páginas de Login/Settings/Profile
2. Tarefas
- Endpoints: `/api/tasks` (CRUD)
- Front: `useTasks`, `TasksPage`, widgets de missão/velocity
3. Calendário Google
- Endpoints: `/api/calendar/auth-url`, `/api/calendar/connect`, `/api/calendar/events`
- Front: hooks/painéis de agenda e CTA de conexão
4. Finanças
- Endpoints: `/api/finances/transactions`, `/api/finances/summary`
- Front: `FinancesPage`, componentes de transações/Resumo
5. Hábitos e Saúde
- Endpoints: `/api/habits/*`, `/api/health/*`
- Front: páginas e hooks correspondentes
6. Journal & AI
- Endpoints: `/api/journal/*`, `/api/resonance/*`
- Front: `JournalPage`, insights AI
7. Gamificação
- Endpoints: `/api/rewards/*` (score/xp/achievements)
- Front: badges, cards de nível e score

Prioridade (criticamente de negócio): 1) Auth/Perfil, 2) Tasks, 3) Calendário, 4) Finanças, 5) Journal & AI, 6) Hábitos/ Saúde, 7) Gamificação.

## Etapa 1 — Refatoração do Core
- Substituir todos os módulos de mocks por chamadas reais:
  - Criar/usar util HTTP único com `credentials: include`, timeout, abort, parse de JSON e mensagens de erro.
  - Adotar `apiClient` (get/post/put/patch/delete) e `apiFetch` para fluxos genéricos.
  - Implementar feedback ao usuário com toasts e mensagens inline discretas.
- Estado fiel ao backend:
  - Carregar dados em hooks dedicados (ex.: `useIdentity`, `useTasks`, `useCalendarEvents`, `useFinances`), com `loading/error/refresh`.
  - Invalidar caches locais após mutações (ex.: após create/update/delete de tasks).
- Segurança:
  - Cookies HttpOnly, `credentials: 'include'` em todas as requisições.
  - CORS alinhado ao allowlist do backend; sem expor segredos.
- Performance:
  - Memoização de cálculos, abort de requisições obsoletas, debounces de busca/filtros.

## Etapa 2 — Componentes Específicos (Progressivo)
- Autenticação/Perfil: ligar UI ao `/verify`/`profile`; remover placeholders; estados de erro/loader.
- Tasks: ligar lista/ações ao `/api/tasks`; dividir UI com `divide-y`; checboxes consistentes; loaders e empty states.
- Calendário: fluxo OAuth completo (auth-url → connect → events); CTA quando desconectado.
- Finanças: usar transações/summary reais; gráficos minimalistas sem neon.
- Journal & AI: persistência real; insights/resonance com fallback quando indisponíveis.
- Hábitos/ Saúde: CRUD e logs; visual minimalista; dados consistentes.
- Gamificação: score/xp/badges com endpoints; refletir progresso em UI.
- Manter compatibilidade: feature flags e camada de compatibilidade temporária; desativar mocks módulo a módulo.
- Documentar cada alteração (README por módulo, endpoints, estados, decisões).

## Etapa 3 — Fluxo de Trabalho (CI/CD + Testes)
- CI/CD (GitHub Actions ou similar):
  - Jobs: `lint`, `typecheck`, `unit`, `integration`, `build`, `e2e` (preview), `deploy` (se aplicável).
  - Artefatos: relatórios de cobertura e resultados de testes.
- Testes:
  - Unit: Vitest + React Testing Library; cobrir hooks/serviços.
  - Integração: MSW para simular backend, testar páginas e fluxos; contratos de API validados.
  - E2E: Playwright, cenários críticos (login, CRUD de tasks, conectar calendário, finanças, journal/AI).
  - Cobertura: threshold 90% (global e por pacote), com relatórios.
- Monitoramento:
  - Lighthouse/ Web Vitals em CI; logs de erro; métricas de latência por rota.
- Code Review: convenções de UI (OLED), segurança, uso de util HTTP, acessibilidade (contraste/foco).

## Critérios de Sucesso
- 100% das funcionalidades integradas a endpoints reais.
- Latência e tempo de resposta dentro dos SLAs dos serviços.
- Cobertura de testes ≥ 90%.
- Documentação atualizada (módulos, endpoints, estados, decisões).
- Zero regressões funcionais; checks de smoke em cada deploy.

## Sprints (Incremental)
- Sprint 1: Core HTTP + Auth/Perfil + Tasks.
- Sprint 2: Calendário + Finanças.
- Sprint 3: Journal & AI.
- Sprint 4: Hábitos/ Saúde.
- Sprint 5: Gamificação + Polimento (acessibilidade/performance) + E2E global.

## Riscos & Mitigações
- Mudança de contratos: usar testes de contrato e MSW; feature flags.
- Falhas intermitentes de backend: retry com backoff e mensagens claras.
- Performance: memoizações e abort; medir e otimizar.

## Entregáveis
- Util HTTP padronizado e hooks por domínio.
- UI progressivamente conectada, sem mocks.
- CI/CD com gates de qualidade; suites de testes com cobertura e e2e.
- Documentação de cada módulo e do fluxo de dados.

## Próximo Passo
Ao aprovar, inicio pela Etapa 1 com Auth/Perfil e Tasks, criando os hooks/serviços e ligando UI, e em seguida avanço para Calendário e Finanças na Sprint 2.