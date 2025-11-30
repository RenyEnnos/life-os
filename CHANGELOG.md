# Changelog

## [0.1.1] - 2025-11-29
- IA: cliente Groq seguro em testes e modo mock (`AI_TEST_MODE`), métricas (tokens, ms), Low-IA respeitado, validações e fallbacks (tags/FOFA/plano/summary), cache com `ai_cache`.
- Rotas: corrigidas IA (`/api/ai/*`), Finanças (`/api/finances/*`), montado `/api/rewards`.
- Testes: rotas AI/Tarefas/Finanças ativadas e passando; hooks `useAI` cobertos; RLS autenticado com admin createUser (Supabase) sem skips.
- Storybook: stories para gráficos (Line/Heatmap) e Dev/Low-IA.
- Supabase: serviços usam memória em testes; mock chain ajustado.
## [0.1.2] - 2025-11-30
- Tema: toggle global com persistência e sincronização de perfil (AppLayout, Sidebar, Settings, Login), `ThemeToggle` reutilizável.
- UX: transições visuais padronizadas (`transition-colors transition-all duration-300`) em layout, sidebar, cards, botões e controles.
- Acessibilidade: labels e `aria-*` em controles de tema e senha; foco visível consistente.
- Métricas: script `npm run lh` gerando relatórios Lighthouse (mobile/desktop) em `./reports` com HTML/JSON.
- Documentação: `reports/README.md` com metas ≥90 e recomendações; `CHANGELOG` atualizado.
- Testes: unitários para `ThemeToggle`; integração auth e persistência de tema validados.
 - Tokens: refinados para tema claro (`surface`, sombras e hovers) e utilitários CSS; componente `HeroImage` com lazy, placeholder e `srcset`.
