# JPN Business — Pipeline do PDF candidato v1

## Objetivo

Garantir que o PDF candidato do JPN Business seja sempre exportado a partir da composição específica do produto, e não do staging editorial genérico.

## Problema evitado

O repositório possui um staging editorial comum para os produtos JPN e, sobre ele, uma composição específica do JPN Business que adiciona hierarquia própria dos 12 playbooks e referências visuais aos prompts `PP-*` relacionados.

Uma execução isolada de `npm run export:editorial-pdfs` poderia reutilizar um staging genérico já existente e gerar `JPN_Business_v1.pdf` sem reconstruir essa composição específica. O exportador agora prepara explicitamente o candidato do Business antes da conversão para PDF.

## Fluxo

1. confirma ou gera o staging editorial comum;
2. executa `scripts/build-jpn-business-print-candidate.mjs`;
3. valida o `candidate-manifest.json` do Business;
4. exige `visual_qa: pending`, `pdf_export: pending` e `publication_authorized: false` antes da exportação;
5. exporta os PDFs candidatos usando o motor local disponível;
6. registra no manifesto geral do PDF a versão da composição do Business, hashes da fonte e do índice e quantidade de playbooks;
7. atualiza o manifesto local do Business com caminho, hash, tamanho, páginas, page size e motor do PDF candidato;
8. mantém `visual_qa: pending` e `publication_authorized: false`.

## Estados

Gerar o PDF candidato muda somente o estado local de exportação para `candidate-generated`.

Isso **não** aprova:

- revisão editorial humana;
- inspeção visual página a página;
- fontes incorporadas;
- links;
- compatibilidade entre motores;
- PDF final;
- publicação ou venda.

O arquivo deve continuar tratado como candidato interno até a execução e registro do checklist de QA visual.

## Comando

```bash
npm run export:editorial-pdfs
```

O comando exige um motor local compatível, como WeasyPrint ou Chromium/Chrome. A ausência de motor é um bloqueio técnico explícito e não deve ser mascarada como aprovação.

## Rastreabilidade

O manifesto do candidato do Business passa a registrar os metadados do PDF efetivamente gerado. O manifesto geral em `dist/editorial-pdf-candidates/CANDIDATE_MANIFEST.json` também registra a composição que originou o PDF do Business.

Assim, a revisão visual pode verificar que o arquivo inspecionado corresponde à mesma fonte e ao mesmo índice que produziram o candidato composto.

## Guardrails

- candidatos não são artefatos finais;
- hash de candidato não é hash de release;
- nenhuma publicação é autorizada automaticamente;
- nenhuma dependência de release deve virar `passed` apenas porque um PDF foi gerado.
