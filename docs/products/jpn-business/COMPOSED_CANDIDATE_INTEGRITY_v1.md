# JPN Business — Integridade do candidato composto v1

## Objetivo

Adicionar uma camada automática de evidência entre a geração do candidato composto e a revisão humana visual/editorial.

Esta camada complementa `check-jpn-business-rendered-candidate.mjs`, que já valida o candidato base (12 playbooks, 144 campos, Referência Rápida, manifesto e vínculos PP-*). O novo gate cobre especificamente os elementos introduzidos pela composição rastreável.

## Comando

```bash
node scripts/check-jpn-business-composed-render.mjs
```

O orquestrador executa, nesta ordem:

1. `build-jpn-business-composed-candidate.mjs` — gera o candidato composto;
2. `check-jpn-business-rendered-candidate.mjs` — preserva o QA estrutural já existente do candidato base;
3. `verify-jpn-business-composed-candidate.mjs --no-build` — valida a camada de composição no artefato recém-gerado.

O gate também foi encadeado em `check-jpn-business-links.mjs`, portanto passa a fazer parte da cadeia principal de consistência do JPN Business.

## O que o verificador de composição confirma

- estado `source-traceable-candidate-human-review-pending`;
- `release_effect: none`;
- revisão humana obrigatória;
- 20 seções e ordem idêntica ao `COMPOSITION_MAP_v1.json`;
- 12 playbooks;
- 18 templates do Prompt Pack;
- conjunto de sínteses ainda pendentes de revisão humana;
- hashes SHA-256 do mapa, manifesto de fontes e índice do Prompt Pack;
- `visual_qa: pending`;
- `pdf_export: pending`;
- `publication_authorized: false`;
- presença única dos componentes de sumário, referência cruzada e flags editoriais;
- presença das 20 entradas do sumário;
- presença dos IDs JB-* e PP-* necessários à rastreabilidade.

## Evidência gerada

A execução bem-sucedida cria:

`dist/editorial-print-staging/jpn-business/candidate-integrity-report.json`

O relatório contém o total de verificações, aprovações/falhas e detalhes por cheque. Como `dist/` é staging ignorado pelo Git, o relatório funciona como evidência de execução sem congelar artefatos prematuramente no repositório.

## Limites deliberados

Um `PASS` deste gate **não** significa:

- aprovação visual;
- revisão editorial humana concluída;
- PDF final aprovado;
- freeze;
- release;
- autorização de publicação.

O estado máximo permitido continua sendo um candidato estruturalmente íntegro e rastreável, ainda dependente de revisão humana.

## Próximo gate real

Depois desta integridade estrutural, permanecem necessários:

1. inspeção visual página a página;
2. execução dos itens de `COMPOSITION_QA_CHECKLIST_v1.csv`;
3. revisão editorial das sínteses sinalizadas;
4. exportação do PDF candidato;
5. revisão do PDF;
6. somente após aprovação explícita dos gates, freeze e hashes finais.
