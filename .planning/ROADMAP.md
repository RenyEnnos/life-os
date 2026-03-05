# Roadmap de Execução - Life OS: Rebirth

## Milestone v1.0 (Concluído)

### 阶段 1: Limpeza e Padronização (The Foundation)
- [x] Centralizar Zod Schemas para todas as entidades (Habit, Task, User, Finance).
- [x] Refatorar Zustand Stores para gerenciar estado local com persistência (middleware persist via IndexedDB).
- [x] Eliminar funções duplicadas nos serviços de API e implementar formatador de erro Zod.

### 阶段 2: Auditoria Funcional e Correção (Functional Integrity)
- [x] Corrigir botões fantasma no Dashboard e Widgets (HealthWidget resgatado).
- [x] Implementar handlers reais para todos os elementos interativos (ActionDispatcher para IA).
- [x] Refinar Habit Doctor para gerar ações estruturadas e limpar importações (Preparação Desktop).
- [x] Garantir persistência e integridade do módulo University.

### 阶段 3: Migração Desktop & Mobile (Universal Scaffolding)
- [x] Configurar boilerplate do Electron e Capacitor (Android) no projeto Vite.
- [x] Implementar comunicação IPC para operações nativas e bridge tipada.
- [x] Criar ícone de sistema (Systray) e notificações nativas.

### 阶段 4: Mecanismo Offline-First (Local Sync)
- [x] Implementar camada de persistência local robusta (SQLite ou IndexedDB).
- [x] Desenvolver lógica de reconciliação de dados (Local vs Supabase).
- [x] Implementar fila de mutações offline.

### 阶段 5: Refinamento e Performance
- [x] Otimização de renderização com Zustand selectors e useShallow.
- [x] Implementação de notificações nativas do sistema operacional.
- [x] Finalização de UI/UX para experiência desktop/mobile nativa.

---

## Milestone v1.1: Limpeza Total e Estabilização

### Phase 6: Code Quality & Types Cleanup
**Goal:** Eliminar todos os erros de linting e tipos "any" residuais para garantir uma compilação 100% estrita.
**Requirements:** QUAL-01, QUAL-02, QUAL-03
**Success criteria:**
1. Comando `npx tsc --noEmit` passa sem nenhum erro.
2. Comando `npm run lint` reporta zero erros e warnings nas pastas críticas.
3. Não existem imports fantasmas ou variáveis não declaradas no projeto.

### Phase 7: Architecture & Warnings Remediation
**Goal:** Organizar estrutura do projeto e corrigir comportamentos nocivos (como dependências erradas em hooks).
**Requirements:** ARCH-01, ARCH-02, ARCH-03
**Success criteria:**
1. Avisos de `exhaustive-deps` zerados, evitando renders infinitos.
2. Componentes não utilizados ou quebrados (se houver) ocultos sob feature flags ou desativados para foco.
3. Menos acoplamento visual e funcional entre features.

### Phase 8: Backend Integrity & Auth
**Goal:** Sincronizar perfeitamente as tipagens entre banco de dados (Supabase) e código local.
**Requirements:** BACK-01, BACK-02
**Success criteria:**
1. Inicialização do Auth sem erros fantasmas ou de sessão assíncrona falhando.
2. Tipagens refletem exatamente as tabelas criadas no banco de dados.