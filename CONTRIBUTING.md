# Guia de Contribuição

Obrigado por considerar contribuir para o Life OS! 🎉

## Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor crie uma issue incluindo:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (OS, navegador, versão do Node, etc.)

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
docs: atualiza README com novos scripts
refactor: reorganiza estrutura de hooks
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
src/
├── components/     # Componentes reutilizáveis
│   └── ui/        # Componentes base (Button, Card, etc.)
├── pages/         # Páginas/Views
├── hooks/         # Custom hooks
├── lib/           # Utilitários e helpers
├── contexts/      # React contexts
└── types/         # Tipos TypeScript globais

api/
├── routes/        # Rotas Express
├── services/      # Lógica de negócio
├── middleware/    # Middlewares
└── lib/           # Utilitários backend
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
- Use mocks para APIs externas
- Mantenha testes simples e focados

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

# Preview do build
npm run preview
```

### Deploy

O projeto está configurado para:
- **Frontend**: Vercel (automático via GitHub)
- **Backend**: Render/Fly.io (manual)

## Documentação

- Mantenha o **README.md** atualizado
- Documente mudanças no **CHANGELOG.md**
- Adicione comentários em código complexo
- Atualize types no código TypeScript

## Code Review

Pull Requests serão revisados considerando:

- ✅ Funcionalidade correta
- ✅ Testes adequados
- ✅ Código limpo e legível
- ✅ Performance
- ✅ Segurança
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
