# 📋 SPEC TÉCNICA DE ARRUMAÇÃO - Life OS

> **Data:** 2026-02-03  
> **Fase:** 2 - Planejamento  
> **Baseado em:** `DIAGNOSTICO_ARRUMACAO.md`  
> **Objetivo:** Guia passo a passo para execução segura da reestruturação

---

## 1. Protocolo de Segurança (Prioridade Zero)

> [!CAUTION]
> **EXECUTE ESTA SEÇÃO PRIMEIRO.** Nenhuma outra ação deve ocorrer antes da sanitização de credenciais.

### 1.1 Verificar `.gitignore` Antes de Tudo

**Comando de verificação:**
```powershell
Get-Content .gitignore | Select-String "^\.env$"
```

**Resultado esperado:** A linha `.env` deve aparecer. Se não aparecer, adicione imediatamente antes de qualquer commit.

**Verificação adicional - confirmar que `.env` não está tracked:**
```powershell
git ls-files .env
```

**Resultado esperado:** Saída vazia (arquivo não rastreado). Se retornar `.env`, execute:
```powershell
git rm --cached .env
```

---

### 1.2 Criar/Validar `.env.example`

**Status:** ✅ **JÁ CRIADO** (verificado em sessão anterior)

**Localização:** `c:\Users\pedro\Documents\life-os\.env.example`

**Conteúdo necessário (validar que está presente):**

