# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.1.0] - 2025-11-29

### ✨ Adicionado

#### Frontend
- **Refatoração completa da arquitetura de API**
  - Implementado `apiFetch` centralizado para todas as chamadas API
  - Removido código duplicado de autenticação e headers
  - Melhor tratamento de erros
  
- **Componentes de UI aprimorados**
  - Sistema de design brutalist implementado
  - Componentes Card, Button reutilizáveis
  - Layout responsivo em todas as páginas

- **Páginas principais implementadas**
  - Dashboard com Life Score e resumos
  - Gestão de Tarefas com filtros e tags
  - Rastreamento de Hábitos com visualizações
  - Métricas de Saúde com gráficos
  - Controle Financeiro com categorização
  - Diário pessoal
  - Gestão de Projetos com SWOT
  - Sistema de Recompensas

- **Hooks customizados**
  - `useTasks` - Gerenciamento de tarefas
  - `useHabits` - Gerenciamento de hábitos
  - `useHealth` - Métricas de saúde
  - `useFinance` - Transações financeiras
  - `useJournal` - Entradas de diário
  - `useRewards` - Sistema de recompensas
  - `useDashboardData` - Dados agregados do dashboard

#### Backend
- **API RESTful completa**
  - Autenticação com JWT
  - CRUD para todos os recursos
  - Middleware de autenticação
  - Validação de dados

- **Rotas implementadas**
  - `/api/auth` - Login e registro
  - `/api/tasks` - Gerenciamento de tarefas
  - `/api/habits` - Rastreamento de hábitos
  - `/api/health` - Métricas de saúde
  - `/api/finances` - Transações financeiras
  - `/api/journal` - Entradas de diário
  - `/api/projects` - Gestão de projetos
  - `/api/rewards` - Sistema de recompensas
  - `/api/ai` - Integração com IA
  - `/api/score` - Cálculo do Life Score
  - `/api/export` - Exportação de dados (JSON/CSV)

- **Serviços**
  - `tasksService` - Lógica de negócio para tarefas
  - `habitsService` - Lógica de hábitos
  - `healthService` - Métricas de saúde
  - `financeService` - Transações financeiras
  - `aiService` - Integração com Groq AI
  - `scoreService` - Cálculo do Life Score
  - `calendarService` - Sincronização com Google Calendar (WIP)

- **Integrações**
  - Groq AI para insights e classificações
  - Google Calendar API (parcial)
  - Supabase para persistência

#### Banco de Dados
- **Schema completo no Supabase**
  - Tabelas para usuários, tarefas, hábitos, saúde, finanças, etc.
  - Row Level Security (RLS) implementado
  - Indexes para performance
  - Migrations versionadas

### 🔧 Corrigido
- **TypeScript**
  - Resolvidos todos os erros de tipo no backend
  - Adicionados tipos corretos para `json2csv` e `supertest`
  - Tipos implícitos corrigidos em `scoreService.ts`
  
- **API Routes**
  - Corrigido nome do arquivo `finances.ts` (estava `finance.ts`)
  - Imports corrigidos nos testes
  - Handlers de erro padronizados

- **Build**
  - Build de produção funcionando sem erros
  - TypeScript compilation limpa
  - Dependencies atualizadas

### 🎨 Melhorado
- **Experiência do Usuário**
  - Interface mais limpa e consistente
  - Feedback visual em todas as ações
  - Loading states implementados
  - Mensagens de erro claras

- **Performance**
  - Redução de re-renders desnecessários
  - Lazy loading de componentes
  - Otimização de queries

- **Código**
  - Estrutura de pastas mais organizada
  - Separação de concerns melhorada
  - Documentação inline
  - Constância no estilo de código

### 🔒 Segurança
- JWT para autenticação
- Row Level Security no Supabase
- Validação de entrada no backend
- CORS configurado adequadamente
- Secrets em variáveis de ambiente

### 📚 Documentação
- README.md completo e profissional
- CHANGELOG.md com histórico de versões
- Comentários inline em código complexo
- Roadmap de desenvolvimento

### 🧪 Testes
- Setup de testes com Vitest
- Testes básicos para rotas da API
- Coverage configurado
- Mocks para Supabase

### 🛠️ DevOps
- Scripts npm organizados
- Hot reload em desenvolvimento
- Build otimizado para produção
- ESLint e Prettier configurados

## [Unreleased]

### Planejado para v0.2.0
- [ ] Sincronização bidirecional completa com Google Calendar
- [ ] Integração com Google Fit e Apple Health
- [ ] Notificações push
- [ ] Progressive Web App (PWA)
- [ ] Modo offline
- [ ] Temas customizáveis
- [ ] Exportação de relatórios em PDF
- [ ] Compartilhamento de projetos
- [ ] API pública documentada

### Em Consideração
- [ ] App mobile nativo (React Native)
- [ ] Suporte a múltiplos idiomas
- [ ] Gamificação avançada
- [ ] Integrações com Todoist, Notion, etc.
- [ ] Backup automático
- [ ] Modo escuro/claro
- [ ] Widgets de dashboard customizáveis

---

## Formato do Changelog

### Categorias
- **✨ Adicionado** - Novas funcionalidades
- **🔧 Corrigido** - Bug fixes
- **🎨 Melhorado** - Melhorias em funcionalidades existentes
- **🗑️ Removido** - Funcionalidades removidas
- **🔒 Segurança** - Patches de segurança
- **⚠️ Deprecated** - Funcionalidades que serão removidas
- **📚 Documentação** - Mudanças na documentação
- **🧪 Testes** - Adição ou modificação de testes
- **🛠️ DevOps** - Mudanças em CI/CD, scripts, etc.

### Links
[0.1.0]: https://github.com/RenyEnnos/life-os/releases/tag/v0.1.0
[Unreleased]: https://github.com/RenyEnnos/life-os/compare/v0.1.0...HEAD
