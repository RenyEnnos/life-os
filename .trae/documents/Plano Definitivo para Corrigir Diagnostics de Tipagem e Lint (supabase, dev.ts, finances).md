## 1. Identificação Precisa
- Erro: "Variable 'supabase' implicitly has type 'any'" em múltiplos arquivos (middleware, repositories, routes e services).
  - Arquivos: api/middleware/auth.ts (l3, l38), api/repositories/factory.ts (l1, l40, l45, l50, l55), api/routes/auth.ts (l8, l29, l44, l108, l193, l226), api/routes/dev.ts (l3, l11–14, l22, l28), api/routes/export.ts (l3, l19, l30), api/routes/finances.ts (l4, l17), api/services/* (vários pontos listados), api/tests/… (vitest globals faltando).
- Erro: parâmetros implicitamente `any` em api/routes/dev.ts: variáveis de reduce/filter (`a`, `b`, `l`).
- Erro: tipo de `req.query` incompatível com `getPagination` em api/routes/finances.ts (l15).
- Erro: diretiva `@ts-expect-error` não utilizada em api/routes/export.ts (l4).
- Erros de testes: faltam globais Vitest (`describe`, `it`, `expect`) em api/tests/routes.auth.integration.test.ts.

## 2. Causa Raiz
- `supabase` exportado sem tipo estático: no modo teste, o mock não corresponde a `SupabaseClient`, fazendo o compilador inferir `any` e propagando aos usos.
- `getPagination` espera `Record<string, string | string[] | undefined>`, mas Express fornece `ParsedQs` (lib `qs`).
- Funções de agregação em dev.ts usam parâmetros não tipados.
- `@ts-expect-error` sem efeito porque a linha seguinte não gera erro — deve ser removida.
- Arquivos de teste não importam globais do Vitest explicitamente.

## 3. Implementação da Solução
- Tipagem do `supabase` (definitivo):
  - Em `api/lib/supabase.ts`, importar `SupabaseClient` e declarar `export const supabase: SupabaseClient`.
  - No modo teste, manter mock em memória e fazer cast seguro: `const mock = { … } as unknown as SupabaseClient` (mantém testes offline e elimina implicit any).
  - Propagação automática resolve todos usos em middleware, repositories, routes e services.
- Ajustes em dev.ts:
  - Anotar os parâmetros de reduce/filter como `number` e os itens como `{ success: boolean; response_time_ms?: number }` ou tipo explícito da consulta.
  - Já havia melhorias parciais; concluir tipagem dos lambdas restantes.
- Compatibilizar `getPagination`:
  - Importar `ParsedQs` de `qs` e alterar assinatura para aceitar `ParsedQs | Record<string, string | string[] | undefined>`.
  - No call site (api/routes/finances.ts), passar `req.query` diretamente sem cast.
- Remover diretiva `@ts-expect-error` em `api/routes/export.ts` e manter import normal de `Parser` (ou comentar a razão se necessário).
- Testes Vitest:
  - Adicionar `import { describe, it, expect } from 'vitest'` em `api/tests/routes.auth.integration.test.ts`.

## 4. Validação
- Executar `npm run lint` e garantir 0 erros.
- Executar `npm run test`; confirmar passagem de todas as suites (backend e frontend) e que os logs "GROQ_API_KEY is not set" são informativos.
- Revisar manualmente uma rota crítica (auth, finances) com chamadas básicas via teste já existente.

## 5. Prevenção
- Adicionar import explícito dos globais Vitest em todos arquivos de teste backend (padrão de projeto).
- Atualizar documentação de estilo: seção "Tipagem do supabase em modo teste" e diretriz para não usar `any`/`unknown` sem necessidade.
- Configurar hook pre-commit (husky) com: `eslint .`, `tsc --noEmit`, `vitest --run --passWithNoTests`.

## Entregáveis
- Tipagem estável de `supabase` sem implicit any.
- `dev.ts` com parâmetros tipados.
- `getPagination` compatível com `req.query`.
- Remoção da diretiva `@ts-expect-error` inválida.
- Testes passam e linter sem erros.

Confirma para aplicar as mudanças e validar? 