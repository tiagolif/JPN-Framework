# Integridade da revisão de PDFs editoriais v1

## Objetivo

Este documento define o gate mecânico entre os PDFs editoriais candidatos e a galeria usada para inspeção humana página a página.

O gate existe para provar que a evidência visual aberta pelo revisor corresponde aos mesmos binários PDF registrados no manifesto de candidatos. Ele não transforma renderização em aprovação e não autoriza release ou publicação.

## Escopo canônico

O gate exige exatamente estes cinco documentos, nesta ordem:

1. `metodo-jpn`
2. `jpn-prompt-pack`
3. `jpn-business`
4. `gestao-facil-manual`
5. `pro-kit-leia-primeiro`

Fontes de evidência esperadas:

- `dist/editorial-pdf-candidates/CANDIDATE_MANIFEST.json`
- `dist/editorial-pdf-review/RENDER_REPORT.json`
- `dist/editorial-pdf-review/index.html`
- PDFs candidatos apontados pelo manifesto
- PNGs de todas as páginas apontados pelo relatório de renderização

## O que o gate verifica

Para cada documento:

- o ID e a ordem canônica;
- a presença física do PDF candidato;
- assinatura `%PDF-` válida;
- igualdade de bytes entre arquivo e manifesto;
- SHA-256 real do PDF igual ao hash registrado no manifesto;
- vínculo `sourcePdf` do relatório com o `output` do candidato;
- vínculo do `candidateSha256` da renderização com o PDF candidato;
- existência de ao menos uma página renderizada;
- numeração sequencial de páginas;
- igualdade entre `renderedPages`, array `pages` e, quando disponível, `declaredPages`;
- existência física de cada preview PNG;
- igualdade dos bytes declarados para cada preview;
- ausência de previews extras ou faltantes;
- presença do hash candidato e da primeira página na galeria HTML;
- permanência do aviso de que renderização não equivale a aprovação.

A execução também calcula um `source_state_digest` determinístico a partir dos PDFs e previews observados. Esse digest identifica o estado técnico revisável daquela execução; ele não é hash final de release.

## Sinais de promoção proibidos

A galeria não pode promover automaticamente estados equivalentes a:

- `publication_authorized: true`
- `visual_qa: approved`
- `status: approved`
- `release_ready: true`

Qualquer promoção depende da evidência humana correspondente e dos demais gates formais do produto.

## Como executar

Depois que o ambiente possuir um motor de PDF e um renderizador de páginas:

```bash
npm run build:editorial-print
npm run build:jpn-business-print-candidate
npm run export:editorial-pdfs
npm run review:editorial-pdfs
node scripts/check-editorial-pdf-review.mjs
```

O exportador aceita WeasyPrint ou Chromium/Chrome. A galeria aceita `pdftoppm` (Poppler) ou `mutool` (MuPDF).

## Evidência que ainda continua humana

PASS neste gate **não** comprova:

- ausência de clipping perceptível;
- qualidade estética;
- hierarquia visual adequada;
- legibilidade em tamanho normal e reduzido;
- margens e quebras de página editorialmente corretas;
- fontes e acentos percebidos corretamente;
- qualidade de tabelas, código e links;
- inexistência de páginas vazias intencionais versus indevidas;
- revisão ortográfica/editorial fina;
- aprovação final do PDF;
- freeze ou hash final do Pro Kit;
- autorização de publicação.

Esses itens só podem ser promovidos depois de inspeção real e registro da evidência no estado exato dos arquivos revisados.

## Guardrails

- usar somente dados fictícios em qualquer material de teste;
- não gastar dinheiro;
- não criar contas externas;
- não aceitar termos legais;
- não publicar, anunciar, vender ou criar checkout;
- não preencher hashes finais antes do freeze real;
- qualquer correção em PDF ou fonte invalida a evidência visual anterior e exige nova exportação, renderização e revisão.
