# LifeOS Wave 2: Mapa de Acoplamento para Deleção de Legado

Data: 2026-03-20
Owner: Product Strategist
Status: pronto para execução por engenharia
Issue Paperclip: `AEV-25`

## Decisão de Produto

A ordem correta da segunda onda de limpeza é:

1. cortar primeiro os pontos de entrada para superfícies fora do MVP;
2. remover depois os módulos órfãos de modal e dashboard que ficarem sem chamadores;
3. só então apagar features inteiras ainda conectadas ao shell legado.

Não devemos começar deletando features completas como `tasks`, `habits`, `journal` ou `projects` enquanto `routes`, `Synapse`, `dashboard` e modais ainda apontam para elas. Isso aumenta risco de quebra invisível e espalha o cleanup em vez de estreitar o boundary.

## Resumo Executivo

- O shell principal ainda lazy-loada superfícies fora do MVP em `src/config/routes/index.tsx`.
- O `Synapse` continua oferecendo navegação direta para `/tasks` e `/calendar`, além de existir uma biblioteca paralela de comandos legados em `src/shared/lib/synapse/commands.ts`.
- O cluster de dashboard agrega dados e widgets de `tasks`, `habits`, `finances`, `health`, `ai-assistant` e `university`.
- O cluster de modais (`uiStore`, `GlobalModalOrchestrator`, `actionDispatcher`) mantém vivos fluxos de criação rápida para task/project/habit/journal.
- Há ativos já prontos para deleção imediata porque não possuem referência ativa no app principal.

## Mapa de Dependências

### Cluster A: Shell de rotas ainda mantém o suite legado respirando

Arquivos âncora:

- `src/config/routes/index.tsx`
- `src/config/routes/access.ts`
- `src/app/App.tsx`

Evidência:

- `src/config/routes/index.tsx` ainda define lazy routes para `dashboard`, `habits`, `tasks`, `calendar`, `journal`, `health`, `finances`, `projects`, `university`, `ai-assistant`, `focus`, `gamification`, `settings` e `design`.
- `src/config/routes/access.ts` só redireciona uma parte das superfícies legadas via `HIDDEN_MVP_ROUTES`; `tasks` e `habits` continuam acessíveis diretamente.
- `src/app/App.tsx` monta `Synapse` globalmente, o que mantém atalhos para rotas não canônicas mesmo quando a navegação principal já foi reduzida.

Decisão:

- `tasks` e `habits` são os próximos candidatos a sair do shell principal.
- O runtime deve convergir para `mvp`, `settings` e, opcionalmente, `/mvp/admin` interno.

Aceitação:

- Nenhuma rota fora do boundary canônico do MVP é lazy-loaded no shell autenticado.
- `DEFAULT_AUTHENTICATED_ROUTE` continua apontando para `/mvp`.
- Rotas legadas restantes redirecionam para `/mvp` ou deixam de existir.

### Cluster B: Synapse ainda é um gateway para o produto antigo

Arquivos âncora:

- `src/shared/ui/synapse/Synapse.tsx`
- `src/shared/lib/synapse/commands.ts`
- `src/shared/stores/uiStore.ts`

Evidência:

- `src/shared/ui/synapse/Synapse.tsx` ainda navega para `/tasks` e `/calendar`.
- `src/shared/lib/synapse/commands.ts` referencia `/tasks`, `/projects`, `/habits`, `/finances`, `/journal` e `/ai-assistant`, além de abrir modais `action`, `mission`, `ritual`, `journal` e `search`.
- `rg` mostra que `commands.ts` não é usado pelo `Synapse` atual, mas continua como surface enganosa pronta para ser reativada por acidente.
- `uiStore` persiste a taxonomia de modais antigos (`action`, `mission`, `ritual`, `journal`, `search`).

Decisão:

- Tratar `Synapse.tsx` e `commands.ts` como dois subclusters diferentes:
  - `Synapse.tsx`: refactor curto antes de deleção parcial;
  - `commands.ts`: deleção provável após confirmar não uso.

Aceitação:

- O `Synapse` só expõe comandos do MVP canônico.
- Nenhum comando ativo navega para superfícies removidas.
- `commands.ts`, `dynamicCommands.ts`, `synapseStore.ts` e tipos correlatos são apagados ou reduzidos ao novo recorte.

### Cluster C: Dashboard é o principal nó de acoplamento transversal

Arquivos âncora:

- `src/features/dashboard/pages/IndexPage.tsx`
- `src/features/dashboard/hooks/useDashboardData.ts`
- `src/features/dashboard/widgets/*`
- `src/features/dashboard/components/AgoraSection.tsx`

Evidência:

- `IndexPage.tsx` renderiza `HabitWidget`, `TaskWidget`, `HealthWidget`, `SynapseWidget` e `UniversityWidget`.
- `useDashboardData.ts` depende de `tasksApi`, `habitsApi` e `financesApi`.
- `SynapseWidget.tsx` consome `aiApi.getSuggestions()`.
- `AgoraSection.tsx` depende ao mesmo tempo de `useDashboardData()` e de `ai-assistant`.
- Há referências adicionais de dashboard para `journal`, `gamification`, `health` e `university`.

Decisão:

