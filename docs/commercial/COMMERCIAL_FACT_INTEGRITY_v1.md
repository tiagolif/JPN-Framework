# JPN — Integridade factual da superfície comercial v1

Status: preflight interno; não publicado; não constitui autorização comercial.

## Objetivo

Evitar que a landing e as páginas individuais do portfólio passem a declarar fatos que ficaram desatualizados em relação às fontes canônicas do repositório.

O gate correspondente é:

```bash
npm run check:commercial-product-facts
```

## Fontes verificadas

- `docs/product-system/PRODUCT_PORTFOLIO_v1.json` para IDs, nomes e catálogo canônico;
- `docs/products/prompt-pack/PROMPT_INDEX.json` para a quantidade vigente de templates do JPN Prompt Pack;
- `docs/products/jpn-business/BUSINESS_INDEX.json` para a quantidade vigente de playbooks do JPN Business;
- `commercial-site/index.html` e as seis páginas individuais para a representação comercial interna.

## Contrato mínimo

O preflight exige:

1. os seis produtos canônicos no portfólio;
2. correspondência entre `data-product`, nome canônico, landing e página individual;
3. Jornada, Precisão e Narrativa na página do Método JPN;
4. quantidade de templates do Prompt Pack derivada do índice, sem número duplicado no script;
5. quantidade de playbooks/fluxos do Business derivada do índice;
6. preservação do caráter local/offline da versão atual do Prompt Builder;
7. identificação da Gestão Fácil como planilha;
8. preservação do estado `EM PREPARAÇÃO` do JPN Pro Kit.

## Por que este gate existe

Controles anteriores já cobrem linguagem comercial proibida, ausência de checkout/preço, navegação, acessibilidade, contraste e estrutura da superfície. Esses controles não impedem, por exemplo, que o Prompt Pack evolua para outra quantidade de templates enquanto a página continue exibindo um número antigo.

Este gate cobre especificamente esse tipo de deriva factual.

## Limites

A aprovação deste preflight não comprova:

- revisão editorial humana completa;
- adequação jurídica de claims;
- eficácia dos produtos;
- QA visual em navegador/dispositivo;
- disponibilidade comercial;
- preço, checkout ou condições de venda;
- autorização de publicação.

Mudanças legítimas de escopo devem primeiro atualizar as fontes canônicas e, em seguida, a representação comercial correspondente. O gate deve falhar durante a divergência em vez de aceitar silenciosamente duas versões do mesmo fato.
