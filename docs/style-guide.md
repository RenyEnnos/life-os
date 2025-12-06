# Guia de Estilo

## Princípios
- Minimalista, premium, funcional
- Hierarquia tipográfica clara
- Espaçamento generoso e consistente
- Paleta sofisticada com contrastes sutis
- Transições suaves e discretas

## Tipografia
- Títulos: `font-semibold`, `tracking-tight`, cores `text-foreground`
- Corpo: `text-base`, `text-mutedForeground` para textos auxiliares
- Evitar uppercase desnecessário; usar `font-sans`

## Espaçamento
- Estruturas em `space-y-*` e `gap-*`
- Containers usam `container` com padding padrão

## Componentes
- Botões: variantes `primary`, `secondary`, `outline`, `ghost`
- Inputs: borda `border-border`, foco com `focus:ring-primary`
- Cards: `bg-surface`, `border-border`, sombras `elevate-*`
- Modal: diálogo acessível com `aria` e transições curtas
- Tooltip: texto auxiliar com contraste sutil
- Tabs: escolha variante conforme contexto (underline para navegação, segmented para filtros)
- Charts: grid/axis/tooltip com tokens; linhas/barras usam `primary/secondary`

## Responsividade
- Grades `grid-cols-*` com breakpoints `md`, `lg`
- Tipografia permanece legível em todas as larguras
- Tabs `segmented` podem usar `fullWidth` para distribuição equilibrada

## Motion
- Duração padrão `duration-200`, `ease-out`
- Usar `transition-colors` e `transition-shadow`

## Acessibilidade
- Foco visível (`focus-visible`) e contraste adequado
- Ícones com `aria-hidden` quando decorativos
