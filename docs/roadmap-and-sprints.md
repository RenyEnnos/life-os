# Roadmap & Sprints - Life OS

> **STATUS ATUAL (02/03/2026)**: 
> - Sprints 1 a 5: **CONCLUÍDAS** (Implementação base, Core features, Saúde/Finanças, Gamificação e IA).
> - Fases 4 a 11 do PR #69: **EM REVISÃO / AJUSTES FINAIS** (Corrigindo feedbacks de segurança, auth e PWA).

Este documento serve como o plano mestre de execução para o desenvolvimento do Life OS, orquestrado pelo **Planner Multi-Agente**.

## 🤖 Agentes Especialistas

Para a execução deste roadmap, os seguintes agentes serão instanciados conforme a necessidade:

1.  **Front-End Planner**: Especialista em React, Tailwind, UX/UI, Componentes e Estado Global (Zustand).
2.  **Back-End & Supabase Planner**: Especialista em Database Design, RLS Policies, Edge Functions, Node.js API e Integração Supabase.
3.  **AI/Groq Planner**: Especialista em Engenharia de Prompt, Integração com LLMs (Groq), Contexto e Automação Inteligente.
4.  **Integrations Planner**: Especialista em APIs externas (Google Calendar, Wearables/Health), OAuth e Sincronização de Dados.
5.  **QA/DevOps Planner**: Especialista em Testes (Vitest), Pipelines de CI/CD, Linting, Performance e Segurança.

---

## 📅 Roadmap de Sprints

### Sprint 1: Fundação (Auth, Design System, Rotas Básicas)
**Foco**: Estabelecer a base sólida da aplicação, garantindo segurança, navegação fluida e consistência visual.

#### Epic 1.1: Autenticação & Segurança
*   **Objetivo**: Implementar fluxo completo de auth com Supabase e proteger rotas.
*   **Arquivos**: `src/lib/supabase.ts`, `src/contexts/AuthContext.tsx` (criar), `src/pages/Login.tsx`, `src/pages/Register.tsx`.
*   **Agente**: Back-End & Supabase Planner (Configuração Supabase) + Front-End Planner (Telas).
*   **Tarefas**:
    1.  [Back] Configurar projeto Supabase e tabela `users` (triggers para `public.users`).
    2.  [Front] Implementar `AuthContext` para gerenciar sessão.
    3.  [Front] Refinar telas de Login/Register com validação de formulário e feedback visual.
    4.  [Front] Criar componente `ProtectedRoute` para bloquear acesso não autorizado.
*   **Critérios de Aceite**: Usuário consegue criar conta, logar, persistir sessão e fazer logout. Rotas privadas redirecionam para login.

#### Epic 1.2: Design System & Layout Base
*   **Objetivo**: Padronizar a UI e estrutura de navegação.
*   **Arquivos**: `src/index.css`, `tailwind.config.js`, `src/components/Layout.tsx` (Sidebar/Header), `src/App.tsx`.
*   **Agente**: Front-End Planner.
*   **Tarefas**:
    1.  [Front] Definir tokens de cores e tipografia no Tailwind (tema escuro/premium).
    2.  [Front] Criar componente `Sidebar` responsivo e animado.
    3.  [Front] Implementar estrutura de Layout principal envolvendo as rotas.
*   **Critérios de Aceite**: Aplicação responsiva, tema consistente, navegação funcionando entre páginas placeholder.

---

### Sprint 2: Features Essenciais (Hábitos, Tarefas, Diário)
**Foco**: Funcionalidades "Core" de produtividade diária.

#### Epic 2.1: Gestão de Hábitos
*   **Objetivo**: CRUD de hábitos e rastreamento diário.
*   **Arquivos**: `src/pages/Habits.tsx`, `src/components/HabitCard.tsx`, Tabela `habits` (Supabase).
*   **Agente**: Fullstack (Front + Back Planners).
*   **Tarefas**:
    1.  [Back] Criar tabela `habits` com RLS e políticas.
    2.  [Front] Interface de listagem de hábitos (cards).
    3.  [Front] Modal de criação/edição de hábito.
    4.  [Front] Lógica de "Check-in" diário (persistência no banco).
*   **Critérios de Aceite**: Criar, editar, excluir e marcar hábito como feito no dia.

#### Epic 2.2: Gerenciador de Tarefas
*   **Objetivo**: Sistema de tarefas com prioridades e tags.
*   **Arquivos**: `src/pages/Tasks.tsx`, Tabela `tasks`.
*   **Agente**: Fullstack.
*   **Tarefas**:
    1.  [Back] Criar tabela `tasks` (campos: title, due_date, priority, tags, status).
    2.  [Front] Kanban ou Lista de tarefas.
    3.  [Front] Filtros por data e prioridade.
*   **Critérios de Aceite**: CRUD completo de tarefas, mudança de status (todo -> done).

#### Epic 2.3: Diário (Journal)
*   **Objetivo**: Registro diário de pensamentos e reflexões.
*   **Arquivos**: `src/pages/Journal.tsx`, Tabela `journal_entries`.
*   **Agente**: Front-End Planner (Editor Rich Text) + Back-End Planner.
*   **Tarefas**:
    1.  [Back] Tabela `journal_entries`.
    2.  [Front] Editor de texto simples ou Markdown.
    3.  [Front] Histórico de entradas por data.
