# JPN Pro Kit — roll-up de prontidão dos componentes v1

## Objetivo

O JPN Pro Kit é um bundle: sua prontidão depende da prontidão real dos produtos que ele reúne. Este documento formaliza um espelho verificável do contrato `docs/product-system/PRODUCT_RELEASE_STATUS_v1.json`, sem criar uma segunda fonte de verdade e sem promover qualquer gate automaticamente.

## Fonte de verdade

A fonte canônica continua sendo `PRODUCT_RELEASE_STATUS_v1.json`. O arquivo `COMPONENT_READINESS_ROLLUP_v1.json` é apenas um snapshot versionado e verificável. Se qualquer ID, ordem, dependência ou status divergir do contrato canônico, `scripts/check-pro-kit-component-rollup.mjs` deve falhar.

## Escopo atual

O roll-up cobre cinco componentes do Pro Kit:

- Método JPN;
- JPN Prompt Pack;
- JPN Business;
- JPN Prompt Builder;
- JPN Gestão Fácil.

O próprio `jpn-pro-kit` é excluído da lista de componentes para evitar dependência circular.

No snapshot atual existem 12 dependências de componente: 0 `passed`, 1 `in-progress`, 11 `pending` e 0 `blocked`. Portanto `all_components_release_ready` permanece `false`.

## Invariantes verificadas

O checker exige correspondência exata entre roll-up e contrato canônico para:

1. conjunto e ordem dos cinco componentes;
2. conjunto e ordem das dependências de cada componente;
3. status de cada dependência;
4. totais agregados do resumo;
5. cálculo de `all_components_release_ready`.

Enquanto qualquer dependência de componente estiver diferente de `passed` ou `not-applicable`, o checker também impede que `artefatos-congelados` ou `hashes-finais` do JPN Pro Kit sejam promovidos prematuramente para `passed`.

## Integração ao build

`check-pro-kit-component-rollup.mjs` é chamado por `check-pro-kit-release.mjs`. Como `check:pro-kit` já participa do `npm run build`, divergências futuras entre o Pro Kit e o estado real dos componentes entram na mesma cadeia automática de QA já existente.

## O que este gate não faz

Um PASS deste checker significa somente que o snapshot está alinhado ao contrato e que os guardrails de promoção prematura estão preservados. Ele não significa que:

- revisão editorial humana foi concluída;
- PDFs finais foram revisados;
- QA físico do Prompt Builder foi executado;
- `GF-QA-10` foi aprovado;
- artefatos foram congelados;
- hashes finais podem ser emitidos;
- CI final está verde;
- release, venda, anúncio, checkout ou publicação estão autorizados.

## Próxima promoção permitida

Nenhuma promoção de release decorre deste arquivo. O Pro Kit só pode avançar quando as dependências canônicas dos componentes forem efetivamente concluídas com as evidências exigidas e os próprios gates finais do Pro Kit forem executados na ordem correta.
