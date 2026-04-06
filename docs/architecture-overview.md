# Life OS - Architecture Overview

Este documento descreve as decisões lógicas, bibliotecas e o fluxo de dados em alto-nível do **Life OS**.

## 1. High-Level System Architecture

O sistema opera em uma arquitetura **Electron desktop-first e offline-first**, com dados armazenados localmente via SQLite.

```mermaid
graph TD
    %% Define Nodes
    Frontend["Frontend (React / Vite)"]
    IPC["Electron IPC Bridge"]
    Main["Electron Main Process"]
    DB[(\"SQLite Local\")]\n    Sync["Sync Engine (Opcional)"]\n    Cloud[(\"Supabase Cloud\")]\n\n    %% Edges\n    Frontend -- \"IPC Calls\" --> IPC\n    IPC --> Main\n    Main --> DB\n    Main -. \"Sincronização Opcional\" .-> Sync\n    Sync -. \"HTTPS\" .-> Cloud\n\n    %% Styling\n    classDef frontend fill:#3b82f6,color:#fff,stroke:none;\n    classDef electron fill:#10b981,color:#fff,stroke:none;\n    classDef data fill:#8b5cf6,color:#fff,stroke:none;\n\n    class Frontend frontend;\n    class IPC,Main electron;\n    class DB,Cloud data;\n    class Sync electron;\n```

## 2. Frontend Layer (React / Vite)

O cliente foca no paradigma de "Feature-Sliced Design", isolando contextos (ex: Finances, Habits, Tasks) e comunicando-se exclusivamente via `window.api` para interagir com o banco de dados local.

**Principais Tecnologias:**
- **Build Tool:** Vite + TypeScript
- **State Management:** Zustand (Stores locais) e React Query (Cache de estado do servidor local).
- **Styling:** Tailwind CSS integrado via classes utils (`cn`).
- **Componentes Base:** Lucide React (Ícones), Radix/Shadcn UI patterns, e Storybook (Documentação nativa).
- **Comunicação:** Electron IPC via `window.api` (sem chamadas HTTP REST diretas).

## 3. Electron Main Process (Backend Local)

O processo principal do Electron atua como backend local, gerenciando o banco de dados SQLite e a comunicação IPC.

**Responsabilidades:**
1. **SQLite Database:** Armazenamento local de todos os dados do usuário via `better-sqlite3`.
2. **IPC Handlers:** Processamento de requisições do frontend para operações CRUD.
3. **Sync Engine (Opcional):** Sincronização background com Supabase quando configurado.
4. **Autenticação:** Gestão de sessão local com opção de autenticação cloud via Supabase.

## 4. Estruturação Modular de Domínio

O código não acopla as features no nível raíz. Se você navegar dentro de `src/features/` ou `electron/ipc/`, notará segregação por escopo de negócios:

* `auth`: Controle de Sessão e perfis (local + opcional cloud).
* `habits`: Geração de streaks e frequências periódicas.
* `tasks`: Todo's orientados a data final de entrega (`due_date`).
* `finances`: Despesas, transações pendentes, dashboards gerenciais.
* `onboarding`: Configuração de sistema, Tutoriais e Starter Templates prefabricados.

## 5. Offline-First

O Life OS é projetado para funcionar 100% offline por padrão:

- Todos os dados são persistidos localmente no SQLite.
- O aplicativo inicia e funciona sem conexão à internet.
- A sincronização com a nuvem é um recurso opcional e explícito.
- Empty states são exibidos quando não há dados, sem mocks ou dados fictícios.
