# Plan: Correção de Problemas Pendentes - Life OS

## Goal

Corrigir os problemas restantes identificados durante os testes do navegador e debug da aplicação Life OS.

---

## Context

Durante o teste completo do Life OS, foram identificados e corrigidos 3 problemas críticos:

| Issue | Status |
|-------|--------|
| `column transactions.date does not exist` | ✅ Corrigido |
| `/api/budgets` retorna 500 | ✅ Corrigido |
| Backend crash on startup | ✅ Corrigido |

**Restam os seguintes itens para implementar:**

---

## Proposed Changes

### Component 1: Database Schema Sync

> **Prioridade:** P1 - Alta

#### [MODIFY] [001_create_tables.sql](file:///c:/Users/pedro/Documents/life-os/supabase/migrations/001_create_tables.sql)

**Problema:** A coluna na tabela `transactions` é chamada `transaction_date`, mas o código foi escrito esperando `date`.

**Proposta:** Criar uma migration para adicionar um alias ou renomear a coluna para consistência.

```sql
-- Opção A: Adicionar coluna 'date' como alias (view)
-- Opção B: Atualizar código para usar 'transaction_date' (já feito)
```

**Decisão:** Manter `transaction_date` no banco e código (já corrigido). Apenas documentar.

---

### Component 2: Finance Categories Seed

> **Prioridade:** P1 - Alta

#### [NEW] supabase/seed/finance_categories.sql

Criar categorias financeiras padrão para novos usuários.

```sql
-- Categorias de Despesa
INSERT INTO finance_categories (user_id, name, type, icon) VALUES
  (USER_ID, 'Alimentação', 'expense', 'utensils'),
  (USER_ID, 'Transporte', 'expense', 'car'),
  (USER_ID, 'Moradia', 'expense', 'home'),
  (USER_ID, 'Saúde', 'expense', 'heart'),
  (USER_ID, 'Educação', 'expense', 'book'),
  (USER_ID, 'Lazer', 'expense', 'gamepad'),
  (USER_ID, 'Compras', 'expense', 'shopping-bag'),
  (USER_ID, 'Contas', 'expense', 'file-text'),
  (USER_ID, 'Outros', 'expense', 'more-horizontal');

-- Categorias de Receita
INSERT INTO finance_categories (user_id, name, type, icon) VALUES
  (USER_ID, 'Salário', 'income', 'briefcase'),
  (USER_ID, 'Freelance', 'income', 'laptop'),
  (USER_ID, 'Investimentos', 'income', 'trending-up'),
  (USER_ID, 'Outros', 'income', 'plus-circle');
```

#### [MODIFY] api/routes/auth.ts

Adicionar criação automática de categorias padrão após registro de usuário.

---

### Component 3: Onboarding Improvements

> **Prioridade:** P2 - Média

#### [MODIFY] src/features/onboarding/components/OnboardingManager.tsx

1. Adicionar botão "Pular" mais visível
2. Persistir estado de onboarding em `localStorage`
3. Não mostrar onboarding para usuários que já completaram

---

### Component 4: E2E Tests Expansion

> **Prioridade:** P2 - Média

#### [NEW] tests/e2e/auth.spec.ts

```typescript
test('user can register', async ({ page }) => {
  await page.goto('/register')
  // Fill form and submit
  await expect(page).toHaveURL('/')
})

test('user can login', async ({ page }) => {
  await page.goto('/login')
  // Fill form and submit
  await expect(page).toHaveURL('/')
})
```

#### [NEW] tests/e2e/finances.spec.ts

```typescript
test('finances page loads', async ({ page }) => {
  // Login first
  await page.goto('/finances')
  await expect(page.locator('text=Financial Overview')).toBeVisible()
})
```

---

### Component 5: Error Handling

> **Prioridade:** P2 - Média

#### [MODIFY] src/shared/lib/api.ts

Adicionar interceptor global para erros de API com mensagens amigáveis.

---

## Task Breakdown

| # | Task | Priority | Est. Time | Status |
|---|------|----------|-----------|--------|
| 1 | Criar seed de categorias financeiras | P1 | 30min | ✅ |
| 2 | Adicionar criação automática de categorias no registro | P1 | 30min | ✅ |
| 3 | Melhorar fluxo de onboarding | P2 | 1h | ✅ |
| 4 | Expandir testes E2E | P2 | 1h | ✅ |
| 5 | Melhorar error handling | P2 | 30min | ⏳ |
| 6 | Documentar schema do banco | P3 | 30min | ⏳ |

**Total Estimado:** ~4h

---

## Verification Plan

### Automated Tests
- [ ] Rodar `npm run test:e2e` após implementar novos testes
- [ ] Verificar se todos os testes passam

### Manual Verification
1. Registrar novo usuário → Verificar se categorias foram criadas
2. Acessar página de finanças → Verificar dropdown de categorias
3. Completar onboarding → Verificar persistência
4. Forçar erro de API → Verificar mensagem amigável

---

## Agent Assignments

| Task | Agent |
|------|-------|
| Database/Seeds | `database-architect` |
| API Changes | `backend-specialist` |
| Onboarding UI | `frontend-specialist` |
| E2E Tests | `test-engineer` |

---

## Questions Before Proceeding

1. **Categorias financeiras:** Deseja adicionar mais categorias além das sugeridas?
2. **Onboarding:** Prefere remover completamente o onboarding ou apenas torná-lo opcional?
3. **Prioridade:** Qual componente deseja implementar primeiro?

---

## Decision Required

> **IMPORTANT:** Aguardando aprovação do plano antes de iniciar implementação.

Revise as propostas acima e indique:
- ✅ Aprovar e iniciar implementação
- 🔄 Solicitar modificações
- ❓ Esclarecer dúvidas
