# Política de Mocks — Produção e Testes

## Diretrizes
- Mocks são permitidos apenas em testes automatizados (unitários e integração).
- Qualquer uso de mocks em produção é proibido.
- Integrações reais devem ser validadas em staging antes de produção.

## Implementação
- CI: `/.github/workflows/mock-scan.yml` detecta padrões de mock fora de `__tests__/`, `src/test/**`, `vitest.setup.ts`, `*.stories.*`.
- Supabase: `api/lib/supabase.ts` permite mock somente em `NODE_ENV='test'` ou `ALLOW_DEV_MOCKS=true`.
- MSW: carregado apenas em `vitest.setup.ts` e `src/test/msw/**`.

## Testes e Staging
- Integração com MSW para páginas principais.
- E2E com Playwright em staging, `E2E_BASE_URL` configurado via `secrets`.

## Auditoria
- Revisar PRs com checklist do template.
- `mock-scan` deve passar no CI para aprovar merge.