*   **Critérios de Aceite**: Salvar e visualizar entradas de diário.

---

### Sprint 3: Saúde + Finanças
**Foco**: Módulos de rastreamento quantitativo.

#### Epic 3.1: Controle Financeiro
*   **Objetivo**: Rastreamento de receitas e despesas.
*   **Arquivos**: `src/pages/Finances.tsx`, Tabela `transactions`.
*   **Agente**: Fullstack.
*   **Tarefas**:
    1.  [Back] Tabela `transactions` (amount, type, category, date).
    2.  [Front] Dashboard financeiro (Resumo, Gráficos simples).
    3.  [Front] Formulário de nova transação.
*   **Critérios de Aceite**: Adicionar transação, ver saldo atual e histórico.

#### Epic 3.2: Monitoramento de Saúde
*   **Objetivo**: Registro manual de métricas de saúde (inicialmente).
*   **Arquivos**: `src/pages/Health.tsx`, Tabela `health_metrics`.
*   **Agente**: Integrations Planner (preparação) + Front-End Planner.
*   **Tarefas**:
    1.  [Back] Tabela `health_metrics` (weight, sleep_hours, water, workout).
    2.  [Front] Dashboard de saúde com inputs rápidos.
    3.  [Integrations] Pesquisa/POC para integração futura (Google Fit/Apple Health).
*   **Critérios de Aceite**: Registrar peso, sono e treino do dia.

---

### Sprint 4: Projetos + FOFA + Recompensas + Score de Vida
**Foco**: Gamificação e Planejamento Estratégico.

#### Epic 4.1: Gestão de Projetos e Metas
*   **Objetivo**: Agrupar tarefas em projetos maiores.
*   **Arquivos**: `src/pages/Projects.tsx`, Tabela `projects`.
*   **Agente**: Fullstack.
*   **Tarefas**:
    1.  [Back] Tabela `projects` e relacionamento com `tasks`.
    2.  [Front] Visualização de progresso do projeto.

#### Epic 4.2: Análise FOFA (SWOT) Pessoal
*   **Objetivo**: Ferramenta de autoconhecimento.
*   **Arquivos**: `src/components/SWOTBoard.tsx` (novo), Tabela `swot_entries`.
*   **Agente**: Front-End Planner.
*   **Tarefas**:
    1.  [Front] Interface de quadrantes (Forças, Fraquezas, Oportunidades, Ameaças).

#### Epic 4.3: Gamificação (Life Score & Recompensas)
*   **Objetivo**: Calcular pontuação baseada em hábitos/tarefas e gerir recompensas.
*   **Arquivos**: `src/pages/Rewards.tsx`, `src/lib/gamification.ts` (novo).
*   **Agente**: Back-End Planner (Lógica de cálculo) + Front-End Planner.
*   **Tarefas**:
    1.  [Back] Lógica de cálculo do "Life Score" (agregado de hábitos/tarefas).
    2.  [Front] Loja de recompensas (gastar pontos acumulados).

---

### Sprint 5: IA Groq + Modo Low-IA + Logs/Dev Mode
**Foco**: Inteligência Artificial e Ferramentas de Desenvolvedor.

#### Epic 5.1: Assistente IA (Groq Integration)
*   **Objetivo**: Chat ou insights gerados por IA sobre os dados do usuário.
*   **Arquivos**: `src/lib/ai.ts` (novo), Edge Functions (Supabase).
*   **Agente**: AI/Groq Planner.
*   **Tarefas**:
    1.  [AI] Configurar cliente Groq SDK.
    2.  [AI] Criar prompts de sistema para análise de diário/hábitos.
    3.  [Front] Interface de Chat ou Widget de Insights.

#### Epic 5.2: Modo Low-IA & Logs
*   **Objetivo**: Fallback para quando a IA não for necessária ou estiver offline, e logs de sistema.
*   **Arquivos**: `src/pages/Settings.tsx`, Tabela `ai_logs`.
*   **Agente**: QA/DevOps Planner.
*   **Tarefas**:
    1.  [Front] Toggle para desativar recursos de IA.
    2.  [Back] Sistema de logs para ações da IA e erros.

---

## ⚡ Paralelismo Sugerido

*   **Front-End & Back-End**: Podem trabalhar em paralelo na Sprint 1 e 2. Enquanto o Back define o Schema do Supabase e Policies, o Front cria as interfaces com dados mockados (usando interfaces do TypeScript).
*   **Integrations**: Pode iniciar a pesquisa e POC da API do Google Calendar e Health durante a Sprint 2 e 3, para implementação na Sprint 3 ou 4.
*   **QA/DevOps**: Deve configurar o ambiente de CI/CD e Linting logo no início da Sprint 1 e acompanhar cada PR.

## 📝 Próximos Passos Imediatos (Start Sprint 1)

1.  **Back-End Planner**: Validar e aplicar Schema inicial do Supabase (`users`).
2.  **Front-End Planner**: Configurar `AuthContext` e revisar `Login.tsx`.
