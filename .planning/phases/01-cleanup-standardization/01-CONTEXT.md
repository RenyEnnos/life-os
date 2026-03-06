# Phase 1: Limpeza e Padronização - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

O objetivo desta fase é estabelecer uma base sólida e padronizada para o projeto "Life OS: Rebirth", eliminando fragmentação, duplicidade de lógica e funcionalidades "fantasmas".

</domain>

<decisions>
## Implementation Decisions

### Zod Schemas
- **Centralização**: Mover todos os Zod schemas para `src/shared/schemas`.
- **Entidades principais**: Habit, Task, User, Finance.
- **Substituição**: Remover validações manuais (ex: `validateHabitData`) em `src/features/*/api` e usar os schemas Zod em seu lugar.

### Zustand Stores
- **Persistência**: Usar o middleware `persist`.
- **Storage**: Configurar para usar `idb-keyval` ou similar (IndexedDB) para preparar o modo offline.
- **Stores**: `authStore`, `uiStore`, `useFocusStore`, etc.

### Validação Dupla
- **Frontend**: Usar os schemas centralizados para validação 'pre-flight'.
- **Backend**: Usar os mesmos schemas para validação de entrada no servidor.

### Limpeza de Código
- **Código Morto**: Remover arquivos, funções e variáveis não utilizados.
- **Botões Fantasmas**: Identificar e remover ou desativar botões sem funcionalidade no Dashboard e Widgets.

</decisions>

<specifics>
## Specific Ideas
- Garantir que a estrutura de `src/shared/schemas` suporte tanto o frontend quanto o backend (se aplicável, dependendo da arquitetura do servidor).
- Padronizar o tratamento de erros de validação com base no Zod.

</specifics>

<deferred>
## Deferred Ideas
- **Sincronização Offline Complexa**: A reconciliação real entre local e remoto será tratada na Fase 4.
- **Novas Funcionalidades**: Nenhuma funcionalidade nova deve ser adicionada nesta fase, apenas correção e padronização.

</deferred>

---

*Phase: 01-cleanup-standardization*
*Context gathered: 2026-03-04*
