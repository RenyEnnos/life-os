# Roadmap: Event Infrastructure & UI Fixes

## Objetivo
Refatorar a interface de usuário (UI) da aplicação para conectar os botões visuais (mockups) à lógica de negócio real, substituindo elementos HTML brutos por componentes padronizados do Design System (`src/shared/ui/`) e implementando os event handlers (`onClick`, `onSubmit`) adequados integrados ao estado (Zustand/React Query/Context).

## Fase 1: Padronização do Design System e Foundation
1. **Auditoria no componente global `Button.tsx`:** 
   - Verificar se as propriedades padrão do React (`onClick`, `disabled`, `type`) estão sendo repassadas corretamente através do Radix UI `<Slot>` e do `framer-motion` `<motion.button>`.
   - Adicionar testes de unidade para garantir que `onClick` é disparado adequadamente sob todas as variantes de uso.

## Fase 2: Módulo de Calendário (Calendar)
1. **Página `CalendarPage.tsx`:**
   - Substituir botões estáticos de "Day/Week/Month" por um componente controlado de `<Tabs>` ou similar, injetando handlers de estado.
   - Refatorar o botão "New Event" para utilizar o `Button` e conectar ao modal de criação (`onAddEvent`).
   - Conectar os botões de navegação dos meses (chevron_left/right) aos hooks de controle de datas.
   - Tornar os cards de evento interativos (abrir detalhes).

## Fase 3: Módulo de Projetos (Projects)
1. **Página `ProjectsPage.tsx`:**
   - Trocar botões como "Filter" e "Add Column" por componentes `Button` da base compartilhada, linkando à lógica de filtro/adição.
   - Tornar as "Tabs" (Board/List e Active/Archived) funcionais conectando o estado visual.
   - Garantir que interações nos cartões (Kanban cards) disparem mutações ou abram painéis de detalhes (Right Metadata Panel).

## Fase 4: Módulo de Foco (Focus)
1. **Página `FocusPage.tsx`:**
   - Substituir links do sidebar (Timer, Dashboard, etc.) para utilizar o React Router (`<Link>` ou `useNavigate`).
   - Ativar os botões controladores do Timer (Pause, Stop, +5m) conectando-os ao store/hook que controla a regressão de tempo.
   - Fazer o "Ambient Toggle" alternar ruídos usando o provider de áudio existente.

## Fase 5: Revisão dos demais Módulos
1. **Módulo de Saúde (Health) e Universidade (University):**
   - Substituir quaisquer tags estáticas `<button>` remanescentes por componentes interativos controlados.
2. **Quality Assurance (QA):**
   - Executar os testes E2E (`playwright`) para garantir que os fluxos críticos de clique e interação estejam respondendo em toda a plataforma de ponta a ponta.
