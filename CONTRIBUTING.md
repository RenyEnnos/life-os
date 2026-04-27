# Guia de Contribuição

Obrigado por considerar contribuir para o LifeOS!

## Visão Geral do Projeto

O LifeOS é um **aplicativo desktop Electron offline-first** para produtividade e gerenciamento pessoal. Todos os dados são armazenados localmente via SQLite, com sincronização opcional com Supabase.

Para detalhes sobre a arquitetura, veja [docs/development/architecture-deep-dive.md](./docs/development/architecture-deep-dive.md).

## Como Contribuir

### Reportando Bugs

Use o [template de bug report](https://github.com/RenyEnnos/LIfe0S/issues/new?template=bug_report.md) incluindo:
- Ambiente (OS, versão, runtime)
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)

### Sugerindo Melhorias

Use o [template de feature request](https://github.com/RenyEnnos/LIfe0S/issues/new?template=feature_request.md) incluindo:
- Problema que resolve
- Solução proposta
- Alternativas consideradas
- Prioridade MoSCoW

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
5. **Abra um Pull Request** usando o [PR template](./.github/PULL_REQUEST_TEMPLATE.md)

## Development Setup

Instruções completas de setup: [docs/development/getting-started.md](./docs/development/getting-started.md)

```bash
git clone https://github.com/RenyEnnos/LIfe0S.git
cd LIfe0S
npm install
npm run electron:dev
```

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

### Code Patterns

Para padrões de código, convenções, exemplos e anti-patterns, veja [AGENTS.md](./AGENTS.md).

## Testes

```bash
npm run test             # Todos os testes
npm run test:watch       # Modo watch
npm run test:integration # Apenas testes de integração
npm run test:e2e         # Playwright smoke (autoritativo)
```

Guia completo de testes: [docs/development/testing-guide.md](./docs/development/testing-guide.md)

## Build e Distribuição

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run build        # Build de produção
npm run electron:build  # Pacote Electron (AppImage, NSIS, DMG)
```

## Documentação

Ao contribuir com documentação:
- Docs técnicos em **inglês** (para AI agents)
- Docs user-facing em **português**
- Adicione frontmatter YAML (type, status, last_updated, tags)
- Veja [docs/AI_CONTEXT_MAP.md](./AI_CONTEXT_MAP.md) para navegação

## Segurança

Para reportar vulnerabilidades de segurança, veja [SECURITY.md](./SECURITY.md).

## Code Review

Pull Requests serão revisados considerando:

- Funcionalidade correta
- Testes adequados
- Código limpo e legível
- Performance
- Segurança
- Arquitetura Electron adequada
- Documentação atualizada

## Dúvidas?

1. Leia a documentação existente
2. Consulte [AGENTS.md](./AGENTS.md) para padrões de código
3. Procure em issues fechadas
4. Abra uma issue com sua dúvida

## Código de Conduta

Este projeto segue o [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). Ao participar, você concorda em respeitar estas diretrizes.

Obrigado por contribuir!
