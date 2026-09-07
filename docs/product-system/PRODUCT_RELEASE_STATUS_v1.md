# JPN — Status verificável de release v1

Este documento descreve o contrato `PRODUCT_RELEASE_STATUS_v1.json`, usado para acompanhar as dependências de release dos produtos definidos em `PRODUCT_PORTFOLIO_v1.json`.

## Objetivo

Separar três coisas que não devem ser confundidas:

1. **existência do produto no portfólio**;
2. **trabalho técnico/editorial já produzido**;
3. **aprovação objetiva das dependências de release**.

Um produto pode estar amplamente desenvolvido e ainda permanecer `not-ready` enquanto houver dependências abertas.

## Estados permitidos

- `pending`: trabalho ainda não concluído;
- `in-progress`: execução iniciada, porém sem evidência final;
- `passed`: dependência concluída com evidência verificável;
- `blocked`: não pode avançar no ambiente atual ou depende de condição externa explícita;
- `not-applicable`: somente quando uma dependência deixa de se aplicar e isso estiver documentado.

## Regra de evidência

`passed` exige `evidence`. Para evidência local, o arquivo deve existir no checkout. Evidências de CI podem apontar para uma URL do GitHub. Nenhuma dependência pode ser aprovada apenas porque um script não encontrou erro.

Exemplos que continuam exigindo execução humana ou ambiente específico:

- revisão editorial humana completa;
- inspeção página a página de PDF;
- inspeção visual de artes;
- GF-QA-10 em Excel, LibreOffice Calc e Google Sheets;
- aprovação de um candidato final após CI.

## Estado inicial registrado

O registro v1 conserva como `pending` as dependências ainda não comprovadas no estado atual, inclusive revisão editorial final, PDFs finais, diagramação do JPN Business, CI/pacote offline do Prompt Builder, congelamento/hashes do Pro Kit e GF-QA-10 da Gestão Fácil.

Isso é intencional: o contrato prefere um falso negativo conservador a declarar um release pronto sem evidência.

## Manutenção

Ao alterar `release_dependencies` em `PRODUCT_PORTFOLIO_v1.json`, a mesma mudança deve ser refletida no registro de status. O comando `npm run check:product-release-status` falha quando há divergência, IDs duplicados, status inválidos ou `passed` sem evidência.

## Limites

Este sistema é um controle interno de prontidão. Não autoriza publicação, venda, anúncio, checkout, uso de claims, aceite jurídico ou criação de contas externas.
