# Fix Required for Test Issues

## AuthContext.test.tsx - Corrections

### Issue 1: Spy capturando argumentos extras do React Query

**Location:** Lines 80-91

**Problem:**
```typescript
// Spy recebe argumentos extras que não existem na chamada original
expect(authApi.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
// Mas spy captura: { email, password, client: QueryClient {}, meta: undefined, mutationKey: undefined }
```

**Root Cause:**
O hook `useAuth` usa `authApi.login` que é envolvido por `useMutation` do React Query. O React Query adiciona propriedades como `client`, `meta`, `mutationKey` à chamada da função.

**Fix:**
Ajustar o spy para ignorar as propriedades do React Query ou mockar `authApi.login` sem o wrapper do React Query.

**Option 1 - Fixar expectativa (RECOMENDADO):**
```typescript
// Usar toHaveBeenCalledWith() para verificar apenas os argumentos que nos importam
expect(authApi.login).toHaveBeenCalledWith(
  expect.objectContaining({ email: 'test@example.com', password: 'password' })
);
```

**Option 2 - Mockar sem React Query wrapper:**
```typescript
// No test, mockar authApi diretamente sem wrapper do useMutation
import { vi } from 'vitest';
import { authApi } from '../../api/auth.api';

describe('AuthContext', () => {
  beforeEach(() => {
    vi.mock('../../api/auth.api', () => ({
      authApi: {
        verify: vi.fn(),
        login: vi.fn()
      }
    }));
  });

  it('handles regular login flow', async () => {
    const mockUser = { id: '2', email: 'login@example.com' } as unknown as User;
    // Mockar sem wrapper do useMutation
    (authApi.login as any).mockResolvedValue({ user: mockUser });
    
    renderWithProviders(<TestComponent />);
    
    const loginButton = screen.getByText('Login');
    await act(async () => {
      loginButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('login@example.com');
    });

    // Agora verificar apenas os argumentos que passamos
    expect((authApi.login as any)).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
  });
});
```

---

### Issue 2: Email não aparece na tela

**Location:** Lines 60-67

**Problem:**
```typescript
// Espera: test@example.com
// Recebe: No User
```

**Root Cause:**
O mock `verify` foi configurado, mas a promise não foi resolvida antes do componente ser renderizado. Ou o componente não atualizou o estado do usuário.

**Fix:**
Adicionar `await waitFor(() => expect(screen.getByTestId('user-email')).toBeInTheDocument());` antes de verificar o texto. Ou garantir que o mock foi chamado com sucesso.

```typescript
it('verifies session on mount', async () => {
  const mockUser = { id: '1', email: 'test@example.com' } as unknown as User;
  mockedAuthApi.verify.mockResolvedValue(mockUser);

  renderWithProviders(<TestComponent />);

  // Esperar o elemento aparecer
  await waitFor(() => {
    expect(screen.getByTestId('user-email')).toBeInTheDocument();
  });

  // Agora verificar o texto
  expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  expect(authApi.verify).toHaveBeenCalled();
});
```

---

## http.test.ts - Corrections

### Issue 3: Mensagem de erro incompleta no mock

**Location:** Lines 31-39

**Problem:**
```typescript
// mockFetch retorna apenas {body: "oops"} sem statusText, headers
expect(fetchJSON("/api/fail")).rejects.toThrow(/500 Internal Server Error: oops/);
// Mas o fetchJSON tenta formatar: `${status} Internal Server Error: ${statusText}`
```

**Root Cause:**
A função `mockFetch` não retorna todas as propriedades necessárias (`statusText`, `headers`) para que `fetchJSON` possa formatar a mensagem corretamente.

**Fix:**
Atualizar `mockFetch` para retornar todas as propriedades:

```typescript
function mockFetch(response: { status?: number; statusText?: string; headers?: Headers; body?: unknown }) {
  return global.fetch = vi.fn(async (_url: string, init?: RequestInit) => {
    const { status = 200, statusText = "OK", headers = new Headers({ "Content-Type": "application/json" }), body } = response
    
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText,
      headers,
      json: async () => (typeof body === "string" ? body : JSON.stringify(body)),
      text: async () => (typeof body === "string" ? body : JSON.stringify(body))
    } as Response;
  });
}
```

---

### Issue 4: URL base incorreta no teste

**Location:** Lines 69-76

**Problem:**
```typescript
// http.ts linha 16: const API_BASE = 'http://localhost:5174/api';
// Teste linha 70: expect(abs).toBe("http://localhost:5174/api/x")
// Mas resolveApiUrl() retorna: http://localhost:3001/api/x
```

**Root Cause:**
O arquivo `http.ts` define `API_BASE = 'http://localhost:5174/api'` mas a função `resolveApiUrl` adiciona `http://localhost:3001` sem consultar a variável de ambiente.

**Fix:**
Atualizar `resolveApiUrl` para usar `API_BASE` ou remover a hardcode da função:

**Option 1 - Usar API_BASE:**
```typescript
// http.ts
import dotenv from 'dotenv';

dotenv.config(); // Carregar variáveis de ambiente

const API_BASE = process.env.VITE_SUPABASE_API_BASE || 'http://localhost:5174/api';

export function resolveApiUrl(path: string) {
  return `${API_BASE}${path}`;
}
```

**Option 2 - Atualizar teste para usar a URL correta:**
```typescript
it("resolveApiUrl builds absolute URL", () => {
  const abs = resolveApiUrl("/api/x");
  expect(abs).toBe("http://localhost:5174/api/x");
});
```

**Option 3 - Mockar window.location:**
```typescript
it("resolveApiUrl builds absolute URL", () => {
  // Mockar window.location
  global.window = { location: { origin: "http://localhost:5174" } };
  
  const abs = resolveApiUrl("/api/x");
  expect(abs).toBe("http://localhost:5174/api/x");
});
```

---

## Resumo

| Teste | Problema | Complexidade | Tempo para Fixar |
|---------|-----------|-------------|-----------------|
| AuthContext - Spy extras | Média | 10 min |
| AuthContext - Email não aparece | Baixa | 5 min |
| http - Mensagem incompleta | Baixa | 10 min |
| http - URL base incorreta | Baixa | 5 min |
| **Total** | **30 min** |

---

## Recomendação de Implementação

1. **Priorize Issue 1 (Spy extras)** - Use `expect.objectContaining()` ou mock sem wrapper do useMutation
2. **Priorize Issue 2 (Email não aparece)** - Adicionar `waitFor` para garantir que o elemento existe antes de verificar o texto
3. **Corrija Issue 3 e 4 juntos** - Ambos estão relacionados a configuração de URL
4. **Execute todos os testes após as correções** - `npm run test`

---

**PRONTO PARA IMPLEMENTAÇÃO**
