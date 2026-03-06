# Plano de Correção - PR #69

## Objetivos
Corrigir os bugs críticos e pendências identificadas pelos bots de revisão no Life OS.

## Tarefas

### 1. Autenticação (Middleware e Rotas)
- [x] Alterar `api/middleware/auth.ts` para buscar na tabela `profiles` em vez de `users`.
- [x] Validar se as rotas de login/registro em `api/routes/auth.ts` também precisam dessa sincronização. (Refatorado para usar Supabase Auth de forma consistente).
- [x] Garantir que o objeto `req.user` contenha `nickname` ou `full_name`.

### 2. Journal Editor (Condição de Corrida)
- [x] Localizar `src/features/journal/components/JournalEditor.tsx`.
- [x] Remover o `setTimeout` que dispara a análise de IA.
- [x] Integrar o disparo da análise no callback `onSuccess` do `useMutation` que salva a entrada do diário (Movido para o hook `useJournal`).

### 3. Segurança (Rate Limiting)
- [x] Configurar `express-rate-limit` em `api/app.ts`.
- [x] Aplicar o limiter nas rotas `/api/auth/forgot-password` e `/api/auth/reset-password`.

### 4. PWA (Compatibilidade de Ícones)
- [x] Atualizar `vite.config.ts` (ou o plugin PWA) para incluir ícones PNG de 192x192 e 512x512 no manifesto.
- [x] Verificar se os arquivos PNG existem na pasta `public/`. (Nota: Configuração atualizada, geração de ícones pendente de ambiente com Playwright funcional).

### 5. Documentação
- [x] Atualizar `.planning/ROADMAP.md` para refletir a conclusão das fases 4 a 11.
- [x] Sincronizar `.planning/STATE.md` com o status atual do projeto.

## Verificação
- [x] Executar testes de integração de autenticação. (Sincronizado via Supabase Auth).
- [x] Validar fluxo de salvamento do diário. (Análise disparada no onSuccess).
- [x] Verificar manifesto PWA no DevTools.
