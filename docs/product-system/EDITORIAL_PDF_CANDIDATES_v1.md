# JPN — Exportação e QA de PDFs candidatos v1

Status: `processo interno definido — revisão visual ainda obrigatória`.

## Objetivo

Transformar o staging HTML editorial já existente em PDFs candidatos reproduzíveis sem confundir geração técnica com aprovação editorial ou autorização de publicação.

O fluxo cobre os cinco documentos editoriais prioritários:

1. Método JPN v1;
2. JPN Prompt Pack v1;
3. JPN Business v1;
4. JPN Gestão Fácil — Manual v0.1;
5. JPN Pro Kit — Leia Primeiro v1.

## Comando

```bash
npm run build:editorial-print
npm run export:editorial-pdfs
```

O segundo comando também gera o staging HTML automaticamente se `dist/editorial-print-staging/manifest.json` não existir.

## Motor de PDF

O exportador procura, nesta ordem:

1. `JPN_PDF_ENGINE`, quando definido explicitamente;
2. `weasyprint`;
3. `chromium`;
4. `chromium-browser`;
5. `google-chrome`;
6. `google-chrome-stable`.

Exemplo de execução com motor explícito:

```bash
JPN_PDF_ENGINE=weasyprint npm run export:editorial-pdfs
```

O motor usado e sua versão ficam registrados no manifesto da rodada.

## Saída

A geração local cria:

```text
dist/editorial-pdf-candidates/
├── Metodo_JPN_v1.pdf
├── JPN_Prompt_Pack_v1.pdf
├── JPN_Business_v1.pdf
├── JPN_Gestao_Facil_Manual_v0.1.pdf
├── JPN_Pro_Kit_Leia_Primeiro_v1.pdf
└── CANDIDATE_MANIFEST.json
```

O manifesto registra para cada candidato:

- fonte HTML usada;
- caminho de saída;
- tamanho em bytes;
- SHA-256 da rodada;
- número de páginas quando `pdfinfo` estiver disponível;
- tamanho de página quando `pdfinfo` estiver disponível;
- estado `pdf-candidate-generated-visual-review-pending`.

## Regra de estado

A existência do PDF **não fecha** o gate `final-pdfs`.

Estados permitidos nesta etapa:

- fonte Markdown: `draft editorial consolidado`;
- HTML: `print-html-generated-pdf-review-pending`;
- PDF recém-exportado: `pdf-candidate-generated-visual-review-pending`;
- PDF revisado e corrigido: ainda candidato até a rodada de congelamento;
- PDF final: somente depois da última correção, revisão registrada e hash definitivo.

O SHA-256 produzido por `CANDIDATE_MANIFEST.json` é evidência técnica da rodada, não hash de release.

## QA obrigatório por documento

Após gerar os PDFs:

1. renderizar todas as páginas em imagens;
2. verificar capa;
3. verificar se nenhum título foi cortado;
4. verificar tabelas e blocos de código;
5. verificar listas, blockquotes e links longos;
6. procurar páginas vazias inesperadas;
7. confirmar que textos não se sobrepõem;
8. confirmar que caracteres acentuados aparecem corretamente;
9. conferir ordem e completude das seções contra a fonte canônica;
10. registrar qualquer correção necessária antes de gerar nova rodada.

Para textos extensos, revisar também mudanças de página próximas a headings e blocos de código.

## Critérios para reprovar um candidato

Reprovar e regenerar quando houver qualquer um dos seguintes problemas:

- clipping;
- texto ilegível;
- glyph quebrado ou quadrado preto;
- página A4 deformada;
- conteúdo ausente;
- heading isolado de forma que prejudique leitura;
- tabela cortada de forma inutilizável;
- código ou URL ultrapassando a área útil;
- capa com proporção ou escala incorreta;
- claim ou estado de produto diferente da fonte canônica.

## Promoção para final

Somente após todos os cinco candidatos passarem pela inspeção:

1. aplicar correções nas fontes ou no gerador;
2. exportar novamente;
3. repetir inspeção nas páginas afetadas e regressão nas demais;
4. congelar os binários aprovados;
5. calcular novos SHA-256;
6. atualizar o manifesto do Pro Kit com os hashes definitivos;
7. executar os gates técnicos e CI do head candidato a release.

Nenhuma etapa deste documento autoriza publicação, venda, anúncio, checkout ou alteração de condição comercial.
