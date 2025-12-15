## Histórico do Erro
- Revisões anteriores:
  - Normalização de `email` no cliente (`LoginPage.tsx`) e no `AuthProvider` (`src/features/auth/contexts/AuthContext.tsx:118-126`).
  - Ajuste de schemas Zod com `.trim()` e `.toLowerCase()` (`src/shared/schemas/auth.ts:3-12, 8-12`).
  - Middleware `validate` passou a aplicar `req.body = parsed` para usar valores transformados (`api/middleware/validate.ts:4-18`).
  - Teste de integração cobrindo login com e-mail em maiúsculas e com espaços (`api/tests/routes.auth.integration.test.ts:12-18,22-24`).
- Padrões de recorrência:
  - Entradas do usuário com espaços/maiúsculas/Unicode causam 400 “Validation Failed”.
  - Falta de normalização consistente entre cliente e servidor antes da consulta.
  - Mensagens pouco descritivas no frontend quando o backend retorna lista `details`.
- Condições disparadoras:
  - `email` inválido segundo Zod (`src/shared/schemas/auth.ts:3-6`).
  - `password` menor que 6 caracteres.
  - Ambientes onde o cliente não aplica normalização (builds antigos, cache) e o servidor valida estritamente.

## Diagnóstico Completo
- Isolamento do componente:
  - Rota: `POST /api/auth/login` com `validate(loginSchema)` (`api/routes/auth.ts:134`).
  - Middleware: `api/middleware/validate.ts:4-18` – fonte das respostas “Validation Failed”.
  - Cliente: submissão no `handleSubmit` (`src/features/auth/components/LoginPage.tsx:70-101`).
- Verificação de dependências/efeitos:
  - Supabase leitura do usuário por `email` (case-sensitive no dado armazenado) (`api/routes/auth.ts:151-156`).
  - `http.ts` encapsula erros em `ApiError` com `details` (`src/shared/api/http.ts:37-46`).
- Testes de reprodução controlados:
  - Unitários: validar `loginSchema` com entradas variadas (espaços, maiúsculas, Unicode, strings vazias).
  - Integração: simular `POST /api/auth/login` com e-mails com espaços e maiúsculas, senha válida.
  - E2E (Playwright): fluxo de login com diferentes formatos de e-mail, confirmar banner de erros e navegação.

## Solução Definitiva
- Implementação técnica:
  - Padronizar normalização em um util compartilhado (`normalizeEmail`), usado no cliente e servidor.
  - Garantir que todo endpoint protegido use `validate` e que o `req.body` parseado substitua o original.
  - No login, converter `email` normalizado antes da consulta ao banco para evitar divergência.
  - Expandir mensagens do frontend: quando `ApiError.details` existir, renderizar lista com tradução por campo e ação sugerida.
- Testes:
  - Unitários: casos de borda de normalização (inclui espaços, tabs, Unicode, upper/lower), mínimo de senha.
  - Integração: confirma 200 com e-mails “estranhos”; confirma 400 com mensagens claras para formatos realmente inválidos.
  - E2E: valida UI, redirecionamento pós-login, e banner de erro amigável.
- Monitoramento contínuo:
  - Sentry: breadcrumb “Validation Failed” com `details`, `path` e `email hash` (não logar dados sensíveis).
  - Métricas: taxa de 400 por rota, contagem de “Validation Failed” e códigos (`USER_NOT_FOUND`, `WRONG_PASSWORD`).
  - Dashboard/alerta quando taxa de 400 em `/api/auth/login` exceder limiar em 5 min.
- Documentação técnica:
  - Registrar causa raiz: inconsistência de normalização + não aplicação do `parsed` no `req.body`.
  - Descrever arquitetura da validação (Zod shared + middleware + UI translator), e como diagnosticar.

## Prevenção Futura
- CI/CD:
  - Pipeline com `lint→typecheck→unit→integration→e2e→build` obrigatórios para merges.
  - Testes contratuais: garantir que `validate` esteja presente em rotas de auth.
  - Job “mock-scan” para impedir bypass de validação.
- Alertas proativos:
  - Alerta Slack/Email ao detectar pico de 400/“Validation Failed” em `/api/auth/login`.
  - Alerta de regressão se testes de integração de normalização falharem em CI.
- Treinamento da equipe:
  - Guia de boas práticas: sempre usar schemas compartilhados, normalizar entradas, e nunca consultar DB com dados não-normalizados.
  - Checklist de PRs: “rota usa `validate`?”, “usa `req.body` parseado?”, “mensagens de UI traduzem `details`?”.

## Validação
- Ambientes:
  - Dev: executar toda suíte e checar logs locais.
  - Staging: canary com tráfego limitado, ativar monitoramento e alertas.
  - Produção: roll-out gradual com observabilidade.
- Monitoramento prolongado:
  - Acompanhar por 2 ciclos de release métricas e Sentry; confirmar ausência de picos.
- Confirmação de não-regressão:
  - Testes automatizados servem como “barreira”:
    - Unitários de schema
    - Integração de login com normalização
    - E2E com inputs variados
  - Checklist de deploy com verificação de erros por rota.

## Entregáveis do Plano
- Util `normalizeEmail` compartilhado e aplicado no cliente/servidor.
- Schemas Zod com normalização e mensagens traduzidas.
- Middleware `validate` aplicando `req.body` parseado.
- UI com mensagens claras e renderização de `details` orientada por campo.
- Testes unitários/integrados/E2E cobrindo cenários de normalização.
- Monitoramento e alertas configurados.
- Documentação da causa raiz e runbook de diagnóstico.

Confirma se deseja que eu avance com a execução do plano acima (implementação, testes e configuração de monitoramento).