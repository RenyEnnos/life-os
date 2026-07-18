# Brief estratégico de produto e posicionamento

Status: ACTIVE_SUPPORTING \
Authority: provisional product decision #88 under recovery mandate #82 \
Audience: product/business; contributor; AI agent \
Owner: repository maintainer \
Last reviewed: 2026-07-18 \
Review by: 2026-10-16 \
Update trigger: research, naming, audience, claim or product-scope decision \
Supersedes: none \
Superseded by: none \
Authorizes implementation: yes, only within the active #82 exception and exact ready issue

## 1. Decisão provisória

Até existir validação com usuários, o produto será tratado como um **loop semanal estreito para design partners convidados**. Ele ajuda uma pessoa a transformar contexto, pendências e restrições em poucas prioridades confirmadas, acompanhar ações diárias e encerrar o ciclo com reflexão.

Esta é uma escolha operacional reversível, não uma verdade de mercado. Ela existe para impedir que a suíte legada, a ambição do nome ou a presença de dependências de IA definam o produto por acidente.

Decisões associadas:

- o loop semanal é o produto atual, não apenas uma demonstração de uma suíte;
- `LifeOS` permanece como codinome técnico provisório até pesquisa de naming, clearance nos mercados-alvo e ratificação do mantenedor;
- IA não integra a promessa central enquanto o loop canônico continuar determinístico;
- resultado humano, não tecnologia, orienta posicionamento e linguagem;
- features legadas não retornam sem evidência de demanda e issue própria;
- não são claims atuais: personal OS, all-in-one, sync/cloud, offline-first, desktop release, analytics madura ou planejamento autônomo por IA.

## 2. Como ler este brief

| Classe | Significado |
|---|---|
| Fato | Comportamento ou artefato observado no repositório, na auditoria #83 ou em fonte externa citada |
| Hipótese | Explicação ou segmento ainda não validado com usuários |
| Escolha provisória | Decisão reversível autorizada para permitir avanço |
| Gate | Evidência necessária para confirmar, ampliar ou substituir a escolha |

## 3. Verdade atual do produto

### 3.1 Comportamento comprovado

O contrato canônico em `docs/mvp/canonical-mvp.md` descreve um loop invite-only:

1. onboarding contextual;
2. revisão semanal;
3. geração e confirmação de plano;
4. execução diária e check-in;
5. reflexão e feedback;
6. visão administrativa interna.

As rotas em `src/config/routes/index.tsx` expõem autenticação, configurações, `/mvp`, onboarding, weekly review, today e reflection, com gate adicional para admin. A UI em `src/features/mvp/pages/MvpSurfacePage.tsx` coleta contexto, objetivos, compromissos, restrições, ganhos, pendências, energia e feedback.

A geração atual em `shared/mvp/plan.ts` é determinística: seleciona entradas do usuário, limita prioridades e produz ações por templates e fallbacks. O endpoint em `api/app.ts` chama esse contrato; não há provedor de LLM no caminho canônico.

O transporte em `src/features/mvp/api/mvp.api.ts` escolhe IPC quando uma bridge Electron existe e HTTP nos demais casos. A #85 decidiu provisoriamente que web/HTTP é canônico e Electron permanece experimental; coexistência de código não cria paridade suportada.

### 3.2 Claims não sustentados

| Claim ou impressão | Evidência da inconsistência | Tratamento |
|---|---|---|
| “Life operating system” | A descrição PWA em `vite.config.ts` e o nome prometem amplitude; as rotas atuais entregam um loop estreito | Não usar como promessa pública |
| Suíte ampla | Doze rotas legadas redirecionam e 21 módulos continuam no código | Não reativar para justificar o nome |
| Planejamento por IA | A geração canônica é determinística; a feature de AI assistant está oculta | Não usar IA como diferenciação atual |
| Produto pronto | A UI mistura `ready` com requisitos de auth, telemetry e seed ainda incompletos | Tratar como protótipo validável, não release |
| Sync/cloud | “Syncing MVP workspace” sugere garantia não demonstrada | Não prometer; #85/#87 excluem essa garantia dos modos suportados |
| Desktop/offline-first | Existe infraestrutura Electron, mas #85 a classifica como experimental e #86 mantém seu smoke advisory | Não prometer sem nova decisão e evidência própria |
| Analytics de resultado | Metas aparecem no código, mas a telemetria produtiva não foi comprovada | Tratar números como targets experimentais |

### 3.3 Artefatos internos apresentados como produto

