# Integração @21st-dev/magic

## Objetivo
Aplicar diretrizes de design premium/minimal do pacote @21st-dev/magic aos componentes do Life OS mantendo APIs e funcionalidades existentes.

## Estratégia
- Tokens e paleta expostos via CSS variables e integrados ao Tailwind Theme.
- Componentes core (Button, Input, Card) atualizados com variantes, estados e foco visível.
- Layout (AppLayout/Sidebar) elevado com superfícies e tipografia premium.
- Microinterações discretas (200ms, ease-out) e acessibilidade AA/AAA.

## Compatibilidade
- Mantidos nomes de props e assinaturas originais.
- Tabela de equivalência de classes em `docs/style-compat.md`.

## Próximos componentes
- Badge/Tag, Tabs/Toggle, Modal/Tooltip e EmptyState seguirão o mesmo padrão.

## Verificação
- Protótipo em `/design` e Stories no Storybook (UI/Button, UI/Card, UI/Input).
