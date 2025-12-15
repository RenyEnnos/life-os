## Objetivo
- Eliminar mocks fora de testes, estabilizar o MVP com integrações reais, ampliar testes (unit, integração, E2E) e manter validação contínua em staging antes de produção.

## Escopo e Responsáveis
- Responsáveis por etapa:
  - Frontend: implementação de páginas/hooks/UI, remoção de mocks runtime
  - Backend/API: contratos, correções de endpoints, credenciais e staging
  - QA/Automation: testes de unidade/integração/E2E, cobertura e relatórios
  - Docs: atualização de CHANGELOG, guias e políticas
- Branches por tarefa: `feature/*`, `fix/*`, `refactor/*`, `docs/*`, `chore/*`; PR com revisão obrigatória e checks de CI.

## 1) Análise e Correção de Problemas
- Ações:
  - Varredura de problemas: lint/typecheck, mock-scan, rotas quebradas, estados sem empty state, chamadas sem `credentials: 'include'`.
  - Classificar por impacto/complexidade (críticos: autenticação, tasks CRUD, calendário OAuth, finanças CRUD, journal & AI; médios: hábitos/saúde, rewards, UI adicionais).
  - Abrir issues com descrição, steps de reprodução e impacto; priorizar críticos.
- Entregáveis:
  - Lista de problemas com prioridade e owners
  - PRs de correção em `fix/*`
- Estimativa de esforço:
  - Críticos: 2–4 dias
  - Médios: 2–3 dias
- Métricas:
  - `lint`/`typecheck` sem erros; mock-scan 0 achados; testes críticos passando

## 2) Desenvolvimento do MVP
- Requisitos mínimos:
  - Auth/Perfil (login/register/verify/profile), Tasks (CRUD), Calendário (OAuth/eventos), Finanças (transações/resumo), Journal & AI (persistência/insights), Hábitos/ Saúde (CRUD e logs), Rewards (score/xp/conquistas)
- Ações:
  - Remover quaisquer dados “sample”/“placeholder” do runtime, manter apenas empty states
  - Garantir chamadas reais via `apiClient`/`apiFetch` com cookies e timeouts
  - Testes: unit (serviços/hooks), integração (MSW em páginas), E2E (Playwright em staging)
- Entregáveis:
  - Páginas totalmente operacionais, sem mocks runtime
  - Suítes de testes atualizadas
- Estimativa de esforço:
  - MVP funcional por domínio: 1–2 dias cada (paralelizável)
- Métricas:
  - Cobertura unit/integration ≥ 80% nos serviços
  - E2E críticos passando em staging

## 3) Documentação
- Ações:
  - Revisar docs existentes (Sprints, PRD, CHANGELOG, políticas)
  - Atualizar endpoints, fluxos, estados de erro/loader, decisões técnicas
  - Criar docs faltantes: Política de Mocks, Guia de Testes (MSW/E2E), Pipeline de Staging
- Entregáveis:
  - `.trae/documents/*` e `CHANGELOG.md` atualizados
- Estimativa:
  - 1–2 dias (em paralelo com implementação)
- Métricas:
  - Docs completos por módulo com endpoints e estados; CHANGELOG com diffs

## 4) Limpeza de Código
- Ações:
  - Remover arquivos não utilizados (gráficos legacy, componentes não referenciados, dados “sample” remanescentes)
  - Organizar estrutura de pastas (features/hooks/api/components coerentes)
  - Remover dependências não utilizadas (auditoria `npm ls`, `depcheck`)
- Entregáveis:
  - PR `refactor/*` e `chore/*` com remoções e reorganizações
- Estimativa:
  - 1–2 dias
- Métricas:
  - Build mais leve; scans sem arquivos órfãos; deps reduzidas

## 5) Refatoração
- Ações:
  - Padronizar código conforme regras internas (sem “IA anti-padrões”: side-effects ocultos, falta de validações, acoplamento excessivo)
  - Aplicar SOLID/Clean Code em serviços e hooks (separação de responsabilidades, contratos tipados, erros explícitos)
  - Introduzir Zod/validações onde faltam em payloads
- Entregáveis:
  - PRs `refactor/*` por módulo, com testes atualizados
- Estimativa:
  - 2–3 dias por conjunto de módulos (iterativo)
- Métricas:
  - Redução de complexidade ciclomática; cobertura mantida/↑; difs menores e claros

## 6) Validação Contínua
- Ações:
  - CI com jobs: `lint → typecheck → unit → integration → build → e2e` (staging)
  - Mock-scan obrigatório em todos os PRs
  - Gate E2E em staging com `STAGING_BASE_URL`; smoke + fluxos críticos
- Entregáveis:
  - Workflows de CI em `.github/workflows/*` e relatórios em artefatos
- Estimativa:
  - 1 dia para ajustes finais e gates
- Métricas:
  - 100% dos checks verdes; ausência de regressões; tempo médio de build/teste dentro do SLA

## Interatividade e Performance
- Ações:
  - Feedback de usuário consistente (loaders/toasts), desativação de botões em mutations
  - Medir Web Vitals/Lighthouse; metas ≥ 90
  - Retries com backoff, aborts e cancelamentos em navegações
- Métricas:
  - FID/TTI/LCP em faixas recomendadas; falhas transitórias resolvidas

## Cronograma e Rastreabilidade
- Planejamento incremental, sem datas fixas, com estimativas por etapa acima
- Cada tarefa em branch própria, PR com revisão, checklist de mocks, testes e documentação
- Labels de PR: `critical`, `mvp`, `refactor`, `docs`, `chore`

## Critérios de Sucesso
- Build de produção sem padrões de mock proibidos
- MVP completo operando em staging com E2E aprovados
- Cobertura unit/integration ≥ 80% nos serviços
- Documentação atualizada por módulo e pipeline
- Estabilidade mantida com validação contínua e gates
