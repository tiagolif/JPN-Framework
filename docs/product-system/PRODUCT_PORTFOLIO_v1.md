# JPN — contrato de portfólio v1

Este documento define a camada mínima de organização dos produtos digitais do ecossistema JPN. A fonte mecanicamente verificável é `PRODUCT_PORTFOLIO_v1.json`.

## Objetivo

Manter um mapa único entre nome canônico, diretório de documentação, tipo de artefato, público, papel no ecossistema e dependências conhecidas de release. O catálogo reduz divergência entre documentação, páginas, copies, Pro Kit e entregáveis sem transformar pendências em promessas de lançamento.

## Produtos cobertos

- **Método JPN** — fundamento metodológico.
- **JPN Prompt Pack** — biblioteca aplicada de prompts.
- **JPN Business** — playbooks empresariais conectados ao Prompt Pack.
- **JPN Prompt Builder** — ferramenta local de estruturação e reutilização de prompts.
- **JPN Pro Kit** — pacote integrado de entrega.
- **JPN Gestão Fácil** — planilha operacional para pequenas empresas.

## Regras

1. Todo produto do portfólio deve existir também em `CORE_TERMINOLOGY_v1.json`.
2. IDs e nomes canônicos são únicos.
3. O diretório de documentação declarado precisa existir no checkout.
4. Público e papel devem permanecer descritivos, sem claims de eficácia ou resultado comercial.
5. `release_dependencies` registra trabalho ainda necessário; não significa que o item esteja aprovado, congelado ou publicado.
6. Mudanças de nome, ID ou raiz documental devem atualizar simultaneamente terminologia e portfólio.

## Dependências atualmente registradas

As dependências listadas no JSON refletem gates já conhecidos do projeto, como revisão editorial humana, PDFs finais, GF-QA-10, CI final, pacote offline final, congelamento de artefatos e hashes. Elas servem como mapa de execução e podem ser refinadas conforme os gates forem concluídos.

## O que este contrato não prova

A presença de um produto no catálogo não prova qualidade final, eficácia do framework, prontidão comercial, compatibilidade universal, aprovação jurídica ou autorização de publicação. O catálogo organiza o sistema de produtos; os gates específicos continuam sendo a fonte de verdade para cada release.
