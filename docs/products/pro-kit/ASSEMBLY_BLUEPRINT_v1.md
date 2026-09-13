# JPN Pro Kit — Blueprint de montagem v1

Este documento descreve **como o JPN Pro Kit deverá ser montado quando os componentes estiverem realmente aprovados**. Ele não é release, não é pacote de distribuição e não substitui os gates de cada produto.

## Objetivo

Evitar uma montagem manual ambígua do Pro Kit. Cada pasta futura do bundle passa a ter:

- um produto ou função responsável;
- fontes candidatas conhecidas;
- artefatos futuros esperados;
- gates que precisam estar fechados antes da materialização.

A fonte estruturada deste documento é `ASSEMBLY_BLUEPRINT_v1.json`.

## Estrutura futura

```text
JPN_Pro_Kit_v1/
├── 00_LEIA_PRIMEIRO/
├── 01_METODO_JPN/
├── 02_PROMPT_PACK/
├── 03_JPN_BUSINESS/
├── 04_PROMPT_BUILDER/
└── 05_GESTAO_FACIL/
```

### 00 — Leia primeiro

Reúne navegação e orientação do bundle. As fontes atuais são `LEIA_PRIMEIRO.md`, `DELIVERY_MAP.md` e `USAGE_ROUTING_GUIDE_v1.md`. PDFs e demais arquivos finais só devem ser produzidos no freeze final.

### 01 — Método JPN

Só pode receber o PDF final após `revisao-editorial-humana` e `pdf-final` estarem aprovados com evidência válida.

### 02 — JPN Prompt Pack

Só pode receber o PDF final após `revisao-editorial-humana` e `pdf-final`. O índice JSON pode acompanhar a entrega, mas sua presença não substitui o PDF revisado.

### 03 — JPN Business

Depende de `revisao-editorial-humana`, `diagramacao-final` e `pdf-final`. Nenhum documento de composição candidato deve ser confundido com o PDF final.

### 04 — JPN Prompt Builder

O Pro Kit deve incluir o **pacote offline final**, não apenas fontes do site ou um staging interno. Antes disso precisam estar fechados `qa-fisico-contextual-celular`, `ci-final` e `pacote-offline-final`.

### 05 — JPN Gestão Fácil

O slot deve receber o **XLSX final validado**, e não promover por conveniência o arquivo histórico v0.1. Os gates `gf-qa-10` e `arquivo-final-validado` precisam estar aprovados antes da montagem final.

## Ordem de fechamento

1. Fechar os gates dos produtos componentes com a evidência exigida pelo contrato de release.
2. Materializar apenas os artefatos finais aprovados nos respectivos slots.
3. Congelar a árvore do Pro Kit e registrar o commit-fonte.
4. Calcular SHA-256 depois do congelamento.
5. Executar CI no mesmo head candidato.
6. Gerar o manifesto final somente após os gates `artefatos-congelados`, `hashes-finais` e `ci-final` estarem satisfeitos.

## O que este blueprint resolve

Ele elimina três ambiguidades importantes:

- qual produto alimenta cada pasta do bundle;
- quais arquivos atuais são apenas fontes candidatas;
- quais gates impedem que um candidato seja promovido cedo demais.

## O que continua pendente

Este blueprint **não fecha** revisão humana, PDF, QA físico, compatibilidade multiplataforma, freeze, hashes ou CI. Também não autoriza publicação, venda, anúncio, checkout, gasto, criação de conta, aceite legal ou uso de dados financeiros reais.
