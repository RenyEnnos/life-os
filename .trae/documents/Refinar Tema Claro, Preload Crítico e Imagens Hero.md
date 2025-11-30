## Tokens de Tema Claro
- bg-surface (light):
  - Definir cor base (#ffffff), transparência para overlays (bg-surface/50), e sombras padrão (shadow-sm, shadow-md em utilitários Tailwind e classe .surface-shadow forte em CSS).
  - Adicionar variáveis CSS específicas para light: `--surface`, `--surface-shadow`, `--surface-border-hover` em `src/index.css` e garantir overrides utilitários.
- Estados hover:
  - Padronizar transições (`transition-colors transition-all duration-300`) e definir tokens de hover para primário/secondary/border no light (`--color-primary-hover`, `--color-secondary-hover`).
  - Revisar Button/links: manter foco com `focus-visible:ring-2` e ajustar cores em light para contraste ≥ 4.5:1.

## Preload Seletivo
- Fontes customizadas (sem introduzir dependências externas):
  - Preparar suporte com `@font-face { font-display: swap }` e fallbacks; usar `Courier New`/monospace como fallback.
  - Adicionar hooks no `index.html` para `<link rel="preload" as="font" crossorigin href="/assets/fonts/<font>.woff2">` com feature flag (somente se o arquivo existir); documentar como ativar.
  - FOUT/FOIT: `font-display: swap` para evitar FOIT; `preload` minimiza FOUT.
- Imagens hero:
  - Criar componente `HeroImage` com `loading="lazy"`, placeholder blur (`data URL`), `srcset`/`sizes` para breakpoints, e suporte a WebP/AVIF.
  - Documentar uso e recomendações de tamanhos/formatos (WebP/AVIF, fallback JPEG).

## Acessibilidade e Contraste
- Validar contraste light/dark:
  - Ajustar tokens de texto/borda/primário em light para contrastes mínimos (texto 4.5:1; UI 3:1).
  - Garantir tamanho mínimo 44x44px já aplicado a ícones (Button size icon).

## Testes e Regressão Visual
- Criar testes de UI:
  - Snapshot do `ThemeToggle` em ambos temas.
  - Testes do `HeroImage` verificando `srcset`/lazy e placeholder.
  - Axe básico em LoginPage/Settings para garantir ausência de violações críticas.

## Documentação
- Atualizar `reports/README.md` com instruções de preload e hero images.
- Adicionar seção de tokens no `src/theme/index.ts` e doc breve em `CHANGELOG.md`.

## Verificação de Performance
- Rodar `vite build` + `vite preview`.
- Executar `npm run lh` com `LH_URL=http://localhost:4173/` e anexar resultados.
- Corrigir qualquer item < 90 pontos; priorizar contraste e performance de imagens se presentes.

Confirma que eu aplique estas mudanças (tokens light/hover, suporte de preload/hero, testes e docs) agora?