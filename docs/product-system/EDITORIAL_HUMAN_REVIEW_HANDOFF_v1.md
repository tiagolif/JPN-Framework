# JPN — Handoff de revisão editorial humana v1

## Objetivo

Preparar uma passagem rastreável entre a geração/rasterização dos PDFs candidatos e a revisão humana de **Método JPN** e **JPN Prompt Pack**, sem transformar evidência mecânica em aprovação editorial.

Os dois produtos permanecem com os gates canônicos `revisao-editorial-humana` e `pdf-final` abertos. O handoff apenas organiza a execução desses gates.

## Escopo canônico

O arquivo `EDITORIAL_REVIEW_SCOPE_v1.json` fixa:

- os produtos `metodo-jpn` e `jpn-prompt-pack`;
- suas fontes Markdown canônicas;
- os arquivos de auditoria associados;
- os dois bloqueios de release esperados;
- sete verificações obrigatórias por página;
- `release_effect: none` e `publication_authorized: false`.

O modo de checagem falha se o escopo divergir de `PRODUCT_RELEASE_STATUS_v1.json`, se uma fonte/auditoria desaparecer ou se algum dos dois gates deixar de estar aberto sem que este handoff seja revisto.

## Validação estrutural

```bash
npm run check:editorial-review-handoff
```

Esse comando **não precisa de PDFs nem de renderizador**. Ele valida apenas contrato, fontes, ordem e guardrails, por isso pode participar do build/CI sem fingir que houve revisão visual.

Estado máximo dessa etapa: `handoff-contract-valid-human-review-still-required`.

## Geração do pacote operacional

Depois de gerar e rasterizar os PDFs candidatos:

```bash
npm run export:editorial-pdfs
npm run review:editorial-pdfs
npm run check:editorial-pdf-review
npm run review:editorial-handoff
```

O último comando exige `dist/editorial-pdf-review/RENDER_REPORT.json` no estado `rendered-for-human-review-not-approved` e gera:

- `dist/editorial-pdf-review/EDITORIAL_HUMAN_REVIEW_PACKET.md`;
- `dist/editorial-pdf-review/EDITORIAL_HUMAN_REVIEW_STATE.json`.

Para cada documento, o pacote registra a fonte canônica, o PDF candidato, o SHA-256 candidato, a quantidade de páginas e os previews. Para cada página, cria os sete checks abaixo, todos começando em `PENDING`:

1. hierarquia e diagramação;
2. ausência de clipping/overflow;
3. acentuação e fontes;
4. tabelas, código e URLs;
5. ausência de páginas vazias indevidas;
6. legibilidade em escala normal e reduzida;
7. coerência com a fonte canônica.

Também há campos de evidência, revisor, data e observações.

## Regra de invalidação

A evidência de revisão pertence ao **candidato exato** identificado pelo SHA-256 registrado. Se a fonte canônica, HTML intermediário ou PDF candidato mudar, a inspeção anterior daquele documento não pode ser reaproveitada por inferência: é necessário reexportar, rerenderizar e reinspecionar o documento afetado.

Hashes presentes nesse fluxo são hashes de candidato. Eles não devem ser promovidos a hashes finais do Pro Kit antes do congelamento dos artefatos.

## O que um PASS automático não prova

A checagem estrutural pode provar que o escopo está consistente e que os gates continuam corretamente abertos. Ela não prova:

- qualidade editorial;
- ausência visual de problemas em uma página;
- conclusão da leitura humana;
- PDF final aprovado;
- freeze de artefatos;
- release;
- autorização de publicação, venda, anúncio ou checkout.

## Critério real para avançar

`revisao-editorial-humana` só pode avançar após a inspeção completa e registrada de todas as páginas do candidato vigente. `pdf-final` só pode avançar depois que eventuais correções forem reexportadas, rerenderizadas e reinspecionadas, seguidas do congelamento editorial e da evidência final correspondente.
