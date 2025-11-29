## 1. Definição de Requisitos (MVP)
- Funcionalidades essenciais:
  - Autenticação: cadastro/login, sessão JWT, preferências do usuário
  - Dashboard: Life Score, agenda de hoje, resumo hábitos, saúde e finanças
  - Tarefas & Calendário: CRUD, visualização lista/semana/mês, integração Google Calendar
  - Hábitos & Rotinas: CRUD, rotinas (manhã/tarde/noite), heatmap semanal
  - Diário: CRUD, resumo diário por IA (opcional/Low-IA)
  - Saúde: métricas (sono, passos, FC, SpO₂, peso), cad. medicações
  - Finanças: receitas/despesas, resumo mensal, importação CSV, classificação automática (heurística/IA)
  - Projetos & FOFA: CRUD projetos, FOFA assistida por IA
  - Recompensas & Score: cálculo de “Life Score”, recompensas e conquistas
  - Configurações & Dev Logs: tema, notificações, IA (limites/Low-IA), exportação JSON/CSV, logs
- Casos de uso/fluxos:
  - Usuário registra/login → acessa dashboard → cria tarefas/hábitos/entradas → revisa finanças e saúde → usa IA para FOFA/resumo/classificação → acompanha score e recompensas
  - Integração Calendar: conecta OAuth, lê/edita eventos, sincroniza com tarefas
  - Exportação: baixa JSON completo e CSV por domínio
- Critérios de aceitação por feature:
  - CRUD completo, filtros e paginação básica, autorização por usuário
  - Integrações (Calendar/IA) funcionam com limites e fallback local
  - Export JSON/CSV sem dados de terceiros, apenas do usuário ativo
  - UI responsiva, tema escuro padrão, consistência brutalista
  - Testes unitários e integração cobrindo rotas e serviços críticos

## 2. Arquitetura Técnica
- Stack:
  - Frontend: React + TypeScript + Vite + Tailwind + React Router + Recharts
  - Backend: Node.js + Express + TypeScript; serviços por domínio; middleware JWT
  - Banco: Supabase (PostgreSQL) com RLS; migrações SQL por entidade
  - IA: Groq API com cache, heurísticas e contadores de uso
  - Integrações: Google Calendar (OAuth2), Saúde (mock/estrutura pronta)
- Componentes e fluxo de dados:
  - UI → hooks/serviços de API (fetch com JWT) → rotas Express → serviços → repositórios (Supabase) → DB
  - IA/Calendar/Export como módulos externos
- Ambiente e CI/CD:
  - .env separado (frontend/backend), sem chaves no repo
  - GitHub Actions: lint, test, build; deploy sugerido: Front (Vercel), Back (Render/Fly.io)

## 3. Desenvolvimento Priorizado
- Prioridade crítica (ordem):
  1) Autenticação e preferências (JWT + /me + /preferences)
  2) Tarefas CRUD + lista/calendário + sincronização Google Calendar
  3) Hábitos CRUD + rotinas + heatmap semanal
  4) Diário CRUD + resumo por IA (com Low-IA e limites)
  5) Finanças CRUD + resumo mensal + import CSV + classificação (heurística/IA)
  6) Saúde CRUD + medicações + alertas básicos (estrutura)
  7) Projetos CRUD + FOFA (IA + cache)
  8) Recompensas + cálculo Life Score consolidado
  9) Export JSON/CSV + Configurações & Dev Logs
- Integrações essenciais:
  - Google Calendar (OAuth, sync bidirecional, mapeamento tarefa↔evento)
  - Groq IA com contadores diários, cache e fallback heurístico
- Autorização:
  - Garantir user scoping em todas rotas; reforçar RLS no Supabase

## 4. Testes e Validação
- Testes automatizados:
  - Unit: serviços por domínio, regras de negócio (score, IA heurísticas)
  - Integração: rotas protegidas (JWT), export JSON/CSV, IA endpoints (mock)
  - E2E (fase 2): cenários chave no front (login, criar tarefa, gerar resumo)
- Usabilidade:
  - Sessão de teste interno com 3–5 usuários reais; coletar feedback de navegação, performance e clareza
  - Ajustes: rotulagem, estados de loading/erro, acessibilidade básica

## 5. Preparação para Produção
- Performance:
  - Paginação e filtros; índices extras; memoização no front; redução de chamadas IA
  - Build otimizado; code-splitting nas rotas
- Monitoramento/Logging:
  - Logger estruturado (pino/winston) no backend; métricas (response time, error rate)
  - Página Dev/Logs mostrando chamadas IA, latência média e erros
- Documentação/Deploy:
  - README detalhado (setup, env, execução, extensões)
  - Playbook de deploy (Front/Back), migrações DB, rollback

## 6. Roadmap (Dependências, Estimativas, Recursos, Marcos)
- Fase 0: Fundamentos (1–2 dias)
  - Setup env/CI; lint/test; base de rotas; autenticação
  - Dependências: nenhuma
  - Recursos: 1 BE, 1 FE, Arquiteto
  - Marco: login/registro funcionando
- Fase 1: Núcleo de dados (3–5 dias)
  - Tarefas, Hábitos, Diário, Finanças, Saúde CRUD; paginação básica
  - Dependências: Fase 0
  - Recursos: 2 BE, 2 FE
  - Marco: módulos CRUD estáveis e testados
- Fase 2: Integrações & IA (3–5 dias)
  - Google Calendar (OAuth + sync), Groq IA (FOFA, classificação, resumo)
  - Dependências: Fase 1; chaves Google/Groq
  - Recursos: Eng. Integrações, Eng. IA
  - Marco: IA e Calendar operacionais com limites e cache
- Fase 3: Score & Recompensas (2–3 dias)
  - Cálculo Life Score, UI de recompensas/achievements
  - Dependências: Fase 1/2
  - Recursos: BE/FE
  - Marco: Score dinâmico no dashboard
- Fase 4: UX/Design System & Gráficos (2–3 dias)
  - Componentes (Button, Tag, Input, Toggle, Tabs, Badge, ProgressBar), wrappers Recharts
  - Dependências: Fase 1
  - Recursos: UX/UI + FE
  - Marco: UI consistente brutalista em todas páginas
- Fase 5: Observabilidade & Export/Privacidade (2 dias)
  - Logging, métricas, export JSON/CSV, Data/Privacy
  - Dependências: Fase 1
  - Recursos: BE
  - Marco: Dev Logs e export funcionando
- Fase 6: Produção & Hardening (2–3 dias)
  - Otimizações, segurança (RLS audit), deploy pipelines
  - Dependências: todas anteriores
  - Recursos: Arquiteto + BE/FE
  - Marco: release estável

### Dependências entre tarefas
- Autenticação → CRUDs → Integrações (Google/Groq) → Score/Recompensas → Observabilidade/Export → Produção

### Estimativas (total)
- 13–20 dias úteis (varia por recursos disponíveis e complexidade das integrações)

### Recursos necessários
- Humanos: Arquiteto, FE sênior, BE/DB, Eng. IA, UX/UI, Eng. Integrações
- Técnicos: Supabase, Groq, Google Cloud (OAuth), Vercel/Render/Fly.io, GitHub Actions

### Marcos (milestones)
- M1: Autenticação entregue
- M2: CRUDs dos domínios principais
- M3: Integrações (IA/Calendar)
- M4: Score & Recompensas
- M5: Design System consolidado
- M6: Observabilidade e Export
- M7: Produção (deploy estável)

—
Confirme o plano para iniciarmos execução contínua seguindo as fases e marcos acima.