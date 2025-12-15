# Guia de Testes e Qualidade

## Visão Geral
Este guia define a estratégia de testes para garantir a estabilidade do MVP sem mocks em produção. Utilizamos uma pirâmide de testes focada em:
1.  **Unitários**: Lógica isolada (hooks, utils, componentes).
2.  **Integração**: Fluxos de página com API simulada (MSW).
3.  **E2E**: Fluxos críticos em ambiente real (Staging).

## Tecnologias
-   **Runner**: Vitest
-   **UI Testing**: React Testing Library
-   **API Mocking**: MSW (Mock Service Worker) - *Apenas para testes!*
-   **E2E**: Playwright

## Estrutura de Testes

### 1. Testes Unitários (`*.test.tsx`, `*.test.ts`)
Focam em funções isoladas, hooks personalizados e componentes de UI complexos.
-   **Localização**: Próximo ao arquivo fonte (`__tests__` ou co-located).
-   **Comando**: `npm run test:unit` (ou `npm test`)
-   **Exemplo**:
    ```tsx
    // useTasks.test.tsx
    it('deve retornar tarefas ordenadas por prioridade', () => { ... })
    ```

### 2. Testes de Integração (`*.int.test.tsx`)
Validam a renderização da página completa e a interação com a API (via MSW). Garantem que o frontend trata loading, error e sucesso corretamente.
-   **Localização**: `src/features/<feature>/__tests__/*.int.test.tsx`
-   **Setup**: Usa `src/test/msw/server.ts` e handlers em `src/test/msw/handlers.ts`.
-   **Comando**: `npm run test:integration`
-   **Exemplo**:
    ```tsx
    // FinancesPage.int.test.tsx
    it('exibe transações vindas do backend', async () => {
       render(<FinancesPage />);
       expect(await screen.findByText('Salário')).toBeInTheDocument();
    });
    ```

### 3. Testes E2E (`e2e/*.spec.ts`)
Simulam um usuário real navegando no sistema em ambiente de Staging.
-   **Localização**: `e2e/` na raiz.
-   **Comando**: `npm run test:e2e`
-   **Pré-requisito**: Servidor de staging rodando (`npm run preview` ou URL externa).

## Mock Service Worker (MSW)
Utilizamos MSW para interceptar chamadas HTTP **apenas durante os testes de integração**.
-   **Handlers**: Definidos em `src/test/msw/handlers.ts`.
-   **Regra**: Os handlers devem refletir o contrato real da API (tipos, status codes).

## Comandos Úteis
| Comando | Descrição |
|---------|-----------|
| `npm test` | Roda todos os testes unitários e de integração. |
| `npm run test:ui` | Abre a interface gráfica do Vitest. |
| `npm run coverage` | Gera relatório de cobertura. |
| `npm run typecheck` | Valida tipos TypeScript em todo o projeto. |

## CI/CD
O pipeline de CI executa:
1.  Lint (`npm run lint`)
2.  Typecheck (`npm run typecheck`)
3.  Unit & Integration Tests (`npm test`)
4.  Mock Scan (garante zero mocks no código fonte)
