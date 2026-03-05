# Life OS: Rebirth - Definição do Projeto

## 🎯 Visão Geral
Refatoração completa do ecossistema Life OS para eliminar "código fantasma", botões não funcionais e lógica redundante. O objetivo final é uma aplicação Desktop (Electron) funcional, escalável e capaz de operar offline com sincronização transparente.

## 🏛️ Pilares Arquiteturais
1. **Integridade Funcional**: Nenhum elemento de UI existirá sem um fluxo de dados completo (UI -> State -> Storage).
2. **Offline-First**: O usuário deve conseguir usar 100% das funções produtivas sem conexão à internet.
3. **Single Source of Truth**: Centralização do estado no Zustand e validações compartilhadas via Zod.
4. **Zero Code Smell**: Eliminação de funções duplicadas entre `api/services` e `src/features/*/api`.

## 🛠️ Stack Tecnológica
- **Desktop**: Electron
- **Frontend**: React + Tailwind + Vite
- **Estado**: Zustand (com persistência local)
- **Local Database**: SQLite (via Electron Main) ou IndexedDB (via Zustand persist)
- **Backend/Cloud**: Supabase (PostgreSQL + Auth)
- **Validação**: Zod (Shared Schemas)
