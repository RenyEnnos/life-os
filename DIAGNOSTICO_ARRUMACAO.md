# 🔍 DIAGNÓSTICO DE ARRUMAÇÃO - Life OS

> **Data:** 2026-02-03  
> **Status:** Análise Completa - Aguardando Confirmação do Usuário  
> **Projeto:** life-os (React + Node.js + Supabase)

---

## 1. Resumo da Situação

O projeto **Life OS** é uma aplicação full-stack de produtividade pessoal com:
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS
- **Backend:** Express.js (api/) + Supabase
- **AI:** Integração com Groq e Google Gemini
- **Features:** 21 módulos (habits, tasks, finances, journal, etc.)

### 🚨 Problemas Críticos Identificados

> [!CAUTION]
> **EXPOSIÇÃO DE CREDENCIAIS:** O arquivo `.env` contém chaves de API reais expostas (Gemini, Groq, Supabase, Unsplash, News API, CoinGecko, etc.). Essas chaves devem ser **rotacionadas imediatamente** antes de qualquer push para repositório público.

> [!WARNING]
> **Arquivos de Debug na Raiz:** Múltiplos arquivos `.txt` e `.log` de debug/validação estão poluindo o diretório raiz (18+ arquivos temporários).

> [!IMPORTANT]
> **Pasta .agent Massiva:** Contém 2068 arquivos de skills/workflows que provavelmente não devem ir para o repositório principal.

---

## 2. Inventário de Arquivos

### ✅ `[MANTER]` - Core do Projeto

| Diretório/Arquivo | Descrição |
|---|---|
| `src/` | Código fonte do frontend (307 arquivos) |
| `src/features/` | 21 módulos de features (auth, habits, tasks, finances, etc.) |
| `src/shared/` | Componentes, hooks, types, UI compartilhados |
| `api/` | Backend Express (80 arquivos) |
| `api/routes/`, `api/services/`, `api/middleware/` | Estrutura do servidor |
| `supabase/migrations/` | 20 arquivos de migração do banco |
| `public/` | Assets públicos |
| `docs/` | Documentação (25 arquivos) |
| `scripts/` | Scripts de build/deploy (10 arquivos) |
| `.github/` | Workflows do GitHub Actions (8 arquivos) |
| `package.json`, `tsconfig.json`, `vite.config.ts` | Configurações essenciais |
| `tailwind.config.js`, `postcss.config.js` | Configuração de estilos |
| `Dockerfile`, `docker-compose.yml` | Containerização |
| `eslint.config.js`, `vitest.config.ts`, `playwright.config.ts` | Ferramentas de dev |
| `README.md`, `CONTRIBUTING.md`, `LICENSE`, `CHANGELOG.md` | Documentação |
| `index.html` | Ponto de entrada HTML |
| `vercel.json`, `.vercelignore` | Configuração Vercel |
| `conductor/` | Documentação de produto (8 arquivos) |

---

### 🚫 `[IGNORAR]` - Deve ir no `.gitignore`

| Diretório/Arquivo | Motivo |
|---|---|
| `node_modules/` | Dependências (já no .gitignore) |
| `dist/`, `build/` | Artefatos de build |
| `.cache/` | Cache de build |
| `coverage/` | Relatórios de cobertura de testes |
| `test-results/` | Artefatos de testes Playwright (25 subpastas) |
| `testsprite_tests/` | Testes gerados por TestSprite (27 arquivos) |
| `reports/` | Relatórios Lighthouse (~2MB em HTML/JSON) |
| `screenshots/` | Screenshots de testes |
| `.vercel/` | Configuração local do Vercel |
| `.storybook/` | Configuração Storybook (build deve ser ignorado) |
| `storybook-static/` | Build do Storybook |
| `.trae/` | IDE local artifacts |
| `.Jules/` | Configurações de IDE |
| `pnpm-lock.yaml` | Lock file (ou manter `package-lock.json`, não ambos) |
| `*.log` | Todos os arquivos de log |

---

### 🗑️ `[DESCARTAR]` - Lixo/Arquivos Temporários

> [!NOTE]
> Estes arquivos parecem ser outputs de debugging ou validação manual. **Confirme antes de deletar.**

| Arquivo | Conteúdo/Razão |
|---|---|
| `check_final.txt` (20KB) | Output de verificação |
| `check_out_2.txt` (18KB) | Output de verificação |
| `check_out_3.txt` (17KB) | Output de verificação |
| `check_out_projects.txt` (21KB) | Output de verificação |
| `check_output.txt` (18KB) | Output de verificação |
| `debug_deltas.txt` (6 bytes) | Debug vazio |
| `integrity_report.txt` (3KB) | Relatório de integridade |
| `output.txt` (40 bytes) | Output temporário |
| `val_error.txt` (3KB) | Erros de validação |
| `validation.log` (0 bytes) | Log vazio |
| `validation_all.log` (3KB) | Log de validação |
| `validation_check.log` (20KB) | Log de validação |
| `validation_check_v2.log` (20KB) | Log de validação |
| `validation_fix.log` (0 bytes) | Log vazio |
| `validation_pass_2.log` (44 bytes) | Log de validação |
| `validation_utf8.log` (0 bytes) | Log vazio |
| `vite.log` (27KB) | Log do Vite |
| `testsprite_error.log` (3KB) | Log de erros do TestSprite |
| `.agent/preview.log` (15KB) | Log de preview |
| `.agent/preview.pid` (5 bytes) | PID file |

