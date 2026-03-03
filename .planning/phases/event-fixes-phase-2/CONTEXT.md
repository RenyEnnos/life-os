# Phase Context: Event Infrastructure Fixes (Phase 2 - Calendar)

## Goal
Refatorar a interface de usuário do módulo de Calendário (`CalendarPage.tsx`) para conectar os botões visuais à lógica de negócio, substituindo elementos HTML brutos por componentes padronizados do Design System (`src/shared/ui/`) e implementando event handlers adequados.

## Requirements
1. Substituir botões estáticos de "Day/Week/Month" por um componente controlado (Tabs ou similar) injetando handlers de estado.
2. Refatorar o botão "New Event" para utilizar o `Button` e conectar ao modal de criação (`onAddEvent`).
3. Conectar os botões de navegação dos meses (chevron_left/right) aos hooks de controle de datas.
4. Tornar os cards de evento interativos (abrir detalhes).

## Technical Context
- Componentes alvo: `src/features/calendar/pages/CalendarPage.tsx` e seus sub-componentes.
- Design System: `src/shared/ui/Button.tsx`, `<Tabs>`, etc.
