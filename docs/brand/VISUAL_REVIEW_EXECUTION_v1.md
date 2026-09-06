# JPN — Execução de revisão visual v1

Status: `preparação concluída; inspeção visual final pendente`

## Objetivo

Transformar o gate visual em uma execução reproduzível, sem confundir geração de uma galeria com aprovação de publicação.

## Comando

```bash
npm run build:visual-review
```

O comando percorre automaticamente `assets/covers/*.svg` e `assets/social/*.svg`, extrai metadados básicos e gera localmente:

- `dist/visual-review/index.html` — galeria responsiva para inspeção;
- `dist/visual-review/manifest.json` — inventário reproduzível dos SVGs encontrados.

A galeria mostra cada peça em preview amplo e oferece checklist local para:

1. clipping ou elementos cortados;
2. legibilidade de texto;
3. contraste;
4. margens seguras;
5. coerência de estado e claims.

## Critérios para fechar o gate

O gate `visual-render-review` só pode mudar para `passed` quando todos os SVGs presentes no manifesto da galeria tiverem sido inspecionados visualmente após renderização em navegador compatível e não houver problema material aberto.

Para cada correção necessária:

1. corrigir a fonte SVG;
2. executar `npm run check:visual-assets`;
3. regenerar a galeria;
4. revisar novamente o asset corrigido;
5. registrar o resultado nesta evidência antes de promover o gate.

## Estado desta etapa

Concluído:

- inventário automático das capas e peças sociais;
- geração de uma superfície única de revisão;
- integração da geração ao `npm run build`;
- checklist padronizado por asset;
- separação explícita entre "renderizável" e "aprovado".

Pendente:

- abrir a galeria gerada em navegador;
- revisar cada asset em escala normal e reduzida;
- registrar eventuais correções;
- somente então marcar `visual-render-review` como `passed`.

## Guardrails

Esta evidência não autoriza publicação, anúncio, checkout, gasto, criação de conta, aceite legal nem uso de dados financeiros reais.