`src/features/mvp/pages/MvpWorkspacePage.tsx` e `MvpSurfacePage.tsx` exibem termos como `MVP Surfaces`, `Phase`, `Foundation Checklist`, `Immediate next work`, arquivos internos, build steps e readiness. Isso serve à equipe, não ao usuário final.

Escolha provisória: registrar a remoção desse metadiscurso como trabalho posterior de copy/UX, sem fazê-la na #88.

### 3.4 Superfícies legadas que distorcem a narrativa

Tasks, habits, finances, health, journal, calendar, university, projects, focus, gamification, design e AI assistant possuem código, testes ou IPC, mas suas rotas redirecionam. Elas são passivos a classificar, não evidência de um produto all-in-one.

## 4. Alternativas estratégicas

### Opção A — loop semanal para design partners (recomendada)

Promessa: conduzir uma revisão curta e transformar evidências da semana em poucos compromissos revisáveis.

Vantagens:

- corresponde ao caminho implementado e coberto pelo browser E2E canônico; isso não prova deployment compartilhado;
- reduz concorrência direta com suítes e calendários automáticos;
- permite validação pequena e reversível;
- cabe na manutenção de um fundador individual.

Riscos:

- frequência semanal pode reduzir retenção;
- valor pode parecer pequeno sem boa reentrada diária;
- público e disposição a pagar permanecem hipóteses.

Gate: cinco a dez design partners completando ao menos três ciclos, com entrevistas e evidência de decisões melhores ou retomada mais fácil.

### Opção B — ferramenta pessoal do fundador

Promessa: sistema privado para o próprio fundador planejar e refletir.

Vantagens: usuário acessível, feedback rápido, liberdade de nicho.  
Riscos: preferências pessoais podem ser confundidas com mercado; documentação pública e release perdem prioridade.  
Gate: declaração explícita de que não existe intenção de mercado no horizonte avaliado.

### Opção C — personal OS de mercado

Promessa: concentrar planejamento, tarefas, hábitos, finanças, saúde, conhecimento e IA.

Vantagem: visão ampla e familiar.  
Riscos: escopo, manutenção, privacidade e concorrência muito superiores; exigiria reativar ou reconstruir a suíte; o nome continua pouco distintivo.  
Gate: pesquisa de mercado forte, equipe/capacidade compatível e evidência de que a amplitude resolve um problema melhor que ferramentas especializadas.

Escolha provisória: **Opção A**. Opções B e C não serão implementadas por inferência.

## 5. Hipóteses de público priorizadas

### H1 — profissional individual sobrecarregado

Prioridade: alta para teste, confiança baixa.

| Campo | Hipótese |
|---|---|
| Job | Encerrar a semana entendendo o que ocorreu e assumir poucos compromissos realistas para a próxima |
| Dor | Tarefas, notas e compromissos dispersos; replanejamento sem critério; excesso de prioridades |
| Alternativa atual | Papel, notas, calendário, Todoist/Notion ou ritual próprio |
| Gatilho | Fim da semana, semana interrompida ou acúmulo de pendências |
| Frequência | Semanal, com reentrada diária leve |
| Custo de abandono | Baixo no início; aumenta apenas se houver histórico útil e exportável |
| Risco fundador | Alto: o fluxo pode refletir sobretudo a forma de trabalho do fundador |

### H2 — design partner acompanhado

Prioridade: alta para operação inicial, não necessariamente mercado.

| Campo | Hipótese |
|---|---|
| Job | Testar um ritual orientado e fornecer feedback observável |
| Dor | Falta de método consistente e dificuldade de explicar por que o plano falhou |
| Alternativa atual | Sessão com mentor, template ou check-in manual |
| Gatilho | Convite e acompanhamento direto |
| Frequência | Semanal |
| Custo de abandono | Baixo; relação humana pode ser mais valiosa que o software |
| Risco fundador | O acompanhamento manual pode mascarar falhas do produto |

### Papel interno observado — operador de pesquisa

O admin permite acompanhar ativação, planos, eventos e feedback. Esse é um papel operacional observado, não uma hipótese de segmento ou público. Ele não deve dominar a linguagem partner-facing nem ser tratado como mercado.

### Segmentos não sustentados

Estudantes, pessoas com ADHD/autismo, pacientes, equipes, investidores e usuários de finanças/fitness não são públicos atuais. Qualquer claim clínico ou de executive-function support exige co-design, acessibilidade verificável e pesquisa própria.

