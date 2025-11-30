## Toggle Global no AppLayout e Sidebar
- Criar um componente reutilizável `ThemeToggle` (Sun/Moon) com `aria-label` e `aria-pressed`, usando `useTheme()` e `updateThemePreference()` do `AuthContext`.
- AppLayout: inserir `ThemeToggle` na header mobile ao lado do botão de menu; manter aplicação do tema salvo no `useEffect` inicial.
- Sidebar: adicionar `ThemeToggle` na área inferior, próximo ao botão de logout.
- Persistência: `useTheme` já salva no `localStorage` e aplica na `documentElement`; ao alternar, chamar também `updateThemePreference('light'|'dark')` para sincronizar com backend.
- Transições: garantir classes `transition-colors transition-all duration-300` nos containers afetados (header, sidebar, main) para suavizar a troca.
- Acessibilidade/consistência: estados coerentes em toda a aplicação; ícones alternam conforme tema atual.

## Script Lighthouse (npm run lh)
- Adicionar devDependency `lighthouse`.
- Criar `scripts/lighthouse.js` que:
  - Gera `./reports` se não existir.
  - Executa auditorias para `mobile` e `desktop` usando Lighthouse CLI ou API.
  - Usa timestamp no nome: `reports/lh_<viewport>_<YYYYMMDD-HHMMSS>.{html,json}`.
  - Inclui categorias: performance, accessibility, best-practices, seo.
  - Alvo padrão: `http://localhost:5175/` (aceitar `--url` via argv).
- Adicionar script npm `"lh": "node scripts/lighthouse.js"`.
- Instruções: rodar `npm run dev` e em outro terminal `npm run lh` para gerar relatórios.

## Verificação
- Abrir app em Chrome/Edge/Firefox; alternar tema via AppLayout e Sidebar e confirmar persistência/reload.
- Rodar `npm run lh`; revisar relatórios de `mobile` e `desktop`, ajustar contraste se necessário.

Confirma que eu implemente estas mudanças agora?