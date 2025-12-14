# Sprint 4 — Hábitos e Saúde

## Escopo
- Remover mocks e ligar totalmente Habits e Health aos endpoints reais
- Melhorar UX com estados de vazio e desativação durante mutações
- Adicionar testes unitários para APIs de hábitos e saúde

## Alterações
- `src/features/habits/index.tsx`
  - Removido fallback `sampleHabits`
  - Empty state quando não há hábitos
  - Desativação de toggle durante `logHabit.isPending`
  - Botão “New Habit” desativado durante `createHabit.isPending`
- `src/features/health/index.tsx`
  - Removidos `sampleSleepBars` e `sampleMedications`
  - Sleep chart usa valor total ou exibe “Sem dados suficientes”
  - Lista de medicações com empty state e desativação de delete durante mutação
- Testes:
  - `src/features/habits/api/__tests__/habits.api.test.ts`
  - `src/features/health/api/__tests__/health.api.test.ts`

## Testes
- Unitários executados isoladamente para hábitos e saúde — aprovados
- Manual:
  - Habits sem dados mostra empty; log e criação respeitam estados pendentes
  - Health sem dados mostra empty para meds e sleep; deleção respeita estado pendente

## Impacto e Compatibilidade
- Integração estável com backend; UI sem dependência de mocks
- UX consistente com o padrão OLED minimalista

## Seguinte
- Sprint 5: Gamificação, polimento de acessibilidade/performance e E2E global
