# Sprint 3 — Journal & AI

## Escopo
- Alinhar Journal à persistência real e remover mocks visuais
- Unificar chamadas de análise (Neural Resonance) ao util HTTP
- Adicionar testes unitários para Journal e AI

## Alterações
- `src/features/journal/hooks/useJournalInsights.ts`
  - `triggerJournalAnalysis` refatorado para `apiClient.post` com credenciais e erros padronizados
- `src/features/journal/index.tsx`
  - Removidos fallbacks de cards mockados (Today/Yesterday)
  - Empty states amigáveis quando não há entradas
- Testes:
  - `src/features/journal/api/__tests__/journal.api.test.ts` (list/create/update/delete/analyzeEntry)
  - `src/features/ai-assistant/api/__tests__/ai.api.test.ts` (chat/tags/swot/plan/summary/logs)

## Testes
- Unitários executados isoladamente: todos aprovados
- Manual:
  - Journal exibe estados de vazio quando sem entradas
  - Análise via Resonance retorna sucesso e estrutura padrão

## Impacto e Compatibilidade
- Fluxo de Journal sem mocks, mantendo experiência OLED
- AI API compatível via `apiFetch` (cookies/credenciais) e testes cobrindo endpoints principais

## Seguinte
- Sprint 4: Hábitos e Saúde (CRUD/logs), testes de integração (MSW) e E2E dos fluxos críticos
