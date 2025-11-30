# Changelog

## [0.1.1] - 2025-11-29
- IA: cliente Groq seguro em testes e modo mock (`AI_TEST_MODE`), métricas (tokens, ms), Low-IA respeitado, validações e fallbacks (tags/FOFA/plano/summary), cache com `ai_cache`.
- Rotas: corrigidas IA (`/api/ai/*`), Finanças (`/api/finances/*`), montado `/api/rewards`.
- Testes: rotas AI/Tarefas/Finanças ativadas e passando; hooks `useAI` cobertos; RLS autenticado com admin createUser (Supabase) sem skips.
- Storybook: stories para gráficos (Line/Heatmap) e Dev/Low-IA.
- Supabase: serviços usam memória em testes; mock chain ajustado.
