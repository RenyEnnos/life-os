# Fase 17: Erradicar Mocks (Context & University)

**Objetivo**: Substituir dados estáticos por integrações reais com as APIs de Contexto (Clima, Mercado, Notícias) e validar o fluxo de dados da Universidade.

## 📋 Tarefas

### 1. Integração de Contexto (Synapse)
- [ ] Criar `src/features/dashboard/hooks/useSynapseContext.ts` para consumir `/api/context/synapse-briefing`.
- [ ] Atualizar `src/features/dashboard/components/Zone3_Context.tsx` para exibir Clima e Mercado reais.
- [ ] Adicionar estados de Skeleton Loading para os cards de contexto.

### 2. Auditoria e Correção de University
- [ ] Verificar `src/features/university/components/UniversityWidget.tsx` por dados estáticos.
- [ ] Garantir que o Dashboard exiba as matérias reais do Supabase.
- [ ] Criar script de semente (seed) para popular University se o banco estiver vazio.

### 3. Habit Doctor Realization
- [ ] Conectar o botão "Why am I failing?" no componente de detalhes do hábito ao serviço de IA.
- [ ] Validar o prompt enviado ao Groq para análise de padrões de falha.

## 🧪 Critérios de Sucesso
1. Dashboard exibe a temperatura real (conforme IP/Coordenadas).
2. Card de Mercado exibe preços atuais de BTC/ETH.
3. Seção universitária lista matérias reais cadastradas no banco.
4. Habit Doctor retorna uma análise baseada no histórico real do usuário.

---
*Data de Início: 2026-03-04*
*Status: Iniciando implementação do Hook de Contexto*
