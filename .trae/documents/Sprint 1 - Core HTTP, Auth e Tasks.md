# Sprint 1 — Core HTTP, Auth/Perfil e Tasks

## Escopo
- Padronizar camada HTTP com segurança e erros
- Integrar Auth/Perfil a endpoints reais
- Garantir CRUD de Tasks com invalidação de cache e estados da UI

## Alterações
- `src/shared/api/http.ts`
  - Adicionados `apiClient`, `apiFetch` e `resolveApiUrl`
  - `fetchJSON` com `credentials: 'include'`, timeout via `AbortController`, parse automático e mensagens de erro
- `src/features/dashboard/hooks/useDashboardIdentity.ts`
  - Hook para `GET /api/auth/verify` com `loading/error/refresh`
- `src/features/dashboard/hooks/useDashboardStats.ts`
  - Agregação de `useTasks` para métricas (completion, velocity, contadores)
- `src/features/dashboard/index.tsx`
  - Cartão de identidade ligado a dados reais e loader
- `src/features/dashboard/hooks/useCalendarEvents.ts`
  - Fluxo OAuth e `GET /api/calendar/events` com estados
- `src/features/auth/api/auth.api.ts`
  - `updateProfile` aceita `{ preferences, theme }`
- `src/features/auth/contexts/AuthContext.tsx`
  - `updateThemePreference` persiste via `/api/auth/profile`
- `src/features/tasks/hooks/useTasks.ts` e `src/features/tasks/api/tasks.api.ts`
  - CRUD real com `apiClient` e `invalidateQueries` após mutações
- `src/shared/api/__tests__/http.test.ts`
  - Testes unitários: sucesso, erro, timeout, helpers e `resolveApiUrl`

## Testes
- Unitários (Vitest):
  - Execução isolada de `src/shared/api/__tests__/http.test.ts` — todos aprovados
  - Suite completa contém falhas pré-existentes em UI (variações de Button, ThemeToggle), fora do escopo desta sprint
- Manual:
  - Dashboard: identidade dinâmica, barra de progresso e loader
  - Backend ativo em `:3001`; Frontend em `:5174`

## Impacto e Compatibilidade
- Substituição de mocks por chamadas reais sem quebrar UI
- Hooks mantêm `loading/error/refresh`, com toasts em páginas que já usam
- Retrocompatibilidade garantida via `apiClient` e `apiFetch`

## Seguinte
- Sprint 2: Calendário (UI) e Finanças (transações/summary completos), testes de integração e cenários E2E críticos
