# Changelog

All notable changes to LifeOS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Unreleased]

### Added
- `SECURITY.md` with security policy, vulnerability reporting, and architecture overview
- `CODE_OF_CONDUCT.md` based on Contributor Covenant v2.1
- `AI_CONTEXT_MAP.md` — navigation hub for AI coding agents
- `GLOSSARY.md` — standardized project terminology
- GitHub issue templates (bug report, feature request) and PR template
- API documentation in `docs/api/` (authentication + MVP workspace endpoints)
- OpenAPI 3.0 spec (`docs/api/openapi.yaml`)
- Architecture Decision Records in `docs/architecture/` (6 ADRs)
- Developer guide in `docs/development/` (7 guides: getting-started, architecture, features, testing, electron, common-tasks)
- YAML frontmatter metadata on all documentation files

### Changed
- `CLAUDE.md` restructured as quick reference (overview + commands), conventions moved to `AGENTS.md`
- `AGENTS.md` expanded with anti-patterns table and quick reference link
- `CONTRIBUTING.md` updated with links to new GitHub templates
- `docs/mvp/implementation-checklist.md` updated with accurate completion status

### Removed
- 9 obsolete documents moved to `docs/archive/` (ARCHITECTURE-FINAL, IMPLEMENTATION_SUMMARY, MVP_DESKTOP_*, PRD v2.2, QA audit)

## [0.3.1] - 2026-04-27

### Added
- Linux tray PNG assets for Electron packaging
- Manual docker acceptance smoke workflow
- Desktop smoke coverage artifacts in CI

### Changed
- Comprehensive codebase cleanup — security hardening, dead code removal, duplicate elimination, architecture improvements
- Simplified dashboard summary contract
- Gitignore refactored, unused AI/UX data files removed

### Fixed
- CI test failures and tasks test bug
- Missing config files flagged by chatgpt-codex bot
- Gemini bot review feedback on PR #81
- Local desktop auth fallback session handling
- Desktop auth optional in electron runtime
- Recovery auth errors preserved on login page
- Electron packaging dependency overrides
- Merge conflicts in finances and health features
- User-scoped create APIs for desktop
- Web auth session in fallback auth flows
- Browser and electron runtime expectation isolation
- Desktop task persistence schema alignment
- Electron smoke harness stabilization

### Test
- Desktop auth and protected flow coverage
- Dashboard placeholder coverage hardened
- Auth and theme seam stabilization

## [0.3.0] - 2026-01-19

### Electron Desktop & Offline First
- **Migração para Electron**: Aplicação agora roda como desktop app nativo usando Electron.
- **SQLite Local**: Todos os dados são armazenados localmente via `better-sqlite3` no processo principal do Electron.
- **Comunicação IPC**: Frontend React comunica com backend local via `window.api` (sem chamadas HTTP REST).
- **Offline First**: Aplicação funciona 100% offline por padrão. Sincronização com Supabase é opcional.
- **Builds Nativos**: Geração de artefatos para Linux (AppImage), Windows (NSIS) e macOS (DMG).
- **Documentação**: Atualizada toda documentação para refletir arquitetura Electron e offline-first.

## [0.2.0] - 2025-12-15

### Estável (MVP sem Mocks)
- **Zero Mocks em Runtime**: Remoção completa de dados "sample", "mock" e "placeholder" de todas as features principais (Finanças, Saúde, Hábitos, Tarefas, Journal, Calendário, Gamificação). O sistema agora depende 100% de APIs reais (Supabase/Node) e exibe *empty states* quando não há dados.
- **Testes de Integração**: Cobertura de integração com MSW implementada para todas as páginas principais, garantindo que o frontend lida corretamente com loading, sucesso e erro sem depender do backend real durante testes.
- **Documentação**: Adicionados `Guia de Testes.md` (estratégia de testes) e `Política de Mocks - Produção e Testes.md`.
- **Qualidade**: Correção de dezenas de erros de lint e tipagem; refatoração de componentes UI (`Button`, inputs) para suportar variantes corretamente.

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

## [0.1.2] - 2025-11-30

- Tema: toggle global com persistência e sincronização de perfil (AppLayout, Sidebar, Settings, Login), `ThemeToggle` reutilizável.
- UX: transições visuais padronizadas (`transition-colors transition-all duration-300`) em layout, sidebar, cards, botões e controles.
- Acessibilidade: labels e `aria-*` em controles de tema e senha; foco visível consistente.
- Métricas: script `npm run lh` gerando relatórios Lighthouse (mobile/desktop) em `./reports` com HTML/JSON.
- Documentação: `reports/README.md` com metas ≥90 e recomendações; `CHANGELOG` atualizado.
- Testes: unitários para `ThemeToggle`; integração auth e persistência de tema validados.
- Tokens: refinados para tema claro (`surface`, sombras e hovers) e utilitários CSS; componente `HeroImage` com lazy, placeholder e `srcset`.

## [0.1.1] - 2025-11-29

- IA: cliente Groq seguro em testes e modo mock (`AI_TEST_MODE`), métricas (tokens, ms), Low-IA respeitado, validações e fallbacks (tags/FOFA/plano/summary), cache com `ai_cache`.
- Rotas: corrigidas IA (`/api/ai/*`), Finanças (`/api/finances/*`), montado `/api/rewards`.
- Testes: rotas AI/Tarefas/Finanças ativadas e passando; hooks `useAI` cobertos; RLS autenticado com admin createUser (Supabase) sem skips.
- Storybook: stories para gráficos (Line/Heatmap) e Dev/Low-IA.
- Supabase: serviços usam memória em testes; mock chain ajustado.
