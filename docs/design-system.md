# Design System Premium Minimal (mcp)

## Tokens

### Cores
- `--color-background`: base de fundo
- `--color-surface`: superfícies
- `--color-surface-alt`: superfícies alternativas
- `--color-border`: bordas
- `--color-muted`: áreas sutis
- `--color-primary` / `--color-primary-foreground`
- `--color-secondary` / `--color-secondary-foreground`
- `--color-success` `--color-warning` `--color-destructive`
- `--color-text` `--color-text-muted`

Escopo dark e light definidos por classe na raiz (`.dark`, `.light`).

### Tipografia
- Família: `Inter, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif`
- Pesos: regular, medium, semibold, bold
- Escalas: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

### Espaçamento
- xs, sm, md, lg, xl, 2xl

### Raio e Sombra
- Raio: sm, md, lg
- Sombra: elevate-sm, elevate-md, elevate-lg

## Integração Tailwind
- `tailwind.config.js` mapeia cores para variáveis CSS
- `fontFamily.sans` e `fontFamily.mono` definidos

## Motion
- Durações: fast (150ms), normal (200ms), slow (300ms)
- Easing: standard, emphasized, subtle

## Uso
- Preferir variantes de componentes (`primary`, `secondary`, `outline`, `ghost`)
- Utilizar `text-foreground`, `text-mutedForeground`, `bg-surface`, `border-border`
- Aplicar `elevate-…` para sombra discreta

## Componentes Avançados
- Modal: `role="dialog"`, `aria-modal`, foco com `focus-visible` e fechamento via `Esc`
- Tooltip: conteúdo discreto em `bg-surface` com `border-border`
- Tabs: variantes `pill`, `underline`, `segmented`, suporte a ícones e `fullWidth`
- Charts: cores via utilitário `cssVar` em `src/components/charts/theme.ts`, respeitando paleta premium
