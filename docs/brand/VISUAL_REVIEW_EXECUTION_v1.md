# JPN — Execução de revisão visual v1

Status: `preparação e integridade estrutural concluídas; inspeção visual final pendente`

## Objetivo

Transformar o gate visual em uma execução reproduzível, sem confundir geração de uma galeria com aprovação de publicação.

## Comandos

```bash
npm run build:visual-review
npm run check:visual-review-gallery
```

O primeiro comando percorre automaticamente `assets/covers/*.svg` e `assets/social/*.svg`, extrai metadados básicos e gera localmente:

- `dist/visual-review/index.html` — galeria responsiva para inspeção;
- `dist/visual-review/manifest.json` — inventário reproduzível dos SVGs encontrados.

O segundo comando verifica a integridade do staging contra os SVGs-fonte, incluindo inventário, bytes, SHA-256, metadados geométricos, previews e `source_state_digest`. O contrato detalhado está em `VISUAL_REVIEW_GALLERY_INTEGRITY_v1.md`.

A galeria mostra cada peça em preview amplo e oferece checklist local para:

1. clipping ou elementos cortados;
2. legibilidade de texto;
3. contraste;
4. margens seguras;
5. coerência de estado e claims.

## Critérios para fechar o gate

O gate `visual-render-review` só pode mudar para `passed` quando todos os SVGs presentes no manifesto da galeria tiverem sido inspecionados visualmente após renderização em navegador compatível e não houver problema material aberto.

A evidência futura deve registrar o `source_state_digest` exibido na galeria. Uma mudança em qualquer SVG gera um novo digest e exige reavaliação do estado alterado.

Para cada correção necessária:

1. corrigir a fonte SVG;
2. executar `npm run check:visual-assets`;
3. executar `npm run check:visual-bounds`;
4. regenerar a galeria;
5. executar `npm run check:visual-review-gallery`;
6. revisar novamente o asset corrigido;
7. registrar o resultado nesta evidência antes de promover o gate.

## Estado desta etapa

Concluído:

- inventário automático das capas e peças sociais;
- geração de uma superfície única de revisão;
- SHA-256 e bytes por asset;
- `source_state_digest` determinístico do conjunto;
- gate de integridade fonte → manifesto → preview;
- integração da geração e do gate ao `npm run build`;
- checklist padronizado por asset;
- separação explícita entre "renderizável", "íntegro" e "aprovado".

Pendente:

- abrir a galeria gerada em navegador;
- revisar cada asset em escala normal e reduzida;
- registrar o digest efetivamente revisado;
- registrar eventuais correções;
- somente então marcar `visual-render-review` como `passed`.

## Guardrails

Esta evidência não autoriza publicação, anúncio, checkout, gasto, criação de conta, aceite legal nem uso de dados financeiros reais.
