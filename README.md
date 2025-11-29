# Life OS – Sistema de Gerenciamento Pessoal

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/RenyEnnos/life-os)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/RenyEnnos/life-os/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Um sistema completo de gerenciamento pessoal (Life OS) para organizar hábitos, tarefas, calendário, diário, saúde, finanças, projetos e recompensas. Possui um **Life Score** agregado que reflete seu progresso geral.

## 🎯 Características Principais

- **Dashboard Brutalist**: Interface moderna e minimalista com design brutalist
- **Gestão de Tarefas**: Organize tarefas com tags, prioridades e prazos
- **Hábitos**: Acompanhe hábitos diários com streak tracking
- **Saúde**: Monitore métricas de saúde (sono, passos, exercícios, etc.)
- **Finanças**: Controle transações e visualize resumos financeiros
- **Diário**: Registre pensamentos e reflexões diárias
- **Projetos**: Gerencie projetos com análise SWOT
- **Life Score**: Pontuação agregada baseada em seu progresso geral
- **AI Insights**: Análises e sugestões opcionais com Groq AI

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** com **TypeScript**
- **Vite** para build ultrarrápido
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Recharts** para visualizações
- **Lucide React** para ícones

### Backend
- **Node.js** com **Express**
- **TypeScript** para type safety
- **JWT** para autenticação
- **Supabase** (PostgreSQL) como banco de dados
- **Row Level Security (RLS)** para segurança

### Integrações
- **Groq AI** para insights (opcional)
- **Google Calendar API** para sincronização de calendário (WIP)
- **Google Fit / Apple Health** (planejado)

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ LTS
- npm ou pnpm
- Conta Supabase (gratuita)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/RenyEnnos/life-os.git
cd life-os
```

2. **Instale as dependências**
```bash
npm install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Backend
PORT=3001
JWT_SECRET=seu_secret_jwt_muito_seguro_aqui
NODE_ENV=development

# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# AI (Opcional)
GROQ_API_KEY=sua_chave_groq

# Google Calendar (Opcional)
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/calendar/callback
```

4. **Configure o banco de dados**

Execute as migrations no Supabase (veja `supabase/migrations/`)

5. **Inicie o projeto**

```bash
# Modo desenvolvimento (frontend + backend)
npm run dev

# Apenas frontend
npm run client:dev

# Apenas backend
npm run server:dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📦 Scripts Disponíveis

```bash
npm run dev           # Inicia frontend e backend em desenvolvimento
npm run client:dev    # Apenas frontend
npm run server:dev    # Apenas backend
npm run build         # Build de produção
npm run preview       # Preview do build
npm run check         # Verificação TypeScript
npm run test          # Executa testes
npm run lint          # Lint do código
```

## 🏗️ Arquitetura

```
┌─────────────────┐
│  React/Vite     │
│  (Frontend)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐      ┌──────────────┐
│  Express API    │─────→│  Supabase    │
│  (Backend)      │      │  PostgreSQL  │
└────────┬────────┘      └──────────────┘
         │
         ├──────────→ Groq AI
         │
         └──────────→ Google Calendar API
```

## 📁 Estrutura do Projeto

```
life-os/
├── api/                    # Backend Express
│   ├── routes/            # Rotas da API
│   ├── services/          # Lógica de negócio
│   ├── middleware/        # Middlewares
│   └── lib/               # Utilitários
├── src/                   # Frontend React
│   ├── components/        # Componentes React
│   ├── pages/            # Páginas/Views
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitários
│   └── contexts/         # Context providers
├── supabase/             # Configurações Supabase
│   └── migrations/       # Migrations SQL
└── docs/                 # Documentação
```

## 🔐 Segurança

- **JWT** para autenticação segura
- **Row Level Security (RLS)** no Supabase
- **Variáveis de ambiente** para secrets
- **CORS** configurado adequadamente
- **Validação** de dados no backend

## 📊 Funcionalidades por Módulo

### Dashboard
- Visão geral do Life Score
- Resumo de hábitos, tarefas e saúde
- Ações rápidas

### Tarefas
- Criar, editar e deletar tarefas
- Tags e categorias
- Filtros por status, data, projeto
- Sincronização com Google Calendar (WIP)

### Hábitos
- Rastreamento de hábitos diários
- Visualização de streaks
- Gráficos de consistência
- Tipos binários e numéricos

### Saúde
- Registro de métricas (sono, passos, peso, etc.)
- Gráficos de evolução
- Metas personalizadas

### Finanças
- Registro de transações (receitas/despesas)
- Categorização automática com AI (opcional)
- Resumos mensais
- Gráficos de balanço

### Diário
- Entradas diárias de texto livre
- Resumos automáticos com AI
- Busca e filtros

### Projetos
- Gestão de projetos pessoais
- Análise SWOT integrada
- Vinculação com tarefas

## 🤖 Integração com AI

O Life OS usa **Groq AI** para insights opcionais:

- **Classificação de transações**: Categoriza automaticamente despesas
- **Análise SWOT**: Gera análises SWOT para projetos
- **Resumos diários**: Sumariza entradas do diário
- **Cache inteligente**: Minimiza custos com AI

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Testes com coverage
npm run test:coverage

# Modo watch
npm run test:watch
```

## 📈 Roadmap

### v0.1.0 (Atual)
- ✅ Sistema de autenticação
- ✅ CRUD completo para todos os módulos
- ✅ Dashboard com Life Score
- ✅ Design brutalist implementado
- ✅ Integração básica com AI

### v0.2.0 (Próximo)
- [ ] Sincronização bidirecional com Google Calendar
- [ ] Integração com Google Fit/Apple Health
- [ ] Notificações push
- [ ] Modo offline (PWA)
- [ ] Temas customizáveis

### v1.0.0 (Futuro)
- [ ] App mobile (React Native)
- [ ] Compartilhamento de projetos
- [ ] Gamificação avançada
- [ ] Relatórios em PDF
- [ ] API pública

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Changelog

Veja [CHANGELOG.md](CHANGELOG.md) para histórico de versões.

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Pedro** - [RenyEnnos](https://github.com/RenyEnnos)

## 🙏 Agradecimentos

- Design inspirado em princípios brutalist
- Comunidade React e TypeScript
- Supabase pela infraestrutura incrível
- Groq AI pelos insights acessíveis

---

**Life OS** - Organize sua vida com estilo e eficiência! 🚀