---

### ⚠️ `[RISCO]` - Dados Sensíveis que Precisam Sanitização

> [!CAUTION]
> **AÇÃO IMEDIATA NECESSÁRIA:** Rotate todas as chaves antes de publicar.

| Arquivo | Credenciais Expostas |
|---|---|
| `.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |
| `.env` | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| `.env` | `GEMINI_API_KEY` |
| `.env` | `GROQ_API_KEY` |
| `.env` | `METEOSOURCE_API_KEY` |
| `.env` | `COINGECKO_API_KEY` |
| `.env` | `CURRENCYFREAKS_API_KEY` |
| `.env` | `NEWS_API_KEY` |
| `.env` | `UNSPLASH_ACCESS_KEY`, `UNSPLASH_SECRET_KEY` |
| `.env` | `JWT_SECRET` |

**Ação:** Criar `.env.example` com placeholders e garantir que `.env` está no `.gitignore`.

---

### 🤔 `[AVALIAR]` - Requer Decisão do Usuário

| Diretório | Situação |
|---|---|
| `.agent/` (2068 arquivos) | Skills e workflows para IDEs de AI. **Grande demais para repo principal?** |
| `AGENTS.md` (6KB) | Instruções para agentes AI - manter se relevante |
| `prd_v2.2.md` (51KB) | PRD completo - possivelmente mover para `docs/` |
| `metadata.json` | Verificar se contém dados sensíveis |
| `lighthouserc.json`, `lighthouserc.production.json` | Configuração Lighthouse - manter |
| `nodemon.json` | Configuração dev - manter |

---

## 3. Sugestão de Nova Estrutura

```
life-os/
├── .github/                    # GitHub Actions & templates
│   └── workflows/
├── api/                        # Backend Express
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── tests/
├── docs/                       # Documentação consolidada
│   ├── api/
│   ├── architecture/
│   ├── design-system/
│   └── prd/                    # Mover prd_v2.2.md para cá
├── public/                     # Assets estáticos
├── scripts/                    # Build & utility scripts
├── src/                        # Frontend React
│   ├── app/                    # App shell, providers, routing
│   ├── assets/
│   ├── features/               # Feature-based modules ✅
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── habits/
│   │   ├── tasks/
│   │   ├── finances/
│   │   ├── journal/
│   │   └── ...
│   ├── shared/                 # Shared components, hooks, utils
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   └── test/                   # Test setup & mocks
├── supabase/                   # Database migrations
│   └── migrations/
├── tests/                      # E2E tests (Playwright)
│   └── e2e/
├── .env.example                # Template de variáveis ✨ NOVO
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Mudanças Propostas

1. **Remover da raiz:** Todos os arquivos `*.txt` e `*.log` de debug
2. **Mover `prd_v2.2.md`:** Para `docs/prd/`
3. **Criar `.env.example`:** Com placeholders seguros
4. **Decidir sobre `.agent/`:** Manter separado ou em `.gitignore`
5. **Consolidar locks:** Escolher `package-lock.json` OU `pnpm-lock.yaml`

---

## 4. Conteúdo Sugerido para `.gitignore`

```gitignore
# ===========================
# Dependencies
# ===========================
node_modules/
.pnpm-store/

# ===========================
# Build outputs
# ===========================
dist/
build/
.cache/
.turbo/
storybook-static/

# ===========================
# Environment & Secrets
# ===========================
.env
.env.local
.env.*.local
*.env.local
supabase/.env
supabase/.env.local

# ===========================
# IDE & OS
# ===========================
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
*.swo

# ===========================
# Test outputs
# ===========================
coverage/
test-results/
playwright-report/
screenshots/
testsprite_tests/
*.log

# ===========================
# Debug & Temporary files
# ===========================
*.txt
debug_*.txt
check_*.txt
validation*.log
output.txt
vite.log
testsprite_error.log

# ===========================
# Reports (generated)
# ===========================
reports/
*.report.html
*.report.json

# ===========================
# Vercel & Deploy
# ===========================
.vercel/

# ===========================
# IDE AI Tools (optional - decide per project)
# ===========================
.trae/tmp/
.trae/cache/
.trae/sessions/
.Jules/
.agent/preview.log
.agent/preview.pid
# .agent/                      # ← UNCOMMENT to ignore entire .agent folder

# ===========================
# Storybook
# ===========================
*storybook.log
storybook-static/

# ===========================
# Mock data
# ===========================
api/.mock-data/

# ===========================
# Lock files (choose one)
# ===========================
# Uncomment ONE of these based on your package manager:
# package-lock.json           # If using pnpm
pnpm-lock.yaml                # If using npm
```

---

## 5. Próximos Passos Recomendados

1. **🔴 URGENTE:** Rotacionar TODAS as API keys expostas
2. **Limpar arquivos temporários:** Deletar os 18+ arquivos de debug da raiz
3. **Criar `.env.example`:** Documentar variáveis necessárias com placeholders
4. **Decidir sobre `.agent/`:** Ignorar ou manter no repo
5. **Consolidar package locks:** Remover um dos dois (`pnpm-lock.yaml` ou `package-lock.json`)
6. **Mover documentação dispersa:** Centralizar em `docs/`
7. **Aplicar novo `.gitignore`:** Antes do primeiro commit para GitHub

---

> **Aguardando sua confirmação para prosseguir com a fase de implementação.**
