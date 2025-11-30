## 1) Habilitar Realtime no Supabase
- Acesse o painel do Supabase → Database → Replication → Realtime.
- Ative Realtime para o projeto e adicione as tabelas que precisam emitir eventos:
  - `public.habits`, `public.habit_logs`, `public.tasks`, `public.journal`, `public.ai_logs`.
- Eventos monitorados: INSERT, UPDATE, DELETE (padrão do Realtime). Confirme que a publicação `supabase_realtime` inclui essas tabelas.

## 2) Políticas RLS (SQL)
- Ative RLS para cada tabela (se ainda não estiver ativo):
```
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
```
- Policies por tabela (exemplos):
```
-- habits: ler/alterar apenas linhas do próprio usuário
CREATE POLICY "habits_select_own" ON public.habits FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "habits_insert_own" ON public.habits FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "habits_update_own" ON public.habits FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "habits_delete_own" ON public.habits FOR DELETE USING (user_id = auth.uid());

-- habit_logs
CREATE POLICY "habit_logs_select_own" ON public.habit_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "habit_logs_insert_own" ON public.habit_logs FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "habit_logs_update_own" ON public.habit_logs FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "habit_logs_delete_own" ON public.habit_logs FOR DELETE USING (user_id = auth.uid());

-- tasks
CREATE POLICY "tasks_select_own" ON public.tasks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "tasks_insert_own" ON public.tasks FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "tasks_update_own" ON public.tasks FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "tasks_delete_own" ON public.tasks FOR DELETE USING (user_id = auth.uid());

-- journal
CREATE POLICY "journal_select_own" ON public.journal FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "journal_insert_own" ON public.journal FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "journal_update_own" ON public.journal FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "journal_delete_own" ON public.journal FOR DELETE USING (user_id = auth.uid());

-- ai_logs (somente leitura do próprio; escrita via backend service role)
CREATE POLICY "ai_logs_select_own" ON public.ai_logs FOR SELECT USING (user_id = auth.uid());
-- Não criar policies de INSERT/UPDATE/DELETE para anon; operações virão do backend com SERVICE_ROLE_KEY
```
- Opcional: tabelas administrativas (ex.: `db_ops`, `perf_logs`) devem permitir INSERT apenas com service role; não crie policies para anon.

## 3) Backend Realtime e SSE
- Backend (Node) deve usar `SUPABASE_SERVICE_ROLE_KEY` e `SUPABASE_URL` no `.env`.
- Realtime:
  - Criar canais por tabela com `supabase.channel(...).on('postgres_changes', { event: '*', schema: 'public', table }, ...)`.
  - Emitir internamente via `EventEmitter` para stream.
- SSE para clientes:
  - Endpoint `GET /api/realtime/stream` (autenticado) que transmite eventos filtrados por `user_id` (new/old row) usando `text/event-stream`.
  - No frontend, abrir `EventSource('/api/realtime/stream')` e atualizar caches (React Query) conforme `event: table` e `data: payload`.
- Escritas validadas no backend:
  - Todas operações de escrita passam por serviços com `.eq('user_id', userId)` e validações de payload; nunca expor SERVICE_ROLE_KEY ao frontend.

## 4) Logs e Monitoramento
- Painel Supabase:
  - Ativar Audit logs (Project Settings → Logs) e configurar retenção.
  - Habilitar pgAudit (Database → Extensions) se disponível; definir nível para logar INSERT/UPDATE/DELETE em tabelas críticas.
- Backend:
  - Registrar operações de DB: inserir em `db_ops` os eventos `table`, `action`, `user_id`, `payload`, `created_at`.
  - Registrar autenticação em `auth_logs` (já implementado), incluindo `ip` e `user_agent`.
- Alertas:
  - Configurar alertas no painel (ex.: erro de RLS, pico de latência, muitos `WRONG_PASSWORD`); opção via webhook/Slack se disponível.

## 5) Validação
- Conexão:
  - `GET /api/db/ping` deve retornar `{ ok: true }` com contagem de usuários.
  - `POST /api/db/test-crud` deve executar roundtrip em `perf_logs`.
- RLS:
  - Testar com token anon (frontend) que o usuário só lê/modifica seus próprios registros.
  - Testar que anon não consegue escrever em `ai_logs`/`db_ops`.
- Realtime:
  - Criar/atualizar/deletar `habits`/`habit_logs` e observar eventos chegando no SSE do usuário correto.
- Performance:
  - Medir latência Realtime e carga sob múltiplas atualizações; ajustar `debounce`/coalescência no frontend se necessário.

## 6) Segurança
- SERVICE_ROLE_KEY somente no backend (`.env`), nunca no frontend.
- Políticas RLS obrigatórias em todas as tabelas com dados de usuário.
- Sanitização de payloads no backend; validar tipos e ranges.
- Logs de auditoria (Audit logs/pgAudit) ativos e revisados periodicamente.

## 7) Documentação e Testes
- Documentar no README:
  - Variáveis `.env` necessárias: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` (dev)
  - Passos para habilitar Realtime e aplicar policies RLS com os SQL fornecidos
  - Como consumir o SSE no frontend e atualizar estados
- Testes:
  - Criar testes de RLS (SQL/integração) para validar SELECT/INSERT/UPDATE/DELETE por `auth.uid()`.
  - Testar SSE com um cliente que valida chegada de eventos para o `user_id` correto.

Confirmando, aplico as configurações: migrações SQL de policies, listeners Realtime no backend, SSE, e documentação/validação.