## Entendimento do Manifesto
- Adotar fundo global `#050505` e hierarquia de superfícies com vidro fosco (blur) e bordas como fonte de luz.
- Usar `border-white/[0.08]` (hover `/[0.15]`), tipografia Inter com pesos leves, e eliminar brilhos neon fortes.
- Accent limitado: `#308ce8` aplicado com parcimônia (≈5%).
- Padronizar radius, sombras profundas e rastreamento conforme diretrizes.

## Levantamento no Código
- Tailwind: `tailwind.config.js` com `darkMode: "class"`, tokens/cores via CSS vars, plugins (`tailwindcss-animate`, `@tailwindcss/forms`, container-queries).
- CSS global: `src/index.css` com tokens (`--background`, `--surface`, etc.), utilitários de vidro e animações.
- UI compartilhada: `src/shared/ui` inclui `Button.tsx`, `Input.tsx`, `Card.tsx`, `BentoCard.tsx` e pasta `premium` com `Particles`, `NeonGradientCard`, `BorderBeam`, etc.
- Layout global: `AppLayout.tsx` usa `Particles` e glows; Finanças usa `NeonCharts`.

## Fase 1 — Fundação (Tailwind & Tokens)
- Atualizar `tailwind.config.js`:
  - Adicionar `colors.oled: "#050505"` e `colors.glass: "rgba(24,24,27,0.3)"`.
  - Definir `fontFamily.sans` para Inter (fallbacks do sistema) e `fontFamily.display` para títulos.
  - Criar utilitários: `border-white/8`, `border-white/15`, `backdrop-blur-xl/2xl`, `shadow-2xl shadow-black/80` via `extend`.
  - Manter `darkMode: "class"` e globs de conteúdo.
- Limpar `src/index.css`:
  - Garantir `html { background: #050505; }`.
  - Remover estilos globais que conflitam com dark e neon (glows intensos, gradients saturados).
  - Consolidar utilitários `glass-card`, `glass-panel` para seguir o padrão de bordas e blur.
- Validação: build Tailwind, inspecionar classes geradas e contraste de texto.

## Fase 2 — Componentes Atômicos (Shared UI)
- `Button`:
  - Remover variantes 3D/Neon.
  - Criar variantes:
    - Primary: fundo `#308ce8` ou branco, texto preto/branco, brilho suave.
    - Ghost: transparente com `border-white/[0.08]`, hover vidro (`bg-zinc-900/40`).
- `Input`:
  - "Glass Input": `bg-white/5`, `border-white/10`, `focus:ring-1` com accent azul.
- `Sidebar` (se aplicável):
  - Trocar de `bg-zinc-900` sólido para glass fosco (`backdrop-blur-2xl`) com borda direita fina (`border-white/[0.05]`).
- `Card` e `BentoCard`:
  - Padronizar para:
    - `group relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/30 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:bg-zinc-900/40`.
- Aderência tipográfica: Inter, `font-light/medium`, `tracking-tighter` em headings.

## Fase 3 — Refactor das Features (Camada Visual)
- Dashboard:
  - Unificar bento em `GlassCard` único; remover partículas/neon de fundo.
- Tasks:
  - "Lista Executiva": linhas finas, checkboxes customizados, estados hover/active com `bg-zinc-800/50`.
- Finances:
  - "Fintech Black": números `tabular-nums`, gráficos minimalistas sem glow neon; substituir `NeonCharts` por tema discreto com gradiente sutil e opacidade baixa.
- Projects:
  - Galeria com capas de gradiente abstrato (branco→cinza/azul sutil), sem arco-íris.
- Profile:
  - Unificar gamification + user info em "Identity Card" vidro.
- Preservar lógica: não alterar hooks (`useTasks`, `useAuth`) nem chamadas Supabase.

## Fase 4 — Polimento & Performance
- Remover libs de animação pesadas não utilizadas.
- Adicionar transições suaves com `framer-motion` (`layoutId`) apenas onde necessário.
- Acessibilidade: garantir contraste texto cinza sobre preto; revisar foco/teclado.

## Remoções/Deprecações
- Deprecar: `NeonGradientCard`, `Meteors`/`Particles` em fundos de dashboard, bordas grossas coloridas, gradientes arco-íris.
- Remover uso global de `Particles` em `AppLayout` e glows intensos.

## Padrão de Glass
- Todo card segue o padrão informado (classe única), com sombras profundas e borda luminosa sutil.

## Entregáveis por Fase
- Fase 1: novo `tailwind.config.js` completo + `index.css` higienizado.
- Fase 2: `Button`, `Input`, `Sidebar` (se existir), `Card`, `BentoCard` atualizados.
- Fase 3: páginas/features com camada visual OLED Minimalist aplicada.
- Fase 4: otimizações e acessibilidade validadas.

## Pronto para Iniciar
- Entendimento confirmado. Ao aprovar, começo pela Fase 1: analisarei seu `tailwind.config.js` atual e proponho o arquivo novo completo com cores OLED e extensões necessárias, seguido de ajustes em `index.css`. 