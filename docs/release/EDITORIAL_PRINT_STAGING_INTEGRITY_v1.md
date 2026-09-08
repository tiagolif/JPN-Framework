# Integridade do staging editorial imprimível — v1

## Objetivo

Este gate protege a camada intermediária entre as fontes editoriais canônicas e os candidatos HTML usados para exportação/revisão de PDF.

Ele não aprova PDF final, revisão visual, publicação ou release. Seu papel é apenas detectar divergências estruturais e regressões no staging antes dessas etapas humanas.

## Escopo canônico

O gate cobre exatamente cinco documentos:

1. Método JPN v1;
2. JPN Prompt Pack v1;
3. JPN Business v1;
4. JPN Gestão Fácil — Manual v0.1;
5. JPN Pro Kit — Leia Primeiro v1.

Para cada item, o contrato fixa `id`, título, versão, fonte Markdown, capa SVG e caminho esperado do HTML de staging.

## Comando

```bash
npm run build:editorial-print
npm run check:editorial-print-staging
```

O `npm run build` executa o gate imediatamente após gerar o staging editorial.

## O que é validado

- `dist/editorial-print-staging/manifest.json` existe;
- o manifesto mantém `status: internal-print-staging`;
- existem exatamente cinco entradas, na ordem canônica;
- títulos, versões, fontes, capas e outputs coincidem com o contrato;
- cada item mantém `print-html-generated-pdf-review-pending`;
- cada HTML existe e possui tamanho mínimo plausível;
- o `<title>`, a referência à fonte e os avisos de staging interno permanecem presentes;
- linguagem transacional proibida não aparece no candidato;
- o índice geral referencia todos os cinco documentos e mantém o aviso de que não é pacote publicado;
- SHA-256 da fonte, capa e HTML é calculado em memória;
- um `source_state_digest` determinístico é produzido para facilitar comparação entre execuções.

## O que o digest significa

O `source_state_digest` identifica o estado conjunto das cinco fontes, cinco capas e cinco HTMLs renderizados para aquela execução. Ele serve para detectar mudança de estado; não é hash de release e não deve ser promovido a manifesto final.

## O que este gate não comprova

Este preflight não valida:

- quebras de página no PDF;
- margens reais do motor de impressão;
- tipografia final em todos os ambientes;
- legibilidade visual;
- links clicáveis no PDF exportado;
- número de páginas;
- ausência de órfãs/viúvas após renderização real;
- consistência entre Chrome/Chromium e outros motores;
- revisão editorial humana;
- aprovação comercial;
- autorização de publicação.

Esses pontos continuam dependendo das etapas específicas de exportação e QA visual.

## Regra de promoção

Passar neste gate significa apenas: **o staging HTML corresponde ao contrato editorial estrutural atual**.

Não significa `pdf_final = true`, `release_ready = true` nem `publication_authorized = true`.
