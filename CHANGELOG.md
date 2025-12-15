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
## [0.1.3] - 2025-12-15
- Core: `apiClient`, `apiFetch`, `resolveApiUrl` padronizados com cookies, timeout/abort e erros.
- Auth/Perfil: `PATCH /api/auth/profile` com `preferences`/`theme`; `updateThemePreference` persistente.
- Tasks: UI com desativação de ações durante mutações; testes `tasks.api`.
- Calendário: usa `useCalendarEvents` com `loading/error/authUrl/refresh`; teste de integração com MSW.
- Finanças: remove mocks e `NeonChart`; barras minimalistas e empty states; testes unitários e integração.
- Journal & AI: `triggerJournalAnalysis` migra para `apiClient.post`; remove fallbacks visuais; testes unitários.
- Hábitos e Saúde: remove mocks; empty states e desativação de ações durante mutações; testes unitários.
- Gamificação: testes unitários de `rewards.api`; integração MSW para `RewardsPage`.
- Testes: configurado MSW (`vitest.setup.ts`, handlers, server) e alias `@` em `vitest.config.ts`.
- Documentação: adicionadas `Sprint 2/3/4/5` em `.trae/documents`.
- Política de Mocks: mocks são usados exclusivamente em testes automatizados (unit/integration) e proibidos em produção; CI adiciona job `mock-scan` para bloquear padrões de mock fora de testes; Supabase mock isolado para `NODE_ENV='test'` ou `ALLOW_DEV_MOCKS=true`.

## [0.2.0] - 2025-12-15
### Estável (MVP sem Mocks)
- **Zero Mocks em Runtime**: Remoção completa de dados "sample", "mock" e "placeholder" de todas as features principais (Finanças, Saúde, Hábitos, Tarefas, Journal, Calendário, Gamificação). O sistema agora depende 100% de APIs reais (Supabase/Node) e exibe *empty states* quando não há dados.
- **Testes de Integração**: Cobertura de integração com MSW implementada para todas as páginas principais, garantindo que o frontend lida corretamente com loading, sucesso e erro sem depender do backend real durante testes.
- **Documentação**: Adicionados `Guia de Testes.md` (estratégia de testes) e `Política de Mocks - Produção e Testes.md`.
- **Qualidade**: Correção de dezenas de erros de lint e tipagem; refatoração de componentes UI (`Button`, inputs) para suportar variantes corretamente.
