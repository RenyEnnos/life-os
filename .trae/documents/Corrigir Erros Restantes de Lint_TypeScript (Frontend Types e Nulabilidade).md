## 1. Categorias de Erros
- Tipos não encontrados: `Transaction`, `HealthMetric`, `MedicationReminder`, `Project`, `Reward`, `Achievement` (imports incorretos).
- Nulabilidade/union: `CreateHabitDialog` (`setRoutine`), `Habits` (`some` retornando `undefined`), `Journal` (`setSelectedEntry(null)`), `JournalEntryList` (`tags` possivelmente `undefined`).
- Acesso potencialmente nulo/indefinido: `projects` usado sem fallback, `.filter` em estrutura tipada como `{}`.
- Tipos de domínio divergentes: `LifeScore.breakdown` ausente no tipo atual.

## 2. Priorização
1) Corrigir imports de tipos para o arquivo correto do cliente (`src/shared/types.ts`).
2) Ajustar nulabilidade e union states (rotina, selectedEntry, checks booleanos).
3) Resolver acessos com fallback em listas (`projects || []`).
4) Ajustar tipos de `LifeScore` ou uso do campo `breakdown` conforme modelo.

## 3. Implementação
- Atualizar imports nos arquivos que apontam para `../../shared/types` quando o tipo existir em `src/shared/types.ts` (cliente):
  - `src/features/finances/index.tsx`, `src/hooks/useFinances.ts`, `src/features/health/index.tsx`, `src/hooks/useHealth.ts`, `src/features/projects/index.tsx`, `src/hooks/useProjects.ts`, `src/hooks/useRewards.ts`, `src/features/rewards/index.tsx` → usar `@/shared/types` quando os tipos lá existirem; caso não existam, definiremos tipos locais mínimos.
- `CreateHabitDialog.tsx`: converter `e.target.value` para a união correta antes de setar: `setRoutine(value as 'morning'|'afternoon'|'evening'|'any')`.
- `src/features/habits/index.tsx`: forçar booleano com `!!logs?.some(...)` para `completed` e similares.
- `src/features/journal/components/JournalEntryList.tsx`: usar `entry.tags?.map(...)` para evitar acesso direto.
- `src/features/journal/index.tsx`: trocar `setSelectedEntry(null)` por `setSelectedEntry(undefined)` no `onCancel`.
- `src/features/projects/index.tsx`:
  - Importar `Project` do local correto; se não disponível, criar tipo mínimo `{ id:string; name:string; status?:string }` local.
  - Ao usar `projects.map`/`find`, garantir fallback `projects || []`.
  - Tipar corretamente coleções usadas com `.filter` para evitar `{}`.
- `src/features/rewards/index.tsx`:
  - Corrigir import de `Reward`, `Achievement`, `LifeScore` e ajustar uso: se `LifeScore` não possui `breakdown`, remover ou adaptar ao tipo disponível.

## 4. Validação
- Rodar `npm run lint` e confirmar zero erros.
- Rodar `npm run test` para garantir estabilidade.

## 5. Documentação
- Registrar a diretriz: usar `@/shared/types` para tipos de UI, evitar apontar para `../../shared/types` do backend.
- Comentar brevemente nos PR notes locais as mudanças de nulabilidade e casts em união.

Aprovar para aplicar as mudanças e validar? 