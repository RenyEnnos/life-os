# Sprint 2 — Calendário e Finanças

## Escopo
- Integrar UI do Calendário ao hook de eventos e fluxo OAuth
- Remover dados mockados e substituir gráfico Neon por barras minimalistas em Finanças
- Adicionar testes unitários para o módulo de Finanças

## Alterações
- `src/features/calendar/index.tsx`
  - Substituído uso direto de `apiFetch` por `useCalendarEvents`
  - Estados: `loading`, `error`, `authUrl`, `refresh`
  - Header com botão `Refresh`; badge indica `Sync Active` ou `Disconnected`
  - CTA “Conectar Calendário” quando erro e `authUrl` disponível
- `src/features/finances/index.tsx`
  - Removido fallback `sampleTransactions` e `NeonChart`
  - Cash Flow renderizado com barras minimalistas (positivo/negativo)
  - Empty state amigável quando não há transações
  - Summary usa endpoint real (`summary`) ou computa localmente a partir de transações
- `src/features/finances/api/__tests__/finances.api.test.ts`
  - Testes unitários cobrindo `list`, `create`, `update`, `delete` e `getSummary` com mock de `apiClient`

## Testes
- Unitários executados isoladamente:
  - `src/features/finances/api/__tests__/finances.api.test.ts` — aprovados
  - `src/shared/api/__tests__/http.test.ts` — aprovados
- Manual:
  - Calendário com estados de erro/carregamento e CTA de conexão
  - Finanças sem dados mostra empty state; com dados renderiza barras e lista

## Impacto e Compatibilidade
- UI mais consistente com OLED Minimalist e sem dependência de componentes neon
- Integração de Calendário resiliente a erros temporários; feedback claro ao usuário
- Finanças sem mocks; integração estável com backend

## Seguinte
- Sprint 3: Journal & AI (persistência real e insights/resonance), testes de integração com MSW e cenários E2E críticos (Playwright)