## 6. Problema central e anti-problemas

Problema central, como hipótese:

> Pessoas chegam ao fim da semana com registros e obrigações dispersos, mas sem um processo curto para interpretar o que ocorreu, fazer trade-offs e assumir poucos compromissos revisáveis.

Anti-problemas — o produto inicial não tenta:

- armazenar toda a vida;
- substituir calendário, task manager, journal ou PKM;
- maximizar tarefas concluídas;
- diagnosticar ou tratar condições de saúde;
- tomar decisões autônomas pelo usuário;
- prever comportamento ou sucesso;
- recompensar streaks e culpa;
- restaurar automaticamente a suíte legada.

## 7. Jobs to be done

### Principal

Quando uma semana termina ou sai do controle, quero revisar evidências do que aconteceu e escolher poucos compromissos realistas, para começar a próxima semana com clareza sobre o que farei, adiarei ou abandonarei.

### Secundários

- retomar após interrupção sem reconstruir todo o sistema;
- registrar bloqueios e energia sem transformar reflexão em avaliação clínica;
- confirmar ou rejeitar sugestões de plano;
- entender por que uma prioridade mudou;
- exportar ou abandonar o produto sem perder o histórico essencial.

## 8. Posicionamento

### Uma frase

Para pessoas que encerram a semana com tarefas e notas dispersas, o produto conduz uma revisão curta e ajuda a assumir poucos compromissos revisáveis para a semana seguinte.

### Versão expandida

O produto não tenta organizar toda a vida nem preencher automaticamente o calendário. Ele conduz um ciclo explícito: reunir contexto, reconhecer o que aconteceu, escolher trade-offs, confirmar um plano curto, acompanhar ações e refletir. Sugestões permanecem revisáveis e as decisões continuam pertencendo ao usuário.

### Claims permitidos antes de validação de mercado

- “Reveja sua semana.”
- “Escolha poucas prioridades.”
- “Confirme o plano antes de seguir.”
- “Registre bloqueios e retome.”

Claims de resultado — “mais foco”, “menos sobrecarga”, “melhores decisões” — são hipóteses a medir, não promessas atuais.

## 9. Princípios e anti-princípios

| Princípio | Anti-princípio |
|---|---|
| Poucas escolhas explícitas | Catálogo crescente de módulos |
| Usuário confirma o plano | Automação opaca decide prioridades |
| Evidência antes de insight | Frases motivacionais sem provenance |
| Reentrada sem culpa | Streaks e punição por semana incompleta |
| Linguagem humana | Metadiscurso de MVP, fases e infraestrutura |
| Reversibilidade e exportação | Lock-in como retenção |
| Privacidade demonstrável | Claim genérico de segurança |
| Escopo validado | Reativação especulativa da suíte |

## 10. Papel recomendado para IA

### Opções comparadas

| Papel | Valor potencial | Risco | Explicabilidade | Privacidade | Custo | Dependência de modelo | Decisão |
|---|---|---|---|---|---|---|---|
| Nenhuma IA no core | Fluxo previsível e barato | Menor diferenciação percebida | Total: regras determinísticas inspecionáveis | Sem envio adicional a provider | Baixo | Nenhuma | Padrão atual |
| IA invisível como infraestrutura | Classificar ou resumir entradas | Uso oculto e surpresa do usuário | Baixa se a transformação não mostrar fonte | Pode enviar contexto sensível sem expectativa clara | Médio e recorrente | Alta, salvo modelo local substituível | Não adotar sem nova decisão de provider/dados |
| Copiloto de planejamento | Sugere trade-offs e formula ações | Usuário pode delegar autoridade demais | Média se cada sugestão citar entradas e critérios | Processa contexto, prioridades e restrições | Médio por ciclo | Média/alta; exigir fallback determinístico | Experimento futuro opt-in |
| Gerador de planos | Reduz esforço de transformar revisão em ações | Plano plausível pode ocultar premissas erradas | Média somente com provenance e diff antes da confirmação | Usa o conjunto mais amplo de dados do ciclo | Médio/alto por geração e retry | Alta para qualidade; core deve sobreviver sem ele | Não separar do copiloto antes de provar valor incremental |
| Facilitador de reflexão | Propõe perguntas ligadas às entradas | Inferências psicológicas indevidas | Média se a pergunta apontar a entrada; baixa para “insights” gerais | Entradas podem ser íntimas | Médio | Média; prompts e provider alteram tom | Pesquisa futura restrita |
| Agente com autonomia limitada | Replaneja dentro de limites pré-confirmados | Pode mudar compromissos sem contexto suficiente | Baixa sem log, escopo e confirmação por ação | Requer permissões e integrações adicionais | Alto | Alta e operacionalmente crítica | Fora do core inicial |

