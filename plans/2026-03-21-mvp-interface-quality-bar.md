# LifeOS MVP: Barra de Qualidade de Interface e Rubric de Decisão

Data: 2026-03-21
Owner: Product Strategist
Status: pronto para uso por CEO + Founding Engineer
Issue Paperclip: `AEV-28`

## Decisão de Produto

O MVP não deve aceitar interfaces geradas apenas porque parecem "modernas" ou "bonitas". Uma interface candidata só entra no produto se provar cinco coisas ao mesmo tempo:

1. deixa claro onde o usuário está no loop semanal;
2. reduz a carga de decisão em vez de aumentar leitura e escaneamento;
3. destaca uma ação principal inequívoca por tela;
4. transforma estados do sistema em feedback operacional claro;
5. mantém consistência estrutural suficiente para o usuário prever o que acontece a seguir.

Se uma UI gerada falhar em qualquer um desses cinco pilares, ela deve ser rejeitada ou retrabalhada, mesmo que visualmente pareça mais sofisticada.

## O que está gerando a percepção atual de “UI ruim”

O problema principal não é estética. É produto mal expresso na interface.

### 1. A interface atual descreve o sistema, mas não conduz o usuário

Evidência no MVP:

- `src/features/mvp/pages/MvpWorkspacePage.tsx` abre com cards informativos e uma grade de superfícies, mas não organiza a página em torno de uma próxima decisão dominante.
- A CTA `Open Phase 1` existe, mas compete com vários cards, labels, checklist, constraint copy e links equivalentes.

Impacto:

- o usuário precisa interpretar a interface antes de agir;
- a home do MVP parece uma página de status interno, não uma página de operação.

### 2. Há excesso de contexto simultâneo para um produto que promete foco

Evidência no MVP:

- a home mistura métricas, mapa de superfícies, checklist de fundação, restrição de produto e “immediate next work” na mesma camada hierárquica;
- cada surface page combina formulário operacional com blocos de meta-copy (`focus`, `nextBuild`, navegação entre superfícies e contexto explicativo).

Impacto:

- o produto pede leitura demais para fluxos que deveriam ser conduzidos;
- a experiência parece scaffold/prototype porque expõe estrutura interna demais.

### 3. Os estados de decisão não estão explícitos o suficiente

Evidência no MVP:

- `Today` bloqueia corretamente o acesso sem weekly plan confirmado, mas esse gating é localizado e não vira uma gramática consistente do resto do fluxo;
- labels como `ready` em `src/features/mvp/data.ts` conflitam com checklist e “next build”, o que enfraquece confiança.

Impacto:

- a interface não comunica com precisão se o usuário deve começar, revisar, confirmar, executar ou refletir;
- o sistema parece simultaneamente “pronto” e “inacabado”.

### 4. A linguagem visual não traduz prioridade

Evidência no MVP:

- quase todos os blocos relevantes usam o mesmo tratamento: cards escuros, borda sutil, texto secundário e botões com peso próximo;
- há pouca diferença entre conteúdo primário de tarefa e conteúdo de contexto/documentação.

Impacto:

- a tela parece uma coleção homogênea de caixas;
- falta contraste entre “o que ler”, “o que decidir” e “o que fazer agora”.

### 5. O produto fala como documentação interna, não como ferramenta operacional

Evidência no MVP:

- termos como `surface`, `phase`, `foundation checklist`, `Primary implementation artifacts`, `Immediate next work` e `usable client-side MVP` são úteis para time interno, mas não para usuário final;
- várias telas exibem explicitamente backlog de implementação (`nextBuild`) junto do fluxo.

Impacto:

- o produto transmite protótipo, não convicção;
- qualquer interface gerada que repita esse padrão continuará “parecendo ruim”, mesmo com visual mais refinado.

## Barra de Qualidade de Interface do MVP

Toda interface candidata para o MVP precisa respeitar a barra abaixo.

### 1. Clareza de etapa

Cada tela deve responder em até 5 segundos:

- onde estou no loop;
- por que esta etapa existe;
- o que preciso fazer agora;
- o que acontece depois.

Sinais esperados:

- título orientado à tarefa, não ao artefato;
- subtítulo curto focado em outcome;
- progressão explícita entre etapas;
- estado atual visível sem leitura extensa.

### 2. Uma decisão principal por tela

Cada tela deve ter uma ação dominante inequívoca.

Sinais esperados:

- um CTA primário;
- no máximo uma tarefa principal por viewport inicial;
- conteúdo secundário claramente subordinado ou colapsado;
- ausência de competição entre múltiplos blocos “importantes”.

### 3. Densidade cognitiva controlada

O MVP deve parecer leve mesmo quando o usuário está tomando decisões relevantes.

Sinais esperados:

- blocos agrupados por decisão, não por tipo técnico;
- texto auxiliar curto e escaneável;
- campos reduzidos ao mínimo necessário;
- nada de checklist de projeto, docs links ou backlog técnico no fluxo principal do usuário.

### 4. Feedback operacional forte

O sistema precisa comunicar estado, progresso e consequência.

Sinais esperados:

