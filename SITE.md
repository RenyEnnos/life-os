# LifeOS - Electron Desktop App

## Visão
Um aplicativo desktop premium e offline-first para gerenciamento pessoal de alta performance, construído com Electron.

## Arquitetura
- **Desktop Runtime:** Electron (Main Process + Renderer)
- **Armazenamento Local:** SQLite via `better-sqlite3`
- **Comunicação:** IPC entre frontend e backend local
- **Sincronização:** Opcional com Supabase

## Features
- [x] Dashboard (Command Center): Hub central com widgets em bento grid.
- [x] AI Assistant: Interface de chat para interações.
- [x] Calendar: Visualização de agenda.
- [x] Finances: Rastreamento detalhado de receitas/despesas.
- [x] Habits: Tracking de hábitos com heatmaps e streaks.
- [x] Health: Monitoramento de saúde e bem-estar.
- [x] Journal: Diário com análise de IA.
- [x] Tasks: Gerenciamento de tarefas com Kanban.
- [x] Projects: Gestão de projetos.
- [x] University: Acompanhamento acadêmico.
- [x] Gamification: Sistema de XP e conquistas.

## Roadmap
1.  **Dashboard (Command Center):** Central hub with bento grid widgets.
2.  **AI Assistant:** Chat interface for interactions.
3.  **Calendar:** Schedule view.
4.  **Finances:** detailed tracking.
