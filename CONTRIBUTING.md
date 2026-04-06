# Guia de Contribuição

Obrigado por considerar contribuir para o Life OS! 🎉

## Visão Geral do Projeto

O Life OS é um **aplicativo desktop Electron offline-first** para produtividade e gerenciamento pessoal. Todos os dados são armazenados localmente via SQLite, com sincronização opcional com Supabase.

## Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor crie uma issue incluindo:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (OS, versão do Electron, etc.)

### Sugerindo Melhorias

Para sugerir novas funcionalidades:

1. Verifique se já não existe uma issue similar
2. Crie uma issue descrevendo:
   - Problema que resolve
   - Solução proposta
   - Alternativas consideradas
   - Impacto esperado

### Pull Requests

1. **Fork** o repositório
2. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/minha-feature
   ```
3. **Faça commits** semânticos:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   ```
4. **Push** para a branch:
   ```bash
   git push origin feature/minha-feature
   ```
5. **Abra um Pull Request**

## Padrões de Código

### Commits Semânticos

Usamos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação (sem mudança de código)
- `refactor:` Refatoração de código
- `test:` Testes
- `chore:` Tarefas de manutenção

Exemplos:
```
feat: adiciona filtro por data no dashboard
fix: corrige cálculo do Life Score
docs: atualiza README com arquitetura Electron
refactor: migra comunicação de HTTP para IPC
```

### Estilo TypeScript

- Use **TypeScript** em todo código novo
- Evite `any`, prefira tipos explícitos
- Use interfaces para objetos complexos
- Documente funções públicas com JSDoc

```typescript
/**
 * Calcula o Life Score baseado em métricas do usuário
 * @param userId - ID do usuário
 * @returns Objeto com score e tendência
 */
async function calculateLifeScore(userId: string): Promise<LifeScore> {
  // implementação
}
```

### Estilo React

- Use **function components** com hooks
- Prefira **arrow functions**
- Extraia lógica complexa em **custom hooks**
- Use **TypeScript** para props
- Comunicação via `window.api` para operações de dados

```typescript
interface TaskCardProps {
  task: Task
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete }) => {
  // implementação
}
```

### Formatação

O projeto usa ESLint e Prettier:

```bash
# Verificar
npm run lint

# Corrigir automaticamente
npm run lint:fix
```

## Estrutura de Pastas

```
electron/
├── main.ts        # Processo principal Electron
├── db/            # SQLite local
├── ipc/           # Handlers IPC
└── sync/          # Sincronização opcional

src/
├── app/           # Configuração global e rotas
├── features/      # Módulos de domínio
│   └── tasks/    # Feature de tarefas
├── shared/        # Componentes reutilizáveis
│   └── ui/       # Componentes base (Button, Card, etc.)
├── hooks/         # Custom hooks
└── types/         # Tipos TypeScript globais
```

## Testes

### Executando Testes

```bash
# Todos os testes
npm run test

# Modo watch
npm run test:watch

# Com coverage
npm run test:coverage
```

### Escrevendo Testes

- Teste funcionalidades críticas
- Use mocks para APIs externas (Supabase)
- Mantenha testes simples e focados
- Teste handlers IPC separadamente

```typescript
describe('TaskService', () => {
  it('should create a new task', async () => {
    const task = await taskService.create(userId, taskData)
    expect(task.title).toBe(taskData.title)
  })
})
```

## Build e Deploy

### Build Local

```bash
# TypeScript compilation
npm run check

# Build de produção
npm run build

# Build do Electron
npm run electron:build
```

### Distribuição

O projeto gera artefatos nativos para cada plataforma:
- **Linux**: AppImage
- **Windows**: NSIS installer
- **macOS**: DMG

Os builds são gerados na pasta `release/`.

## Documentação

- Mantenha o **README.md** atualizado
- Documente mudanças no **CHANGELOG.md**
- Adicione comentários em código complexo
- Atualize types no código TypeScript
- Documente novos handlers IPC

## Code Review

Pull Requests serão revisados considerando:

- ✅ Funcionalidade correta
- ✅ Testes adequados
- ✅ Código limpo e legível
- ✅ Performance
- ✅ Segurança
- ✅ Arquitetura Electron adequada
- ✅ Documentação

## Dúvidas?

Se tiver dúvidas sobre como contribuir:

1. Leia a documentação existente
2. Procure em issues fechadas
3. Abra uma issue com sua dúvida
4. Contate os mantenedores

## Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para o projeto
- Mantenha discussões profissionais

Obrigado por contribuir! 🚀
