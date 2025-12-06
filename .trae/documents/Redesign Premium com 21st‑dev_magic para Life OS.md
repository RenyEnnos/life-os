## Objetivos
- Corrigir problemas estéticos atuais mantendo harmonia com elementos originais pré-refatoração.
- Aplicar o pacote **@21st-dev/magic** corretamente, usando seu sistema de design (tokens, componentes, diretrizes).
- Entregar uma interface premium, exclusiva, com detalhes refinados, excelente legibilidade e coerência em todos os componentes sem quebrar funcionalidades.

## Auditoria e Diretrizes de Compatibilidade
- Mapear os elementos originais (cores, tipografia, densidade, espaçamentos, ícones) usados antes da última refatoração.
- Definir o que permanece (estrutura de rotas, layout Sidebar, padrões de estado, props dos componentes) e o que evolui (paleta, tipografia, superfícies, sombras e motion).
- Criar tabela de equivalência entre classes utilitárias antigas e novos tokens (evita regressões).

## Integração @21st-dev/magic
- Instalar e configurar **@21st-dev/magic** (tokens, componentes base, ícones e utilitários), seguindo a documentação oficial.
- Usar o builder do pacote para gerar componentes premium base (Button, Input, Card, Badge, Tabs, Toggle, Modal, Tooltip) com variantes.
- Aplicar o refiner do pacote para elevar componentes existentes mantendo suas assinaturas e acessibilidade.

## Tokens e Paleta Elegante
- Criar tokens temáticos (dark/light) com paleta sofisticada e harmônica:
  - Background/surface/border/muted em tons neutros elegantes.
  - Accents primário/ secundário com saturação moderada; estados (success/warning/destructive).
  - Texto/ texto-muted com contraste AA/AAA.
- Expor tokens via CSS variables e integrar com Tailwind Theme.
- Documentar em “Design Tokens” com exemplos de uso e do/ don’t.

## Tipografia e Hierarquia
- Definir stack tipográfica premium (sans de alta legibilidade; mono apenas onde necessário).
- Hierarquia: Display, H1–H4, Lead, Body, Caption com espaçamentos verticais consistentes.
- Regras de legibilidade: tamanho mínimo, line-height, contraste, truncamento e uso de `text-muted` para textos auxiliares.

## Componentes-Core
- Refatorar componentes-chave preservando comportamento:
  - **Button**: variantes (primary/secondary/outline/ghost/destructive), estados (loading/disabled) e foco visível.
  - **Input/TextArea**: foco com ring, erros/avisos, placeholders consistentes, densidade confortável.
  - **Card**: superfícies com sombra discreta (elevate-*), cabeçalhos/ações.
  - **Badge/Tag/EmptyState/PageTitle**: alinhados à nova tipografia e paleta.
- Garantir coerência de props (não quebrar APIs) e remover estilos ad-hoc.

## Layout e Navegação
- Elevar **AppLayout** e **Sidebar** mantendo a estrutura e funcionalidade.
- Aplicar superfícies translúcidas sutis, espaçamento generoso e agrupamentos claros.
- Responsividade: grid/stack adaptáveis (breakpoints md/lg), touch-targets adequados.

## Motion e Microinterações
- Transições curtas e discretas (200–300ms, ease-out/standard), sem animações chamativas.
- Foco/mouse states coerentes, skeletons onde necessário, feedbacks elegantes.

## Acessibilidade
- Foco visível, contraste AA/AAA, estados com ícones + texto.
- Navegação por teclado, roles/aria consistentes nos componentes.

## Protótipo e Storybook
- Página “Design System” com seções de tipografia, paleta, componentes e estados.
- Stories no Storybook para cada componente/variante + testes de acessibilidade (addon a11y).

## Validação e QA
- Verificar páginas principais (Dashboard, Tasks, Habits, Journal, Rewards) para regressões visuais e funcionais.
- Testes: vitest para componentes, smoke e snapshot visuais onde fizer sentido.
- Checklist: legibilidade, contraste, alinhamentos, estados de foco/erro/desabilitado.

## Entregáveis
- Documentação: `docs/design-system.md` (tokens/uso), `docs/style-guide.md` (princípios/diretrizes).
- Biblioteca de UI refatorada com 21st‑dev/magic e tokens novos.
- Protótipo interativo (página do design system) e Stories no Storybook.

## Riscos e Mitigações
- Rupturas de estilo em features específicas: manter compat layers e tabela de equivalência.
- Contraste inadequado em cenários edge: auditoria AA/AAA e ajustes de tokens.

## Critérios de Aceite
- Coerência visual e tipográfica em todos os componentes.
- Integração correta de @21st-dev/magic conforme diretrizes.
- Sem perda de funcionalidade; responsividade e acessibilidade mantidas ou melhoradas.
- Protótipo e docs completos com exemplos e tokens.

Confirma que posso iniciar a execução conforme o plano?