# JPN Business — Handoff de revisão humana v1

## Objetivo

Transformar o checklist estrutural de composição em um pacote operacional de revisão humana gerado a partir do mesmo candidato que já passou pelos gates automáticos de integridade.

Esta etapa reduz ambiguidade entre “candidato gerado” e “candidato revisado”, sem promover qualquer gate humano por inferência.

## Entrada obrigatória

O gerador `scripts/build-jpn-business-review-packet.mjs` somente conclui quando encontra:

- `COMPOSITION_QA_CHECKLIST_v1.csv` com exatamente 26 itens `JB-COMP-01..JB-COMP-26`;
- todos os 26 itens ainda em `PENDING` antes da revisão;
- `candidate-manifest.json` preservando `visual_qa: pending`, `pdf_export: pending` e `publication_authorized: false`;
- `candidate-integrity-report.json` em `candidate-integrity-pass-human-review-still-required`;
- `release_effect: none` e revisão humana obrigatória.

## Saídas de staging

A execução gera em `dist/editorial-print-staging/jpn-business/`:

1. `HUMAN_REVIEW_PACKET.md` — roteiro legível para inspeção dos 26 itens, com campos de resultado, evidência, revisor, data e observações.
2. `human-review-state.json` — estado estruturado inicial com todos os 26 itens `PENDING`, evidência nula e `release_effect: none`.

Esses arquivos são regeneráveis e permanecem no staging. Eles não são artefatos finais de release.

## Ordem recomendada da revisão

1. `front-matter` — capa, escopo, sumário, como usar e fundamentos;
2. `playbook` — JB-01 até JB-12;
3. `back-matter` — referência PP-*, checklist final e limites;
4. `visual` — overflow, páginas vazias, legibilidade e distinção dos boxes;
5. `guardrail` — ausência de claims proibidos ou condições comerciais inventadas;
6. `release` — registrar evidência visual versionada antes de qualquer promoção de diagramação.

## Regra de promoção

Gerar o pacote não altera nenhum status de produto.

Uma promoção posterior só pode ser considerada quando os 26 itens tiverem evidência explícita e nenhum item obrigatório estiver `FAILED` ou sem evidência. A promoção deve ocorrer em etapa separada, com rastreabilidade própria.

## O que este handoff não comprova

- aprovação visual;
- revisão editorial concluída;
- compatibilidade de impressão;
- PDF final;
- freeze;
- release;
- autorização de publicação;
- eficácia comercial do JPN Business.

## Guardrails

A etapa não cria preço, checkout, anúncio ou publicação; não utiliza dados financeiros reais; não cria contas externas; não aceita termos legais; não transforma automaticamente revisão humana em `PASSED`.