- Não deletar features downstream antes de encerrar ou remover o dashboard legado.
- O dashboard inteiro deve ser tratado como um cluster de “refactor-before-delete” ou “delete-as-a-unit”.

Aceitação:

- Ou o dashboard sai do produto, ou é reduzido a um shell MVP sem dependências em `tasks`, `habits`, `finances`, `health`, `university`, `journal`, `gamification` e `ai-assistant`.
- Nenhum hook de dashboard faz fan-out para features fora do boundary.

### Cluster D: Modais globais mantêm fluxos antigos de criação e edição

Arquivos âncora:

- `src/shared/components/GlobalModalOrchestrator.tsx`
- `src/shared/stores/uiStore.ts`
- `src/features/dashboard/lib/actionDispatcher.ts`
- `src/features/habits/components/HabitDoctor.tsx`

Evidência:

- `GlobalModalOrchestrator.tsx` acopla `journal`, `tasks`, `projects` e `habits`.
- `actionDispatcher.ts` ainda executa `HABIT_LOG`, `TASK_COMPLETE` e `OPEN_MODAL`.
- `HabitDoctor.tsx` ainda chama `actionDispatcher`.
- `rg` não mostra nenhum uso ativo de `GlobalModalOrchestrator` no app root, o que o coloca perto de deleção segura, mas `uiStore` e `actionDispatcher` ainda têm referências ativas.

Decisão:

- `GlobalModalOrchestrator.tsx` pode entrar na fila de deleção assim que engenharia confirmar ausência de montagem indireta.
- `uiStore` e `actionDispatcher` precisam de cleanup coordenado com `HabitDoctor` e com o novo escopo do `Synapse`.

Aceitação:

- Não existe mais fluxo global de modal para entidades fora do MVP.
- `HabitDoctor` deixa de depender de dispatcher legado ou sai junto com a superfície de hábitos.

## Classificação de Risco

### Deleção imediata

- `src/shared/components/GlobalModalOrchestrator.tsx`
  - Motivo: sem importação ativa encontrada no app root.
- `src/shared/lib/synapse/commands.ts`
  - Motivo: sem uso ativo encontrado; hoje funciona como biblioteca morta de comandos legados.
- `src/shared/lib/synapse/dynamicCommands.ts`
  - Motivo: sem uso ativo encontrado.
- `src/shared/stores/synapseStore.ts`
  - Motivo: sem uso ativo além de re-export.

### Refactor-before-delete

- `src/shared/ui/synapse/Synapse.tsx`
- `src/config/routes/index.tsx`
- `src/features/dashboard/**`
- `src/shared/stores/uiStore.ts`
- `src/features/dashboard/lib/actionDispatcher.ts`

### Alto risco

- `src/features/tasks/**`
- `src/features/habits/**`
- `src/features/journal/**`
- `src/features/projects/**`
- `src/features/finances/**`
- `src/features/health/**`
- `src/features/university/**`
- `src/features/ai-assistant/**`

Motivo: todos ainda aparecem como dependências downstream de shell, dashboard, Synapse ou modais.

## Ordem Recomendada de Execução

1. Remover atalhos e lazy routes do shell principal para superfícies fora do MVP.
2. Podar `Synapse` ativo para o recorte MVP e apagar bibliotecas mortas de comandos.
3. Eliminar `GlobalModalOrchestrator` e reduzir `uiStore` ao que sobrar de fato no produto.
4. Desligar o dashboard legado como cluster único.
5. Só depois apagar features completas agora sem chamadores.

## Breakdown em Issues de Engenharia

### Issue 1: Fechar pontos de entrada do shell legado

Objetivo:

- remover lazy imports e routes fora do MVP;
- redirecionar qualquer deep link legado restante.

Aceitação:

- `src/config/routes/index.tsx` carrega apenas superfícies canônicas;
- build continua estável;
- smoke tests do fluxo `/mvp` seguem verdes.

### Issue 2: Reescrever o Synapse para o boundary atual

Objetivo:

- trocar navegação e comandos antigos por ações estritamente MVP;
- apagar `commands.ts`, `dynamicCommands.ts` e store sem uso.

Aceitação:

- nenhum comando navega para rotas legadas;
- cobertura atualizada para a paleta de comando.

### Issue 3: Remover cluster de modais globais legados

Objetivo:

- deletar `GlobalModalOrchestrator`;
- simplificar `uiStore`;
- remover dependências do dispatcher legado.

Aceitação:

- nenhum fluxo do app referencia modais `action`, `mission`, `ritual`, `journal` ou `search` fora do novo escopo aprovado.

### Issue 4: Desativar dashboard legado e liberar deleção em cascata

Objetivo:

- retirar dashboard antigo do runtime;
- eliminar widgets e hooks agregadores;
- desbloquear deleção das features downstream.

Aceitação:

- nenhuma importação de `dashboard` para módulos fora do MVP permanece;
- a codebase deixa de depender de APIs de `tasks`, `habits`, `finances`, `health`, `university` e `ai-assistant` apenas para sustentar a home antiga.

## Recomendação Final

O produto não precisa de mais uma “lista de candidatos”. Ele precisa de uma sequência rígida de corte de acoplamento. O maior erro aqui seria tentar apagar features finais primeiro. O caminho seguro e rápido é fechar entrada, remover orquestradores, desligar dashboard, e só então executar a deleção em cascata.