| Variável | Placeholder Seguro |
|----------|-------------------|
| `VITE_SUPABASE_URL` | `your_supabase_url_here` |
| `VITE_SUPABASE_ANON_KEY` | `your_supabase_anon_key_here` |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key_here` |
| `GEMINI_API_KEY` | `your_gemini_api_key_here` |
| `GROQ_API_KEY` | `your_groq_api_key_here` |
| `METEOSOURCE_API_KEY` | `your_meteosource_api_key_here` |
| `COINGECKO_API_KEY` | `your_coingecko_api_key_here` |
| `CURRENCYFREAKS_API_KEY` | `your_currencyfreaks_api_key_here` |
| `NEWS_API_KEY` | `your_news_api_key_here` |
| `UNSPLASH_ACCESS_KEY` | `your_unsplash_access_key_here` |
| `UNSPLASH_SECRET_KEY` | `your_unsplash_secret_key_here` |
| `JWT_SECRET` | `your_jwt_secret_here` |

**Comando de validação:**
```powershell
Get-Content .env.example | Select-String "your_" | Measure-Object
```

**Resultado esperado:** Count >= 12 (todas as variáveis sensíveis têm placeholders)

---

### 1.3 Rotação de Chaves (Ação Manual Obrigatória)

> [!IMPORTANT]
> **ANTES DE QUALQUER PUSH PARA GITHUB**, você DEVE rotacionar as seguintes chaves:

| Serviço | URL do Console |
|---------|---------------|
| Supabase | https://app.supabase.com → Project Settings → API |
| Google Gemini | https://aistudio.google.com/app/apikey |
| Groq | https://console.groq.com/keys |
| Unsplash | https://unsplash.com/oauth/applications |
| NewsAPI | https://newsapi.org/account |
| CoinGecko | https://www.coingecko.com/en/developers/dashboard |
| CurrencyFreaks | https://currencyfreaks.com/dashboard |
| Meteosource | https://www.meteosource.com/account |

**Checklist de rotação:**
- [ ] Regenerar chave no console do provedor
- [ ] Atualizar `.env` local com nova chave
- [ ] Testar aplicação com a nova chave
- [ ] Revogar/deletar chave antiga se possível

---

## 2. Plano de Limpeza (The Purge)

> [!NOTE]
> Os arquivos abaixo são outputs de debugging/validação e podem ser deletados com segurança.

### 2.1 Arquivos de Debug de Verificação (Raiz)

**Comando para deletar todos:**
```powershell
Remove-Item -Path "check_final.txt", "check_out_2.txt", "check_out_3.txt", "check_out_projects.txt", "check_output.txt" -ErrorAction SilentlyContinue
```

**Lista de arquivos:**
| Arquivo | Tamanho | Razão |
|---------|---------|-------|
| `check_final.txt` | 20KB | Output de verificação anterior |
| `check_out_2.txt` | 18KB | Output de verificação anterior |
| `check_out_3.txt` | 17KB | Output de verificação anterior |
| `check_out_projects.txt` | 21KB | Output de verificação anterior |
| `check_output.txt` | 18KB | Output de verificação anterior |

---

### 2.2 Arquivos de Debug Variados (Raiz)

**Comando para deletar todos:**
```powershell
Remove-Item -Path "debug_deltas.txt", "integrity_report.txt", "output.txt", "val_error.txt" -ErrorAction SilentlyContinue
```

**Lista de arquivos:**
| Arquivo | Tamanho | Razão |
|---------|---------|-------|
| `debug_deltas.txt` | 6 bytes | Debug vazio |
| `integrity_report.txt` | 3KB | Relatório de integridade obsoleto |
| `output.txt` | 40 bytes | Output temporário |
| `val_error.txt` | 3KB | Erros de validação obsoletos |

---

### 2.3 Arquivos de Log de Validação (Raiz)

**Comando para deletar todos:**
```powershell
Remove-Item -Path "validation.log", "validation_all.log", "validation_check.log", "validation_check_v2.log", "validation_fix.log", "validation_pass_2.log", "validation_utf8.log", "vite.log", "testsprite_error.log" -ErrorAction SilentlyContinue
```

**Lista de arquivos:**
| Arquivo | Tamanho | Razão |
|---------|---------|-------|
| `validation.log` | 0 bytes | Log vazio |
| `validation_all.log` | 3KB | Log de validação obsoleto |
| `validation_check.log` | 20KB | Log de validação obsoleto |
| `validation_check_v2.log` | 20KB | Log de validação obsoleto |
| `validation_fix.log` | 0 bytes | Log vazio |
| `validation_pass_2.log` | 44 bytes | Log de validação obsoleto |
| `validation_utf8.log` | 0 bytes | Log vazio |
| `vite.log` | 27KB | Log do Vite |
| `testsprite_error.log` | 3KB | Log de erros do TestSprite |

---

### 2.4 Arquivos de Preview/PID do .agent

**Comando para deletar:**
```powershell
Remove-Item -Path ".agent/preview.log", ".agent/preview.pid" -ErrorAction SilentlyContinue
```

---

### 2.5 Resumo de Limpeza - Comando Único

**Para executar toda a limpeza de uma vez:**
```powershell
$filesToDelete = @(
    "check_final.txt",
    "check_out_2.txt", 
    "check_out_3.txt",
    "check_out_projects.txt",
    "check_output.txt",
    "debug_deltas.txt",
    "integrity_report.txt",
    "output.txt",
    "val_error.txt",
    "validation.log",
    "validation_all.log",
    "validation_check.log",
    "validation_check_v2.log",
    "validation_fix.log",
    "validation_pass_2.log",
    "validation_utf8.log",
    "vite.log",
    "testsprite_error.log",
    ".agent/preview.log",
    ".agent/preview.pid"
)

$filesToDelete | ForEach-Object {
    if (Test-Path $_) {
        Remove-Item $_ -Force
        Write-Host "✓ Removido: $_" -ForegroundColor Green
    } else {
        Write-Host "⊘ Não encontrado: $_" -ForegroundColor Yellow
    }
}
```

---

### 2.6 Arquivos para REVISÃO MANUAL

> [!WARNING]
> Estes arquivos precisam de decisão humana antes de deletar.

| Arquivo | Situação | Ação Sugerida |
|---------|----------|---------------|
| `prd_v2.2.md` (51KB) | PRD completo | **MOVER** para `docs/prd/` |
| `AGENTS.md` (6KB) | Instruções AI | **MANTER** se usar agentes AI |
| `metadata.json` | Verificar conteúdo | **REVISAR** se contém dados sensíveis |
| `.agent/` (2068 arquivos) | Skills AI | **DECIDIR**: ignorar via .gitignore ou manter |
| `pnpm-lock.yaml` | Lock duplicado | **DELETAR** se usar npm (package-lock.json) |

---

## 3. Plano de Reestruturação

### 3.1 Movimentação de Arquivos

**Mover PRD para docs:**
```powershell
# Criar pasta se não existir
New-Item -ItemType Directory -Path "docs/prd" -Force

