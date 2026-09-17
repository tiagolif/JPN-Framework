# Handoff de revisão humana — artes comerciais JPN

> **CANDIDATO INTERNO · NÃO PUBLICAR**  
> `release_ready=false` · `publication_authorized=false`

Este documento operacionaliza o `REVIEW_PROTOCOL.md` sem declarar aprovação automática. Deve ser preenchido somente por uma pessoa que realmente tenha inspecionado as peças renderizadas. Uma aprovação vale exclusivamente para o SHA-256 da fonte revisada.

## Como usar

1. Confirmar que o CI está verde e abrir a galeria offline `index.html`.
2. Conferir o SHA-256 atual de cada peça em `review-manifest.json`.
3. Inspecionar visão geral, 100% e miniatura; para JPN-CR-07 testar também viewport vertical estreito e para JPN-CR-08 leitura 16:9.
4. Marcar cada critério como `PASS`, `FAIL` ou `N/A` e registrar observações concretas.
5. Não alterar `release_ready` ou `publication_authorized` neste documento. Aprovação visual não equivale a autorização de publicação.

## Registro por peça

| ID | SHA-256 revisado | Hierarquia | Legibilidade | Consistência | Produto | Jornada | Claims | Marca | Segurança | Decisão |
|---|---|---|---|---|---|---|---|---|---|---|
| JPN-CR-01 | PREENCHER_DO_MANIFESTO | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN |
| JPN-CR-02 | PREENCHER_DO_MANIFESTO | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN |
| JPN-CR-03 | PREENCHER_DO_MANIFESTO | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN |
| JPN-CR-04 | PREENCHER_DO_MANIFESTO | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN |
| JPN-CR-05 | PREENCHER_DO_MANIFESTO | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN |
| JPN-CR-06 | PREENCHER_DO_MANIFESTO | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN |
| JPN-CR-07 | PREENCHER_DO_MANIFESTO | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN |
| JPN-CR-08 | PREENCHER_DO_MANIFESTO | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN | PENDING_HUMAN |

## Ambiente da inspeção

- Data: `PENDING_HUMAN`
- Revisor: `PENDING_HUMAN`
- Sistema operacional: `PENDING_HUMAN`
- Navegador/renderizador e versão: `PENDING_HUMAN`
- Escala/zoom: `PENDING_HUMAN`
- Viewports adicionais usados: `PENDING_HUMAN`

## Observações e correções

Registrar por ID apenas problemas observáveis e ações objetivas. Exemplo de formato: `JPN-CR-03 — FAIL Legibilidade — subtítulo perde leitura em miniatura; aumentar contraste/tamanho e repetir inspeção.`

- JPN-CR-01: `PENDING_HUMAN`
- JPN-CR-02: `PENDING_HUMAN`
- JPN-CR-03: `PENDING_HUMAN`
- JPN-CR-04: `PENDING_HUMAN`
- JPN-CR-05: `PENDING_HUMAN`
- JPN-CR-06: `PENDING_HUMAN`
- JPN-CR-07: `PENDING_HUMAN`
- JPN-CR-08: `PENDING_HUMAN`

## Regra de validade

Se qualquer SVG for alterado depois da inspeção, comparar novamente seu SHA-256 com `review-manifest.json`. Hash diferente invalida a decisão anterior daquela peça e exige nova revisão. Qualquer `FAIL` mantém a peça em `PENDING_HUMAN`.

A conclusão deste handoff não promove automaticamente nenhum produto para release, não autoriza publicação e não substitui os QAs físicos/contextuais restantes do ecossistema JPN.