- estados claros: não iniciado, em progresso, confirmado, concluído, bloqueado;
- confirmação explícita quando uma ação muda o estado do loop;
- métricas ou resumos só quando ajudam a decidir a próxima ação;
- empty states e locked states com instrução objetiva.

### 5. Consistência previsível

Usuários precisam aprender o padrão uma vez e reutilizá-lo em todo o loop.

Sinais esperados:

- mesma estrutura base entre etapas do loop;
- padrões estáveis de CTA, navegação, formulários e estados;
- mesma taxonomia verbal para progresso e status;
- sem mudanças arbitrárias de layout entre telas equivalentes.

### 6. Linguagem de produto, não linguagem de protótipo

Copy de interface deve reforçar confiança e direção.

Sinais esperados:

- remover termos internos como `surface`, `next build`, `implementation artifacts`, `usable client-side MVP`;
- usar linguagem centrada em rotina, planejamento, execução e revisão;
- separar completamente material interno/operacional do time das telas do usuário.

### 7. Distinção visual entre contexto e ação

O layout deve deixar óbvio o que é informação de suporte e o que exige ação.

Sinais esperados:

- ação principal com peso visual dominante;
- contexto em blocos de apoio menores ou progressivamente revelados;
- hierarquia tipográfica e espacial suficiente para evitar “parede de cards”.

## Rubric curto para aceitar ou rejeitar UI gerada

Pontuação por critério:

- `0` = falha clara
- `1` = parcialmente atende
- `2` = atende com confiança

Uma interface candidata só pode ser aprovada se:

- nenhum critério crítico receber `0`;
- pontuação total for `>= 11/14`;
- os dois critérios mais importantes (`clareza de etapa` e `decisão principal`) somarem pelo menos `3/4`.

### Critérios

1. `Clareza de etapa`
Pergunta: em poucos segundos, fica claro onde o usuário está e o que vem depois?

2. `Decisão principal`
Pergunta: existe uma ação dominante óbvia, sem competição visual?

3. `Carga cognitiva`
Pergunta: a tela reduz leitura e interpretação ou exige esforço excessivo?

4. `Feedback de estado`
Pergunta: o sistema mostra claramente progresso, bloqueio, confirmação e consequência?

5. `Consistência estrutural`
Pergunta: a tela parece parte do mesmo produto e do mesmo loop?

6. `Copy de produto`
Pergunta: a linguagem parece de produto pronto e orientado ao usuário, não de protótipo interno?

7. `Separação contexto vs. ação`
Pergunta: fica claro o que é apoio e o que exige ação imediata?

## Regras de veto

Mesmo com boa nota total, rejeitar a candidata se qualquer um ocorrer:

- a primeira viewport não deixa clara a próxima ação;
- existem duas ou mais CTAs competindo como principal;
- a tela expõe backlog técnico ou linguagem interna do time;
- a tela usa decoração visual para mascarar falta de fluxo;
- a home parece dashboard/status page em vez de ponto de entrada operacional;
- o usuário precisa ler múltiplos cards para descobrir por onde começar.

## Como usar esse rubric com UI gerada por IA

### Para CEO

Use o rubric para responder apenas três perguntas:

1. eu entendo o loop em segundos?
2. eu sei o que fazer agora sem pensar demais?
3. isso parece produto com convicção ou mock bonito?

Se qualquer resposta for “não”, a UI não está pronta.

### Para engenharia

Antes de implementar uma candidata:

1. validar a nota no rubric;
2. identificar qual decisão principal a tela precisa suportar;
3. remover elementos que existem só para explicar o produto;
4. separar UI interna do time de UI do design partner;
5. traduzir a candidata em critérios verificáveis de estado, fluxo e copy.

### Para prompts em ferramentas como Google Stitch

Pedir explicitamente:

- uma tela com uma ação principal inequívoca;
- progressão clara entre etapas do loop;
- hierarquia forte entre tarefa primária e contexto secundário;
- copy curta, operacional e centrada no usuário;
- ausência de cards/documentação/status interno desnecessários;
- padrão consistente entre onboarding, weekly review, today e reflection.

Não pedir:

- “make it modern”
- “make it beautiful”
- “AI futuristic dashboard”
- “add rich analytics cards”

Esses pedidos tendem a gerar superfícies visualmente polidas, mas operacionalmente fracas.

## Critérios de Aceitação para fechar esta frente

- existe um rubric curto que CEO e engenharia conseguem aplicar em menos de 5 minutos;
- a barra de qualidade define explicitamente por que a UI atual transmite scaffold/prototype;
- o rubric é independente de ferramenta e pode ser aplicado a Google Stitch ou qualquer outro gerador;
- os critérios distinguem claramente beleza visual de qualidade de produto;
- o memo pode ser usado como base para issues futuras de redesign por etapa do MVP.

## Próximo passo recomendado

Abrir uma execução de produto/UX em duas frentes:

1. redesenhar a home `/mvp` para virar ponto de entrada operacional com uma única CTA dominante;
2. redesenhar as quatro etapas do loop com um template estrutural comum e remoção de copy interna/protótipo.
