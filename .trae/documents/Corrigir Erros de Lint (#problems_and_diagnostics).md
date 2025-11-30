## Diagnóstico
- Executar `npm run lint` para listar os erros atuais e agrupá-los por categoria.
- Focar nas categorias esperadas: `@typescript-eslint/no-explicit-any`, `react-hooks/exhaustive-deps`, `no-empty`, `react-refresh/only-export-components`, e possíveis `no-undef` em arquivos do backend.

## Correções de Código (prioridade)
- Substituir usos de `any` por tipos concretos ou `unknown` onde apropriado:
  - `src/lib/api.ts:1` — alterar `apiFetch<T = any>` para `apiFetch<T = unknown>` e manter retorno tipado por genérico.
  - `src/hooks/usePerfStats.ts:31` e `src/hooks/usePerfStats.ts:36` — remover `as any` em cabeçalhos, tipar `headers` corretamente e tipar `catch` como `unknown` com narrowing.
  - `src/features/tasks/index.tsx:29, 42, 58, 87, 95` — usar o tipo `Task` de `src/shared/types.ts` para `tasks`, `groupedTasks` e parâmetros de handlers.
  - `src/features/dashboard/index.tsx:45, 55` — tipar listas com `Habit` e `Task` em vez de `any`.
  - `src/features/journal/components/JournalEditor.tsx` e `JournalEntryList.tsx` — tipar props com `JournalEntry` e remover `any`.
  - Backend:
    - `api/routes/auth.ts:191` e `api/routes/auth.ts:223` — substituir `jwt.verify(... ) as any` por tipo `JwtPayload & { userId: string }` (importar `JwtPayload` do `jsonwebtoken` ou declarar `type DecodedToken = { userId: string; email: string }`).
    - `api/services/*` — trocar assinaturas `payload: any` e `updates: any` por tipos dos modelos de `shared/types.ts` (ex.: `Transaction`, `Project`, `Reward`, etc.).
- Corrigir regras de hooks:
  - `src/contexts/AuthContext.tsx:27–31` — envolver `checkAuth` em `useCallback` com deps estáveis e referenciá-lo no `useEffect` para satisfazer `react-hooks/exhaustive-deps`.
  - `src/contexts/AuthContext.tsx:137–139` — evitar bloco `catch {}` vazio; registrar erro ou fazer tratamento mínimo.
- Garantir conformidade com `react-refresh/only-export-components`:
  - Auditar `src/**/*.tsx` e mover helpers não-componentes para arquivos `.ts` ou exportá-los como `const` (a regra já permite constantes).

## Ajustes de Configuração ESLint
- Atualizar `eslint.config.js` para cobrir ambientes do backend e testes:
  - Adicionar bloco para `files: ['api/**/*.ts']` com `languageOptions.globals: globals.node` para evitar `no-undef` em Node.
  - Adicionar bloco para testes `files: ['**/*.test.ts', '**/*.test.tsx']` com `languageOptions.globals: { ...globals.node, ...globals.vitest }` (Vitest) e, se necessário, afrouxar regras específicas apenas em testes.
  - Manter `react-hooks` e `react-refresh` como está; não alterar severidade das regras, preferindo correções no código.

## Validação
- Reexecutar `npm run lint` e garantir que todos os erros foram resolvidos.
- Rodar `npm run test` para assegurar que a funcionalidade existente permanece intacta.
- Opcional: abrir Storybook (`npm run storybook`) para verificar que componentes ainda renderizam corretamente.

## Observações
- Seguiremos os tipos de `src/shared/types.ts` e `shared/types.ts` para padronização; onde tipos não existirem, criaremos tipos leves locais ou ampliaremos os compartilhados.
- Todas as mudanças serão restritas e incrementais, sem afetar fluxos existentes. Onde necessário, faremos refactors mínimos (ex.: mover helpers para `.ts`).
- Após as correções, entregaremos um relatório com arquivos alterados e referências como `file_path:line_number`.