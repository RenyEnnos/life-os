## Problemas Detectados
- Dependência inexistente: `qs` (ParsedQs) em `api/lib/pagination.ts`.
- Globais Vitest ausentes em `api/tests/routes.auth.login.test.ts`.
- Erros de spread no mock de `recharts`: uso de `unknown` em `vi.importActual` em `src/__tests__/LineChart.test.tsx` e `src/components/charts/__tests__/LineChart.snapshot.test.tsx`.
- Imports com alias `@/contexts/AuthContext` não resolvidos em testes (`ThemeToggle.test.tsx`, `LoginPage.test.tsx`).
- Tipos não exportados no alias `@/shared/types` (frontend usando `Transaction`, `HealthMetric`, `MedicationReminder`, `Project`, `Reward`, `Achievement`, `LifeScore`).
- Tipos de estado/propriedade: `CreateHabitDialog` rotina inferida como `string`; `logs` em Habits não tipados (uso de `some` em `{}`); vários `useDashboardData` `useQuery` sem genérico, causando `Promise<unknown>` e acesso a `.filter` inválido.
- `usePerfStats`: resposta `apiFetch` é `unknown`; acesso a campos sem narrowing.
- `CreateTaskDialog`: `due_date: null` conflita com tipo `string | undefined`.
- Journal: `entry.tags` possivelmente `undefined`; `selectedEntry` nulo usado em prop que espera `undefined`; uso de campo inexistente `mood`.
- Projects: uso de alias `Project` inexistente e acesso potencialmente nulo em `projects.find(...).name`; `.filter` em `{}`.

## Plano de Correção
### A. Remover dependência de `qs`
- `api/lib/pagination.ts`: remover import de `ParsedQs` e aceitar um tipo próprio:
  - `type QueryLike = { page?: string | string[]; pageSize?: string | string[] } & Record<string, unknown>`
  - Assinatura: `getPagination(query: QueryLike | Record<string, string | string[] | undefined>)`

### B. Vitest globais
- `api/tests/routes.auth.login.test.ts`: adicionar `import { describe, it, expect } from 'vitest'`.

### C. Mocks de `recharts`
- Substituir `unknown` por tipo correto em `vi.importActual`:
  - `await vi.importActual<typeof import('recharts')>('recharts')`
  - Tipar `ResponsiveContainer` com `{ children: React.ReactNode }`.

### D. Imports com alias
- Atualizar imports de testes para caminho relativo:
  - `src/components/ui/__tests__/ThemeToggle.test.tsx` e `src/features/auth/__tests__/LoginPage.test.tsx`: trocar `@/contexts/AuthContext` por `'../../contexts/AuthContext'`.

### E. Tipos no frontend
- Ajustar import de tipos inexistentes:
  - Em `finances/index.tsx`, `useFinances.ts`, `useHealth.ts`, `useProjects.ts`, `useRewards.ts`, `useDashboardData.ts`, `health/index.tsx`, `projects/index.tsx`: importar tipos do arquivo raiz `../../shared/types` (não do alias `@/shared/types`).
  - Alternativamente, re-exportar no `src/shared/types.ts` os tipos necessários (opção B). Optaremos pela troca de imports para reduzir difusão de tipos duplicados.

### F. Estado e genéricos
- `CreateHabitDialog.tsx`: `useState<'morning'|'afternoon'|'evening'|'any'>('any')` para rotina.
- `useHabits.ts`: tipar `logs` como `HabitLog[]` com genérico de `useQuery`.
- `useDashboardData.ts`: adicionar genéricos em todas chamadas `useQuery` (`Task[]`, `Habit[]`, `HealthMetric[]`, `{ income:number; expenses:number; balance:number }`, `HabitLog[]`) e ajustar `apiClient.get<T>` para garantir o tipo de retorno, desbloqueando `.filter`/`.map`.
- `usePerfStats.ts`: tipar retorno de `apiFetch` com interface `{ p95:number; avgMs:number; throughput:number; series: PerfPoint[] }` e usar esse tipo para evitar `unknown`.
- `CreateTaskDialog.tsx`: mudar `due_date` para `undefined` quando vazio.

### G. Journal
- `JournalEntryList.tsx`: usar optional chaining em `tags` (`entry.tags?.length` e `entry.tags?.map` já presentes; garantir não acesso direto).
- `src/features/journal/index.tsx`: tipar `selectedEntry` como `JournalEntry | undefined` em vez de `null`; remover referências a `mood` que não existe no tipo.

### H. Projects
- `projects/index.tsx`: importar `Project` do caminho raiz e ajustar acessos nulos (`?.name || ''` já aplicado), garantir tipos para `swot` itens.

## Validação
- Rodar `npm run lint` e `npm run test` para confirmar zero erros.
- Verificar que não houve regressões funcionais (tests cobrem rotas principais e hooks).

## Prevenção
- Documentar diretriz de imports de tipos backend no frontend (usar `../../shared/types`), evitar alias para tipos fora de `src`.
- Padronizar genéricos em `useQuery`.

Confirmando, aplico todas as alterações e revalido com lint e testes. 