Recomendação: manter o core sem IA. Um experimento futuro pode usar copiloto opt-in somente se:

1. toda sugestão mostrar as entradas que a originaram;
2. o usuário aceitar, editar ou rejeitar;
3. o fluxo continuar funcionando sem modelo;
4. provider, retenção, treinamento, exclusão e custo forem explícitos;
5. nenhuma ação externa ocorrer sem confirmação;
6. exigir nova decisão de provider, payload, consentimento e retenção; #87 mantém transportes externos desabilitados nos modos suportados.

## 11. Categoria e concorrência

### Weekly/daily planning

[Sunsama](https://help.sunsama.com/docs/usage-guides/daily-planning/) conduz planejamento diário e possui um fluxo oficial de [planejamento semanal](https://help.sunsama.com/docs/usage-guides/weekly-objectives/weekly-planning/). [Akiflow](https://product.akiflow.com/en/help/collections/1069791-time-blocking) combina tarefas e time blocking. [Motion](https://www.usemotion.com/features/ai-task-manager) agenda e reprioriza trabalho automaticamente.

Conclusão: “planeje a semana”, “clareza”, objetivos, tarefas e calendário recorrem nos produtos amostrados e oferecem baixa diferenciação neste recorte. O espaço mais defensável é tornar explícita a cadeia **evidência → reflexão → trade-off → compromisso**, inclusive o que foi adiado e por quê.

### Journaling/reflection

[Day One](https://dayoneapp.com/privacy-faqs/) posiciona privacidade e criptografia como fundação do journal. [Reflectly](https://reflectly.online/en/features) combina journaling, insights de IA e privacy-aware design.

Conclusão: prompts, mood e “AI insights” não diferenciam. A reflexão do produto deve ser operacional e rastreável, sem claim terapêutico.

### Executive-function support

[Tiimo](https://www.tiimoapp.com/) oferece planejamento visual, checklists e suporte explícito a executive functioning, com foco em ADHD/autismo.

Conclusão: não usar “para todo cérebro”, ADHD ou neurodivergência sem pesquisa inclusiva. Práticas de acessibilidade cognitiva podem ser adotadas sem claim clínico: poucas escolhas, estimativas editáveis, reentrada e linguagem direta.

### Personal OS/all-in-one

[Notion](https://www.notion.com/en-gb/help/guides/organize-your-everyday-life-with-notion-ai) apresenta um workspace pessoal para rotinas, metas e planejamento com IA; múltiplos produtos homônimos também ocupam o território de dashboard para toda a vida. Exemplos ativos incluem [lifeoshq.com](https://www.lifeoshq.com/), [lifeos-app.com](https://lifeos-app.com/en) e [thelifeos.io](https://www.thelifeos.io/).

Conclusão: “one place”, “one dashboard”, “run your life” e “everything connected” são pouco distintivos e exigem amplitude que o produto não entrega.

## 12. Territórios de marca

### Território 1 — revisão honesta (recomendado)

- Tese: uma semana melhor começa por reconhecer o que realmente aconteceu.
- Promessa: transformar evidências em poucos compromissos revisáveis.
- Personalidade: calma, direta, sóbria e sem julgamento.
- Voz: perguntas concretas; verbos revisar, escolher, confirmar, adiar, retomar.
- Metáforas permitidas: ciclo, sinal, registro, caminho, margem.
- Proibidas: sistema operacional, piloto automático, cérebro externo, controle total.
- Direção visual futura: temporalidade e hierarquia; sem dashboards de vaidade.
- Risco: parecer journal genérico se não houver ligação clara com decisões.

### Território 2 — compromissos realistas

- Tese: planejamento útil limita trabalho e torna trade-offs visíveis.
- Promessa: sair da revisão com poucas decisões que cabem na semana.
- Personalidade: pragmática, firme e respeitosa.
- Voz: linguagem de capacidade e limites, não de performance máxima.
- Metáforas permitidas: orçamento de atenção, margem, carga.
- Proibidas: hustle, otimização total, produtividade sobre-humana.
- Direção visual futura: listas curtas e comparação capacidade/compromisso.
- Risco: soar corporativo ou utilitário demais.

### Território 3 — reentrada sem culpa

- Tese: sistemas falham quando exigem perfeição para voltar a funcionar.
- Promessa: ajudar a retomar depois de uma semana incompleta.
- Personalidade: acolhedora, adulta e não terapêutica.
- Voz: reconhecer, ajustar, retomar.
- Metáforas permitidas: retorno, próximo passo, continuidade.
- Proibidas: streak, culpa, cura, transformação pessoal.
- Direção visual futura: estados incompletos claros e ações de retomada.
- Risco: linguagem vaga de bem-estar ou mística.

## 13. Naming e matriz “LifeOS”

Pesquisa aberta encontrou vários produtos `LifeOS`/`Life OS` funcionalmente próximos e domínios ocupados. Isso cria risco prático de descoberta, SEO e confusão. Não constitui parecer sobre infração, registrabilidade ou titularidade.

A [USPTO](https://www.uspto.gov/trademarks/search/likelihood-confusion) explica que risco de confusão considera semelhança e relação entre bens/serviços. A [WIPO](https://www.wipo.int/en/web/madrid-system/how_to/search/index) recomenda pesquisar marcas existentes e pendentes; a base global não substitui registros nacionais nem aconselhamento especializado.

| Opção | Coerência com MVP | Distintividade | Custo agora | Risco | Decisão provisória |
|---|---:|---:|---:|---:|---|
| Manter como marca pública | Baixa | Baixa | Baixo | Promessa excessiva e confusão | Não |
| Ajustar tagline mantendo marca | Média | Baixa | Médio | Ainda herda “OS” | Somente experimento privado |
| Manter como codinome | Alta | Irrelevante externamente | Baixo | Pode vazar para UI/docs | Sim |
| Substituir após brief e clearance | Potencialmente alta | A pesquisar | Médio | Prematuridade sem entrevistas | Gate futuro |

Critérios de naming futuro:

- compatível com um trabalho estreito, não com uma suíte imaginada;
- pronunciável nos idiomas/mercados escolhidos;
- não depender de `AI`, `OS`, `smart`, `ultimate`, `second brain` ou `copilot`;
- pesquisável e distinguível de produtos adjacentes;
- permitir expansão sem prometer totalidade;
- passar por busca de domínio, lojas, social e clearance jurídico apropriado;
- ser testado por compreensão, lembrança e expectativa, não apenas preferência estética.

## 14. Vocabulário canônico

### Preferir

- weekly review / revisão semanal;
- priorities / prioridades;
- commitments / compromissos;
- today’s actions / ações de hoje;
- blockers / bloqueios;
- defer / adiar;
- confirm / confirmar;
- reflection / reflexão;
- resume / retomar;
- suggestion / sugestão.

Um idioma principal ainda deve ser decidido; a mistura atual de português e inglês não é canônica.

### Evitar ou proibir em linguagem de usuário

- Life Operating System / personal OS;
- ultimate, fusion, smart, second brain;
- AI-powered quando IA não executa o comportamento;
- autopilot, autonomous, optimize your life;
- transform your life, reach your full potential;
- MVP, surface, phase, foundation checklist, readiness;
- immediate next work, implementation artifact, event plumbing;
- “ready” para estados técnicos;
- “private”, “secure”, “offline-first” ou “sync” sem contrato verificável;
- claim clínico ou referência a ADHD/neurodivergência sem pesquisa própria.

## 15. Perguntas para entrevistas

Evitar apresentar o nome ou a solução antes de compreender o processo atual.

1. Conte sobre a última vez em que você encerrou uma semana sentindo que perdeu o controle do plano.
2. O que você consulta para entender o que aconteceu?
3. Como decide o que continua, é adiado ou abandonado?
4. Qual parte desse processo é mais difícil ou evitada?
5. Que ferramenta ou ritual você usa hoje? O que funciona e o que falha?
6. Quanto tempo uma revisão semanal pode levar antes de ser abandonada?
7. O que faz você voltar depois de uma semana incompleta?
8. Que informação seria sensível demais para registrar?
9. Você aceitaria uma sugestão automática? O que precisaria ver para confiar nela?
10. Quando uma ferramenta de planejamento se torna trabalho adicional?
11. Mostre o último plano que realmente foi usado. O que mudou durante a semana?
12. O que perderia se abandonasse sua ferramenta atual hoje?

Teste posterior de protótipo:

- pedir que a pessoa complete um ciclo com dados próprios não sensíveis;
- observar tempo, abandonos, correções e dúvidas;
- perguntar o que acredita que o sistema fará com seus dados;
- testar compreensão da promessa sem usar `LifeOS`;
- comparar “revisão honesta”, “compromissos realistas” e “reentrada sem culpa”.

## 16. Métricas de validação

As metas são experimentais e não claims públicos.

- conclusão de onboarding sem intervenção do fundador;
- conclusão da primeira revisão e confirmação explícita do plano;
- retorno para uma segunda e terceira semana;
- quantidade de prioridades removidas ou adiadas conscientemente;
- tempo até retomar após semana incompleta;
- clareza percebida sobre compromissos, medida antes/depois;
- incidentes de privacidade, surpresa ou interpretação errada da automação;
- dependência de suporte manual para completar o loop.

Não usar tarefas concluídas, streaks ou tempo no app isoladamente como evidência de valor.

## 17. Decisões e gates subsequentes

| Decisão | Escolha provisória | Gate de revisão/ratificação | Responsável | Issue |
|---|---|---|---|---|
| Produto atual | Loop semanal estreito | 3 ciclos com 5–10 design partners e ratificação da direção | Mantenedor | #88/follow-up de validação |
| Público | Profissional individual como hipótese | entrevistas de problema | Mantenedor + pesquisa | nova issue de discovery |
| Nome | `LifeOS` apenas como codinome | entrevistas, clearance e ratificação explícita antes de marca pública | Mantenedor | nova issue de naming |
| IA | Fora do core e do claim | valor incremental, consentimento e fronteira de dados | repository maintainer | nova decisão + experimento próprio |
| Runtime | Não decidido por este brief | contrato de uso e release | Mantenedor/arquitetura | #85 |
| Segurança | Apenas local-dev suportado; nenhum claim de publicação | threat model e evidência de deployment | repository maintainer | #87 validada; gates ativos |
| CI/release | Dois checks web canônicos; não inferir deployment | mapa de gates e smoke | repository maintainer | #86 validada; #100 aplicado |
| Docs/copy | Remover metadiscurso por issue própria | mapa de autoridade | repository maintainer | #89/#131 concluídas; #132 ativo |
| Suíte legada/#68 | Não reativar | evidência de demanda e escopo próprio | Mantenedor | #68 permanece bloqueada |

## 18. Desdobramentos recomendados

1. Pesquisa com design partners: roteiro acima, critérios de recrutamento, consentimento e síntese sem dados pessoais.
2. Clearance e naming: somente após evidência de problema/público; incluir busca profissional nos mercados escolhidos.
3. Copy partner-facing: remover linguagem de engenharia somente por issue própria ready, sem antecipar claims.
4. Política de IA: provider, consentimento, provenance, retenção, exclusão, fallback e custo antes de qualquer experimento.

## 19. Limitações

- Não houve entrevista com usuário nem validação de disposição a pagar.
- Pesquisa competitiva usa claims publicados pelos próprios fornecedores; não prova eficácia.
- A busca por `LifeOS` não é clearance jurídico.
- Nenhum runtime, fluxo de produção, provider de IA ou banco real foi validado nesta decisão.
- A hipótese do profissional individual pode ser apenas uma projeção do fundador.
- A decisão provisória deve ser substituída quando evidência mais forte contradizê-la.

## 20. Fontes externas primárias

- [Sunsama — Daily Planning](https://help.sunsama.com/docs/usage-guides/daily-planning/)
- [Sunsama — Weekly Planning](https://help.sunsama.com/docs/usage-guides/weekly-objectives/weekly-planning/)
- [Motion — AI Task Manager](https://www.usemotion.com/features/ai-task-manager)
- [Akiflow — Time Blocking](https://product.akiflow.com/en/help/collections/1069791-time-blocking)
- [Notion — Organize your everyday life with Notion AI](https://www.notion.com/en-gb/help/guides/organize-your-everyday-life-with-notion-ai)
- [Tiimo — Visual Planner](https://www.tiimoapp.com/)
- [Day One — Privacy and Security](https://dayoneapp.com/privacy-faqs/)
- [Reflectly — Features](https://reflectly.online/en/features)
- [LifeOS HQ](https://www.lifeoshq.com/)
- [LifeOS App](https://lifeos-app.com/en)
- [The LifeOS](https://www.thelifeos.io/)
- [USPTO — Likelihood of confusion](https://www.uspto.gov/trademarks/search/likelihood-confusion)
- [WIPO — Search before filing](https://www.wipo.int/en/web/madrid-system/how_to/search/index)
