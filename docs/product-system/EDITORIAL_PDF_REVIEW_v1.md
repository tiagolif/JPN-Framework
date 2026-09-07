# JPN — Revisão visual dos PDFs editoriais v1

## Objetivo

Transformar os PDFs candidatos gerados por `npm run export:editorial-pdfs` em uma superfície de revisão página a página, sem promover automaticamente nenhum arquivo a artefato final.

## Comando

```bash
npm run review:editorial-pdfs
```

O comando:

1. exige ou gera `dist/editorial-pdf-candidates/CANDIDATE_MANIFEST.json`;
2. detecta `pdftoppm` (Poppler) ou `mutool` (MuPDF);
3. renderiza cada página dos cinco PDFs editoriais prioritários em PNG a 144 DPI;
4. valida que cada documento produziu páginas raster válidas;
5. compara, quando disponível, a contagem renderizada com a contagem declarada pelo exportador;
6. gera `dist/editorial-pdf-review/index.html`;
7. gera `dist/editorial-pdf-review/RENDER_REPORT.json`.

## Documentos cobertos

- Método JPN;
- JPN Prompt Pack;
- JPN Business;
- manual da JPN Gestão Fácil;
- Leia Primeiro do JPN Pro Kit.

## Checklist humano por página

A galeria inclui caixas de verificação apenas como apoio visual. Uma página só deve ser considerada revisada após conferir:

- capa, hierarquia e diagramação;
- ausência de clipping ou conteúdo fora da página;
- acentuação, caracteres especiais e fallback de fontes;
- tabelas, blocos de código e URLs longas;
- ausência de páginas vazias não intencionais;
- legibilidade em escala normal e reduzida;
- coerência com a fonte Markdown canônica.

## Regras de promoção

A existência de PNGs ou da galeria **não significa aprovação**. O estado continua `rendered-for-human-review-not-approved` até que a inspeção seja realmente executada e registrada.

Se qualquer problema for encontrado:

1. corrigir a fonte canônica ou o template de impressão;
2. regenerar o staging HTML;
3. regenerar todos os PDFs candidatos afetados;
4. regenerar a galeria;
5. repetir a inspeção desde o início para o documento alterado.

Hashes presentes no `CANDIDATE_MANIFEST.json` continuam sendo hashes de candidato e não devem ser copiados para o manifesto final do Pro Kit antes do congelamento.

## Dependências locais

É necessário um renderizador disponível no sistema:

- `pdftoppm`, normalmente fornecido pelo Poppler; ou
- `mutool`, normalmente fornecido pelo MuPDF.

Nenhuma dessas dependências é instalada automaticamente pelo projeto e o script não faz downloads, compras ou chamadas a serviços externos.

## Critério para fechar o gate `final-pdfs`

Este gate só pode avançar depois que os cinco PDFs tiverem:

- exportação válida;
- renderização completa;
- inspeção página a página concluída;
- eventuais correções reexportadas e reinspecionadas;
- estado editorial congelado;
- SHA-256 calculado após a última alteração.
