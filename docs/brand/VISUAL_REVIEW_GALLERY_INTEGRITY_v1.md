# JPN — Integridade da galeria de revisão visual v1

Status: `integridade estrutural automatizada; inspeção visual humana pendente`

## Objetivo

Garantir que a galeria usada para revisar capas e peças sociais represente exatamente os SVGs-fonte existentes no repositório, sem transformar geração ou validação mecânica em aprovação visual.

## Fluxo

```bash
npm run build:visual-review
npm run check:visual-review-gallery
```

O primeiro comando gera `dist/visual-review/index.html` e `dist/visual-review/manifest.json`. O segundo confere o staging gerado contra `assets/covers/*.svg` e `assets/social/*.svg`.

## O que o gate verifica

Para cada SVG canônico, o manifesto registra e o gate confirma:

- caminho relativo;
- tamanho em bytes;
- SHA-256 do arquivo-fonte;
- largura, altura e `viewBox`;
- título usado na galeria;
- presença do preview correspondente no HTML.

O gate também exige inventário e ordem idênticos aos diretórios-fonte, rejeita duplicatas e recalcula um `source_state_digest` determinístico para o conjunto completo.

A galeria expõe o SHA-256 em cada card e mantém o mesmo digest agregado do manifesto. Dessa forma, uma revisão visual pode registrar com precisão qual estado das fontes foi observado.

## Estados protegidos

O manifesto deve permanecer com:

```text
visual_review: pending-human-inspection
publication_authorized: false
```

A automação falha se qualquer desses estados for promovido sem uma etapa humana separada.

## O que este gate não comprova

Passar em `check:visual-review-gallery` não comprova:

- ausência de clipping percebido em renderização real;
- legibilidade em tamanhos reais ou reduzidos;
- contraste resultante de composição, transparência ou contexto;
- qualidade estética;
- correção editorial de todos os textos;
- equivalência entre diferentes motores de renderização SVG;
- autorização de publicação, anúncio, venda ou release.

Esses pontos permanecem sujeitos ao checklist e à execução descritos em `VISUAL_REVIEW_EXECUTION_v1.md`.

## Regra de evidência

Ao registrar uma revisão humana futura, deve-se anotar o `source_state_digest` da galeria revisada. Se qualquer SVG mudar, o digest muda e a inspeção daquele estado não pode ser automaticamente reaproveitada como evidência para o novo conjunto.

## Guardrails

Este processo é local e interno. Não publica arquivos, não envia anúncios, não cria contas, não aceita termos, não usa dados financeiros e não autoriza qualquer ação comercial externa.