# Mover arquivo
Move-Item -Path "prd_v2.2.md" -Destination "docs/prd/prd_v2.2.md"
```

---

### 3.2 Conteúdo Final do `.gitignore`

**Status:** ✅ **JÁ APLICADO** (verificado em sessão anterior)

**Seções críticas que DEVEM estar presentes:**

1. **Secrets protegidos:**
```gitignore
.env
.env.local
.env.*.local
```

2. **Arquivos de debug ignorados:**
```gitignore
*.txt
*.log
debug_*.txt
check_*.txt
validation*.log
```

3. **Lock file escolhido:**
```gitignore
pnpm-lock.yaml  # Se usando npm
```

4. **Artifacts de teste:**
```gitignore
test-results/
testsprite_tests/
coverage/
```

---

### 3.3 Decisão Pendente: Pasta `.agent/`

**Opções:**

| Opção | Comando | Consequência |
|-------|---------|--------------|
| **A) Ignorar inteira** | Descomentar `.agent/` no .gitignore | Skills não vão para o repo |
| **B) Ignorar parcialmente** | Manter atual com `.agent/preview.*` | Skills vão para repo, logs não |
| **C) Manter tudo** | Não alterar | Repo terá 2000+ arquivos extras |

**Recomendação:** Opção **A** se o repo for só código, Opção **B** se quiser manter skills.

---

## 4. Checklist de Validação (Definition of Done)

> [!IMPORTANT]
> Execute TODOS os testes abaixo após a limpeza para garantir que o projeto não quebrou.

### ✅ Teste 1: Build do Frontend

**Comando:**
```powershell
npm run build
```

**Resultado esperado:**
- Saída com "✓ built in X.XXs"
- Pasta `dist/` criada com arquivos

**Critério de sucesso:** Exit code 0, sem erros TypeScript

---

### ✅ Teste 2: Dev Server Funcional

**Comando:**
```powershell
npm run dev
```

**Resultado esperado:**
- Servidor inicia em `http://localhost:5173`
- Sem erros no console

**Critério de sucesso:** Página carrega no navegador

---

### ✅ Teste 3: Verificação de Vazamento de Secrets

**Comando:**
```powershell
git status --porcelain | Where-Object { $_ -match "\.env$" }
```

**Resultado esperado:** Saída vazia (nenhum .env no staging)

**Verificação adicional:**
```powershell
git diff --cached --name-only | Where-Object { $_ -match "\.env" }
```

**Resultado esperado:** Saída vazia

---

### ✅ Teste 4: Lint/TypeScript Check

**Comando:**
```powershell
npm run lint
```

**Resultado esperado:** 0 erros, 0 warnings (ou apenas warnings conhecidos)

---

### ✅ Teste 5: Testes Unitários

**Comando:**
```powershell
npm run test
```

**Resultado esperado:** Todos os testes passam

---

## 5. Sequência de Execução Recomendada

```
┌─────────────────────────────────────────────────────────────┐
│  FASE 3 - EXECUÇÃO (Ordem Estrita)                          │
├─────────────────────────────────────────────────────────────┤
│  1. [SEGURANÇA] Verificar .gitignore contém .env            │
│  2. [SEGURANÇA] Confirmar git ls-files .env vazio           │
│  3. [SEGURANÇA] Validar .env.example tem placeholders       │
│  4. [LIMPEZA] Executar script de remoção de arquivos        │
│  5. [ESTRUTURA] Mover prd_v2.2.md para docs/prd/            │
│  6. [DECISÃO] Escolher opção para .agent/                   │
│  7. [VALIDAÇÃO] Rodar npm run build                         │
│  8. [VALIDAÇÃO] Rodar npm run dev - verificar funcionamento │
│  9. [VALIDAÇÃO] Rodar git status - confirmar sem secrets    │
│ 10. [COMMIT] git add . && git commit -m "chore: cleanup"    │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Notas Finais

> [!TIP]
> **Após a execução completa**, considere rodar um scan de secrets com:
> ```powershell
> npx @secretlint/secretlint --secretlintrc .secretlintrc.json "**/*"
> ```
> (Requer instalação: `npm install -D @secretlint/secretlint`)

**Documento pronto para execução. Aguardando confirmação para Fase 3.**
