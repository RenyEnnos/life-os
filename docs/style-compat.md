# Compatibilidade de Estilo (Pré-Refatoração → Premium)

## Cores
- Verde neon primário → Accent sofisticado (primary) com saturação moderada
- Fundo escuro sólido → Background escuro elegante com superfícies sutis (surface)
- Bordas neon → Border neutro com hover sutil (sem glow)

## Tipografia
- Mono em títulos → Sans premium; mono apenas em contextos técnicos/dev
- Uppercase constante → Case normal com legibilidade e hierarquia clara

## Espaçamento e Densidade
- Densidade compacta → Espaçamento generoso (space-y/gap) e padding confortável

## Estados e Motion
- Hover com brilho/neon → Transições discretas (duration-200, ease-out), foco visível

## Equivalências
- `text-primary` (neon) → `text-foreground` + `hover:text-primary`
- `bg-primary/10` (neon) → `bg-muted`
- `shadow-[neon]` → `elevate-sm` / `hover:elevate-md`
