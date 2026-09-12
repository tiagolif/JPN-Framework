# Editorial Preflight v1

Este documento transforma a preparação editorial de **Método JPN**, **JPN Prompt Pack** e **JPN Business** em um handoff verificável. Ele não substitui revisão humana, não promove release e não autoriza publicação.

## Objetivo

Reduzir ambiguidade antes da diagramação e do PDF final. Cada produto passa a ter fontes primárias explícitas, materiais de apoio à revisão, ordem editorial, dependências de release e critérios mínimos de preflight.

## Método JPN

**Composição sugerida:** núcleo do método → casebook → workbook prático → referência rápida.

Fontes primárias:
- `docs/products/metodo-jpn/METODO_JPN_v1.md`
- `docs/products/metodo-jpn/METODO_JPN_CASEBOOK_v1.md`
- `docs/products/metodo-jpn/METODO_JPN_PRACTICE_WORKBOOK_v1.md`
- `docs/products/metodo-jpn/METODO_JPN_QUICK_REFERENCE_v1.md`

Antes de qualquer decisão de release ainda são obrigatórios: revisão editorial humana integral e inspeção página a página do PDF exportado.

## JPN Prompt Pack

**Composição sugerida:** orientação de uso → biblioteca de prompts → seleção guiada → referência rápida.

Fontes primárias:
- `docs/products/prompt-pack/JPN_PROMPT_PACK_v1.md`
- `docs/products/prompt-pack/PROMPT_SELECTION_WORKBOOK_v1.md`
- `docs/products/prompt-pack/JPN_PROMPT_PACK_QUICK_REFERENCE_v1.md`

O `PROMPT_INDEX.json` permanece a referência estrutural para IDs. O preflight exige que seleção guiada, biblioteca e índice permaneçam coerentes e que nenhum prompt seja apresentado como garantia de precisão ou resultado.

## JPN Business

**Composição sugerida:** núcleo Business → workbook de implementação → sprint de 30 dias → scorecard operacional → revisão semanal → referência rápida.

Fontes primárias:
- `docs/products/jpn-business/JPN_BUSINESS_v1.md`
- `docs/products/jpn-business/IMPLEMENTATION_WORKBOOK_v1.md`
- `docs/products/jpn-business/30_DAY_IMPLEMENTATION_SPRINT_v1.md`
- `docs/products/jpn-business/OPERATIONAL_SCORECARD_v1.md`
- `docs/products/jpn-business/WEEKLY_OPERATING_REVIEW_v1.md`
- `docs/products/jpn-business/JPN_BUSINESS_QUICK_REFERENCE_v1.md`

O Business já possui infraestrutura de composição. O preflight compartilhado não substitui `COMPOSITION_MAP_v1.json`, `COMPOSITION_QA_CHECKLIST_v1.csv`, `VISUAL_QA_CHECKLIST_v1.md` nem o handoff humano; ele conecta esses materiais ao contrato comum dos três produtos editoriais.

## Estados de handoff

A sequência de trabalho é:

`source-ready` → `human-editorial-review-pending` → `layout-candidate` → `visual-qa-pending` → `pdf-candidate` → `page-by-page-review-pending` → `release-decision-pending`.

Nenhum estado acima equivale a `release_ready=true`.

## Regras compartilhadas

- preservar nomes canônicos do framework e dos produtos;
- não introduzir preço, checkout, anúncio, captação de lead ou tracking;
- não prometer resultado garantido, precisão absoluta ou substituição de revisão humana;
- não usar dados reais de clientes, credenciais, dados financeiros ou informações sensíveis;
- não transformar validação mecânica em aprovação editorial humana;
- não chamar PDF de final sem inspeção visual página a página.

A fonte estruturada deste documento é `docs/product-system/EDITORIAL_PREFLIGHT_v1.json`.

`publication_authorized: false`  
`release_effect: none`
