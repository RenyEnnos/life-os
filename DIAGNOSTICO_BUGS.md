# 🔍 DIAGNÓSTICO DE BUGS - Interface "Morta"

**Data:** 2026-02-04  
**Status:** Investigação Completa  
**Severidade:** CRÍTICA

---

## 1. Ponto de Ruptura Identificado

### O Problema Central

O fluxo de dados **para completamente** na camada de comunicação HTTP. As requisições API:

1. **NÃO estão sendo roteadas para o backend correto** - vão para o domínio do frontend ao invés de `localhost:3001`
2. **NÃO incluem tokens de autenticação** - o backend rejeita com 401 Unauthorized

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌─────────────┐
│  Component  │ ──► │    Hook      │ ──► │  API Service  │ ──► │  apiClient  │
│  (onClick)  │     │  (useTasks)  │     │ (tasks.api)   │     │   (http.ts) │
└─────────────┘     └──────────────┘     └───────────────┘     └──────┬──────┘
                                                                      │
                                                                      ▼
                                                               ❌ FALHA AQUI
                                                         URL errada + Sem Auth Token
                                                                      │
                                                                      ▼
                                                               ┌─────────────┐
                                                               │   Backend   │
                                                               │ (port 3001) │
                                                               │  401 Error  │
                                                               └─────────────┘
```

---

## 2. Suspeitos Principais (Confirmados)

| Suspeito | Status | Evidência |
|----------|--------|-----------|
| ❌ Configuração de ENV (URLs incorretas) | **PARCIAL** | `VITE_API_BASE_URL` está definida (.env:10) mas **não é usada** |
| ❌ Bloqueio de CORS | 🔍 Não investigado ainda | Bloqueio pode ocorrer como consequência |
| ✅ Auth Token não sendo enviado | **CONFIRMADO** | Ver seção 3.2 |
| ⚠️ Lógica "Offline First" | **BAIXO RISCO** | `useOfflineMutation.ts` existe mas não é usado por `useTasks.ts` |

---

## 3. Evidências nos Arquivos

### 3.1 API Client NÃO usa `resolveApiUrl()` 

**Arquivo:** [http.ts](file:///c:/Users/pedro/Documents/life-os/src/shared/api/http.ts)

```typescript
// LINHA 78-96: Funções exportadas recebem URL direta sem resolução
export function getJSON<T = unknown>(url: string, headers?: Record<string, string>) {
  return fetchJSON<T>(url, { method: "GET", headers })  // ❌ URL usada diretamente
}

export function postJSON<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>) {
  return fetchJSON<T>(url, { method: "POST", body: data ? JSON.stringify(data) : undefined, headers })
}
```

**Arquivo:** [tasks.api.ts](file:///c:/Users/pedro/Documents/life-os/src/features/tasks/api/tasks.api.ts)

```typescript
// LINHA 5-7: Chamadas usam path relativo sem resolução
getAll: async () => {
    const data = await apiClient.get<Task[]>('/api/tasks');  // ❌ Vira http://frontend-domain/api/tasks
    return data;
},
```

**A função `resolveApiUrl()` existe (linha 116-129) mas só é usada em:**
- `useRealtime.ts` (único lugar correto)

### 3.2 Token de Autenticação NUNCA é Injetado

**Arquivo:** [authToken.ts](file:///c:/Users/pedro/Documents/life-os/src/shared/api/authToken.ts)

```typescript
// LINHA 14-16: getAuthToken existe e funciona
export function getAuthToken(): string | null {
  if (!isStorageAvailable()) return null;
  return localStorage.getItem(TOKEN_KEY);
}
```

**Arquivo:** [AuthProvider.tsx](file:///c:/Users/pedro/Documents/life-os/src/features/auth/contexts/AuthProvider.tsx)

```typescript
// LINHA 45-47: Token é salvo no localStorage após login
if (data?.token) {
  setAuthToken(data.token);
}
```

**MAS:** O `http.ts` **NUNCA** chama `getAuthToken()` para injetar no header:

```typescript
// http.ts LINHA 27-35: Headers não incluem Authorization
const requestOptions: RequestInit = {
  credentials: "include",  // ✅ Tenta enviar cookies
  headers: {
    "Content-Type": "application/json",
    ...(optionHeaders || {}),  // ❌ Nenhum Authorization: Bearer <token>
  },
  // ...
}
```

**Arquivo:** [auth.ts (middleware)](file:///c:/Users/pedro/Documents/life-os/api/middleware/auth.ts)

```typescript
// LINHA 19: Backend espera token de cookie OU header Authorization
const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])

