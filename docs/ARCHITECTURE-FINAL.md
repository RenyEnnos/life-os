# Life OS - Complete Project Documentation

## 🚀 Overview
Life OS é uma plataforma premium de gerenciamento pessoal projetada para reduzir a carga cognitiva e aumentar a produtividade através de uma interface unificada "Deep Glass". Integra hábitos, tarefas, finanças, gerenciamento acadêmico e um assistente de IA com contexto. O projeto agora é um **aplicativo desktop Electron offline-first**.

## 🛠 Tech Stack
- **Desktop Runtime**: Electron (Main Process como backend local)
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Local Database**: SQLite (`better-sqlite3`) via Electron Main Process
- **Cloud Sync**: Supabase (PostgreSQL + Auth) - opcional e explícito
- **AI**: Groq (Llama 3), Google Gemini (Flash/Pro) via Neural Nexus engine
- **State**: Zustand (Local), React Query (Cache)
- **Comunicação**: Electron IPC (`window.api`) - sem HTTP REST direto

## ✨ Core Features
1. **Live Executive Dashboard**: Layout Bento Grid com widgets em tempo real.
2. **Habit Tracking**: Hábitos quantificados e binários com heatmaps e streaks.
3. **Task Kanban**: Gerenciamento de tarefas multi-status com drag-and-drop.
4. **Financial Management**: Rastreamento de Receitas/Despesas com filtragem avançada e progresso de orçamento.
5. **Academic Management**: Rastreamento de cursos e tarefas com cálculo automático de GPA.
6. **AI Assistant (Nexus)**: Captura rápida universal, chat flutuante e insights proativos do Synapse.
7. **Neural Resonance**: Journaling com análise de humor e tema via IA.
8. **Gamification**: Sistema global de XP, leveling e galeria de conquistas.

## 🛡 Security
- Rate limiting global e por rota.
- Row Level Security (RLS) rigoroso em todas as tabelas do banco de dados (quando usando Supabase).
- Validação rigorosa de entrada Zod.
- Cookies HTTP-only seguros para gerenciamento de sessão.

## 📦 Instalação (Desktop App)
1. Clone o repositório
2. Execute `npm install` para instalar dependências
3. Execute `npm run dev` para iniciar o aplicativo desktop
4. O aplicativo roda localmente com SQLite - nenhuma configuração de servidor necessária

## ☁️ Sincronização Cloud (Opcional)
A sincronização com Supabase é um recurso opcional que requer configuração explícita:
1. Crie um arquivo `.env` na raiz com suas credenciais Supabase
2. Configure a autenticação no Settings do aplicativo
3. A sincronização ocorre em background quando habilitada

---
*Gerado: 2026-03-02*
