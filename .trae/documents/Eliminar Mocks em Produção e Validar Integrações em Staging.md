## Objetivo
Garantir zero mocks em produção, mantendo mocks apenas em testes automatizados e validando integrações reais em staging antes de produção.

## Auditoria e Proibição de Mocks
- Mapear padrões proibidos em produção: `vi.mock(`, `msw`, `mockStore`, `createStoreBackedMock`, `placeholder`, `fake`, `stub`, `sample`.
- Adicionar job de CI "mock-scan" que falha quando qualquer padrão proibido aparece fora de diretórios de teste (`**/__tests__/**`, `vitest.setup.ts`, `src/test/**`, `*.stories.tsx`).
- Configurar lint-rule/grep no CI com whitelist por pasta, evitando falsos positivos em documentação.

## Remoção/Isolamento de Mocks Existentes
- `api/lib/supabase.ts`: remover fallback `createStoreBackedMock` para ambientes não-test, exigindo credenciais reais em `NODE_ENV !== 'test'`. Em dev local, permitir apenas via flag explícita `ALLOW_DEV_MOCKS=true` (não permitida em staging/production).
- Garantir que MSW só carregue no `vitest.setup.ts` e nunca em runtime do app (`src/app/main.tsx`).
- Verificar e remover quaisquer dados de exemplo em páginas (ex.: `sample*`): University, Dashboard, Health, Habits, Journal, Finances, Rewards; substituir por chamadas reais já existentes ou estados de vazio.

## Testes Automatizados (Unit e Integração)
- Manter mocks exclusivamente em testes:
  - Unit: `vi.mock`/stubs dentro de `__tests__`.
  - Integração: MSW em `src/test/msw/**` + `vitest.setup.ts`.
- Expandir cobertura de integração para Calendar, Finances, Journal, Habits, Health, Rewards com `QueryClientProvider` + mock de Auth.
- Adicionar Playwright para E2E com backend real em staging (login, CRUD tasks, conectar calendário, finanças, journal/AI).

## Staging e Validação de Integrações Reais
- Criar `.env.staging` com chaves reais (Supabase, Google, Sentry) e secrets no provedor de CI.
- Pipeline de staging:
  - Jobs: `lint` → `typecheck` → `unit` → `integration` (MSW) → `build` → `e2e` (Playwright em staging) → `preview`.
  - Gate: só promove se `e2e` em staging passar.

## Performance e Robustez
- HTTP: `credentials: 'include'`, timeouts, aborts, mensagens de erro consistentes.
- Retries com backoff para falhas transitórias; métricas por rota.
- Web Vitals/Lighthouse em CI com relatórios.

## Documentação e Revisão
- Atualizar `CHANGELOG.md` com a política de mocks e mudanças de integração.
- Adicionar/usar `.github/pull_request_template.md` e `CODEOWNERS`.
- Checklist de PR inclui: sem mocks fora de testes, integração validada em staging, impacto em módulos dependentes.

## Critérios de Aceitação
- Build de produção sem ocorrências dos padrões proibidos (CI mock-scan passa).
- MSW/`vi.mock` presentes apenas em arquivos de teste.
- Integrações reais funcionam em staging e passam E2E.
- Documentação e revisão concluídas antes de merge.

## Próximos Passos (Incrementais)
1) Implementar job "mock-scan" no CI e isolar Supabase mock apenas para `NODE_ENV==='test'`/`ALLOW_DEV_MOCKS`.
2) Auditar e remover qualquer dado de exemplo restante em páginas.
3) Ampliar testes de integração e configurar Playwright/E2E contra staging.
4) Atualizar `CHANGELOG` e assegurar revisão via PR template e CODEOWNERS.
