# JPN — Alinhamento de dependências de release v1

Estado: **controle interno de pré-release**.

Este documento registra uma invariável de governança do portfólio: a lista de dependências finais declarada no catálogo de entregáveis deve corresponder exatamente ao contrato canônico do portfólio e ao registro de status de release.

## Problema corrigido

O JPN Prompt Builder já era descrito em materiais e no catálogo como dependente de **QA físico contextual em celular**, porém essa dependência não estava no contrato canônico `PRODUCT_PORTFOLIO_v1.json` nem no `PRODUCT_RELEASE_STATUS_v1.json`.

Isso criava uma deriva perigosa: o catálogo e as páginas comerciais podiam afirmar corretamente que o QA físico seguia pendente, enquanto o cálculo agregado de prontidão ignorava esse gate.

## Correção

A dependência `qa-fisico-contextual-celular` passa a constar em:

- `docs/product-system/PRODUCT_PORTFOLIO_v1.json`;
- `docs/product-system/PRODUCT_RELEASE_STATUS_v1.json`;
- `docs/product-system/DELIVERABLE_CATALOG_v1.json` (já existente antes desta correção);
- `reports/product-readiness/PORTFOLIO_READINESS.md`.

O estado permanece **pending**. Nenhuma aprovação foi inferida e nenhuma evidência foi inventada.

## Regressão bloqueada

`scripts/check-deliverable-catalog.mjs` agora exige correspondência exata entre:

- `release_dependencies` do portfólio canônico; e
- `final_release_dependencies` do catálogo de entregáveis.

O gate falha tanto quando falta uma dependência canônica quanto quando o catálogo introduz uma dependência que ainda não foi canonizada. Duplicidades também passam a ser rejeitadas.

Como `check:deliverable-catalog` já participa de `npm run build`, esse alinhamento fica coberto pelo build principal sem criar um fluxo paralelo.

## Leitura correta

Este gate valida **consistência de contrato**, não conclusão do QA. O Prompt Builder continua bloqueado para release final até existir validação física contextual em celular, CI final e pacote offline final conforme o registro canônico.

Nenhuma parte deste documento autoriza publicação, venda, anúncio, checkout, coleta de pagamento ou aceite legal.