// LINHA 21-22: Retorna 401 se não encontrar
if (!token) {
  return res.status(401).json({ error: 'Access token required' })
}
```

### 3.3 Offline Mutation (Baixo Risco)

**Arquivo:** [useOfflineMutation.ts](file:///c:/Users/pedro/Documents/life-os/src/shared/hooks/useOfflineMutation.ts)

```typescript
// LINHA 60-68: Catch silencia TODOS os erros e retorna mock
} catch {
    addToQueue({
        endpoint: options.endpoint,
        method: options.method,
        payload: variables,
    });
    return Promise.resolve({ offline: true } as unknown as TData);  // ⚠️ Silencia erro real
}
```

**Porém:** O `useTasks.ts` usa `useMutation` padrão, **NÃO** `useOfflineMutation`. Este não é o problema principal.

### 3.4 Testes Automatizados Falhando

**Arquivo:** [.last-run.json](file:///c:/Users/pedro/Documents/life-os/test-results/.last-run.json)

```json
{
  "status": "failed",
  "failedTests": [
    // 25 testes falhando relacionados a auth, dashboard, finances, habits, tasks
  ]
}
```

---

## 4. Plano de Correção (Draft - Fase 2)

### Prioridade CRÍTICA (Resolver Primeiro)

#### 4.1 Modificar `http.ts` para usar `resolveApiUrl()`

```typescript
// Proposta: Modificar todas as funções helper
export function getJSON<T = unknown>(url: string, headers?: Record<string, string>) {
  const resolvedUrl = resolveApiUrl(url);  // ✅ Adicionar
  return fetchJSON<T>(resolvedUrl, { method: "GET", headers })
}
```

#### 4.2 Injetar Auth Token Automaticamente

```typescript
// Proposta: Modificar fetchJSON para incluir token
import { getAuthToken } from './authToken';

// Dentro de fetchJSON, antes da request:
const token = getAuthToken();
const requestOptions: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),  // ✅ Adicionar
    ...(optionHeaders || {}),
  },
  // ...
}
```

### Prioridade MÉDIA (Após fixes críticos)

- [ ] Verificar CORS no backend (se necessário)
- [ ] Revisar `useOfflineMutation.ts` para não silenciar erros de rede reais
- [ ] Adicionar feedback visual de erro no ErrorBoundary (atualmente só loga)

### Prioridade BAIXA

- [ ] Adicionar interceptor global para 401 → auto-logout
- [ ] Implementar retry logic para falhas de rede temporárias

---

## 5. Arquivos a Modificar na Fase 2

| Arquivo | Tipo de Mudança |
|---------|-----------------|
| `src/shared/api/http.ts` | Usar `resolveApiUrl()` em todas funções + injetar token |
| Nenhum outro | A correção no http.ts propaga para todas as features |

---

## 6. Observações Finais

- **A arquitetura está correta** - o problema é uma "desconexão" na implementação do cliente HTTP
- **O padrão de feature folders está sendo seguido** - a correção centralizada no `http.ts` resolverá todas as features
- **Não há problemas de "modo offline"** - as features não usam `useOfflineMutation`
- **Os 25 testes falhando** provavelmente são consequência direta deste bug
