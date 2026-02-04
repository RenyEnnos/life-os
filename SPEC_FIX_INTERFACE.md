# 📋 SPEC_FIX_INTERFACE — Correção da Camada HTTP

**Data:** 2026-02-04  
**Status:** Aguardando Aprovação  
**Referência:** [DIAGNOSTICO_BUGS.md](file:///c:/Users/pedro/Documents/life-os/DIAGNOSTICO_BUGS.md)

---

## 1. Resumo do Problema

A interface da aplicação está "morta" porque **todas as requisições API falham sistematicamente**. A investigação confirmou dois defeitos na camada de transporte:

| Defeito | Descrição | Consequência |
|---------|-----------|--------------|
| **URL Incorreta** | As funções `getJSON`, `postJSON`, etc. recebem paths relativos (ex: `/api/tasks`) e os usam diretamente no `fetch()`, resultando em requisições para o domínio do **frontend** em vez do backend. | Request vai para `http://frontend-domain/api/tasks` → 404 ou CORS |
| **Sem Auth Token** | O header `Authorization: Bearer <token>` nunca é adicionado às requisições, mesmo quando o usuário está logado. | Backend retorna `401 Unauthorized` |

> [!IMPORTANT]
> A função `resolveApiUrl()` **existe** no arquivo `http.ts` (linhas 116-129) mas **não é chamada** por nenhuma das funções helper (`getJSON`, `postJSON`, etc.). O token existe em `localStorage` via `getAuthToken()` mas **não é injetado** nos headers.

---

## 2. Alterações de Código Necessárias (Low Level Design)

### 2.1 Arquivo Alvo

**Único arquivo a modificar:** [src/shared/api/http.ts](file:///c:/Users/pedro/Documents/life-os/src/shared/api/http.ts)

### 2.2 Requisito 1: Resolução de URL

**Problema Atual (linhas 78-96):**
```typescript
export function getJSON<T = unknown>(url: string, headers?: Record<string, string>) {
  return fetchJSON<T>(url, { method: "GET", headers })  // ❌ URL usada diretamente
}
```

**Solução:** Chamar `resolveApiUrl()` em **cada função helper** para garantir que paths relativos sejam convertidos para URLs absolutas do backend.

**Código Proposto:**
```typescript
export function getJSON<T = unknown>(url: string, headers?: Record<string, string>) {
  const resolvedUrl = resolveApiUrl(url);  // ✅ Resolve para URL do backend
  return fetchJSON<T>(resolvedUrl, { method: "GET", headers })
}

export function postJSON<T = unknown>(url: string, data?: unknown, headers?: Record<string, string>) {
  const resolvedUrl = resolveApiUrl(url);  // ✅ Resolve para URL do backend
  return fetchJSON<T>(resolvedUrl, { method: "POST", body: data ? JSON.stringify(data) : undefined, headers })
}

// Aplicar o mesmo padrão em: patchJSON, putJSON, delJSON
```

### 2.3 Requisito 2: Injeção do Token de Autenticação

**Problema Atual (linhas 27-35):**
```typescript
const requestOptions: RequestInit = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    ...(optionHeaders || {}),  // ❌ Sem Authorization header
  },
  // ...
}
```

**Solução:** Importar `getAuthToken` de `./authToken.ts` e injetar o token no header `Authorization` **se disponível**.

**Código Proposto:**
```typescript
import { getAuthToken } from './authToken';

export async function fetchJSON<T = unknown>(url: string, options: FetchOptions = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000)

  const { headers: optionHeaders, timeoutMs: _timeoutMs, ...restOptions } = options
  void _timeoutMs

  // ✅ Obter token de autenticação
  const token = getAuthToken();

  const requestOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),  // ✅ Injetar token se existir
      ...(optionHeaders || {}),  // User headers ainda podem sobrescrever se necessário
    },
    signal: controller.signal,
    ...restOptions,
  }

  // ... resto da função permanece igual
}
```

### 2.4 Ordem dos Headers (Importante)

A ordem de merge dos headers deve ser:

1. `Content-Type: application/json` (padrão)
2. `Authorization: Bearer <token>` (se token existir)
3. `...(optionHeaders || {})` (headers customizados podem sobrescrever os anteriores)

Isso permite que chamadas específicas sobrescrevam o comportamento padrão se necessário.

---

## 3. Análise de Impacto (Risk Assessment)

### 3.1 Se `getAuthToken()` retornar `null`

| Cenário | Comportamento | OK? |
|---------|---------------|-----|
| Usuário não logado | Nenhum header `Authorization` é enviado | ✅ Correto — rotas públicas funcionam |
| `localStorage` indisponível | `getAuthToken()` retorna `null` silenciosamente | ✅ Aceitável — fallback para sem token |
| Token expirado/inválido | Backend retorna 401 | ✅ Esperado — UI deve tratar |

> [!NOTE]
> O app **deve continuar funcionando** mesmo sem token. Rotas públicas (ex: `/api/health`) não requerem autenticação. Rotas protegidas retornarão 401 e a UI deve tratar esse caso (já existe `AuthProvider` para isso).

### 3.2 Impacto no Mock-Scan / Modo Offline

| Componente | Afetado? | Justificativa |
|------------|----------|---------------|
| `useOfflineMutation.ts` | ❌ Não | Não é usado pelas features atuais (`useTasks.ts` usa `useMutation` padrão) |
| Mock-scan | ❌ Não | O scanner usa APIs próprias, não passa por `http.ts` |
| Testes unitários | ⚠️ Possivelmente | Se testes mockam `fetch`, podem precisar de atualização |

### 3.3 Possíveis Efeitos Colaterais

- **CORS:** Se `VITE_API_BASE_URL` estiver apontando para domínio diferente, o backend deve estar configurado para aceitar CORS. Verificar cabeçalhos `Access-Control-*` no backend.
- **Cookies vs Token:** O código mantém `credentials: "include"`, então cookies continuarão sendo enviados. O backend aceita ambos (`req.cookies?.token || req.headers.authorization`).

---

## 4. Plano de Validação (Definition of Done)

### 4.1 Teste Manual — Verificação de Network Requests

Após aplicar o fix, execute os seguintes passos:

#### Passo 1: Preparação
1. Garantir que o backend está rodando em `localhost:3001`
2. Garantir que `.env` contém `VITE_API_BASE_URL=http://localhost:3001`
3. Reiniciar o dev server (`npm run dev`)

#### Passo 2: Verificar Requisição de Login
1. Abrir o browser em `http://localhost:5173`
2. Abrir **DevTools > Network** (F12 → aba Network)
3. Filtrar por "Fetch/XHR"
4. Tentar fazer login com credenciais válidas
5. **Verificar na requisição de login:**
   - ✅ Request URL começa com `http://localhost:3001/api/auth/...`
   - ✅ Request Headers **não** contém `Authorization` (ainda não logou)

#### Passo 3: Verificar Requisição Autenticada
1. Após login bem-sucedido, navegar para Dashboard
2. Observar as requisições de dados (ex: `/api/tasks`, `/api/habits`)
3. **Verificar em cada requisição:**
   - ✅ Request URL começa com `http://localhost:3001/api/...`
   - ✅ Request Headers contém `Authorization: Bearer <token>`
4. **Verificar no Response:**
   - ✅ Status `200 OK` (não mais 401 ou 404)
   - ✅ Response body contém dados reais

#### Passo 4: Verificar Interface
1. Confirmar que a lista de tasks/habits é exibida na UI
2. Confirmar que ações de CRUD funcionam (criar, editar, deletar)

### 4.2 Critérios de Sucesso

| Critério | Validação |
|----------|-----------|
| URL correta | Request URL inicia com valor de `VITE_API_BASE_URL` |
| Token presente | Header `Authorization: Bearer ...` existe em requisições pós-login |
| Dados retornados | Response status `2xx` com payload JSON válido |
| UI funcional | Listas populadas, ações de CRUD funcionando |

---

## 5. Resumo das Mudanças

```diff
# src/shared/api/http.ts

+ import { getAuthToken } from './authToken';

  export async function fetchJSON<T = unknown>(url: string, options: FetchOptions = {}): Promise<T> {
    // ...
+   const token = getAuthToken();
    
    const requestOptions: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
+       ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(optionHeaders || {}),
      },
      // ...
    }
  }

  export function getJSON<T = unknown>(url: string, headers?: Record<string, string>) {
+   const resolvedUrl = resolveApiUrl(url);
-   return fetchJSON<T>(url, { method: "GET", headers })
+   return fetchJSON<T>(resolvedUrl, { method: "GET", headers })
  }

  // Repetir para: postJSON, patchJSON, putJSON, delJSON
```

---

## 6. Próximos Passos

1. ✅ **Aprovação deste documento** — Você, como Tech Lead, valida o plano
2. ⏳ **Fase 3: Implementação** — Aplicar as mudanças em `http.ts`
3. ⏳ **Fase 4: Validação** — Executar o plano de teste manual
4. ⏳ **Fase 5: Cleanup** — Verificar se testes automatizados voltam a passar
