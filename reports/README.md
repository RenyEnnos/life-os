# Relatórios Lighthouse

## Como gerar
- Execute o app local: `npm run dev` (client em `http://localhost:5175/`).
- Em outro terminal, rode: `npm run lh`.
- Opcional: especificar URL: `npm run lh -- --url=http://localhost:5175/`.

## Saída
- Relatórios gerados em `./reports` com timestamp.
- Dois perfis: `mobile` e `desktop`.
- Formatos: `.html` e `.json`.
- Exemplo: `lh_mobile_2025-11-30-12-00-00.html`.

## Metas mínimas
- Performance ≥ 90
- Acessibilidade ≥ 90
- Boas Práticas ≥ 90
- SEO ≥ 90

## Interpretação e Recomendações
- Performance: reduza JS não utilizado, habilite cache estático, otimize imagens e evite grandes bundles na rota inicial.
- Acessibilidade: garanta contraste suficiente, texto alternativo em imagens, labels e `aria-*` em controles, navegação por teclado e foco visível.
- Boas Práticas: use HTTPS, evite erros de console, valide links e recursos.
- SEO: configure meta tags, títulos, linguagem do documento e sitemap quando aplicável.

## Dicas
- Para métricas realistas, rode em build de produção: `npm run build && npm run preview` e aponte o Lighthouse para a URL do preview.
