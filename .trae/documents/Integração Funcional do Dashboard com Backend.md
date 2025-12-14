## Objetivo
Transformar os blocos `div` e `main` do Dashboard em página funcional integrada ao backend, com segurança, performance, estados de carregamento/erro e sincronização em tempo real.

## Integrações de Backend
- Perfil: `GET /api/auth/verify` para carregar identidade (nome, avatar, preferências); `PATCH /api/auth/profile` para atualizar.
- Tarefas: CRUD via `/api/tasks` (usar hooks existentes `useTasks` para lista e estatísticas base).
- Calendário Google:
  - `GET /api/calendar/auth-url` → iniciar OAuth;
  - `GET /api/calendar/callback` → retornar `code`/`state`;
  - `POST /api/calendar/connect` → trocar código por tokens;
  - `GET /api/calendar/events` → listar eventos; tratar `ECONNREFUSED` com fallback de estado e CTA para conectar.
- Score (se disponível): montar `GET /api/score` no backend posteriormente; no frontend, prever hook opcional que usa esse endpoint quando ativo e senão computa métricas localmente a partir de tarefas.

## Camada de Cliente (HTTP)
- Criar util `fetchJSON(url, options)` com:
  - `credentials: 'include'` para cookies HttpOnly;
  - headers padrão (`'Content-Type': 'application/json'`), e `Authorization` quando necessário (fallback a partir de contexto `useAuth`);
  - tratamento de erros (status não-2xx → lança erro com mensagem legível);
  - timeout leve e abort via `AbortController` para evitar hangs.
- Implementar retry exponencial para falhas transitórias (`ECONNREFUSED`), com limite e feedback ao usuário.

## Hooks do Dashboard
- `useDashboardIdentity`: carrega `GET /api/auth/verify`, expõe `{user, loading, error, refresh}`.
- `useDashboardStats`: agrega dados de `useTasks` e opcionalmente `GET /api/score`; calcula `%` “To Next Lvl”, contadores (active/completed/overdue/today), e velocity semanal.
- `useCalendarEvents`: gerencia OAuth (url, callback, connect), carrega `GET /api/calendar/events`, estados `loading/error`, expõe `events` e CTA de conexão.

## Ligação de UI (Div/Main)
- Substituir dados estáticos do cartão de identidade por dados dos hooks:
  - Nome do usuário, avatar, nível, `%` para próximo nível, barra de progresso.
  - Ajustar classes para manter OLED Minimalist e tabular-nums.
- No `main`, carregar e apresentar:
  - Painéis com métricas (Mission Control, Focus State, Velocity) usando dados de hooks;
  - Renderizar listas com loading/skeleton (`Loader`) e empty states;
  - Botões/ações (criar tarefa, gerar plano IA) com estados disabled enquanto carrega.

## Estados de Carregamento e Erro
- Loading: `Loader` central nos painéis e spinners contextuais em botões.
- Erro: `GlassToast` e mensagens inline discretas; evitar overlay bloqueante; oferecer ação de retry.
- Empty: mensagens e CTAs (ex.: “Conectar Calendário”).

## Sincronização e Tempo Real
- Reutilizar `useRealtime` já ativo no `AppLayout` para refletir mudanças.
- No `useTasks`, após operações (create/update/delete), invalidar caches locais do Dashboard para manter consistência.

## Segurança
- Cookies HttpOnly (já usado no backend): requests com `credentials: 'include'`.
- CORS alinhado ao allowlist do backend; sem exposição de segredos no cliente.
- Sanitização básica de entradas de busca/filters; debounce.

## Performance
- Memoização (`useMemo`) para cálculos (velocity, percentuais);
- Abort de requisições obsoletas durante navegação;
- Renderização condicional de cards apenas quando dados prontos.

## Testes e Cenários
- Cenários:
  - Usuário autenticado sem tarefas/eventos; com dados;
  - Falha de backend (`ECONNREFUSED`) → feedback + retry;
  - Fluxo de conexão do Calendário;
  - Alterações em tarefas refletindo na UI.
- Validação manual no dev server; revisão de logs; inspeção de acessibilidade (contraste/foco).

## Entregáveis
- Serviços HTTP utilitários e hooks (`identity`, `stats`, `calendar`).
- Dashboard com UI dinâmica nos blocos selecionados, estados de loading/erro e ações funcionais.
- Tratamento robusto de erros e sincronia com endpoints existentes, mantendo OLED Minimalist.

## Próximo Passo
Ao aprovar, implemento os hooks e a ligação da UI no `DashboardPage`, com serviços HTTP e tratamento de estados, sem alterar a lógica de negócio existente (apenas integração visual e dados).