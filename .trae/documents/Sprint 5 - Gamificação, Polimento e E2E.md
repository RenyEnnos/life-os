# Sprint 5 — Gamificação, Polimento e E2E

## Escopo
- Validar módulo de Gamificação (score/xp/achievements) com testes unitários
- Preparar terreno para testes de integração (MSW) e E2E (Playwright)
- Manter UX OLED Minimalist e integração com backend estável

## Alterações
- Testes:
  - `src/features/rewards/api/__tests__/rewards.api.test.ts` (score, achievements, catálogo e addXp)
  - Execução isolada aprovada
- UI de Rewards:
  - `src/features/rewards/index.tsx` já integrado ao backend via `rewardsApi` e com empty states

## Próximos Passos
- Integração:
  - Adicionar MSW para testes de páginas (Calendar, Finanças, Journal, Habits, Health)
  - Configurar Playwright para cenários críticos (login, CRUD tasks, conectar calendário, finanças, journal/AI)
- CI/CD:
  - Workflows: lint/typecheck/unit/integration/build/e2e/preview
  - Artefatos de cobertura

## Critérios
- Módulos validáveis com unit/integration
- E2E cobrindo fluxos prioritários
