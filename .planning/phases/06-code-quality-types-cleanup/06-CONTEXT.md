# Phase 6: Code Quality & Types Cleanup - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning
**Source:** discuss-phase

<domain>
## Phase Boundary

O objetivo desta fase é eliminar todos os erros de linting e tipos "any" residuais para garantir uma compilação 100% estrita, assegurando a integridade do TypeScript e limpeza de código (imports/variáveis não utilizadas).

</domain>

<decisions>
## Implementation Decisions

### Linter & TS Exceptions
- **Tolerância Zero**: Nenhuma exceção de linting (`eslint-disable`) ou TypeScript (`@ts-ignore`, `@ts-expect-error`) é permitida. Tudo deve ser adequadamente tipado e resolvido.

### Claude's Discretion (Baseado em Boas Práticas/Skills)
- **Third-party 'Any' Types:** O tratamento de bibliotecas sem tipagem (criação de `.d.ts` local ou encapsulamento) seguirá as melhores práticas de TypeScript.
- **Complex Type Inference (Database):** A decisão entre usar tipos gerados pelo Supabase vs inferência de schemas Zod (`z.infer`) seguirá o padrão arquitetural de "Single Source of Truth" que for mais robusto para a base atual.
- **Critical Folders Scope:** A definição exata das áreas alvo do "Zero Warnings/Errors" (ex: `src/`, `api/`) seguirá o padrão ouro de estabilidade para produção.

</decisions>

<specifics>
## Specific Ideas

- O comando `npx tsc --noEmit` deve ser executado e passar sem absolutamente nenhum erro.
- O comando `npm run lint` deve reportar 0 erros e 0 warnings.
- É estritamente necessário remover qualquer variável ou importação abandonada no código ("código fantasma").

</specifics>

<deferred>
## Deferred Ideas

None — Scope remains restricted to the established roadmap goals.

</deferred>

---

*Phase: 06-code-quality-types-cleanup*
*Context gathered: 2026-03-04 via discuss-phase*