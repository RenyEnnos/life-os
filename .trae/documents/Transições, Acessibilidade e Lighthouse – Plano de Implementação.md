## Transições Visuais
- Auditar componentes com mudança de estado e aplicar `transition-colors transition-all duration-300` nos contêineres principais e botões/inputs quando faltarem.
- Alvos e patches previstos:
  - AppLayout header e main (`src/components/layout/AppLayout.tsx`) – já parcialmente aplicado; garantir em `main` e overlay.
  - Sidebar container/links (`src/components/layout/Sidebar.tsx`) – reforçar nas áreas de header, nav e rodapé.
  - Cards e títulos (`src/components/ui/Card.tsx`, uso em Settings/Tasks/Health/…): aplicar transições em `Card`, `CardHeader`, `CardContent`.
  - LoginPage (`src/features/auth/LoginPage.tsx`): inputs, senha toggle e Card raiz.
  - ThemeToggle (`src/components/ui/ThemeToggle.tsx`): botão com transições e container.
  - Charts wrappers (`src/components/charts/*.tsx`): aplicar transições leves nos contêineres (não nos SVGs para evitar flicker).
  - Modais (Onboarding/Health/Tasks): transição no backdrop e container.
- Testar manualmente em desktop/mobile (Chrome/Edge/Firefox) verificando suavidade e consistência.

## Acessibilidade
- Labels e ARIA:
  - Garantir `htmlFor`/`id` em todos inputs de autenticação e configurações; revisar `LoginPage.tsx`.
  - ThemeToggle: `aria-label` e `aria-pressed` atualizados; replicar nos toggles em Settings.
  - Botões de ícone (senha, tema, fechar sidebar): `aria-label` descritivo.
- Foco visual:
  - Padronizar foco com `focus-visible:ring-2 focus-visible:ring-primary` nos componentes `Button` e inputs; revisar `Button.tsx` para consistência.
- Testes de acessibilidade:
  - Adicionar `jest-axe` (ou `vitest-axe`) para validar regras básicas em LoginPage e ThemeToggle.
  - Criar testes que montam componentes e rodam auditoria axe, garantindo ausência de violações críticas.

## Documentação e Métricas
- Adicionar devDependency `lighthouse` ao projeto.
- Criar `reports/README.md` com:
  - Como gerar relatórios (`npm run lh` e `--url` opcional), onde encontrar arquivos.
  - Metas mínimas de 90 para Performance, Acessibilidade, Boas Práticas e SEO.
  - Guia de interpretação (categorias) e recomendações comuns: reduzir JS não usado, melhorar contraste, adicionar meta tags, otimizar imagens.
- Script Lighthouse:
  - Já criado `npm run lh` (scripts/lighthouse.js) – manter suporte a mobile/desktop, HTML e JSON, timestamp, url configurável.

## Testes e Qualidade
- Executar suíte de testes e garantir sucesso após patches.
- Novos testes:
  - ThemeToggle – alterna tema, aplica classe no documento e chama `updateThemePreference` (mock do contexto).
  - Acessibilidade básica – `LoginPage` e `Settings` com `jest-axe` sem violações.
- Changelog:
  - Atualizar `CHANGELOG.md` com seção “Enhancements” (transições, acessibilidade, Lighthouse script, theme global).

## Validação Final
- Manual cross-browser (Chrome/Edge/Firefox) e mobile devtools para transições e foco.
- Rodar `npm run lh` em dev e, opcionalmente, em build de produção (`vite build` + `vite preview`) para métricas mais realistas.

Confirmando, prosseguirei aplicando os patches em UI (transições/ARIA), adicionando lighthouse à devDependency, criando README em `reports/`, adicionando testes e atualizando o changelog.