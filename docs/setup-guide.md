---
type: reference
status: active
last_updated: 2026-04-27
tags: [reference]
---

# Life OS - Developer Setup Guide

Para instalar e executar o Life OS Personal Operating System em seu ambiente local, siga os requisitos abaixo.

## 1. Pré-requisitos
- **Node.js**: `v18.x` ou superior
- **npm**: `v9.x` ou superior
- **Electron**: Instalado automaticamente via `npm install`

## 2. Variáveis de Ambiente (`.env`)

O Life OS funciona offline por padrão. Crie um `.env` na raiz apenas se precisar configurar a sincronização com Supabase:

```bash
# SUPABASE SYNC (Opcional - apenas para sincronização cloud)
VITE_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhb...[ANON_KEY]"

# ENVIRONMENT
NODE_ENV="development"
```

*Nota: O aplicativo funciona completamente sem estas variáveis. Todos os dados são armazenados localmente no SQLite.*

## 3. Fluxo de Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/RenyEnnos/life-os.git
cd life-os

# 2. Instale as dependências NPM
npm install

# 3. Inicie o aplicativo Electron Desktop
npm run dev
```

O aplicativo desktop será iniciado na porta do Vite (`http://localhost:5173`) rodando dentro do runtime Electron.

## 4. Estrutura do Projeto

```
life-os/
├── electron/           # Processo principal Electron
│   ├── main.ts        # Entry point do Electron
│   ├── db/            # Banco de dados SQLite local
│   ├── ipc/           # Handlers IPC para comunicação frontend
│   └── sync/          # Engine de sincronização opcional com Supabase
├── src/               # Frontend React
│   ├── features/      # Módulos de domínio (Tasks, Habits, Finances, etc.)
│   ├── shared/        # Componentes e utilitários reutilizáveis
│   └── app/           # Configuração global e rotas
└── package.json       # Dependências e scripts
```

## 5. UI Components Guide (Storybook)

O Life OS inclui um dicionário de design-system via Storybook.
Se estiver modificando a UI React, você pode iterar componentes em isolamento via:

```bash
npm run storybook
```

Isso executa o portal de design na porta `6006`.

## 6. Build para Produção

```bash
# Build do aplicativo desktop para sua plataforma
npm run build

# Build e empacotamento do Electron
npm run electron:build
```

Os artefatos serão gerados na pasta `release/`.
