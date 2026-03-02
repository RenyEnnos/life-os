# Plano de Correção - PR #69

## Objetivos
Corrigir os bugs críticos e pendências identificadas pelos bots de revisão no Life OS.

## Tarefas

### 1. Autenticação (Middleware e Rotas)
- [ ] Alterar `api/middleware/auth.ts` para buscar na tabela `profiles` em vez de `users`.
- [ ] Validar se as rotas de login/registro em `api/routes/auth.ts` também precisam dessa sincronização.
- [ ] Garantir que o objeto `req.user` contenha `nickname` ou `full_name`.

### 2. Journal Editor (Condição de Corrida)
- [ ] Localizar `src/features/journal/components/JournalEditor.tsx`.
- [ ] Remover o `setTimeout` que dispara a análise de IA.
- [ ] Integrar o disparo da análise no callback `onSuccess` do `useMutation` que salva a entrada do diário.

### 3. Segurança (Rate Limiting)
- [ ] Configurar `express-rate-limit` em `api/app.ts`.
- [ ] Aplicar o limiter nas rotas `/api/auth/forgot-password` e `/api/auth/reset-password`.

### 4. PWA (Compatibilidade de Ícones)
- [ ] Atualizar `vite.config.ts` (ou o plugin PWA) para incluir ícones PNG de 192x192 e 512x512 no manifesto.
- [ ] Verificar se os arquivos PNG existem na pasta `public/`.

### 5. Documentação
- [ ] Atualizar `.planning/ROADMAP.md` para refletir a conclusão das fases 4 a 11.
- [ ] Sincronizar `.planning/STATE.md` com o status atual do projeto.

## Verificação
- [ ] Executar testes de integração de autenticação.
- [ ] Validar fluxo de salvamento do diário.
- [ ] Verificar manifesto PWA no DevTools.
